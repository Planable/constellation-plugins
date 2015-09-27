Package.describe({
  name: 'constellation:plugins',
  version: '0.1.0',
  summary: 'A list of available Constellation plugins',
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md',
  debugOnly: true
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.0.1');
  api.use(['ecmascript', 'check', 'underscore']);
  api.use(['templating', 'reactive-dict'], 'client');
  // api.use('ddp', 'server');
  api.addFiles(['constellation-plugins.css', 'constellation-plugins.html', 'constellation-plugins-client.js'], 'client');
  api.addFiles(['constellation-plugins-server.js'], 'server');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('constellation-plugins');
  api.addFiles('constellation-plugins-tests.js');
});
