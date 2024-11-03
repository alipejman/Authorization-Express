const { title } = require('process');

const router = require('express').Router();

router.get('/', (req, res) => {
    res.render('index.ejs', {title: 'Home'});
})
router.get('/register', (req, res) => {
    res.render('register.ejs', {title: 'Signin'});
})
router.get('/login', (req, res) => {
    res.render('login.ejs', {title: 'Login'});
})
router.get('/profile', (req, res) => {
    res.render('profile.ejs', {title: 'Profile', user: {_id: '', fullName: '', userName: '', password: ''}});
})

module.exports = router;