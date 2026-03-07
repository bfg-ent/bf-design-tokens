# @bfg/design-tokens

Shared design tokens for Big Fish Games applications (PWA storefront, Electron desktop client, etc.).

## Structure

```
tokens/
  primitive/     Raw values (colors, sizes, timing)
  semantic/      Purpose-based aliases (brand, success, error, link)
  component/     UI-element-specific tokens (button, badge, cms, layout)
```

## Usage

```bash
npm install
npm run build
```

This generates platform-specific outputs in `output/`:

| Output | Path | Consumer |
|--------|------|----------|
| CSS custom properties | `output/css/variables.css` | PWA (import in CSS) |
| JS constants | `output/js/tokens.js` | Electron (ES6 import) |
| TypeScript | `output/ts/tokens.ts` + `.d.ts` | Any TS project |
| JSON | `output/json/tokens.json` | Any platform |

## Token Tiers

1. **Primitive** - Raw values named by appearance (`bf.primitive.color.blue-500`)
2. **Semantic** - Purpose-based aliases (`bf.color.brand.primary` -> references blue-500)
3. **Component** - UI element specifics (`bf.button.primary.bg`)

Components should reference **semantic** tokens when possible, falling back to **component** tokens for element-specific values, and **primitive** tokens only when no semantic mapping exists.

## Adding Tokens

1. Add or modify JSON files in `tokens/`
2. Run `npm run build`
3. Commit both source and generated output
4. Bump version and publish
