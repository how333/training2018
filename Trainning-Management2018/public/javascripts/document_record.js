      var getchoice = function(document_choice){  
      	console.log(document_choice);
      	var path = "../../files/documents/";
      	path = path + document_choice;
      	console.log(path);
      	var pageNum = "12";
      	PDFObject.embed(path, "#my-pdf", {page: pageNum});
      }