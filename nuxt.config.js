module.exports = {
  css: ['~assets/css/main.css'],
  build: {
    vendor: ['axios']
  },
  plugins: [{ src: '~/plugins/plugins.js' }],
  loading: { color: '#3B8070' },
  modules: ['@nuxtjs/apollo'],
  apollo: {
    clientConfigs: {
      default: {
        httpEndpoint:
          'https://owlifsh7s1.execute-api.us-east-1.amazonaws.com/dev/graphql'
      }
    }
  }
}
