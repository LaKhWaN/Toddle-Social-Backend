// All the TypeDefs for graphql

const typeDefs = `
    scalar Upload

    type User {
        id: ID!
        username: String!
        password: String!
        firstname: String!
        lastname: String!
        email: String!
        followers: [User]
        following: [User]
    }

    type Content {
        id: ID!
        c_author: Int!
        c_active: Boolean!
        c_text: String!
        c_image: String
        c_video: String
    }

    type Comment {
        id: ID!
        cmt_active: Boolean!
        cmt_post: Int!
        cmt_author: Int!
        cmt_text: String!
    }

    type Likes {
        id: ID!
        like_active: Boolean!
        liked_by: Int!
        liked_content: Int!
    }
    
    type AuthPayLoad {
        token: String!
        user: User!
    }

    type Query {
        hello: String!
        
        getAllUsers: [User]
        getUserById(id: ID!): User
        getUserByUsername(username: String!): User
        loginUser(username: String!, password: String!): AuthPayLoad!
        findUsersByName(name: String!): [User]
        
        getAllContent: [Content]
        getContentFromFollowing(id: ID!): [Content]
        getContentById(id: ID!): Content

        getAllComments: [Comment]

        getLikesOfPost(id: ID!): Int
    }

    type Mutation {
        
        registerUser(username: String!, password: String!, firstname: String!, lastname: String!, email: String!): AuthPayLoad!
        followUser(followerid: ID!, followingid: ID!): Boolean!
        
        makeContent(cAuthor: ID!, cText: String!, cImage: String, cVideo: String): Boolean!
        removeContent(id: ID!): Boolean!
        
        createComment(cmt_post: Int!, cmt_author: Int!, cmt_text: String!): Boolean!
        removeComment(id: ID!): Boolean!
        editComment(id: ID!, cmt_text: String!): Boolean!

        createOrRemoveLike(liked_by: Int!, liked_content: Int!): Boolean!
    }
`;

module.exports = typeDefs;
