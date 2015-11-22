// Hook in to constellation UI

var Constellation = Package["constellation:console"].API;

Constellation.addTab({
  name: 'Plugins',
  menuContentTemplate: 'Constellation_plugins_menu',
  mainContentTemplate: 'Constellation_plugins_main'
});

var PluginsDict = new ReactiveDict('Constellation_plugins');

PluginsDict.setDefault('Constellation_plugins_add', []);
PluginsDict.setDefault('Constellation_plugins_remove', []);
PluginsDict.set('Constellation_plugins_active', false);

var pluginPresent = function (name) {
  return Package[name] !== undefined;	
}

var pluginPinned = function (name) {
  return _.reduce(constellationPluginUmbrellas, function (memo, dependencies, umbrellaPackage) {
	if (Package[umbrellaPackage] !== undefined && _.contains(dependencies, name)) { // && !_.contains(PluginsDict.get('Constellation_plugins_remove'), umbrellaPackage)
	  memo = umbrellaPackage;
	}
	return memo;
  },'');
}

Blaze.registerHelper('Constellation_plugins_active', function () {
  return PluginsDict.get('Constellation_plugins_active');
});

Template.Constellation_plugins_menu.helpers({
  actions: function () {
	return ['remove', 'add'];  
  },
  packageCount: function () {
	return PluginsDict.get('Constellation_plugins_' + String(this)).length;  
  },
  queued: function () {
	return   PluginsDict.get('Constellation_plugins_add').length + PluginsDict.get('Constellation_plugins_remove').length;
  }
});

Template.Constellation_plugins_menu.events({
	'click .Constellation_plugins_add_remove' : function (evt, tmpl) {
    if (PluginsDict.get('Constellation_plugins_' + String(this)).length && !PluginsDict.get('Constellation_plugins_active')) {
	  Meteor.call('Constellation_plugins_add_remove', String(this), PluginsDict.get('Constellation_plugins_' + String(this)));
	  PluginsDict.set('Constellation_plugins_active', true);
	  PluginsDict.set('Constellation_plugins_' + String(this), []);
	}
  }
});

Template.Constellation_plugins_main.helpers({
  constellationPlugins: function () {
	return constellationPlugins; 
  },
  present: function () {
	return pluginPresent(this.name);
  },
  selected: function () {
	if (pluginPresent(this.name) && _.contains(PluginsDict.get('Constellation_plugins_remove'), this.name)) {
	  return 'Constellation_plugins_remove';	
	}
	if (!pluginPresent(this.name) && _.contains(PluginsDict.get('Constellation_plugins_add'), this.name)) {
	  return 'Constellation_plugins_add';	
	}
  },
  pinned: function () {
	return pluginPinned(this.name);  
  }
});

Template.Constellation_plugins_main.events({
  'click .Constellation_plugin' : function () {
	if (pluginPinned(this.name)) {
	  return;	
	}
	var action = (pluginPresent(this.name)) ? 'remove' : 'add';
	var key = 'Constellation_plugins_' + action;
	var plugins = PluginsDict.get(key);
	if (_.contains(plugins, this.name)) {
	  plugins = _.without(plugins, this.name);	
	}
	else {
	  plugins.push(this.name);	
	}
	PluginsDict.set(key, plugins);
  }
});

var constellationPlugins = [
  /*{ 
  description: "Basic console (document editing, search, account impersonation, undo/redo, fullscreen toggle)",
  name: "constellation:console"
  },*/
  {
    description: "Distro of commonly used packages",
    name: "babrahams:constellation"
  },
  {
	description: "Dump and restore collections",
	name: "constellation:dump-restore"  
  },
  {
    description: "Generate Simple Schema using existing collection data",
    name: "constellation:schema"
  },
  {
    description: "See Velocity test results in the console",
    name: "constellation:velocity"
  },
  {
    description: "Shorten long collection names",
    name: "constellation:shorten-collection-names"
  },
  {
    description: "Minify the console some more",
    name: "constellation:tiny"
  },
  {
    description: "Reposition the console and show a button to open it",
    name: "constellation:position"
  },
  {
    description: "Toggle autopublish, so all fields/documents are available on the client",
    name: "constellation:autopublish"
  },
  {
    description: "Show current subscriptions",
    name: "constellation:subscriptions"
  },
  {
    description: "Edit Session variables and other reactive dictionaries",
    name: "constellation:session"
  },
  {
    description: "See the DDP traffic that is flowing between client and server",
    name: "lai:ddp-inspector"
  },
  {
    description: "See the templates in your app and the data contexts of those templates",
    name: "babrahams:temple"
  },
  {
    description: "Reload your app while preserving Session variables or simulate hot code pushes",
    name: "yelongren:constellation-reload"
  },
  {
    description: "Add a lag to methods to simulate real-world response times",
    name: "alon:lag-console"
  },
  {
    description: "JS performance monitoring with stats.js",
    name: "fermuch:stats.js"
  },
  {
    description: "Detect out of date packages in your app",
    name: "fourquet:anti-gravity"
  }
];

var constellationPluginUmbrellas = {
  'babrahams:constellation' : ['constellation:console','babrahams:temple','constellation:subscriptions','constellation:session','constellation:autopublish','constellation:tiny','constellation:position','lai:ddp-inspector']
};