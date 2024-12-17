import Joi, { ObjectSchema } from 'joi';
/**
 * @openapi
 * components:
 *   schemas:
 *     CreateUserInput:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           default: test@example.com
 *         password:
 *           type: string
 *           default: 12345676890
 *     CreateUserResponse:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *         id:
 *           type: integer
 *         success:
 *           type: boolean
 *
 */
const userSchema: ObjectSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

export { userSchema };
