module.exports = {
  devServer: {
    proxy: {
      '/data-api': {
        target: 'https://lemon-bay-04d0e1a0f.5.azurestaticapps.net/data-api', // Your backend API
        changeOrigin: true,  // Ensure the origin is correct for CORS
        pathRewrite: {
          '^/data-api': '', // Strip '/data-api' from the URL before passing to the API
        },
        secure: false,  // If your API uses HTTPS
      },
    },
  },
};
