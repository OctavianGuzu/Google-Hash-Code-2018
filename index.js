const fs = require('fs');

var Ride = function(from, to, start, end) {
	this.from = from;
	this.to = to;
	this.start = start;
	this.end = end;
}

var info;
var vehs  = [];
var medie;

var parseFile = function (file) {
	var arr = fs.readFileSync(file, 'utf8').split("\n");
	var firstline = arr[0].split(" ");

	var rides = [];

	var input = {
		R: parseInt(firstline[0]), C:parseInt(firstline[1]), F:parseInt(firstline[2]), N:parseInt(firstline[3]), B:parseInt(firstline[4]),
		T:parseInt(firstline[5])
	};

	for(var i = 0; i < input.N; i++) {
		//console.log(arr[i+1]);
		var line = arr[i+1].split(" ");
		var ride = {
			from: {
				x: parseInt(line[0]), y : parseInt(line[1])
			},
			to : {
				x: parseInt(line[2]), y : parseInt(line[3])
			},
			start : parseInt(line[4]),
			end: parseInt(line[5]),
			taken: false,
			index: i
		}
		rides.push(ride);
	}
	info = {
		data: input,
		rides: rides
	};
	return {
		data: input,
		rides: rides
	};
}

var findClosest = function(veh_i) {
	var rides = info.rides;
	var data = info.data;
	var min = {dist:999999999999999999999, ride_index: -1};
	var all_time = data.T;
	var delta = 50;

	for(var i = 0; i < rides.length; i++) {
		if (!rides[i].taken) {
			var a = Math.abs(rides[i].from.x - vehs[veh_i].where.x) + Math.abs(rides[i].from.y - vehs[veh_i].where.y);
			var b = Math.abs(rides[i].to.x - rides[i].from.x) + Math.abs(rides[i].to.y - rides[i].from.y);

			if (vehs[veh_i].time + a <= rides[i].start &&
				rides[i].start + b <= rides[i].end && b < 2 * medie) {
				rides[i].taken = true;
				vehs[veh_i].rides.push(i);
				vehs[veh_i].where.x = rides[i].to.x;
				vehs[veh_i].where.y = rides[i].to.y;
				vehs[veh_i].time = rides[i].start + b;
				console.log("here");
				return;
			}

		}
	}

	for(var i = 0; i < rides.length; i++) {
		if (!rides[i].taken) {
			var a = Math.abs(rides[i].from.x - vehs[veh_i].where.x) + Math.abs(rides[i].from.y - vehs[veh_i].where.y);
			var b = Math.abs(rides[i].to.x - rides[i].from.x) + Math.abs(rides[i].to.y - rides[i].from.y);
			//var c = Math.abs(rides[i].from.x - vehs[veh_i].where.x) + Math.abs(rides[i].from.y - vehs[veh_i].where.y);
			//if (a < min.dist ) {
				if (vehs[veh_i].time + a > rides[i].start && vehs[veh_i].time + b + a < rides[i].end &&
					vehs[veh_i].time + b + a <= rides[i].end && b < 2 * medie) {
						min.dist = a;
						min.ride_index = i;
				}
			//}
		}
	}

	if (min.ride_index >= 0) {
		rides[min.ride_index].taken = true;
		vehs[veh_i].rides.push(min.ride_index);
		vehs[veh_i].where.x = rides[min.ride_index].to.x;
		vehs[veh_i].where.y = rides[min.ride_index].to.y;
		vehs[veh_i].time = Math.abs(rides[min.ride_index].to.x - rides[min.ride_index].from.x) + Math.abs(rides[min.ride_index].to.y - rides[min.ride_index].from.y) +
			Math.abs(rides[min.ride_index].from.x - vehs[veh_i].where.x) + Math.abs(rides[min.ride_index].from.y - vehs[veh_i].where.y)
		}

	return 0;
}

var printToFile = function (output) {
	buffer = "";

	for (var i = 0; i < vehs.length; i++) {
		var current = vehs[i].rides.length + "";

		var curr_rides = vehs[i].rides;
		for(var j = 0; j < curr_rides.length; j++)
			current += " " + curr_rides[j];
		buffer += current + "\n";
	}
	//console.log(buffer);
	console.log("Writing to file!");
	fs.writeFileSync(output, buffer);
	
}

var getMedie = function() {
	var rides = info.rides;
	var sum = 0.0;

	for(var i = 0; i < rides.length; i++) {
		var b = Math.abs(rides[i].to.x - rides[i].from.x) + Math.abs(rides[i].to.y - rides[i].from.y);
		sum += b;
	}

	return sum / rides.length;
}

var main = function() {
	//parseFile("b_should_be_easy.in");
	//parseFile("c_no_hurry.in");
	parseFile("e_high_bonus.in");

	medie = getMedie();
	
	for(var i = 0; i < info.data.F; i++) {
		vehs.push({where: {x:0,y:0}, time : 0, rides: []});
	}

	var j = 0;
	while (j < 4000) {
		for(var i = 0; i < info.data.F; i++) {
			findClosest(i);
		}
		console.log(j++);
	}

	//console.log(vehs);
	printToFile("e.txt");
}

main();