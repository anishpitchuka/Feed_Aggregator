import { handlerAgg } from "./commands/aggregate";
import {type CommandsRegistry, registerCommand, runCommand,} from "./commands/commands";
import { handlerFollow, handlerListFeedFollows } from "./commands/feed-follows";
import { handlerAddFeed, handlerListFeeds } from "./commands/feeds";
import { handlerReset } from "./commands/reset";
import { handlerLogin, handlerRegister, handlerUserList} from "./commands/users";
import { middlewareLoggedIn } from "./middleware";

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

  //add reset command to the commands registry
  registerCommand(commandsRegistry, "reset",handlerReset);
  
  //add users command to the commands registry
  registerCommand(commandsRegistry, "users", handlerUserList);

  //add agg command to the commands registry
  registerCommand(commandsRegistry, "agg", handlerAgg);
  
  //add addfeed command to the commands registry
  registerCommand(commandsRegistry, "addfeed", middlewareLoggedIn(handlerAddFeed));

  //add feeds command to the commands registry
  registerCommand(commandsRegistry, "feeds", handlerListFeeds);

  //add follow command to the commands registry
  registerCommand(commandsRegistry, "follow", middlewareLoggedIn(handlerFollow));

  //add following command to the commands registry
  registerCommand(commandsRegistry, "following", middlewareLoggedIn(handlerListFeedFollows));

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