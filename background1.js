
// chrome.webRequest.onBeforeRequest.addListener(
//     function(details)
//     {
//         console.log(details);
//     },
//     {urls: ["https://mylab.pearson.com/Student*"]},
//     ["requestBody"]
// );
// chrome.webRequest.onCompleted.addListener(
//     function(details)
//     {
//         console.log(details);
//     },
//     {urls: ["https://mylab.pearson.com/Student*"]},
//     ["responseB"]
// );
// chrome.devtools.network.onRequestFinished.addListener(
//     function(request) {
//       if (request.response.bodySize > 1024) {
//         chrome.devtools.inspectedWindow.eval(
//             'console.log("Large image: " + unescape("' +
//             escape(request.request.url) + '"))');
//       }
//     }
//   );