'use strict';

// Searches from the cwd upwards for a package.json. If that package.json
// includes ember-cli as devDependency then it returns
// { directory: String, packageJSON: Object } else it returns null.

var RSVP     = require('rsvp');
var path     = require('path');
var findup   = RSVP.denodeify(require('findup'));
var readFile = RSVP.denodeify(require('fs').readFile);

function Project(root, pkg) {
  this.root = root;
  this.pkg = pkg;
}

module.exports = Project;

Project.prototype.isEmberCLIProject = function() {
  return this.pkg.devDependencies &&
    this.pkg.devDependencies['ember-cli'];
};

Project.closest = function(pathName) {
  return closestPackageJSON(pathName).then(function(result) {
    return new Project(result.directory, result.pkg);
  });
};

function closestPackageJSON(pathName) {
  return findup(pathName, 'package.json').then(function(directory) {
    return RSVP.hash({
      directory: directory,
      pkg: readFile(path.join(directory, 'package.json'))
    });
  });
}
