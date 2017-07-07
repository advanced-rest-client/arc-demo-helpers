// We declare it as a namespace to be compatible with JSCompiler.
/** @const */
var ArcRequestHelper = {};
(function(scope, global) {
  'use strict';
  // In case the var above was not global, or if it was renamed.
  global.ArcRequestHelper = scope;

  /**
   * Fires a custom event that can be cancelled.
   *
   * @param {String} name Type of the event
   * @param {Object} detail The details object attached to the event
   * @param {?HTMLElement} node Node on which dispatch the event.
   * @return {CustomEvent}
   */
  function fire(name, detail, node) {
    var event = new CustomEvent(name, {
      bubbles: true,
      composed: true,
      cancelable: true,
      detail: detail
    });
    (node || document).dispatchEvent(event);
    return event;
  }
  /**
   * Returns a handler to the PouchDB database.
   * The PouchDB element must be included into the document for it to work.
   *
   * @param {String} name Name of the database
   * @return {PouchDB} A database instance.
   */
  function getDatabase(name) {
    return new PouchDB(name);
  }

  /**
   * Deletes PouchDB database(s)
   *
   * @param {Array<String>} List of database names to delete.
   * @return {Promise} Resolved promise when all databases has been deleted.
   */
  function deleteDatabases() {
    var args = Array.prototype.slice.call(arguments);
    var promises = args.map(function(name) {
      getDatabase(name).destroy();
    });
    return Promise.all(promises);
  }
  /**
   * Creates a Headers object with predefined values.
   *
   * @param {?Object} insert Map of headers to add to the Headers object
   * @return {Headers}
   */
  function createHeaders(insert) {
    var headers = {
      'host': 'domain.com',
      'content-length': '4',
      'content-type': 'plain/text'
    };
    if (insert) {
      Object.assign(headers, insert);
    }
    return new Headers(headers);
  }
  /**
   * Creates a response with predefined values that can be overriten by `opts` parames.
   *
   * @param {?Object} opts Options to be passed to the init function.
   * @return {Response}
   */
  function createResponse(opts) {
    opts = opts || {};
    opts.body = opts.body || 'test';
    var init = {
      status: opts.status || 200,
      statusText: opts.statusText || 'OK',
      headers: createHeaders(opts.headers)
    };
    var response = new Response(opts.body, init);
    return response;
  }
  /**
   * Creates a request object with predefined data.
   * The only predefined parameter is url that equals:
   * `http://sub.domain.com/path/resource/?param=value`. It can be changed by setting `opts.url`.
   *
   * @param {?Object} opts Init options. It's optional and by defualt it ceares GET request to an
   * URL. Pass: `url`, `method`, `headers` and `body` as properties.
   * @return {Request}
   */
  function createRequest(opts) {
    opts = opts || {};
    opts.url = opts.url || 'http://sub.domain.com/path/resource/?param=value';
    var init = {};
    if (opts.method) {
      init.method = opts.method;
    }
    if (opts.headers) {
      init.headers = opts.headers;
    }
    if (opts.body) {
      init.body = opts.body;
    }
    return new Request(opts.url, init);
  }
  /**
   * Creates a redirects array entry that the response-ready event can carry.
   * See https://github.com/jarrodek/ChromeRestClient/issues/1010
   *
   * @param {String} from URL of the request
   * @param {String} to URL of the redirection
   * @param {?Boolean} temporary True to set 307 status code. 301 otherwise.
   * @return {Response} Response with `requestUrl` property.
   */
  function createRedirect(from, to, temporary) {
    var status = temporary ? 307 : 301;
    var body = 'Redirected to: ' + to;
    var headers = {
      'location': to,
      'content-length': to.length
    };
    var r = createResponse({
      status: status,
      body: body,
      headers: headers
    });
    r.requestUrl = from;
    return r;
  }
  /**
   * Fires after request event with predefined data.
   *
   * @param {?Options} requestOpts See createRequest() for details
   * @param {?Options} responseOpts See createResponse() for details
   * @param {?Array} redirects List object with corresponding arguments to pass to
   * `createRedirect()` function.
   * @param {?Object|Boolean} A timings object as defined in HAR 1.2 spec. If `true` one will be
   * generated with some data.
   * @return {[type]}
   */
  function afterResponseEvent(requestOpts, responseOpts, redirects, timings) {
    if (redirects && redirects.length) {
      redirects = redirects.map(function(item) {
        return createRedirect(item.from, item.to, item.temporary);
      });
    }
    if (timings === true) {
      timings = {
        connect: 2.008,
        receive: 24.1769,
        send: 96.1234,
        ssl: 11,
        wait: 54.512,
        startTime: 1499427973215
      };
    }
    return fire('response-ready', {
      request: createRequest(requestOpts),
      response: createResponse(responseOpts),
      redirects: redirects,
      timings: timings,
      auth: undefined
    });
  }

  scope.fire = fire;
  scope.getDatabase = getDatabase;
  scope.deleteDatabases = deleteDatabases;
  scope.createHeaders = createHeaders;
  scope.createResponse = createResponse;
  scope.createRequest = createRequest;
  scope.afterResponseEvent = afterResponseEvent;
  scope.createRedirect = createRedirect;
})(ArcRequestHelper, this);
