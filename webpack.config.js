const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const webpack = require('webpack');
const resolveTsconfigPathsToAlias = require('./resolve-tsconfig-path-to-webpack-alias');
const path = require('path');

const nodeEnv = process.env.NODE_ENV
	? process.env.NODE_ENV.trim()
	: 'development';
const development = nodeEnv === 'development';
const production = nodeEnv === 'production';

const productionPlugins = [
	new webpack.DefinePlugin({
		__DEBUG__: false,
		'process.env.NODE_ENV': '"production"',
	}),
	new MiniCssExtractPlugin({
		filename: '[name].[fullhash].css',
		chunkFilename: '[id].[fullhash].css',
	}),
	new HtmlWebpackPlugin({
		template: './public/index.html',
		filename: 'index.html',
		inject: true,
	}),
];

const developmentPlugins = [
	// new ReactRefreshPlugin(),
	new webpack.DefinePlugin({
		__DEBUG__: development,
		__BUNDLE__: `"${process.env.BUNDLE || 'index'}"`,
		'process.env.NODE_ENV': `"${process.env.NODE_ENV || 'development'}"`,
	}),
	new MiniCssExtractPlugin({
		filename: '[name].css',
		chunkFilename: '[id].css',
	}),
	new HtmlWebpackPlugin({
		template: './public/index.html',
		filename: 'index.html',
		inject: true,
	}),
];

module.exports = {
	mode: development ? 'development' : 'production',
	context: __dirname,
	entry: './src/index.tsx',
	bail: true,
	stats: { warnings: false },
	devtool: development ? 'cheap-module-source-map' : 'source-map',
	output: {
		path: path.resolve(__dirname, './wwwroot/dist'),
		filename: 'bundle.js',
		publicPath: 'http://localhost:80/',
		library: 'Router',
	},
	resolve: {
		modules: [path.resolve(__dirname, 'src'), 'node_modules'],
		extensions: ['.js', '.jsx', '.ts', '.tsx'],
		alias: resolveTsconfigPathsToAlias({
			tsconfigPath: './tsconfig.json', // Using custom path
			webpackConfigBasePath: './', // Using custom path
		}),
	},
	devServer: {
		static: path.resolve(__dirname, './wwwroot/dist'),
		hot: true,
		headers: { 'Access-Control-Allow-Origin': '*' },
		historyApiFallback: { index: '/' },
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				use: 'babel-loader',
			},
			{
				test: /\.(ts|tsx)$/,
				use: ['ts-loader'],
			},
			{
				test: /\.css$/,
				use: [
					development ? 'style-loader' : MiniCssExtractPlugin.loader,
					'css-loader',
				],
			},
		],
	},
	plugins: production ? productionPlugins : developmentPlugins,
	optimization: production
		? {
			minimize: true,
			minimizer: [
				new TerserPlugin({
					parallel: 4,
					extractComments: true,
				}),
			],
		}
		: undefined,
};
