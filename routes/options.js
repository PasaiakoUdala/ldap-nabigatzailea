/**
 * Created by iibarguren on 5/22/17.
 */

var fs = require('fs'),
    configPath = './config.json';
var parsed = JSON.parse(fs.readFileSync(configPath, 'UTF-8'));
exports.storageConfig=  parsed;