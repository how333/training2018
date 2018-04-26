var questionData = [];

// DOM Ready =============================================================
$(document).ready(function() {


    //alert('here');


    var time = { hours: "", minutes: ""};
    var seconds = 0;
    var time_to_save = 0;

    // Populate the question table on intial load
    fillQuestions(time);
    //fillResponse();    
    
    //Timer
    var timer = setInterval(function() { 
       
        document.getElementById("time").innerHTML = time.hours + " hrs " + time.minutes + " mins " + (seconds) + " secs" ;

        //Trigger submit on completion of time
        if(time.hours == 0 && time.minutes == 0 && seconds == 0 )
        {
            clearInterval(timer);
            document.getElementById("formResponse").submit();
        }

        seconds--;
        time_to_save++;

        //if(time_to_save%(10*60*1000)==0)
        if(time_to_save%(10*60)==0)
            Save_Response();

        if(seconds == -1)
        {
            seconds = 59;
            time.minutes-=1;

            if(time.minutes == -1)
            {
                time.minutes = 59;
                time.hours-=1;
            }
        }
     }, 1000);

    // Question link click
    $('#questionList table tbody').on('click', 'td a.linkshowuser', showUserInfo);

    $("#save").click(function() {
            //alert('save');
            var response_save = [];
            var answer_all_done = true;


         $('select').each(function () {
            var default_response_save = {};
            default_response_save.type = 'select';
            default_response_save.name = $(this).attr('name'); //获取单个text
            default_response_save.val = $(this).get(0).selectedIndex;
            response_save.push(default_response_save);
            if($(this).val()== ''){
                //alert('select');
                answer_all_done = false;
            }
         });

             $("input[type=checkbox]").each(function () {
                var default_response_save = {};
                default_response_save.type = 'checkbox';
                default_response_save.name = $(this).attr('id'); //获取单个text
                default_response_save.val = $(this).prop('checked'); //获取单个value
                response_save.push(default_response_save);
                name = $(this).attr('name'); 
                //alert($("input[name="+name+"]:checked").length);
                length = $("input[name="+name+"]:checked").length;
                if(length == 0){
                    answer_all_done = false;
                }

             });
            
             $("textarea").each(function () {
                var default_response_save = {};
                default_response_save.type = 'textarea';
                default_response_save.name = $(this).attr('name'); //获取单个text
                default_response_save.val = $(this).val(); //获取单个value
                response_save.push(default_response_save);
                if($(this).val() == ''){
                    answer_all_done = false;
                }
             });

        //alert(JSON.stringify(response_save));
        $.getJSON( '/take_exam/response_save', {exam_code: exam_code,
                                                                username:username,
                                                                response_save:response_save}, function( data ) {});
             


    });


    $("#submit_fake").click(function() {
            var response_save = [];
            var answer_all_done = true;
            var temp_name = '';


         $('select').each(function () {
            var default_response_save = {};
            default_response_save.type = 'select';
            default_response_save.name = $(this).attr('name'); //获取单个text
            default_response_save.val = $(this).get(0).selectedIndex;

            if($(this).val()== ''){
                var temp_str = 'Question '+ $(this).attr('name') + ' no answer yet';
                alert(temp_str);
                answer_all_done = false;
            }
         });

             $("input[type=checkbox]").each(function () {
                var default_response_save = {};
                default_response_save.type = 'checkbox';
                default_response_save.name = $(this).attr('id'); //获取单个text
                default_response_save.val = $(this).prop('checked'); //获取单个value

                name = $(this).attr('name'); 
                //alert($("input[name="+name+"]:checked").length);
                length = $("input[name="+name+"]:checked").length;
                if(length == 0){
                    var temp_str = 'Question '+ name + ' no answer yet';
                    if( temp_name != name)
                    {
                        alert(temp_str);
                        temp_name = name;
                    }
                    
                    answer_all_done = false;
                }

             });
            
             $("textarea").each(function () {
                var default_response_save = {};
                default_response_save.type = 'textarea';
                default_response_save.name = $(this).attr('name'); //获取单个text
                default_response_save.val = $(this).val(); //获取单个value
                if($(this).val() == ''){
                    var temp_str = 'Question '+ $(this).attr('name') + ' no answer yet';
                    alert(temp_str);
                    answer_all_done = false;
                }
             });

             
             if(answer_all_done == true)
             {

                    if(confirm("是否要提交试卷")){
                       document.getElementById("formResponse").submit();
                }              
            }
                

    });

});

