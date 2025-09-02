import {type CommandsRegistry, registerCommand, runCommand,} from "./commands/commands";
import { handlerLogin, handlerRegister} from "./commands/users";

async function  main() {
  const args = process.argv.slice(2);

  //check if a non empty command is being typed
  if(args.length < 1) {
    console.log("usage: cli <command> [args....]");
    process.exit(1);
  }
  
  const cmdName = args[0]; 
  const cmdArgs = args.slice(1);
  const commandsRegistry: CommandsRegistry = {};
  
  //add login command to the commands registry
  registerCommand(commandsRegistry, "login", handlerLogin);
  //add register command to the commands registry
  registerCommand(commandsRegistry, "register", handlerRegister);
  
  //----------add any new commands in the future like help, users etc.,-----------//

  //check for any errors
  try {
    await runCommand(commandsRegistry, cmdName, ...cmdArgs);
  } catch (err){
    if(err instanceof Error) {
      console.log(`Error running command, ${cmdName} ${err.message}`);
    } else {
      console.log(`Error running command, ${cmdName} ${err}`);
    }
    process.exit(1);
  }
  process.exit(0);
}

main();