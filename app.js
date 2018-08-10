'use strict';

//Подключаем библиотеки
const FS = require('fs');
const program = require('commander');
const PATH = require('path');

//Функция для чтения папок и файлов path-путь depth - глубиина option - опции
function safeReadDirSync (path, depth, option) {
    let dirData = [];
    let directories = [];
    let files = [];

    //Читаем папки и файлы
    try {
        dirData = FS.readdirSync(path);
    } catch(ex) {
        if (ex.code == "EPERM")
        //Если нет доступа, пропускаем файл
            return null;
        else throw ex;
    }

    dirData.forEach(file => {
        let stats;
        //Берем данные о файле
        try {stats = FS.statSync(path + '/' +file); }
        catch (e) { return null; }
        //Добавляем файлы и папки в соотвествующие массивы
        if (stats.isDirectory()) {
            directories.push(path + '/' +file);
        }
        else if (stats.isFile()) {
            files.push(file);
        }
    });
    //Добавляем путь до файла
    path = PATH.basename(path);
    //Вызываем функцию для вывода в консоль
    viewDir({path , directories, files}, depth, option);
}

//Функция для вывода в консоль item-объект, где указан путь, файлы и папки, depth-глубина, option-опции вывода
function viewDir(item, depth, option){
    //Перебираем директории
    item['directories'].forEach((element, index, arr) => {
        if ((index + 1 == arr.length) && (item['files'].length == 0 || option == '-d')){
            console.log(depth + '└── ' + PATH.basename(element));
            //рекурсивно вызывем функцию чтения файлов и папок
            safeReadDirSync(element, depth + '   ', option);
        } else {
            console.log(depth + '├── ' + PATH.basename(element));
            //рекурсивно вызывем функцию чтения файлов и папок
            safeReadDirSync(element, depth + '│   ', option);
        }
    });
    if (option != '-d') {
        //При опции -d папки не выводим
        item['files'].forEach((element, index, arr) => {
            if (index + 1 == arr.length) {
                console.log(depth + '└── ' + element);
            } else {
                console.log(depth + '├── ' + element);
            }
        });
    }
}

//Используем commander.js для работы с консолью (парсинг комманд)

program
    .version('0.0.1')
    .description('sinet_test tree');

program
    .command('tree [path]')
    .description('Show tree')
    .option('-d, --directories','Only directories')
    .action((path, options) => {
        if (path === undefined) path = '.';
        console.log(PATH.basename(path));
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
