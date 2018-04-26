var exam_obj = [];

// DOM Ready =============================================================
$(document).ready(function() {

    //alert('efg');
   // Empty content string
    $.getJSON( '/students/getstudents', function( students_all ) {

         //alert('students_all');
         //alert(students_all);
         $("#mySelect").append("<option value=''></option>");
         students_all.forEach(function(response_data){
            //alert(response_data);
            //alert(response_data.username);
            var content = "<option value='";
            content+=response_data.username;
            content+="'>";
            content+=response_data.username;
            content+="</option>";
            //alert(content);
            $("#mySelect").append(content);
         });
    })

       // $("#mySelect").append("<option value='新增'>新增option</option>");



        //$('#questionList table tbody').html(tableContent); 


});


