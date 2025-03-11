const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  host: "localhost",
  port: 543,
  dialect: "postgres",
  username: "postgres",
  password: "pass",
  logging: false,
});

async function connectToDB() {
  try {
    await sequelize.authenticate();
    console.log("pakdliya tera hath !");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

module.exports = {
  connectToDB,
  sequelize,
};
