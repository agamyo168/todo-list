import Joi, { ObjectSchema } from 'joi';
/**
 * @openapi
 * components:
 *  schemas:
 *    Todo:
 *      type: object
 *      required:
 *        - title
 *      properties:
 *         title:
 *          type: string
 *         description:
 *           type: string
 *         check:
 *           type: boolean
 *
 */

const createTodoSchema: ObjectSchema = Joi.object({
  title: Joi.string().required(),
  desc: Joi.string(),
  check: Joi.boolean(),
});
const patchTodoSchema: ObjectSchema = Joi.object({
  title: Joi.string(),
  desc: Joi.string(),
  check: Joi.boolean(),
}).or('title', 'desc', 'check');
const getTodoSchema: ObjectSchema = Joi.object({
  page: Joi.number(),
});

export { createTodoSchema, patchTodoSchema, getTodoSchema };
