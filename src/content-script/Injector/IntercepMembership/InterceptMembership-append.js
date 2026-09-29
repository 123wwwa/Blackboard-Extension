(function (XHR) {
    "use strict";

    function storeMemberships(result) {
        if (!result || !result.length) return false;
        localStorage.setItem("memberships", JSON.stringify(result));
        window.postMessage({ source: "bb-extension", type: "memberships-updated" }, "*");
        return true;
    }

    var originalFetch = window.fetch;
    if (originalFetch) {
        window.fetch = function () {
            var args = arguments;
            var input = args[0];
            var urlStr = typeof input === "string" ? input : (input && input.url) || "";
            var promise = originalFetch.apply(this, args);
            if (urlStr.indexOf("memberships?") !== -1) {
                promise.then(function (response) {
                    return response.clone().json();
                }).then(function (data) {
                    storeMemberships(data && data.results);
                }).catch(function () {});
            }
            return promise;
        };
    }

    var open = XHR.prototype.open;
    var send = XHR.prototype.send;
    window.jsonData = {};
    XHR.prototype.open = function (method, url, async, user, pass) {
        this._url = url;
        //console.log(this);


        if (typeof url === "string" && url.includes("memberships?")) {
            let interval = setInterval(() => {
                if (this.readyState === 4) {
                    clearInterval(interval);
                }
                let res = this.responseText;
                if (!res) return;
                try {
                    let result = JSON.parse(res).results;
                    if (storeMemberships(result)) {
                        clearInterval(interval);
                    }
                } catch (e) {
                    // response is not ready or not JSON yet
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