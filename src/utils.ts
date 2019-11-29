import { spawnSync } from "child_process";
import { resolve, parse } from "path";
import { readFileSync } from "fs";

interface FolderMeta {
  path: string;
}
interface VSCWorkspace {
  folders: FolderMeta[];
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

export async function openTmux(
  workspaceName?: string,
  force?: boolean,
  _new?: string
) {
  const { name: _sessionName, dir, base } = parseFilePath(workspaceName || "");
  const sessionName = _new ? `${_sessionName}__${_new}` : _sessionName;

  if (!sessionName || !_sessionName) {
    console.info("NO workspaceName !");
    throw new Error("NO workspaceName !");
  }
  if (force) {
    // 强行关闭 session
    spawnSync("tmux", ["kill-session", "-t", sessionName]);
  } else if (sessionExists(sessionName)) {
    const msg = `Exit 0 : Session for ${sessionName} already existed. add -f force re-create`;
    console.info(msg);
    throw new Error(msg);
  }

  const targetFile = resolve(process.cwd(), dir, base);

  const { folders }: VSCWorkspace = JSON.parse(
    readFileSync(targetFile).toString() || JSON.stringify({ folders: [] })
  );
  await createSession(sessionName);
  await attachSessionThenSplitPaneWithFolders(sessionName, folders);
}

export async function createSession(sessionName: string) {
  const tmuxCommand = `new -s ${sessionName} -d`;
  return spawnSync("tmux", tmuxCommand.split(/\s+/));
}

export async function attachSessionThenSplitPaneWithFolders(
  sessionName: string,
  folders: FolderMeta[]
) {
  const tmuxCommand = `tmux attach -t ${sessionName} \\\\;`;

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

  return spawnSync("osascript", ["-e", tellCommand]);
}
