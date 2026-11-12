
// Validate environment variables at startup
// Currently, if JWT_SECRET or DATABASE_URL is missing, your application might start and fail later when a login or database operation runs.

const validateEnv = () => {
  const requiredEnvVars = [
    'DATABASE_URL',
    'JWT_SECRET',
  ];

  const missingEnvVars = requiredEnvVars.filter(
    (key) => !process.env[key]
  );

  if (missingEnvVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingEnvVars.join(', ')}`
    );
  }
};

module.exports = validateEnv;