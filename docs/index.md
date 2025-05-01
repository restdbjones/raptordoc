
<div class="flex justify-center items-center w-full">
  <img src="/images/raptordoc.png" alt="raptordoc image" width="300px" class="w-auto mx-auto" />
</div>

# API docs the easy way

Create SEO optimized API docs using Codehooks.io as a backend

## Installation

1. Clone the repository:
```bash
git clone https://github.com/restdbjones/raptordoc
cd raptordoc
```

2. If you don't have an account, sign up for an account at [Codehooks.io](https://account.codehooks.io/login?signup) and install the CLI:
```bash
npm install -g codehooks
```

3. Install dependencies:
```bash
npm install
```

4. Connect local project to your Codehooks.io project:
```bash
coho init --empty
```

## Setup sidebar menu

Edit the `sidebars.yaml` file and add menu items for your markdown files.

```yml
menu:
  - title: Getting Started
    document: start.md
  - title: My API
    document: api.md
  - title: My submenu
    open: true
    items:
      - title: Child setup
        document: child.md#anchor-link
```

## Edit your markdown files

Open the `docs` folder and add your files and content.

```
---
slug: my-special-api
title: My API
keywords: [
  "XXX API",
  "XXX Database",
  "CRUD Operations XXX",
]
---

# My API

The API provides a ...
```

## UI Customization

This project uses [DaisyUI](https://daisyui.com/) and [Tailwind CSS](https://tailwindcss.com/) for styling.

### DaisyUI Theme Customization

The theme configuration is managed in `web/css/input.css` using DaisyUI's plugin syntax:

```css
@plugin "daisyui" {
    themes: light --default, dark, night;
}
```

This configuration:
- Sets `light` as the default theme
- Includes `dark` and `night` themes as alternatives
- Users can switch between these themes using DaisyUI's theme change utilities

To modify available themes:
1. Edit the themes list in `web/css/input.css`
2. Choose from [DaisyUI's built-in themes](https://daisyui.com/docs/themes/)
3. You can also add custom themes following DaisyUI's theming guidelines

### Tailwind CSS Customization

1. Extend or modify Tailwind's default configuration in `tailwind.config.js`:
```javascript
module.exports = {
  theme: {
    extend: {
      spacing: {
        '128': '32rem',
      },
      colors: {
        'custom-blue': '#1234567',
      },
      // Add more customizations
    },
  },
}
```

2. Use custom classes in your components:
```jsx
<div className="text-custom-blue p-128">
  Custom styled content
</div>
```

## NPM commands in package.json

The project includes several useful NPM commands for development and deployment:

### Development Commands
- `npm run css` - Generates CSS files using Tailwind CSS
- `npm run bundle` - Bundles and minifies client-side JavaScript using esbuild
- `npm run clearcache` - Clears the Codehooks.io cache

### Build Commands
- `npm run build` - Creates the build directory, generates CSS, and builds the search index
- `npm run buildindex` - Generates the search index from the database listings

### Deployment Commands
- `npm run deploy` - Builds the project, bundles JavaScript, clears cache, and deploys to Codehooks.io

### Setup Commands
- `npm run setup` - Cleans the database, creates the listings collection, and imports data from `build/output.json`

## Learn More

- [Codehooks.io Documentation](https://codehooks.io/docs)
- [DaisyUI Documentation](https://daisyui.com/docs/install/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)