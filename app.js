'use strict';

const FS = require('fs');
const COMMANDER = require('commander');

var folder = "./";


if (process.argv[2] != undefined) {
    folder = process.argv[2];
}

function safeReadDirSync (path, depth) {
    let dirData = [];
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
            if (index + 1 == dirData.length) {
                console.log(depth + '└' + file)
            } else {
                console.log(depth + '├' + file)
            }
            safeReadDirSync(path + '/' +file, depth + '│   ');
        }
        else if (stats.isFile()) {
            files.push(file);
        }
    });

    files.forEach((file, index) => {
        if (index + 1 == files.length) {
            console.log(depth + '└' + file)
        } else {
            console.log(depth + '├' + file)
        }

    });
}

safeReadDirSync(folder, '');