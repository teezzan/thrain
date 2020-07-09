

const resolvers = {
    Query: {
        user(parent, args, { dataSources, user }) {
            return dataSources.userApi.getAllUser();
        },
        userbyid(parent, {id}, { dataSources, user }) {
            return dataSources.userApi.getUserbyId(id);
        },
        userbyusername(parent, {username}, { dataSources, user }) {
            return dataSources.userApi.getUserbyUsername(username);
        },
    },
    // Book: {
    //     author(parent, args, context) {
    //         // console.log(parent);
    //         console.log(context)
    //         // console.log(args)
    //         return {
    //             name: author[parent.author].name,
    //             age: author[parent.author].age,
    //         };
    //     }
    // },
    Mutation: {
        register: async (_, { email, password, username }, { dataSources }) => {
            console.log("usernutation");
            return dataSources.userApi.createUser({ email, password, username });
        },
        login: async (_, { password, username }, { dataSources }) => {
            console.log("usernutation");
            return dataSources.userApi.loginUser({ password, username });
        }
    },
};

module.exports = resolvers;