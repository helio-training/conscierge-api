import jwt from 'jsonwebtoken';
import Joi from 'joi';
import {collection} from '../db';
import Bcrypt from 'bcryptjs';
import Boom from 'boom';


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
        let {email, password} = request.payload;
        const customers = await collection('customers');
        const foundCustomer = await customers.findOne({email});


        if (foundCustomer && Bcrypt.compareSync(password, foundCustomer.hashpassword)) {
          delete foundCustomer.hashpassword;
          const token = jwt.sign(foundCustomer, "secret", {expiresIn: '1 day' });
          return reply({token});
        }


        return reply(Boom.unauthorized('Login Failed'));


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


