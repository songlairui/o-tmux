import { spawnSync } from "child_process";
import { join } from "path";
import { readFileSync } from "fs";

interface VSCWorkspace {
  folders: {
    path: string;
  }[];
  setting: any;
}

export const sessionExists = (sessionName: string) =>
  spawnSync("tmux", ["list-session", "-F", "#{session_name}"])
    .stdout.toString()
    .trim()
    .split(/\n+/)
    .includes(sessionName);

export const removeSuffix = function(str: string, _suffix = ".code-workspace") {
  if (typeof str === "string" && str.endsWith(_suffix)) {
    str = str.slice(0, str.length - _suffix.length);
  }
  return str;
};

export function openTmux(workspaceName?: string, force?: boolean) {
  const sessionName = removeSuffix(workspaceName || "");
  if (!sessionName) {
    console.info("NO workspaceName !");
    process.exit(0);
  }
  if (force) {
    // 强行关闭 session
    spawnSync("tmux", ["kill-session", "-t", sessionName]);
  } else if (sessionExists(sessionName)) {
    console.info(
      `Exit 0 : Session for ${sessionName} already existed. add -f force re-create`
    );
    process.exit(0);
  }

  const targetFile = join(process.cwd(), `${sessionName}.code-workspace`);

  const { folders }: VSCWorkspace = JSON.parse(
    readFileSync(targetFile).toString() || JSON.stringify({ folders: [] })
  );

  const shellCommand = `tmux new -s ${sessionName} \\\\; \
${folders
  .filter(folder => folder.path.startsWith("/"))
  .map(folder => `send-keys '${folder.path}' C-m \\\\; `)
  .join("split-window -v \\\\; ")}\
`;

  const tellCommand = `\
tell application "Terminal"
  activate
  do script "${shellCommand}"
end tell\
`;

  // console.info("tellCommand", shellCommand);

  spawnSync("osascript", ["-e", tellCommand]);
}
