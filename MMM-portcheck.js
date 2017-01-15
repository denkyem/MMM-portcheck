Module.register("MMM-portcheck",{
    defaults: {
        colored: false,
        display: 'both',
        hosts: [
		['www.github.com','443','GIT'],
		['magicmirror.builders','443','Magic Mirror']
	],
        updateInterval: 5,
        font: 'medium',
	alert: true,
	alertTime: 15,
	textAlign: 'right'
    },

    start: function() {
        Log.info("Starting module: " + this.name);
        this.status = {};
        this.checkHosts();
	setInterval(() => {
            this.checkHosts();
        }, this.config.updateInterval*60000);
    },

    checkHosts: function(){
        this.sendSocketNotification('CHECK_PORTS', this.config.hosts);
    },


    
    getDom: function() {
        var wrapper = document.createElement("div");
        wrapper.classList.add(this.config.font);
        wrapper.style.textAlign = this.config.textAlign;
        var hosts = Object.keys(this.status);
        if(hosts.length > 0){
            for(var i = 0; i < hosts.length; i++){
                var isOnline = this.status[hosts[i]];
                if(isOnline && (this.config.display === 'both' || this.config.display === 'online') ||
                    !isOnline && (this.config.display === 'both' || this.config.display === 'offline')){

                    var div = document.createElement("div");
                    var span = document.createElement("span");
                    span.innerHTML = isOnline ? '&#9899;' : '&#9898;';
                    if(this.config.colored){
                        span.style.color = isOnline ? 'green' : 'red';
                    }
                    var host = document.createElement("span");
                    host.innerHTML = hosts[i];
                    host.style.color = isOnline? '' : 'red';
                    div.appendChild(span);
                    div.appendChild(host);
                    wrapper.appendChild(div);
                }
            }
        }
        return wrapper;
    },


    socketNotificationReceived: function(notification, payload) {
        if (notification === 'PORTCHECKED') {
		this.status[payload.host[2]] = payload.status;
	        this.updateDom();
		if(!payload.status){
			Log.warn("Port Checker - " + payload.host[2]);
		}
		if(!payload.status && this.config.alert){
			this.sendNotification("SHOW_ALERT", {title: "<span class='fa fa-server'> PORT CHECK</span>", message: "<p><span style='text-transform: uppercase;'>"+payload.host[2]+"</span><span> - "+ payload.host[0] +":"+payload.host[1]+"</span>", timer: (this.config.alertTime*1000)});
		}
	}
    }
});
