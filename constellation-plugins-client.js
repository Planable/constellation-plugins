// Hook in to constellation UI

var Constellation = Package["planable:console"].API;

Constellation.addTab({
  name: "Plugins",
  menuContentTemplate: "Constellation_plugins_menu",
  mainContentTemplate: "Constellation_plugins_main",
  guideContentTemplate: "Constellation_plugins_guide",
});

var PluginsDict = new ReactiveDict("Constellation_plugins");

PluginsDict.setDefault("Constellation_plugins_add", []);
PluginsDict.setDefault("Constellation_plugins_remove", []);
PluginsDict.set("Constellation_plugins_active", false);

var pluginPresent = function (name) {
  return Package[name] !== undefined;
};

var pluginPinned = function (name) {
  return _.reduce(
    constellationPluginUmbrellas,
    function (memo, dependencies, umbrellaPackage) {
      if (
        Package[umbrellaPackage] !== undefined &&
        _.contains(dependencies, name)
      ) {
        // && !_.contains(PluginsDict.get('Constellation_plugins_remove'), umbrellaPackage)
        memo = umbrellaPackage;
      }
      return memo;
    },
    ""
  );
};

Blaze.registerHelper("Constellation_plugins_active", function () {
  return PluginsDict.get("Constellation_plugins_active");
});

Template.Constellation_plugins_menu.helpers({
  actions: function () {
    return ["remove", "add"];
  },
  packageCount: function () {
    return PluginsDict.get("Constellation_plugins_" + String(this)).length;
  },
  queued: function () {
    return (
      PluginsDict.get("Constellation_plugins_add").length +
      PluginsDict.get("Constellation_plugins_remove").length
    );
  },
});

Template.Constellation_plugins_menu.events({
  "click .Constellation_plugins_add_remove": function (evt, tmpl) {
    if (
      PluginsDict.get("Constellation_plugins_" + String(this)).length &&
      !PluginsDict.get("Constellation_plugins_active")
    ) {
      Meteor.call(
        "Constellation_plugins_add_remove",
        String(this),
        PluginsDict.get("Constellation_plugins_" + String(this))
      );
      PluginsDict.set("Constellation_plugins_active", true);
      PluginsDict.set("Constellation_plugins_" + String(this), []);
    }
  },
});

Template.Constellation_plugins_main.helpers({
  constellationPlugins: function () {
    return constellationPlugins;
  },
  present: function () {
    return pluginPresent(this.name);
  },
  selected: function () {
    if (
      pluginPresent(this.name) &&
      _.contains(PluginsDict.get("Constellation_plugins_remove"), this.name)
    ) {
      return "Constellation_plugins_remove";
    }
    if (
      !pluginPresent(this.name) &&
      _.contains(PluginsDict.get("Constellation_plugins_add"), this.name)
    ) {
      return "Constellation_plugins_add";
    }
  },
  pinned: function () {
    return pluginPinned(this.name);
  },
});

Template.Constellation_plugins_main.events({
  "click .Constellation_plugin": function () {
    if (pluginPinned(this.name)) {
      return;
    }
    var action = pluginPresent(this.name) ? "remove" : "add";
    var key = "Constellation_plugins_" + action;
    var plugins = PluginsDict.get(key);
    if (_.contains(plugins, this.name)) {
      plugins = _.without(plugins, this.name);
    } else {
      plugins.push(this.name);
    }
    PluginsDict.set(key, plugins);
  },
});

var constellationPlugins = [
  /*{ 
  description: "Basic console (document editing, search, account impersonation, undo/redo, fullscreen toggle)",
  name: "planable:console"
  },*/
  {
    description: "Distro of commonly used packages",
    name: "babrahams:constellation",
  },
  {
    description: "Dump and restore collections",
    name: "planable:dump-restore",
  },
  {
    description: "Generate Simple Schema using existing collection data",
    name: "planable:schema",
  },
  {
    description: "See Velocity test results in the console",
    name: "planable:velocity",
  },
  {
    description: "Shorten long collection names",
    name: "planable:shorten-collection-names",
  },
  {
    description: "Monitor and toggle connection status",
    name: "planable:connection",
  },
  {
    description: "Minify the console some more",
    name: "planable:tiny",
  },
  {
    description: "Reposition the console and show a button to open it",
    name: "planable:position",
  },
  {
    description:
      "Toggle autopublish, so all fields/documents are available on the client",
    name: "planable:autopublish",
  },
  {
    description: "Show current subscriptions",
    name: "planable:subscriptions",
  },
  {
    description: "Edit Session variables and other reactive dictionaries",
    name: "planable:session",
  },
  {
    description:
      "See the DDP traffic that is flowing between client and server",
    name: "lai:ddp-inspector",
  },
  {
    description:
      "See the templates in your app and the data contexts of those templates",
    name: "babrahams:temple",
  },
  {
    description:
      "Reload your app while preserving Session variables or simulate hot code pushes",
    name: "yelongren:constellation-reload",
  },
  {
    description: "Add a lag to methods to simulate real-world response times",
    name: "alon:lag-console",
  },
  {
    description: "JS performance monitoring with stats.js",
    name: "fermuch:stats.js",
  },
  {
    description: "Detect out of date packages in your app",
    name: "fourquet:anti-gravity",
  },
];

var constellationPluginUmbrellas = {
  "babrahams:constellation": [
    "planable:console",
    "babrahams:temple",
    "planable:subscriptions",
    "planable:session",
    "planable:autopublish",
    "planable:tiny",
    "planable:position",
    "planable:plugins",
  ],
};