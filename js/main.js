var processes = [];

var overallProcessingTime = 0;
var overallIOTime = 0;
var overallTime = 0;
var idleTime = 0;

var processCPUTime = 0;
var processingTime = 10;
var ioProcessingTime = 10;

var interval;

var executingProcess = null;
var steps = 0;
var quant = 0;

var mode = null;
var noMove = true;
var nextStepCounter = 1;

var infos = 0;
var end = false;

var blocked = 0;
var ready = quant;


/*

QUANDO UM PROCESSO DE TEMPO REAL DEIXA A CPU ELE VAI PRA ONDE ? EXPIRADO OU READY ?


*/

function changeProcessQuant(){
	var elem = document.getElementById('processQuant');
	quant = elem.options[elem.selectedIndex].value;

	for (var i = 0; i < 6; i++)
		document.getElementById("col" + (i + 1)).innerHTML = "";

	for (var i = 0; i < quant; i++){
		addProcessForm(i, "col" + (i + 1));
	};
}

function addProcessForm(id, col){
	var elem = getProcessHTMLForm(id);
	$(elem).appendTo(document.getElementById(col));
}

function getProcessHTMLForm(id){
	return "<div class=\"well well-sm processWell\">" +
			"<div class=\"row\">" +
			"<div class=\"col-sm-3\">" +
					"<label  data-toggle=\"tooltip\" data-placement=\"top\" title=\"Defines the priority of the process\" for=\"processPriority\">Priority</label>" +
						"<textarea style=\"resize:none\" id=\"processPriority_" + id + "\"class=\"form-control\" rows=\"1\" cols=\"1\"></textarea>" +
					"</div>" +
				"<div class=\"col-sm-3\">" +
					"<label data-toggle=\"tooltip\" data-placement=\"top\" title=\"Defines the amount of time necessary to complete the process\" for=\"processTime\">Time</label>" +
						"<select id=\"processTime_" + id + "\" class=\"form-control processTexts\">" +
								"<option>10</option>" +
								"<option>20</option>" +
								"<option>30</option>" +
								"<option>40</option>" +
								"<option>50</option>" +
							"</select>" +
					"</div>" +
				"<div class=\"col-sm-3\">" +
					"<label  data-toggle=\"tooltip\" data-placement=\"top\" title=\"Defines the schedule type of the process\" for=\"processScheduleType_\">Type</label>" +
						"<select id=\"processScheduleType_" + id + "\" class=\"form-control processTexts\">" +
								"<option>FIFO</option>" +
								"<option>Round Robin</option>" +
						"</select>" +
				"</div>" +
				"<div class=\"col-sm-3\">" +
					"<label data-toggle=\"tooltip\" data-placement=\"top\" title=\"Defines the amount of time for the process to finish it's I/O request\" for=\"\"processIOTime_" + id + "\">I/O Time</label>" +
						"<select id=\"processIOTime_" + id + "\" class=\"form-control processTextsIO\">" +
								"<option>10</option>" +
								"<option>20</option>" +
								"<option>30</option>" +
								"<option>40</option>" +
								"<option>50</option>" +
							"</select>" +
					"</div>" +
			"</div>" +
		"<div class=\"row\">" +
			"<div class=\"col-sm-6\">" +
					"<label data-toggle=\"tooltip\" data-placement=\"top\" title=\"Defines a chance for the process to require I/O data\" for=\"processIOChance\">I/O chance</label>" +
						"<textarea style=\"resize:none\" readonly id=\"processIOChance_" + id + "\"class=\"form-control\" rows=\"1\" cols=\"1\"></textarea>" +
					"</div>" +
			"<div class=\"col-sm-6\">" +
					"<label data-toggle=\"tooltip\" data-placement=\"top\" title=\"Defines a chance for the FIFO process to leave the CPU\" for=\"processLeaveChance_" + id + "\">Leave chance</label>" +
						"<textarea style=\"resize:none\" readonly id=\"processLeaveChance_" + id + "\"class=\"form-control\" rows=\"1\" cols=\"1\"></textarea>" +
					"</div>" +
				"<div class=\"row\">" +
					"<div class=\"col-md-11\">" +
						"<input id=\"sliderIO_" + id + "\" onchange=\"changeProcessIOChance(this.id)\" type=\"range\" min=\"0\" max=\"70\" step=\"1\" value=\"40\"/>" +
					"</div>" +
				"</div>" +
				"<div class=\"row\">" +
					"<div class=\"col-md-11\">" +
						"<input id=\"sliderLeave_" + id + "\" onchange=\"changeProcessLeaveChance(this.id)\" type=\"range\" min=\"0\" max=\"90\" step=\"1\" value=\"30\"/>" +
					"</div>" +
				"</div>" +
			"</div>" +
		"</div>";
}

