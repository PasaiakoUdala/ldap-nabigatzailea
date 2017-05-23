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
    /**************************************************************************************************************
     **************************************************************************************************************
     **** ADI!!!! funtzio hau ez da existitzen liburutegian, nik sortua da beraz gehitu behar da
     *************************************************************************************************************
     *************************************************************************************************************/
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

router.get('/users', function(req, res, next) {

    var query = 'cn=*';

    var ad = new ActiveDirectory(config);
    ad.findUsers(query, function(err, users) {
        if (err) {
            console.log('ERROR: ' +JSON.stringify(err));
            return;
        }

        if ((! users) || (users.length == 0)) console.log('No users found.');
        else {
            // console.log('findUsers: '+JSON.stringify(users));
            res.json(users)
        }
    });

});

router.get('/user/:user', function(req, res, next) {
    var param = req.params.user;
    var sAMAccountName = param;

    var ad = new ActiveDirectory(config);
    ad.findUser(sAMAccountName, function(err, user) {
        if (err) {
            console.log('ERROR: ' +JSON.stringify(err));
            return;
        }

        if (! user) console.log('User: ' + sAMAccountName + ' not found.');
        else res.json(user);
    });

});



router.get('/usergroups/:user', function(req, res, next) {
    var param = req.params.user;
    var sAMAccountName = param;

    var ad = new ActiveDirectory(config);
    ad.getGroupMembershipForUser(sAMAccountName, function(err, groups) {
        if (err) {
            console.log('ERROR: ' +JSON.stringify(err));
            return;
        }

        if (! groups) console.log('User: ' + sAMAccountName + ' not found.');
        // else console.log(JSON.stringify(groups));
        else res.json(groups);
    });

});

module.exports = router;
