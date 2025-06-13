// frontend/tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        grass: "#6DA34D",      // fresh green
        moss:  "#5A6F3E",      // deeper green
        bark:  "#8B5E34",      // warm brown
        earth: "#A98467",      // sandy brown
        sky:   "#A0D8EF"       // light blue accent
      },
      backgroundImage: {
        forest: "url('https://www.google.com/url?sa=i&url=https%3A%2F%2Fstock.adobe.com%2Fno%2Fimages%2Fpixel-art-tree-bark-seamless-pattern-8-bit-wood-texture-background-natural-surface-rustic-material-2d-tile-old-school-vintage-retro-80s-90s-slot-machine-video-game-graphics-forest-backdrop%2F422861618&psig=AOvVaw3jRNZQJMOqkMFmTKR1WZDq&ust=1749828747148000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCKjh7Zma7I0DFQAAAAAdAAAAABAX')"
      }
    }
  },
  plugins: [],
};
