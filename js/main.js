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
	status: -1,
};

function process(id, priority, time, io, status, quantum, ioTime){
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
	processes[processes.length - 1]["status"] = status;
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
		if(processes[i]["status"] == "expired"){
			processes[i]["status"] = "ready";
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
	p["status"] = "exec";
	var aux = getHTMLText("E", p["id"]);
	$(aux).appendTo('#exec').hide().slideDown("fast");
}

function blockProcess(p){
	p["io"] = "true";
	p["status"] = "justBlocked";
	var aux = getHTMLText("B", p["id"]);
	$(aux).appendTo('#blocked').hide().slideDown("fast");
}

function makeProcessReady(p){
	p["status"] = "ready";	
	var aux = getHTMLText("R", p["id"]);
	$(aux).appendTo('#ready').hide().slideDown("fast");
}

function expireProcess(p){
	p["status"] = "expired";	
	var aux = getHTMLText("Ex", p["id"]);
	$(aux).appendTo('#expired').hide().slideDown("fast");
}

function checkExecution(){
	if(executingProcess == null)
		return;

	executingProcess["quantumUsed"] += 10;
	executingProcess["time"] -= processingTime;

	document.getElementById('time_' + executingProcess["id"]).innerHTML = "Time: "+executingProcess["quantum"]+" / "+executingProcess["time"];

	var chance = Math.floor((Math.random() * 100) + 1);

	if(chance < 50)
		executingProcess["io"] = "true";
	
	if(executingProcess["time"] == 0){
		console.log("executing process is done");
		executingProcess["status"] = "done";
		removeProcess("#E_" + executingProcess["id"]);
		executingProcess = null;
	}
	else if(executingProcess["io"] == "true"){
		console.log("executing process is blocked");
		removeProcess("#E_" + executingProcess["id"]);
		blockProcess(executingProcess);
		executingProcess = null;
	}
	else if(executingProcess["quantum"] == executingProcess["quantumUsed"]){
		console.log("executing process is expired");
		removeProcess("#E_" + executingProcess["id"]);
		expireProcess(executingProcess);
		executingProcess["quantumUsed"] = 0;
		executingProcess = null;
	}

}

function checkBlocked(){
	for (var i = processes.length - 1; i >= 0; i--){
		if(processes[i]["status"] == "justBlocked")
			processes[i]["status"] = "blocked";
		else if(processes[i]["status"] == "blocked"){
			processes[i]["ioRemaining"] -= ioProcessingTime;

			document.getElementById('io_' + processes[i]["id"]).innerHTML = "I/O: " +
													(processes[i]["io"] == "false" ? "false" : processes[i]["ioRemaining"]);

			if(processes[i]["ioRemaining"] == 0){
				processes[i]["ioRemaining"] = processes[i]["ioTime"];
				removeProcess("#B_" + processes[i]["id"]);
				processes[i]["io"] = "false";

				if(processes[i]["time"] == 0){
					console.log("blocked process is done");
					processes[i]["status"] = "done";
				}
				else if(processes[i]["quantum"] == processes[i]["quantumUsed"]){
					console.log("blocked process is expired");
					expireProcess(processes[i]);
					processes[i]["quantumUsed"] = 0;
				}
				else 
					makeProcessReady(processes[i]);
			}
		}
	}
}

function checkReady(){
	var expired = 1;
	var complete = 0;

	if(executingProcess == null){
		for (var i = 0; i < processes.length; i++) {
			if(processes[i]["status"] == "ready")
				break;

			if(processes[i]["status"] != "expired" && processes[i]["status"] != "done")
				expired = 0;
			else if(processes[i]["status"] == "done")
				complete++;
		};

		if(i != processes.length){
			removeProcess("#R_" + processes[i]["id"]);
			executeProcess(processes[i]);	
		}
		else if(expired == 1 && complete != processes.length)
			mainAlgorithm();
	}
}

//precisa refazer
function checkEnd(){
	for (var i = processes.length - 1; i >= 0; i--) {
		if(processes[i]["status"] != "done")
			return;
	};

	clearInterval(interval);
	console.log("done");
}

var mainLoop = function(){
	setTimeout(checkExecution, 500);
	setTimeout(checkBlocked, 1000);
	setTimeout(checkReady, 1500);
	setTimeout(checkEnd, 2000);
};
var interval = setInterval(mainLoop, 7000);

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