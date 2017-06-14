// https://zhuanlan.zhihu.com/p/22421123?refer=MSFaith
// trying to use undefined...may be wrong
// but how should I white these...
interface Pronunciation {
    // single phonetic and can't be classified
    DftE?: string;
    DftEmp3?: string;
    AmE?: string;
    AmEmp3?: string;
    BrE?: string;
    BrEmp3?: string;
}

interface Def {
    pos?: string;
    def: string;
}

interface Sam {
    eng: string;
    chn: string;
    mp3Url: string;
    mp4Url: string;
}

interface DictRes {
    word?: string;
    // 音标也在里面
    pronunciation?: Pronunciation;
    defs?: Def[];
    // 例句
    sams?: Sam[];
}

interface DictErr {
    err: string;
}

interface Dict {
    lookUp(word: string): Promise<DictRes | DictErr>;
}