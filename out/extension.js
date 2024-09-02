"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/extension.ts
var extension_exports = {};
__export(extension_exports, {
  activate: () => activate,
  deactivate: () => deactivate
});
module.exports = __toCommonJS(extension_exports);
var vscode = __toESM(require("vscode"));
function activate(context) {
  let disposable = vscode.commands.registerCommand("extension.cleanCommitMessage", () => {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      const document = editor.document;
      const text = document.getText();
      const cleanedText = text.replace(/^#.*$/gm, "").trim();
      const edit = new vscode.WorkspaceEdit();
      const fullRange = new vscode.Range(
        document.positionAt(0),
        document.positionAt(text.length)
      );
      edit.replace(document.uri, fullRange, cleanedText);
      vscode.workspace.applyEdit(edit);
    }
  });
  let removeHashDisposable = vscode.commands.registerCommand("extension.cleanSelectedText", () => {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      const document = editor.document;
      const selection = editor.selection;
      const selectedText = document.getText(selection);
      const cleanedText = selectedText.replace(/#/g, "");
      const edit = new vscode.WorkspaceEdit();
      edit.replace(document.uri, selection, cleanedText);
      vscode.workspace.applyEdit(edit);
    }
  });
  vscode.workspace.onDidOpenTextDocument(async (document) => {
    console.log(`Opened file: ${document.fileName}`);
    if (document.fileName.endsWith("COMMIT_EDITMSG")) {
      const userResponse = await vscode.window.showInformationMessage(
        "Yorum sat\u0131rlar\u0131n\u0131 silmek istiyor musunuz?",
        "Evet",
        "Hay\u0131r"
      );
      if (userResponse === "Evet") {
        vscode.commands.executeCommand("extension.cleanCommitMessage");
      }
    }
  });
  context.subscriptions.push(disposable);
  context.subscriptions.push(removeHashDisposable);
}
function deactivate() {
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activate,
  deactivate
});
