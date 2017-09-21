/* global chance */
var DataGenerator = {};

/**
 * Generates a random ARC legacy project object.
 *
 * @return {Object} ARC's object.
 */
DataGenerator.createProjectObject = function() {
  var project = {
    _id: chance.string({length: 12}),
    name: chance.sentence({words: 2}),
    order: 0,
    description: chance.paragraph()
  };
  return project;
};
DataGenerator.payloadMethods = ['POST', 'PUT', 'DELETE', 'OPTIONS'];
DataGenerator.nonPayloadMethods = ['GET', 'HEAD'];
DataGenerator.contentTypes = [
  'application/x-www-form-urlencoded',
  'application/json',
  'application/xml',
  'text/plain'
];
/**
 * Generates HTTP headers string.
 *
 * @param {?String} contentType
 * @param {Object} opts Configuration options:
 * -   `noHeaders` (Boolean) will not generate headers string (will set empty string)
 * @return {String} Valid HTTP headers string.
 */
DataGenerator.generateHeaders = function(contentType, opts) {
  opts = opts || {};
  var headers = '';
  if (!opts.noHeaders) {
    var headersSize = chance.integer({
      min: 0,
      max: 10
    });
    for (var i = 0; i < headersSize; i++) {
      headers += 'X-' + chance.word() + ': ' + chance.word() + '\n';
    }
  }
  if (contentType) {
    headers += 'content-type: ' + contentType;
  }
  return headers;
};
/**
 * Generates a HTTP method name for the request.
 *
 * @param {Boolean} isPayload If true it will use `opts.payloadPools` or
 *                            `DataGenerator.payloadMethods` to pick a method
 *                            from. Otherwise it will use
 *                            `DataGenerator.nonPayloadMethods` to pick a method from.
 * @param {Object} opts Configuration options:
 * -   `payloadPools` (Array<String>) List of methods to randomly pick from.
 *      It only relevant for a requests that can carry a payload.
 * @return {String} Randomly picked HTTP method name.
 */
DataGenerator.generateMethod = function(isPayload, opts) {
  opts = opts || {};
  if (isPayload) {
    return chance.pick(opts.payloadPools || DataGenerator.payloadMethods);
  }
  return chance.pick(DataGenerator.nonPayloadMethods);
};
/**
 * Randomly generates a boolean flag describing if the request can carry a payload.
 * @param {Object} opts Configuration options:
 * -   `noPayload` (Boolean) If set the request will not have payload
 * -   `forcePayload` (Boolean) The request will always have a payload.
 *      THe `noPayload` property takes precedence over this setting.
 * @return {Boolean} `true` if the request can carry a payload and `false` otherwise.
 */
DataGenerator.generateIsPayload = function(opts) {
  opts = opts || {};
  var isPayload = false;
  if (!opts.noPayload) {
    if (opts.forcePayload && chance.bool()) {
      isPayload = true;
    }
  }
  return isPayload;
};
/**
 * Generates a `content-type` header value.
 * @return {String} Value of the `content-type` header
 */
DataGenerator.generateContentType = function() {
  return chance.pick(DataGenerator.contentTypes);
};
/**
 * Generates a random x-www-form-urlencoded payload.
 * @return {String} The x-www-form-urlencoded payload.
 */
DataGenerator.generateUrlEncodedData = function() {
  var size = chance.integer({min: 1, max: 10});
  var result = '';
  for (var i = 0; i < size; i++) {
    var name = encodeURIComponent(chance.word()).replace(/%20/g, '+');
    var value = encodeURIComponent(chance.paragraph()).replace(/%20/g, '+');
    if (result) {
      result += '&';
    }
    result += name + '=' + value;
  }
  return result;
};
/**
 * Generates random JSON data.
 * @return {String} JSON payload
 */
DataGenerator.generateJsonData = function() {
  var size = chance.integer({min: 1, max: 10});
  var result = '{';
  var addComa = false;
  for (var i = 0; i < size; i++) {
    var name = chance.word();
    var value = chance.paragraph();
    if (addComa) {
      result += ',';
    } else {
      addComa = true;
    }
    result += '\n\t';
    result += '"' + name + '":"' + value + '"';
  }
  result += '\n';
  result += '}';
  return result;
};
/**
 * Generates random XML data.
 * @return {String} XML payload
 */
