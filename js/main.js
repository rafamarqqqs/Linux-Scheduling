var processes = [];
var processingTime = 10;
var ioProcessingTime = 10;
var executingProcess = null;
var steps = -1;
var quant = 0;


//PRECISA FAZER MOSTRAR AS COISAS DANDO UPDATE EM REAL TIME 

function changeProcessQuant(){
	var elem = document.getElementById('processQuant');
	quant = elem.options[elem.selectedIndex].value;
	console.log(quant);

	for (var i = quant; i >= 0; i--) {
		addProcessForm();
	};
}

function addProcessForm(){

}

function getProcessHTMLForm(){

}



//objeto para guardar os dados dos processos
var Process = {
	id:-1,
	priority:-1,
	time:-1,
	io: -1,
	ioChance: -1,
	ioTime: -1,
	ioRemaining: -1,
	quantum: -1,
	quantumUsed: -1,
	status: -1,
};

function process(id, priority, time, io, status, quantum, ioTime, ioChance){
	Process = {};
	processes[processes.length] = Process;
	processes[processes.length - 1]["id"] = id;
	processes[processes.length - 1]["priority"] = priority;
	processes[processes.length - 1]["time"] = time;
	processes[processes.length - 1]["quantum"] = quantum;
	processes[processes.length - 1]["quantumUsed"] = 0;
	processes[processes.length - 1]["io"] = io;
	processes[processes.length - 1]["ioChance"] = ioChance;
	processes[processes.length - 1]["ioTime"] = ioTime;
	processes[processes.length - 1]["ioRemaining"] = ioTime;
	processes[processes.length - 1]["status"] = status;
}

function setInfo(info, color){
	if(color == "primary")
		document.getElementById('info').innerHTML = "<div class=\"alert bg-primary\" role=\"alert\">" + info + "</div>";
	else
		document.getElementById('info').innerHTML = "<div class=\"alert alert-" + color + "\" role=\"alert\">" + info + "</div>";

	$("#modalTextArea").append("<span class=\"label label-" + color + "\">" + info + "</span><br>");
}

//codigo html que gera a figura do processo (grupo de botoes)
function getProcessHTMLBlock(block, n){
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
	setInfo("Swapping vectors...", "warning");

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
	var aux = getProcessHTMLBlock("E", p["id"]);
	$(aux).appendTo('#exec').hide().slideDown("fast");
}

function blockProcess(p){
	p["io"] = "true";
	p["status"] = "justBlocked";
	var aux = getProcessHTMLBlock("B", p["id"]);
	$(aux).appendTo('#blocked').hide().slideDown("fast");
}

function makeProcessReady(p){
	p["status"] = "ready";	
	var aux = getProcessHTMLBlock("R", p["id"]);
	$(aux).appendTo('#ready').hide().slideDown("fast");
}

function expireProcess(p){
	p["status"] = "expired";	
	var aux = getProcessHTMLBlock("Ex", p["id"]);
	$(aux).appendTo('#expired').hide().slideDown("fast");
}

function checkExecution(){
	if(executingProcess == null)
		return;

	executingProcess["quantumUsed"] += 10;
	executingProcess["time"] -= processingTime;
	
	setInfo("Process " + executingProcess["id"] + " executed for 10ms.", "success");

	document.getElementById('time_' + executingProcess["id"]).innerHTML = "Time: "+
							executingProcess["quantum"]+" / "+executingProcess["time"];

	if(Math.floor((Math.random() * 100) + 1) < executingProcess["ioChance"]){
		setInfo("Process " + executingProcess["id"] + " made a I/O request.", "success");
		executingProcess["io"] = "true";
	}
	
	if(executingProcess["time"] == 0){
		executingProcess["status"] = "done";
		removeProcess("#E_" + executingProcess["id"]);
		setInfo("Process " + executingProcess["id"] + " is complete.", "success");
		executingProcess = null;
	}
	else if(executingProcess["io"] == "true"){
		removeProcess("#E_" + executingProcess["id"]);
		blockProcess(executingProcess);
		setInfo("Process " + executingProcess["id"] + " is blocked.", "success");
		executingProcess = null;
	}
	else if(executingProcess["quantum"] == executingProcess["quantumUsed"]){
		removeProcess("#E_" + executingProcess["id"]);
		expireProcess(executingProcess);
		executingProcess["quantumUsed"] = 0;
		setInfo("Process " + executingProcess["id"] + " expired.", "success");
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

			setInfo("Process " + processes[i]["id"] + " realized I/O.", "danger");

			if(processes[i]["ioRemaining"] == 0){
				processes[i]["ioRemaining"] = processes[i]["ioTime"];
				removeProcess("#B_" + processes[i]["id"]);
				processes[i]["io"] = 0;

				if(processes[i]["time"] == 0){
					processes[i]["status"] = "done";
					setInfo("Process " + processes[i]["id"] + " is complete.", "danger");
				}
				else if(processes[i]["quantum"] == processes[i]["quantumUsed"]){
					expireProcess(processes[i]);
					processes[i]["quantumUsed"] = 0;
					setInfo("Process " + processes[i]["id"] + " expired.", "danger");
				}
				else{
					makeProcessReady(processes[i]);
					setInfo("Process " + processes[i]["id"] + " completed it's I/O request.", "danger");
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
			setInfo("Process " + processes[i]["id"] + " is now executing.", "info");
		}
		else if(expired == 1 && complete != processes.length){
			mainAlgorithm();
			setTimeout(checkReady, 700);
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
	setInfo("All processes were executed.", "primary");
}


function startGame(){
	var p;

	process(0, 1, 10, 0, "ready", 20, 20, 50);
	process(1, 2, 20, 0, "ready", 20, 20, 50);
	process(2, 3, 30, 0, "ready", 20, 20, 50);
	process(3, 3, 40, 0, "ready", 20, 20, 50);

	p = getProcessHTMLBlock("R", 0);
	$(p).appendTo('#ready');
	p = getProcessHTMLBlock("R", 1);
	$(p).appendTo('#ready');
	p = getProcessHTMLBlock("R", 2);
	$(p).appendTo('#ready');
	p = getProcessHTMLBlock("R", 3);
	$(p).appendTo('#ready');

	checkReady();
	mainLoop();

	var mainLoop = function(){
		setTimeout(checkExecution, 2000);
		setTimeout(checkBlocked, 4000);
		setTimeout(checkReady(), 6000);
		steps++;
		document.getElementById('counter').innerHTML = "<span class=\"text-center lead\">" + (steps*processingTime < 0 ? 0 : steps*processingTime) + "</span>";
	};
	var interval = setInterval(mainLoop, 7000);
}
