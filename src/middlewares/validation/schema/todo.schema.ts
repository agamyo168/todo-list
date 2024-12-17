import Joi, { ObjectSchema } from 'joi';

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

export { createTodoSchema, patchTodoSchema };
