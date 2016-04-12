var noble = require('noble');
var KalmanFilter = require('kalmanjs').default;

var kalmanFilter = new KalmanFilter({R: 0.01, Q: 20});

//hard coded value.
var data = {
    avg: 0,
    qualcomm: {
        uui: "f7826da64fa24e988024bc5b71e0893ee5022aef",
	txPower: -70
    },
    kontakt: {
	uui: "f7826da64fa24e988024bc5b71e0893e6a48cc32",
	txPower: -81
   }
};

noble.on('discover', function(peripheral){ 
    if (typeof peripheral.advertisement.manufacturerData != "undefined") {
        var uui = peripheral.advertisement.manufacturerData.toString('hex').substring(8, 48);
        if (uui == data.kontakt.uui) {
            var d = calculateDistance(peripheral.rssi, data.kontakt.txPower);
            console.log('RSSI + filter: ' + kalmanFilter.filter(peripheral.rssi) + ' RSSI: ' + peripheral.rssi);
        }
	if (uui == data.qualcomm.uui) {
	    var d = calculateDistance(peripheral.rssi, data.qualcomm.txPower);
            //console.log('Distance Qualcomm: ' + d + ' RSSI: ' + peripheral.rssi);
	}
    }
});

function calculateDistance(rssi, txPower) {
    if (rssi == 0) {
        return -1.0;
    }
    var ratio = rssi * 1.0 / txPower;
    if (ratio < 1.0) {
        return Math.pow(ratio, 10);
    } else {
        var distance = (0.89976) * Math.pow(ratio, 7.7095) + 0.111;
        return distance;
    }
};

/*
function approxRollingAverage(input) {
    data.avg -= data.avg/10;
    data.avg += input/10;
};
*/

noble.on('stateChange', function(state) {
    if (state === 'poweredOn') {
        //any service UUID, ALLOW duplicates
        noble.startScanning([], true);
    } else {
        noble.stopScanning();
    }
});
