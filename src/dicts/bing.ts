///<reference path="../types.ts"/>

class Bing implements Dict {
    baseURL = "http://xtk.azurewebsites.net/BingDictService.aspx?Word=";

    lookUp(word: string) {
        // 暂时（？）不管例句
        return this.makeRequest(`${this.baseURL}${word}&Samples=false`);
    }

    private makeRequest(url: string): Promise<DictRes | DictErr> {
        return fetch(encodeURI(url))
            .then(res => res.text())
            .then(text => JSON.parse(text, (key, value) => {
                if (value !== null) {
                    return value;
                }
            }))
            .then((data: DictRes) => {
                if (!data.word || (data.defs![0].pos === "Web")) {
                    return { err: "empty res" } as DictErr;
                } else {
                    return data;
                }
            }).catch((reason) => {
                return { err: reason } as DictErr;
            });
    }
}