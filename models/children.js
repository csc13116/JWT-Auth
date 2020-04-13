const { dbs } = require("../dbs");
const ObjectId = require("mongodb").ObjectId;
const bcrypt = require("bcrypt");
const USERS = "users";
const CHILDREN = "childrens";
const POSITION = "positions";

module.exports.getPing = async (body) => {
  let ping = {
    latitude: body.latitude,
    longitude: body.longitude,
    children: ObjectId(body.id),
    time: Date.now(),
  };
  return await dbs.production.collection(POSITION).insertOne(ping);
};