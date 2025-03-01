module.exports = {
  mongo: {
    uri: process.env.MONGO_URI,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      ssl: true,
      sslValidate: true,
      sslCA: `${__dirname}/rds-combined-ca-bundle.pem`,
    },
  },
  session: {
    cookie: {
      secure: true,
      sameSite: "none",
      domain: ".yourdomain.com",
    },
  },
};
