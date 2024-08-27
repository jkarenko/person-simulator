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
            body { background: white; margin: 0; padding: 20px; }
            pre { margin: 0; }
            code { font-family: 'Courier New', Courier, monospace; font-size: 14px; }
            ${await fs.readFile(require.resolve('highlight.js/styles/github.css'), 'utf-8')}
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
