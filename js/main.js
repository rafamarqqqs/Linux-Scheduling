var execSize;
var blockedSize;
var readySize;
var processes = [];

//objeto para guardar os dados dos processos
var Process = {
	id:-1,
	priority:-1,
	time:-1,
	io: -1,
};

function process(id, priority, time, io){
	Process = {};
	processes[processes.length] = Process;
	processes[processes.length - 1]["id"] = id;
	processes[processes.length - 1]["priority"] = priority;
	processes[processes.length - 1]["time"] = time;
	processes[processes.length - 1]["io"] = io;
}

//codigo html que gera a figura do processo (grupo de botoes)
function getHTMLText(block, n){
	return  "<div id=\"" + block + "_" + n + "\" class=\"list-group processBg\">" +
		    "<div class=\"list-group-item  processBg\">" + 
			"<span class=\"label label-primary\">ID: " + processes[n]["id"] + "   </span>" +
			"<span class=\"label label-primary\">Time: " + processes[n]["time"] + "</span></div>" +
		    "<div class=\"list-group-item  processBg\">" +
			"<span class=\"label label-info\">Priority: " + processes[n]["priority"] + "   </span>" +
			"<span class=\"label label-danger\">I/O: " + processes[n]["io"] + "   </span></div></div>";
}

//apaga um bloco de uma regiao
function eraseBlock(btn){
	var block = btn.attr('id');//pega a id do botao que foi clicado
	var name = block.split(",");//baseado na id do botao clicado, acha a id do grupo de botoes
		
	$("#" + name[0]).slideUp("fast", function() {
		$(this).remove();
	});

	decrementBlock(block);

	return block;
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

	process(0, 1, 100, "false");
	process(1, 2, 200, "true");
	process(2, 3, 300, "false");

	p = getHTMLText("E", 0);
	$(p).appendTo('#exec');
	p = getHTMLText("B", 1);
	$(p).appendTo('#blocked');
	p = getHTMLText("R", 2);
	$(p).appendTo('#ready');

});

var ONE_FRAME_TIME = 1000/60;
var i = 0;

var mainloop = function() {
	//document.write(processes[0]["id"] + "\n" + processes[0]["priority"] + "\n" + processes[0]["time"]);
};
setInterval(mainloop, ONE_FRAME_TIME);

//fazer função de verificar se o bloco esta na mesma regiao antes de retirar e por de novo

$(function() {
	$(document).on('click', '.blockBtn', function() {
		var block = eraseBlock($(this));

		blockedSize++;

		var p = getHTMLText("B", blockedSize);

		$(p).appendTo('#blocked').hide().slideDown("fast");
	});
});

$(function() {
	$(document).on('click', '.execBtn', function() {
		var block = eraseBlock($(this));

		execSize++;
		
		var p = getHTMLText("E", execSize);

		$(p).appendTo('#exec').hide().slideDown("fast");
	});
});

$(function() {
	$(document).on('click', '.readyBtn', function() {
		var block = eraseBlock($(this));

		readySize++;

		var p = getHTMLText("R", readySize);

		$(p).appendTo('#ready').hide().slideDown("fast");

	});
});