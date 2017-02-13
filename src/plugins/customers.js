import {collection} from '../db';
import Joi from 'joi';

const plugin = (server, options, next) => {

  server.route({
    method: 'POST',
    path: '/v1/customers',
    config: {
      tags: ['api', 'v1'],
      validate: {
        payload: {

        }
      }
    },
    handler: {
      async: async(request, reply) => {
        return reply({});
      }
    }

  })
  next();
};



plugin.attributes = {
  name: 'customers',
  version: '1.0.0'
};




export default plugin;
