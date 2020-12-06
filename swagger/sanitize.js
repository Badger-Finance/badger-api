var jsonfile = require("jsonfile")
var file = "./swagger.json";

jsonfile.readFile(file, function(err, obj) {
    if (err) {
        console.error(err);
    } else {
        var result = JSON.parse(JSON.stringify(obj, function(key, value) {
            return key !== "options" ? value : undefined;
        }));
        jsonfile.writeFile(file, result, function(err) {
            err ? console.error(err) : console.log("swagger.json exported successfully.");
        })
    }
})
