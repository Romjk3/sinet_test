'use strict';

const FS = require('fs');
const COMMANDER = require('commander');
const PATH = require('path');

var folder = "./";


if (process.argv[2] != undefined) {
    folder = process.argv[2];
}

function safeReadDirSync (path) {
    let dirData = [];
    let directories = [];
    let files = [];

    try {
        dirData = FS.readdirSync(path);
    } catch(ex) {
        if (ex.code == "EPERM")
        //User does not have permissions, ignore directory
            return null;
        else throw ex;
    }

    dirData.forEach((file, index) => {
        let stats;
        try {stats = FS.statSync(path + '/' +file); }
        catch (e) { return null; }

        if (stats.isDirectory()) {
            directories.push(safeReadDirSync(path + '/' +file));
        }
        else if (stats.isFile()) {
            files.push(file);
        }
    });
    path = PATH.basename(path);
    return {path , directories, files};
}

function viewDir(item, depth, option){
    item['directories'].forEach((element, index, arr) => {
        if ((index + 1 == arr.length) && (item['files'].length == 0 || option == '-d')){
            console.log(depth + '└── ' + element['path']);
            viewDir(element, depth + '   ', option);
        } else {
            console.log(depth + '├── ' + element['path']);
            viewDir(element, depth + '│   ', option);
        }
    });
    if (option != '-d') {
        item['files'].forEach((element, index, arr) => {
            if (index + 1 == arr.length) {
                console.log(depth + '└── ' + element);
            } else {
                console.log(depth + '├── ' + element);
            }
        });
    }
}

viewDir(safeReadDirSync(folder), '', '-d');
