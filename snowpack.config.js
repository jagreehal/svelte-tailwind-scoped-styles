/** @type {import("snowpack").SnowpackUserConfig } */

const isProduction = process.env.NODE_ENV === 'production';
console.log('n', process.env.NODE_ENV);
module.exports = {
  mount: {
    public: { url: '/', static: true },
    src: { url: '/dist' },
  },
  plugins: [
    '@snowpack/plugin-svelte',
    '@snowpack/plugin-dotenv',
    '@snowpack/plugin-typescript',
  ],
  routes: [
    /* Enable an SPA Fallback in development: */
    // {"match": "routes", "src": ".*", "dest": "/index.html"},
  ],
  optimize: {
    /* Example: Bundle your final build: */
    bundle: true,
  },
  packageOptions: {
    /* ... */
  },
  devOptions: {
    /* ... */
  },
  buildOptions: {
    baseUrl: isProduction
      ? 'https://jagreehal.github.io/svelte-tailwind-scoped-styles/'
      : '',
  },
};
