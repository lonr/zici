///<reference path="../types.ts"/>

declare function MD5(str: string): string;

interface Basic {
    "phonetic": string;
    "uk-phonetic": string;
    "us-phonetic": string;
    "explains": string[];
}

interface Web {
    "key": string;
    "value": string[];
}

// response json
interface YoudaoRes {
    "errorCode": string;
    "query": string;
    "speakUrl"?: string;
    "tSpeakUrl"?: string;
    "translation": string[];
    "basic"?: Basic;
    "web"?: Web[];
}

class Youdao implements Dict {
    baseURL = "https://openapi.youdao.com/api";
    constructor(private appKey: string, private secret: string) {
    }

    lookUp(word: string, from = "EN", to = "zh-CHS") {
        return this.makeRequest(this.createURL(word, from, to));
    }

    private createURL(word: string, from: string, to: string) {
        const salt = Date.now().toString();
        const params: { [key: string]: string } = {
            q: word,
            from: from,
            to: to,
            appKey: this.appKey,
            salt: salt,
            sign: MD5(this.appKey + word + salt + this.secret),
        };
        const url = new URL(this.baseURL);
        Object.entries(params).forEach(([key, value]) => url.searchParams.append(key, value));
        // url.searchParams = new URLSearchParams(Object.entries(params));
        return url;
    }

    private makeRequest(url: URL) {
        return fetch(encodeURI(url.toString()))
            .then(res => res.json())
            .then((data: YoudaoRes) => {
                // api err
                if (data.errorCode !== "0") {
                    return {
                        err: data.errorCode,
                    };
                }
                return this.transformResponse(data);
            }).catch((err: Error) => {
                // err on fetching
                return {
                    err: err.toString(),
                };
            });
    }

    private transformResponse(json: YoudaoRes): DictRes | DictErr {
        // if translation is empty
        if (!json.basic) {
            return {
                err: "empty res",
            };
        } else {
            // TODO: use josnpath instead
            const temp: DictRes = {
                word: json.query,
                defs: [],
                sams: [],
            };
            temp.pronunciation = {};
            temp.pronunciation.DftEmp3 = json.tSpeakUrl;
            temp.pronunciation.DftE = json.basic["phonetic"];
            temp.pronunciation.AmE = json.basic["uk-phonetic"];
            temp.pronunciation.BrE = json.basic["us-phonetic"];
            temp.defs = json.basic.explains.map(value => {
                const matches = value.trim().match(/^([a-z]+\.)?\s*(.*)/);
                const def: { pos?: string; def: string } = { def: "" };
                if (matches && matches[1]) {
                    def.pos = matches[1];
                }
                def.def = matches![2];
                return def;
            });
            return temp;
        }
    }
}