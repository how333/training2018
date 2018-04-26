var exam_obj = [];

// DOM Ready =============================================================
$(document).ready(function() {

    //alert('abc');
   // Empty content string
    var tableContent = '';


    $.getJSON( '/make_exam/getExamCode', {exam_code: exam_code}, function( ExamCode ) {


        if(ExamCode.question_list == undefined)
            exam_obj = [];
        else
            exam_obj = ExamCode.question_list;

        if(ExamCode.question_list_adventitious == undefined)
            exam_adventitious_obj = [];
        else
            exam_adventitious_obj = ExamCode.question_list_adventitious;

        exam_name = ExamCode.exam_name;
        exam_single = parseInt(ExamCode.exam_single);
        exam_adventitious = parseInt(ExamCode.exam_adventitious);
        exam_single_pointvalue = parseInt(ExamCode.exam_single_pointvalue);
        exam_adventitious_pointvalue = parseInt(ExamCode.exam_adventitious_pointvalue);


    })
    
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
            //alert('start');
            var username = response_data.username;

            var IDnumber = response_data.IDnumber;

            var exam_start_time = JSON.stringify(new Date(response_data.exam_start_time));

            exam_start_time= exam_start_time.slice(1,-6);
            //alert(exam_start_time);
            //alert(exam_start_time);
            //alert(username);
            //console.log(docs);
            var response_obj = response_data.response;
            var response_num_obj = response_data.response_num;
            //var total_questions = 0;
            var correct_single = 0;
            var correct_adventitious = 0;
            var score = 0;
            var score_subject = 0;
            console.log('response_obj');
            console.log(response_obj);
            //alert(response_data.score_subject );
            if(response_data.score_subject == undefined)
            {
                score_subject = 0;
            }
            else
            {
                for(var temp in response_data.score_subject) 
                {
                    //alert(score_subject);
                    //alert(response_data.score_subject[temp]);
                    score_subject += parseInt(response_data.score_subject[temp]);
                    
                }
                //alert(score_subject);
            }
            
            for(var temp in response_obj) {
                console.log(temp);
                //console.log(response_obj[temp]);
                //total_questions++;
                if (temp<exam_single)
                {
                    console.log('singal');
                    console.log(response_obj[temp]);
                    console.log(response_num_obj[0][temp]);
                    console.log(exam_obj[response_num_obj[0][temp]]);
                    if(response_obj[temp] == exam_obj[response_num_obj[0][temp]].key)
                    {
                            correct_single++;
                    }
                }
                else if(temp< (exam_single + exam_adventitious))
                {
                   var correct_temp = 1;
                    if(response_obj[temp].length == exam_adventitious_obj[response_num_obj[1][temp-exam_single]].key.length)
                    {
                        for(var temp2 in response_obj[temp])
                        {
                            if(response_obj[temp][temp2] != exam_adventitious_obj[response_num_obj[1][temp-exam_single]].key[temp2])
                            {
                                correct_temp = 0;
                                break;
                            }
                        }
                    }
                    else
                    {
                        correct_temp = 0;
                    }
                    
                    //if(response_obj[temp] == exam_adventitious_obj[response_num_obj[1][temp-exam_single]].key)
                    if(correct_temp == 1)
                    {

                            correct_adventitious++;
                    }
                }
            }


        score = exam_single_pointvalue*correct_single + exam_adventitious_pointvalue*correct_adventitious;
        total_score = score + score_subject;
        tableContent += '<tr>';
        tableContent += '<td>'+username+'</td>';
        tableContent += '<td>'+IDnumber+'</td>';
        tableContent += '<td>'+exam_start_time+'</td>'
        tableContent += '<td>'+total_score+'</td>';
        $qno+=1;
            //console.log('exams/performance');
            })
        // For each item in our JSON, add a question link and answer select box


        // Inject the whole content string into our existing HTML table

        $('#questionList table tbody').html(tableContent); 


        //$('#questionList table tbody').html(tableContent); 
    });

});


