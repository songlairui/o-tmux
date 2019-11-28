import { spawnSync } from "child_process";
import { resolve, parse } from "path";
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

export const parseFilePath = function(
  filePath: string,
  _suffix = ".code-workspace"
) {
  const { dir, name, ext } = parse(filePath);
  if (ext === _suffix) {
  }
  return { dir, name, base: `${name}${_suffix}` };
};

export function openTmux(
  workspaceName?: string,
  force?: boolean,
  _new?: boolean
) {
  const { name: sessionName, dir, base } = parseFilePath(workspaceName || "");
  if (!sessionName) {
    console.info("NO workspaceName !");
    throw new Error("NO workspaceName !");
  }
  if (force) {
    // 强行关闭 session
    spawnSync("tmux", ["kill-session", "-t", sessionName]);
  } else if (!_new && sessionExists(sessionName)) {
    const msg = `Exit 0 : Session for ${sessionName} already existed. add -f force re-create`;
    console.info(msg);
    throw new Error(msg);
  }

  const targetFile = resolve(process.cwd(), dir, base);

  const { folders }: VSCWorkspace = JSON.parse(
    readFileSync(targetFile).toString() || JSON.stringify({ folders: [] })
  );

  const tmuxCommand = _new
    ? `tmux new \\\\;`
    : `tmux new -s ${sessionName} \\\\;`;

  const shellCommand = `${tmuxCommand} \
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
