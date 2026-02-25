const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src');

const classMap = {
    'dark:bg-slate-900': 'dark:bg-zinc-950',
    'dark:bg-slate-800': 'dark:bg-zinc-900',
    'dark:bg-slate-700': 'dark:bg-zinc-800',
    'dark:bg-slate-600': 'dark:bg-zinc-800',

    'dark:text-slate-100': 'dark:text-zinc-100',
    'dark:text-slate-200': 'dark:text-zinc-200',
    'dark:text-slate-300': 'dark:text-zinc-400', // Muted text should be darker
    'dark:text-slate-400': 'dark:text-zinc-400',
    'dark:text-slate-500': 'dark:text-zinc-400',

    'dark:border-slate-800': 'dark:border-zinc-800',
    'dark:border-slate-700': 'dark:border-zinc-800',
    'dark:border-slate-600': 'dark:border-zinc-800',
    'border-primary/10': 'border-primary/10 dark:border-zinc-800', // Strip primary off borders in dark mode
};

function processDir(d) {
    fs.readdirSync(d).forEach(file => {
        const fullPath = path.join(d, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let orig = content;

            // Fix double dark variants caused by previous script bug
            // Regex to find things like `dark:text-slate-400 dark:text-slate-500`
            content = content.replace(/dark:(text|bg|border)-slate-\d+\s+dark:\1-slate-(\d+)/g, 'dark:$1-slate-$2');

            // Apply the mapping
            for (const [k, v] of Object.entries(classMap)) {
                // For border-primary/10 we need negative lookahead to avoid duplication
                if (k === 'border-primary/10') {
                    content = content.replace(new RegExp(`${k}(?!\\s+dark:border-zinc)`, 'g'), v);
                } else {
                    content = content.replace(new RegExp(k, 'g'), v);
                }
            }
            if (content !== orig) {
                fs.writeFileSync(fullPath, content);
                console.log('Updated ' + fullPath);
            }
        }
    });
}
processDir(dir);
console.log('Colors updated to zinc/neutral!');
