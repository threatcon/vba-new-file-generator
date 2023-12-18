import * as vscode from "vscode";
const fs = require("fs");
const path = require("path");

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension.newVbaFile', async () => {

		if (vscode.window.activeTextEditor) {
			const folderPath = path.dirname(
			  vscode.window.activeTextEditor?.document.fileName
			  
			);
			console.log(folderPath);


        const fileName = await vscode.window.showInputBox({
            prompt: 'Enter a file name',
            placeHolder: 'e.g. MyFile'
        });

        if (fileName) {
            const fileExtension = await vscode.window.showQuickPick(['.cls', '.bas'], {
                placeHolder: 'Select a file extension'
            });

            if (fileExtension) {
				const fullFileName =  folderPath +'\\' + fileName + fileExtension;
				console.log(fullFileName);
                const fileContent = getFileContent(fileExtension, fileName);
				if (fs.existsSync(fullFileName) ) {
					vscode.window.showErrorMessage("ERROR! File Exists!");
					return;
				}
                
                // const uri = vscode.Uri.file(fullFileName);
                // const wsedit = new vscode.WorkspaceEdit();
                // wsedit.createFile(uri,{contents: new TextEncoder().encode(fileContent)});
                // let editDone = await vscode.workspace.applyEdit(wsedit);
                // console.log(editDone);
                // // wsedit.insert(uri, new vscode.Position(0, 0), fileContent);
                // // let successs = await vscode.workspace.applyEdit(wsedit);
                // // console.log(successs);
                // //await vscode.workspace.fs.writeFile(uri, new TextEncoder().encode(fileContent));

				fs.writeFileSync(fullFileName, fileContent);
              
                let  bottomPosition;
                
                if (fileExtension === '.cls') {
                bottomPosition = 14; 
                } else {
                bottomPosition = 3;
                }            

                let pos = new vscode.Position(bottomPosition,0);

				vscode.workspace.openTextDocument(vscode.Uri.file(fullFileName)).then(file => {
					vscode.window.showTextDocument(file, {selection: new vscode.Range(pos,pos)});
				});
			}
            }
        }
});

	vscode.window.showInformationMessage('VBA New File Generator Started!');
    context.subscriptions.push(disposable);
}

function getFileContent(fileExtension: string, fileName: string): string {
    if (fileExtension === '.cls') {
        return "VERSION 1.0 CLASS\r\n" +
"BEGIN\r\n" +
"MultiUse = -1  'True\r\n" +
"END\r\n" +
"Attribute VB_Name = \"" + fileName + "\"\r\n" +
"Attribute VB_GlobalNameSpace = False\r\n" +
"Attribute VB_Creatable = False\r\n" +
"Attribute VB_PredeclaredId = False\r\n" +
"Attribute VB_Exposed = False\r\n" +
"\r\n"+ 
"Option Explicit\r\n"
;
    } else if (fileExtension === '.bas') {
        return "Attribute VB_Name = \"" + fileName + "\"\r\n" +
"\r\n" +
"Option Explicit\r\n" ;
    }

    return '';
}

//const filePath = '/path/to/file.txt';
//const fileContent = 'This is the content of the file.';

//createFile(filePath, fileContent);

// This method is called when your extension is deactivated
export function deactivate() {}
