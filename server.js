// Necessary imports
const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const resolvers = require("./graphql/resolvers");
const typeDefs = require("./graphql/typeDefs");
const { GraphQLError } = require("graphql");
const { verifyToken } = require("./configs/jwt");

// Function starting server
async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
      const token = req.headers.authorization || "";
      console.log("Token:", token);
      return { token };
    },
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 8000 },
    context: async ({ req }) => {
      try {
        if (
          req.body.operationName === "registerUser" ||
          req.body.operationName === "loginUser"
        )
          return;
        const token = (req.headers.authorization || "").split(" ")[1];
        const { username } = verifyToken(token);
        if (!username) {
          throw new GraphQLError("User is not authenticated", {
            extensions: {
              code: "UNAUTHENTICATED",
              http: { status: 401 },
            },
          });
        }
      } catch (error) {
        throw new GraphQLError("User is not authenticated", {
          extensions: {
            code: "UNAUTHENTICATED",
            http: { status: 401 },
          },
        });
      }
    },
  });

  console.log(`🚀 Apollo Server is running at ${url}`);
}

startServer();
