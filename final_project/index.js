const express = require('express');
const app = express();

app.use(express.json());

const session = require('express-session');

// import routes
const customer_routes = require('./routes/auth_users.js');
const genl_routes = require('./routes/general.js');

// session middleware
app.use("/customer", session({
  secret: "fingerprint_customer",
  resave: true,
  saveUninitialized: true
}));

// authentication middleware (can stay empty for now)
app.use("/customer/auth/*", function auth(req, res, next) {
  next();
});

// routes
app.use("/customer", customer_routes);
app.use("/", genl_routes);

const PORT = 5000;

app.listen(PORT, () => console.log("Server is running"));