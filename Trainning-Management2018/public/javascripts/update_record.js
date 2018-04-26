var monk = require('monk');
var db = monk('localhost:27017/examdb');
var record_collection = db.get('learning_record');

var update_record = function(username, recordArray, coursename, docname, record, cb) {
	for (var i=0; i<racordArray.length; i++) {
		if(racordArray[i].courseid == coursename) {
			if(recordArray[i].document.docName == docname) {
				record_collection.update({$set:{recordArray[i].document.record:record}});
			}else if(recordArray[i].video.docName == docname) {
				record_collection.update({$set:{recordArray[i].video.record:record}});
			}else if(recordArray[i].scenario.docName == docname) {
				record_collection.update({$set:{recordArray[i].scenario.record:record}});
			}
			//record_collection.update({username:username, recordArray[i].courseId:courseid, recordArray[i].document.docName:docname}, {$set:{recordArray[i].document.record:record}});
		}
	}
}