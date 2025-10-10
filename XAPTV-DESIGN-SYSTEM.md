# XAPTV Design System

A comprehensive design system for XAPTV IPTV checkout and related applications.

## 🎨 Color Palette

### Primary Colors
- **Primary Teal**: `#4ECDC4` - Main brand color, buttons, accents
- **Primary Teal Hover**: `#3bb5ad` - Darker variant for hover states
- **Primary Teal Light**: `rgba(78, 205, 196, 0.1)` - Subtle backgrounds, borders

### Background Colors
- **Dark Blue Primary**: `#0a1929` - Main background
- **Dark Blue Secondary**: `#1a2332` - Gradient backgrounds
- **Dark Blue Tertiary**: `#0f1729` - Gradient accents
- **Dark Overlay**: `rgba(10, 25, 41, 0.7)` - Content overlays

### Text Colors
- **Primary Text**: `#ffffff` - Main text, headings
- **Secondary Text**: `rgba(255, 255, 255, 0.7)` - Subtext, descriptions
- **Muted Text**: `rgba(255, 255, 255, 0.6)` - Footer text, copyright

### Accent Colors
- **Blue Accent**: `rgba(59, 130, 246, 0.15)` - Floating orb accents
- **Purple Accent**: `rgba(139, 92, 246, 0.15)` - Floating orb accents
- **Grid Lines**: `rgba(78, 205, 196, 0.03)` - Subtle grid overlay

## 🔤 Typography

### Font Families
```css
font-family: 'Inter', 'Geist Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

### Font Weights
- **Light**: 400
- **Medium**: 500
- **Semibold**: 600
- **Bold**: 700

### Font Sizes
- **H1**: 32px (2rem)
- **H2**: 24px (1.5rem)
- **H3**: 18px (1.125rem)
- **Body**: 14px (0.875rem)
- **Small**: 12px (0.75rem)

### Line Heights
- **Tight**: 1.2
- **Normal**: 1.5
- **Relaxed**: 1.6

## 📐 Spacing System

### Base Unit
- **Base**: 8px (0.5rem)

### Spacing Scale
- **xs**: 4px (0.25rem)
- **sm**: 8px (0.5rem)
- **md**: 16px (1rem)
- **lg**: 24px (1.5rem)
- **xl**: 32px (2rem)
- **2xl**: 48px (3rem)
- **3xl**: 64px (4rem)

## 🎯 Border Radius

- **Small**: 4px
- **Medium**: 6px
- **Large**: 8px
- **Extra Large**: 12px
- **Full**: 50% (circles)

## 🌊 Animations & Transitions

### Transition Mixin
```scss
@mixin transition {
  transition-property: transform, opacity;
  transition-duration: 0.3s;
  transition-timing-function: cubic-bezier(0.25, 0.8, 0.5, 1);
}
```

### Common Transitions
- **Standard**: `all 0.3s ease`
- **Fast**: `all 0.2s ease`
- **Slow**: `all 0.5s ease`

### Hover Effects
- **Scale**: `transform: scale(1.02)`
- **Translate Y**: `transform: translateY(-1px)`
- **Translate X**: `transform: translateX(4px)`

## 🎭 Background Effects

### Animated Gradient Background
```scss
background: linear-gradient(135deg, 
  #0a1929 0%, 
  #1a2332 25%, 
  #0f1729 50%, 
  #1a2332 75%, 
  #0a1929 100%);
animation: gradientShift 15s infinite alternate ease-in-out;
```

### Floating Orbs
- **Orb 1**: Teal (`rgba(78, 205, 196, 0.15)`) - Top left
- **Orb 2**: Blue (`rgba(59, 130, 246, 0.15)`) - Top right
- **Orb 3**: Purple (`rgba(139, 92, 246, 0.15)`) - Bottom center

### Grid Overlay
```scss
background-image: 
  linear-gradient(rgba(78, 205, 196, 0.03) 1px, transparent 1px),
  linear-gradient(90deg, rgba(78, 205, 196, 0.03) 1px, transparent 1px);
background-size: 50px 50px;
```

## 🧩 Components

### Buttons

#### Primary Button
```scss
.button-primary {
  background-color: #4ECDC4;
  color: #0a1929;
  font-weight: 700;
  padding: 12px 24px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #3bb5ad;
    transform: scale(1.02);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
}
```

#### Secondary Button
```scss
.button-secondary {
  background: rgba(78, 205, 196, 0.1);
  border: 1px solid #4ECDC4;
  color: #4ECDC4;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #4ECDC4;
    color: #0a1929;
    transform: translateY(-1px);
  }
}
```

### Cards
```scss
.card {
  background: rgba(10, 25, 41, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(78, 205, 196, 0.2);
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}
```

### Headers

#### Main Header
```scss
.header {
  height: 80px;
  background-color: rgba(10, 25, 41, 0.9);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(78, 205, 196, 0.2);
  position: sticky;
  top: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
}
```

### Footer
```scss
.footer {
  background: rgba(10, 25, 41, 0.95);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(78, 205, 196, 0.2);
  margin-top: 60px;
  
  .footer-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 48px 24px 32px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 32px;
  }
}
```

## 📱 Responsive Breakpoints

### Breakpoints
- **Mobile**: `480px`
- **Tablet**: `768px`
- **Desktop**: `1024px`
- **Large Desktop**: `1200px`

### Container Widths
- **Desktop**: `1200px` max-width
- **Tablet**: `768px` max-width
- **Mobile**: `100%` width with padding

### Responsive Typography
```scss
@media screen and (max-width: 768px) {
  .header { height: 55px; }
  .logo-image { height: 30px; }
  .footer-content { 
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }
}

