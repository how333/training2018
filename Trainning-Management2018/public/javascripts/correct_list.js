var response_data_all = null;

// DOM Ready =============================================================
$(document).ready(function() {

   // alert('abc');
   // Empty content string
    var tableContent = '';
    $.getJSON( '/make_exam/getExamCode', {exam_code: exam_code}, function( ExamCode ) {
         exam_obj_subjective = ExamCode.question_list_subjective;
        exam_single_length = parseInt(ExamCode.exam_single);
        exam_adventitious_length = parseInt(ExamCode.exam_adventitious);
    })
    
    // jQuery AJAX call for JSON
    $.getJSON( '/make_exam/list', {exam_code: exam_code}, function( data ) {
        
        response_data_all = data;
        data.forEach(function(response_data){

            var username = response_data.username;
            //alert(response_data.score_subject);
            if(response_data.score_subject == undefined)

        {            
            if(response_data.exam_taken == true)
            {
                    var content = "<option value='";
                    content += username;
                    content += "'>";
                    content += username;
                    content += "</option>";
                    //alert(content);
                    $("#NameList").append(content); 
            }

        }
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
    $qno = 1;
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
            
            $.getJSON( '/make_exam/update_score', {exam_code: exam_code,username:name,score_subject:subject_score_temp}, function( data ) {
                $("p").html('select a student first');
             });

        }
});

});
