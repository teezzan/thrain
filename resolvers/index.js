

const resolvers = {
    Query: {
        user(parent, args, { dataSources }) {
            return dataSources.userApi.getAllUser();
        },
        userbyid(parent, { id }, { dataSources }) {
            return dataSources.userApi.getUserbyId(id);
        },
        userbyusername(parent, { username }, { dataSources }) {
            // console.log("number 1");
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
    Idea: {
        author(parent, args, { dataSources }) {
            return dataSources.userApi.getUserbyIdGen(parent.author);
        },
        comments(parent, {page, pages}, { dataSources }) {
            // console.log("pareeenting", args);
            return dataSources.commentApi.getCommentsbyIdGen(parent._id, page, pages);
        },
    },
    User: {
        ideas(parent, args, { dataSources }) {
            // console.log(parent);

            return dataSources.ideaApi.getIdeasbyUsernameGen(parent.username);
        },
        liked_ideas(parent, args, { dataSources }) {
            // console.log(parent);

            return dataSources.ideaApi.getLikedIdeasbyUsernameGen(parent.username);
        },
        comments(parent, {page, pages}, { dataSources }) {
            // console.log("pareeenting", parent);
            return dataSources.commentApi.getCommentsbyUsernameGen(parent.username, page, pages);
            // return []
        }
    },
    Comment: {
        author(parent, args, { dataSources }) {
            return dataSources.userApi.getUserbyIdGen(parent.author);
        },
        replies(parent, {page, pages}, { dataSources }) {
            return dataSources.commentApi.getRepliesbyIdGen(parent._id, page, pages);
        },
    },
    Mutation: {
        register: async (_, { email, password, username }, { dataSources }) => {
            console.log("regiteration");
            return dataSources.userApi.createUser({ email, password, username });
        },
        login: async (_, { password, username }, { dataSources }) => {
            console.log("Login");
            return dataSources.userApi.loginUser({ password, username });
        },
        createIdea: async (_, { title, description, tags }, { dataSources }) => {
            console.log("Idea Creation");
            return dataSources.ideaApi.createIdea({ title, description, tags });
        },
        commentIdea: async (_, { text, idea }, { dataSources }) => {
            console.log("Comment Creation");
            return dataSources.commentApi.createComment({ text, idea });
        },
        replyComment: async (_, { text, id }, { dataSources }) => {
            console.log("Reply Creation");
            return dataSources.commentApi.createReplyComment({ text, id });
        }
    },
};

module.exports = resolvers;