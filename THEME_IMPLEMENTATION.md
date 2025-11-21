# Theme Implementation Summary

## Overview

All screens in the Advik Security app now use centralized theme variables from `src/assets/themes/`.

## Theme Structure

### Colors (`src/assets/themes/colors.js`)

- **Primary (Teal)**: main (#008080), light, lighter, lightest, dark, darker, darkest
- **Background**: primary, secondary, light, pale
- **Text**: primary, secondary, tertiary, light, muted, dark
- **Neutral**: white, black, gray100-gray900
- **Status**: success, warning, error, info
- **Shadow**: light, medium, dark (with teal rgba)

### Typography (`src/assets/themes/typography.js`)

- **Font Family**: Roboto (Regular, Medium, Bold, Light)
- **Font Sizes**: xs (12) to massive (50)
- **Font Weights**: 300 to 900
- **Line Heights**: tight, normal, relaxed
- **Letter Spacing**: tight to widest

### Spacing (`src/assets/themes/spacing.js`)

- xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 40

## Screens Using Theme Variables

### ✅ FlashScreen

- Uses `Theme.Colors.primary.*` for logo and branding
- Uses `Theme.Colors.background.*` for backgrounds
- Uses `Theme.Colors.text.*` for text colors
- Uses `Theme.Typography.*` for fonts and sizes
- Uses `Theme.Spacing.*` for margins and padding

### ✅ LoginScreen

- Logo: `Theme.Colors.primary.main` (#008080)
- Button: `Theme.Colors.primary.main`
- Text: `Theme.Colors.neutral.gray800`, `Theme.Colors.neutral.gray500`
- Input: `Theme.Colors.neutral.gray100`
- Links: `Theme.Colors.primary.main`
- All spacing: `Theme.Spacing.*`
- All typography: `Theme.Typography.*`

### ✅ OTPVerificationScreen

- Logo: `Theme.Colors.primary.main`
- OTP filled: `Theme.Colors.primary.main` border, `Theme.Colors.primary.lightest` background
- Button: `Theme.Colors.primary.main`
- Text: `Theme.Colors.neutral.*`
- All spacing: `Theme.Spacing.*`
- All typography: `Theme.Typography.*`

### ✅ HomeScreen

- Background: `Theme.Colors.background.primary`
- Title: `Theme.Colors.text.primary`
- Subtitle: `Theme.Colors.text.muted`
- All spacing: `Theme.Spacing.*`
- All typography: `Theme.Typography.*`

## Benefits

1. **Consistency**: All screens use the same color palette and spacing
2. **Maintainability**: Change colors/fonts in one place, updates everywhere
3. **Scalability**: Easy to add new screens with consistent styling
4. **Theme Switching**: Can easily implement dark mode or theme variants
5. **Type Safety**: Centralized theme reduces typos and errors

## Usage Example

```javascript
import { Theme } from '../assets/themes';

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.Colors.background.primary,
    padding: Theme.Spacing.lg,
  },
  title: {
    fontSize: Theme.Typography.fontSize.xl,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.text.primary,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  button: {
    backgroundColor: Theme.Colors.primary.main,
    borderRadius: 12,
  },
});
```

## Color Palette (Teal Theme)

**Primary Teal Shades:**

- main: #008080
- light: #4db6ac
- lighter: #80cbc4
- lightest: #b2dfdb
- dark: #00695c
- darker: #004d40
- darkest: #00332e

**Neutral Grays:**

- gray100: #f5f5f5
- gray300: #e0e0e0
- gray400: #bdbdbd
- gray500: #9e9e9e
- gray600: #757575
- gray800: #424242

## Next Steps

To add a new screen:

1. Import theme: `import { Theme } from '../assets/themes';`
2. Use theme variables in StyleSheet
3. Follow existing patterns from other screens
4. Avoid hardcoded colors, sizes, or spacing values
