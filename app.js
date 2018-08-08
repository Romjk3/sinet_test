'use strict';

const FS = require('fs');
const program = require('commander');
const PATH = require('path');

var folder = './';


/*if (process.argv[2] != undefined) {
    folder = process.argv[2];
}*/

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

    dirData.forEach(file => {
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

program
    .version('0.0.1')
    .description('sinet_test tree');

program
    .command('tree <path>')
    .description('Show tree')
    .option('-d, --directories','Only directories')
    .action((path, options) => {
        FS.stat(path, (err, stat) => {
            let mode = options.directories ? '-d':'';
            if ((err == null) &&  stat.isDirectory()){
                viewDir(safeReadDirSync(path), '', mode);
            } else if (stat.isFile()){
                console.log('Вы указали файл');
            } else if(err.code == 'ENOENT') {
                console.log('Такого каталога не существует', err.code);
            } else {
                console.log('Some other error: ', err.code);
            }
        });
    });

program.parse(process.argv);
