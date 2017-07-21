var path =require('path')
var webpack=require('webpack')
var ExtractTextPlugin=require('extract-text-webpack-plugin')
var autoprefixer = require('autoprefixer')
var pxtorem=require('postcss-pxtorem')
var webpackProxy=require('./src/utils/WebpackProxy.js')
var HtmlWebpackPlugin = require('html-webpack-plugin')

var svgDirs = [
  require.resolve('antd-mobile').replace(/warn\.js$/, ''),  // 1. 属于 antd-mobile 内置 svg 文件
  path.resolve(__dirname, 'src/assets/svg'),  // 2. 自己私人的 svg 存放目录
];

module.exports={
	entry:{
		main:path.resolve(__dirname,'src/index.js'),
		vendor:['react','react-dom','react-router','redux','react-redux']
	},
	output:{
		filename:'[name]-[chunkhash:8].bundle.js',
		path:path.resolve(__dirname,"dist"),
	},
	module:{
		rules:[
			{
	          	test: /\.jsx?$/,
	          	use:[{loader:'react-hot-loader'},{loader:'babel-loader'}],
	         	include: path.join(__dirname, 'src'),
	       },{
		       	test:/\.css$/,
				use: ExtractTextPlugin.extract({ 
					fallback: "style-loader", 
					use:[
							"css-loader",
							{
								loader:"postcss-loader",
								options:{
											plugins:[
														autoprefixer({browsers: ['last 2 versions', 'Firefox ESR', '> 1%', 'ie >= 8', 'iOS >= 8', 'Android >= 4']}),
														pxtorem({ rootValue: 100, propWhiteList: [] }),
													]
										}
							}
						]
				})
	       },{
		       	test: /\.(png|jpg|jpeg|gif)$/,
		       	use:[{loader:'url-loader',options:{name:'[name].[ext]'}}]
	       },{
	       		test: /\.(svg)$/i,
	       		use:[{loader:"svg-sprite-loader"}],
	       		include: svgDirs
	       }
		]
	},
	resolve:{
		modules:['node_modules'],
	 	extensions:['.web.js','.js','.jsx','.css'],
	},
	plugins:[
		/*new webpack.optimize.OccurrenceOrderPlugin(),*/
	    /*new webpack.optimize.UglifyJsPlugin({
			output: {comments: false},
			compress:{warnings: false}
		}),*/
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: JSON.stringify('production'),
			}
		}),
	    new ExtractTextPlugin('app.css'),
	    new webpack.optimize.CommonsChunkPlugin({ names: ['vendor','manifest']}),
	    new HtmlWebpackPlugin({
	    	title: '运维一把手',
	    	template:'index.html',
	    	filename:'index.html',
	    	files:{
	    		js:['vendor.bundle', 'main.bundle','manifest.bundle' ],
	    	},
	    	minify:{
                removeComments:true,
                collapseWhitespace:true
              }
	    })
	],
	devServer:{
		port:8082,
		public:'mp.jlzhang.net',
		proxy:webpackProxy
	}
}