DataGenerator.generateXmlData = function() {
  var size = chance.integer({min: 1, max: 10});
  var result = '<feed>';
  for (var i = 0; i < size; i++) {
    var name = chance.word();
    var value = chance.paragraph();
    result += '\n\t';
    result += '<' + name + '><![CDATA[' + value + ']]></' + name + '>';
  }
  result += '\n';
  result += '</feed>';
  return result;
};
/**
 * Generates random payload data for given `contentType`.
 * The `contentType` must be one of the `DataGenerator.contentTypes`.
 *
 * @param {String} contentType Content type of the data.
 * @return {String} Payload message.
 */
DataGenerator.generatePayload = function(contentType) {
  if (!contentType) {
    return;
  }
  switch (contentType) {
    case 'text/plain': return chance.paragraph();
    case 'application/x-www-form-urlencoded': return DataGenerator.generateUrlEncodedData();
    case 'application/json': return DataGenerator.generateJsonData();
    case 'application/xml': return DataGenerator.generateXmlData();
    default:
      throw new Error('Unknown payload.');
  }
};
/**
 * Generates a request timestamp that is withing this month.
 * @return {Number} The timestamp
 */
DataGenerator.generateRequestTime = function() {
  var d = new Date();
  var year = d.getFullYear();
  var month = d.getMonth();
  month--;
  if (month === -1) {
    month = 11;
    year--;
  }
  var randomDay = chance.date({year: year, 'month': month});
  return randomDay.getTime();
};
/**
 * Generates Google Drive item ID.
 *
 * @param {Object} opts Configuration options:
 * -   `noGoogleDrive` (Boolean) if set then it will never generate Drive ID.
 * @return {String|undefined} Google Drive ID or undefined.
 */
DataGenerator.generateDriveId = function(opts) {
  if (opts && opts.noGoogleDrive) {
    return;
  }
  return chance.string({
    length: 32,
    pool: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  });
};
/**
 * Generates a description for a request.
 *
 * @param {Object} opts Configuration options:
 * -   `noDescription` (Boolean) if set then it will never generate a desc.
 * @return {String|undefined} Items description.
 */
DataGenerator.generateDescription = function(opts) {
  if (opts && opts.noDescription) {
    return;
  }
  return chance.bool({likelihood: 70}) ? chance.paragraph() : undefined;
};
/**
 * Generates random saved request item.
 * @param {Object} opts Options to generate the reequest:
 * -   `noPayload` (Boolean) If set the request will not have payload
 * -   `forcePayload` (Boolean) The request will always have a payload.
 *      The `noPayload` property takes precedence over this setting.
 * -   `payloadPools` (Array<String>) List of methods to randomly pick one of
 * -   `noHeaders` (Boolean) will not generate headers string (will set empty
 *      string). If payload is generated then it will always contain a
 *      `content-type` header.
 * -   `noGoogleDrive` (Boolean) if set then it will never generate Drive ID.
 * -   `noDescription` (Boolean) if set then it will never generate a desc.
 * -   `project` (String) A project ID to add. It also add other project related
 *      properties.
 * @return {[type]} [description]
 */
DataGenerator.generateSavedItem = function(opts) {
  opts = opts || {};
  var isPayload = DataGenerator.generateIsPayload(opts);
  var method = DataGenerator.generateMethod(isPayload, opts);
  var contentType = isPayload ? DataGenerator.generateContentType() : undefined;
  var headers = DataGenerator.generateHeaders(contentType, opts);
  var payload = DataGenerator.generatePayload(contentType);
  var time = DataGenerator.generateRequestTime();
  var requestName = chance.sentence({words: 2});
  var driveId = DataGenerator.generateDriveId(opts);
  var description = DataGenerator.generateDescription(opts);

  var item = {
    url: chance.url(),
    method: method,
    headers: headers,
    created: time,
    updated: time,
    type: 'saved',
    name: requestName
  };
  if (driveId) {
    item.driveId = driveId;
  }
  if (description) {
    item.description = description;
  }
  if (payload) {
    item.payload = payload;
  }

  item._id = encodeURIComponent(requestName) +
    '/' + encodeURIComponent(item.url) + '/' + item.method;
  if (opts.project) {
    item._id += '/' + opts.project;
    item.legacyProject = opts.project;
    item.projectOrder = chance.integer({min: 0, max: 10});
  }
  return item;
};
/**
 * Picks a random project ID from the list of passed in `opts` map projects.
 *
 * @param {Object} opts Configuration options:
 * -   `projects` (Array<Object>) List of generated projects
 * @return {String|undefined} Project id or undefined.
 */