function getRandom(max, base){
	return Math.floor((Math.random() * max) + base);
}

function normalize(n){
	return (Math.floor((n/10)))*10;
}

function changeProcessIOChance(id){
	var elem = document.getElementById(id);
	var n = id.split("_");
	var v = elem.value;
	document.getElementById("processIOChance_" + n[1]).innerHTML = v;
}

function changeProcessLeaveChance(id){
	var elem = document.getElementById(id);
	var n = id.split("_");
	var v = elem.value;
	document.getElementById("processLeaveChance_" + n[1]).innerHTML = v;
}

function getFromTextArea(id){	
	var elem = document.getElementById(id);
	return elem.value;
}

function get(id){	
	var elem = document.getElementById(id);
	return elem.options[elem.selectedIndex].value;
}

function getValueFromSlider(id){
	var elem = document.getElementById(id);
	return elem.value;
}

function getScheduleType(type){
	return type == 0 ? "FIFO" : "Round Robin";
}

function check(){
	if(quant == 0){
		alert("Please select one or more processes to schedule");
		return -1;
	}

	if(mode == null){
		alert("Please select the mode of the schedule");
		return -1;
	}

	return 1;
}

function aleatory(){
	if(check() == -1)
		return;

	localStorage.setItem("quantity", quant);
	localStorage.setItem("mode", mode);

	var type;
	var priority;

	for (var i = 0; i < quant; i++){
		priority = getRandom(140, 1);
		localStorage.setItem("processPriority_" + i, priority);
		localStorage.setItem("processTime_" + i, normalize(getRandom(50, 10)));

		if(priority <= 100){
			type = getRandom(2, 0);
			localStorage.setItem("processScheduleType_" + i,  getScheduleType(type));
		}
		else{
			localStorage.setItem("processScheduleType_" + i,  "Round Robin");
			type = 1;
		}

		localStorage.setItem("processIOTime_" + i, normalize(getRandom(50, 10)));
		localStorage.setItem("processIOChance_" + i, getRandom(70, 10));

		if(type == 0)
			localStorage.setItem("processLeaveChance_" + i, getRandom(40, 10));
	};

	window.location.href = "game.html";

}

function ioBounded(){
	if(check() == -1)
		return;

	localStorage.setItem("quantity", quant);
	localStorage.setItem("mode", mode);

	var type;
	var priority;

	for (var i = 0; i < quant; i++){
		priority = getRandom(140, 1);
		localStorage.setItem("processPriority_" + i, priority);
		localStorage.setItem("processTime_" + i, normalize(getRandom(50, 10)));

		if(priority <= 100){
			type = getRandom(2, 0);
			localStorage.setItem("processScheduleType_" + i,  getScheduleType(type));
		}
		else{
			localStorage.setItem("processScheduleType_" + i,  "Round Robin");
			type = 1;
		}

		localStorage.setItem("processIOTime_" + i, normalize(getRandom(50, 30)));
		localStorage.setItem("processIOChance_" + i, getRandom(70, 50));

		if(type == 0)
			localStorage.setItem("processLeaveChance_" + i, getRandom(40, 10));
	};

	window.location.href = "game.html";

}

function cpuBounded(){
	if(check() == -1)
		return;

	localStorage.setItem("quantity", quant);
	localStorage.setItem("mode", mode);

	var type;
	var priority;

	for (var i = 0; i < quant; i++){
		priority = getRandom(140, 1);
		localStorage.setItem("processPriority_" + i, priority);
		localStorage.setItem("processTime_" + i, normalize(getRandom(50, 10)));

		if(priority <= 100){
			type = getRandom(2, 0);
			localStorage.setItem("processScheduleType_" + i,  getScheduleType(type));
		}
		else{
			localStorage.setItem("processScheduleType_" + i,  "Round Robin");
			type = 1;
		}

		localStorage.setItem("processIOTime_" + i, normalize(getRandom(20, 10)));
		localStorage.setItem("processIOChance_" + i, getRandom(20, 10));

		if(type == 0)
			localStorage.setItem("processLeaveChance_" + i, getRandom(40, 10));
	};

	window.location.href = "game.html";

}

