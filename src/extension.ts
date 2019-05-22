'use strict';

import {
    commands,
    window,
    workspace,
    TextEditor,
    Position,
    Selection,
    ExtensionContext,
} from 'vscode';

import { EOL } from 'os';

export function activate(context: ExtensionContext) {
    console.log(
        'Congratulations, your extension "insert-multiple-rows" is now active!'
    );

    /*------------------------------------------------------------------------------------------*/
    /*  Insert cursor support function                                                          */
    /*------------------------------------------------------------------------------------------*/
    const insertMultipleRows = (
        editor: TextEditor,
        insertion: (ss: Selection[]) => void
    ) => {
        const sels = editor.selections;
        if (sels.length !== 1) {
            insertion(sels);
        } else {
            window
                .showInputBox({
                    value: '1',
                    prompt: 'How many rows?',
                    validateInput: param => {
                        const regex = /^[0-9]+$/;
                        return regex.test(param) ? '' : 'input: decimal number';
                    },
                })
                .then(async value => {
                    const lastLineCnt = editor.document.lineCount - 1;
                    const lastLine = editor.document.lineAt(lastLineCnt);
                    const remLineCnt =
                        editor.document.lineCount - sels[0].start.line;
                    const insLineCnt =
                        value !== undefined ? parseInt(value, 10) : 1;
                    await editor.edit(edit => {
                        if (insLineCnt > remLineCnt) {
                            edit.insert(
                                new Position(lastLineCnt, lastLine.text.length),
                                EOL.repeat(insLineCnt - remLineCnt)
                            );
                        }
                    });

                    const curLine = sels[0].start.line + 1;
                    for (
                        let lnum = curLine;
                        lnum < curLine + insLineCnt - 1;
                        lnum++
                    ) {
                        const cnum = editor.document.lineAt(lnum).text.length;
                        const position = new Position(lnum, cnum);
                        sels.push(new Selection(position, position));
                    }
                    editor.selections = sels;
                    insertion(sels);
                });
        }
    };

    /*------------------------------------------------------------------------------------------*/
    /*  Insert decimal to multiple rows                                                         */
    /*------------------------------------------------------------------------------------------*/
    const insDecMulrowsCmd = commands.registerCommand(
        'extension.insDecMulrows',
        () => {
            window
                .showInputBox({
                    value: '1',
                    prompt: 'Insert dec from:',
                    validateInput: param => {
                        const regex = /^[0-9]+$/;
                        return regex.test(param) ? '' : 'input: decimal number';
                    },
                })
                .then(value => {
                    const editor = window.activeTextEditor;
                    if (value === undefined || editor === undefined) {
                        return;
                    }

                    let num = parseInt(value, 10);
                    const insertDec = (ss: Selection[]) => {
                        const padconf = workspace
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
                            Math.trunc(0.435 * Math.log(ss.length + num - 1)) +
                            1;
                        editor.edit(edit => {
                            ss.forEach(select => {
                                const text = (
                                    padding + (num++).toString()
                                ).slice(-digit);
                                edit.insert(select.start, text);
                            });
                        });
                    };
                    insertMultipleRows(editor, insertDec);
                });
        }
    );

    /*------------------------------------------------------------------------------------------*/
    /*  Insert bitfield to multiple rows                                                        */
    /*------------------------------------------------------------------------------------------*/
    const insBitFldMulrowsCmd = commands.registerCommand(
        'extension.insBitFldMulrows',
        () => {
            window
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
                    const editor = window.activeTextEditor;
                    if (value === undefined || editor === undefined) {
                        return;
                    }

                    let shift = Math.trunc(
                        1.443 * Math.log(parseInt(value, 16))
                    );
                    const insertBf = (ss: Selection[]) => {
                        let digit = 8;
                        if (ss.length + shift <= 8) {
                            digit = 2;
                        } else if (ss.length + shift <= 16) {
                            digit = 4;
                        }
                        editor.edit(edit => {
                            ss.forEach(select => {
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
                    insertMultipleRows(editor, insertBf);
                });
        }
    );

    /*------------------------------------------------------------------------------------------*/
    /*  Insert charcter to multiple rows                                                        */
    /*------------------------------------------------------------------------------------------*/
    const insCharMulrowsCmd = commands.registerCommand(
        'extension.insCharMulrows',
        () => {
            window
                .showInputBox({
                    value: 'A',
                    prompt: 'Insert char from:',
                    validateInput: param => {
                        const regex = /^[a-zA-Z]+$/;
                        return regex.test(param) ? '' : 'input: charactor';
                    },
                })
                .then(value => {
                    const editor = window.activeTextEditor;
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
                    const insertChar = (ss: Selection[]) => {
                        const digit =
                            ss.length > 1
                                ? Math.trunc(
                                      0.307 * Math.log(ss.length + num - 1)
                                  ) + 1
                                : 1;
                        editor.edit(edit => {
                            ss.forEach(select => {
                                const text = (
                                    '0'.repeat(10) + (num++).toString(26)
                                )
                                    .slice(-digit)
                                    .split('')
                                    .map(elm => {
                                        return String.fromCharCode(
                                            parseInt(elm, 26) + 65
                                        ).toString();
                                    })
                                    .join('');
                                edit.insert(select.start, text);
                            });
                        });
                    };
                    insertMultipleRows(editor, insertChar);
                });
        }
    );

    /*------------------------------------------------------------------------------------------*/

    context.subscriptions.push(insDecMulrowsCmd);
    context.subscriptions.push(insBitFldMulrowsCmd);
    context.subscriptions.push(insCharMulrowsCmd);
}

export function deactivate() {}
