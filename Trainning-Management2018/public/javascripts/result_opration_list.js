var exam_obj = [];

// DOM Ready =============================================================
$(document).ready(function() {

    //alert('abc');
   // Empty content string
    var tableContent = '';


    $.getJSON( '/make_exam/getExamCode', {exam_code: exam_code}, function( ExamCode ) {


         exam_obj = ExamCode.question_list;
         exam_adventitious_obj = ExamCode.question_list_adventitious;
        exam_single = parseInt(ExamCode.exam_single);
        exam_adventitious = parseInt(ExamCode.exam_adventitious);
        exam_single_pointvalue = parseInt(ExamCode.exam_single_pointvalue);
        exam_adventitious_pointvalue = parseInt(ExamCode.exam_adventitious_pointvalue);


    });
    
    // jQuery AJAX call for JSON
    $.getJSON( '/make_exam/list', {exam_code: exam_code}, function( data ) {

        // Question Content
        

        $qno=1;

        data.forEach(function(response_data){
        //$.each(data.question_list, function(index){

           
            //var response_obj = response_data.response;
            //var response_num = response_data.response_num;
            //var total_questions = 0;
           // var attempted = 0;
            //var correct = 0;
            var username = response_data.username;
            var IDnumber = response_data.IDnumber;

            var exam_start_time = JSON.stringify(new Date(response_data.operation_exam_start_time));

            exam_start_time= exam_start_time.slice(1,-6);

            var modify_time = JSON.stringify(new Date(response_data.modify_time));

            modify_time= modify_time.slice(1,-6);

            //console.log(docs);
            var response_obj = response_data.response;
            var response_num_obj = response_data.response_num;
            //var total_questions = 0;
            var correct_single = 0;
            var correct_adventitious = 0;
            var score = 0;
            var score_operation = 0;
            console.log('response_obj');
            console.log(response_obj);
            //alert(response_data.score_subject );
            if(response_data.score_operation == undefined)
            {
                score_operation = -1;
            }
            else
            {
                for(var temp in response_data.score_operation) 
                {
                    //alert(score_subject);
                    //alert(response_data.score_subject[temp]);
                    score_operation += parseInt(response_data.score_operation[temp]);
                    
                }
                //alert(score_subject);
            }
            



        //score = exam_single_pointvalue*correct_single + exam_adventitious_pointvalue*correct_adventitious;
        total_score =  score_operation;
        tableContent += '<tr>';
        tableContent += '<td>'+username+'</td>';
        tableContent += '<td>'+IDnumber+'</td>';
        tableContent += '<td>'+exam_start_time+'</td>'
        tableContent += '<td>'+total_score+'</td>';
        tableContent += '<td>'+modify_time+'</td>';
        
        $qno+=1;
            //console.log('exams/performance');
            })
        // For each item in our JSON, add a question link and answer select box


        // Inject the whole content string into our existing HTML table

        $('#questionList table tbody').html(tableContent); 


        //$('#questionList table tbody').html(tableContent); 
    });

});


