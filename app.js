const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./models/Typedefs');
const resolvers = require('./resolvers');
const { UserApi, checkUsername } = require('./datasources/UserSource');
const IdeaApi = require('./datasources/IdeaSource');
const CommentApi = require('./datasources/CommentSource');
var { passport } = require('./services/passport');
var jwt = require('jsonwebtoken')
var db = require('./db')


const app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const nsp = io.of('/namespace');
app.use(express.static('public'))
app.use('/graphql', (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {

        if (user) {
            //check expiry
            user.auth = true;
            req.user = { user };
        }
        else {
            var user = { auth: false };
            req.user = { user };

        }
        // console.log("userauth", user);
        // console.log("info", info);
        // console.log("err", err);

        next();
    })(req, res, next)
})


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


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});




io.use(function (socket, next) {
    socket.on('username', (userObject) => {
        checkUsername(userObject, socket.id, (err, result) => {
            console.log("result");
            io.to(result.receiverId).emit('username', result.response);
        })
    });
    //auth router 
    // console.log("tee");
    // var handshakeData = socket.request;
    // console.log(handshakeData);

    // make sure the handshake data looks good as before
    // if error do this:
    // next(new Error('not authorized'));
    // else just call next
    next();
});

io.on('connection', (socket) => {
    console.log('a user connected ', socket.id);
    if(true){
    socket.on('message', (msg) => {
        console.log('message: ' + msg);
        io.to(socket.id).emit('username_response', msg);

    });}
});

nsp.on('connection', function (socket) {
    socket.on('username', (userObject) => {
        checkUsername(userObject, socket.id, (err, result) => {
            console.log("result");
            nsp.to(result.receiverId).emit('username', result.response);
        })
    });
});

http.listen(4000, () => {
    console.log('listening on *:4000');
});
