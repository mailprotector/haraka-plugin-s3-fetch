const { register, load_config, load_s3_fetch_test } = require('../index');

describe('register', () => {
  test('registers load_s3_fetch on init_master and calls load_config', () => {
    const loadConfigMock = jest.fn(() => {});
    const loadS3FetchMock = jest.fn(() => {});
    class TestClass  {
      constructor() {
        this.load_config = loadConfigMock;
        this.load_s3_fetch = loadS3FetchMock;
      }
    };

    testFunc = new TestClass();
    testFunc.register = register;
    testFunc.register();

    expect(loadConfigMock).toHaveBeenCalled();
    expect(loadS3FetchMock).toHaveBeenCalled();
  });
});

describe('load_config', () => {
  test('success with all config values', () => {
      const getConfigMock = jest.fn(() => ({
        test: 'ing'
      }));

      class TestClass  {
        constructor() {
          this.config = { get: getConfigMock };
          this.logdebug = jest.fn(msg => (msg));
          this.loginfo = jest.fn(msg => (msg));
          this.logerror = jest.fn(msg => (msg));
        }
      };

      testFunc = new TestClass();
      testFunc.load_config = load_config;
      testFunc.load_config();

      expect(getConfigMock.mock.calls[0][0]).toEqual('s3-fetch.json');
      expect(testFunc.cfg.test).toEqual('ing');
    });
});

describe('load_s3_fetch', () => {
  test('load_s3_fetch success WITHOUT cfg credentials', () => {
    const getObjectMock = jest.fn((params, cb) => {
      cb(null, { Body: 'dater-potater' });
    });

    class S3Mock {
      constructor() {
        this.getObject = getObjectMock;
      }
    }

    const awsMock = { S3: S3Mock };

    const fsMock = {
      writeFileSync: jest.fn(() => {})
    }

    const connection = { };

    class HarakaMock  {
      constructor() {
        this.logdebug = jest.fn(msg => (msg));
        this.loginfo = jest.fn(msg => (msg));
        this.logerror = jest.fn(msg => (msg));
        this.cfg = {
          files: [
            { bucket: 'bucket1', key: 'key1', path: 'path1' },
            { bucket: 'bucket2', key: 'key2', path: 'path2' }
          ]
        };
      };
    };

    const done = () => {
      expect(getObjectMock.mock.calls[0][0]).toEqual(
        { Bucket: 'bucket1', Key: 'key1' }
      );

      expect(getObjectMock.mock.calls[1][0]).toEqual(
        { Bucket: 'bucket2', Key: 'key2' }
      );

      expect(getObjectMock.mock.calls[2]).toEqual(undefined);

      expect(fsMock.writeFileSync.mock.calls[0][0]).toEqual('path1');
      expect(fsMock.writeFileSync.mock.calls[0][1]).toEqual('dater-potater');
      expect(fsMock.writeFileSync.mock.calls[1][0]).toEqual('path2');
      expect(fsMock.writeFileSync.mock.calls[1][1]).toEqual('dater-potater');
    };

    testFunc = new HarakaMock();
    testFunc.load_s3_fetch = load_s3_fetch_test(done);
    testFunc.load_s3_fetch(awsMock, fsMock);
  });

  test('load_s3_fetch success WITH cfg credentials', () => {
    const getObjectMock = jest.fn((params, cb) => {
      cb(null, { Body: 'dater-potater' });
    });

    class S3Mock {
      constructor() {
        this.getObject = getObjectMock;
      }
    }

    const awsMock = { S3: S3Mock, config: { update: jest.fn() } };

    const fsMock = {
      writeFileSync: jest.fn(() => { })
    }

    const connection = {};

    class HarakaMock {
      constructor() {
        this.logdebug = jest.fn(msg => (msg));
        this.loginfo = jest.fn(msg => (msg));
        this.logerror = jest.fn(msg => (msg));
        this.cfg = {
          files: [
            { bucket: 'bucket1', key: 'key1', path: 'path1' },
            { bucket: 'bucket2', key: 'key2', path: 'path2' }
          ],
          credentials: {
            accessKeyId: 'accessKeyId',
            secretAccessKey: 'secretAccessKey'
          }
        };
      };
    };

    const done = () => {
      expect(awsMock.config.update.mock.calls[0][0]).toEqual({
        accessKeyId: 'accessKeyId',
        secretAccessKey: 'secretAccessKey'
      });

      expect(getObjectMock.mock.calls[0][0]).toEqual(
        { Bucket: 'bucket1', Key: 'key1' }
      );

      expect(getObjectMock.mock.calls[1][0]).toEqual(
        { Bucket: 'bucket2', Key: 'key2' }
      );

      expect(getObjectMock.mock.calls[2]).toEqual(undefined);

      expect(fsMock.writeFileSync.mock.calls[0][0]).toEqual('path1');
      expect(fsMock.writeFileSync.mock.calls[0][1]).toEqual('dater-potater');
      expect(fsMock.writeFileSync.mock.calls[1][0]).toEqual('path2');
      expect(fsMock.writeFileSync.mock.calls[1][1]).toEqual('dater-potater');
    };

    testFunc = new HarakaMock();
    testFunc.load_s3_fetch = load_s3_fetch_test(done);
    testFunc.load_s3_fetch(awsMock, fsMock);
  });
});
