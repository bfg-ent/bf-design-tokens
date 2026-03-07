# Token Audit - PWA Storefront

Audit of design values in `bf-premeng-ecommerce-frontend` as of the initial token extraction.

## Source Files Analyzed

- `src/css/override.tokens.module.css` - Primary CSS custom properties
- `bfg-theme.js` - Tailwind theme overrides
- `src/index.css` - Font-face declarations
- `src/css/override.index.module.css` - Global styles
- `tailwind.config.js` - Breakpoints, screen config
- `node_modules/@magento/pwa-theme-venia/tailwind.preset.js` - Venia base theme
- 30 component CSS modules using `--bf-*` tokens

## Issues Found & Resolved

### 1. Duplicate `--bf-global-color-orange`

**File:** `override.tokens.module.css` lines 66 and 73

```css
--bf-global-color-orange: 255, 128, 0;  /* line 66 */
--bf-global-color-orange: 255, 129, 0;  /* line 73 - wins */
```

**Resolution:** Tokenized as `bf.primitive.color.orange-500` = `#FF8100` (matching the winning value `255, 129, 0`).

### 2. Inconsistent `--bf-global-color-orange-light` format

**File:** `override.tokens.module.css` line 67

```css
--bf-global-color-orange-light: 255 196 5;  /* spaces, not commas */
```

All other tokens use comma-separated RGB. This can break `rgb()` in some contexts.

**Resolution:** Tokenized as `bf.primitive.color.orange-300` = `#FFC405` (hex, format-agnostic).

### 3. Hard-coded hex colors in component CSS modules

Found ~40+ instances of raw hex colors across component CSS modules that should reference tokens. Examples:

| Value | Files | Should Map To |
|-------|-------|---------------|
| `#00548e` | CMS, MyGameLibrary, gallery (6 files) | `bf.color.brand.primary` |
| `#fff` | CMS, dropdown, gallery, tabs (8+ files) | `bf.color.surface.primary` |
| `#757575` | override.index, paymentCard | `bf.color.text.label` |
| `#999` | override.index (product attributes) | `bf.color.text.muted` |
| `#666` | logout, miniReviewSummary | `bf.color.text.secondary` |
| `#ccc` | dropdown, tabs | `bf.color.border.default` |
| `#d3d3d3` | galleryItem | `bf.color.border.light` |
| `#5dd32e` | galleryItem (new badge) | `bf.badge.new.bg` |
| `#9823ff` | galleryItem (exclusive badge) | `bf.badge.exclusive.bg` |
| `#4292ed` | galleryItem (featured badge) | `bf.badge.featured.bg` |
| `#f5a623` | filterItemRating (star) | `bf.color.rating.filled` |
| `#d1d5db` | filterItemRating (empty star) | `bf.color.rating.empty` |
| `#fee` / `#fcc` / `#c00` | confirmEmailPage (error) | `bf.color.error.*` |
| `#fff3cd` / `#ffc107` / `#856404` | resetPasswordPage (warning) | `bf.color.warning.*` |
| `#282828` | filterComponent (border) | `bf.color.border.strong` |
| `#555` | galleryItem (border) | Consider new token |

### 4. Hard-coded border-radius values

Multiple different radius values used across components without tokens:

| Value | Usage Count | Token |
|-------|-------------|-------|
| `4px` | 2 | `bf.primitive.radius.sm` |
| `5px` | 5 (CMS cards) | `bf.cms.card.radius` |
| `6px` | 1 | `bf.primitive.radius.md` |
| `8px` | 1 | `bf.primitive.radius.lg` |
| `15px` | 2 (CMS content boxes) | `bf.primitive.radius.xl` |
| `20px` | 1 (filter tags) | `bf.primitive.radius.pill` |

### 5. Hard-coded box-shadow values

| Pattern | Usage | Token |
|---------|-------|-------|
| `3px 3px 8px 1px rgba(0,0,0,0.25)` | 5 (CMS cards) | `bf.primitive.shadow.card` |
| `0 0 20px rgba(0,0,0,0.76)` | 5 (CMS dark boxes, topBrands) | `bf.primitive.shadow.box-heavy` |
| `0 1px 6px ... 0.2` | 1 (miniCart) | `bf.primitive.shadow.dropdown` |

## Token Count Summary

| Category | Primitives | Semantic | Component | Total |
|----------|-----------|----------|-----------|-------|
| Color | 35 | 28 | 16 | 79 |
| Typography | 14 | 5 | - | 19 |
| Spacing | 14 | - | - | 14 |
| Border Radius | 6 | - | 2 | 8 |
| Breakpoint | 9 | - | - | 9 |
| Animation | 8 | - | - | 8 |
| Shadow | 4 | - | 2 | 6 |
| Layout | - | - | 7 | 7 |
| **Total** | **90** | **33** | **27** | **150** |
