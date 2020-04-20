const { dbs } = require("../dbs");
const ObjectId = require("mongodb").ObjectId;
const CONNECTION = "connections";
const nsp = require("../middlewares/socketio");

module.exports.setConnection = async (id, socketId) => {
  let newConnection = {
    parent: ObjectId(id),
    connectionString: Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, "0"),
    socketId,
    time: new Date(),
  };
  const connections = await dbs.production
    .collection(CONNECTION)
    .insertOne(newConnection);
  if (connections.nInserted === 0) {
    return false;
  }
  return newConnection.connectionString;
};

module.exports.newConnectionString = async (id) => {
  let newConnectionString = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, "0");
  const newConnection = await dbs.production.collection(CONNECTION).update(
    { parent: ObjectId(id) },
    {
      $set: {
        connectionString: newConnectionString,
        time: new Date(),
      },
    }
  );
  if (newConnection.nMatched === 1 && newConnection.nModified === 1) {
    return newConnectionString;
  }
  return false;
};

module.exports.getConnection = async (connectionString) => {
  const connection = await dbs.production
    .collection(CONNECTION)
    .findOne({ connectionString });
  if (!connection) {
    return false;
  }
  return connection;
};

module.exports.removeConnection = async (connectionString) => {
  const connection = await dbs.production
    .collection(CONNECTION)
    .remove({ connectionString });
  if (!connection) {
    return false;
  }
  return connection;
};