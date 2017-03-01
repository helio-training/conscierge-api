import { collection } from '../db';
import { ObjectID } from 'mongodb';
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
    method: ['PUT', 'PATCH'],
    path: '/v1/customers/{id}',
    config: {
      tags: ['api', 'v1'],

      validate: {
        params: {
          id: Joi.string().required()
        },
        payload: {
          firstName: Joi.string().optional(),
          lastName: Joi.string().optional(),
          email: Joi.string().email().lowercase().optional(),
          password: Joi.string().min(7).optional()
        },
      }
    },

    handler: {
      async: async(req, reply) => {
        const { id } = req.params;
        const customers = await collection('customers');
        const _id = new ObjectID(id);

        const found = await customers.findOne({ _id });
        if (!found) {
          return reply(Boom.notFound('User not found'));
        }
        const password = req.payload.password;

        delete found._id;
        delete req.payload.password;


        let customer = Object.assign({}, found, req.payload);

        if(password) {
          const passwordHash = await encryptPassword(password);
          customer = Object.assign({}, customer, { passwordHash });
        }

        const result = await customers.findOneAndUpdate({ _id }, { $set: customer }, { returnOriginal: false });

        if (result.ok) {
          return reply(result.value);
        } else {
          return reply(Boom.badImplementation(result.lastErrorObject));
        }
      }
    }

  });

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
        const { firstName, lastName, email, password } = request.payload;

        const passwordHash = await encryptPassword(password);

        const customers = await collection('customers');
        const result = await customers.insertOne({ firstName, lastName, email, passwordHash });
        if (result.insertedCount === 1) {
          return reply(201, { message: 'User created successfully!' })
        }
        return await reply(Boom.badImplementation('An error occurred'));

      }
    }

  });

  return next();
};

plugin.attributes = {
  name: 'customers',
  version: '1.0.0'
};

export default plugin;
