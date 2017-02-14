import {collection} from '../db';
import Joi from 'joi';
import Boom from 'boom';

const plugin = (server, options, next) => {

  server.route({
    method: 'POST',
    path: '/v1/customers',
    config: {
      tags: ['api', 'v1'],
      validate: {
        payload: {
          firstName: Joi.string().required(),
          lastName: Joi.string().required(),
          email: Joi.string().email().lowercase().required(),
          password: Joi.string().min(7).required(),
          passwordConfirmation: Joi.string().min(7).required()
        }
      }
    },
    handler: {
      async: async(request, reply) => {
        const customer = request.payload;
        if(customer.password !== customer.passwordConfirmation) {
          return reply(Boom.badRequest('Passwords do not match', customer.password));
        }
        const customers = await collection('customers');
        const result = await customers.insertOne(customer);
        if(result.insertedCount === 1){
          return reply(201, {message: 'User created successfully!'})
        }
        return await reply(Boom.badImplementation('An error occurred'));

      }
    }

  });
  next();
};



plugin.attributes = {
  name: 'customers',
  version: '1.0.0'
};




export default plugin;
