// 'use strict'
// module.exports = {
//     // 部署应用时的基本 URL
//     publicPath: '/',
//     //publicPath: process.env.NODE_ENV === 'production' ? '192.168.60.110:8080' : '192.168.60.110:8080',
//     // 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建

//     devServer: { //跨域
//         port: "8090", //端口号
//         // host: "0.0.0.0",
//         host: "localhost",
//         open: true, //配置自动启动浏览器
//         proxy: { // 配置跨域处理 可以设置多个
//             '/api': {//除登录外所有请求
//                 target: ' http://192.168.3.203:9520',//nginx跨域请求头信息
//                 changeOrigin: true,
//                 secure: false, // 如果是https接口，需要配置这个参数
//                 pathRewrite: {
//                     '^/': ''
//                 }
//             }
//         }
//     },
// }
