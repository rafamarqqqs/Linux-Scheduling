var execSize;
var blockedSize;
var readySize;
var processes = [];
var quantum = 10;


//FAZER BOTAO DE ESTATISTICAS DO SISTEMA !!!!!!!!!!!!!!!!!!!! (tipo tempo ocioso da cpu e tal)




//objeto para guardar os dados dos processos
var Process = {
	id:-1,
	priority:-1,
	time:-1,
	io: -1,
	state: -1,
};

function process(id, priority, time, io, state){
	Process = {};
	processes[processes.length] = Process;
	processes[processes.length - 1]["id"] = id;
	processes[processes.length - 1]["priority"] = priority;
	processes[processes.length - 1]["time"] = time;
	processes[processes.length - 1]["io"] = io;
	processes[processes.length - 1]["state"] = state;
}

//codigo html que gera a figura do processo (grupo de botoes)
function getHTMLText(block, n){
	return  "<div id=\"" + block + "_" + n + "\" class=\"list-group processBg\">" +
		    "<div class=\"list-group-item  processBg\">" + 
			"<span class=\"label label-primary\">ID: " + processes[n]["id"] + "   </span>" +
			"<span class=\"label label-primary\">Time: " + processes[n]["time"] + "</span>" +
			"<span class=\"label label-info\">Priority: " + processes[n]["priority"] + "   </span>" +
			"<span class=\"label label-danger\">I/O: " + processes[n]["io"] + "   </span></div>";
}

function mainAlgorithm(){
	var expiredHTML = document.getElementById('expired').innerHTML;

	$("#expired").slideUp("slow", function() {
		$(expiredHTML).remove();
	});

	setTimeout(function() {
		$(expiredHTML).appendTo('#ready').hide().slideDown("slow");
	}, 1000);
}

//apaga um bloco de uma regiao
function removeProcess(p){
	$(p).slideUp("fast", function() {
		$(this).remove();
	});
}

function executeProcess(p){
	p["state"] = "exec";
	var aux = getHTMLText("E", p["id"]);
	$(aux).appendTo('#exec').hide().slideDown("fast");
}

function blockProcess(p){
	p["time"] -= quantum;
	p["io"] = "true";
	p["state"] = "blocked";
	var aux = getHTMLText("B", p["id"]);
	$(aux).appendTo('#blocked').hide().slideDown("fast");
}

function makeProcessReady(p){
	p["state"] = "ready";	
	var aux = getHTMLText("R", p["id"]);
	$(aux).appendTo('#ready').hide().slideDown("fast");
}

function checkExecution(){
	var p;

	for (var i = processes.length - 1; i >= 0; i--) {
		if(processes[i]["state"] == "exec"){
			p = processes[i];
		}
	};	

	removeProcess("#E_" + p["id"]);
	blockProcess(p);
}

function checkBlocked(){
	var p;

	for (var i = processes.length - 1; i >= 0; i--) {
		if(processes[i]["state"] == "blocked"){
			p = processes[i];
		}
	};	

	removeProcess("#B_" + p["id"]);
	p["io"] = "false";

	makeProcessReady(p);
}

function checkReady(){
	var p;

	for (var i = 0; i < processes.length; i++) {
		if(processes[i]["state"] == "ready"){
			p = processes[i];
		}
	};	

	removeProcess("#R_" + p["id"]);
	executeProcess(p);	
}

var ONE_FRAME_TIME = 1000;
var i = 0;

var mainloop = function() {
	//document.write(processes[0]["id"] + "\n" + processes[0]["priority"] + "\n" + processes[0]["time"]);
};
setInterval(mainloop, ONE_FRAME_TIME);

//fazer função de verificar se o bloco esta na mesma regiao antes de retirar e por de novo


$(document).ready(function() {
	var p;
	execSize = 1;
	blockedSize = 1;
	readySize = 1;

	process(0, 1, 100, "false", "exec");
	process(1, 2, 200, "true", "blocked");
	process(2, 3, 300, "false", "ready");

	p = getHTMLText("E", 0);
	$(p).appendTo('#exec');
	p = getHTMLText("B", 1);
	$(p).appendTo('#blocked');
	p = getHTMLText("R", 2);
	$(p).appendTo('#ready');

});