@media screen and (max-width: 480px) {
  .footer-content { 
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
  .footer-title { font-size: 15px; }
  .footer-link { font-size: 12px; }
}
```

## 🎨 Layout Patterns

### Centered Container
```scss
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}
```

### Grid Layouts
```scss
.grid-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
}

.grid-2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}
```

### Flexbox Patterns
```scss
.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.flex-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
```

## 🎭 Animation Keyframes

### Gradient Shift
```scss
@keyframes gradientShift {
  0% { background: linear-gradient(135deg, #0a1929 0%, #1a2332 50%, #0f1729 100%); }
  50% { background: linear-gradient(135deg, #1a2332 0%, #0f1729 50%, #0a1929 100%); }
  100% { background: linear-gradient(135deg, #0f1729 0%, #0a1929 50%, #1a2332 100%); }
}
```

### Floating Orbs
```scss
@keyframes floatOrb1 {
  0% { transform: translate(0, 0) scale(1); }
  25% { transform: translate(100px, -50px) scale(1.1); }
  50% { transform: translate(-50px, -100px) scale(0.9); }
  75% { transform: translate(-100px, 50px) scale(1.05); }
  100% { transform: translate(0, 0) scale(1); }
}
```

## 🔧 CSS Variables

### Root Variables
```css
:root {
  /* Colors */
  --primary-color: #4ECDC4;
  --primary-hover: #3bb5ad;
  --primary-light: rgba(78, 205, 196, 0.1);
  --background-primary: #0a1929;
  --background-secondary: #1a2332;
  --background-tertiary: #0f1729;
  --text-primary: #ffffff;
  --text-secondary: rgba(255, 255, 255, 0.7);
  --text-muted: rgba(255, 255, 255, 0.6);
  
  /* Spacing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --spacing-2xl: 48px;
  
  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  
  /* Transitions */
  --transition-fast: 0.2s ease;
  --transition-normal: 0.3s ease;
  --transition-slow: 0.5s ease;
  
  /* Shadows */
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.2);
  --shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.4);
}
```

## 🎯 Usage Guidelines

### Do's
- ✅ Use the primary teal color for CTAs and important elements
- ✅ Apply consistent spacing using the 8px base unit
- ✅ Use backdrop-filter for glassmorphism effects
- ✅ Implement smooth transitions for interactive elements
- ✅ Follow the responsive breakpoints for mobile-first design
- ✅ Use the Inter font family for consistency

### Don'ts
- ❌ Don't use colors outside the defined palette
- ❌ Don't skip responsive design considerations
- ❌ Don't use harsh transitions or animations
- ❌ Don't mix different font families
- ❌ Don't ignore accessibility considerations

## 🚀 Implementation Notes

### Performance Considerations
- Use `will-change: transform` for animated elements
- Implement `transform3d(0, 0, 0)` for hardware acceleration
- Respect `prefers-reduced-motion` for accessibility
- Optimize animations for mobile devices

### Browser Support
- Modern browsers with CSS Grid and Flexbox support
- Backdrop-filter support for glassmorphism effects
- CSS Custom Properties (CSS Variables) support

### Accessibility
- Maintain sufficient color contrast ratios
- Provide focus states for interactive elements
- Use semantic HTML elements
- Support keyboard navigation

---

**Version**: 1.0  
**Last Updated**: January 2025  
**Maintained by**: XAPTV Development Team
