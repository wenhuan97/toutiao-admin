// module.exports = {
//   devServer: {
//     // port: 8084,
//     host: '0.0.0.0',
//     https:false,
//     headers: {
//       'Access-Control-Allow-Origin':'*'
//     },
//     hotOnly:false,
//     disableHostCheck: true
//   }

// }
module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080/',
        ws: true,
        changeOrigin: true
      }
    }
  }
}
