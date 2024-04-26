import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
    matches: ["https://blackboard.unist.ac.kr/*"],
    run_at: "document_start",
    world: "MAIN"
}

let XHR = XMLHttpRequest;
var open = XHR.prototype.open;
var send = XHR.prototype.send;

// Adjust the type definitions for method parameters to make user and pass optional
XHR.prototype.open = function (method: string, url: string, async: boolean = true, user?: string, pass?: string): void {
    this._url = url;

    if (url.includes("memberships?")) {
        let interval = setInterval(() => {
            let res = this.responseText;

            if (res) {
                let result = JSON.parse(res).results;
                if (result && result.length > 0) {
                    localStorage.setItem("memberships", JSON.stringify(result));
                    clearInterval(interval);
                }
            }
        }, 100);
    }

    // Use arguments to pass all original arguments to maintain compatibility with the original function's signature
    open.apply(this, arguments as any);
};

XHR.prototype.send = function (data?: any): void {
    var self = this as XMLHttpRequest & { _url: string, noIntercept?: boolean, onreadystatechange?: (this: XMLHttpRequest, ev: Event) => any };
    var oldOnReadyStateChange;

    function onReadyStateChange() {
        if (self.readyState === 4 /* complete */) {
            // Post-complete code here
        }

        if (oldOnReadyStateChange) {
            oldOnReadyStateChange.call(self);
        }
    }

    if (!self.noIntercept) {
        if (self.addEventListener) {
            self.addEventListener("readystatechange", onReadyStateChange, false);
        } else {
            oldOnReadyStateChange = self.onreadystatechange;
            self.onreadystatechange = onReadyStateChange;
        }
    }

    send.call(self, data);
}