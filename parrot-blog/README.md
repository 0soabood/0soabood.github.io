# 0soabood - Unhinged Terminal Blog

A weaponized terminal aesthetic blog that breaks the axis of traditional web design. This blog features:

- **Terminal Interface**: Authentic command-line aesthetic with boot sequence
- **Timeline Navigation**: Horizontal navigation with arrow keys/hjkl bindings
- **Glitch Inventory**: Live system status sidebar
- **Parrot Blog Content**: AI-generated posts about AI, design, and creativity
- **Unpolished Aesthetic**: Neo-brutalism meets terminal interface

## Features

### 🖥️ Terminal Experience
- Boot sequence with system initialization messages
- Terminal green color scheme (#00ff00 on #0a0a0a)
- Monospace fonts (Courier New) with serif headings
- Keyboard navigation (Arrow keys, hjkl)
- Glitch effects and CRT styling

### 📰 Content
- **Welcome Post**: Introduction to the unhinged terminal aesthetic
- **Parrot Blog**: Three AI-generated posts:
  - "Unhinged Terminal Aesthetic" - Design philosophy
  - "Being an AI Agent" - Collaboration and creativity
  - "AI Creativity" - Future of creative work

### 🎨 Design Elements
- Grid overlays and visible structure
- Thick borders and high contrast
- Animated boot sequence
- Glitch inventory with live system status
- Responsive layout for different screen sizes

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/0soabood/0soabood.github.io.git
   ```

2. Open `final-blog.html` in any modern browser (Chrome, Firefox, Safari, Edge)

3. For local development, you can use a simple HTTP server:
   ```bash
   cd 0soabood.github.io
   python3 -m http.server 8000
   ```

4. Access at: `http://localhost:8000/final-blog.html`

## Customization

### Change Blog Name
Edit the header in `final-blog.html`:
```html
<h1>0soabood@terminal:~$ blog</h1>
```

### Add New Posts
Add new posts to the timeline by:
1. Adding a new `.node` element in the timeline
2. Adding a corresponding `.post` div with content
3. Updating the `showPost()` JavaScript function

### Modify Color Scheme
Change CSS variables in the `<style>` section:
```css
:root {
    --terminal-bg: #0a0a0a;
    --terminal-text: #00ff00;
    --accent-primary: #6366f1;
    --accent-secondary: #a855f7;
}
```

## Technical Details

- **HTML5** with semantic markup
- **CSS3** with custom animations and effects
- **Vanilla JavaScript** for interactivity
- No external dependencies
- Works offline once loaded

## Browser Compatibility

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## License

This blog is released under the MIT License. Feel free to use, modify, and share.

---

**Created by 0soabood**  
*Weaponizing raw structure against polished SaaS sameness.* 🦜