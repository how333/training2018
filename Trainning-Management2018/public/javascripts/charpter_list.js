var exam_obj = [];

// DOM Ready =============================================================
$(document).ready(function() {

    //alert('efg');
    // Empty content string
    $.getJSON('/courses/get_courseid_charpters', {
        courseid: courseid
    },
    function(courseid_all) {

        //alert('courseid_all');
        //alert(courseid_all);
        charpters = courseid_all.charpter;

        //alert('begin');
        $("#mySelect").append("<option value=''></option>");
        charpters.forEach(function(response_data) {
            //alert(response_data.name);
            var content = "<option value='";
            content += response_data.id;
            content += "'>";
            content += response_data.name;
            content += "</option>";
            //alert(content);
            $("#mySelect").append(content);
        });
    })

    // $("#mySelect").append("<option value='新增'>新增option</option>");

    //$('#questionList table tbody').html(tableContent); 

});