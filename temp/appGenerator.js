const appGenerator = () => {
    const file = `
   require("dotenv").config();
require("./src/lib/db")();
const express = require('express');
const app = express();
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const MongoDBStore = require('connect-mongodb-session')(session);

// Passport konfigürasyonunu yükle
require('./src/config/passportLocal.js')(passport);  // <-- Bu satırı ekleyin

var myStore = new MongoDBStore({
  uri: process.env.DB_URL,
  collection: 'sessions'
});

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 
    },
    store: myStore
}));

app.use(passport.initialize());
app.use(passport.session());

// Template Engine //
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
app.use(expressLayouts);
app.use(express.static('public'));

app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, './src/views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const port = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

require("./src/helpers/createFirstData")();

const routers = require('./src/routers/index');
const dashboardRouter = require('./src/routers/dashboard');
app.use('/api', routers);
app.use('/dashboard', dashboardRouter);

app.listen(port, () => {
    console.log(\`🚀 Server ready at http://localhost:\${port}/dashboard\`);
});
    `

    return file
}

export default appGenerator