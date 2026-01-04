const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

async function startMongoServer() {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  console.log('MongoDB Memory Server started at:', uri);
  return uri;
}

async function stopMongoServer() {
  if (mongoServer) {
    await mongoServer.stop();
    console.log('MongoDB Memory Server stopped');
  }
}

module.exports = { startMongoServer, stopMongoServer };
