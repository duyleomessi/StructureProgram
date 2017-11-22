var path = require('path');
var fs = require('fs');
var util = require('util');
var EventEmitter = require('events').EventEmitter;

var componentPath = path.join(__dirname, "component");

function FindFile() {
    EventEmitter.call(this);
}
util.inherits(FindFile, EventEmitter);

FindFile.prototype.findFile = function () {
    var self = this;
    fs.readdirSync(componentPath).forEach(function (dir) {
        fs.readFile('./component/' + dir + '/package.json', 'utf8', function (err, data) {
            if (err) {
                return self.emit('error', err);
            } else {
                var infor = JSON.parse(data);
                if (infor['main'] != null) {
                    var pathFile = './component/' + dir + '/' + infor['main'];
                    self.emit('found', pathFile);
                } else {
                    self.emit('fileNotFound');
                }
            }
        })
    })
    return this;
}

var findFindObject = new FindFile();

findFindObject
    .findFile()
    .on('found', function (pathFile) {
        require(pathFile);
    })
    .on('fileNotFound', function () {
        console.log("File not found for main in the package.json");
    })
    .on('error', function () {
        console.log("Error while loading component!!!");
    })