'use strict';

const FS = require('fs');
const program = require('commander');
const PATH = require('path');

function safeReadDirSync (path, depth, option) {
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
            directories.push(path + '/' +file);
        }
        else if (stats.isFile()) {
            files.push(file);
        }
    });
    path = PATH.basename(path);
    viewDir({path , directories, files}, depth, option);
}

function viewDir(item, depth, option){
    item['directories'].forEach((element, index, arr) => {
        if ((index + 1 == arr.length) && (item['files'].length == 0 || option == '-d')){
            console.log(depth + '└── ' + PATH.basename(element));
            safeReadDirSync(element, depth + '   ', option);
        } else {
            console.log(depth + '├── ' + PATH.basename(element));
            safeReadDirSync(element, depth + '│   ', option);
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
    .command('tree [path]')
    .description('Show tree')
    .option('-d, --directories','Only directories')
    .action((path, options) => {
        if (path === undefined) path = '.';
        console.log(path);
        FS.stat(path, (err, stat) => {
            let mode = options.directories ? '-d':'';
            if ((err == null) &&  stat.isDirectory()){
                safeReadDirSync(path , '', mode);
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
