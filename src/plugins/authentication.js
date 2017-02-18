import encryptPassword from './customers.js';
// import jwt from 'jwt';
import Joi from 'joi';
import {collection} from '../db';

const plugin = (server, options, next) => {

  server.route({
    method: 'POST',
    path: '/v1/authentication',
    config: {
      tags: ['api', 'v1'],
      validate: {
        payload: {
          email: Joi.string().email().lowercase().required(),
          password: Joi.string().min(7).required()
        }
      }
    },
    handler: {
      async: async(request, reply) => {
        let { email, password } = request.payload;
        let customers = await collection('customers');


        let result = customers.find(email);
        console.log(result);
        return reply();
      }
    }
  });

  next();

};

plugin.attributes = {
  name: 'authentication',
  version: '1.0.0'
};

export default plugin;


