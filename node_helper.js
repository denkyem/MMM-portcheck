const NodeHelper = require('node_helper');
const tcpp = require('tcp-ping');

module.exports = NodeHelper.create({
    socketNotificationReceived: function(notification, payload) {
        if (notification === 'CHECK_PORTS') {
		
            payload.forEach((host) => {

		tcpp.probe(host[0], host[1], (err, available) => {
                    this.sendSocketNotification('PORTCHECKED', {'host': host, 'status': available});
		    var current_time = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
		    console.log(current_time + " - Check host '" + host[2] + "' - status: '" + available + "'");
                });

            });
        }
    }

});