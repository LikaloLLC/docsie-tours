import Config from "../config.json";
const ABSOLUTE_URL = /(^\/\/|^http)/;

export class URI {
  static Clean(url = "") {
    return url.replace(/([^:]\/|^\/)\/+/g, "$1");
  }
  static IsURL(url = "") {
    return ABSOLUTE_URL.test(url);
  }
  constructor(url, params = {}) {
    let _groups = url.split("/");
    let _params = _groups
      .filter((name) => /^:/.test(name))
      .map((name) => name.substring(1))
      .reduce((o, key) => {
        o[key] = "";
        return o;
      }, {});
    this._url = url;
    this._base = Config.urls.base;
    this._absolute = this.isAbsolute || ABSOLUTE_URL.test(url);
    this.params = Object.assign({}, _params, params);
  }
  get length() {
    return Object.keys(this.params).length;
  }
  get base() {
    return this._base;
  }
  set base(url) {
    this._base = url;
  }
  get url() {
    const { params } = this;
    var url = this._url;
    Object.keys(params).forEach((key) => {
      let regExp = new RegExp(`:${key}`, "g");
      url = url.replace(regExp, params[key]);
    });
    return this._absolute ? URI.Clean(url) : URI.Clean(this._base + url);
  }
  get isAbsolute() {
    return this._absolute;
  }
  set absolute(status) {
    this._absolute = status;
  }
  toString() {
    return this.url;
  }
}
