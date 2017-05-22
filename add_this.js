/******************************************************************************************************************************************************
 *
 /******************************************************************************************************************************************************

 /**
 * For the specified group, retrieve all of the users that belong to the group.
 *
 * @public
 * @param {Object} [opts] Optional LDAP query string parameters to execute. { scope: '', filter: '', attributes: [ '', '', ... ], sizeLimit: 0, timelimit: 0 }
 * @param {String} groupName The name of the group to retrieve membership from.
 * @param {Function} callback The callback to execute when completed. callback(err: {Object}, users: {Array[User]})
 */
ActiveDirectory.prototype.getUsersForGroupWithGroups = function getUsersForGroup(opts, groupName, callback) {
    var self = this;

    if (typeof(groupName) === 'function') {
        callback = groupName;
        groupName = opts;
        opts = undefined;
    }
    log.trace('getUsersForGroup(%j,%s)', opts, groupName);

    var users = [];
    var groups = [];

    self.findGroup(_.defaults({}, _.omit(opts || {}, 'attributes'), {
            attributes: joinAttributes((opts || {}).attributes || defaultAttributes.group, [ 'member' ])
        }),
        groupName, function(err, group) {
            if (err) {
                if (callback) callback(err);
                return;
            }

            // Group not found
            if (! group) {
                if (callback) callback(null, group);
                return;
            }
            // If only one result found, encapsulate result into array.
            if (typeof(group.member) === 'string') {
                group.member = [ group.member ];
            }

            /**
             * Breaks the large array into chucks of the specified size.
             * @param {Array} arr The array to break into chunks
             * @param {Number} chunkSize The size of each chunk.
             * @returns {Array} The resulting array containing each chunk
             */
            function chunk(arr, chunkSize) {
                var result = [];
                for (var index = 0, length = arr.length; index < length; index += chunkSize) {
                    result.push(arr.slice(index,index + chunkSize));
                }
                return(result);
            }

            // We need to break this into the default size queries so
            // we can have them running concurrently.
            var chunks = chunk(group.member || [], defaultPageSize);
            if (chunks.length > 1) {
                log.debug('Splitting %d member(s) of "%s" into %d parallel chunks',
                    (group.member || []).length, groupName, chunks.length);
            }
            var chunksProcessed = 0;
            async.each(chunks, function getUsersForGroup_ChunkItem(members, asyncChunkCallback) {
                // We're going to build up a bulk LDAP query so we can reduce
                // the number of round trips to the server. We need to get
                // additional details about each 'member' to determine if
                // it is a group or another user. If it's a group, we need
                // to recursively retrieve the members of that group.
                var filter = _.reduce(members || [], function(memo, member, index) {
                    return(memo+'(distinguishedName='+parseDistinguishedName(member)+')');
                }, '');
                filter = '(&(|(objectCategory=User)(objectCategory=Group))(|'+filter+'))';

                var localOpts = {
                    filter: filter,
                    scope: 'sub',
                    attributes: joinAttributes((opts || {}).attributes || defaultAttributes.user || [],
                        getRequiredLdapAttributesForUser(opts), [ 'groupType' ])
                };
                search.call(self, localOpts, function onSearch(err, members) {
                    if (err) {
                        asyncChunkCallback(err);
                        return;
                    }

                    // Parse the results in parallel.
                    // async.forEach(members, function(member, asyncCallback) {
                    //     // If a user, no groupType will be specified.
                    //     if (! member.groupType) {
                    //         var user = new User(pickAttributes(member, (opts || {}).attributes || defaultAttributes.user));
                    //         var group= new Group(pickAttributes(member, (opts || {}).attributes || defaultAttributes.user));
                    //         self.emit(user);
                    //         self.emit(group)
                    //         users.push(user);
                    //         groups.push(group);
                    //         asyncCallback();
                    //     }
                    //     else {
                    //         // We have a group, recursively get the users belonging to this group.
                    //         self.getUsersForGroup(opts, member.cn, function(err, nestedUsers) {
                    //             users.push.apply(users, nestedUsers);
                    //             asyncCallback();
                    //         });
                    //     }
                    // }, function(err) {
                    //     if (chunks.length > 1) {
                    //         log.debug('Finished processing chunk %d/%d', ++chunksProcessed, chunks.length);
                    //     }
                    //     asyncChunkCallback(err);
                    // });
                    if (callback) callback(null, members);
                });
            }, function getUsersForGroup_ChunkComplete(err) {
                // Remove duplicates
                users = _.uniq(users, function(user) {
                    return(user.dn || user);
                });


                log.info('%d user(s) belong in the group "%s"', users.length, groupName);
                if (callback) callback(null, groups);
            });
        });
};



