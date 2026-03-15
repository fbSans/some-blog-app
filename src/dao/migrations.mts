import { get_db } from "../database.mjs"; 
import { new_item } from "../dao/counts.mjs";
import { DB_DIR, DB_PATH, NR_ROUTE_ITEM } from "../common.mjs";
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
         password TEXT NOT NULL
      );   
   `);

   new_item(db, NR_ROUTE_ITEM);
}