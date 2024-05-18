// All the resolvers for graphql

const pool = require("../configs/dbConfigs");
const { createToken } = require("../configs/jwt");

const resolvers = {
  Query: {
    hello: () => "Hello world!",

    // User
    getAllUsers: async () => {
      try {
        const users = await pool.query("SELECT * FROM users");
        return users.rows;
      } catch (error) {
        console.log("ERROR: ", error);
      }
    },

    getUserById: async (parent, { id }) => {
      try {
        const user = await pool.query(
          "SELECT * FROM users WHERE id = $1 LIMIT 1",
          [id]
        );
        return user.rows[0];
      } catch (error) {
        console.log("ERROR: ", error);
      }
    },

    getUserByUsername: async (parent, { username }) => {
      try {
        const user = await pool.query(
          "SELECT * FROM users WHERE username = $1 LIMIT 1",
          [username]
        );
        return user.rows[0];
      } catch (error) {
        console.log("ERROR: ", error);
      }
    },
    loginUser: async (parent, { username, password }) => {
      try {
        const user = await pool.query(
          "SELECT * FROM users WHERE username = $1 LIMIT 1",
          [username]
        );
        if (!user.rows[0]) {
          throw new Error("Invalid user");
        }
        if (user.rows[0].password !== password) {
          throw new Error("Invalid password");
        }
        const authPayLoad = {
          token: createToken(user.rows[0]),
          user: user.rows[0],
        };
        return authPayLoad;
      } catch (error) {
        throw new Error(error);
      }
    },

    findUsersByName: async (parent, { name }) => {
      // we will check if the name is in firstname or lastname
      try {
        const users = await pool.query(
          "SELECT * FROM users WHERE firstname LIKE $1 OR lastname LIKE $1",
          [`%${name}%`]
        );
        return users.rows;
      } catch (error) {
        console.log("ERROR: ", error);
        throw new Error(error);
      }
    },

    // Content
    getAllContent: async () => {
      try {
        const allContent = await pool.query(
          "SELECT * FROM content WHERE c_active = true"
        );
        return allContent.rows;
      } catch (error) {
        console.log("ERROR: ", error);
      }
    },

    getContentFromFollowing: async (parent, { id }) => {
      try {
        const following = await pool.query(
          "SELECT followingid FROM followings WHERE followerid = $1",
          [id]
        );
        const followingIds = following.rows.map((follow) => follow.followingid);

        const content = await pool.query(
          "SELECT * FROM content WHERE c_author = ANY($1) AND c_active = true",
          [followingIds]
        );
        console.log(content.rows);
        return content.rows;
      } catch (error) {
        console.log("ERROR: ", error);
      }
    },

    getContentById: async (parent, { id }) => {
      try {
        const content = await pool.query(
          "SELECT * FROM content WHERE id = $1 AND c_active = true",
          [id]
        );
        return content.rows[0];
      } catch (error) {
        console.log("ERROR: ", error);
      }
    },

    // Comments
    getAllComments: async () => {
      try {
        const comments = await pool.query(
          "SELECT * FROM comment WHERE cmt_active = true ORDER BY id ASC"
        );
        return comments.rows;
      } catch (error) {
        console.log("ERROR: ", error);
      }
    },

    getLikesOfPost: async (parent, { id }) => {
      console.log(id);
      try {
        const likes = await pool.query(
          "SELECT COUNT(*) FROM likes WHERE liked_content = $1 AND like_active = true",
          [id]
        );
        console.log(likes.rows[0].count);
        return likes.rows[0].count;
      } catch (error) {
        console.log("ERROR: ", error);
      }
    },
  },

  Mutation: {
    registerUser: async (
      parent,
      { username, password, firstname, lastname, email }
    ) => {
      try {
        // Checking if username is already taken
        const prevUser = await pool.query(
          "SELECT COUNT(*) FROM users WHERE username = $1",
          [username]
        );

        if (prevUser.rows[0].count > 0) {
          throw new Error("Username already taken");
        }

        // Insert new user into the database
        const registerUser = await pool.query(
          "INSERT INTO users (username, password, firstname, lastname, email) VALUES ($1, $2, $3, $4, $5)",
          [username, password, firstname, lastname, email]
        );

        const userDetail = await pool.query(
          "SELECT * FROM users WHERE username = $1",
          [username]
        );
        const authPayLoad = {
          token: createToken(userDetail.rows[0]),
          user: userDetail.rows[0],
        };
        return authPayLoad;
      } catch (error) {
        throw new Error(error);
      }
    },
    followUser: async (parent, { followerid, followingid }) => {
      try {
        // first we check if both users exist
        const follower = await pool.query(
          "SELECT COUNT(*) AS COUNT FROM users WHERE id = $1",
          [followerid]
        );
        const following = await pool.query(
          "SELECT COUNT(*) AS COUNT FROM users WHERE id = $1",
          [followingid]
        );
        if (follower.rows[0].count === 0 || following.rows[0].count === 0) {
          throw new Error("User not found");
        }

        // secondly we check if the user already followed or not
        const didFollowed = await pool.query(
          "SELECT COUNT(*) AS COUNT FROM followings WHERE followerid = $1 AND followingid = $2",
          [followerid, followingid]
        );
        if (didFollowed.rows[0].count > 0) {
          throw new Error("Already followed");
        }

        // at last we follow
        await pool.query(
          "INSERT INTO followings (followerid, followingid) VALUES ($1, $2)",
          [followerid, followingid]
        );
        return true;
      } catch (error) {
        throw new Error(error);
      }
    },
    makeContent: async (parent, { cAuthor, cText, cImage, cVideo }) => {
      try {
        // todo: upload image and video
        await pool.query(
          "INSERT INTO content (c_author, c_text, c_image, c_video) VALUES ($1, $2, $3, $4)",
          [cAuthor, cText, cImage, cVideo]
        );
        return true;
      } catch (error) {
        throw new Error(error);
      }
    },
    removeContent: async (parent, { id }) => {
      try {
        pool.query("UPDATE content SET c_active = false WHERE id = $1", [id]); // updating the c_active so it will become unactive
        return true;
      } catch (error) {
        throw new Error(error);
      }
    },

    // Comments
    createComment: async (parent, { cmt_post, cmt_author, cmt_text }) => {
      if (!cmt_text) throw new Error("Comment text is required");
      // first we check if the post or author exists or not
      const post = await pool.query(
        "SELECT COUNT(*) AS COUNT FROM content WHERE id = $1",
        [cmt_post]
      );
      const author = await pool.query(
        "SELECT COUNT(*) AS COUNT FROM users WHERE id = $1",
        [cmt_author]
      );

      if (post.rows[0].count == 0 || author.rows[0].count == 0) {
        throw new Error("Post or author not found");
      }
      try {
        await pool.query(
          "INSERT INTO comment (cmt_post, cmt_author, cmt_text) VALUES ($1, $2, $3)",
          [cmt_post, cmt_author, cmt_text]
        );
        return true;
      } catch (error) {
        throw new Error(error);
      }
    },

    removeComment: async (parent, { id }) => {
      try {
        // todo: also check if the user is the author or not and if the comment is already deleted or not
        await pool.query(
          "UPDATE comment SET cmt_active = false WHERE id = $1",
          [id]
        ); // updating the c_active so it will become inactive
        return true;
      } catch (error) {
        throw new Error(error);
      }
    },

    editComment: async (parent, { id, cmt_text }) => {
      try {
        // first we check if the comment exists or not
        const comment = await pool.query(
          "SELECT COUNT(*) AS COUNT FROM comment WHERE id = $1",
          [id]
        );
        if (comment.rows[0].count == 0) {
          throw new Error("Comment not found");
        }
        await pool.query("UPDATE comment SET cmt_text = $1 WHERE id = $2", [
          cmt_text,
          id,
        ]);
        return true;
      } catch (error) {
        throw new Error(error);
      }
    },

    // Likes
    createOrRemoveLike: async (parent, { liked_by, liked_content }) => {
      try {
        // first we check if the user and content exists or not
        const user = await pool.query(
          "SELECT COUNT(*) AS COUNT FROM users WHERE id = $1",
          [liked_by]
        );
        const content = await pool.query(
          "SELECT COUNT(*) AS COUNT FROM content WHERE id = $1",
          [liked_content]
        );
        if (user.rows[0].count == 0 || content.rows[0].count == 0) {
          throw new Error("User or content not found");
        }
        // secondly we check if the user already liked the content or not
        const didLiked = await pool.query(
          "SELECT COUNT(*) AS COUNT FROM likes WHERE liked_by = $1 AND liked_content = $2",
          [liked_by, liked_content]
        );
        console.log(didLiked.rows[0].count);
        if (didLiked.rows[0].count > 0) {
          await pool.query(
            "UPDATE likes SET like_active = NOT like_active WHERE liked_by = $1 AND liked_content = $2",
            [liked_by, liked_content]
          );
          return true;
        }
        await pool.query(
          "INSERT INTO likes (liked_by, liked_content) VALUES ($1, $2)",
          [liked_by, liked_content]
        );
        return true;
      } catch (error) {
        throw new Error(error);
      }
    },
  },
};

module.exports = resolvers;
