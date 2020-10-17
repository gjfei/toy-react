const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development", //开发模式
  entry: path.resolve(__dirname, "src/index"),  //入口文件
  output: {  // 出口文件
    filename: "[name].js",  //打包后的文件名称
    path: path.resolve(__dirname, "dist")  //打包后的目录
  },
  devServer: {
    contentBase: './dist',
    open: true,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [['@babel/plugin-transform-react-jsx', { pragma: 'createElement' }]]
          }
        }
      }
    ]
  },
  plugins: [  //插件配置
    new HtmlWebpackPlugin({ // 打包输出HTML
      title: 'TOY REACT',
      filename: 'index.html',
      template: path.resolve(__dirname, "public/index.html")
    }),
  ],
  optimization: {
    minimize: false
  }
}