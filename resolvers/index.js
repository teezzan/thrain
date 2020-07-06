var books = [{ title: "Legend of tomorrow", author: 1 },
{ title: "Who am I?", author: 2 },
{ title: "The One", author: 2 }]

var author = [
    { name: "Yusuf hassan", age: 10 },
    { name: "Jackie Chan", age: 98 },
    { name: "Jet li", age: 8 }
]

const resolvers = {
    Query: {
        books: () => books,
        author: () => author
    },
    Book: {
        author(parent) {
            console.log(parent);
            return {
                name: author[parent.author].name,
                age: author[parent.author].age,
            };
        }
    }
};

module.exports = resolvers;