#!/usr/bin/env node
const { program } = require("commander");

// 定义当前的版本
program.version(require("../package").version);

// 定义命令方法
program.usage("<command> [inPath] [toPath]");

program
  .command("start [paths...]")
  .description("Conversion from yaml to excel")
  .alias("-s")
  .action((paths) => require("./node-xlsx-program.js")(paths));

program.parse(process.argv);

if (!program.args.length) {
  program.help();
}