Package.describe({
  name: "planable:plugins",
  version: "0.4.11",
  summary: "A self-service menu of Constellation plugins",
  git: "https://github.com/Planable/constellation-plugins",
  documentation: "README.md",
  debugOnly: true,
});

Package.onUse(function (api) {
  api.versionsFrom("2.3");
  api.use(["check", "underscore"]);
  api.use(["templating@1.4.1", "reactive-dict"], "client");
  // api.use('ddp', 'server');
  api.use("planable:console@1.4.11");
  api.addFiles(
    [
      "constellation-plugins.css",
      "constellation-plugins.html",
      "constellation-plugins-client.js",
    ],
    "client"
  );
  api.addFiles(["constellation-plugins-server.js"], "server");

  api.imply("planable:console");
});

Package.onTest(function (api) {
  api.use("ecmascript");
  api.use("tinytest");
  api.use("planable:plugins");
  api.addFiles("constellation-plugins-tests.js");
});
