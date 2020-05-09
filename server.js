const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const passport = require("passport");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);

const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");

dotenv.config();
const compression = require("compression");

/**
 * routers
 */
const publicRouter = require("./routes/public");
const userApi = require("./routes/userApi");
const adminRouter = require("./routes/admin");
const appRouter = require("./routes/app");

/** *******
 ** Middleware
 ********* */

const adminMiddleWare = require("./middlewares/admin");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(compression());
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(cookieParser());
app.use(fileUpload());
require("./config/passport")(passport);
// mongoDB

mongoose.connect(process.env.DB_URL, {
  poolSize: 10, // Maintain up to 10 socket connections
  family: 4, // Use IPv4, skip trying IPv6
  useNewUrlParser: true,
  keepAlive: true
});
mongoose.set("useFindAndModify", false);
const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
  console.log("connected to mongoDB");
});

app.use(
  session({
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    secret: "secret",
    resave: false,
    saveUninitialized: true
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

const port = process.env.PORT || 3000;
app.listen(port, err => {
  if (err) throw err;
  console.log(`listen on port: ${port}`);
});

app.use("/api/user", userApi);
app.use("/", publicRouter);
app.use("/admin", adminMiddleWare, adminRouter);
app.use("/app", appRouter);

app.get("/apple-app-site-association", (req, res) => {
  res.status(200);
  res.type("application/json");
  res.json({
    applinks: {
      apps: [],
      details: [
        {
          appID: "CVLQAZVPTK.com.webaystore",
          paths: ["*"]
        }
      ]
    }
  });
});
// const User = require("./models/user");
// const bcrypt = require("bcryptjs");
// app.get("/create-admin", async (req, res) => {
//   const salt = await bcrypt.genSalt(10);
//   const hash = await bcrypt.hash("adminFamily285Ss", salt);
//   try {
//     const admin = await User.create({
//       name: "admin",
//       password: hash,
//       phone: "55555",
//       role: [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }]
//     });
//     res.json(admin);
//   } catch (error) {
//     return res.json(error);
//   }
// });
// const Constant = require("./models/constantModel");
// app.get("/dev", async (req, res) => {
//   const constant = await Constant.create({
//     key: "WHATS",
//     value: "55555",
//     label: "رقم الواتساب للدعم"
//   });
//   return res.json(constant);
// });

app.use(function(req, res, next) {
  return res.status(404).send(`The link: ${req.url} Not found. `);
});
