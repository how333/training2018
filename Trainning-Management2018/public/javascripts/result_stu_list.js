var exam_obj = [];

// DOM Ready =============================================================
$(document).ready(function() {


   // Empty content string
    var tableContent = '';
    var html_content = '';
    //alert(username);


    $.getJSON( '/make_exam/getExamCode_by_stu', {exam_code: exam_code}, function( ExamCode ) {

        if(ExamCode.question_list == undefined)
            exam_obj = [];
        else
            exam_obj = ExamCode.question_list;

        if(ExamCode.question_list_adventitious == undefined)
            exam_adventitious_obj = [];
        else
            exam_adventitious_obj = ExamCode.question_list_adventitious;

        if(ExamCode.question_list_subjective == undefined)
            exam_subjective_obj = [];
        else
            exam_subjective_obj = ExamCode.question_list_subjective;

        
         //exam_obj = ExamCode.question_list;
         //exam_adventitious_obj = ExamCode.question_list_adventitious;
         //exam_subjective_obj = ExamCode.question_list_subjective;
         //alert(exam_adventitious_obj);
        exam_single = parseInt(ExamCode.exam_single);
        exam_adventitious = parseInt(ExamCode.exam_adventitious);
        exam_single_pointvalue = parseInt(ExamCode.exam_single_pointvalue);
        exam_adventitious_pointvalue = parseInt(ExamCode.exam_adventitious_pointvalue);


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
            var stu_response_temp = response_data.response.slice(exam_single+exam_adventitious);
            //console.log(docs);
            //alert(stu_response_temp);
            var response_obj = response_data.response;
            var response_num_obj = response_data.response_num;
            //var total_questions = 0;
            var correct_single = 0;
            var correct_adventitious = 0;
            var score = 0;
            var score_subject = 0;
            //console.log('response_obj');
            //console.log(response_obj);
            //alert(response_data.score_subject );
            if(response_data.score_subject == undefined)
            {
                score_subject = '';
                html_content += '';
            }
            else
            {
                for(var temp in response_data.score_subject) 
                {
                    //alert(score_subject);
                    //alert(response_data.score_subject[temp]);
                    //alert(exam_subjective_obj[temp].question);
                    score_subject += parseInt(response_data.score_subject[temp]);
                    html_content += '<strong>问题: </strong>';
                    html_content += exam_subjective_obj[temp].question;
                    html_content += '<br>';

                    html_content += '<strong>你的答案: </strong>';
                    html_content += stu_response_temp[temp];
                    html_content += '<br>';

                    html_content +='<strong>得分: </strong>';
                    html_content +=response_data.score_subject[temp];
                    html_content += '<br>';
                    html_content += '<br>';
                    
                }
                //alert(score_subject);
            }
            $qno=1;
            for(var temp in response_obj) {
                console.log(temp);
                //console.log(response_obj[temp]);
                //total_questions++;
                if (temp<exam_single)
                {
                    console.log('singal');
                    console.log(response_obj[temp]);
                    console.log(response_num_obj[0][temp]);
                    tableContent += '<br><strong>问题'+$qno+': </strong>';
                    for(var content_temp in exam_obj[response_num_obj[0][temp]])
                    {
                        tableContent += '<br>';
           
                        if(content_temp.indexOf('question')==0)
                            tableContent += '题目';
                        else if (content_temp.indexOf('optionA')==0)
                            tableContent += '选项A';
                        else if (content_temp.indexOf('optionB')==0)
                            tableContent += '选项B';
                        else if (content_temp.indexOf('optionC')==0)
                            tableContent += '选项C';
                        else if (content_temp.indexOf('optionD')==0)
                            tableContent += '选项D';
                        else if (content_temp.indexOf('key')==0)
                            tableContent += '答案';

                        tableContent += ': ';
                        //tableContent += exam_obj[response_num_obj[0][temp]][content_temp];

                    }
                        tableContent += '<br>';
                        tableContent += '你的答案: ';
                        tableContent += response_obj[temp];
                    console.log(exam_obj[response_num_obj[0][temp]]);
                    if(response_obj[temp] == exam_obj[response_num_obj[0][temp]].key)
                    {
                            correct_single++;
                    }
                    $qno+=1;
                }
                else if(temp< (exam_single + exam_adventitious))
                {
                    tableContent += '<br><strong>问题'+$qno+': </strong>';
                    for(var content_temp in exam_adventitious_obj[response_num_obj[1][temp-exam_single]])
                    {
                        tableContent += '<br>';
                        if(content_temp.indexOf('question')==0)
                            tableContent += '题目';
                        else if (content_temp.indexOf('optionA')==0)
                            tableContent += '选项A';
                        else if (content_temp.indexOf('optionB')==0)
                            tableContent += '选项B';
                        else if (content_temp.indexOf('optionC')==0)
                            tableContent += '选项C';
                        else if (content_temp.indexOf('optionD')==0)
                            tableContent += '选项D';
                        else if (content_temp.indexOf('optionE')==0)
                            tableContent += '选项E';
                        else if (content_temp.indexOf('key')==0)
                            tableContent += '答案';

                        tableContent += ': ';
                        //tableContent += exam_adventitious_obj[response_num_obj[1][temp-exam_single]][content_temp];

                    }
                        tableContent += '<br>';
                        tableContent += '你的答案: ';
                        tableContent += response_obj[temp];



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
                    $qno+=1;
                }

            }
            
            html_content = '<br><br><br>'+html_content;
            $("p").html(tableContent + html_content);
         }//end of if 

            })


        


    });

});


