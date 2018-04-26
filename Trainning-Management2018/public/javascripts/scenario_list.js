var exam_obj = [];

// DOM Ready =============================================================
$(document).ready(function() {

    //alert('efg');
    // Empty content string
    $("#ScenarioListStore").empty();
    $.getJSON('/make_exam/getscenarios', {},
    function(docs_all) {
        // alert('docs_all');
        //alert('courseid_all');
        //alert(courseid_all);
        //alert('docs_all');
        $("#ScenarioListStore").empty();
        var doctemp = '';
        for (i = 0, l = docs_all.length; i < l; i++) {
            doctemp = docs_all[i];
            $("#ScenarioListStore").append("<option value='" + doctemp + "'>" + doctemp + "</option>");
        }
        $("#ScenarioListStore ").get(0).selectedIndex=0;
    });

});