# ROMEO Restaurant - Single Page Application (SPA)

A fully responsive, modern restaurant website built with HTML5, CSS3, JavaScript, and Bootstrap 5. This project showcases a professional restaurant web presence with smooth scrolling, interactive elements, and a beautiful user interface.

## 📋 Project Overview

ROMEO Restaurant is a Single Page Application (SPA) that presents an authentic Italian restaurant with a complete online presence. The website includes a hero section, menu showcase, about section, contact form, and footer with social media links.

### Key Features

- **Fully Responsive Design**: Works seamlessly on mobile, tablet, and desktop devices
- **Bootstrap 5 Framework**: Modern, accessible, and component-based UI
- **Smooth Scrolling Navigation**: Single-page navigation with smooth scroll effects
- **Interactive Elements**: Hover effects, animations, and form validation
- **Menu Display**: Beautiful card-based menu layout with product information
- **Contact Form**: Fully functional contact form with validation
- **Social Media Integration**: Links to social media platforms
- **Accessibility**: ARIA labels, keyboard navigation, and semantic HTML
- **Performance Optimized**: Fast loading, optimized images, and clean code

## 🎨 Design Philosophy

The website follows an elegant Italian restaurant aesthetic with:

- **Color Scheme**: Deep burgundy (#8B0000), Gold (#D4AF37), and cream backgrounds
- **Typography**: Playfair Display for headings (elegant serif), Lato for body text (clean sans-serif)
- **Spacing**: Generous whitespace and padding for a premium feel
- **Animations**: Subtle transitions and hover effects for enhanced interactivity
- **Imagery**: High-quality food photography and restaurant ambiance images

## 📁 Project Structure

```
romeo-restaurant/
├── client/
│   ├── index.html           # Main HTML file with all sections
│   ├── css/
│   │   └── styles.css       # Complete stylesheet with responsive design
│   ├── js/
│   │   └── script.js        # JavaScript interactions and validations
│   └── public/              # Static assets (if any)
├── WIREFRAME.md             # Initial wireframe and layout structure
├── README.md                # This file
└── package.json             # Project dependencies
```

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- Node.js and npm (for local development)
- Git (for version control)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/romeo-restaurant.git
   cd romeo-restaurant
   ```

2. **Install dependencies** (if using Node.js)
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   - Local: `http://localhost:3000`
   - Network: Check terminal for network URL

### Quick Start (Without Node.js)

Simply open `client/index.html` in your web browser to view the website locally.

## 📝 File Descriptions

### index.html
The main HTML file containing:
- Navigation bar with responsive hamburger menu
- Hero section with welcome message and CTAs
- Menu section with 6 food items in a responsive grid
- About section with restaurant story
- Contact section with form and information
- Footer with social links

### css/styles.css
Comprehensive stylesheet featuring:
- CSS variables for consistent theming
- Responsive design with mobile-first approach
- Animations and transitions
- Bootstrap customizations
- Accessibility features
- Print styles

### js/script.js
JavaScript functionality including:
- Event listeners for buttons and forms
- Form validation with real-time feedback
- Smooth scroll navigation
- Active link highlighting
- Notification system
- Intersection Observer for scroll animations
- Accessibility enhancements
- Analytics tracking setup

## 🎯 Sections Overview

### 1. Navigation Bar
- Fixed sticky navigation for easy access
- Responsive hamburger menu on mobile
- Active link highlighting
- "Book Table" CTA button

### 2. Hero Section
- Full-viewport background image
- Centered welcome message
- Two prominent CTAs: "Order Now" and "View Menu"
- Smooth fade-in animation

### 3. Menu Section
- 6 food items displayed in a responsive grid
- Each item includes: image, name, price, description
- Hover effects with card elevation
- Individual "Order Now" buttons

### 4. About Section
- Two-column layout (image + text)
- Restaurant story and mission
- "Reserve Your Table" CTA
- Responsive stacking on mobile

### 5. Contact Section
- Contact form with validation
- Restaurant information (address, phone, email, hours)
- Social media links
- Form submission handling

### 6. Footer
- Copyright information
- Quick navigation links
- Responsive layout

## 🔧 Customization Guide

### Changing Colors

Edit the CSS variables in `css/styles.css`:

```css
:root {
    --primary-color: #8B0000;      /* Deep Burgundy */
    --secondary-color: #D4AF37;    /* Gold */
    --background-color: #F5F5F5;   /* Cream */
    --text-color: #333333;         /* Dark Gray */
    --light-text: #FFFFFF;         /* White */
    --accent-color: #C41E3A;       /* Bright Red */
}
```

### Updating Restaurant Information

1. **Restaurant Name**: Update "ROMEO" in `index.html`
2. **Contact Details**: Edit the contact section in `index.html`
3. **Menu Items**: Add/remove/modify menu cards in the menu section
4. **Images**: Replace image URLs with your own

### Adding New Menu Items

Copy and modify a menu card:

```html
<div class="col-md-6 col-lg-4">
    <div class="menu-card">
        <div class="menu-card-image">
            <img src="your-image-url" alt="Dish Name" class="img-fluid">
        </div>
        <div class="menu-card-body">
            <h5 class="menu-card-title">Dish Name</h5>
            <p class="menu-card-price">$XX.XX</p>
            <p class="menu-card-description">Description here</p>
            <button class="btn btn-danger w-100 order-btn" data-dish="Dish Name">Order Now</button>
        </div>
    </div>
</div>
```

## 📱 Responsive Breakpoints

| Device | Breakpoint | Layout |
|--------|-----------|--------|
| Mobile | < 576px | Single column, hamburger menu |
| Tablet | 576px - 768px | 2 columns, simplified menu |
| Desktop | 768px - 1200px | 3 columns, full layout |
| Large Desktop | > 1200px | Full layout with max-width |

## ♿ Accessibility Features

- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Focus indicators for interactive elements
- Alt text for all images
- Proper heading hierarchy
- Color contrast compliance

## 🚀 Deployment

### Deploy to Netlify

1. **Connect GitHub Repository**
   - Push your code to GitHub
   - Connect repository to Netlify

2. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`

3. **Deploy**
   - Netlify will automatically deploy on push

### Deploy to GitHub Pages

1. **Create gh-pages branch**
   ```bash
   git checkout -b gh-pages
   ```

2. **Build and push**
   ```bash
   npm run build
   git add dist/
   git commit -m "Deploy to GitHub Pages"
   git push origin gh-pages
   ```

3. **Enable GitHub Pages**
   - Go to repository settings
   - Select `gh-pages` branch as source

### Manual Deployment

1. Build the project: `npm run build`
2. Upload `dist/` folder to your web server
3. Ensure `.htaccess` is configured for SPA routing (if using Apache)

## 🔐 Security Considerations

- Form submissions should be handled server-side
- Implement CSRF protection for forms
- Validate all user inputs on the server
- Use HTTPS for production
- Keep dependencies updated

## 📊 Performance Optimization

- Images are optimized and compressed
- CSS and JavaScript are minified in production
- Lazy loading for images (implemented via Intersection Observer)
- Efficient event delegation
- CSS Grid and Flexbox for layout efficiency

## 🐛 Troubleshooting

### Images Not Loading
- Check image URLs are correct
- Verify CORS settings if using external images
- Use absolute URLs for external images

### Form Not Submitting
- Check browser console for JavaScript errors
- Verify form field IDs match JavaScript references
- Ensure form validation passes

### Navigation Not Working
- Clear browser cache
- Check for JavaScript errors in console
- Verify anchor links match section IDs

### Styling Issues
- Clear browser cache
- Check CSS file is loaded (F12 > Network tab)
- Verify Bootstrap CDN is accessible

## 📚 Technologies Used

- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with Flexbox and Grid
- **JavaScript (ES6+)**: Interactive features and validation
- **Bootstrap 5**: Responsive grid and components
- **Font Awesome**: Icon library
- **Google Fonts**: Custom typography

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For support, email info@romeorestaurant.com or open an issue on GitHub.

## 🎓 Learning Resources

- [Bootstrap 5 Documentation](https://getbootstrap.com/docs/5.0/)
- [MDN Web Docs](https://developer.mozilla.org/)
- [CSS Tricks](https://css-tricks.com/)
- [JavaScript.info](https://javascript.info/)

## 🎉 Credits

- Design and Development: Your Name
- Images: Generated AI and Unsplash
- Icons: Font Awesome
- Framework: Bootstrap 5
- Fonts: Google Fonts

## 📅 Version History

### Version 1.0.0 (2024-02-14)
- Initial release
- Complete SPA with all sections
- Responsive design
- Form validation
- Smooth scrolling navigation

---

**Built with ❤️ for ROMEO Restaurant**

Last Updated: February 14, 2024
