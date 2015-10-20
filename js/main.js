var processes = [];
var overallProcessingTime = 0;
var overallIOTime = 0;
var overallTime = 0;
var idleTime = 0;
var processingTime = 10;
var ioProcessingTime = 10;
var interval;
var executingProcess = null;
var steps = -1;
var quant = 0;
var display = [];
var movements = 0;


//PRECISA FAZER MOSTRAR AS COISAS DANDO UPDATE EM REAL TIME 

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
			"<div class=\"col-sm-4\">" +
					"<label  data-toggle=\"tooltip\" data-placement=\"top\" title=\"Defines the priority of the process\" for=\"processPriority\">Priority</label>" +
						"<select id=\"processPriority_" + id + "\" class=\"form-control\">" +
							"<option>1</option>" +
								"<option>2</option>" +
								"<option>3</option>" +
								"<option>4</option>" +
								"<option>5</option>" +
							"</select>" +
					"</div>" +
				"<div class=\"col-sm-4\">" +
					"<label data-toggle=\"tooltip\" data-placement=\"top\" title=\"Defines the amount of time necessary to complete the process\" for=\"processTime\">Time</label>" +
						"<select id=\"processTime_" + id + "\" class=\"form-control\">" +
							"<option>10</option>" +
								"<option>20</option>" +
								"<option>30</option>" +
								"<option>40</option>" +
								"<option>50</option>" +
							"</select>" +
					"</div>" +
				"<div class=\"col-sm-4\">" +
					"<label data-toggle=\"tooltip\" data-placement=\"top\" title=\"Defines the amount of time the process can stay executing\" for=\"processQuantum\">Quantum</label>" +
						"<select id=\"processQuantum_" + id + "\" class=\"form-control\">" +
							"<option>10</option>" +
								"<option>20</option>" +
								"<option>30</option>" +
								"<option>40</option>" +
								"<option>50</option>" +
							"</select>" +
					"</div>" +
			"</div>" +
		"<div class=\"row\">" +
			"<div class=\"col-sm-5\">" +
					"<label data-toggle=\"tooltip\" data-placement=\"top\" title=\"Defines a chance for the process to require I/O data\" for=\"processIOChance\">I/O chance</label>" +
						"<textarea readonly id=\"processIOChance_" + id + "\"class=\"form-control\" rows=\"1\" cols=\"1\"></textarea>" +
					"</div>" +
				"<div class=\"col-sm-5\">" +
					"<label data-toggle=\"tooltip\" data-placement=\"top\" title=\"Defines the amount of time for the process to finish it's I/O request\" for=\"processIOTime\">I/O Time</label>" +
						"<select id=\"processIOTime_" + id + "\" class=\"form-control\">" +
								"<option>10</option>" +
								"<option>20</option>" +
								"<option>30</option>" +
								"<option>40</option>" +
								"<option>50</option>" +
							"</select>" +
					"</div>" +
				"<div class=\"row\">" +
					"<div class=\"col-md-11\">" +
							"<input id=\"slider_" + id + "\" onchange=\"changeProcessIOChance(this.id)\" type=\"range\" min=\"0\" max=\"70\" step=\"1\" value=\"35\"/>" +
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

function get(id){	
	var elem = document.getElementById(id);
	return elem.options[elem.selectedIndex].value;
}

function getValueFromSlider(id){
	var elem = document.getElementById(id);
	return elem.value;
}

function aleatory(){
	if(quant == 0){
		alert("Please select one or more processes to schedule");
		return;
	}

	localStorage.setItem("quantity", quant);

	for (var i = 0; i < quant; i++){
		localStorage.setItem("processPriority_" + i, getRandom(4, 1));
		localStorage.setItem("processTime_" + i, normalize(getRandom(50, 10)));
		localStorage.setItem("processQuantum_" + i, normalize(getRandom(50, 10)));
		localStorage.setItem("processIOTime_" + i, normalize(getRandom(50, 10)));
		localStorage.setItem("processIOChance_" + i, normalize(getRandom(70, 10)));
	};

	window.location.href = "game.html";

}

