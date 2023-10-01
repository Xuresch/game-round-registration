// import Joi from "joi";

export const validate = (schema, body, res) => {
  const { error } = schema.validate(body);
  if (error) {
    throw new Error(error.details[0].message);
    }
};