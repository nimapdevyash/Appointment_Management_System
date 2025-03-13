const app = require("./src/app");
const { connectToDB, sequelize } = require("./src/database/connect");
const { config } = require("dotenv");

config();

connectToDB();
sequelize.sync();

const port = process.env.PORT;
app.listen(port, () =>
  console.log("kya socha tha, nahi aayenge ? le fir se aagaye")
);
