const fs = require('fs').promises;
const hljs = require('highlight.js');
const puppeteer = require('puppeteer');

async function convertJsFileToImage(inputFilePath, outputImagePath) {
  try {
    // Read the JS file
    const code = await fs.readFile(inputFilePath, 'utf-8');

    // Highlight the code
    const highlightedCode = hljs.highlight(code, { language: 'javascript' }).value;

    // Create HTML with highlighted code
    const html = `
      <html>
        <head>
          <style>
            body { 
              background: #282a36; 
              margin: 0; 
              padding: 20px; 
            }
            pre { 
              margin: 0; 
              background: #282a36; 
            }
            code { 
              font-family: 'Fira Code', 'Courier New', Courier, monospace; 
              font-size: 14px; 
            }
            /* Dracula Theme v1.2.5
             *
             * https://github.com/dracula/highlightjs
             *
             * Copyright 2016-present, All rights reserved
             *
             * Code licensed under the MIT license
             *
             * @author Denis Ciccale <dciccale@gmail.com>
             * @author Zeno Rocha <hi@zenorocha.com>
             */

            .hljs {
              display: block;
              overflow-x: auto;
              padding: 0.5em;
              background: #282a36;
            }

            .hljs-built_in,
            .hljs-selector-tag,
            .hljs-section,
            .hljs-link {
              color: #8be9fd;
            }

            .hljs-keyword {
              color: #ff79c6;
            }

            .hljs,
            .hljs-subst {
              color: #f8f8f2;
            }

            .hljs-title,
            .hljs-attr,
            .hljs-meta-keyword {
              font-style: italic;
              color: #50fa7b;
            }

            .hljs-string,
            .hljs-meta,
            .hljs-name,
            .hljs-type,
            .hljs-symbol,
            .hljs-bullet,
            .hljs-addition,
            .hljs-variable,
            .hljs-template-tag,
            .hljs-template-variable {
              color: #f1fa8c;
            }

            .hljs-comment,
            .hljs-quote,
            .hljs-deletion {
              color: #6272a4;
            }

            .hljs-keyword,
            .hljs-selector-tag,
            .hljs-literal,
            .hljs-title,
            .hljs-section,
            .hljs-doctag,
            .hljs-type,
            .hljs-name,
            .hljs-strong {
              font-weight: bold;
            }

            .hljs-literal,
            .hljs-number {
              color: #bd93f9;
            }

            .hljs-emphasis {
              font-style: italic;
            }
          </style>
        </head>
        <body>
          <pre><code class="hljs javascript">${highlightedCode}</code></pre>
        </body>
      </html>
    `;

    // Launch a headless browser
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Set the content and wait for it to load
    await page.setContent(html);
    await page.evaluateHandle('document.fonts.ready');

    // Set the viewport size to match the content
    const bodyHandle = await page.$('body');
    const { width, height } = await bodyHandle.boundingBox();
    await bodyHandle.dispose();

    await page.setViewport({ width: Math.ceil(width), height: Math.ceil(height) });

    // Take a screenshot
    await page.screenshot({ path: outputImagePath, fullPage: true });

    // Close the browser
    await browser.close();

    console.log(`Image saved to ${outputImagePath}`);
  } catch (error) {
    console.error('Error converting JS file to image:', error);
  }
}

// Check if file paths are provided as command line arguments
if (process.argv.length < 4) {
  console.log('Usage: node script.js <input_js_file> <output_image_file>');
  process.exit(1);
}

const inputFilePath = process.argv[2];
const outputImagePath = process.argv[3];

// Run the conversion
convertJsFileToImage(inputFilePath, outputImagePath);
