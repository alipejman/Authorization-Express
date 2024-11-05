const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('express-flash');
const favicon = require('serve-favicon');
const path = require('path');
const passport = require('passport');
const { passportInit } = require('./passport.config');
const Allrouters = require('./routes/index');
require('dotenv').config();

const app = express();

// اتصال به MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/Login-Register-Express')
    .then(() => {
        console.log(`Connected to MongoDB... ✅`);
    })
    .catch(err => {
        console.error(`MongoDB connection error: ${err}`);
    });

// تنظیمات اپلیکیشن
app.use(favicon(path.join(__dirname, 'views', 'icon.png')));
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('layout', './layout/main.ejs');

// Middleware ها
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(flash());

// تنظیمات session
app.use(session({
    secret: process.env.SESSION_SECRET || "secret key",
    resave: false,
    saveUninitialized: false,
}));

// پیکربندی Passport
passportInit(passport);
app.use(passport.initialize());
app.use(passport.session());

// روت‌ها
app.use(Allrouters(passport));

// مدیریت خطا
app.use((req, res, next) => {
    res.status(404).send('404 Not Found');
});
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// راه‌اندازی سرور
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}: http://localhost:${PORT}`);
});
