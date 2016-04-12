var noble = require('noble');

noble.on('discover', function(peripheral) {
    if (typeof peripheral.advertisement.manufacturerData != "undefined") {
	console.log(peripheral);
        var uui = peripheral.advertisement.manufacturerData.toString('hex').substring(8, 48);
    }
});


noble.on('stateChange', function(state) {
    if (state === 'poweredOn') {
        noble.startScanning();
    } else {
        noble.stopScanning();
    }
});
