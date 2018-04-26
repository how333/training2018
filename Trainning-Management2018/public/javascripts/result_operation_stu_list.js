var exam_obj = [];

// DOM Ready =============================================================
$(document).ready(function() {


   // Empty content string
    var tableContent = '';
    var html_content = '';
    //alert(username);


    $.getJSON( '/make_exam/getExamCode_by_stu', {exam_code: exam_code}, function( ExamCode ) {

         exam_operation_obj = ExamCode.question_list_operation;
         //alert(exam_operation_obj);
    })
    
    // jQuery AJAX call for JSON
    $.getJSON( '/make_exam/list_by_stu', {exam_code: exam_code}, function( data ) {

        // Question Content
        

        $qno=1;

        data.forEach(function(response_data){
        //$.each(data.question_list, function(index){

           
            //var response_obj = response_data.response;
            //var response_num = response_data.response_num;
            //var total_questions = 0;
           // var attempted = 0;
            //var correct = 0;
            var username_stu = response_data.username;
            if (username == username_stu)
            {
            //var stu_response_temp = response_data.response.slice(exam_single+exam_adventitious);
            //console.log(docs);
            //alert(stu_response_temp);
            //var response_obj = response_data.response;
            //var response_num_obj = response_data.response_num;
            //var total_questions = 0;
            var score_operation = 0;
            //console.log('response_obj');
            //console.log(response_obj);
            //alert(response_data.score_subject );
            if(response_data.score_operation == undefined)
            {
                score_operation = '还未评分';
                html_content += '还未评分';
            }
            else
            {
                for(var temp in response_data.score_operation) 
                {
                    //alert(response_data.score_operation[temp]);
                    //alert(response_data.score_subject[temp]);
                    //alert(exam_subjective_obj[temp].question);
                    score_operation += parseInt(response_data.score_operation[temp]);
                    html_content += '<strong>问题:</strong>';
                    html_content += exam_operation_obj[temp].question;
                    html_content += '<br>';


                    html_content +='<strong>你的得分:</strong>';
                    html_content +=response_data.score_operation[temp];
                    html_content += '<br>';
                    html_content += '<br>';
                    
                }
                //alert(score_subject);
            }

            
            //html_content = '<br><br><br>'+html_content;
            $("p").html(html_content);
         }//end of if 

            })


        


    });

});