function readyBtn(){
	if(check() == -1)
		return;

	for (var i = 0; i < quant; i++){
		if(getFromTextArea("processPriority_" + i) > 140 || getFromTextArea("processPriority_" + i) < 0){
			alert("Please enter a valid priority (0 < priority < 140)");
			return;
		}
		if(getFromTextArea("processPriority_" + i) > 100 && get("processScheduleType_" + i) == "FIFO"){
			alert("FIFO schedule mode can be applied only to real time processes ! (priority <= 100)");
			return;
		}
		if(getFromTextArea("processPriority_" + i) == ""){
			alert("Please select a priority for the process " + i);
			return;
		}
	}

	for (var i = 0; i < quant; i++){
	}

	localStorage.setItem("quantity", quant);
	localStorage.setItem("mode", mode);

	var type;

	for (var i = 0; i < quant; i++){
		localStorage.setItem("processPriority_" + i, getFromTextArea("processPriority_" + i));
		localStorage.setItem("processTime_" + i, get("processTime_" + i));
		type =  get("processScheduleType_" + i);
		localStorage.setItem("processScheduleType_" + i, type);
		localStorage.setItem("processIOTime_" + i, get("processIOTime_" + i));
		localStorage.setItem("processIOChance_" + i, getValueFromSlider("processIOChance_" + i));

		if(type == "FIFO")
			localStorage.setItem("processLeaveChance_" + i, getValueFromSlider("processLeaveChance_" + i));			
	};

	window.location.href = "game.html";
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
	leaveChance: -1,
	type: -1,
	status: -1,
};

function addProcess(id, type, priority, time, io, status, quantum, ioTime, ioChance, leaveChance){
	Process = {};
	processes[processes.length] = Process;
	processes[processes.length - 1]["id"] = id;
	processes[processes.length - 1]["priority"] = priority;
	processes[processes.length - 1]["type"] = type;
	processes[processes.length - 1]["time"] = time;
	processes[processes.length - 1]["quantum"] = quantum;
	processes[processes.length - 1]["quantumUsed"] = 0;
	processes[processes.length - 1]["io"] = io;
	processes[processes.length - 1]["ioChance"] = ioChance;
	processes[processes.length - 1]["ioTime"] = ioTime;
	processes[processes.length - 1]["ioRemaining"] = ioTime;
	processes[processes.length - 1]["status"] = status;
	processes[processes.length - 1]["leaveChance"] = leaveChance;
}

function setInfo(info, color){
	noMove = false;
	infos++;

	setTimeout(function() {
		infos--;

		if(color == "primary")
			document.getElementById('info').innerHTML = "<div class=\"alert bg-primary\" role=\"alert\">" + info + "</div>";
		else
			document.getElementById('info').innerHTML = "<div class=\"alert alert-" + color + "\" role=\"alert\">" + info + "</div>";

		$("#modalTextArea").append("<span class=\"label label-" + color + "\">" + info + "</span><br>");

	}, infos*1000);
}

