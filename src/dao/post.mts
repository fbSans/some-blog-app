import { DatabaseSync } from "node:sqlite";


export function all(db: DatabaseSync){
   const prepared = db.prepare("select * from posts");
   return prepared.all();
}
