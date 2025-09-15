# Math League PWA Design Guidelines

## Design Approach
**Reference-Based Approach**: Drawing inspiration from kid-friendly educational apps like Khan Academy Kids and Duolingo, with warm, approachable design patterns that encourage learning through play.

## Core Design Elements

### Color Palette
**Primary Colors (Light Mode):**
- Background: 45 15% 95% (warm cream)
- Primary: 25 40% 60% (warm orange-brown)
- Secondary: 180 30% 70% (soft teal)

**Primary Colors (Dark Mode):**
- Background: 25 8% 15% (dark warm gray)
- Primary: 35 45% 65% (lighter warm orange)
- Secondary: 180 25% 60% (muted teal)

**Accent Colors:**
- Success: 140 35% 55% (gentle green)
- Warning: 45 50% 65% (soft yellow)
- Error: 15 40% 60% (warm red)

**Gradient Treatments:**
- Hero sections: Subtle vertical gradients from primary to slightly lighter tints
- Progress bars: Gentle horizontal gradients using success colors
- Card backgrounds: Very subtle radial gradients for depth

### Typography
**Font Families:**
- Primary: 'Poppins' (Google Fonts) - rounded, friendly sans-serif for headings and UI
- Secondary: 'Inter' (Google Fonts) - clean, readable for body text and math problems
- Monospace: 'JetBrains Mono' for timer displays and scoring

**Font Scales:**
- Headings: 24px, 20px, 18px (bold weights)
- Body: 16px, 14px (regular and medium weights)
- Small text: 12px (medium weight)

### Layout System
**Spacing Units:** Consistent use of Tailwind units 2, 4, 6, 8, 12, 16
- Micro spacing: p-2, m-2 for tight elements
- Standard spacing: p-4, m-4 for general layout
- Section spacing: p-8, m-8 for major content blocks
- Large spacing: p-12, p-16 for hero sections and page containers

### Component Library

**Navigation:**
- Top navigation bar with hedgehog mascot logo
- Large, rounded tab buttons (≥44pt tap targets)
- Breadcrumb navigation for deep content

**Cards & Containers:**
- Rounded corners (12px radius) with subtle shadows
- Gentle hover states with slight elevation increase
- Color-coded borders for different round types (Sprint: orange, Target: blue, Number Sense: green, Team: purple)

**Interactive Elements:**
- Large, rounded buttons with generous padding
- Multiple choice options as card-style buttons
- Timer displays with prominent, easy-to-read typography
- Progress bars with animated fills and hedgehog progress indicators

**Forms & Inputs:**
- Rounded input fields with soft borders
- Large touch-friendly number pads for mobile
- Clear validation states with friendly error messages

**Data Display:**
- Score cards with large, prominent numbers
- Achievement badges with hedgehog-themed icons
- Calendar view with color-coded session dots
- Charts using pastel color schemes for progress tracking

**Hedgehog Coach Character:**
- Friendly, illustrated hedgehog in various poses
- Appears in hint bubbles, celebrations, and encouragement moments
- Consistent art style: soft, rounded illustration with warm colors

## Images
**Hedgehog Mascot Illustrations:**
- Main coach character in multiple emotional states (encouraging, celebrating, thinking)
- Small icon versions for navigation and progress indicators
- Achievement celebration animations

**Background Elements:**
- Subtle mathematical pattern overlays (very low opacity geometric shapes)
- No large hero images - focus on clean, uncluttered interface
- Small decorative mathematical icons (calculators, pencils, numbers) as accent elements

## Key Design Principles
1. **Kid-Friendly First**: Large touch targets, high contrast, simple navigation
2. **Learning-Focused**: Minimal distractions, clear hierarchy, progress visibility
3. **Warm & Encouraging**: Soft colors, friendly typography, positive reinforcement
4. **Professional Yet Playful**: Maintaining educational credibility while being engaging
5. **Accessibility**: High contrast options, clear visual hierarchy, screen reader friendly

## Responsive Considerations
- Laptop-first design with mobile adaptations
- Touch-friendly interface elements (minimum 44pt)
- Collapsible navigation for smaller screens
- Stacked layouts for mobile problem-solving interfaces