// Functions =============================================================

// Fill Question List
function fillQuestions(time) {

     //var submit = document.getElementById("submit");
     //submit.disabled=true;
     $("#submit").hide();

    // Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON( '/take_exam/list', {exam_code: exam_code}, function( data ) {

        // Question Content
        username = $("input[name='username']").val();
        //alert(username);
        exam_start_time = $("input[name='exam_start_time']").val();
        //alert(exam_start_time);

        
        question_total = [];
        question_num_total = [];
        response_save = [];
        exam_single = data.exam_single;
        exam_adventitious = data.exam_adventitious;
        if(data.question_list == undefined)
        {
            exam_single_length = 0;
            questionData = [];
        }
        else
        {
            questionData = data.question_list;
            exam_single_length = data.question_list.length;
        }
        //alert('b');
        if(data.question_list_adventitious == undefined)
        {
            exam_adventitious_length = 0;
        }
        else
        {
            exam_adventitious_length = data.question_list_adventitious.length;
        }
        //alert('c');
        if(data.question_list_subjective == undefined)
        {
            exam_subjective_length = 0;
            exam_subjective_data = [];
        }
        else
        {
            exam_subjective_data = data.question_list_subjective;
            exam_subjective_length = data.question_list_subjective.length;          
        }



    $.getJSON( '/take_exam/get_response', {username:username,exam_code: exam_code}, function( response_data ) {
        
        //alert(JSON.stringify(response_data));

        if(response_data.response_num == null)
        {
            //alert('response_num  NULL');
            time.hours = data.duration_hours;
            time.minutes = data.duration_minutes;
            //alert('response_data 3');
            //alert(exam_single);
           // alert(exam_single_length);
           var exam_single_random = null;
           var exam_adventitious_random = null;
           if (exam_single == 0)
                exam_single_random = [-1];
            else
            {
            exam_single_random = GetRandomNums(exam_single,exam_single_length);
            //alert(exam_single_random);
            exam_single_random.forEach(function(single_random){
                //alert(single_random);
                question_total.push(data.question_list[single_random]);
                });
            }

            question_num_total.push(exam_single_random);
            //alert('response_num 2');
            var exam_adventitious_random = null;
            if(exam_adventitious == 0)
                exam_adventitious_random = [-1];
            else
            {
            exam_adventitious_random = GetRandomNums(exam_adventitious,exam_adventitious_length);
            //alert(exam_adventitious_random);
            exam_adventitious_random.forEach(function(adventitious_random){
                question_total.push(data.question_list_adventitious[adventitious_random]);
                })
            }


            question_num_total.push(exam_adventitious_random);
                //alert('response_num');
                $.getJSON( '/take_exam/response_num', {exam_code: exam_code,
                                                                        username:username,
                                                                        question_num_total:question_num_total,
                                                                        exam_start_time:exam_start_time}, function( data ) {});



        }
        else
        {
            //alert('has response_num');
            question_num_total = response_data.response_num;
            response_save = response_data.response_save;
            //alert(question_num_total);
            //alert(response_save);
            var d = new Date();
            var time_now = d.getTime();
            var time_pass = time_now - exam_start_time;

            exam_duration_millisecond_total = 3600000*data.duration_hours
                                                                + 60000*data.duration_minutes;

            time_remain = exam_duration_millisecond_total - time_pass;
            time.hours = parseInt(time_remain/3600000);
            time.minutes =parseInt( (time_remain%3600000)/60000 ) ;
            //alert(time.hours);
            //alert(time.minutes);
            //alert(JSON.stringify(question_num_total));
            var exam_single_random = question_num_total[0];
            //alert(exam_single_random);
            if(exam_single_random[0] != -1)
            {
            exam_single_random.forEach(function(single_random){
                //alert(single_random);
                question_total.push(data.question_list[single_random]);
                })
            question_num_total.push(exam_single_random);
            }


            var exam_adventitious_random = question_num_total[1];
            if(exam_adventitious_random[0] != -1)
            {
            exam_adventitious_random.forEach(function(adventitious_random){
                question_total.push(data.question_list_adventitious[adventitious_random]);
                })                
            }


        }//end of else


        $qno=1;

        // For each item in our JSON, add a question link and answer select box
        $.each(question_total, function(){
            if($qno <=exam_single)
            {
                //alert('<5');
                tableContent += '<tr>';
                tableContent += '<td><a href="#" class="linkshowuser" rel="' + $qno + '">' + $qno + '</a></td>';

                tableContent +=  '<td><select name="'+$qno+'"><option value=""> </option><option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="D">D</option></select></td>';
                tableContent += '</tr>';
                $qno+=1;
            }
            else  
            {
                //alert('>5');
                tableContent += '<tr>';
                tableContent += '<td><a href="#" class="linkshowuser" rel="' + $qno + '">' + $qno + '</a></td>';

                //tableContent +=  '<td><select name="response'+$qno+'"><option value=" "> </option><option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="D">D</option><option value="E">E</option></select></td>';
                tableContent +='<td><input id="'+$qno+'_A" name="'+$qno
                                        +'" type="checkbox" value="A" />A&nbsp &nbsp<input id="'+$qno+'_B" name="'+$qno
                                        +'" type="checkbox" value="B" />B&nbsp &nbsp<input id="'+$qno+'_C" name="'+$qno
                                        +'" type="checkbox" value="C" />C&nbsp &nbsp<input id="'+$qno+'_D" name="'+$qno
                                        +'" type="checkbox" value="D" />D&nbsp &nbsp<input id="'+$qno+'_E" name="'+$qno
                                        +'" type="checkbox" value="E" />E</td>'
                tableContent += '</tr>';
                $qno+=1;
                //alert(tableContent);
            }
          
        });
        $.each(exam_subjective_data, function(){

                tableContent += '<tr>';
                tableContent += '<td><a href="#" class="linkshowuser" rel="' + $qno + '">' + $qno + '</a></td>';

                //tableContent +=  '<td><select name="response'+$qno+'"><option value=" "> </option><option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="D">D</option><option value="E">E</option></select></td>';

                tableContent +='<td><textarea type="text" name="'+$qno+'" style="width:260;overflow-x:visible;overflow-y:visible;"></textarea></td>';
                tableContent += '</tr>';
                $qno+=1;

        });

        // Inject the whole content string into our existing HTML table
        $('#questionList table tbody').html(tableContent); 
             //alert(JSON.stringify(response_save));
            if(response_save!=null)
                fillResponse(response_save);

    });
    });

    

};

