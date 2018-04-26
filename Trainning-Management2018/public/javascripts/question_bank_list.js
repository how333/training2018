var exam_obj = [];

//DOM Ready =========================================
$(document).ready(function() {

  $.getJSON('/faculties/get_question_banks', {}, function(banks) {
    // alert(banks);
    $("#bank_select").append("<option value=''></option>");
    banks.forEach(function(bank) {
      // alert(bank.bankname);
      // if(banks.indexOf(bank.banknumber) >=0) {
        var content = "<option value='";
        content += bank.bankname;
        content += "'>";
        content += bank.bankname;
        content += "</option>";
        //alert(content);
        $("#bank_select").append(content);
      // }
    });
  });

});