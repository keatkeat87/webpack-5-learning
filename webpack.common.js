/* eslint-disable @typescript-eslint/no-var-requires */
const pathHelper = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const isProduction = process.env.NODE_ENV === 'production';
const glob = require('glob');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
  entry: {
    index: './index.ts',
  },
  output: {
    path: pathHelper.resolve(__dirname, 'dist'),
    filename: isProduction ? '[name].[contenthash].js' : '[name].js',
    assetModuleFilename: 'assets/[name]-[hash]-[ext][query]',
  },
  plugins: [
    new CleanWebpackPlugin(),
    new ESLintPlugin({
      extensions: ['js', 'ts'],
    }),
    ...(isProduction
      ? [
          new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css',
            chunkFilename: '[id].[contenthash].css',
          }),
        ]
      : []),
    new HtmlWebpackPlugin({
      title: 'Page Title',
      filename: 'index.html', // 输出
      template: 'index.html', // 输入
      chunks: ['index'], // 要导入的 js,css (entry 的名字)
    }),
  ],
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  require('postcss-import'),
                  require('tailwindcss')({
                    mode: 'jit',
                    purge: {
                      content: ['**/Index.html'].flatMap(value => glob.sync(value)),
                    },
                    darkMode: false,
                    theme: {
                      extend: {
                        colors: {
                          primary: '#ff0000',
                        },
                      },
                      fontFamily: {},
                      container: {
                        center: true,
                      },
                    },
                    variants: {
                      extend: {},
                    },
                    plugins: [],
                  }),
                  require('postcss-preset-env')({
                    stage: 1,
                  }),
                  require('postcss-font-magician')({
                    custom: {
                      'Gotham SSm': {
                        variants: {
                          normal: {
                            500: {
                              url: {
                                woff2: '/font/GothamSSm-Medium_Web.woff2',
                              },
                            },
                          },
                        },
                      },
                      'Gotham Book': {
                        variants: {
                          normal: {
                            400: {
                              url: {
                                woff2: '/font/GothamSSm-Book_Web.woff2',
                              },
                            },
                          },
                        },
                      },
                    },
                    display: 'swap',
                    variants: {
                      Roboto: {
                        400: [],
                        500: [],
                      },
                    },
                  }),
                ],
              },
            },
          },
          {
            loader: 'resolve-url-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.(svg|gif|jpe?g|png|webp)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  ...(isProduction
    ? {
        optimization: {
          moduleIds: 'deterministic',
          runtimeChunk: 'single',
          minimize: true,
          minimizer: [
            new TerserPlugin({
              terserOptions: {
                format: {
                  comments: false,
                },
              },
              extractComments: false,
            }),
            ...(isProduction ? [new CssMinimizerPlugin()] : []),
          ],
          splitChunks: {
            chunks: 'all',
            cacheGroups: {
              commons: {
                name: 'commons',
                chunks: 'all',
                minChunks: 2,
                minSize: 1,
              },
              vendors: {
                name: 'vendors',
                test: /[\\/]node_modules[\\/]/,
                chunks: 'all',
              },
            },
          },
        },
      }
    : undefined),
};
