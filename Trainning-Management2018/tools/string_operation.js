  
var StringOperation = function() {  
  
};  

// Parses the XML file
StringOperation.prototype.is_card_id = function(str) {  
   var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;  
   
   if(reg.test(str) === false)  
   	return false;
   else
   	return true;
};   

StringOperation.prototype.is_mobile_number = function(str) {  
   var reg = /^0?1[3|4|5|8][0-9]\d{8}$/;  
   
   if(reg.test(str) === false)  
   	return false;
   else
   	return true;
};   


// Export the Parser constructor from this module.  
module.exports = StringOperation;

