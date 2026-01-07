# KM Architects Website

A modern, interactive architecture portfolio website featuring smooth transitions and a 3D carousel view.

## Features

- **Smooth Slide Navigation**: Navigate between pages with elegant slide transitions
- **3D Carousel Mode**: Toggle to view all pages in an interactive 3D carousel
- **Custom Cursor**: Arrow indicators when hovering over navigation zones
- **Keyboard Support**: Use arrow keys to navigate between slides
- **Responsive Design**: Optimized for modern browsers

## File Structure

```
km-architects/
├── index.html          # Main HTML structure
├── styles.css          # All styling and animations
├── data.js             # Page content and configuration
├── carousel.js         # 3D carousel logic and animations
├── navigation.js       # Slide navigation and cursor handling
├── app.js              # Main application initialization
└── README.md           # This file
```

## Getting Started

1. Clone this repository
2. Open `index.html` in a modern web browser
3. No build process or dependencies required!

## Usage

### Navigation
- **Click** the left/right edges of the screen to navigate between slides
- **Arrow Keys** (←/→) to move between slides
- **Toggle Button** (top right) to switch between slide and carousel views

### Carousel Mode
- **Mouse Wheel** over the scroll bar to rotate the carousel
- The center card is highlighted and shows the page title

## Browser Support

Tested and working in:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Customization

### Adding New Pages
Edit `data.js` and add new objects to the `pages` array:

```javascript
{
    title: "Page Title",
    subtitle: "Navigation Label",
    description: "Main heading text",
    buttonText: "Button Text",
    image: "image-url.jpg"
}
```

### Styling
All visual styles can be modified in `styles.css`. Key sections:
- Logo styles (`.logo-*`)
- Carousel card appearance (`.carousel-card`)
- Slide transitions (`.main-image.*`)
- Custom cursors (`.custom-cursor`)

## License

Feel free to use this template for your own projects!
