var execSize;
var blockedSize;
var readySize;

var Process = {
	id:-1
};

function getHTMLText(block, n){
	return "<div id=\"process" + block + "_" + n + "\" class=\"btn-group\" role=\"group\" aria-label=\"...\"> " + 
		   "<button id=\"process" + block + "_" + n + ",1\" type=\"button\" class=\"btn btn-default blockBtn\">Block</button>" + 
		   	"<button id=\"process" + block + "_" + n + ",2\" type=\"button\" class=\"btn btn-default execBtn\">Execute</button> " + 
		   	"<button id=\"process" + block + "_" + n + ",3\" type=\"button\" class=\"btn btn-default readyBtn\">Ready</button>" + 
		   	"</div><br><br>";
}

function decrementBlock(id){
	aux = id.split("_");

	if(aux[0] === "processB")
		blockedSize--;
	else if(aux[0] === "processE")
		execSize--;
	else if(aux[0] === "processR")
		readySize--;
}

$(document).ready(function() {
	var p;
	execSize = 1;
	blockedSize = 1;
	readySize = 1;

	p = getHTMLText("E", 0);
	$(p).appendTo('#exec');
	p = getHTMLText("B", 0);
	$(p).appendTo('#blocked');
	p = getHTMLText("R", 0);
	$(p).appendTo('#ready');
});

$(function() {
	$('.blockBtn').on('click', function() {
		var block = $(this).attr('id');
		var name = block.split(",");

		console.log(name[0]);
		
		$("#" + name[0]).slideUp(200);

		blockedSize++;
		decrementBlock(block[0]);
		var p = getHTMLText("B", blockedSize);
		$(p).appendTo('#blocked');
	});
});

$(function() {
	$('.execBtn').on('click', function() {
		var block = $(this).attr('id');
		var name = block.split(",");
		
		console.log(name[0]);

		$("#" + name[0]).slideUp(200);

		execSize++;
		decrementBlock(block[0]);
		var p = getHTMLText("E", execSize);
		$(p).appendTo('#exec');
	});
});

$(function() {
	$('.readyBtn').on('click', function() {
		var block = $(this).attr('id');
		var name = block.split(",");
		
		console.log(name[0]);
		
		$("#" + name[0]).slideUp(200);

		readySize++;
		decrementBlock(block[0]);
		var p = getHTMLText("R", readySize);
		$(p).appendTo('#ready');
	});
});