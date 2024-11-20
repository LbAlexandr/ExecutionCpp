import * as vscode from 'vscode';
import { exec } from 'child_process';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand('executioncpp.run-cpp', () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage('No active editor found.');
      return;
    }
    const document = editor.document;
    const filePath = document.fileName;
    const fileName = path.basename(filePath);
    const fileDir = path.dirname(filePath);
    const executableName = fileName.replace('.cpp', '.exe');
    const compileCommand = `g++ "${filePath}" -o "${path.join(fileDir, executableName)}"`;
    exec(compileCommand, { cwd: fileDir }, (compileError, compileStdout, compileStderr) => {
      if (compileError) {
        vscode.window.showErrorMessage(`Compilation failed: ${compileError.message}`);
        return;
      }
      if (compileStderr) {
        vscode.window.showErrorMessage(`Compilation error: ${compileStderr}`);
        return;
      }
      const runCommand = `"${path.join(fileDir, executableName)}"`;
      exec(runCommand, { cwd: fileDir }, (runError, runStdout, runStderr) => {
        if (runError) {
          vscode.window.showErrorMessage(`Execution failed: ${runError.message}`);
          return;
        }
        if (runStderr) {
          vscode.window.showErrorMessage(`Execution error: ${runStderr}`);
          return;
        }
        vscode.window.showInformationMessage(`Execution result:\n${runStdout}`);
      });
    });
  });

  context.subscriptions.push(disposable);
}
export function deactivate() {}

