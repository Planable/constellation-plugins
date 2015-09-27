/*var remote = DDP.connect('http://packages.meteor.com');
var Future = Npm.require('fibers/future');*/

Meteor.methods({
  'Constellation_plugins_add_remove': function (type, packages) {
	
	check(type, String);
	check(packages, [String]);
	
	if (packages.length) {
		
	  spawn = Npm.require('child_process').spawn;

	  var args = [];
	  
	  args = args.concat([type].concat(packages));

	  command = spawn('meteor', args);

	  command.stdout.on('data',  function (data) {
		console.log('stdout: ' + data);
	  });
	
	  command.stderr.on('data', function (data) {
		console.log('stderr: ' + data);
	  });
	
	  command.on('exit', function (code) {
		console.log('child process exited with code ' + code);
		spawn = Npm.require('child_process').spawn;
		command = spawn('meteor', args);
	  });
	}
  },
  /*'Constellation_plugins_getAll': function () {
    var future = new Future();
	remote.call('syncNewPackageData', { format: '1.1' }, function (err, res) {
	  //console.log('  Page', count++);
	  if (err) return console.log('error', err);
	  if (!res) return console.log('no result');
	
	  var packageList = [];
	
	  _.each(res.collections.packages, function(p) {
        // Need the package name
		packageList.push({name: p.name});
	  });
	
	  _.each(res.collections.versions, function(v) {
		// v.packageName, v.dependencies
		console.log(v);
	  });
	
	  if(res.syncToken) {
		// Use this to get the rest of the packages
	  }
	  future.return(packageList);
	});
    return future.wait();
  }*/
});