'use strict';

var rdk = require('./rdk');

describe('rdk', function() {
  it('has reference to http status', function() {
    expect(rdk.httpstatus).not.to.be.undefined();
  });
});

describe('rdk.httpstatus', function() {

  function testStatus(title, statusCode) {
    it('`' + title + '` status set to `' + statusCode + '`', function() {
      expect(rdk.httpstatus[title]).to.equal(statusCode);
    });
    it('`' + statusCode + '` status set to `' + title + '`', function() {
      expect(rdk.httpstatus[statusCode]).to.equal(title);
    });
  }

  testStatus('ok', 200);
  testStatus('created', 201);
  testStatus('accepted', 202);
  testStatus('no_content', 204);
  testStatus('moved_permanently', 301);
  testStatus('see_other', 303);
  testStatus('not_modified', 304);
  testStatus('temporary_redirect', 307);
  testStatus('permanent_redirect', 308);
  testStatus('bad_request', 400);
  testStatus('unauthorized', 401);
  testStatus('forbidden', 403);
  testStatus('not_found', 404);
  testStatus('not_acceptable', 406);
  testStatus('conflict', 409);
  testStatus('gone', 410);
  testStatus('precondition_failed', 412);
  testStatus('unsupported_media_type', 415);
  testStatus('internal_server_error', 500);
  testStatus('not_implemented', 501);
  testStatus('service_unavailable', 503);
});
