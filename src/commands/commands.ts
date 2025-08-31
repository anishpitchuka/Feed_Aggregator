export type CommandHandler = (cmdName: string, ...args: string[]) => void;
export type CommandsRegistry = Record<string, CommandHandler>;

export function registerCommand(
    register: CommandsRegistry,
    cmdName: string,
    handler: CommandHandler,
) : void {
    register[cmdName] = handler;
}

export function runCommand(
    register: CommandsRegistry,
    cmdName: string,
    ...args: string[]
) : void {
    const handler = register[cmdName];
    if(!handler){
        throw new Error(`Unknown Command: ${cmdName}`);
    };
    handler(cmdName, ...args);
}