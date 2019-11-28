import { Command, flags } from "@oclif/command";
import { openTmux } from "./utils";

class OTmux extends Command {
  static description = "输入 vsc code-workspace 打开 tmux with panes";

  static flags = {
    // add --version flag to show CLI version
    version: flags.version({ char: "v" }),
    help: flags.help({ char: "h" }),
    // flag with no value (-f, --force)
    force: flags.boolean({ char: "f" }),
    // flag with no value (-n, --new)
    new: flags.boolean({ char: "n" })
  };

  static args = [{ name: "file" }];

  async run() {
    const { args, flags } = this.parse(OTmux);
    const target = args.file;

    this.log(`target ${target} ${flags.force ? "[FORCE]" : ""}`);

    openTmux(target, flags.force, flags.new);
  }
}

export = OTmux;
