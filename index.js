require('babel-polyfill');

const env = process.env.NODE_ENV || 'development';

if (env === 'production') {
  module.exports = require('./dist');
} else {
  require('babel-register');
  module.exports = require('./src');
}

