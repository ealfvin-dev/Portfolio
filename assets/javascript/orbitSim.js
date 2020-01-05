var runOrbit;

var thrust = 1;
var ra;
var rb;

function orbitSimulation(){
    try {
        window.clearInterval(runOrbit);
    }
    catch(TypeError) {
        //pass
    }
    finally {
        //pass
    }

    document.getElementById("HoursMobile").innerHTML = "Elapsed Time = 0 Hours";
    document.getElementById("AltMaxMobile").innerHTML = "Max Altitude = 0 km";
    document.getElementById("AltMinMobile").innerHTML = "Min Altitude = 0 km";

    document.getElementById("Hours").innerHTML = "Elapsed Time = 0 Hours";
    document.getElementById("AltMax").innerHTML = "Max Altitude = 0 km";
    document.getElementById("AltMin").innerHTML = "Min Altitude = 0 km";

    const earth = document.getElementById("Earth");
    const sat = document.getElementById("Sat");

    const rInitial = document.getElementById("Height").value * 1000 + 6.378 * Math.pow(10, 6); //m
    const vInitial = document.getElementById("VInitial").value * 1000; //m/s

    const boxWidthMeters = rInitial * 4;

    //Set constant position of earth(p1):
    const p1 = [2 * rInitial, 2 * rInitial];

    //Initialize position of satilite in meters relative to top left corner of box:
    var satPos = [3 * rInitial, 2 * rInitial];

    var rhat = [-1.0, 0.0];

    //Set size of earth relative to initial separation:

    const radiusEarth = 6.378 * Math.pow(10, 6) * (25 / rInitial);  //in percent of div box

    document.getElementById("Earth").style.height = 2 * radiusEarth + "%";
    document.getElementById("Earth").style.width = 2 * radiusEarth + "%";

    earth.style.left = (p1[0] / boxWidthMeters) * 100 - radiusEarth + "%";
    earth.style.top = (p1[1] / boxWidthMeters) * 100 - radiusEarth + "%";
    sat.style.left = (satPos[0] / boxWidthMeters) * 100 - 0.75 + "%";
    sat.style.top = (satPos[1] / boxWidthMeters) * 100 - 0.75 + "%";

    //Initialize satilite velocity vector:
    var vSat = [0.0, -1 * vInitial];

    var xDir = -1;
    var yDir = 1;

    var r;
    ra = rInitial;
    rb = rInitial;

    var theta;
    var accSat;

    var iter = 0;

    var c = 0.5;

    runOrbit = setInterval(run, 0.1);
    
    function run() {
        r = Math.sqrt(Math.pow(p1[0] - satPos[0], 2) + Math.pow(p1[1] - satPos[1], 2));

        if (r > ra) {
            ra = r;
        }

        if (r < rb) {
            rb = r;
        }

        document.getElementById("AltMaxMobile").innerHTML = "Max Altitude = " + ((ra - 6.378 * Math.pow(10, 6))/1000).toFixed(0) + " km";
        document.getElementById("AltMinMobile").innerHTML = "Min Altitude = " + ((rb - 6.378 * Math.pow(10, 6))/1000).toFixed(0) + " km";
        document.getElementById("AltMax").innerHTML = "Max Altitude = " + ((ra - 6.378 * Math.pow(10, 6))/1000).toFixed(0) + " km";
        document.getElementById("AltMin").innerHTML = "Min Altitude = " + ((rb - 6.378 * Math.pow(10, 6))/1000).toFixed(0) + " km";

        //Find new rhat vector (unit vector that points from Sat to Earth):
        if (p1[0] < satPos[0] && xDir != -1){
            xDir = -1;
        }
        else if (p1[0] > satPos[0] && xDir != 1) {
            xDir = 1;
        }

        if (p1[1] < satPos[1] && yDir != -1) {
            yDir = -1;
        }
        else if (p1[1] > satPos[1] && yDir != 1) {
            yDir = 1;
        }

        if (p1[1] != satPos[1]) {
            theta = Math.atan(Math.abs((p1[0] - satPos[0]) / (p1[1] - satPos[1])));
            rhat[0] = Math.sin(theta) * xDir;
            rhat[1] = Math.cos(theta) * yDir;
        }
        else {
            rhat[0] = 1 * xDir;
            rhat[1] = 0;
        }

        //Calculate new velocity of Satilite ten seconds later:
        accSat = 398589405759999.94 / Math.pow(r, 2); //a = GM/r^2 - assumes earth mass of 5.9722E24 kg
        vSat[0] = (vSat[0] + 10 * accSat * c * rhat[0]) * thrust;
        vSat[1] = (vSat[1] + 10 * accSat * c * rhat[1]) * thrust;

        //Calculate new position of satilite:
        satPos[0] = satPos[0] + 10 * vSat[0];
        satPos[1] = satPos[1] + 10 * vSat[1];

        sat.style.left = (satPos[0] / boxWidthMeters) * 100 - 0.75 + "%";
        sat.style.top = (satPos[1] / boxWidthMeters) * 100 - 0.75 + "%";

        if (thrust != 1) {
            thrust = 1;

            r = Math.sqrt(Math.pow(p1[0] - satPos[0], 2) + Math.pow(p1[1] - satPos[1], 2));
            ra = r;
            rb = r;
        }

        if (c === 0.5) {
            c = 1;
        }

        iter++;

        if (iter % 360 === 0) {
            document.getElementById("HoursMobile").innerHTML = "Elapsed Time = " + iter / 360 + " Hours";
            document.getElementById("Hours").innerHTML = "Elapsed Time = " + iter / 360 + " Hours";
        }

        if (r < 6.378 * Math.pow(10, 6)) {
            window.clearInterval(runOrbit);
            alert("Satellite crashed!");
        }
    }
}

function thrustUp() {
    thrust = 1.05;
}

function thrustDown() {
    thrust = 0.95;
}

function stopSimulation() {
    window.clearInterval(runOrbit);
}