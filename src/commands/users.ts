import { readConfig, setUser } from "../config";
import { createUser, getUser, getUsers } from "../lib/db/queries/users";

//login function
export async function handlerLogin(cmdName: string, ...args: string[]) {
    if(args.length === 0) {
        throw new Error(`usage: ${cmdName} <username>`);
    }
    const userName = args[0];
    const existingUser = await getUser(userName);
    if(!existingUser) {
        throw new Error(`user ${userName} not found`);
    }
    setUser(existingUser.name);
    console.log(`user is switched successfully!!!`);
}
//register function
export async function handlerRegister(cmdName: string, ...args: string []) {
    if(args.length === 0) {
        throw new Error(`usage: ${cmdName} <name>`);
    }
    const userName = args[0];
    const user = await createUser(userName);
    if(!user) {
        throw new Error(`user ${userName} not found`);
    }
    setUser(user.name);
    console.log(`user is created successfully!!!`);
}

//users list function
export async function handlerUserList(_: string) {
    const users = await getUsers();
    const config = readConfig();
    for(let user of users) {
        if(user.name === config.currentUserName) {
            console.log(`* ${user.name} (current)`);
            continue;
        }
        console.log(`* ${user.name}`);
    }
}