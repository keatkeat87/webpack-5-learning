/* eslint-disable @typescript-eslint/no-var-requires */
const pathHelper = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const isProduction = process.env.NODE_ENV === 'production';
const glob = require('glob');

module.exports = {
  entry: {
    index: './index.ts',
  },
  output: {
    path: pathHelper.resolve(__dirname, 'dist'),
  },
  plugins: [
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
    ],
  },
};
