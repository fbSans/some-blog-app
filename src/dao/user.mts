import { DatabaseSync } from "node:sqlite";
import * as bcrypt from "bcrypt";

export type User = {id?: number, email: string, name: string, password?: string}

export async function new_user(db: DatabaseSync, {name, email, password}: User){
   if(!password) return {changes: 0, message: 'password must be provided'};
   const salt_rounds = 10;
   let encrypted_pass = await bcrypt.hash(password as string, salt_rounds);
   
   const prepared = db.prepare(`insert into user values (:name, :email, :password)`);
   const result = prepared.run({name, email, password: encrypted_pass});
   return {changes: result.changes, message: result.changes > 0 ? "sucessfull" : "database did not insert"};
}

export async function check_pass(db: DatabaseSync, {email, password}: User){
   if(!password) return {result: false, message: "password must be provided."};
   const prepared = db.prepare(`select * from users where email=:email`);
   const user = prepared.get({email});
   if(!user) return {result: false, message: "system failure, no password"};
   if(!user.password) return false; // this is actual a failure on the system, but password must be set
   const comparison = await bcrypt.compare(password as string, user.password.toString())
   await {result: comparison, message: comparison ? "sucessfull" : "password did not match"};
}