const path = require('path');
module.exports = {
  outputDir: path.resolve(__dirname, './dist'),
  indexPath: 'index.html',
  publicPath: './',
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
}
