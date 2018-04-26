var fs = require('fs'); // 引入fs模块
var path = require('path');
var xml2js = require('xml2js');
var parser = new xml2js.Parser({explicitArray: false});



var Getdocuments = function() {  
  
};  
  
// Parses the XML file
Getdocuments.prototype.get_scenario_content = function(filename) {  
	console.log('read scenario');
	var path = '../public/files/scenarios/' + filename;
	data = fs.readFileSync(path);
	return data;
};   

Getdocuments.prototype.get_messages_content = function(filename) {  
	console.log('read messages');
	var path = '../public/files/messages/' + filename;
	console.log(__dirname);

	data = fs.readFileSync(path);
	return data;
	/*
	fs.readFile(path, function(err, data) {
		console.log('start to data');
		console.log(data);
		return data;
	});
	*/
};   


Getdocuments.prototype.getdocuments = function(doctype) {  

	var filepath = [];
	var basepath = process.cwd();
	files = fs.readdirSync('../public/files/documents');

	return files;
	
};  


Getdocuments.prototype.getvideos = function() {  
	return fs.readdirSync('../public/files/videos');
};  

Getdocuments.prototype.getscenarios = function() {  
	return fs.readdirSync('../public/files/scenarios');
};  

Getdocuments.prototype.renamedocument = function(oldname,newname) {  

    var basepath = path.resolve(__dirname, '..');
    basepath +=  '/public/files/documents/';

    var oldpath = basepath + oldname;
    var newpath = basepath + newname;
    console.log(oldpath,newpath);
    
	fs.rename(oldpath,newpath,function(err){ 
	 if(err){ 
	    console.log("fail"); 
	    return false;
	 }else{ 
	    console.log("pass"); 
	    return true;
	 } 
	});
};  

Getdocuments.prototype.renamevideo = function(oldname,newname) {  

    var basepath = path.resolve(__dirname, '..');
    basepath +=  '/public/files/videos/';

    var oldpath = basepath + oldname;
    var newpath = basepath + newname;
    console.log(oldpath,newpath);
    
	fs.rename(oldpath,newpath,function(err){ 
	 if(err){ 
	    console.log("fail"); 
	    return false;
	 }else{ 
	    console.log("pass"); 
	    return true;
	 } 
	});
};  

Getdocuments.prototype.renamescenario = function(oldname,newname) {  

    var basepath = path.resolve(__dirname, '..');
    basepath +=  '/public/files/scenarios/';

    var oldpath = basepath + oldname;
    var newpath = basepath + newname;
    console.log(oldpath,newpath);
    
	fs.rename(oldpath,newpath,function(err){ 
	 if(err){ 
	    console.log("fail"); 
	    return false;
	 }else{ 
	    console.log("pass"); 
	    return true;
	 } 
	});
};  


Getdocuments.prototype.delete_document = function(filename) {  

    var basepath = path.resolve(__dirname, '..');
    basepath +=  '/public/files/documents/';

    var filepath = basepath + filename;
    console.log(filepath);
    
	fs.unlink(filepath, function(err){ 
	 if(err){ 
	    console.log("删除失败！"); 
	 }else{ 
	    console.log("删除成功！"); 
	 } 
	});
};  

Getdocuments.prototype.delete_video = function(filename) {  

    var basepath = path.resolve(__dirname, '..');
    basepath +=  '/public/files/videos/';

    var filepath = basepath + filename;
    console.log(filepath);
    
	fs.unlink(filepath, function(err){ 
	 if(err){ 
	    console.log("删除失败！"); 
	 }else{ 
	    console.log("删除成功！"); 
	 } 
	});
};  

Getdocuments.prototype.delete_scenario = function(filename) {  

    var basepath = path.resolve(__dirname, '..');
    basepath +=  '/public/files/scenarios/';

    var filepath = basepath + filename;
    console.log(filepath);
    
	fs.unlink(filepath, function(err){ 
	 if(err){ 
	    console.log("删除失败！"); 
	 }else{ 
	    console.log("删除成功！"); 
	 } 
	});
};  
  
// Export the Parser constructor from this module.  
module.exports = Getdocuments;

