// start server

const dotenv = require("dotenv");

// load root .env (if present) then fallback to src/models/.env
dotenv.config();
if (!process.env.IMAGEKIT_PUBLIC_KEY) {
  dotenv.config({ path: __dirname + "/src/models/.env" });
}
const app = require("./src/app");
const connectDB = require("./src/db/db");

connectDB();

app.listen(3000, () => {
  console.log("server is running on 3000");
});
