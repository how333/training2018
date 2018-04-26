var exam_obj = [];

// DOM Ready =============================================================
$(document).ready(function() {

    //alert('learn_list');
    // Empty content string
    $.getJSON('/courses/get_student_courses', {},
    function(student_courses) {

    $.getJSON('/courses/get_courses_by_student', {},
    function(course_all) {
        $("#Select_Course").append("<option value=''></option>");
        course_all.forEach(function(course_data) {
            //alert(course_data.courseid);
            if (student_courses.indexOf (course_data.courseid) >=0) {
                var content = "<option value='";
                content += course_data.courseid;
                content += "'>";
                content += course_data.coursename;
                content += "</option>";
                //alert(content);
                $("#Select_Course").append(content);
            }

        });

        var course_first = course_all[0].coursename;
        $.getJSON('/courses/get_courseid_charpters_by_student', {
            courseid: course_first
        },
        function(courseid_all) {

            //alert('courseid_all');
            //alert(courseid_all);
            charpters = courseid_all.charpter;

            //if (charpters.length == 0)
            $("#Select_Charpter").append("<option value=''></option>");
            charpters.forEach(function(response_data) {
                //alert(response_data.name);
                var content = "<option value='";
                content += response_data.id;
                content += "'>";
                content += response_data.name;
                content += "</option>";
                //alert(content);
                $("#Select_Charpter").append(content);
            });
        })

    });

    });


  $("#Select_Course").change(function(){
    var courseid=$("#Select_Course").find("option:selected").val();

    
    if(courseid !='')
    {
        //alert(courseid);
        $.getJSON('/courses/get_courseid_charpters_by_student', {
            courseid: courseid
        },
        function(courseid_all) {

            //alert('courseid_all');
            //alert(courseid_all);
            charpters = courseid_all.charpter;
            $("#Select_Charpter").empty();
            //alert('begin');
            $("#Select_Charpter").append("<option value=''></option>");
            charpters.forEach(function(response_data) {
                //alert(response_data.name);
                var content = "<option value='";
                content += response_data.name;
                content += "'>";
                content += response_data.name;
                content += "</option>";
                //alert(content);
                $("#Select_Charpter").append(content);
            });
        })
    }
    else
    {
        $("#Select_Charpter").empty();
    }
    });

});