var books = [{ title: "Legend of tomorrow", author: "Yusuf hassan" },
{ title: "Who am I?", author: "Jackie Chan" },
{ title: "The One", author: "Jet li" }]

const resolvers = {
    Query: {
        books: () => books,
    },
};

module.exports = resolvers;