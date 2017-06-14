/// <reference path="../types.ts" />

interface Coords {
    x: number;
    y: number;
}

class Marker {
    private oldHolderEle: HTMLElement | null;
    constructor() {
        window.addEventListener("mouseup", evt => {
            const word = this.getSelectedWord();
            if (word) {
                this.sendLookUpRequest(word)
                    .then((res) => {
                        // TODO：错误怎么处理呀？？完全是在瞎写
                        if (!("err" in res)) {
                            this.showDfn(res, {
                                x: evt.clientX,
                                y: evt.clientY,
                            });
                        }
                    }).catch(reason => {
                        console.log(reason);
                    });
            }
        });
        window.addEventListener("mousedown", () => {
            if (this.oldHolderEle) {
                this.oldHolderEle.parentNode!.removeChild(this.oldHolderEle);
                this.oldHolderEle = null;
            }
        });
    }

    private getSelectedWord(): string | undefined {
        const str = getSelection().toString().trim();
        if (str.search(/^\w+$/) === -1) {
            return;
        }
        return str;
    }

    private sendLookUpRequest(word: string): Promise<DictRes | DictErr> {
        return chrome.runtime.sendMessage({
            word: word,
        }).catch((reason) => {
            console.log(`err on sendMessage: ${reason}`);
        });
    }

    private showDfn(res: DictRes, coords: Coords) {
        if (this.oldHolderEle) {
            this.oldHolderEle.parentNode!.removeChild(this.oldHolderEle);
        }
        const frag = document.createDocumentFragment();
        const wrapEle = document.createElement("div");
        wrapEle.className = "zici";

        const titleEle = document.createElement("p");
        titleEle.className = "zici-title";
        const wordEle = document.createElement("span");
        wordEle.className = "zici-title-word";
        wordEle.textContent = res.word!;
        titleEle.appendChild(wordEle);
        if (res.pronunciation) {
            const symbol = res.pronunciation.AmE || res.pronunciation.BrE || res.pronunciation.DftE;
            if (symbol) {
                const symbolELe = document.createElement("span");
                symbolELe.className = "zici-title-symbol";
                symbolELe.textContent = symbol;
                titleEle.appendChild(symbolELe);
            }
        }
        wrapEle.appendChild(titleEle);

        const dfnListEle = document.createElement("ul");
        for (const dfn of res.defs!) {
            const dfnELe = document.createElement("li");
            if (dfn.pos) {
                const dfnPosEle = document.createElement("span");
                dfnPosEle.className = "zici-dfn-pos";
                dfnPosEle.textContent = dfn.pos;
                dfnELe.appendChild(dfnPosEle);
            }
            const dfnDefEle = document.createElement("span");
            dfnDefEle.className = "zici-dfn-def";
            dfnDefEle.textContent = dfn.def;
            dfnELe.appendChild(dfnDefEle);
            dfnListEle.appendChild(dfnELe);
        }
        wrapEle.appendChild(dfnListEle);

        frag.appendChild(wrapEle);
        wrapEle.style.left = `${(coords.x - 15).toFixed()}px`;
        wrapEle.style.top = `${(coords.y + 10).toFixed()}px`;
        this.oldHolderEle = wrapEle;
        document.body.appendChild(frag);
    }
}

const marker = new Marker();