DataGenerator.pickProjectId = function(opts) {
  opts = opts || {};
  if (!opts.projects) {
    return;
  }
  var projectsIndex = chance.integer({min: 0, max: opts.projects.length - 1});
  return chance.bool() ? opts.projects[projectsIndex]._id : undefined;
};
/**
 * Generates a list of saved requests.
 *
 * @param {Object} opts Configuration options:
 * -   `projects` (Array<Object>) List of generated projects
 * -   `requestsSize` (Number) Number of request to generate. Default to 25.
 * Rest of configuration options are defined in `DataGenerator.generateSavedItem`
 * @return {Array<Object>} List of requests.
 */
DataGenerator.generateRequests = function(opts) {
  opts = opts || {};
  var list = [];
  var size = opts.requestsSize || 25;
  for (var i = 0; i < size; i++) {
    var project = DataGenerator.pickProjectId(opts);
    var _opts = Object.assign({}, opts);
    _opts.project = project;
    list.push(DataGenerator.generateSavedItem(_opts));
  }
  return list;
};
/**
 * Generates a list of project objects.
 *
 * @param {Object} opts Configuration options:
 * -   `projectsSize` (Number) A number of projects to generate.
 * @return {Array<Object>} List of generated project objects.
 */
DataGenerator.generateProjects = function(opts) {
  opts = opts || {};
  var size = opts.projectsSize || 5;
  var result = [];
  for (var i = 0; i < size; i++) {
    result.push(DataGenerator.createProjectObject());
  }
  return result;
};
/**
 * Generates requests data. That includes projects and requests.
 *
 * @param {Object} opts Configuration options:
 * -   `projectsSize` (Number) A number of projects to generate.
 * -   `requestsSize` (Number) Number of request to generate. Default to 25.
 * Rest of configuration options are defined in `DataGenerator.generateSavedItem`
 * @return {Object} A map with `projects` and `requests` arrays.
 */
DataGenerator.generateSavedRequestData = function(opts) {
  opts = opts || {};
  var projects = DataGenerator.generateProjects(opts);
  opts.projects = projects;
  var requests = DataGenerator.generateRequests(opts);
  return {
    requests: requests,
    projects: projects
  };
};
/**
 * Preforms `DataGenerator.insertSavedRequestData` if no requests data are in
 * the data store.
 * @param {Object} opts See `DataGenerator.generateSavedRequestData` for description.
 * @return {Promise} Resolved promise when data are inserted into the datastore.
 */
DataGenerator.insertSavedIfNotExists = function(opts) {
  opts = opts || {};
  var savedDb = new PouchDB('saved-requests');
  return savedDb.allDocs({
    include_docs: true
  })
  .then(function(response) {
    if (!response.rows.length) {
      return DataGenerator.insertSavedRequestData(opts);
    }
    var result = {
      requests: response.rows.map(function(item) {
        return item.doc;
      })
    };
    var projectsDb = new PouchDB('legacy-projects');
    return projectsDb.allDocs({
      include_docs: true
    })
    .then(function(response) {
      result.projects = response.rows.map(function(item) {
        return item.doc;
      });
      return result;
    });
  });
};
/**
 * Generates saved requests data and inserts them into the data store if they
 * are missing.
 *
 * @param {Object} opts See `DataGenerator.generateSavedRequestData` for description.
 * @return {Promise} Resolved promise when data are inserted into the datastore.
 * Promise resolves to generated data object
 */
DataGenerator.insertSavedRequestData = function(opts) {
  opts = opts || {};
  var data = DataGenerator.generateSavedRequestData(opts);
  var savedDb = new PouchDB('saved-requests');
  var projectsDb = new PouchDB('legacy-projects');
  return projectsDb.bulkDocs(data.projects)
  .then(function() {
    return savedDb.bulkDocs(data.requests);
  })
  .then(function() {
    return data;
  });
};
/**
 * Destroys saved and projects database.
 * @return {Promise} Resolved promise when the data are cleared.
 */
DataGenerator.destroySavedRequestData = function() {
  var savedDb = new PouchDB('saved-requests');
  var projectsDb = new PouchDB('legacy-projects');
  return savedDb.destroy().then(function() {
    return projectsDb.destroy();
  });
};
