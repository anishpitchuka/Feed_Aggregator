import { setUser } from "src/config";

export function handlerLogin(cmdName: string, ...args: string[]) {
    if(args.length === 0) {
        throw new Error(`usage: ${cmdName} <username>`);
    }
    const userName = args[0];
    setUser(userName);
    console.log(`User is switched successfully`);
}