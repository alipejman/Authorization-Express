const LocalStrategy = require('passport-local').Strategy;
const userModel = require('./model/user.model');
const { compareSync } = require('bcrypt');

function passportInit(passport) {
    const authenticated = async (username, password, done) => {
        try {
          const user = await userModel.findOne({ username });
          if (!user) {
            console.log(`User not found: ${username}`);
            return done(null, false, { message: 'User not found!' });
          }
          
          if (compareSync(password, user.password)) {
            return done(null, user);
          }
          
          console.log(`Incorrect password for user: ${username}`);
          return done(null, false, { message: 'Incorrect username or password!' });
        } catch (error) {
          return done(error);
        }
      };
      

  passport.serializeUser((user, done) => {
    return done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await userModel.findById(id);
    if (!user) return done(null, false, { message: 'User not found!' });
    return done(null, user);
  });

  passport.use('local', new LocalStrategy({ usernameField: 'username', passwordField: 'password' }, authenticated));
}

module.exports = {
  passportInit,
};
