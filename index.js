'use strict';

exports.register = function () {
  this.load_config();
  this.load_s3_fetch(require('aws-sdk'), require('fs'));
}

exports.load_config = function () {
  this.cfg = this.config.get('s3-fetch.json', this.load_config);
}

function loadPluginFile(s3, file, plugin, fs) {
  return new Promise(function (resolve, reject) {
    try {
      const params = {
        Bucket: file.bucket,
        Key: file.key
      };

      plugin.logdebug(params);

      s3.getObject(params, (err, data) => {
        if (err) {
          plugin.logerror(err, err.stack)
          reject(false);
        } else {
          fs.writeFileSync(file.path, data.Body)
          plugin.loginfo(`s3-fetch: file successfully written to ${file.path}`);
          resolve(true);
        }
      });
    } catch (err) {
      reject(err);
    }
  });
}

const buildS3Loader = (done) => async function loadS3PluginFiles(AWS, fs) {
  const plugin = this;
  var s3 = new AWS.S3();

  if (plugin.cfg.credentials) {
    AWS.config.update(plugin.cfg.credentials)
  }

  for(var i = 0; i < plugin.cfg.files.length; i++) {
    let results = await loadPluginFile(s3, plugin.cfg.files[i], plugin, fs);
    plugin.loginfo(results)
  }

  done();
}

exports.load_s3_fetch_test = buildS3Loader;
exports.load_s3_fetch = buildS3Loader(()=>{});