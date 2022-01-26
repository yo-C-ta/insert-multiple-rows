# Insert Multiple Rows

![version](https://img.shields.io/github/package-json/v/yo-C-ta/insert-multiple-rows.svg) ![issue](https://img.shields.io/github/issues/yo-C-ta/insert-multiple-rows.svg) ![rate](https://img.shields.io/visual-studio-marketplace/r/yo-C-ta.insert-multiple-rows.svg) ![download](https://img.shields.io/visual-studio-marketplace/d/yo-C-ta.insert-multiple-rows.svg) ![Build Status](https://github.com/yo-C-ta/insert-multiple-rows/actions/workflows/build.yml/badge.svg)

A extension to insert sequential number / bit-field / character to multi-cursor rows.

## Features

All features calculate digits automatically and insert from any number.

USAGE: Set multi-cursor and call bellow commands.

> Attention: Insertion is performed cursor-selection-order.

### _Command_: Insert decimal to multiple rows :1234:

![Insert decimal demo](./images/dec.gif)

### _Command_: Insert bitfield to multiple rows :zero:

![Insert bitfield demo](./images/bit.gif)

### _Command_: Insert character to multiple rows :capital_abcd:

![Insert character demo](./images/char.gif)

## Extension Settings

-   `insertDecimalToMultipleRows.paddingChar`
    -   What: padding character for "Insert decimal to multiple rows" command
    -   Default: '0'
    -   Value: single character

## Example of use

### Make sample csv

![csv sample](./images/example/make_csv.gif)

### Insert C define macros

![c sample](./images/example/c_define.gif)

### Insert to 10,000 rows

![10000 rows](./images/example/10000rows.gif)

## [Release Note](./CHANGELOG.md)
