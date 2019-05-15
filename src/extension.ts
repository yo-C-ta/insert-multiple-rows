'use strict';

import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    console.log(
        'Congratulations, your extension "insert-multiple-rows" is now active!'
    );

    /*------------------------------------------------------------------------------------------*/
    /*  Insert cursor support function                                                          */
    /*------------------------------------------------------------------------------------------*/
    const insCursorToOtherRows = (
        editor: vscode.TextEditor,
        sels: vscode.Selection[],
        insRows: () => void
    ) => {
        if (sels.length === 1) {
            vscode.window
                .showInputBox({
                    value: '1',
                    prompt: 'How many rows?',
                    validateInput: param => {
                        const regex = /^[0-9]+$/;
                        return regex.test(param) ? '' : 'input: decimal number';
                    },
                })
                .then(value => {
                    if (value === undefined || editor === undefined) {
                        return;
                    }
                    const linenum = parseInt(value, 10);
                    const curline = sels[0].start.line + 1;
                    for (
                        let lnum = curline;
                        lnum < curline + linenum - 1 &&
                        lnum < editor.document.lineCount;
                        lnum++
                    ) {
                        const cnum = editor.document.lineAt(lnum).text.length;
                        const position = new vscode.Position(lnum, cnum);
                        sels.push(new vscode.Selection(position, position));
                    }
                    insRows();
                });
        } else {
            insRows();
        }
    };

    /*------------------------------------------------------------------------------------------*/
    /*  Insert decimal to multiple rows                                                         */
    /*------------------------------------------------------------------------------------------*/
    const insDecMulrowsCmd = vscode.commands.registerCommand(
        'extension.insDecMulrows',
        () => {
            vscode.window
                .showInputBox({
                    value: '1',
                    prompt: 'Insert dec from:',
                    validateInput: param => {
                        const regex = /^[0-9]+$/;
                        return regex.test(param) ? '' : 'input: decimal number';
                    },
                })
                .then(value => {
                    const editor = vscode.window.activeTextEditor;
                    if (value === undefined || editor === undefined) {
                        return;
                    }
                    const sels = editor.selections;
                    let num = parseInt(value, 10);

                    const insertDec = () => {
                        const padconf = vscode.workspace
                            .getConfiguration()
                            .get('insertDecimalToMultipleRows.paddingChar');
                        if (
                            padconf === undefined ||
                            typeof padconf !== 'string'
                        ) {
                            return;
                        }
                        const padding = padconf.charAt(0).repeat(10);
                        const digit =
                            Math.trunc(
                                0.435 * Math.log(sels.length + num - 1)
                            ) + 1;
                        editor.edit(edit => {
                            sels.forEach(select => {
                                const text = (
                                    padding + (num++).toString()
                                ).slice(-digit);
                                edit.insert(select.start, text);
                            });
                        });
                    };
                    insCursorToOtherRows(editor, sels, insertDec);
                });
        }
    );

    /*------------------------------------------------------------------------------------------*/
    /*  Insert bitfield to multiple rows                                                        */
    /*------------------------------------------------------------------------------------------*/
    const insBitFldMulrowsCmd = vscode.commands.registerCommand(
        'extension.insBitFldMulrows',
        () => {
            vscode.window
                .showInputBox({
                    value: '0x01',
                    valueSelection: [2, 4],
                    prompt: 'Insert bitfield from:',
                    validateInput: param => {
                        const regex = /^0x0{0,7}[1248]0{0,7}$/;
                        return regex.test(param)
                            ? ''
                            : "input: bitfield ('0x' format)";
                    },
                })
                .then(value => {
                    const editor = vscode.window.activeTextEditor;
                    if (value === undefined || editor === undefined) {
                        return;
                    }
                    const sels = editor.selections;
                    let shift = Math.trunc(
                        1.443 * Math.log(parseInt(value, 16))
                    );

                    const insertBf = () => {
                        let digit = 8;
                        if (sels.length + shift <= 8) {
                            digit = 2;
                        } else if (sels.length + shift <= 16) {
                            digit = 4;
                        }
                        editor.edit(edit => {
                            sels.forEach(select => {
                                const text = (1 << shift)
                                    .toString(16)
                                    .toUpperCase();
                                edit.insert(
                                    select.start,
                                    '0x' + ('0'.repeat(8) + text).slice(-digit)
                                );
                                shift++;
                            });
                        });
                    };
                    insCursorToOtherRows(editor, sels, insertBf);
                });
        }
    );

    /*------------------------------------------------------------------------------------------*/
    /*  Insert charcter to multiple rows                                                        */
    /*------------------------------------------------------------------------------------------*/
    const insCharMulrowsCmd = vscode.commands.registerCommand(
        'extension.insCharMulrows',
        () => {
            vscode.window
                .showInputBox({
                    value: 'A',
                    prompt: 'Insert char from:',
                    validateInput: param => {
                        const regex = /^[a-zA-Z]+$/;
                        return regex.test(param) ? '' : 'input: charactor';
                    },
                })
                .then(value => {
                    const editor = vscode.window.activeTextEditor;
                    if (value === undefined || editor === undefined) {
                        return;
                    }
                    let len = value.split('').length;
                    let num = value
                        .split('')
                        .map(elm => {
                            let char = elm.charCodeAt(0);
                            char -= char <= 91 ? 65 : 97;
                            return char * Math.pow(26, --len);
                        })
                        .reduce((prv, current) => {
                            return prv + current;
                        });
                    const sels = editor.selections;

                    const insertChar = () => {
                        const digit =
                            Math.trunc(
                                0.307 * Math.log(sels.length + num - 1)
                            ) + 1;
                        editor.edit(edit => {
                            sels.forEach(select => {
                                const text = (
                                    '0'.repeat(10) + (num++).toString(26)
                                ).slice(-digit);
                                edit.insert(
                                    select.start,
                                    text
                                        .split('')
                                        .map(elm => {
                                            return String.fromCharCode(
                                                parseInt(elm, 26) + 65
                                            ).toString();
                                        })
                                        .join('')
                                );
                            });
                        });
                    };
                    insCursorToOtherRows(editor, sels, insertChar);
                });
        }
    );

    /*------------------------------------------------------------------------------------------*/

    context.subscriptions.push(insDecMulrowsCmd);
    context.subscriptions.push(insBitFldMulrowsCmd);
    context.subscriptions.push(insCharMulrowsCmd);
}

export function deactivate() {}
