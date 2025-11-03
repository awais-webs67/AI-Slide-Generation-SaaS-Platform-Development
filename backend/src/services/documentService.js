const fs = require('fs').promises;
const path = require('path');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const logger = require('../utils/logger');

class DocumentService {
  // Extract text from PDF file
  async extractTextFromPDF(filePath) {
    try {
      const dataBuffer = await fs.readFile(filePath);
      const data = await pdfParse(dataBuffer);
      
      logger.info(`Extracted ${data.text.length} characters from PDF`);
      
      return {
        text: data.text,
        pages: data.numpages,
        metadata: data.info,
      };
    } catch (error) {
      logger.error(`PDF extraction error: ${error.message}`);
      throw new Error(`Failed to extract text from PDF: ${error.message}`);
    }
  }

  // Extract text from DOCX file
  async extractTextFromDOCX(filePath) {
    try {
      const result = await mammoth.extractRawText({ path: filePath });
      
      logger.info(`Extracted ${result.value.length} characters from DOCX`);
      
      return {
        text: result.value,
        warnings: result.messages,
      };
    } catch (error) {
      logger.error(`DOCX extraction error: ${error.message}`);
      throw new Error(`Failed to extract text from DOCX: ${error.message}`);
    }
  }

  // Extract text from TXT file
  async extractTextFromTXT(filePath) {
    try {
      const text = await fs.readFile(filePath, 'utf-8');
      
      logger.info(`Extracted ${text.length} characters from TXT`);
      
      return {
        text: text,
      };
    } catch (error) {
      logger.error(`TXT extraction error: ${error.message}`);
      throw new Error(`Failed to read text file: ${error.message}`);
    }
  }

  // Main extraction method - detects file type and extracts accordingly
  async extractText(filePath, mimeType) {
    try {
      let extractedData;

      switch (mimeType) {
        case 'application/pdf':
          extractedData = await this.extractTextFromPDF(filePath);
          break;

        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        case 'application/msword':
          extractedData = await this.extractTextFromDOCX(filePath);
          break;

        case 'text/plain':
          extractedData = await this.extractTextFromTXT(filePath);
          break;

        default:
          throw new Error(`Unsupported file type: ${mimeType}`);
      }

      // Clean and normalize text
      const cleanedText = this.cleanText(extractedData.text);

      return {
        text: cleanedText,
        originalLength: extractedData.text.length,
        cleanedLength: cleanedText.length,
        metadata: extractedData.metadata || {},
        warnings: extractedData.warnings || [],
      };
    } catch (error) {
      logger.error(`Document extraction error: ${error.message}`);
      throw error;
    }
  }

  // Clean and normalize extracted text
  cleanText(text) {
    if (!text) return '';

    return text
      // Remove excessive whitespace
      .replace(/\s+/g, ' ')
      // Remove special characters but keep punctuation
      .replace(/[^\w\s.,!?;:()\-'"/]/g, '')
      // Fix multiple punctuation
      .replace(/([.,!?;:])\1+/g, '$1')
      // Trim
      .trim();
  }

  // Analyze document structure
  async analyzeDocument(text) {
    try {
      const analysis = {
        wordCount: text.split(/\s+/).length,
        characterCount: text.length,
        estimatedReadingTime: Math.ceil(text.split(/\s+/).length / 200), // minutes
        suggestedSlideCount: Math.max(5, Math.min(50, Math.ceil(text.split(/\s+/).length / 150))),
        hasSections: /\n\n/.test(text),
        hasLists: /[-*•]/.test(text),
        hasNumbers: /\d+/.test(text),
      };

      // Detect potential sections
      const sections = text.split(/\n\n+/).filter(s => s.trim().length > 50);
      analysis.sectionCount = sections.length;

      logger.info(`Document analysis complete: ${analysis.wordCount} words, ${analysis.suggestedSlideCount} suggested slides`);

      return analysis;
    } catch (error) {
      logger.error(`Document analysis error: ${error.message}`);
      throw error;
    }
  }

  // Delete uploaded file
  async deleteFile(filePath) {
    try {
      await fs.unlink(filePath);
      logger.info(`Deleted file: ${filePath}`);
    } catch (error) {
      logger.error(`File deletion error: ${error.message}`);
      // Don't throw - file might already be deleted
    }
  }

  // Get file info
  async getFileInfo(filePath) {
    try {
      const stats = await fs.stat(filePath);
      return {
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime,
      };
    } catch (error) {
      logger.error(`File info error: ${error.message}`);
      throw error;
    }
  }

  // Validate file size and type
  validateFile(file, maxSizeMB = 500) {
    const allowedMimeTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'text/plain',
    ];

    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new Error('Invalid file type. Only PDF, DOCX, DOC, and TXT files are allowed.');
    }

    if (file.size > maxSizeBytes) {
      throw new Error(`File size exceeds ${maxSizeMB}MB limit.`);
    }

    return true;
  }
}

module.exports = new DocumentService();
