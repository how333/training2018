function checkbox() {
    var str = document.getElementsByName("checkbox");
    var objarray = str.length;

    var chestr = "";
    for (i = 0; i < objarray; i++) {
        if (str[i].checked == true) {
            chestr += str[i].value + ",";
            delete_document_batch(str[i].value);
        }
    }
    if (chestr == "") {
        alert("请先选择复选框～！");
    } else {
        alert("复选框的值是：" + chestr);
    }
}

function delete_document_batch(filepath) {

    alert(filepath);
    $.getJSON('/data_manage/delete_document_batch', {
        filepath: filepath
    },
    function(data) {

        alert(data);

    });

}