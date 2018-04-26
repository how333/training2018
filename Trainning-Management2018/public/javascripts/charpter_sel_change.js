var exam_obj = [];

// DOM Ready =============================================================
$(document).ready(function() {

    full_fill_list();

    $.getJSON('/courses/get_courseid_charpters', {
        courseid: courseid
    },
    function(courseid_all) {

        //alert('courseid_all');
        //alert(courseid_all);
        charpters = courseid_all.charpter;
    });

    $('#mySelect').change(function() {
        full_fill_list();
        var name_old = $("#mySelect").find("option:selected").text();
        var id_old = $("#mySelect").find("option:selected").val();
        var student_content = '';
        if (name_old != '') {
            //alert(name_old);
            //alert(id_old);
            for (i = 0, l = charpters.length; i < l; i++) {
                if (charpters[i].name == name_old) {
                    //alert('modify');
                    //alert(charpters[i].name);
                    student_content += '章节名称:  ';
                    student_content += charpters[i].name.toString();
                    student_content += '<br>';
                    student_content += '章节号:  ';
                    student_content += charpters[i].id.toString();
                    student_content += '<br>';
                    student_content += '文字:  ';
                    student_content += charpters[i].doc.toString();
                    student_content += '<br>';
                    student_content += '视频:  ';
                    student_content += charpters[i].video.toString();
                    student_content += '<br>';
                    student_content += '实操:  ';
                    student_content += charpters[i].scenario.toString();
                    student_content += '<br>';

                    $("#DocList").empty();
                    for (j = 0, k = charpters[i].doc.length; j < k; j++) {
                        var doctemp = charpters[i].doc[j];
                        $("#DocList").append("<option value='" + doctemp + "'>" + doctemp + "</option>");
                    }
                    $("#VideoList").empty();
                    for (m = 0, n = charpters[i].video.length; m < n; m++) {
                        var videotemp = charpters[i].video[m];
                        $("#VideoList").append("<option value='" + videotemp + "'>" + videotemp + "</option>");
                    }
                    $("#ScenarioList").empty();
                    for (m = 0, n = charpters[i].scenario.length; m < n; m++) {
                        var scenariotemp = charpters[i].scenario[m];
                        $("#ScenarioList").append("<option value='" + scenariotemp + "'>" + scenariotemp + "</option>");
                    }
                }

            }

            //alert(student_content);
            $("p").html(student_content);

        }

    });

    $("#docdelete").click(function() {
        //alert('docdelete');
        var name_old = $("#DocList").find("option:selected").text();
        // var name_charpter = $("#mySelect").find("option:selected").text();
        if (name_old != '') {
            //alert(name_old);
            $("#DocList").find("option:selected").remove();
            $("#DocListStore").append("<option value='" + name_old + "'>" + name_old + "</option>");
        }
    });

    $("#docadd").click(function() {
        //alert('docadd');
        var name_old = $("#DocListStore").find("option:selected").text();
        // var name_charpter = $("#mySelect").find("option:selected").text();
        //alert(name_old);
        $("#DocListStore").find("option:selected").remove();
        $("#DocList").append("<option value='" + name_old + "'>" + name_old + "</option>");

    });

    $("#videodelete").click(function() {
        //alert('videodelete');
        var name_old = $("#VideoList").find("option:selected").text();
        if (name_old != '') {
            //alert(name_old);
            $("#VideoList").find("option:selected").remove();
            $("#VideoListStore").append("<option value='" + name_old + "'>" + name_old + "</option>");
        }
    });

    $("#videoadd").click(function() {
        //alert('videoadd');
        var name_old = $("#VideoListStore").find("option:selected").text();
        if (name_old != '') {
            //alert(name_old);
            $("#VideoListStore").find("option:selected").remove();
            $("#VideoList").append("<option value='" + name_old + "'>" + name_old + "</option>");
        }
    });


    $("#scenariodelete").click(function() {
        //alert('videodelete');
        var name_old = $("#ScenarioList").find("option:selected").text();
        if (name_old != '') {
            //alert(name_old);
            $("#ScenarioList").find("option:selected").remove();
            $("#ScenarioListStore").append("<option value='" + name_old + "'>" + name_old + "</option>");
        }
    });

    $("#scenarioadd").click(function() {
        //alert('videoadd');
        var name_old = $("#ScenarioListStore").find("option:selected").text();
        if (name_old != '') {
            //alert(name_old);
            $("#ScenarioListStore").find("option:selected").remove();
            $("#ScenarioList").append("<option value='" + name_old + "'>" + name_old + "</option>");
        }
    });

});

function full_fill_list() {
    $("#DocList").empty();
    $("#VideoList").empty();
    $("#ScenarioList").empty();
    $.getJSON('/learn/get_doc_store', {},
    function(docs_all) {
        // alert('docs_all');
        //alert('courseid_all');
        //alert(courseid_all);
        //alert('docs_all');
        $("#DocListStore").empty();
        var doctemp = '';
        for (i = 0, l = docs_all.length; i < l; i++) {
            doctemp = docs_all[i];
            $("#DocListStore").append("<option value='" + doctemp + "'>" + doctemp + "</option>");
        }
    });

    $.getJSON('/learn/get_video_store', {},
    function(videos_all) {
        //alert('videos_all');
        //alert('courseid_all');
        //alert(courseid_all);
        //alert('docs_all');
        $("#VideoListStore").empty();
        var doctemp = '';
        for (i = 0, l = videos_all.length; i < l; i++) {
            doctemp = videos_all[i];
            $("#VideoListStore").append("<option value='" + doctemp + "'>" + doctemp + "</option>");
        }
    });

    $.getJSON('/learn/get_scenario_store', {},
    function(scenarios_all) {
        //alert('videos_all');
        //alert('courseid_all');
        //alert(courseid_all);
        //alert('docs_all');
        $("#ScenarioListStore").empty();
        var doctemp = '';
        for (i = 0, l = scenarios_all.length; i < l; i++) {
            doctemp = scenarios_all[i];
            $("#ScenarioListStore").append("<option value='" + doctemp + "'>" + doctemp + "</option>");
        }
    });

};