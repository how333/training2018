var math = require('math');
var Segment = require('segment');
var segment = new Segment();
segment.useDefault();


var  Correct_Automatic  = function() {  
  
};  
  
// Parses the XML file
Correct_Automatic.prototype.Cosine = function(exam_obj_subjective,response_content) {  
        score_Cosine = [];
        for(var temp in exam_obj_subjective)
        {

            var answer = exam_obj_subjective[temp].answer;
            var response = response_content[temp];
            var figures = exam_obj_subjective[temp].figures;

            var str_total = [];
	var str1 = segment.doSegment(answer, {stripPunctuation: true});
	str1.forEach(function(single_random){

	    console.log(single_random);
	    console.log(single_random.w);

	    if(str_total.indexOf(single_random.w)<0)
	    	str_total.push(single_random.w);
	});

	console.log('中国人');

	var str2 = segment.doSegment(response, {stripPunctuation: true});
	str2.forEach(function(single_random){
	    console.log(single_random);
	    console.log(single_random.w);

	    if(str_total.indexOf(single_random.w)<0)
	    	str_total.push(single_random.w);
	});

	console.log(str_total);

	str1_frequency = [];
	str2_frequency = [];
	for (var i=0;i<str_total.length;i++)
	{
		str1_frequency[i] = 0;
		str2_frequency[i] = 0;
	}

	console.log(str1_frequency);
	console.log(str2_frequency);


	str1.forEach(function(single_random){

	    var index = str_total.indexOf(single_random.w);
	    //console.log(index);
	    if(index >=0)
	    	str1_frequency[index] = str1_frequency[index] + 1;
	    	
	});

	str2.forEach(function(single_random){

	    var index = str_total.indexOf(single_random.w);
	    //console.log(index);
	    if(index >=0)
	    	str2_frequency[index] = str2_frequency[index] + 1;
	    	
	});
	console.log(str1_frequency);
	console.log(str2_frequency);


	var fenzi = 0;
	var fenmu1 = 0;
	var fenmu2 = 0;
	for (var i=0;i<str_total.length;i++)
	{
		fenzi += str1_frequency[i] * str2_frequency[i];
		fenmu1 += str1_frequency[i] * str1_frequency[i];
		fenmu2 += str2_frequency[i] * str2_frequency[i];

	}
	console.log(fenzi);
	console.log(fenmu1);
	console.log(fenmu2);
	fenmu1 = Math.sqrt(fenmu1);
	fenmu2 = Math.sqrt(fenmu2);
	console.log(fenmu1);
	console.log(fenmu2);

	var result = fenzi/(fenmu1 * fenmu2);
	console.log(result);
	score_Cosine.push(result*figures);
            
        }
        return score_Cosine;

};   


Correct_Automatic.prototype.Levenshtein = function(exam_obj_subjective,response_content) {  
        score_Levenshtein = [];
        for(var temp in exam_obj_subjective)
        {

            var answer = exam_obj_subjective[temp].answer;
            var response = response_content[temp];
            var figures = exam_obj_subjective[temp].figures;

	var str1 = answer;
	var str2 = response;
	str1_length = str1.length;
	str2_length = str2.length;

	console.log(str1_length);
	console.log(str2_length);

	var xMax = str1_length+1;
	var yMax = str2_length+1;
	var arr = new Array()  
	for (var i=0; i<xMax; i++) {  
	    arr[i] = new Array();  
	    for (var j=0; j<yMax; j++) {  
	        arr[i][j] = i + j;
	    }  
	} 
	//console.log(arr);  
	  


	var temp = null;

	for (var  i = 1; i <= str1_length; i++) {  


	    for (var  j = 1; j <= str2_length; j++) {  
	        if (str1.charAt(i - 1) == str2.charAt(j - 1)) {  
	            temp = 0;  
	        } else {  
	            temp = 1;  
	        }  
	        
	        //console.log(arr[i - 1][j - 1] + temp);
	        //console.log(j);
	        //console.log(arr[i][j - 1] + 1);
	        //console.log(arr[i - 1][j] + 1);
	        arr[i][j] = math.min(arr[i - 1][j - 1] + temp, arr[i][j - 1] + 1,  arr[i - 1][j] + 1);  


	    }  
	}  


	var  similarity =1 - arr[str1_length][str2_length] / math.max(str1_length, str2_length);

	console.log(similarity);
	score_Levenshtein.push(similarity*figures);

            
        }
        return score_Levenshtein;

};   
  
// Export the Parser constructor from this module.  
module.exports = Correct_Automatic;

