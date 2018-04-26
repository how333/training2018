var exam_obj = [];

// DOM Ready =============================================================
$(document).ready(function() {

    //alert('efg');
    $.getJSON('/courses/get_courses', {},
    function(courses_all) {
        //alert(courses_all);
        $("#myCouerse").append("<option value=''></option>");
        courses_all.forEach(function(course_data) {
            //alert(response_data.name);
            var content = "<option value='";
            content += course_data.coursename;
            content += "'>";
            content += course_data.coursename;
            content += "</option>";
            //alert(content);
            $("#myCouerse").append(content);
        });
    });

    $('#myCouerse').change(function() {
        var courseid = $("#myCouerse").find("option:selected").text();

        //alert(courseid);
        if (courseid == '') {
            $("#myCharpter").empty();
            $("#myCharpter").append("<option value=''></option>");
            $("#Couerse_sel").val("");

        } else {
        	$("#Couerse_sel").val(courseid);
        	$("#Charpter_sel").val("");
            $.getJSON('/courses/get_courseid_charpters', {
                courseid: courseid
            },
            function(courseid_all) {

                //alert('courseid_all');
                //alert(courseid_all);
                charpters = courseid_all.charpter;

                //alert('begin');
                //$("#myCharpter").append("<option value=''></option>");
                $("#myCharpter").empty();
                $("#myCharpter").append("<option value=''></option>");
                charpters.forEach(function(response_data) {
                    //alert(response_data.name);
                    var content = "<option value='";
                    content += response_data.id;
                    content += "'>";
                    content += response_data.name;
                    content += "</option>";
                    //alert(content);
                    $("#myCharpter").append(content);
                });
            })
        }

    });


   $('#myCharpter').change(function() {
        var charpterid = $("#myCharpter").find("option:selected").text();

        //alert(courseid);
        if (charpterid == '') {
            $("#Charpter_sel").val("");
        } else {
        	$("#Charpter_sel").val(charpterid);
        }

    });

});