//codigo html que gera a figura do processo (grupo de botoes)
function getProcessHTMLBlock(block, n){
	return "<div id=\"" + block + "_" + n + "\" class=\"list-group processBg\">" +
		   "<div class=\"list-group-item  processBg\">" + 
		"<span class=\"label label-success\">ID: " + processes[n]["id"] + "   </span>" +
		"<span id=\"time_" + n + "\"class=\"label label-primary\">Time: "+(processes[n]["type"] == "FIFO" ? "FIFO" : processes[n]["quantumUsed"] +"/" +processes[n]["quantum"])+" | "+ (processes[n]["time"] < 0 ? 0 : processes[n]["time"]) + "</span>" +
		"<span class=\"label label-info\">Priority: " + processes[n]["priority"] + "   </span>" +
		"<span id=\"io_" + n + "\"class=\"label label-danger\">I/O: " +
		(processes[n]["io"] == 0 ? 0 : processes[n]["ioRemaining"]) + 
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
			processes[i]["quantumUsed"] = 0;
			document.getElementById('time_' + processes[i]["id"]).innerHTML = "Time: "+(processes[i]["type"] == "FIFO" ? "FIFO" : processes[i]["quantumUsed"] +"/" +processes[i]["quantum"])+" | "+ (processes[i]["time"] < 0 ? 0 : processes[i]["time"]);
		}
	}

	document.getElementById('expiredBlock').innerHTML = "<div id=\"expired\"></div>";
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
	if(executingProcess == null){
		idleTime += processingTime;
		return;
	}

	var io = false;
	var remake = false;

	overallProcessingTime += processingTime;

	executingProcess["quantumUsed"] += ioProcessingTime;
	executingProcess["time"] -= processingTime;
	processCPUTime += processingTime;

	document.getElementById('time_' + executingProcess["id"]).innerHTML = "Time: "+(executingProcess["type"] == "FIFO" ? "FIFO" : executingProcess["quantumUsed"] +"/" +executingProcess["quantum"])+" | "+ (executingProcess["time"] < 0 ? 0 : executingProcess["time"]);

	if(getRandom(100, 1) < executingProcess["ioChance"])
		io = true;
	
	if(io == true){
		removeProcess("#E_" + executingProcess["id"]);
		blockProcess(executingProcess);
		setInfo("Process " + executingProcess["id"] + " made a I/O request and is blocked.", "success");
		remake = true;
	}
	else if(executingProcess["time"] <= 0){
		executingProcess["status"] = "done";
		removeProcess("#E_" + executingProcess["id"]);
		setInfo("Process " + executingProcess["id"] + " executed for " + processCPUTime + "ms, and is complete.", "success");
		remake = true;
	}
	else if(executingProcess["type"] == "FIFO" && getRandom(100, 1) < executingProcess["leaveChance"]){
		removeProcess("#E_" + executingProcess["id"]);
		makeProcessReady(executingProcess);
		executingProcess["quantumUsed"] = 0;
		setInfo("Process " + executingProcess["id"] + " executed for " + processCPUTime + "ms, and left the CPU.", "success");
		remake = true;
	}
	else if(executingProcess["quantum"] == executingProcess["quantumUsed"] && executingProcess["type"] != "FIFO"){
		removeProcess("#E_" + executingProcess["id"]);
		expireProcess(executingProcess);
		executingProcess["quantumUsed"] = 0;
		setInfo("Process " + executingProcess["id"] + " executed for " + processCPUTime + "ms, and expired.", "success");
		remake = true;
	}
	else
		setInfo("Process " + executingProcess["id"] + " executed for " + processCPUTime + "ms.", "success");


	if(remake == true){
		executingProcess = null;
		processCPUTime = 0;
	}

}

function checkBlocked(){
	var io = false;
	var p = [0, 0, 0, 0, 0, 0];
	var text = "";
	var counter = 0;

	for (var i = processes.length - 1; i >= 0; i--){
		if(processes[i]["status"] == "justBlocked")
			processes[i]["status"] = "blocked";
		else if(processes[i]["status"] == "blocked"){
			processes[i]["ioRemaining"] -= ioProcessingTime;
			
			document.getElementById('io_' + processes[i]["id"]).innerHTML = "I/O: " +
													(processes[i]["io"] == 0 ? 0 : processes[i]["ioRemaining"]);

			p[i] = 1;

			if(!io){
				overallIOTime += ioProcessingTime;
				io = true;
			}

			if(processes[i]["ioRemaining"] == 0){
				processes[i]["ioRemaining"] = processes[i]["ioTime"];
				removeProcess("#B_" + processes[i]["id"]);
				processes[i]["io"] = 0;

				if(processes[i]["time"] <= 0){
					processes[i]["status"] = "done";
					setInfo("Process " + processes[i]["id"] + " completed it's I/O request, and finished.", "danger");
					p[i] = 0;
				}
				else if(processes[i]["quantum"] == processes[i]["quantumUsed"]){
					expireProcess(processes[i]);
					processes[i]["quantumUsed"] = 0;
					setInfo("Process " + processes[i]["id"] + " completed it's I/O request, and expired.", "danger");
					p[i] = 0;
				}
				else{
					setInfo("Process " + processes[i]["id"] + " completed it's I/O request.", "danger");
					makeProcessReady(processes[i]);
					p[i] = 0;
				}
			}
		}
	}

	for (var i = processes.length - 1; i >= 0; i--){
		if(p[i] == 1){
			text += i + ", ";
			counter++;
		}
	}

	if(counter > 0){
		if(counter == 1)
			setInfo("Process " + text.substr(0, (counter*3) - 2) + " realized I/O.", "danger");
		else
			setInfo("Processes " + text.substr(0, (counter*3) - 2) + " realized I/O.", "danger");
	}
}

