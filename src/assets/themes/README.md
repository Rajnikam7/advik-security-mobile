# Theme System

This folder contains the centralized theme configuration for the Advik Security app.

## Files

### colors.js

Contains all color definitions organized by:

- **Primary**: Green shades for main brand colors
- **Background**: Various background colors
- **Text**: Text colors for different contexts
- **Neutral**: Gray scale colors
- **Status**: Success, warning, error, info colors
- **Shadow**: Shadow colors with opacity

### typography.js

Contains typography settings:

- **fontFamily**: Roboto font variants (Regular, Medium, Bold, Light)
- **fontSize**: Predefined font sizes (xs to massive)
- **fontWeight**: Font weight values
- **lineHeight**: Line height multipliers
- **letterSpacing**: Letter spacing values

### spacing.js

Contains consistent spacing values (xs to xxl)

## Usage

Import the theme in your components:

```javascript
import { Theme } from '../assets/themes';

// Use in styles
const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.Colors.background.primary,
    padding: Theme.Spacing.md,
  },
  title: {
    fontSize: Theme.Typography.fontSize.xl,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.text.primary,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
});
```

## Font Setup

The app uses **Roboto** font family. React Native includes Roboto by default on Android. For iOS, you may need to link custom fonts.

### For iOS (if needed):

1. Add Roboto font files to `src/assets/fonts/`
2. Update `Info.plist` with font names
3. Run `npx react-native-asset`

## Color Palette

**Primary Green Shades:**

- Main: #4caf50
- Light: #81c784
- Dark: #388e3c
- Darkest: #1b5e20

**Backgrounds:**

- Primary: #ffffff (white)
- Secondary: #f8faf9 (light gray)
- Light: #f1f8e9 (light green tint)
- Pale: #e8f5e9 (pale green)
