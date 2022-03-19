const { defineConfig } = require('@vue/cli-service');
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  // vue.config.js 添加如下配置
  configureWebpack: config => {
    let path = require('path')
    config.module.rules.push({
      test: path.resolve(__dirname, 'node_modules/leader-line/'),
      use: [
        {
          loader: 'skeleton-loader',
          options: {
            procedure: content => `${content}export default LeaderLine`
          }
        }
      ]
    })
  }
});
