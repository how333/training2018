var questionData = [];

// DOM Ready =============================================================
$(document).ready(function() {


    console.log('here');

    var time = { hours: "", minutes: ""};
    var seconds = 0;

    // Populate the question table on intial load
    fillQuestions();    

    // Question link click
    $('#questionList table tbody').on('click', 'td a.linkshowuser', showUserInfo);

});

// Functions =============================================================

// Fill Question List
function fillQuestions() {

    // Empty content string
    var tableContent = '';


    // jQuery AJAX call for JSON
    $.getJSON( '/take_exam/list', {exam_code: exam_code}, function( data ) {

        // Question Content
        
        questionData = data.question_list;
        question_total = [];
        question_num_total = [];

        exam_operation_data = data.question_list_operation;
        exam_operation_length = data.question_list_operation.length;




        username = $("input[name='username']").val();

        //Exam time data

        $qno=1;

        data.question_list_operation.forEach(function(data){
            //alert('foreachhhhhhhhhhhhhhhhhh');
            //alert(data);
            //alert(data.question);
            })
        // For each item in our JSON, add a question link and answer select box

        $.each(exam_operation_data, function(){

                tableContent += '<tr>';
                tableContent += '<td><a href="#" class="linkshowuser" rel="' + $qno + '">' + $qno + '</a></td>';

                //tableContent +=  '<td><select name="response'+$qno+'"><option value=" "> </option><option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="D">D</option><option value="E">E</option></select></td>';

                tableContent += '</tr>';
                $qno+=1;

        });

        // Inject the whole content string into our existing HTML table
        $('#questionList table tbody').html(tableContent); 
    });
};

// Show Question
function showUserInfo(event) {

    // Prevent Link from Firing
    event.preventDefault();
    // Retrieve question number from link rel attribute
    var qno = $(this).attr('rel')-1;
    var questionObject = exam_operation_data[qno]

    // Get corresponding Question

    var content_temp = '';

    var number_temp = qno+1;
    content_temp +='<h4>Question   '+number_temp+':'+questionObject.question+'</h4><br>'
    $("p").html(content_temp);
    var val = questionObject.scenario;
    //alert(val);
    $("[name='scenario']").val(val);
    $("#start_to_operation").show();

};
