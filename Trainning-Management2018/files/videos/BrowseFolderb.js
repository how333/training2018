//�򿪵��� 
function f_OpenDialog() { 
var sHTML = '<p><input id="txtFile" type="file" /></p>'; 
new NeatDialog(sHTML, "��ѡ��Excel�ĵ�!"); 
} 
//�رղ��Ƴ����� 
NeatDialog.prototype.close = function () { 
if (this.elt) { 
this.elt.style.display = "none"; 
this.elt.parentNode.removeChild(this.elt); 
} 
window.neatDialog = null; 
} 
//�������� 
function NeatDialog(sHTML, sTitle) { 
window.neatDialog = null; 
this.elt = null; 
if (document.createElement && document.getElementById) { 
var dg = document.createElement("div"); 
dg.className = "neat-dialog"; 
dg.innerHTML = sHTML; 
var dbg = document.createElement("div"); 
dbg.id = "nd-bdg"; 
dbg.className = "neat-dialog-bg"; 
var dgc = document.createElement("div"); 
dgc.className = "neat-dialog-cont"; 
dgc.appendChild(dbg); 
dgc.appendChild(dg); 
if (document.body.offsetLeft > 0) { 
dgc.style.marginLeft = document.body.offsetLeft + "px"; 
} 
document.body.appendChild(dgc); 
this.elt = dgc; 
window.neatDialog = this; 
} 
} 