function ready(){
	if(quant == 0){
		alert("Please select one or more processes to schedule");
		return;
	}

	localStorage.setItem("quantity", quant);

	for (var i = 0; i < quant; i++){
		localStorage.setItem("processPriority_" + i, get("processPriority_" + i));
		localStorage.setItem("processTime_" + i, get("processTime_" + i));
		localStorage.setItem("processQuantum_" + i, get("processQuantum_" + i));
		localStorage.setItem("processIOTime_" + i, get("processIOTime_" + i));
		localStorage.setItem("processIOChance_" + i, getValueFromSlider("processIOChance_" + i));
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
	status: -1,
};

function addProcess(id, priority, time, io, status, quantum, ioTime, ioChance){
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
		"<span id=\"time_" + n + "\"class=\"label label-primary\">Time: "+processes[n]["quantumUsed"] +"/" +processes[n]["quantum"]+" | "+processes[n]["time"] + "</span>" +
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
			processes[i]["quantumUsed"] = 0;
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

	overallProcessingTime += processingTime;

	executingProcess["quantumUsed"] += 10;
	executingProcess["time"] -= processingTime;
	
	setInfo("Process " + executingProcess["id"] + " executed for 10ms.", "success");

	document.getElementById('time_' + executingProcess["id"]).innerHTML = "Time: "+executingProcess["quantumUsed"] +"/" +executingProcess["quantum"]+" | "+executingProcess["time"];

	if(getRandom(100, 1) < executingProcess["ioChance"]){
		setInfo("Process " + executingProcess["id"] + " made a I/O request.", "success");
		io = true;
	}
	
	if(executingProcess["time"] == 0){
		executingProcess["status"] = "done";
		removeProcess("#E_" + executingProcess["id"]);
		setInfo("Process " + executingProcess["id"] + " is complete.", "success");
		executingProcess = null;
	}
	else if(io == true){
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
	var io = false;
	for (var i = processes.length - 1; i >= 0; i--){
		if(processes[i]["status"] == "justBlocked")
			processes[i]["status"] = "blocked";
		else if(processes[i]["status"] == "blocked"){
			processes[i]["ioRemaining"] -= ioProcessingTime;
			
			document.getElementById('io_' + processes[i]["id"]).innerHTML = "I/O: " +
													(processes[i]["io"] == 0 ? 0 : processes[i]["ioRemaining"]);

			setInfo("Process " + processes[i]["id"] + " realized I/O.", "danger");

			if(!io){
				overallIOTime += ioProcessingTime;
				io = true;
			}

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
			setTimeout(mainAlgorithm, 500);
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
}


function startGame(){
	quant = localStorage.getItem("quantity");

	for(var i = 0; i < quant; i++){
		var priority = localStorage.getItem("processPriority_" + i);
		var time = localStorage.getItem("processTime_" + i);
		var quantum = localStorage.getItem("processQuantum_" + i);
		var IOTime = localStorage.getItem("processIOTime_" + i);
		var IOChance = localStorage.getItem("processIOChance_" + i);

		if(IOChance == "")
			IOChance = 35;

		addProcess(i, priority, time, 0, "ready", quantum, IOTime, IOChance);
	}

	for (var i = 0; i < quant; i++) {
		var p = getProcessHTMLBlock("R", i);
		$(p).appendTo('#ready');
	};

	var mainLoop = function(){
		setTimeout(checkReady, 2000);
		setTimeout(checkBlocked, 4000);
		setTimeout(checkExecution, 6000);
		setTimeout(checkEnd, 8000);
		overallTime += processingTime;
		steps++;
		document.getElementById('counter').innerHTML = "<span class=\"text-center lead\">" + (steps*processingTime < 0 ? 0 : steps*processingTime) + "</span>";
		setStatistics();
	};
			
	interval = setInterval(mainLoop, 9000);
}

function setStatistics(){
	var stat = document.getElementById('statisticsContent');

	var iT = "Idle time: " + idleTime + "ms. <br>";
	var uT = "Used time: " + overallProcessingTime + "ms. <br>";
	var cpuUsage = "CPU usage: " + (((overallTime - overallIOTime)/overallTime)*100) + "%. <br>";

	stat.innerHTML = iT + uT + cpuUsage;
}