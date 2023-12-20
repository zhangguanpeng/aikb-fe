const path = require('path');
const webpack = require('webpack');
const {merge} = require('webpack-merge');
// const apiMocker = require('mocker-api');
// const path = require('path');
const apiMocker = require('webpack-api-mocker');

const commonConfig = require('./webpack.common');
// const mocker = require('./mocker');
// require('../mock/index');

// console.log('process.env.NODE_ENV', process.env.NODE_ENV);


// if (process.env.NODE_ENV === 'mock') {
//   // import "./mock/index.js"
//   require('../mock/index');
// }

module.exports = merge(commonConfig, {
  mode: 'development',
  // 开发环境本地启动的服务配置
  devServer: {
    port: 9001,
    hot: true,
    open: true,
    historyApiFallback: true,
    compress: true,
    // 接口代理转发
    proxy: {
      '/aikb/': {
        target: 'http://120.26.100.206:8001',
        changeOrigin: true,
        pathRewrite: { '^': '' },
      },
    },
    onBeforeSetupMiddleware: (devServer) => {
        apiMocker(devServer.app, path.resolve('./mock/index.js'), {
            // 'GET /api/users/list': 'http://localhost:3000',
            // 'GET /api/userinfo/:id': 'http://localhost:3000',
        })
    }
  },
  plugins: [ new webpack.HotModuleReplacementPlugin()],
  devtool: 'eval-source-map',
  // optimization: {
  //   moduleIds: 'named',
  // },
});
