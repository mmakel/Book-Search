import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type Query {
    me: User
  }

  type Mutation {
    login(email: String!, password: String!): AuthPayload
    signup(username: String!, email: String!, password: String!): AuthPayload
  }

  type User {
    _id: ID!
    username: String!
    email: String!
  }

  type AuthPayload {
    token: String
    user: User
  }
`;

export default typeDefs;