// Show Question
function showUserInfo(event) {

    // Prevent Link from Firing
    event.preventDefault();
    // Retrieve question number from link rel attribute
    var qno = $(this).attr('rel')-1;

    // Get corresponding Question
    var question_total_lenth = question_total.length;
    if(qno <question_total_lenth)
        var questionObject = question_total[qno];
    else
    {
        //alert(qno);
        //alert(question_total_lenth);
        //alert(qno-question_total_lenth);
        var questionObject = exam_subjective_data[qno-question_total_lenth];
    }


    var content_temp = '';
    if(qno <exam_single)
    {
            //Populate Question Box
    var number_temp = qno+1;
    content_temp +='<h4>Question   '+number_temp+':'+questionObject.question+'</h4><br>'
    content_temp += '<strong>A:</strong><span>'+questionObject.optionA+'</span><br>'
    content_temp += '<strong>B:</strong><span>'+questionObject.optionB+'</span><br>'
    content_temp += '<strong>C:</strong><span>'+questionObject.optionC+'</span><br>'
    content_temp += '<strong>D:</strong><span>'+questionObject.optionD+'</span><br>'
    $("p").html(content_temp);
    }
    else if(qno< question_total_lenth)
    {
    //alert('sceond');
    var number_temp = qno+1;
    content_temp +='<h4>Question   '+number_temp+':'+questionObject.question+'</h4><br>'
    content_temp += '<strong>A:</strong><span>'+questionObject.optionA+'</span><br>'
    content_temp += '<strong>B:</strong><span>'+questionObject.optionB+'</span><br>'
    content_temp += '<strong>C:</strong><span>'+questionObject.optionC+'</span><br>'
    content_temp += '<strong>D:</strong><span>'+questionObject.optionD+'</span><br>'
    content_temp += '<strong>E:</strong><span>'+questionObject.optionE+'</span><br>'
    $("p").html(content_temp);
    }
    else
    {
    var number_temp = qno+1;
    content_temp +='<h4>Question   '+number_temp+':'+questionObject.question+'</h4><br>'
    $("p").html(content_temp);
    }


};


