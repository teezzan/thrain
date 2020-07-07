const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Query { books: [Book], author: [Author] }
  type Book { title: String, author: Author }
  type Author { name: String, age: String }
  type User { 
              fullname: String, 
              email:String, 
              username:String,
              password: String,
              verified: Boolean,
              ideas: [Idea],
              liked_ideas: [Idea],
              comments: [Comment]
   }
   type Idea { 
              title: String, 
              description:String, 
              author: User,
              timeCreated: String,
              tags: [String],
              likes: Int,
              comments: [Comment]
   }
   type Comment { 
              text: String, 
              author: User,
              timeCreated: String,
              likes: Int,
              replies: [Comment]
   }
`;


module.exports = typeDefs