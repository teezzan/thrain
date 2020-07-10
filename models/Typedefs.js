const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Query {  user: UserArrayUpdateResponse! 
                userbyid(id: ID!): UserUpdateResponse! 
                userbyusername(username: String!): UserUpdateResponse! 
                ideas(pages: Int!, page: Int! ): IdeaArrayUpdateResponse! 
                ideasbytag(tag: [String]!) : IdeaArrayUpdateResponse!
                ideasbyid(id: ID!) : IdeaUpdateResponse!
                }
  type User { 
              fullname: String, 
              email:String, 
              username:String!,
              verified: Boolean!,
              ideas: [Idea]!,
              liked_ideas: [Idea],
              comments: [Comment]!
   }
   type Idea { 
              id: ID!
              title: String!, 
              description:String!, 
              author: User!,
              timeCreated: String!,
              tags: [String]!,
              likes: Int!,
              comments: [Comment]!
   }
   type Comment { 
              text: String!, 
              author: User!,
              timeCreated: String!,
              likes: Int!,
              replies: [Comment]!
   
   }
   type UserUpdateResponse {
      status: String!
      message: String
      user: User
      token: String
      error: String
    }
    type UserArrayUpdateResponse {
      status: String!
      message: String
      users: [User]
      token: String
      error: String
      
    }
    type IdeaUpdateResponse {
      status: String!
      message: String
      idea: Idea
      error: String
    }
    type IdeaArrayUpdateResponse {
      status: String!
      message: String
      ideas: [Idea]
      error: String
    }
    type CommentUpdateResponse {
      status: String!
      message: String
      comment: Comment
      error: String
    }
   type Mutation {
          login(username: String!, password: String!): UserUpdateResponse! # login token 
          register(email: String!, password: String!, username: String!): UserUpdateResponse! # login token 
          createIdea(title: String!, description: String!, tags: [String]!): IdeaUpdateResponse!
          deleteIdea(id: ID!): IdeaUpdateResponse!
          commentIdea(id: ID!, text: String!): IdeaUpdateResponse!
          replyComment(id: ID!, text: String!): CommentUpdateResponse!

          
  }
`;


module.exports = typeDefs