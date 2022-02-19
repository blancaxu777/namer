const path = require("path");

const templatePath = path.resolve(__dirname, "..", "src", "index.html");
const entryPath = path.resolve(__dirname, "..", "src", "index.js");
const srcPath = path.resolve(__dirname, "..", "src");
const distpath = path.resolve(__dirname, "..", "build");

module.exports = {
  entryPath,
  templatePath,
  srcPath,
  distpath,
};
