const app = require("./src/app");
const { connectToDB, sequelize } = require("./src/database/connect");

connectToDB();
sequelize.sync({ force: true });

app.listen(3000, () =>
  console.log("kya socha tha, nahi aayenge ? le fir se aagaye")
);
