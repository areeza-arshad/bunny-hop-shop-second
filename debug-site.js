const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const mongoose = require('mongoose');
require('dotenv').config();

const viewsDir = path.join(__dirname, 'views');
const modelsDir = path.join(__dirname, 'models');

console.log('--- STARTING DEBUG CHECK ---');

// 1. Check Models
console.log('\n[1] Checking Models...');
fs.readdirSync(modelsDir).forEach(file => {
    if (file.endsWith('.js')) {
        try {
            require(path.join(modelsDir, file));
            console.log(`✅ Model ${file} loaded successfully.`);
        } catch (err) {
            console.error(`❌ ERROR loading model ${file}:`, err.message);
        }
    }
});

// 2. Check EJS Views
console.log('\n[2] Checking EJS Views...');
function checkEjs(dir) {
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            checkEjs(fullPath);
        } else if (file.endsWith('.ejs')) {
            try {
                const content = fs.readFileSync(fullPath, 'utf8');
                // We just mock the compilation to check syntax
                ejs.compile(content);
                console.log(`✅ View ${path.relative(viewsDir, fullPath)} compiled successfully.`);
            } catch (err) {
                console.error(`❌ ERROR compiling view ${path.relative(viewsDir, fullPath)}:`);
                // Extract useful error info
                const lines = err.message.split('\n');
                console.error(lines.slice(0, 3).join('\n'));
            }
        }
    });
}
checkEjs(viewsDir);

console.log('\n--- DEBUG CHECK COMPLETE ---');
process.exit(0);
