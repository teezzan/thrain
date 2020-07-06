const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Query { books: [Book], author: [Author] }
  type Book { title: String, author: Author }
  type Author { name: String, age: String }
`;


module.exports = typeDefs