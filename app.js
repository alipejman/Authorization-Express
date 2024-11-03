const express = require('express');
var expressLayouts = require('express-ejs-layouts');
const {default: mongoose} = require('mongoose');
const { NotFound, ErrHandling } = require('./error-handler');
const Allrouters = require('./routes/index');
const flash = require('express-flash');
const session = require('express-session');
require('dotenv').config();
const app = express();
mongoose.connect('mongodb://localhost:27017/Login-Register-Express', {}).then(() => {
    console.log(`Connected To MongoDB ... ✅`);
})

// setup application
app.use(flash());
app.use(express.urlencoded({extended: true}));
app.use(express.json());
//setup view engine and layout
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('layout', './layout/main.ejs');

//setup session
app.use(session({
    secret:"secret key",
    resave: false,
    saveUninitialized: false
}))



// Routers
const PORT = process.env.PORT || 3000;
app.use(Allrouters);
app.use(NotFound);
app.use(ErrHandling); 
// setup express server
app.listen(PORT, () => {
    console.log(`Server Is Running On PORT ${PORT} : http://localhost:${PORT}`);
})