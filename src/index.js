import { Server } from 'hapi';
import CustomersPlugin from './plugins/customers';

const server = new Server({});

const port = process.env.PORT || 4000;
const env = process.env.NODE_ENV || 'development';
server.connection({
  port, router: {
    isCaseSensitive: false
  },
  routes: {
    cors: true
  }
});


server.register([
  require('inert'),
  require('vision'),
  require('blipp'),
  require('tv'),
  require('hapi-async-handler'),
  {
    register: require('hapi-swagger'),
    options: {
      cors: true,
      jsonEditor: true,
      documentationPath: '/',
      info: {
        title: 'Example',
        version: '1.0.0',
        description: 'An example api',
//        contact: {
//          name: '',
//          url: '',
//          email: ''
//        },
//        license: {
//          name: '',
//          url: ''
//        }
      }
    }
  },
  CustomersPlugin

], err => {
  if (err) throw err;

  if (env !== 'testing') {
    server.start(err => {
      if (err) throw err;
      server.log('info', 'Server running at: ' + server.info.uri);
    });
  }

});


export default server;
