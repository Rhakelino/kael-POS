const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src');

const classMap = {
    // Backgrounds
    'bg-white': 'bg-white dark:bg-slate-900',
    'bg-slate-50': 'bg-slate-50 dark:bg-slate-800',
    'bg-slate-100': 'bg-slate-100 dark:bg-slate-700',
    'bg-slate-200': 'bg-slate-200 dark:bg-slate-600',
    'bg-background-light': 'bg-background-light dark:bg-background-dark',
    // Text colors
    'text-slate-900': 'text-slate-900 dark:text-white',
    'text-slate-800': 'text-slate-800 dark:text-slate-100',
    'text-slate-700': 'text-slate-700 dark:text-slate-200',
    'text-slate-600': 'text-slate-600 dark:text-slate-300',
    'text-slate-500': 'text-slate-500 dark:text-slate-400',
    'text-slate-400': 'text-slate-400 dark:text-slate-500',
    // Borders
    'border-slate-100': 'border-slate-100 dark:border-slate-800',
    'border-slate-200': 'border-slate-200 dark:border-slate-700',
    'border-slate-300': 'border-slate-300 dark:border-slate-600',
};

function processDirectory(dirPath) {
    const files = fs.readdirSync(dirPath);

    files.forEach((file) => {
        const fullPath = path.join(dirPath, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            processDirectory(fullPath);
        } else if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;

            for (const [original, replacement] of Object.entries(classMap)) {
                // Look for original string not already followed by dark variant
                // To avoid replacing things like `bg-white` inside `bg-white dark:bg-slate-900`
                // We use word boundaries and negative lookaheads
                const regexStr = `\\b${original}\\b(?!\\s+dark:)`;
                const regex = new RegExp(regexStr, 'g');

                if (regex.test(content)) {
                    content = content.replace(regex, replacement);
                    modified = true;
                }
            }

            if (modified) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated ${fullPath}`);
            }
        }
    });
}

processDirectory(directoryPath);
console.log('Conversion complete!');
