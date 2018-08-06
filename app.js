const fs = require('fs');
const commander = require('commander');

var folder = "./";


if (process.argv[2] != undefined) {
    folder = process.argv[2];
}

/*fs.readdir(folder, function (err, files) {
    if (err) return console.error(err);
    var arr = [];
    files.forEach(function(file) {
            console.log(file);
            var stats = fs.lstatSync(folder + '/' + file);

            if (stats.isDirectory()) {
                arr.push(folder + '\\' + file);
            }
    });
});*/

function Tree(folder){
    fs.readdir(folder, function (err, files){
        if (err) return console.error(err);
        files.forEach(function(file) {
            if (fs.lstatSync(folder + '/' + file).isDirectory()) {
                Tree(folder + '/' + file);
            }

            console.log(file);
        });
    });
}

Tree(folder);