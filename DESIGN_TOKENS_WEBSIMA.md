# Websima Design System — Extracted Tokens

**Source**: https://websima.com
**Extracted from**: `/wp-content/themes/websima/assets/css/global/global.css`
**Date**: 2026-07-09

## Theme Overview

Websima uses a **light theme** (not dark) with deep navy blues as the primary color, a warm coral/salmon as secondary accent, and clean neutral grays. The design system is RTL-first with Persian at its core.

---

## Typography

### Font Families

**Primary (Persian)**: `YekanBakh` — Variable font with weight range
- Format: `woff2`
- Path in their system: `YekanBakh-VF.woff2`
- Usage: Body text, headings, all UI elements
- Weight variation: 100-600 (variable axis)

**Secondary (English)**: `Poppins` — Latin complement
- Weights: Light (normal), Medium (bold)
- Format: `woff2`
- Usage: English text, labels

**Icons**: `WebsimaIcon` — Custom icon font
- Not needed for our implementation

### Font Sizes (converted from rem to approximate px at 10px base)

| Token | Value (rem) | Approx. px | Usage |
|-------|-------------|------------|-------|
| `--fs-10` | 1.3rem | ~13px | Tiny labels |
| `--fs-11` | 1.4rem | ~14px | Small UI |
| `--fs-12` | 1.5rem | ~15px | Caption |
| `--fs-14` | 1.6rem | ~16px | Body |
| `--fs-16` | 1.7rem | ~17px | Body emphasized |
| `--fs-18` | 1.9rem | ~19px | **Default body** |
| `--fs-20` | 2.0rem | ~20px | Large body |
| `--fs-22` | 2.2rem | ~22px | Small heading |
| `--fs-24` | 2.4rem | ~24px | H5/H6 |
| `--fs-28` | 2.8rem | ~28px | H4 |
| `--fs-32` | 3.2rem | ~32px | H3 |
| `--fs-36` | 3.6rem | ~36px | H2 |
| `--fs-40` | 4.0rem | ~40px | H1 |

### Typography Settings

```css
body {
  font-family: YekanBakh, sans-serif;
  font-size: var(--fs-18); /* ~19px */
  line-height: 2; /* 200% very generous */
  font-variation-settings: var(--fw-300); /* Weight 300 default */
}
```

