const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./models/Typedefs');
const resolvers = require('./resolvers');
const UserApi = require('./datasources/UserSource');
var { passport } = require('./services/passport');
var jwt = require('jsonwebtoken')
var db = require('./db')

const app = express();


app.use('/graphql', (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (user) {
            //check expiry
            user.auth = true;
            // console.log(user);
            // console.log("user", user);
            // console.log("info", info);
            // console.log("err", err);
        }
        else {
            user.auth = false;

        }
        // console.log("user", user);
        // console.log("info", info);
        // console.log("err", err);
        req.user = { user };
        next();
    })(req, res, next)
})


const server = new ApolloServer({
    typeDefs, resolvers,
    dataSources: () => ({
        userApi: new UserApi()
    })
    , context: ({ req }) => (
        req.user
    )
});


server.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);