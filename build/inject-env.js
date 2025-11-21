const fs = require('fs');
const path = require('path');

// --- Environment Variable Logic ---
const netlifyContext = process.env.NETLIFY_BUILD === 'true' || 
                       (process.env.CONTEXT && ['production', 'deploy-preview', 'branch-deploy'].includes(process.env.CONTEXT)); 
let baseURL;

// Define the root directory path
const rootDir = path.join(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const indexPath = path.join(rootDir, 'index.html');
const placeholderString = 'CANON_URL_PLACEHOLDER';


// --- Handle Form Injection (Specific to index.html) ---
// We must read the index.html content here to apply both the form and the canonical URL placeholder logic
let htmlContent = fs.readFileSync(indexPath, 'utf-8');

if (netlifyContext) {
    baseURL = 'https://mano-dev.netlify.app'; 
    console.log("Netlify environment detected. Injecting form HTML.");
    const formHTML = `
            <form name="contact" method="POST" data-netlify="true" netlify-honeypot="bot-field" class="contact-form" id="contact-form">
                <input type="hidden" name="form-name" value="contact">
                <input type="hidden" name="bot-field">
                <label for="name">Name</label>
                <input id="name" name="name" type="text" required placeholder="Your name">

                <label for="email">Email</label>
                <input id="email" name="email" type="email" required placeholder="you@example.com">

                <label for="message">Message</label>
                <textarea id="message" name="message" rows="5" required placeholder="Let's connect for collaboration or opportunities!"></textarea>

                <button class="button" type="submit">Send message</button>
                <div id="contact-success" class="contact-success" style="display:none;margin-top:.9rem;color:var(--accent2);font-weight:700">Thanks — your message was sent.</div>
            </form>
          `;
    // Replace the container placeholder with the form HTML in the index.html content
    htmlContent = htmlContent.replace('<div id="contact-form-container"></div>', formHTML);
} else {
    baseURL = 'https://manoaravindhan.github.io'; 
    console.log("Non-Netlify environment detected. Removing form container.");
    // Remove the container entirely or leave it empty in the index.html content
    htmlContent = htmlContent.replace('<div id="contact-form-container"></div>', '');
}
console.log(`Injecting Base URL: ${baseURL}`);


// --- Prepare for File Processing Logic ---

// Handle cleaning the directory using Node.js FS module
if (fs.existsSync(distDir)) {
    console.log('Cleaning up existing dist directory...');
    // Use fs.rmSync with recursive and force options (Node v14.14.0+ recommended)
    fs.rmSync(distDir, { recursive: true, force: true }); 
}

// Create the dist directory if it doesn't exist
fs.mkdirSync(distDir, { recursive: true });


// --- Process All Files and Write to Dist ---

// Since we modified index.html content in memory, we need to handle it slightly differently
(async () => {
    // Dynamically import globby if you are using a newer version and keeping 'require' for fs/path
    const { globby } = await import('globby'); 
    
    // Find all files recursively, ignoring specific folders/files
    const files = await globby(['**/*', '!node_modules/**', '!dist/**', '!build/**', '!package.json', '!package-lock.json', '!.git/**'], { cwd: rootDir });

    files.forEach(file => {
        const srcPath = path.join(rootDir, file);
        const destPath = path.join(distDir, file);

        // Ensure the destination subdirectory exists (e.g., for images/dev.png)
        const destSubDir = path.dirname(destPath);
        if (!fs.existsSync(destSubDir)){
            fs.mkdirSync(destSubDir, { recursive: true });
        }

        if (file.endsWith('.html') || file.endsWith('.css') || file.endsWith('.js')) {
            let content;
            
            // If it's the index.html file, use the content we modified earlier (form injection)
            if (file === 'index.html') {
                content = htmlContent; 
                console.log(content.indexOf(placeholderString) !== -1 ? "Index.html contains placeholder for CANON_URL_PLACEHOLDER" : "Index.html does not contain placeholder for CANON_URL_PLACEHOLDER"   );
            } else {
                // Otherwise, read the file content from source
                content = fs.readFileSync(srcPath, 'utf-8');
            }
            // Process text files for placeholders (if they contain any)
            const updatedContent = content.replaceAll(placeholderString, baseURL); 
            console.log("placeholderString:",placeholderString, "baseURL:",baseURL);
            console.log(updatedContent.indexOf(placeholderString) !== -1 ? "Index.html contains placeholder for CANON_URL_PLACEHOLDER" : "Index.html does not contain placeholder for CANON_URL_PLACEHOLDER"   );
            console.log(updatedContent)
            fs.writeFileSync(destPath, updatedContent);
            console.log(`Processed: ${file}`);
        } else {
            // Simply copy other files (images, fonts, etc.)
            fs.copyFileSync(srcPath, destPath);
            console.log(`Copied: ${file}`);
        }
    });
})();
