const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./models/Typedefs');
const resolvers = require('./resolvers');
const UserApi = require('./datasources/UserSource');
const IdeaApi = require('./datasources/IdeaSource');
const CommentApi = require('./datasources/CommentSource');
var { passport } = require('./services/passport');
var jwt = require('jsonwebtoken')
var db = require('./db')


const app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.use(express.static('public'))
app.use('/graphql', (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {

        if (user) {
            //check expiry
            user.auth = true;
            req.user = { user };
            // console.log(user);
            // console.log("user", user);
            // console.log("info", info);
            // console.log("err", err);
        }
        else {
            var user={auth : false};
            req.user = { user };

        }
        // console.log("userauth", user);
        // console.log("info", info);
        // console.log("err", err);
        
        next();
    })(req, res, next)
})

// app.get('/', (req, res)=>{
//     res.
// });

const server = new ApolloServer({
    typeDefs, resolvers,
    dataSources: () => ({
        userApi: new UserApi(),
        ideaApi: new IdeaApi(),
        commentApi: new CommentApi()

    })
    , context: ({ req }) => (
        req.user
    )
});


server.applyMiddleware({ app });




// app.listen({ port: 4000 }, () =>
//     console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
// );



// var app = require('express')();

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('a user connected');
});

http.listen(4000, () => {
  console.log('listening on *:4000');
});
