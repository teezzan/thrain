var passport = require('passport')
var config = require('../config'); // get config file
var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secret;

passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
    // console.log(jwt_payload);
    // console.log("userhehr");

    return done(null, jwt_payload)
}));

passport.initialize();



module.exports = {passport}