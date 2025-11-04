const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

// Read the markdown file
const markdown = fs.readFileSync(path.join(__dirname, 'BEGINNER_COMPLETE_GUIDE.md'), 'utf-8');

// Convert markdown to HTML
const htmlContent = marked.parse(markdown);

// Create full HTML document with styling
const fullHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Complete Beginner's Guide - AI Slides Platform</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
            background: #fff;
        }
        
        h1 {
            color: #2563eb;
            font-size: 2.5em;
            margin: 30px 0 20px 0;
            padding-bottom: 10px;
            border-bottom: 3px solid #2563eb;
            page-break-after: avoid;
        }
        
        h2 {
            color: #1e40af;
            font-size: 2em;
            margin: 25px 0 15px 0;
            padding-top: 20px;
            page-break-after: avoid;
        }
        
        h3 {
            color: #1e3a8a;
            font-size: 1.5em;
            margin: 20px 0 10px 0;
            page-break-after: avoid;
        }
        
        h4 {
            color: #1e293b;
            font-size: 1.2em;
            margin: 15px 0 10px 0;
            page-break-after: avoid;
        }
        
        p {
            margin: 10px 0;
            text-align: justify;
        }
        
        ul, ol {
            margin: 10px 0 10px 30px;
        }
        
        li {
            margin: 5px 0;
        }
        
        code {
            background: #f1f5f9;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
            font-size: 0.9em;
            color: #dc2626;
        }
        
        pre {
            background: #1e293b;
            color: #e2e8f0;
            padding: 15px;
            border-radius: 5px;
            overflow-x: auto;
            margin: 15px 0;
            page-break-inside: avoid;
        }
        
        pre code {
            background: none;
            color: inherit;
            padding: 0;
        }
        
        blockquote {
            border-left: 4px solid #3b82f6;
            padding-left: 20px;
            margin: 15px 0;
            color: #64748b;
            font-style: italic;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            page-break-inside: avoid;
        }
        
        th, td {
            border: 1px solid #cbd5e1;
            padding: 12px;
            text-align: left;
        }
        
        th {
            background: #3b82f6;
            color: white;
            font-weight: bold;
        }
        
        tr:nth-child(even) {
            background: #f8fafc;
        }
        
        a {
            color: #2563eb;
            text-decoration: none;
        }
        
        a:hover {
            text-decoration: underline;
        }
        
        .emoji {
            font-size: 1.2em;
        }
        
        .note {
            background: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 15px;
            margin: 15px 0;
            border-radius: 4px;
        }
        
        .success {
            background: #d1fae5;
            border-left: 4px solid #10b981;
            padding: 15px;
            margin: 15px 0;
            border-radius: 4px;
        }
        
        .warning {
            background: #fee2e2;
            border-left: 4px solid #ef4444;
            padding: 15px;
            margin: 15px 0;
            border-radius: 4px;
        }
        
        .page-break {
            page-break-after: always;
        }
        
        .cover-page {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100vh;
            text-align: center;
            page-break-after: always;
        }
        
        .cover-title {
            font-size: 3.5em;
            color: #1e40af;
            margin-bottom: 20px;
        }
        
        .cover-subtitle {
            font-size: 1.8em;
            color: #64748b;
            margin-bottom: 40px;
        }
        
        .cover-info {
            font-size: 1.2em;
            color: #475569;
            margin: 10px 0;
        }
        
        @media print {
            body {
                padding: 20px;
            }
            
            pre, blockquote, table {
                page-break-inside: avoid;
            }
            
            h1, h2, h3, h4 {
                page-break-after: avoid;
            }
        }
    </style>
</head>
<body>
    <div class="cover-page">
        <div class="cover-title">🎓 AI Slides Platform</div>
        <div class="cover-subtitle">Complete Beginner's Guide</div>
        <div class="cover-info">From Zero to Running Application</div>
        <div class="cover-info">Version 1.0 | November 2024</div>
        <div class="cover-info" style="margin-top: 40px;">
            <strong>Repository:</strong><br>
            github.com/awais-webs67/AI-Slide-Generation-SaaS-Platform-Development
        </div>
    </div>
    
    ${htmlContent}
    
    <div class="page-break"></div>
    
    <div style="text-align: center; margin-top: 100px; color: #64748b;">
        <p><strong>End of Guide</strong></p>
        <p>For updates and support, visit the GitHub repository</p>
        <p>Happy Coding! 🚀</p>
    </div>
</body>
</html>
`;

// Generate PDF
async function generatePDF() {
    console.log('Starting PDF generation...');
    
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Set content
    await page.setContent(fullHtml, {
        waitUntil: 'networkidle0'
    });
    
    // Generate PDF
    await page.pdf({
        path: path.join(__dirname, 'AI-Slides-Platform-Complete-Beginner-Guide.pdf'),
        format: 'A4',
        printBackground: true,
        margin: {
            top: '20mm',
            right: '15mm',
            bottom: '20mm',
            left: '15mm'
        },
        displayHeaderFooter: true,
        headerTemplate: '<div></div>',
        footerTemplate: `
            <div style="font-size: 10px; text-align: center; width: 100%; color: #64748b; padding: 10px;">
                <span>AI Slides Platform - Complete Beginner's Guide | Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
            </div>
        `
    });
    
    await browser.close();
    
    console.log('✅ PDF generated successfully!');
    console.log('📄 File: AI-Slides-Platform-Complete-Beginner-Guide.pdf');
}

generatePDF().catch(err => {
    console.error('Error generating PDF:', err);
    process.exit(1);
});
