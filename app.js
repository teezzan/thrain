const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./models/Typedefs');
const resolvers = require('./resolvers');
const { UserApi, checkUsername, saveAuthed, checkAuthed, popAuthed } = require('./datasources/UserSource');
const IdeaApi = require('./datasources/IdeaSource');
const CommentApi = require('./datasources/CommentSource');
const {sendMessage} = require('./datasources/MessageSource');
var { passport } = require('./services/passport');
var jwt = require('jsonwebtoken')
var db = require('./db')
var configure = require('./config'); // get config file




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




io.use(
    function (socket, next) {
        socket.on('username', (userObject) => {
            checkUsername(userObject, socket.id, (err, result) => {
                console.log("result");
                io.to(result.receiverId).emit('username', result.response);
            })

        });
        socket.on('authentication', (token) => {

            var date = Date.now() / 1000;
            jwt.verify(token, configure.secret, function (err, decoded) {
                console.log(decoded);
                if (err) {
                    io.to(socket.id).emit('authorization', "error");
                }
                else if (date < decoded.exp) {

                    saveAuthed({ username: decoded.username, id: socket.id }, (err, result) => {
                        if (result.auth) {
                            io.to(result.receiverId).emit('authorization', "Authenticated");
                        } else {
                            io.to(result.receiverId).emit('authorization', "server error");
                        }
                    })

                }
            });

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

io.on('connection', (socket, next) => {
    console.log('a user connected ', socket.id);


    socket.on('message', (msg) => {
        console.log("auth", socket.auth);
        checkAuthed(socket.id, (err, result) => {
            console.log("result => ", result);

            if (result.auth) {
                console.log('message: ' + msg);
                io.to(result.receiverId).emit('username', msg);
            }
            else {
                io.to(result.receiverId).emit('authorization', "Not Authenticated");
            }

        })


    });


    socket.on('send_message', (msg) => {
        checkAuthed(socket.id, (err, result) => {
            console.log("result => ", result);

            if (result.auth) {
                //create new message and save
                //check if receiver is online and send if online
                //send confirmation to sender
                msg.from = result._id;
                sendMessage(msg, socket.id, (err, result) =>{
                    if(result.sent){
                        io.to(result.receiverId).emit('username', "Successful");
                    }
                    else{
                        io.to(result.receiverId).emit('username', "UnSuccessful");
                    }
                });
                console.log('message: ' + msg);
                
            }
            else {
                io.to(result.receiverId).emit('authorization', "Not Authenticated");
            }

        })


    });


    socket.on('disconnect', () => {
        console.log('a user disconnected ', socket.id);
        popAuthed(socket.id, (err, result) => {
            console.log("result => ", result);
        })

    });

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
