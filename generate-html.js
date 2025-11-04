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
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=JetBrains+Mono&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            line-height: 1.7;
            color: #1e293b;
            max-width: 900px;
            margin: 0 auto;
            padding: 60px 40px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        
        .container {
            background: white;
            padding: 60px;
            border-radius: 16px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        
        .cover-page {
            text-align: center;
            padding: 100px 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 16px;
            margin-bottom: 60px;
        }
        
        .cover-title {
            font-size: 3.5em;
            font-weight: 700;
            margin-bottom: 20px;
            text-shadow: 0 4px 20px rgba(0,0,0,0.3);
        }
        
        .cover-subtitle {
            font-size: 1.8em;
            margin-bottom: 40px;
            opacity: 0.95;
        }
        
        .cover-info {
            font-size: 1.1em;
            margin: 10px 0;
            opacity: 0.9;
        }
        
        h1 {
            color: #6366f1;
            font-size: 2.5em;
            font-weight: 700;
            margin: 50px 0 25px 0;
            padding-bottom: 15px;
            border-bottom: 3px solid #6366f1;
        }
        
        h2 {
            color: #4f46e5;
            font-size: 2em;
            font-weight: 600;
            margin: 40px 0 20px 0;
            padding-top: 20px;
        }
        
        h3 {
            color: #4338ca;
            font-size: 1.5em;
            font-weight: 600;
            margin: 30px 0 15px 0;
        }
        
        h4 {
            color: #3730a3;
            font-size: 1.2em;
            font-weight: 600;
            margin: 20px 0 10px 0;
        }
        
        p {
            margin: 15px 0;
            line-height: 1.8;
            color: #475569;
        }
        
        ul, ol {
            margin: 15px 0 15px 30px;
            color: #475569;
        }
        
        li {
            margin: 8px 0;
            line-height: 1.7;
        }
        
        code {
            background: #f1f5f9;
            padding: 3px 8px;
            border-radius: 4px;
            font-family: 'JetBrains Mono', 'Courier New', monospace;
            font-size: 0.9em;
            color: #dc2626;
            border: 1px solid #e2e8f0;
        }
        
        pre {
            background: #1e293b;
            color: #e2e8f0;
            padding: 20px;
            border-radius: 8px;
            overflow-x: auto;
            margin: 20px 0;
            border: 1px solid #334155;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        
        pre code {
            background: none;
            color: inherit;
            padding: 0;
            border: none;
            font-size: 0.95em;
        }
        
        blockquote {
            border-left: 4px solid #6366f1;
            padding-left: 24px;
            margin: 20px 0;
            color: #64748b;
            font-style: italic;
            background: #f8fafc;
            padding: 15px 15px 15px 24px;
            border-radius: 4px;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 25px 0;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        th, td {
            border: 1px solid #e2e8f0;
            padding: 15px;
            text-align: left;
        }
        
        th {
            background: #6366f1;
            color: white;
            font-weight: 600;
            text-transform: uppercase;
            font-size: 0.9em;
            letter-spacing: 0.5px;
        }
        
        tr:nth-child(even) {
            background: #f8fafc;
        }
        
        tr:hover {
            background: #f1f5f9;
        }
        
        a {
            color: #6366f1;
            text-decoration: none;
            border-bottom: 1px solid transparent;
            transition: all 0.2s;
        }
        
        a:hover {
            border-bottom-color: #6366f1;
        }
        
        .success-box {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            padding: 20px;
            margin: 20px 0;
            border-radius: 8px;
            font-weight: 600;
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }
        
        .warning-box {
            background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
            color: white;
            padding: 20px;
            margin: 20px 0;
            border-radius: 8px;
            font-weight: 600;
            box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
        }
        
        .info-box {
            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
            color: white;
            padding: 20px;
            margin: 20px 0;
            border-radius: 8px;
            font-weight: 600;
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }
        
        hr {
            border: none;
            border-top: 2px solid #e2e8f0;
            margin: 40px 0;
        }
        
        .toc {
            background: #f8fafc;
            padding: 30px;
            border-radius: 8px;
            margin: 30px 0;
            border-left: 4px solid #6366f1;
        }
        
        .toc h2 {
            margin-top: 0;
        }
        
        .print-button {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #6366f1;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
            z-index: 1000;
            border: none;
            font-size: 16px;
            font-weight: 600;
            transition: all 0.3s;
        }
        
        .print-button:hover {
            background: #4f46e5;
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(99, 102, 241, 0.5);
        }
        
        @media print {
            body {
                background: white;
                padding: 0;
            }
            
            .container {
                box-shadow: none;
                padding: 20px;
            }
            
            .print-button {
                display: none;
            }
            
            pre, blockquote, table {
                page-break-inside: avoid;
            }
            
            h1, h2, h3, h4 {
                page-break-after: avoid;
            }
        }
        
        @media (max-width: 768px) {
            body {
                padding: 20px;
            }
            
            .container {
                padding: 30px 20px;
            }
            
            .cover-title {
                font-size: 2em;
            }
            
            .cover-subtitle {
                font-size: 1.2em;
            }
            
            h1 {
                font-size: 2em;
            }
            
            h2 {
                font-size: 1.6em;
            }
        }
    </style>
</head>
<body>
    <button class="print-button" onclick="window.print()">🖨️ Print to PDF</button>
    
    <div class="container">
        <div class="cover-page">
            <div class="cover-title">🎓 AI Slides Platform</div>
            <div class="cover-subtitle">Complete Beginner's Guide</div>
            <div class="cover-info">From Zero to Running Application on Your Laptop</div>
            <div class="cover-info">Version 1.0 | November 2024</div>
            <div class="cover-info" style="margin-top: 40px;">
                <strong>GitHub Repository:</strong><br>
                <a href="https://github.com/awais-webs67/AI-Slide-Generation-SaaS-Platform-Development" 
                   style="color: white; border-bottom: 1px solid white;">
                    github.com/awais-webs67/AI-Slide-Generation-SaaS-Platform-Development
                </a>
            </div>
        </div>
        
        ${htmlContent}
        
        <hr>
        
        <div style="text-align: center; margin-top: 60px; padding: 40px; background: #f8fafc; border-radius: 8px;">
            <h2 style="color: #6366f1; margin-bottom: 15px;">📚 End of Guide</h2>
            <p style="font-size: 1.1em; color: #64748b;">
                For updates, support, and community discussions,<br>
                visit the GitHub repository
            </p>
            <p style="font-size: 2em; margin-top: 20px;">🚀 Happy Coding!</p>
        </div>
    </div>
    
    <script>
        // Enhance checkboxes
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.style.width = '18px';
            checkbox.style.height = '18px';
            checkbox.style.cursor = 'pointer';
        });
        
        // Add copy buttons to code blocks
        document.querySelectorAll('pre').forEach(pre => {
            const button = document.createElement('button');
            button.textContent = '📋 Copy';
            button.style.cssText = 'position: absolute; right: 10px; top: 10px; padding: 5px 10px; background: #6366f1; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;';
            pre.style.position = 'relative';
            button.onclick = () => {
                const code = pre.querySelector('code') || pre;
                navigator.clipboard.writeText(code.textContent);
                button.textContent = '✅ Copied!';
                setTimeout(() => button.textContent = '📋 Copy', 2000);
            };
            pre.appendChild(button);
        });
    </script>
</body>
</html>
`;

// Write HTML file
fs.writeFileSync(
    path.join(__dirname, 'AI-Slides-Platform-Complete-Beginner-Guide.html'),
    fullHtml,
    'utf-8'
);

console.log('✅ HTML file generated successfully!');
console.log('📄 File: AI-Slides-Platform-Complete-Beginner-Guide.html');
console.log('');
console.log('📝 To convert to PDF:');
console.log('   1. Open the HTML file in Chrome/Edge browser');
console.log('   2. Click the "Print to PDF" button (or Press Ctrl+P / Cmd+P)');
console.log('   3. Select "Save as PDF" as the printer');
console.log('   4. Click "Save"');
console.log('');
console.log('💡 The PDF will be professional quality with all styling preserved!');
