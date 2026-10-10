import { MongoClient } from "mongodb";

export default class MongoDB {
  static client;

  static connect = async (uri) => {
    if (this.client) return this.client;
    this.client = await MongoClient.connect(uri);
    return this.client;
  };
}