function GetRandomNums(Number,Max)
{
    //alert('GetRandomNums');
    //alert(Number);
    //alert(Max);
    var num = [];
    if (Number == 0)
        return num;
    else
    {
    for(var i = 0; i < Number; i++){
        var val =  Math.floor(Math.random() * Max);
        var isEqu = false;
        for(var idx in num){
            if(num[idx] == val){isEqu = true; break;}
        }
        if(isEqu)
            i--;
        else
            num[num.length] = val;
    }
    return num;
    }
}

/*
function GetRandomNums(Number,Max)
{   
    var sum = 0;
    var numbers = [];

    while(sum < Number)
    {
        var number = GetOneRandomNum(0,Max);


        if(numbers.toString().indexOf(number)>-1) 
        {
            //alert('exist');
        }
        else
        {

            numbers.push(number);
            sum+=1;
            alert(sum);
            alert(numbers);
        }
    }

    return numbers;

}  

*/
function GetOneRandomNum(Min,Max)
{   
var Range = Max - Min;   
var Rand = Math.random();   
return(Min + Math.round(Rand * Range));   
};





function Save_Response() {
        //alert('save');
        var response_save = [];
        var answer_all_done = true;

         $('select').each(function () {
            var default_response_save = {};
            default_response_save.type = 'select';
            default_response_save.name = $(this).attr('name'); //获取单个text
            default_response_save.val = $(this).get(0).selectedIndex;
            response_save.push(default_response_save);
         });

         $("input[type=checkbox]").each(function () {
            var default_response_save = {};
            default_response_save.type = 'checkbox';
            default_response_save.name = $(this).attr('id'); //获取单个text
            default_response_save.val = $(this).prop('checked'); //获取单个value
            response_save.push(default_response_save);
         });
        
         $("textarea").each(function () {
            var default_response_save = {};
            default_response_save.type = 'textarea';
            default_response_save.name = $(this).attr('name'); //获取单个text
            default_response_save.val = $(this).val(); //获取单个value
            response_save.push(default_response_save);
         });

         //alert(JSON.stringify(response_save));

        //alert('response_save');
        $.getJSON( '/take_exam/response_save', {exam_code: exam_code,
                                                                username:username,
                                                                response_save:response_save}, function( data ) {});
};



function fillResponse(response_save)
{   
    //alert('start');
    //alert(response_save);
    //alert(JSON.stringify(response_save));
    //alert('b');
    response_save.forEach(function(response_save_temp){
        //alert(JSON.stringify(response_save_temp));
        type = response_save_temp.type;
        name = response_save_temp.name;
        val = response_save_temp.val;
        //alert(type);
        //alert(name);
        //alert(val);

        if( type == 'select')
        {    
            $("[name='"+name+"']").get(0).selectedIndex = val;
        }
        else if( type == 'checkbox')
        {

            if(val == 'true')
                $("[id='"+name+"']").attr("checked",val);
                
        }
        else if( type == 'textarea')
            
            $("[name='"+name+"']").val(val);

    });
};