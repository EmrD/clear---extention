import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    // Register command that is triggered when a git commit message file is opened
    let disposable = vscode.commands.registerCommand('extension.cleanCommitMessage', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const document = editor.document;
            const text = document.getText();
            const cleanedText = text.replace(/^#.*$/gm, '').trim(); // Remove lines starting with '#'

            const edit = new vscode.WorkspaceEdit();
            const fullRange = new vscode.Range(
                document.positionAt(0),
                document.positionAt(text.length)
            );
            edit.replace(document.uri, fullRange, cleanedText);
            vscode.workspace.applyEdit(edit);
        }
    });

    // Register command to remove '#' from selected text
    let removeHashDisposable = vscode.commands.registerCommand('extension.cleanSelectedText', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const document = editor.document;
            const selection = editor.selection;
            const selectedText = document.getText(selection);

            // Remove all '#' characters from the selected text
            const cleanedText = selectedText.replace(/#/g, '');

            const edit = new vscode.WorkspaceEdit();
            edit.replace(document.uri, selection, cleanedText);
            vscode.workspace.applyEdit(edit);
        }
    });

    // Add listener for git commit message files
    vscode.workspace.onDidOpenTextDocument(async (document) => {
        console.log(`Opened file: ${document.fileName}`);

        if (document.fileName.endsWith('COMMIT_EDITMSG')) {
            const userResponse = await vscode.window.showInformationMessage(
                "Yorum satırlarını silmek istiyor musunuz?",
                "Evet",
                "Hayır"
            );

            if (userResponse === "Evet") {
                vscode.commands.executeCommand('extension.cleanCommitMessage');
            }
        }
    });

    context.subscriptions.push(disposable);
    context.subscriptions.push(removeHashDisposable);
}

export function deactivate() {}