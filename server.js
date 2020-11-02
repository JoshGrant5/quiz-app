// load .env data into process.env
require('dotenv').config();

// Web server config
const PORT       = process.env.PORT || 8080;
const express    = require("express");
const bodyParser = require("body-parser");
const sass       = require("node-sass-middleware");
const app        = express();
const cookieSession = require('cookie-session');

// PG database client/connection setup
const { Pool } = require('pg');
const dbParams = require('./lib/db.js');
const db = new Pool(dbParams);
db.connect(err => {
  if(err) return console.log('error', err);
});

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  outputStyle: 'expanded'
}));
app.use(express.static("public"));
app.use(cookieSession({
  name: 'session',
  keys: ['averylongsecretkey', 'anotherverylongsecretkey']
}));

// Routes
const userRoutes = require("./routes/userRoutes");
const quizRoutes = require("./routes/quizRoutes");
const homeRoutes = require("./routes/homeRoutes");
const apiRoutes = require("./routes/apiRoutes");

// Helpers
const userHelpers = require("./db/helpers/userHelpers")(db);
const quizHelpers = require("./db/helpers/quizHelpers")(db);

// Mounting routes with helpers
app.use("/user", userRoutes({ userHelpers, quizHelpers }));
app.use("/quiz", quizRoutes({ userHelpers, quizHelpers }));
app.use("/", homeRoutes({ userHelpers, quizHelpers }));
app.use("/api", apiRoutes({ userHelpers, quizHelpers }));

app.listen(PORT, () => {
  console.log(`Quizandtell listening on port ${PORT}`);
});
