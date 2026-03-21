import { get_db } from "../core/database.mjs"; 
import { new_item } from "../dao/counts.mjs";
import { DB_DIR, DB_PATH, NR_ROUTE_ITEM } from "../core/common.mjs";
import * as fs from "fs"

export function migrate(){
   const path = fs.mkdirSync(DB_DIR, {recursive: true});
   const db = get_db();
   console.log(`Running migrations on ${DB_PATH}`);
   db.exec(`
      CREATE TABLE IF NOT EXISTS counts (
         id INTEGER PRIMARY KEY AUTOINCREMENT,
         item TEXT UNIQUE,
         value INTEGER DEFAULT 0
      );
   `);


   db.exec(`
      CREATE TABLE IF NOT EXISTS users (
         id INTEGER PRIMARY KEY AUTOINCREMENT,
         email TEXT UNIQUE NOT NULL,
         name TEXT NOT NULL,
         password TEXT NOT NULL,
         created_at datatime NOT NULL default current_timestamp,
         updated_at datetime NOT NULL default current_timestamp,
         deleted_at datetime NULL
      );   
   `);

   db.exec(`
      CREATE TABLE IF NOT EXISTS posts (
         id INTEGER PRIMARY KEY AUTOINCREMENT,
         author_id INTEGER NOT NULL,
         title TEXT NOT NULL,
         content TEXT NOT NULL,
         posted_at DATETIME NOT NULL,
         updated_at DETETIME NOT NULL,
         deleted_at DETETIME NULL,
         UNIQUE (author_id, title, posted_at),
         FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
      );   
   `);

   new_item(db, NR_ROUTE_ITEM);
}