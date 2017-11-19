var path = require('path');
var fs = require('fs');
var EventEmitter = require('events').EventEmitter;

var componentPath = path.join(__dirname, "component");

function findFile() {
    var emitter = new EventEmitter();
    fs.readdirSync(componentPath).forEach(function (dir) {
        fs.readFile('./component/' + dir + '/package.json', 'utf8', function (err, data) {
            if (err) {
                return emitter.emit('error', err);
            } else {
                var infor = JSON.parse(data);
                if (infor['main'] != null) {
                    var pathFile = './component/' + dir + '/' + infor['main'];
                    emitter.emit('found', pathFile);
                } else {
                    emitter.emit('fileNotFound');
                }
                //require('./component/' + dir + '/' + infor['main']);
            }
        })
    })
    return emitter;
}

findFile()
    .on('found', function (pathFile) {
        require(pathFile);
    })
    .on('fileNotFound', function() {
        console.log("File not found for main in the package.json");
    })
    .on('error', function() {
        console.log("Error while loading component!!!");
    })