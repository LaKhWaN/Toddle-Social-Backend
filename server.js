// Necessary imports
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const resolvers = require("./graphql/resolvers");
const typeDefs = require("./graphql/typeDefs");

// Function starting server
async function startServer() {
  const server = new ApolloServer({
    typeDefs: typeDefs,
    resolvers: resolvers,
  });

  // creating express app
  const app = express();
  app.use(cors());
  app.use(bodyParser.json());

  await server.start();

  app.use("/graphql", expressMiddleware(server));

  app.listen(8000, () => {
    console.log(
      "🚀 Apollo Server is running on port http://localhost:8000/graphql"
    );
  });
}

startServer();
