var exam_obj = [];

// DOM Ready =============================================================
$(document).ready(function() {
	
      $('#the-node').contextMenu({
      selector: 'li',
      callback: function(key, options) {
      var m = "clicked: " + key + " on " + $(this).text();
      var oldname = $(this).text();
      //alert(key);
      //window.console && console.log(m) || alert(m);
      if(key == 'delete')
      {
      window.console && console.log(m) || alert(m);
      delete_document(oldname);
      alert('文件删除成功');
      window.location.reload(); 
      }
      else if(key == 'edit')
      {
      //window.console && console.log(m) || alert(m);
       var newname=prompt("请输入一个新文件名");
       //alert('renamedocument');
       if( (newname.indexOf('.pdf')<0) && (newname.indexOf('.PDF')<0) )
       {
          newname = newname + '.pdf';
       }
       renamedocument(oldname,newname);
       alert('文件名修改成功');
       window.location.reload(); 
      }
      
      },
      items: {
      "edit": {
      name: "Edit"
      },
      "delete": {
      name: "Delete"
      },
      "quit": {
      name: "Quit",
   
      }
      }
      });





    $("#search").click(function() {
      //alert('search');
      var search_name = $("#searchname").val(); 
      //alert(search_name);
      var is_search = 0;
      $("[name = checkbox]:checkbox").prop("checked", false);
        $("input[type=checkbox]").each(function()
            {
              if (search_name == $(this).val())
              {
                is_search = 1;
                $(this).prop("checked", true);
              }             
            }); 
        if(is_search == 0)
        {
          alert('your search file is not exit');
        }

    });

});


function renamedocument(oldname,newname) {
    //alert('come in');
    //alert(oldname);
    //alert(newname);
    $.getJSON( '/data_manage/renamedocument', {oldname: oldname,newname:newname}, function( data ) {

        alert(data);

    })

}

function delete_document(filepath) {
    //alert('come in');
    //alert(filepath);

    $.getJSON( '/data_manage/delete_document', {filepath: filepath}, function( data ) {

        alert(data);

    })

}