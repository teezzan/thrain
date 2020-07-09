

const resolvers = {
    Query: {
        user(parent, args, { dataSources, user }) {
            return dataSources.userApi.getAllUser();
        },
        userbyid(parent, {id}, { dataSources, user }) {
            return dataSources.userApi.getUserbyId(id);
        }
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
        }
    },
};

module.exports = resolvers;