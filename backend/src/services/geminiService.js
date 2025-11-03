const { GoogleGenerativeAI } = require('@google/generative-ai');
const logger = require('../utils/logger');

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

class GeminiService {
  constructor() {
    this.model = genAI.getGenerativeModel({ 
      model: process.env.GEMINI_MODEL || 'gemini-pro' 
    });
  }

  // Generate presentation outline from document text
  async generateOutlineFromDocument(documentText, slideCount = 10) {
    try {
      const prompt = `You are an expert presentation designer. Analyze the following document and create a structured presentation outline with exactly ${slideCount} slides.

Document Content:
${documentText.substring(0, 8000)}

Generate a JSON response with the following structure:
{
  "title": "Presentation Title",
  "slides": [
    {
      "slideNumber": 1,
      "title": "Slide Title",
      "mainPoints": ["Point 1", "Point 2", "Point 3"],
      "suggestedVisuals": "Description of suggested visuals",
      "contentType": "title|content|image|chart|list",
      "notes": "Speaker notes or additional context"
    }
  ]
}

Requirements:
- Create exactly ${slideCount} slides
- First slide should be a title slide
- Last slide should be a conclusion or summary
- Use clear, concise titles
- Provide 2-4 main points per slide
- Suggest appropriate visuals for each slide
- Maintain logical flow and structure

Return only valid JSON, no additional text.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Failed to extract JSON from AI response');
      }

      const outline = JSON.parse(jsonMatch[0]);
      
      logger.info(`Generated outline with ${outline.slides.length} slides`);
      return outline;
    } catch (error) {
      logger.error(`Gemini outline generation error: ${error.message}`);
      throw new Error(`Failed to generate outline: ${error.message}`);
    }
  }

  // Generate presentation outline from prompt
  async generateOutlineFromPrompt(userPrompt, slideCount = 10) {
    try {
      const prompt = `You are an expert presentation designer. Create a comprehensive presentation outline based on the following request:

User Request: ${userPrompt}

Generate a JSON response with exactly ${slideCount} slides following this structure:
{
  "title": "Presentation Title",
  "slides": [
    {
      "slideNumber": 1,
      "title": "Slide Title",
      "mainPoints": ["Point 1", "Point 2", "Point 3"],
      "suggestedVisuals": "Description of suggested visuals",
      "contentType": "title|content|image|chart|list",
      "notes": "Speaker notes or additional context"
    }
  ]
}

Requirements:
- Create exactly ${slideCount} slides
- Research and include accurate, current information
- First slide should be a title slide
- Include introduction, main content, and conclusion
- Use engaging titles and clear structure
- Suggest appropriate visuals
- Provide comprehensive speaker notes

Return only valid JSON, no additional text.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Failed to extract JSON from AI response');
      }

      const outline = JSON.parse(jsonMatch[0]);
      
      logger.info(`Generated outline from prompt with ${outline.slides.length} slides`);
      return outline;
    } catch (error) {
      logger.error(`Gemini prompt outline error: ${error.message}`);
      throw new Error(`Failed to generate outline: ${error.message}`);
    }
  }

  // Generate sketch for a slide
  async generateSlideSketch(slideData, theme) {
    try {
      const prompt = `You are a slide design expert. Create a detailed design sketch for the following slide:

Slide Information:
- Number: ${slideData.slideNumber}
- Title: ${slideData.title}
- Main Points: ${JSON.stringify(slideData.mainPoints)}
- Content Type: ${slideData.contentType}
- Suggested Visuals: ${slideData.suggestedVisuals}

Theme:
- Primary Color: ${theme.primaryColor}
- Secondary Color: ${theme.secondaryColor}
- Font: ${theme.fontFamily}

Generate a JSON response with this structure:
{
  "layout": "single-column|two-column|title-only|full-image|chart",
  "description": "Detailed description of the slide design",
  "visualElements": ["element1", "element2"],
  "colorScheme": "Description of how colors are used",
  "designNotes": "Additional design considerations"
}

Return only valid JSON, no additional text.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Failed to extract JSON from AI response');
      }

      const sketch = JSON.parse(jsonMatch[0]);
      
      return sketch;
    } catch (error) {
      logger.error(`Gemini sketch generation error: ${error.message}`);
      throw error;
    }
  }

  // Generate HTML/CSS code for slide
  async generateSlideCode(slideData, sketch, theme) {
    try {
      const prompt = `Generate clean, modern HTML and CSS code for a presentation slide.

Slide Information:
- Title: ${slideData.title}
- Points: ${JSON.stringify(slideData.mainPoints)}
- Type: ${slideData.contentType}

Design Sketch:
${JSON.stringify(sketch)}

Theme:
- Primary: ${theme.primaryColor}
- Secondary: ${theme.secondaryColor}
- Font: ${theme.fontFamily}

Requirements:
- Use modern CSS (flexbox/grid)
- Make it responsive
- Include subtle animations
- Professional design
- Clean, semantic HTML

Generate JSON with this structure:
{
  "html": "<div class='slide'>...</div>",
  "css": ".slide { ... }"
}

Return only valid JSON.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Failed to extract JSON from AI response');
      }

      const code = JSON.parse(jsonMatch[0]);
      
      return code;
    } catch (error) {
      logger.error(`Gemini code generation error: ${error.message}`);
      throw error;
    }
  }

  // Customize existing slide based on user feedback
  async customizeSlide(currentSlideData, customizationPrompt, theme) {
    try {
      const prompt = `You are a slide customization expert. Modify the following slide based on user feedback.

Current Slide:
${JSON.stringify(currentSlideData, null, 2)}

User Feedback: ${customizationPrompt}

Theme:
- Primary: ${theme.primaryColor}
- Secondary: ${theme.secondaryColor}
- Font: ${theme.fontFamily}

Generate updated slide with this JSON structure:
{
  "title": "Updated title",
  "mainPoints": ["Updated points"],
  "sketch": {
    "layout": "layout type",
    "description": "design description",
    "visualElements": ["elements"]
  },
  "code": {
    "html": "<div>...</div>",
    "css": ".slide { ... }"
  }
}

Return only valid JSON.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Failed to extract JSON from AI response');
      }

      const customized = JSON.parse(jsonMatch[0]);
      
      return customized;
    } catch (error) {
      logger.error(`Gemini customization error: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new GeminiService();
