const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./models/Typedefs');
const resolvers = require('./resolvers')
var passport = require('passport')
var jwt = require('jsonwebtoken')



var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'secret';
opts.issuer = 'accounts.examplesoft.com';
opts.audience = 'yoursite.net';


const users = [
    {
        id: 1,
        name: 'John',
        email: 'john@mail.com',
        password: 'john123'
    }
]

passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
    // User.findOne({ id: jwt_payload.sub }, function (err, user) {
    // if (err) {
    //     return done(err, false);
    // }
    // if (user) {
    //     return done(null, user);
    // } else {
    //     return done(null, false);
    //     // or you could create a new account
    // }
    console.log(jwt_payload);

    const user = users.find(user => user.id === payload.id) || null

    return done(null, user)
    //     });
}));
passport.initialize()
const app = express();
app.use('/graphql', (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (user) {
            req.user = user
        }

        next()
    })(req, res, next)
})


const server = new ApolloServer({
    typeDefs, resolvers, context: ({ req }) => ({
        user: req.user
    })
});


server.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);