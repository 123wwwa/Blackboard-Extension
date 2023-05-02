(function (XHR) {
    "use strict";
    var open = XHR.prototype.open;
    XHR.prototype.open = function (method, url, async, user, pass) {
        this._url = url;

        console.log(url);
        if (url.includes("requestType=studenthomedata")) {
            let interval = setInterval(() => {
                let res = this.responseText;

                if (res) {
                    clearInterval(interval);
                    let data = JSON.parse(res);
                    console.log(data);
                }
            }, 100);
        }
        open.call(this, method, url, async, user, pass);
    };



})(XMLHttpRequest);