import Dexie from "dexie";

const db = new Dexie("ChatDB");

db.version(1).stores({
  messages: "++id, roomId, sender, content, timestamp",
});

export default db;
