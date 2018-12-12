'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "insert-multiple-rows" is now active!');

    /*------------------------------------------------------------------------------------------*/
    /*  Insert decimal to multiple rows                                                         */
    /*------------------------------------------------------------------------------------------*/
    let insDecMulrowsCmd = vscode.commands.registerCommand(
        'extension.insDecMulrows',
        () => {
            vscode.window
                .showInputBox({
                    value: '1',
                    prompt: 'Insert dec from:',
                    validateInput: param => {
                        var regex = /^[0-9]+$/;
                        return regex.test(param) ? '' : 'input: decimal number';
                    }
                })
                .then(value => {
                    var editor = vscode.window.activeTextEditor;
                    if (value === undefined || editor === undefined) { return; }
                    var sels = editor.selections;
                    var text = parseInt(value, 10);
                    editor.edit(edit => {
                        sels.forEach(select => {
                            edit.insert(select.start, (text++).toString());
                        });
                    });
                });
        }
    );

    /*------------------------------------------------------------------------------------------*/
    /*  Insert hexadecimal to multiple rows                                                     */
    /*------------------------------------------------------------------------------------------*/
    let insHexMulrowsCmd = vscode.commands.registerCommand(
        'extension.insHexMulrows',
        () => {
            vscode.window
                .showInputBox({
                    value: '0x01',
                    prompt: 'Insert hex from:',
                    validateInput: param => {
                        let regex = /^0x[0-9A-Fa-f]{1,8}$/;
                        return regex.test(param) ? '' : 'input: hexadecimal (\'0x\' format) number';
                    }
                })
                .then(value => {
                    var editor = vscode.window.activeTextEditor;
                    if (value === undefined || editor === undefined) { return; }
                    var shift = Math.round(Math.LOG2E * Math.log(parseInt(value, 16)));
                    var sels = editor.selections;
                    var digit = 8;
                    if (sels.length + shift <= 8) { digit = 2; }
                    else if (sels.length + shift <= 16) { digit = 4; }
                    editor.edit(edit => {
                        sels.forEach(select => {
                            var text = (1 << shift).toString(16).toUpperCase();
                            text = ('00000000' + text).slice(-digit);
                            edit.insert(select.start, '0x' + text);
                            shift++;
                        });
                    });
                });
        }
    );

    /*------------------------------------------------------------------------------------------*/
    /*  Insert charcter to multiple rows                                                        */
    /*------------------------------------------------------------------------------------------*/
    let insCharMulrowsCmd = vscode.commands.registerCommand(
        'extension.insCharMulrows',
        () => {
            vscode.window
                .showInputBox({
                    value: 'A',
                    prompt: 'Insert char from:',
                    validateInput: param => {
                        var regex = /^[a-zA-Z]+$/;
                        return regex.test(param) ? '' : 'input: charactor';
                    }
                })
                .then(value => {
                    var editor = vscode.window.activeTextEditor;
                    if (value === undefined || editor === undefined) { return; }
                    var len = value.split('').length;
                    var num = value.split('').map(elm => {
                        var char = elm.charCodeAt(0);
                        char -= char <= 91 ? 65 : 97;
                        return char * Math.pow(26, --len);
                    }).reduce((prv, current) => {
                        return prv + current;
                    });
                    var sels = editor.selections;
                    var digit = Math.trunc(0.307 * Math.log(sels.length + num - 1)) + 1;
                    editor.edit(edit => {
                        sels.forEach(select => {
                            var text = ('0000000000' + (num++).toString(26)).slice(-digit);
                            edit.insert(select.start, text.split('').map(elm => {
                                return String.fromCharCode(
                                    parseInt(elm, 26) + 65
                                ).toString();
                            }).join(''));
                        });
                    });
                });
        }
    );

    /*------------------------------------------------------------------------------------------*/

    context.subscriptions.push(insDecMulrowsCmd);
    context.subscriptions.push(insHexMulrowsCmd);
    context.subscriptions.push(insCharMulrowsCmd);
}

// this method is called when your extension is deactivated
export function deactivate() {
}