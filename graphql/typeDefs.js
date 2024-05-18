// All the TypeDefs for graphql

const typeDefs = `
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
        c_scheduled_at: String
        c_image: String
        c_video: String
        likes: Int
        comments: [Comment]
    }

    type Comment {
        id: ID!
        cmt_active: Boolean!
        cmt_post: Int!
        cmt_author: Int!
        cmt_text: String!
        cmt_disabled: Boolean!
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
        getContentById(id: ID!): Content
        getContentFromFollowing(id: ID!): [Content]

        getAllComments: [Comment]
        getLikesOfPost(id: ID!): Int
        getCommentFromFollowing(id: ID!): [Comment]

        getFeed(id: ID!): [Content]
    }

    type Mutation {
        
        registerUser(username: String!, password: String!, firstname: String!, lastname: String!, email: String!): AuthPayLoad!
        followUser(followerid: ID!, followingid: ID!): Boolean!
        
        makeContent(cAuthor: ID!, cText: String!, cImage: String, cVideo: String): Boolean!
        removeContent(id: ID!): Boolean!
        
        createComment(cmt_post: Int!, cmt_author: Int!, cmt_text: String!): Boolean!
        removeComment(id: ID!): Boolean!
        editComment(id: ID!, cmt_text: String!): Boolean!
        disableEnableComment(id: ID!): Boolean!

        createOrRemoveLike(liked_by: Int!, liked_content: Int!): Boolean!
    }
`;

module.exports = typeDefs;
