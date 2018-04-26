var fs = require('fs'); // 引入fs模块



var Runbat = function() {  
  
};  
  
// Parses the specified text.  
Runbat.prototype.Runbat = function(docname) {  
	var exec = require('child_process').exec;
	//var cmd = ' start "" "../files/documents/123456.doc" ';
	var cmd = ' start "" "../files/documents/' + docname;
	exec(cmd, function(err, stdout, stderr) {
	if (err) {
	console.error(err);
	return;
	}
	console.log(stdout); 
	});
	
};  


// Export the Parser constructor from this module.  
module.exports = Runbat;