**Letter-spacing**: Not explicitly set (defaults to font's built-in tracking)
**Font smoothing**: `-webkit-font-smoothing: antialiased;`

---

## Color Palette

### Primary (Navy Blues)

Deep navy is the brand color — used for headings, primary UI, dark text.

```css
--c-primary: #050033;          /* Nearly black navy */
--c-primary-50: #f0f0f5;       /* Very pale blue-gray */
--c-primary-100: #f6f5fa;      /* Off-white with blue tint */
--c-primary-150: #edecf5;      /* Light lavender-gray */
--c-primary-200: #eae9f3;      /* Pale blue-gray */
--c-primary-250: #a9a6c1;      /* Muted purple-gray */
--c-primary-300: #938ec4;      /* Medium purple-gray */
--c-primary-350: #6d6991;      /* Dark purple-gray */
--c-primary-400: #1900ff;      /* Bright electric blue (accent) */
--c-primary-500: #0f0099;      /* Deep blue */
--c-primary-600: #090066;      /* Darker blue */
--c-primary-700: #07004c;      /* Very dark navy */
--c-primary-800: #16171f;      /* Almost black with blue tint */
--c-primary-850: #03001a;      /* Darkest navy */
```

**Main text color**: `var(--c-primary)` → `#050033`
**Background**: `var(--c-white)` → `#fff`

### Secondary (Coral/Salmon Accent)

Warm accent for CTAs, highlights, hover states.

```css
--c-secondary: #cd6c58;        /* Coral/salmon — primary accent */
```

### Neutrals (Grays)

Clean grayscale for backgrounds, borders, muted text.

```css
--c-neutral-100: #fefefe;      /* Almost white */
--c-neutral-150: #f5f5f7;      /* Very light gray */
--c-neutral-200: #f1f1f1;      /* Light gray */
--c-neutral-250: #dddce5;      /* Medium-light gray with lavender */
--c-neutral-300: #d1d1d1;      /* Mid-gray */
--c-neutral-350: #b3b3b3;      /* Muted gray */
--c-neutral-400: #9c9c9c;      /* Medium gray */
--c-neutral-500: #333333;      /* Dark gray */
--c-neutral-600: #2b2b2b;      /* Darker gray */
--c-neutral-700: #171719;      /* Nearly black */
```

### Utility Colors

```css
--c-danger: #f40259;           /* Bright pink-red */
--c-success: #0acd58;          /* Bright green */
--c-info: #0288d1;             /* Bright blue */
```

### Base Colors

```css
--c-white: #fff;
--c-black: #000;
```

---

## Spacing System

Websima uses a **responsive spacing scale** with `min()` for fluid sizing.

```css
--space-xs: 3rem;              /* ~30px */
--space-sm: 6rem;              /* ~60px */
--space-md: min(8.5rem, 12vw); /* ~85px or 12vw */
--space-lg: min(12rem, 12vw);  /* ~120px or 12vw */
--space-xl: min(15rem, 18vw);  /* ~150px or 18vw */
--space-xxl: min(20rem, 25vw); /* ~200px or 25vw */
```

### Container & Gutter

```css
--gutter-container: 2rem;      /* 20px container padding */
--gutter-x: 3rem;              /* 30px horizontal gutter */
--p-nav: 4rem;                 /* 40px nav padding */
```

---

## Border Radius

Not explicitly defined in the extracted CSS, but based on visual inspection of websima.com:

- Buttons: ~8-12px (`rounded-lg` to `rounded-xl`)
- Cards: ~16-20px (`rounded-2xl`)
- Small UI elements (badges, tags): ~6px (`rounded-md`)
- Inputs: ~8px (`rounded-lg`)

---

## Shadows & Elevation

Not explicitly defined in the tokens, but Websima uses **subtle shadows**:

- Cards: Light box-shadow with neutral color
- Buttons (hover): Slightly deeper shadow
- Avoid heavy drop-shadows, prefer clean borders

Suggested:
```css
--shadow-sm: 0 1px 3px rgba(5, 0, 51, 0.04);
--shadow-md: 0 4px 12px rgba(5, 0, 51, 0.08);
--shadow-lg: 0 8px 24px rgba(5, 0, 51, 0.12);
```

---

## Easing Functions

Websima defines **custom cubic-bezier curves** for smooth animations:

```css
--ease1: cubic-bezier(0.68, -0.6, 0.32, 1.6);   /* Bounce-out effect */
--ease2: cubic-bezier(0.5, 1, 0.89, 1);         /* Smooth ease-out */
--ease3: cubic-bezier(0.62, 0.05, 0.01, 0.99);  /* Fast-slow-fast */
--ease4: cubic-bezier(0.25, 0.1, 0.25, 1);      /* Standard ease-in-out */
--ease5: cubic-bezier(0.24, 0.43, 0.15, 0.97);  /* Subtle acceleration */
--ease6: cubic-bezier(0.23, 1, 0.32, 1);        /* Smooth overshoot */
--ease7: cubic-bezier(0.12, 0, 0.39, 0);        /* Sharp ease-in */
```

**Recommended default**: `--ease4` or `--ease6` for UI transitions

---

## RTL-Specific Considerations

### Direction
```css
body {
  direction: rtl;
}
```

### Numeral Handling

Websima uses **Arabic-Indic numerals** in Persian context but keeps Latin numerals in some UI elements (badges, stats). Check their usage:
- Stats/counters: Latin numerals (0-9) embedded LTR
- Body text: Arabic-Indic if specified by content

### Icon Mirroring

Directional icons (arrows, chevrons) should mirror in RTL:
```css
html[dir="rtl"] .icon-arrow-right {
  transform: scaleX(-1);
}
```

### Font Rendering

YekanBakh is designed for RTL and handles:
- Proper Persian letter forms
- Contextual ligatures
- Proper kashida (justification extension)

---

## Key Differences from Current System

| Aspect | Current (sep_web) | Websima |
|--------|-------------------|---------|
| **Theme** | Dark (`#131110` bg) | Light (`#fff` bg) |
| **Primary Color** | Orange-rust (`#D95F38`) | Navy (`#050033`) |
| **Accent** | Same orange | Coral (`#cd6c58`) |
| **Typography** | Syne/DM Sans + Vazirmatn | YekanBakh + Poppins |
| **Body Size** | Not specified | 19px (`--fs-18`) |
| **Line Height** | Default | 2.0 (200%) |
| **Spacing** | Tailwind default | Custom fluid scale |
| **Direction** | RTL-adapted | RTL-first |

---

## Implementation Notes

1. **Font Acquisition**: YekanBakh is available from [FontIran](http://fontiran.com/) or [GitHub](https://github.com/rastikerdar/yekan-bakh-font). Use the variable font (`YekanBakh-VF.woff2`) for best performance.

2. **Color Mapping**:
   - Replace `--accent` → `--c-secondary` (#cd6c58)
   - Replace `--bg` → `--c-white` (#fff)
   - Replace `--text-primary` → `--c-primary` (#050033)
   - Replace `--text-secondary` → `--c-neutral-400` (#9c9c9c)
   - Replace `--text-tertiary` → `--c-neutral-350` (#b3b3b3)

3. **Typography Scale**: Use their exact `--fs-*` tokens for consistency.

4. **Spacing**: Adopt their fluid spacing system for responsive consistency.

5. **Dark Mode**: Websima is light-only. If dark mode is desired later, create inverse palette.

---

## Visual Reference Checklist

From websima.com inspection:

- ✅ **Nav**: Clean, minimal, light background, sticky with blur backdrop
- ✅ **Hero**: Large heading (navy), coral CTA, generous white space
- ✅ **Buttons**: Rounded, coral background for primary, outlined for secondary
- ✅ **Cards**: Light backgrounds, subtle shadows, rounded corners (16-20px)
- ✅ **Typography**: YekanBakh throughout, Poppins for English
- ✅ **Grid**: Clean, white-space-heavy, asymmetric layouts in some sections
- ✅ **Stats/Badges**: Small, subtle, coral or navy accent
- ✅ **Footer**: Simple, clean, light gray background

---

**Next Steps**: Apply these tokens to `src/styles.css` and cascade through components.
