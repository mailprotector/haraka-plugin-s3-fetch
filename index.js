'use strict';

exports.register = function () {
  this.load_config();
  this.register_hook('init_master', 'load_s3_fetch', -50);
}

exports.load_config = function () {
  try {
    this.cfg = this.config.get('s3-fetch.json', this.load_config);
  } catch (err) {
    this.cfg = {
      credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
        region: process.env.REGION
      },
      files: [
        {
          bucket: process.env.BUCKET,
          key: process.env.KEY,
          path: process.env.PATH
        }
      ]
    };
  }
}

function loadPluginFile(s3, file, plugin, fs) {
  return new Promise(function (resolve, reject) {
    try {
      const params = {
        Bucket: file.bucket,
        Key: file.key
      };

      plugin.loginfo(params)

      s3.getObject(params, (err, data) => {
        if (err) {
          plugin.logerror(err, err.stack)
          resolve(false);
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

const buildS3Loader = (done) => function (AWS, fs) {
  return async function (next) {
    const plugin = this;
    if (plugin.cfg.credentials) { AWS.config.update(plugin.cfg.credentials) }

    var s3 = new AWS.S3();

    for (var i = 0; i < plugin.cfg.files.length; i++) {
      const file = plugin.cfg.files[i];
      await loadPluginFile(s3, file, plugin, fs);
    }

    done();
    next();
  }
}


const buildPluginFunction = (AWS, fs) => {
  return async function (done) {
    const plugin = this;
    if (plugin.cfg.credentials) { AWS.config.update(plugin.cfg.credentials) }

    var s3 = new AWS.S3();

    for (var i = 0; i < plugin.cfg.files.length; i++) {
      const file = plugin.cfg.files[i];
      await loadPluginFile(s3, file, plugin, fs);
    }

    done();
  }
};

exports.load_s3_fetch_test = buildS3Loader;
exports.load_s3_fetch = buildPluginFunction(require('aws-sdk'), require('fs'));