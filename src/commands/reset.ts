import { deleteUsers } from "src/lib/db/queries/users";
export async function handlerReset(_:string) {
    await deleteUsers();
    console.log(`Database has been reset successfully`);
}