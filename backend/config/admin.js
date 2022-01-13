module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', '24f95db6c4b85db23a381d32b955faa1'),
  },
});
