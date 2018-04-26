var response_data_all = null;

// DOM Ready =============================================================
$(document).ready(function() {

    //alert('abc');
   // Empty content string
    var tableContent = '';
    $.getJSON( '/make_exam/getExamCode', {exam_code: exam_code}, function( ExamCode ) {
         exam_obj_operation = ExamCode.question_list_operation;
    })
    
    // jQuery AJAX call for JSON
    $.getJSON( '/make_exam/list', {exam_code: exam_code}, function( data ) {
        
        response_data_all = data;
        data.forEach(function(response_data){

            var username = response_data.username;
            
            if(response_data.score_operation )

        {            
                    var content = "<option value='";
                    content += username;
                    content += "'>";
                    content += username;
                    content += "</option>";
                    //alert(content);
                    $("#NameList").append(content);
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
                //response_content = response_data.response.slice(exam_single_length+exam_adventitious_length);
                response_score = response_data.score_operation;
            //alert(response_content);
        }

    });

    var content_temp = '';
    $qno = 1;
    for(var temp in exam_obj_operation)
    {

        content_temp +=   '<strong>Question'+$qno+':</strong><span>'+exam_obj_operation[temp].question+'</span>';
        content_temp +=   '<span>('+exam_obj_operation[temp].figures+')</span><br>';
        
        content_temp +=   '<strong>Score'+$qno+':</strong><input type="text" name="operation_score" value="'+response_score[temp]+'"><br><br>';
                
        $qno+=1;
    }

    $("p").html(content_temp);
});

$("#submint_score").click(function() {
        var score_all = 1;
        var operation_score_temp = [];
        $('input[name="operation_score"]').each(function(){
        var v = $(this).val();
            if(v == '')
            {
                //alert('no score all');
                score_all = 0;
            }
            else
            {
                operation_score_temp.push(v);
            }

        });

        
        if(score_all == 1)
        {
            $("#NameList").find("option:selected").remove();
            
            $.getJSON( '/make_exam/update_score_operation', {exam_code: exam_code,username:name,score_operation:operation_score_temp}, function( data ) {
                $("p").html('select a student first');
             });

        }
});

});
