var passport = require('passport')
var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'config.secret';

passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
    // console.log(jwt_payload);
    // console.log("userhehr");

    return done(null, { user: jwt_payload.name })
}));

passport.initialize();



module.exports = {passport}