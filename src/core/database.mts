//// node:sqlite is a experimental module
//// This file is here just to test some ideas

//All functions here may be cleaned to make a specific project
import { DatabaseSync } from "node:sqlite";
import { DB_PATH, DB_DIR, NR_ROUTE_ITEM } from "./common.mjs";


export function get_db(){
   return  new DatabaseSync(DB_PATH)
}

type Model = {[key: string]: any}
type WhereOperator = '=' | '>' | '>=' | '<' | '<=' | '<>' | 'LIKE'
type WhereOperation = {operand_name: string, operator?: string} 

//TODO: handle precendence
export interface QueryBuilder {
   select(keys: string[]): QueryBuilder;
   update(model: Model): QueryBuilder;
   insert(model: Model): QueryBuilder; //For now will support only one model, many models insert in the future
   delete(): QueryBuilder;
   where(whereOperation: WhereOperation): QueryBuilder;
   orWhere(WhereOperation: WhereOperation): QueryBuilder;
   build(): string;
   reset(): void;
}
// `Where -> Statament` is the direction that makes sense because this way we have all wheres and we can build the whole query
// Will consider this in the next version

export function makeQuery(table: string): QueryBuilder {
   let buffer: string = '';
   let hasWhere: boolean = false;
   let prefix: string|undefined = undefined;
   let methodCount: number = 0;

   return {
      reset() {
         buffer = '';
         hasWhere = false;
         prefix = undefined;
         methodCount = 0;
         return this;
      },
      select(keys){ 
         methodCount++;
         if(prefix) throw new Error(`cannot append \`select\` in ${buffer}, check your ${methodCount} call on this object`);
         prefix = 'select';
         buffer = 'select '
         buffer += makeProject(keys)
         return this
      },
      update(model){
         methodCount++;
         if(prefix) throw new Error(`cannot append \`update\` in ${buffer}, check your ${methodCount} call on this object`);
         prefix = 'update';

         buffer = `update ${table} set `
         buffer += makeSet(model);
         return this
      },
      insert(model){
         methodCount++;
         if(prefix) throw new Error(`cannot append \`insert\` in ${buffer}, check your ${methodCount} call on this object`);
         prefix = 'insert'
         buffer = `insert into ${table} `;
         buffer += makeInsertValues(model);
         return this
      },
      delete(){
         methodCount++;
         if(prefix) throw new Error(`cannot append \`delete\` in ${buffer}, check your ${methodCount} call on this object`);
         prefix = `delete`;
         buffer = `delete from ${table} `;
         return this
      },
      where(whereOperation){
         if(!prefix) throw new Error(`cannot append where in ${buffer}, because the base statement was not given`);
         if(prefix == 'insert') throw new Error(`cannot append \`where\` in ${buffer}, because it has ${prefix}`);
         if(!whereOperation.operator) whereOperation.operator = '=';
         
         if(!hasWhere) {
            if(prefix === 'select') buffer += `from ${table} `
            buffer += 'where ';
            hasWhere = true;
         } else {
            buffer += 'and '
         }
         buffer += `${whereOperation.operand_name} ${whereOperation.operator} :${whereOperation.operand_name} `
         return this;
      },
      orWhere(whereOperation){
         if(!prefix) throw new Error(`cannot append where in ${buffer}, because the base statement was not given`);
         if(prefix == 'insert') throw new Error(`cannot append \`orWhere\` in ${buffer}, because it has ${prefix}`);
         if(!whereOperation.operator) whereOperation.operator = '='

         if(!hasWhere) {
            if(prefix === 'select') buffer += `from ${table} `
            buffer += 'where ';
            hasWhere = true;
         } else {
            buffer += 'or '
         }
         buffer += `${whereOperation.operand_name} ${whereOperation.operator} :${whereOperation.operand_name} `
         return this;
      },
      build() {
         if(!hasWhere) {
            if(prefix === 'select' && !hasWhere) buffer += `from ${table} `
         }
         return buffer;
      } 
   }
}

function makeProject(keys: string[]){
   let result = "";
   for(let i = 0; i < keys.length; ++i){
      if(i > 0) result += ", ";
      result += `${keys[i]}`
   }
   return result + " ";
}

function makeInsertValues(model: Model){
   let result = "";
   let found_first = false;
   const keys = Object.keys(model);

   result += "("
   for(let i = 0; i < keys.length; ++i){
      if(!model[keys[i]]) continue;
      if(found_first) result += ",";
      if(!found_first) found_first = true;

      result += `${keys[i]}`;
   }
   result += ") ";

   found_first = false;
   result += "values ("
   for(let i = 0; i < keys.length; ++i){
      if(!model[keys[i]]) continue;
      if(found_first) result += ",";
      if(!found_first) found_first = true;

      result += model[keys[i]];
      console.log(model, keys[i], model[keys[i]]);
   }
   result += ")";

   return result;
}

function makeSet(model: Model){
   let result = "";
   let found_first = false;
   const keys = Object.keys(model);

   for(let i = 0; i < keys.length; ++i){
      if(!model[keys[i]]) continue;
      if(found_first) result += ", ";
      if(!found_first) found_first = true;

      result += `${keys[i]}=:${keys[i]}`;
   }

   return result + " ";
}

 