function checkReady(){
	var expired = 1;
	var complete = 0;
	var priority = 141;
	var j = -1;

	if(executingProcess == null){
		for (var i = 0; i < processes.length; i++) {

			if(processes[i]["status"] == "ready" && parseInt(processes[i]["priority"]) < priority){
				j = i;
				priority = parseInt(processes[j]["priority"]);
			}

			if(processes[i]["status"] != "expired" && processes[i]["status"] != "done")
				expired = 0;
			else if(processes[i]["status"] == "done")
				complete++;
		};

		if(j != -1){
			removeProcess("#R_" + processes[j]["id"]);
			executeProcess(processes[j]);	
			setInfo("Process " + processes[j]["id"] + " is now executing.", "info");
		}
		else if(expired == 1 && complete != processes.length){
			setInfo("Swapping vectors...", "warning");
			mainAlgorithm();
			setTimeout(checkReady, 1000);
		}
	}
}

function checkEnd(){
	for (var i = processes.length - 1; i >= 0; i--) {
		if(processes[i]["status"] != "done")
			return;
	};

	clearInterval(interval);
	setInfo("All processes were executed.", "primary");
	end = true;
}

function getProcessQuantum(p){
	if(p > 100)
		return 10;
	else
		return normalize(120 - p);
}

function startGame(){
	quant = localStorage.getItem("quantity");
	mode = localStorage.getItem("mode");

	for(var i = 0; i < quant; i++){
		var priority = localStorage.getItem("processPriority_" + i);
		var time = localStorage.getItem("processTime_" + i);
		var type = localStorage.getItem("processScheduleType_" + i);
		var IOTime = localStorage.getItem("processIOTime_" + i);
		var IOChance = localStorage.getItem("processIOChance_" + i);
		var leaveChance = type == "FIFO" ? localStorage.getItem("processLeaveChance_" + i) : -1;

		if(IOChance == "")
			IOChance = 35;
		if(leaveChance == "")
			leaveChance = 30;

		addProcess(i, type, priority, time, 0, "ready", getProcessQuantum(priority), IOTime, IOChance, leaveChance);
	}

	for (var i = 0; i < quant; i++) {
		var p = getProcessHTMLBlock("R", i);
		$(p).appendTo('#ready');
	};

	if(mode == "automatic")
		doAutomatic();
}

function doAutomatic(){
	ready = quant;
	var time = 2000;

	setTimeout(function(){
		checkReady();
		setTimeout(mainLoop, 2000);
		setTimeout(function(){
			interval = setInterval(mainLoop, 8000);
		}, 2000);
	}, 1000);
	
	var mainLoop = function(){
		checkExecution();
		
		setTimeout(checkBlocked, 2000);
		setTimeout(checkReady, 4000);
		setTimeout(checkEnd, 6000);
		setProcessing();
		setStatistics();
	};
}

function doStepByStep(){
	if(nextStepCounter % 3 == 0){
		checkExecution();
	}
	if(nextStepCounter % 3 == 1){
		checkBlocked();
	}
	if(nextStepCounter % 3 == 2){
		checkReady();
		checkEnd();
		setProcessing();
	}

	setStatistics();
}

function nextStep(){
	if(end)
		return;

	noMove = true;
	
	while(noMove == true){
		nextStepCounter++;
		doStepByStep();
	}
}

function setProcessing(){
	overallTime += processingTime;
	steps++;
	document.getElementById('counter').innerHTML = "<span class=\"text-center lead\">" + (steps*processingTime < 0 ? 0 : steps*processingTime) + "</span>";
}

function setStatistics(){
	var stat = document.getElementById('statisticsContent');

	var iT = "Idle time: " + idleTime + "ms. <br>";
	var uT = "Used time: " + overallProcessingTime + "ms. <br>";
	var cpuUsage = "CPU usage: " + (((overallTime - idleTime)/overallTime)*100).toFixed(2) + "%. <br>";

	stat.innerHTML = iT + uT + cpuUsage;
}

function setAutomatic(){
	mode = "automatic";
}

function setStepByStep(){
	mode = "stepByStep";
}