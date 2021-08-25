export class Lang {
    static data = {
        lang: null,
        langs: [],
        lang_data: null,
    };

    static get(key) {
        if (this.data.lang_data?.[key]) {
            return this.data.lang_data[key];
        } else {
            console.warn(key);
            return key;
        }
    }
    static getLang() {
        return this.data?.lang;
    }
    static getLangs() {
        return this.data?.langs;
    }
    static getData() {
        return this.data;
    }
    static setData(data) {
        this.data = {
            ...this.data,
            ...data,
        };
    }
}