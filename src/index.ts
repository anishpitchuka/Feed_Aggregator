import {type CommandsRegistry, registerCommand, runCommand,} from "./commands/commands";
import { handlerLogin } from "./commands/users";

function main() {
  const args = process.argv.slice(2);

  if(args.length < 1) {
    console.log("usage: cli <command> [args....]");
    process.exit(1);
  }
  
  const cmdName = args[0];
  const cmdArgs = args.slice(1);
  const commandsRegistry: CommandsRegistry = {};

  registerCommand(commandsRegistry, "login", handlerLogin);
  try {
    runCommand(commandsRegistry, cmdName, ...cmdArgs);
  } catch (err){
    if(err instanceof Error) {
      console.log(`Error running command, ${cmdName} ${err.message}`);
    } else {
      console.log(`Error running command, ${cmdName} ${err}`);
    }
    process.exit(1);
  }
}

main();