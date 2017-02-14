import {collection} from '../db';
import Joi from 'joi';
import Boom from 'boom';
import Bcrypt from 'bcryptjs';

const encryptPassword = async(password) => {

  return await new Promise((resolve, reject) => {
    return Bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        return reject(err);
      }
      return resolve(hash);
    })

  })
};
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
          password: Joi.string().min(7).required()
        }
      }
    },
    handler: {
      async: async(request, reply) => {
        const {firstName, lastName, email, password} = request.payload;

        const hashpassword = await encryptPassword(password);

        const customers = await collection('customers');
        const result = await customers.insertOne({firstName, lastName, email, hashpassword});
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
