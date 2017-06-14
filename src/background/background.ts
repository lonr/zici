/// <reference path="../dicts/bing.ts" />
/// <reference path="../dicts/youdao.ts" />

let bing = new Bing();
// youdao.lookUp("lonr").then((result) => {
//     console.log(result);
// });

// let bing = new Bing();

// bing.lookUp("lonr").then((result) => {
//     console.log(result);
// });

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    bing.lookUp(request.word).then(sendResponse).catch(console.log);
    return true;
});

