var xlsx = require("node-xlsx");



var ReadExcel = function() {};  
  
// Parses the specified text.  
ReadExcel.prototype.readexcel = function(filepath) {  

	var list = xlsx.parse(filepath);
	console.log(list);
	return list;
	
};  

// Export the Parser constructor from this module.  
module.exports = ReadExcel;

