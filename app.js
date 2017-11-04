var path = require('path');
var fs = require('fs');

var componentPath = path.join(__dirname, "component");
fs.readdirSync(componentPath).forEach(function(dir) {
    console.log("dir ", dir);
    
    fs.readFile('./component/' + dir + '/package.json', 'utf8', function(err, data) {
        if(err) {
            console.log("Error while loading component!!!");
        } else {
            var infor = JSON.parse(data);
            require('./component/' + dir + '/' + infor['main']);
        }
    })
}) 