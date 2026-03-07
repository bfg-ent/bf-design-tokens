/**
 * Style Dictionary configuration for Big Fish Games design tokens.
 *
 * Generates platform-specific outputs from the token JSON source files:
 *   - CSS custom properties (for PWA and general web)
 *   - CSS legacy compat (RGB triplet format for existing PWA rgb(var(--bf-*)) pattern)
 *   - JavaScript ES6 / CommonJS / TypeScript constants (for Electron / Node)
 *   - JSON (for any consumer)
 *
 * Run: `npm run build` or `npx style-dictionary build -c style-dictionary.config.js`
 */

function hexToRgbTriplet(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return hex;
    return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`;
}

/**
 * Maps legacy PWA CSS variable names to Style Dictionary token names.
 * Token names use the CSS transform group's kebab-case convention.
 */
const legacyMap = {
    // Global brand colors
    '--bf-global-color-white': 'bf-primitive-color-white',
    '--bf-global-color-blue': 'bf-primitive-color-blue-500',
    '--bf-global-color-blue-dark': 'bf-primitive-color-blue-700',
    '--bf-global-color-blue-light': 'bf-primitive-color-blue-400',
    '--bf-global-color-blue-gray': 'bf-primitive-color-blue-300',
    '--bf-global-color-blue-xlight': 'bf-primitive-color-blue-100',
    '--bf-global-color-green-light': 'bf-primitive-color-green-400',
    '--bf-global-color-green-xlight': 'bf-primitive-color-green-100',
    '--bf-global-color-green': 'bf-primitive-color-green-500',
    '--bf-global-color-green-hover': 'bf-primitive-color-green-600',
    '--bf-global-color-green-dark': 'bf-primitive-color-green-800',
    '--bf-global-color-orange': 'bf-primitive-color-orange-500',
    '--bf-global-color-orange-light': 'bf-primitive-color-orange-300',
    '--bf-global-color-orange-dark': 'bf-primitive-color-orange-600',
    '--bf-global-color-grey-light': 'bf-primitive-color-gray-50',
    '--bf-global-color-grey': 'bf-primitive-color-gray-100',
    '--bf-global-color-grey-dark': 'bf-primitive-color-gray-300',
    '--bf-global-color-grey-disabled': 'bf-primitive-color-gray-500',

    // CMS colors
    '--bf-cms-color-box-midnightblue': 'bf-primitive-color-navy-900',
    '--bf-cms-color-box-darkolive': 'bf-primitive-color-olive-900',
    '--bf-cms-color-text-yellow': 'bf-primitive-color-yellow-500',
    '--bf-cms-color-text-light-yellow': 'bf-primitive-color-yellow-300',
    '--bf-cms-color-text-halloween': 'bf-primitive-color-yellow-400',

    // Button colors
    '--bf-button-primary-border': 'bf-button-primary-border',
    '--bf-button-primary-bg': 'bf-button-primary-bg',
    '--bf-button-primary-text': 'bf-button-primary-text',
    '--bf-button-primary-hover-bg': 'bf-button-primary-hover-bg',
    '--bf-button-secondary-bg': 'bf-button-secondary-bg',
    '--bf-button-secondary-text': 'bf-button-secondary-text',
    '--bf-button-secondary-hover-bg': 'bf-button-secondary-hover-bg',
    '--bf-button-danger-bg': 'bf-button-danger-bg',
    '--bf-button-danger-border': 'bf-button-danger-border',
    '--bf-button-highlight-border': 'bf-button-highlight-border',
    '--bf-button-highlight-bg': 'bf-button-highlight-bg',
    '--bf-button-highlight-hover-bg': 'bf-button-highlight-hover-bg'
};

module.exports = {
    hooks: {
        formats: {
            /**
             * Generates CSS with legacy PWA variable names using RGB triplet values.
             * This enables backward compatibility with the existing rgb(var(--bf-*)) pattern
             * used across 30+ component CSS modules.
             *
             * Output uses :global(:root) for CSS Modules compatibility.
             */
            'css/legacy-compat': function ({ dictionary }) {
                const header = [
                    '/**',
                    ' * Do not edit directly, this file was auto-generated.',
                    ' * Legacy compatibility layer for PWA backward compatibility.',
                    ' * Uses RGB triplet format for existing rgb(var(--bf-*)) usage pattern.',
                    ' * Source: @bfg/design-tokens',
                    ' */'
                ].join('\n');

                const tokensByName = {};
                dictionary.allTokens.forEach((token) => {
                    tokensByName[token.name] = token;
                });

                const lines = [];
                for (const [legacyName, tokenName] of Object.entries(legacyMap)) {
                    const token = tokensByName[tokenName];
                    if (token) {
                        lines.push(`    ${legacyName}: ${hexToRgbTriplet(token.$value)};`);
                    } else {
                        lines.push(`    /* WARNING: token '${tokenName}' not found for ${legacyName} */`);
                    }
                }

                return `${header}\n\n:global(:root) {\n${lines.join('\n')}\n}\n`;
            }
        }
    },

    source: ['tokens/**/*.json'],

    platforms: {
        // New hex-based CSS custom properties (for new code and future migration)
        css: {
            transformGroup: 'css',
            buildPath: 'output/css/',
            files: [
                {
                    destination: 'variables.css',
                    format: 'css/variables',
                    options: {
                        outputReferences: true
                    }
                }
            ]
        },

        // Legacy-compatible CSS with old variable names and RGB triplet values
        'css-legacy': {
            transformGroup: 'css',
            buildPath: 'output/css/',
            files: [
                {
                    destination: 'legacy-compat.css',
                    format: 'css/legacy-compat'
                }
            ]
        },

        // ES6 module exports
        js: {
            transformGroup: 'js',
            buildPath: 'output/js/',
            files: [
                {
                    destination: 'tokens.js',
                    format: 'javascript/es6'
                }
            ]
        },

        // CommonJS module exports (for Node/Webpack configs like bfg-theme.js)
        cjs: {
            transformGroup: 'js',
            buildPath: 'output/cjs/',
            files: [
                {
                    destination: 'tokens.js',
                    format: 'javascript/module-flat'
                }
            ]
        },

        // TypeScript
        ts: {
            transformGroup: 'js',
            buildPath: 'output/ts/',
            files: [
                {
                    destination: 'tokens.ts',
                    format: 'javascript/es6'
                },
                {
                    destination: 'tokens.d.ts',
                    format: 'typescript/es6-declarations'
                }
            ]
        },

        // JSON (for any consumer)
        json: {
            transformGroup: 'js',
            buildPath: 'output/json/',
            files: [
                {
                    destination: 'tokens.json',
                    format: 'json/nested'
                },
                {
                    destination: 'tokens-flat.json',
                    format: 'json/flat'
                }
            ]
        }
    }
};
