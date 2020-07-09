var books = [{ title: "Legend of tomorrow", author: 1 },
{ title: "Who am I?", author: 2 },
{ title: "The One", author: 2 }]

var author = [
    { name: "Yusuf hassan", age: 10 },
    { name: "Jackie Chan", age: 98 },
    { name: "Jet li", age: 8 }
]

const users = [
    {
        fullname: 'John',
        email: 'john@mail.com',
        password: 'john123',
        username: 'yoursite.net',
    }
]

const resolvers = {
    Query: {
        books(parent, args, { dataSources, user }) {
            // console.log(context)
            return dataSources.userApi.getUser(user);
        },  // what to return for book query. use service methods
        author: () => author, // what to return for author query. use service methods
        user: () => users // what to return for author query. use service methods
    },
    Book: {
        author(parent, args, context) {
            // console.log(parent);
            console.log(context)
            // console.log(args)
            return {
                name: author[parent.author].name,
                age: author[parent.author].age,
            };
        }
    },
    Mutation: {
        register: async (_, { email, password, username }, { dataSources }) => {
            console.log("usernutation");

            // await dataSources.userApi.createUser({ email, password, username }, (err, response) => {
            //     console.log("tee", response);
            //     return response;
            // });
            return dataSources.userApi.createUser({ email, password, username });
            // return { status: '401', message: 'User Not Created' }
        }
    },
};

module.exports = resolvers;