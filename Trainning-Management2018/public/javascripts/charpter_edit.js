// DOM Ready =============================================================
$(document).ready(function() {

    //alert('getdata dblclick');
    $.getJSON('/courses/get_courseid_charpters', {
        courseid: courseid
    },
    function(courseid_all) {

        //alert('courseid_all');
        // alert(courseid_all);
        charpters = courseid_all.charpter;
    });

    $('#mySelect').dblclick(function() {

        //alert('dblclick');
        var name_old = $("#mySelect").find("option:selected").text();
        var id_old = $("#mySelect").find("option:selected").val();
        if (name_old != '') {
            //alert(name_old);
            //alert(id_old);
            var newname = prompt("输入一个新的章节名称");
            //alert('newname');
            //alert(newname);
            //alert(newname.length);
            if ((newname.length > 0) && (newname != null)) {
                for (i = 0, l = charpters.length; i < l; i++) {
                    if (charpters[i].name == name_old) {
                        //alert('modify');
                        charpters[i].name = newname;
                    }
                }
                $.getJSON('/courses/update_courseid_charpters', {
                    courseid: courseid,
                    charpters: charpters
                },
                function(courseid_all) {
                    alert('操作完成');
                });
                window.location.reload();

            }
        }

    });

    $("#delete").click(function() {

        //alert('delete');
        var name_old = $("#mySelect").find("option:selected").text();
        var id_old = $("#mySelect").find("option:selected").val();

        var del_num = 0;
        if (name_old != '') {
            //alert(name_old);
            //alert(charpters.length);
            for (i = 0, l = charpters.length; i < l + 1; i++) {

                if (charpters[i].name == name_old) {
                    if ((charpters[i].doc == '') && (charpters[i].video == '')) charpters.splice(i, 1);
                    else alert('章节有内容，不能删除');

                    break;
                }
            }
        }

        $.getJSON('/courses/update_courseid_charpters', {
            courseid: courseid,
            charpters: charpters
        },
        function(courseid_all) {
            alert('操作完成');
        });
        window.location.reload();

    });

    $("#add").click(function() {

        //alert('add');
        //alert(charpters);
        var newname = prompt("输入一个新的章节名称");
        if ((newname.length > 0) && (newname != null)) {
            var newid = prompt("输入一个新的章节号");
            if ((newid.length > 0) && (newid != null)) {

                var newcharpter = {
                    name: newname,
                    id: newid,
                    doc: null,
                    video: null
                };
                //alert('newcharpter');
                //alert(newcharpter);
                //alert(charpters);
                charpters.push(newcharpter);
                //alert('add charpters');
                //alert(charpters);
                //alert('db function start');
                $.getJSON('/courses/update_courseid_charpters', {
                    courseid: courseid,
                    charpters: charpters
                },
                function(courseid_all) {
                    alert('操作完成');
                });
                window.location.reload();

            }

        }
    });

    $("#charptersave").click(function() {

        //alert('charptersave');
        var charpter_sel = $("#mySelect").find("option:selected").text();

        var array_doc = new Array(); //定义数组
        $("#DocList option").each(function() { //遍历全部option
            var txt = $(this).text(); //获取option的内容
            if (txt != "全部") //如果不是“全部”
            array_doc.push(txt); //添加到数组中
        });

        var array_video = new Array(); //定义数组
        $("#VideoList option").each(function() { //遍历全部option
            var txt = $(this).text(); //获取option的内容
            if (txt != "全部") //如果不是“全部”
            array_video.push(txt); //添加到数组中
        });

        var array_scenario= new Array(); //定义数组
        $("#ScenarioList option").each(function() { //遍历全部option
            var txt = $(this).text(); //获取option的内容
            if (txt != "全部") //如果不是“全部”
            array_scenario.push(txt); //添加到数组中
        });

        if (array_doc.length == '0') {
            array_doc = null;
        }
        if (array_video.length == '0') {
            array_video = null;
        }
        if (array_scenario.length == '0') {
            array_scenario = null;
        }

        if (charpter_sel != '') {
            var doc_to_save = [];

            for (i = 0, l = charpters.length; i < l; i++) {
                if (charpters[i].name == charpter_sel) {
                    //alert('modify');
                    charpters[i].doc = array_doc;
                    charpters[i].video = array_video;
                    charpters[i].scenario = array_scenario;
                    break;
                }
            }
        }
        $.getJSON('/courses/update_courseid_charpters', {
            courseid: courseid,
            charpters: charpters
        },
        function(courseid_all) {
            alert('操作完成');
        });
        window.location.reload();

    });

});