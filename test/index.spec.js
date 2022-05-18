const { register, load_config, load_s3_fetch_test } = require('../index');

describe('register', () => {
  test('reigsters load_s3_fetch on init_master and calls load_config', () => {
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

    expect(loadConfigMock.mock.calls[0]).toEqual([]);
    expect(loadS3FetchMock.mock.calls[0]).toEqual([]);
  });
});

describe('load_config', () => {
  test('success with all config values', () => {
      const getConfigMock = jest.fn(() => ({
        test: 'ing'
      }));
      const logWarningMock = jest.fn(() => {});

      class TestClass  {
        constructor() {
          this.config = { get: getConfigMock };
          this.logwarning = logWarningMock;
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
  test('load_s3_fetch success WITHOUT cfg credentials', (testComplete) => {
    const getObjectMock = jest.fn((params, cb) => {
      cb(null, { Body: 'dater-potater' });
    });

    class S3Mock {
      constructor() {
        this.getObject = getObjectMock;
      }
    }

    const awsMock = {
      S3: S3Mock
    }

    const fsMock = {
      writeFileSync: jest.fn(() => {})
    }

    const connection = {
      loginfo: jest.fn(msg => {
        // console.log(msg);
      }),
      logdebug: jest.fn(msg => {
        // console.log(msg);
      })
    };

    const next = () => {
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

      testComplete();
    };

    class HarakaMock  {
      constructor() {
        this.cfg = {
          files: [
            { bucket: 'bucket1', key: 'key1', path: 'path1' },
            { bucket: 'bucket2', key: 'key2', path: 'path2' }]
        };
      };
    };

    testFunc = new HarakaMock();
    testFunc.load_s3_fetch = load_s3_fetch_test(awsMock, fsMock);

    testFunc.load_s3_fetch(next, connection);
  });

  test('load_s3_fetch success WITH cfg credentials', (testComplete) => {
    const getObjectMock = jest.fn((params, cb) => {
      cb(null, { Body: 'dater-potater' });
    });

    class S3Mock {
      constructor() {
        this.getObject = getObjectMock;
      }
    }

    const awsMock = {
      S3: S3Mock,
      config: {
        update: jest.fn(() => {})
      }
    }

    const fsMock = {
      writeFileSync: jest.fn(() => {})
    }

    const connection = {
      loginfo: jest.fn(msg => {
        // console.log(msg);
      }),
      logdebug: jest.fn(msg => {
        // console.log(msg);
      })
    };

    const next = () => {
      expect(awsMock.config.update.mock.calls[0][0]).toEqual('creds')

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

      testComplete();
    };

    class HarakaMock  {
      constructor() {
        this.cfg = {
          files: [
            { bucket: 'bucket1', key: 'key1', path: 'path1' },
            { bucket: 'bucket2', key: 'key2', path: 'path2' }
          ],
          credentials: 'creds'
        };
      };
    };

    testFunc = new HarakaMock();
    testFunc.load_s3_fetch = load_s3_fetch_test(awsMock, fsMock);

    testFunc.load_s3_fetch(next, connection);
  });

  test('load_s3_fetch success WITHOUT cfg credentials AWS error', (testComplete) => {
    const getObjectMock = jest.fn((params, cb) => {
      cb('PHAILURE', { Body: 'dater-potater' });
    });

    class S3Mock {
      constructor() {
        this.getObject = getObjectMock;
      }
    }

    const awsMock = {
      S3: S3Mock
    }

    const fsMock = {
      writeFileSync: jest.fn(() => {})
    }

    const connection = {
      loginfo: jest.fn(msg => {
        // console.log(msg);
      }),
      logdebug: jest.fn(msg => {
        // console.log(msg);
      }),
      logerror: jest.fn(msg => {
        // console.log(msg);
      })
    };

    const next = () => {
      expect(getObjectMock.mock.calls[0][0]).toEqual(
        { Bucket: 'bucket1', Key: 'key1' }
      );
      expect(getObjectMock.mock.calls[1][0]).toEqual(
        { Bucket: 'bucket2', Key: 'key2' }
      );
      expect(getObjectMock.mock.calls[2]).toEqual(undefined);

      expect(connection.logerror.mock.calls[0][0]).toEqual('PHAILURE')
      expect(connection.logerror.mock.calls[1][0]).toEqual('PHAILURE')

      expect(fsMock.writeFileSync.mock.calls[0]).toEqual(undefined);
      expect(fsMock.writeFileSync.mock.calls[1]).toEqual(undefined);

      testComplete();
    };

    class HarakaMock  {
      constructor() {
        this.cfg = {
          files: [
            { bucket: 'bucket1', key: 'key1', path: 'path1' },
            { bucket: 'bucket2', key: 'key2', path: 'path2' }]
        };
      };
    };

    testFunc = new HarakaMock();
    testFunc.load_s3_fetch = load_s3_fetch_test(awsMock, fsMock);

    testFunc.load_s3_fetch(next, connection);
  });
});
