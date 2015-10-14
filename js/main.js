var processes = [];
var processingTime = 10;
var ioProcessingTime = 10;
var executingProcess = null;

//objeto para guardar os dados dos processos
var Process = {
	id:-1,
	priority:-1,
	time:-1,
	io: -1,
	ioTime: -1,
	ioRemaining: -1,
	quantum: -1,
	quantumUsed: -1,
	state: -1,
};

function process(id, priority, time, io, state, quantum, ioTime){
	Process = {};
	processes[processes.length] = Process;
	processes[processes.length - 1]["id"] = id;
	processes[processes.length - 1]["priority"] = priority;
	processes[processes.length - 1]["time"] = time;
	processes[processes.length - 1]["quantum"] = quantum;
	processes[processes.length - 1]["quantumUsed"] = 0;
	processes[processes.length - 1]["io"] = io;
	processes[processes.length - 1]["ioTime"] = ioTime;
	processes[processes.length - 1]["ioRemaining"] = ioTime;
	processes[processes.length - 1]["state"] = state;
}

//codigo html que gera a figura do processo (grupo de botoes)
function getHTMLText(block, n){
	return "<div id=\"" + block + "_" + n + "\" class=\"list-group processBg\">" +
		   "<div class=\"list-group-item  processBg\">" + 
		"<span class=\"label label-primary\">ID: " + processes[n]["id"] + "   </span>" +
		"<span id=\"time_" + n + "\"class=\"label label-primary\">Time: "+processes[n]["quantum"]+" / "+processes[n]["time"] + "</span>" +
		"<span class=\"label label-info\">Priority: " + processes[n]["priority"] + "   </span>" +
		"<span id=\"io_" + n + "\"class=\"label label-danger\">I/O: " +
		(processes[n]["io"] == "false" ? "false" : processes[n]["ioRemaining"]) + 
		"</span></div>";
}

function mainAlgorithm(){
	var expiredHTML = document.getElementById('expired').innerHTML;
	var expired = document.getElementById('expired');

	$(expired).slideUp("slow", function() {
		$(expired).remove();
	});

	$(expiredHTML).appendTo("#ready").hide().slideDown("slow");

	for(var i = 0; i < processes.length; i++){
		if(processes[i]["state"] == "expired"){
			processes[i]["state"] = "ready";
			document.getElementById('Ex_' + processes[i]["id"]).setAttribute('id', "R_" + processes[i]["id"]);
		}
	}
}

//apaga um bloco de uma regiao
function removeProcess(p){
	$(p).slideUp("fast", function() {
		$(this).remove();
	});
}

function executeProcess(p){
	executingProcess = p;
	p["state"] = "exec";
	var aux = getHTMLText("E", p["id"]);
	$(aux).appendTo('#exec').hide().slideDown("fast");
}

function blockProcess(p){
	p["io"] = "true";
	p["state"] = "justBlocked";
	var aux = getHTMLText("B", p["id"]);
	$(aux).appendTo('#blocked').hide().slideDown("fast");
}

function makeProcessReady(p){
	p["state"] = "ready";	
	var aux = getHTMLText("R", p["id"]);
	$(aux).appendTo('#ready').hide().slideDown("fast");
}

function expireProcess(p){
	p["state"] = "expired";	
	var aux = getHTMLText("Ex", p["id"]);
	$(aux).appendTo('#expired').hide().slideDown("fast");
}

function checkExecution(){
	if(executingProcess == null)
		return;

	var p = executingProcess;

	p["quantumUsed"] += 10;
	p["time"] -= processingTime;

	document.getElementById('time_' + p["id"]).innerHTML = "Time: "+p["quantum"]+" / "+p["time"];

	var chance = Math.floor((Math.random() * 100) + 1);

	if(chance < 50)
		p["io"] = "true";
	
	if(p["time"] == 0){
		removeProcess("#E_" + p["id"]);
		p["status"] = "done";
		executingProcess = null;
	}
	else if(p["io"] == "true"){
		removeProcess("#E_" + p["id"]);
		blockProcess(p);
		executingProcess = null;
	}
	else if(p["quantum"] == p["quantumUsed"]){
		removeProcess("#E_" + p["id"]);
		expireProcess(p);
		p["quantumUsed"] = 0;
		executingProcess = null;
	}

}

function checkBlocked(){
	var p;

	for (var i = processes.length - 1; i >= 0; i--){
		if(processes[i]["time"] > 0){
			if(processes[i]["state"] == "justBlocked")
				processes[i]["state"] = "blocked";
			else if(processes[i]["state"] == "blocked"){
				p = processes[i];

				p["ioRemaining"] -= ioProcessingTime;
				document.getElementById('io_' + p["id"]).innerHTML = "I/O: " +
														(p["io"] == "false" ? "false" : p["ioRemaining"]);

				if(p["ioRemaining"] == 0){
					p["ioRemaining"] = p["ioTime"]
					removeProcess("#B_" + p["id"]);
					p["io"] = "false";

					if(p["time"] == 0){
						p["status"] = "done";
						removeProcess(p);
					}
					else if(p["quantum"] == p["quantumUsed"]){
						expireProcess(p);
						p["quantumUsed"] = 0;
					}
					else 
						makeProcessReady(p);
				}
			}
		}
	}
}

function checkReady(){
	var p;

	if(executingProcess == null){
		for (var i = 0; i < processes.length; i++) {
			if(processes[i]["time"] > 0 && processes[i]["state"] == "ready"){
				p = processes[i];
				break;
			}
		}

		if(i != processes.length){
			removeProcess("#R_" + p["id"]);
			executeProcess(p);	
		}
		else 
			checkEnd();
	}
}

function checkEnd(){
	for (var i = processes.length - 1; i >= 0; i--) {
		if(processes[i]["status"] == "expired"){
			mainAlgorithm();
			return;
		}
	};

	clearInterval(interval);
	document.write("done");
}

var mainLoop = function(){
	setTimeout(checkExecution, 1000);
	setTimeout(checkBlocked, 2000);
	setTimeout(checkReady, 3000);
};
var interval = setInterval(mainLoop, 8000);

$(document).ready(function() {
	var p;
	execSize = 1;
	blockedSize = 1;
	readySize = 1;

	process(0, 1, 10, "false", "ready", 20, 20);
	process(1, 2, 20, "false", "ready", 20, 20);
	process(2, 3, 30, "false", "ready", 20, 20);
	process(3, 3, 40, "false", "ready", 20, 20);

	p = getHTMLText("R", 0);
	$(p).appendTo('#ready');
	p = getHTMLText("R", 1);
	$(p).appendTo('#ready');
	p = getHTMLText("R", 2);
	$(p).appendTo('#ready');
	p = getHTMLText("R", 3);
	$(p).appendTo('#ready');

});