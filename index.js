'use strict';

const fs = require('fs');
const AWS = require("aws-sdk");

exports.register = function () {
    this.register_hook('init_master', 'load_s3_fetch')
    this.load_config()
}

exports.load_config = function () {
    this.cfg = this.config.get('s3-fetch.json', this.load_config);
}

exports.load_s3_fetch = function (next, connection) {
    const plugin = this

    if (plugin.cfg.credentials) {
        AWS.config.update(plugin.cfg.credentials)
    }

    var s3 = new AWS.S3();

    plugin.cfg.files.forEach(file => {
        var params = {
            Bucket: file.bucket,
            Key: file.key
        };

        connection.logdebug(params);
        s3.getObject(params, function (err, data) {
            if (err) {
                connection.logerror(err, err.stack)
            }
            else {
                fs.writeFileSync(file.path, data.Body)
                connection.loginfo(`s3-fetch: file successfully written to ${file.path}`);
            }
        })
    })
    next();
}