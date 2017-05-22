var express = require('express');
var router = express.Router();
var ActiveDirectory = require('activedirectory');
var bunyan = require('bunyan');
var _ = require('underscore');
var my_log = bunyan.createLogger({
    name: 'ActiveDirectory',
    streams: [
        { level: 'info',
            stream: process.stdout }
    ]
});
var options = require('./options');
var config = {
    url: options.storageConfig.LDAPSERVER,
    baseDN: options.storageConfig.BASEDN,
    username: options.storageConfig.USERNAME,
    password: options.storageConfig.PASSWORD,
    log:my_log
};


router.get('/sailak', function(req, res, next) {
    var query = 'CN=SAILA-*';

    var ad = new ActiveDirectory(config);


    ad.findGroups(query, function(err, groups) {
        if (err) {
            console.log('ERROR: ' +JSON.stringify(err));
            return;
        }

        if ((! groups) || (groups.length == 0)) console.log('No groups found.');
        else {
            // console.log('findGroups: '+JSON.stringify(groups));
            res.json (groups);
        }
    });


});

router.get('/getgroupandusers/:cn', function(req, res, next) {
    var param = req.params.cn;
    var groupName = param;

    var ad = new ActiveDirectory(config);
    // ad.getUsersForGroupWithGroups(groupName, function(err, users) {
    ad.getUsersForGroupWithGroups(groupName, function(err, users) {
        if (err) {
            console.log('ERROR: ' +JSON.stringify(err));
            return;
        }

        if (! users) console.log('Group: ' + groupName + ' not found.');
        else {
            // console.log(JSON.stringify(users));
            res.json(users);
        }
    });

});



module.exports = router;
