export type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>;
export type CommandsRegistry = Record<string, CommandHandler>;

export function registerCommand(
    register: CommandsRegistry,
    cmdName: string,
    handler: CommandHandler,
) : void {
    register[cmdName] = handler;
}

export async function runCommand(
    register: CommandsRegistry,
    cmdName: string,
    ...args: string[]
) : Promise <void> {
    const handler = register[cmdName];
    if(!handler){
        throw new Error(`Unknown Command: ${cmdName}`);
    };
    await handler(cmdName, ...args);
}