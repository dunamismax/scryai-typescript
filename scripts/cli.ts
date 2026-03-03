import { bootstrap } from "./tasks/bootstrap";
import { doctor } from "./tasks/doctor";
import {
  doctorProjects,
  installProjects,
  listProjects,
  verifyProjects,
} from "./tasks/projects";
import { setupConfigBackup } from "./tasks/setup-config-backup";
import { setupSshBackup, setupSshRestore } from "./tasks/setup-ssh";
import { setupWorkstation } from "./tasks/setup-workstation";
import { syncOpenclaw } from "./tasks/sync-openclaw";
import { syncRemotes } from "./tasks/sync-remotes";
import { syncWorkDesktop } from "./tasks/sync-work-desktop";
import { verifyConfigBackup } from "./tasks/verify-config-backup";

const command = Bun.argv[2];

const commands: Record<string, () => void> = {
  bootstrap,
  doctor,
  "setup:workstation": setupWorkstation,
  "setup:config_backup": setupConfigBackup,
  "verify:config_backup": verifyConfigBackup,
  "setup:ssh_backup": setupSshBackup,
  "setup:ssh_restore": setupSshRestore,
  "projects:list": listProjects,
  "projects:doctor": doctorProjects,
  "projects:install": installProjects,
  "projects:verify": verifyProjects,
  "sync:openclaw": syncOpenclaw,
  "sync:remotes": syncRemotes,
  "sync:work-desktop": syncWorkDesktop,
};

if (!command || !commands[command]) {
  console.error(`Unknown or missing command: ${command ?? "(none)"}`);
  console.error("Available commands:");
  for (const key of Object.keys(commands)) {
    console.error(`- ${key}`);
  }
  process.exit(1);
}

try {
  commands[command]();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`error: ${message}`);
  process.exit(1);
}
