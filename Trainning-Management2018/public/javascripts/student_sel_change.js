var exam_obj = [];

// DOM Ready =============================================================
$(document).ready(function() {

    //alert('efg');
   // Empty content string
  $("#mySelect").change(function(){
	var checkText=$("#mySelect").find("option:selected").text();
	
	if(checkText !='')
	{
	//alert(checkText);
	$.getJSON( '/students/get_student_info', {username: checkText}, function( student_info ) {

		var student_content = '';
		student_content+='工号: ';
		student_content+=student_info.rollno.toString();
		student_content+='<br>';
		student_content+='用户名: ';
		student_content+=student_info.username.toString();
		student_content+='<br>';
		student_content+='身份证号: ';
		student_content+=student_info.IDnumber.toString();
		student_content+='<br>';
		student_content+='性别: ';
		student_content+=student_info.sexuality.toString();
		student_content+='<br>';
		student_content+='出生日期: ';
		student_content+=student_info.birth.toString();
		student_content+='<br>';
		student_content+='工作单位: ';
		student_content+=student_info.workunit.toString();
		student_content+='<br>';
		student_content+='职业: ';
		student_content+=student_info.carrier.toString();
		student_content+='<br>';
		student_content+='联系方式: ';
		student_content+=student_info.contact.toString();
		student_content+='<br>';

		$("p").html(student_content);


	})
	}
	else
	{
		$("p").html('please select a student');
	}
  });


});


