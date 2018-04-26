var response_data_all = null;

// DOM Ready =============================================================
$(document).ready(function() {

    //alert('abc');
    //alert(exam_code);
    //alert(username);
   // Empty content string
    var subject_score_temp = [];
    
    $.getJSON( '/make_exam/getExamCode_by_stu', {exam_code: exam_code}, function( ExamCode ) {
         //alert('start');
         exam_obj_subjective = ExamCode.question_list_subjective;
         //alert(JSON.stringify(ExamCode));
         //alert(JSON.stringify(exam_obj_subjective));
        exam_single_length = parseInt(ExamCode.exam_single);
        exam_adventitious_length = parseInt(ExamCode.exam_adventitious);
    
    $.getJSON( '/make_exam/get_response_by_usernameAndexamcode', {exam_code: exam_code,username:username}, function( response_data ) {
        //alert('response_content');
        //alert(JSON.stringify(response_data));
        response_content = response_data.response.slice(exam_single_length+exam_adventitious_length);
        //alert(exam_obj_subjective);
        //alert(response_content);
        $.getJSON( '/make_exam/get_response_score_automatic_Cosine', {exam_obj_subjective: exam_obj_subjective,response_content:response_content}, function( score_Cosine ) {
            //alert(JSON.stringify(score_Cosine));
            $.getJSON( '/make_exam/get_response_score_automatic_Levenshtein', {exam_obj_subjective: exam_obj_subjective,response_content:response_content}, function( score_Levenshtein ) {
                //alert(JSON.stringify(score_Levenshtein));

                for(var temp in score_Cosine)
                {
                    if(score_Cosine[temp]>score_Levenshtein[temp])
                        subject_score_temp.push(Math.round(score_Cosine[temp]*10)/10);
                    else
                        subject_score_temp.push(Math.round(score_Levenshtein[temp]*10)/10);
                }
                //alert(JSON.stringify(subject_score_temp));

            $.getJSON( '/make_exam/update_score_automatic', {exam_code: exam_code,username:username,score_subject:subject_score_temp}, function( data ) {
                //alert(JSON.stringify(data));
             });

                
            });
            
        });

});
    });
    


$('#NameList').change(function() {
    $("p").html('no content yet');
    name = $("#NameList").find("option:selected").text();

    response_content = null;
    response_data_all.forEach(function(response_data){
        if(name == response_data.username)
        {
                //alert(exam_single_length+exam_adventitious_length);
                //alert(response_data.response.slice(exam_single_length+exam_adventitious_length));
                response_content = response_data.response.slice(exam_single_length+exam_adventitious_length);

            //alert(response_content);
        }

    });
    var content_temp = '';
    
    var subject_score_temp = [];
    for(var temp in exam_obj_subjective)
    {

        content_temp +=   '<strong>题目'+$qno+':</strong><span>'+exam_obj_subjective[temp].question+'</span>';
        content_temp +=   '<span>('+exam_obj_subjective[temp].figures+')</span><br>';
        content_temp +=   '<strong>答案'+$qno+':</strong><span>'+response_content[temp]+'</span><br><br>';
        content_temp +=   '<strong>得分'+$qno+':</strong><input type="text" name="subject_score" value=""><br><br>';
                
        $qno+=1;
    }

    $("p").html(content_temp);
});

$("#submint_score").click(function() {
        var score_all = 1;
        var subject_score_temp = [];
        $('input[name="subject_score"]').each(function(){
        var v = $(this).val();
            if(v == '')
            {
                //alert('no score all');
                score_all = 0;
            }
            else
            {
                subject_score_temp.push(v);
            }

        });

        if(score_all == 1)
        {
            $("#NameList").find("option:selected").remove();
            
            $.getJSON( '/make_exam/update_score_automatic', {exam_code: exam_code,username:username,score_subject:subject_score_temp}, function( data ) {
                $("p").html('select a student first');
             });

        }
});

});
