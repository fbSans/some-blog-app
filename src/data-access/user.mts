import { DatabaseSync } from "node:sqlite";
import * as bcrypt from "bcrypt";
import { makeQuery } from "../server-core/database.mjs";
import { truthyProps } from "../server-core/common.mjs";

const table = 'user'
export type User = {id?: number, email: string, name: string, password?: string, created_at?: string, updated_at?: string, deleted_at?:string}

async function encryptPassword(plain: string) {
   const salt_rounds = 10;
   return await bcrypt.hash(plain as string, salt_rounds);
}

export async function email_taken(db: DatabaseSync, email: string){
   const prepared = db.prepare(`select email from ${table} where email=:email`);
   const result = prepared.get({email});
   return !!result;
}

export async function new_user(db: DatabaseSync, {name, email, password}: User){
   if(!password) return {changes: 0, message: 'password must be provided'};
   let encrypted_pass = await encryptPassword(password)
   const prepared = db.prepare(`insert into ${table} (name, email, password) values (:name, :email, :password)`);
   const result = prepared.run({name, email, password: encrypted_pass});
   return {changes: result.changes, message: result.changes > 0 ? "sucessfull" : "database did not insert"};
}

export async function check_pass(db: DatabaseSync, {email, password}: User){
   if(!password) return {result: false, message: "password must be provided."};
   const prepared = db.prepare(`select * from ${table} where email=:email`);
   const user = prepared.get({email});
   if(!user) return {result: false, message: "invalid credentials"};
   if(!user.password) return {result: false, message:'invalid credentials'}; // this is actual a failure on the system, but password must be set
   const comparison = await bcrypt.compare(password as string, user.password.toString())
   return {result: comparison, message: comparison ? "sucessfull" : "invalid credentials"};
}


export async function update(db: DatabaseSync, user: User) {
   // return {changes: result.changes, message: result.changes > 0 ? "sucessfull" : "database did not insert"};
   if(user.password) user.password = await encryptPassword(user.password);
   user = truthyProps(user) as User;
   const {id,...rest} = user;
   const query: string = makeQuery(table).update(rest).where({operand_name: 'id',}).build()
   const prepared = db.prepare(query);

   const result = prepared.run(user);
   return {changes: result.changes, message: result.changes > 0 ?"update sucessful" : "no changes"};
}

export function find(db: DatabaseSync, id: number){
   const query = makeQuery(table).select(['*']).where({operand_name: 'id'}).build();
   const prepared = db.prepare(query);
   const result = prepared.get({id});
   if(result && result.password){
      delete result.password;
   }
   return result; 
}

export function byEmail(db: DatabaseSync, email: string) {
   const query = makeQuery(table).select(['*']).where({operand_name: 'email'}).build();
   const prepared = db.prepare(query);
   const result = prepared.get({email});
   if(result && result.password){
      delete result.password;
   }
   return result;
}

export function all(db: DatabaseSync){
   const prepared = db.prepare(`select * from ${table}`);
   return prepared.all();
} 



