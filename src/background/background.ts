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

browser.runtime.onMessage.addListener(request => {
    return bing.lookUp(request.word).catch(console.log);
});

