import { DatabaseSync } from "node:sqlite";

export function incr_item_count(db: DatabaseSync, item: string){
   const prepared = db.prepare(`update counts set value = value + 1 where item=:item`);
   const result = prepared.run({item})
   return result
}

export function get_item_count(db: DatabaseSync, item: string){
   const prepared = db.prepare(`select value from counts where item = :item`);
   const  result = prepared.get({item})
   return result ? Number(result.value) : 0; 
}

export function new_item(db: DatabaseSync, item: string){
   const prepared = db.prepare(`insert or ignore into counts (item) values (:item)`);
   const result = prepared.run({item})
}