import { db } from "..";
import { users } from "../schema";
import { eq } from "drizzle-orm";
import { firstOrUndefined } from "./utils";

//creates a new user in the users table
export async function createUser(name: string) {
  const [result] = await db.insert(users).values({ name: name }).returning();
  return result;
}

//searches for the string which is given in the input exists in the users table
export async function getUser(name: string) {
  const result = await db.select().from(users).where(eq(users.name, name));
  return firstOrUndefined(result);
}

//deletes the records of database
export async function deleteUsers() {
   await db.delete(users);
}

//returns all the users in the database
export async function getUsers() {
  return db.select().from(users);
}