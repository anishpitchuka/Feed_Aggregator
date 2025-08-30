import { readConfig, setUser } from "./config";
function main() {
  setUser("Lane");
  const cfg = readConfig();
  console.log(cfg);
}

main();
