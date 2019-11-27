# o-tmux

> open vsc .code-workspace file&#39;s folder

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/o-tmux.svg)](https://npmjs.org/package/o-tmux)
[![Downloads/week](https://img.shields.io/npm/dw/o-tmux.svg)](https://npmjs.org/package/o-tmux)
[![License](https://img.shields.io/npm/l/o-tmux.svg)](https://github.com/songlairui/o-tmux/blob/master/package.json)

# Preview

| Command                  | Desktop                          |
| ------------------------ | -------------------------------- |
| [![asciicast][^svg]][^1] | ![Desktop](./preview/o-tmux.gif) |

输入 vsc code-workspace 打开预置 panes 的 tmux

# Usage

```bash
o-tmux [workspaceFileName]

o-tmux deving
# 或者
o-tmux deving.code-workspace
```

# Commands

`o-tmux -h` 查看帮助

```bash
$ o-tmux -h

输入 vsc code-workspace 打开 tmux with panes

USAGE
  $ o-tmux [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  workspace file
  -v, --version    show CLI version
```

[^1]: https://asciinema.org/a/283863
[^svg]: https://asciinema.org/a/283863.svg
