'use strict';

const assert = require('power-assert');
const path = require('path');
const rimraf = require('rimraf');
const readJSON = require('../lib/utils').readJSON;
const mkdirp = require('mkdirp');
const npminstall = require('./npminstall');

describe('test/installScope.test.js', function() {
  const tmp = path.join(__dirname, 'fixtures', 'tmp');

  function cleanup() {
    rimraf.sync(tmp);
  }

  beforeEach(function() {
    cleanup();
    mkdirp.sync(tmp);
  });
  afterEach(cleanup);

  it('should install scope package with version', function* () {
    yield npminstall({
      root: tmp,
      pkgs: [
        { name: '@rstacruz/tap-spec', version: '4.1.1' },
      ],
    });
    const pkg = yield readJSON(path.join(tmp, 'node_modules/@rstacruz/tap-spec/package.json'));
    assert(pkg.version === '4.1.1');
  });

  it('should install scope package with version not exist throw err', function* () {
    try {
      yield npminstall({
        root: tmp,
        pkgs: [
          { name: '@rstacruz/tap-spec', version: '3.0.0' },
        ],
      });
      throw new Error('should not excute here');
    } catch (err) {
      assert(err.status, 404);
    }
  });

  it('should install scope package with range', function* () {
    yield npminstall({
      root: tmp,
      pkgs: [
        { name: '@rstacruz/tap-spec', version: '~4.1.0' },
      ],
    });
    const pkg = yield readJSON(path.join(tmp, 'node_modules/@rstacruz/tap-spec/package.json'));
    assert(pkg.version === '4.1.1');
  });
});
