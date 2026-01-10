# Soulstick Interactive 🎮✨

**Soulstick Interactive** is an award-winning indie game studio and digital creative agency dedicated to crafting emotionally driven experiences that illuminate the human condition. 

This repository contains the source code for the official Soulstick Interactive website, a premium digital portfolio built with a focus on cinematic aesthetics, immersive interactivity, and "Triple-A" polish.

## 🌟 Key Features

### 🎨 Cinematic Visuals
- **Immersive Hero Section:** A visually striking landing area combining WebGL-like atmosphere and responsive design.
- **Dynamic Lighting:** Interactive "Torch Proximity Lighting System" where elements glow and respond to cursor movement.
- **Premium Polishing:** Usage of smooth gradients, glassmorphism, and sophisticated typography (Inter & Playfair Display).
- **Dark/Light Mode:** Fully supported theme switching with accurate color mapping for both atmospheres.

### 🖱️ Interactive Experience
- **Ember Cursor System:** A custom, physics-based particle trail cursor that simulates a glowing ember (automatically disabled on mobile for performance).
- **Proximity Detection:** UI elements react intelligently to mouse proximity, creating a tactile feel.
- **Scroll Reveals:** Staggered, premium animations for content entry using custom Intersection Observers.
- **Micro-Interactions:** Subtle hover states, magnetic buttons, and fluid transitions throughout.

### 📱 Responsive & Accessible
- **Mobile-First Design:** Fully responsive layout that adapts seamlessly to all screen sizes.
- **Touch Optimization:** Custom cursors and heavy particle effects are disabled on touch devices to ensure native scrolling performance and battery efficiency.
- **Mobile Navigation:** A clean, reliable hamburger menu with overlay navigation.
- **Accessibility:** Semantic HTML5, ARIA labels, and keyboard navigation support.

### 🔧 Functional Components
- **Contact Form:** a robust `mailto` form integration for direct communication.
- **Social Integration:** A dedicated social links row featuring custom SVG icons for Instagram, LinkedIn, YouTube, and Steam.
- **Project Showcase:** Detailed game cards with video previews and "Coming Soon" styling.

## 🛠️ Tech Stack

- **Core:** Semantic HTML5, Modern CSS3 (Variables, Flexbox, Grid).
- **Scripting:** Vanilla JavaScript (ES6+).
- **Libraries (via CDN):**
  - [Three.js](https://threejs.org/) (for WebGL atmosphere layouts).
  - [GSAP](https://greensock.com/gsap/) (for complex animations).
  - [Lenis](https://github.com/studio-freight/lenis) (for smooth scrolling).
- **Styling Methodology:** BEM-like naming convention, CSS Custom Properties for theming.

## 📂 Project Structure

```
Soulstick/
├── assets/                # Images, SVGs, Videos, Fonts
│   ├── Fire.png
│   ├── steam-logo.png
│   └── ...
├── styles/                # CSS Modules
│   ├── main.css           # Core layout and theme variables
│   ├── components.css     # Buttons, Cards, Forms, UI Elements
│   ├── animations.css     # Keyframes and specialized motion
│   ├── premium-polish.css # Advanced visual effects
│   └── micro-polish.css   # Subtle interaction details
├── scripts/               # JavaScript Logic
│   ├── ember-cursor.js    # Custom cursor physics engine
│   ├── triple-a-polish.js # Core interaction and animation controller
│   └── ...
├── index.html             # Main entry point
└── README.md              # Project documentation
```

## 🚀 Getting Started

1.  **Clone the repository** (or download the source).
2.  **Open `index.html`** in your preferred browser.
    *   *Tip:* Use a local development server (like Live Server in VS Code) for the best experience with asset loading and smooth scrolling.
3.  **Explore!** moving your mouse around to see the lighting effects in action.

## 👥 The Team

- **Kishan Panda:** Founder & Creative Director (Narrative Design, Interactive Storytelling).
- **Biswajit Tripathy:** Co-Founder & Technical Director (Core Systems, Technical Leadership).
- **Rishikesh Mohanty:** Lead Artist (Concept Art, Environment Design).
- **Lead Gameplay Engineer:** Adaptive Systems, Gameplay Logic.
- **Sound Designer:** Adaptive Music, Interactive Audio.

## 📄 License

All assets and code specifically detailed for Soulstick Interactive branding are Copyright © Soulstick Interactive. 
External libraries (Three.js, GSAP, Lenis) are subject to their respective licenses.
