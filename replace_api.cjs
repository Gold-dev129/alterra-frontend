const fs = require('fs');
const path = require('path');

const directory = path.join(__dirname, 'src');
const API_URL = 'https://alterra-node.onrender.com';

function scanAndReplace(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            scanAndReplace(fullPath);
        } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;

            // 1. Replace fetch and io URLs
            if (content.includes("fetch('http://localhost:5000")) {
                content = content.replace(/fetch\('http:\/\/localhost:5000/g, `fetch('${API_URL}`);
                modified = true;
            }
            if (content.includes("fetch(`http://localhost:5000")) {
                content = content.replace(/fetch\(\`http:\/\/localhost:5000/g, `fetch(\`${API_URL}`);
                modified = true;
            }
            if (content.includes("io('http://localhost:5000')")) {
                content = content.replace(/io\('http:\/\/localhost:5000'\)/g, `io('${API_URL}')`);
                modified = true;
            }

            // 2. Replace image path template literals
            // From: `http://localhost:5000${...}`
            // To: `${...}`
            if (content.includes("`http://localhost:5000${")) {
                content = content.replace(/`http:\/\/localhost:5000\$\{/g, '`${');
                modified = true;
            }

            if (modified) {
                fs.writeFileSync(fullPath, content);
                console.log('Modified:', fullPath);
            }
        }
    }
}

scanAndReplace(directory);
