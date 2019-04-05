# :pencil: Insert Multiple Rows

![version](https://img.shields.io/github/package-json/v/yo-C-ta/insert-multiple-rows.svg) ![issue](https://img.shields.io/github/issues/yo-C-ta/insert-multiple-rows.svg) ![size](https://img.shields.io/github/repo-size/yo-C-ta/insert-multiple-rows.svg) ![license](https://img.shields.io/github/license/yo-C-ta/insert-multiple-rows.svg) ![rate](https://img.shields.io/visual-studio-marketplace/r/yo-C-ta.insert-multiple-rows.svg) ![download](https://img.shields.io/visual-studio-marketplace/d/yo-C-ta.insert-multiple-rows.svg)

A extension to insert sequential number / bit-field / character to multi-cursor rows.

## Features

All features calculate digits automatically and insert from any number.

USAGE: Set multi-cursor and call bellow commands.

> Attention: Insertion is performed cursor-selection-order.

### _Command_: :1234: Insert decimal to multiple rows

> Image sample sets a space to `insertDecimalToMultipleRows.paddingChar`

![Insert decimal](./images/decimal.png)

### _Command_: :zero: Insert bitfield to multiple rows

![Insert bitfield](./images/bitfield.png)

### _Command_: :capital_abcd: Insert charcter to multiple rows

![Insert charcter](./images/character.png)

## Extension Settings

- `insertDecimalToMultipleRows.paddingChar`
  - What: padding character for "Insert decimal to multiple rows" command
  - Default: '0'
  - Value: single character

## [Release Note](./CHANGELOG.md)
