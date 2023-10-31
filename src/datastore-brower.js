import Datastore from "nedb";
import path from "path";
import fs from "fs";
// eslint-disable-next-line
import { remote } from 'electron';

const dbBrowers = new Datastore({
  autoload: true,
  filename: path.join(remote.app.getPath("userData"), "/browers.db")
});

export default dbBrowers;
