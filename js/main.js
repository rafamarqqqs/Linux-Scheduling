var processes = [];
var processingTime = 10;
var ioProcessingTime = 10;
var executingProcess = null;
var steps = -1;




//PRECISA FAZER MOSTRAR AS COISAS DANDO UPDATE EM REAL TIME 





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

function setInfo(info){
	document.getElementById('info').innerHTML = "<div class=\"alert alert-info\" role=\"alert\">" + info + "</div>";
}

//codigo html que gera a figura do processo (grupo de botoes)
function getHTMLText(block, n){
	return "<div id=\"" + block + "_" + n + "\" class=\"list-group processBg\">" +
		   "<div class=\"list-group-item  processBg\">" + 
		"<span class=\"label label-primary\">ID: " + processes[n]["id"] + "   </span>" +
		"<span id=\"time_" + n + "\"class=\"label label-primary\">Time: "+processes[n]["quantum"]+" / "+processes[n]["time"] + "</span>" +
		"<span class=\"label label-info\">Priority: " + processes[n]["priority"] + "   </span>" +
		"<span id=\"io_" + n + "\"class=\"label label-danger\">I/O: " +
		(processes[n]["io"] == 0 ? 0 : processes[n]["ioRemaining"]) + 
		"</span></div>";
}

function mainAlgorithm(){
	setInfo("Swapping vectors...");

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
	
	setInfo("Executing process " + executingProcess["id"] + " executed for 10ms.");

	document.getElementById('time_' + executingProcess["id"]).innerHTML = "Time: "+
							executingProcess["quantum"]+" / "+executingProcess["time"];

	if(Math.floor((Math.random() * 100) + 1) < 50){
		setInfo("Process " + executingProcess["id"] + " made a I/O request.");
		executingProcess["io"] = "true";
	}
	
	if(executingProcess["time"] == 0){
		executingProcess["status"] = "done";
		removeProcess("#E_" + executingProcess["id"]);
		setInfo("Process " + executingProcess["id"] + " is complete.");
		executingProcess = null;
	}
	else if(executingProcess["io"] == "true"){
		removeProcess("#E_" + executingProcess["id"]);
		blockProcess(executingProcess);
		setInfo("Process " + executingProcess["id"] + " is blocked.");
		executingProcess = null;
	}
	else if(executingProcess["quantum"] == executingProcess["quantumUsed"]){
		removeProcess("#E_" + executingProcess["id"]);
		expireProcess(executingProcess);
		executingProcess["quantumUsed"] = 0;
		setInfo("Process " + executingProcess["id"] + " expired.");
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
													(processes[i]["io"] == 0 ? 0 : processes[i]["ioRemaining"]);

			setInfo("Process " + processes[i]["id"] + " realized I/O.");

			if(processes[i]["ioRemaining"] == 0){
				processes[i]["ioRemaining"] = processes[i]["ioTime"];
				removeProcess("#B_" + processes[i]["id"]);
				processes[i]["io"] = 0;

				if(processes[i]["time"] == 0){
					processes[i]["status"] = "done";
					setInfo("Process " + processes[i]["id"] + " is complete.");
				}
				else if(processes[i]["quantum"] == processes[i]["quantumUsed"]){
					expireProcess(processes[i]);
					processes[i]["quantumUsed"] = 0;
					setInfo("Process " + processes[i]["id"] + " expired.");
				}
				else{
					makeProcessReady(processes[i]);
					setInfo("Process " + processes[i]["id"] + " completed it's I/O request.");
				}
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
			setInfo("Process " + processes[i]["id"] + " is now executing.");
		}
		else if(expired == 1 && complete != processes.length){
			mainAlgorithm();
			setTimeout(checkReady, 1000);
		}
		
		setTimeout(checkEnd, 500);
	}
}

function checkEnd(){
	for (var i = processes.length - 1; i >= 0; i--) {
		if(processes[i]["status"] != "done")
			return;
	};

	clearInterval(interval);
	setInfo("All processes were executed.");
}

$(document).ready(function() {
	setTimeout(mainLoop, 2000);
	checkReady();
});

var mainLoop = function(){
	setTimeout(checkExecution, 4000);
	setTimeout(checkBlocked, 2000);
	setTimeout(checkReady(), 6000);
	steps++;
	document.getElementById('counter').innerHTML = "<span class=\"text-center lead\">" + 
		(steps*processingTime < 0 ? 0 : steps*processingTime) + "</span>";
};
var interval = setInterval(mainLoop, 8000);

$(document).ready(function() {
	var p;
	execSize = 1;
	blockedSize = 1;
	readySize = 1;

	process(0, 1, 10, 0, "ready", 20, 20);
	process(1, 2, 20, 0, "ready", 20, 20);
	process(2, 3, 30, 0, "ready", 20, 20);
	process(3, 3, 40, 0, "ready", 20, 20);

	p = getHTMLText("R", 0);
	$(p).appendTo('#ready');
	p = getHTMLText("R", 1);
	$(p).appendTo('#ready');
	p = getHTMLText("R", 2);
	$(p).appendTo('#ready');
	p = getHTMLText("R", 3);
	$(p).appendTo('#ready');

});