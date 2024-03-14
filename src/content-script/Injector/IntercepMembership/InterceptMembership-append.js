(function (XHR) {
    "use strict";

    var open = XHR.prototype.open;
    var send = XHR.prototype.send;
    window.jsonData = {};
    XHR.prototype.open = function (method, url, async, user, pass) {
        this._url = url;
        //console.log(this);


        if (url.includes("memberships?")) {
            let interval = setInterval(() => {
                let res = this.responseText;
                
                if (res) {
                    let result = JSON.parse(res).results;
                    if (result.length > 0) {
                        localStorage.setItem("memberships", JSON.stringify(result));
                        clearInterval(interval);
                    }
                }
            }, 100);
        }
        open.call(this, method, url, async, user, pass);
    };

    XHR.prototype.send = function (data) {
        var self = this;
        var oldOnReadyStateChange;
        var url = this._url;

        function onReadyStateChange() {
            if (self.readyState == 4 /* complete */) {
                /* This is where you can put code that you want to execute post-complete*/
                /* URL is kept in this._url */
            }

            if (oldOnReadyStateChange) {
                oldOnReadyStateChange();
            }
        }

        /* Set xhr.noIntercept to true to disable the interceptor for a particular call */
        if (!this.noIntercept) {
            if (this.addEventListener) {
                this.addEventListener("readystatechange", onReadyStateChange, false);
            } else {
                oldOnReadyStateChange = this.onreadystatechange;
                this.onreadystatechange = onReadyStateChange;
            }
        }

        send.call(this, data);
    }
})(XMLHttpRequest);