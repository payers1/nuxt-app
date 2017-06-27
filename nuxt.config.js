module.exports = {
  css: [
    '~assets/css/main.css',
    // 'semantic-ui-css/semantic.css'
  ],
  build: {
    vendor: ['axios']
  },
  plugins: [
    { src: '~/plugins/plugins.js' }
  ],
  loading: { color: '#3B8070' }
}
