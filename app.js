const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./models/Typedefs');
const resolvers = require('./resolvers');
var {passport} = require('./services/passport');
var jwt = require('jsonwebtoken')
var db = require('./db')





const users = [
    {
        id: 1,
        name: 'John',
        email: 'john@mail.com',
        password: 'john123',
        audience: 'yoursite.net',
        issuer: 'accounts.examplesoft.com'
    }
]

const app = express();


app.use('/graphql', (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (user) {
            user.auth = true;
            req.user={user};
            // console.log(user);
            // console.log("user", user);
            // console.log("info", info);
            // console.log("err", err);
        }
        else{
            req.user={auth: false}
        }
        // console.log("user", user);
        // console.log("info", info);
        // console.log("err", err);
        next();
    })(req, res, next)
})

app.get("/gen", (req, res) => {
    var token = jwt.sign(users[0], "config.secret", {
        expiresIn: 86400 // expires in 24 hours
    });
    res.status(200).json({ token });
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