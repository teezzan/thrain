

const resolvers = {
    Query: {
        user(parent, args, { dataSources }) {
            return dataSources.userApi.getAllUser();
        },
        userbyid(parent, { id }, { dataSources }) {
            return dataSources.userApi.getUserbyId(id);
        },
        userbyusername(parent, { username }, { dataSources }) {
            // console.log(user);
            return dataSources.userApi.getUserbyUsername(username);
        },
        ideas(parent, { pages, page }, { dataSources }) {
            return dataSources.ideaApi.getAllIdea(page, pages);
        },
        ideasbyid(parent, { id }, { dataSources }) {
            return dataSources.ideaApi.getIdeabyId(id);
        },
        ideasbytag(parent, { tag }, { dataSources }) {
            return dataSources.ideaApi.getIdeabytag(tag);
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
        },
        login: async (_, { password, username }, { dataSources }) => {
            console.log("usernutation");
            return dataSources.userApi.loginUser({ password, username });
        },
        createIdea: async (_, { title, description, tags }, { dataSources }) => {
            console.log("Idea Creation");
            return dataSources.ideaApi.createIdea({ title, description, tags });
        }
    },
};

module.exports = resolvers;