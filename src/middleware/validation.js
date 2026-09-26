const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false
    });

    if (error) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: error.details.map((detail) => detail.message)
      });
    }

    next();
  };
};

//with below code we get only first error if there are multile errors, you can see details[0], suppose we have multiple fields and all of them has error
//so it will display only first error, but with the above code you can see all the error, you can see we are using map to log all fields error.

// const validate = (schema) => {
//   return (req, res, next) => {
//     const { error } = schema.validate(req.body);

//     if (error) {
//       return res.status(400).json({
//         message: error.details[0].message
//       });
//     }

//     next();
//   };
// };

module.exports = { validate };