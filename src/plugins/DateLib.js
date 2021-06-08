import { Lang } from "./";

export default class DateLib {
  static months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  static getShortMonth() {
    let translatedList = [];
    for (let value of DateLib.months) translatedList.push(Lang.getL(value));
    return translatedList;
  }

  static getWeeks() {
    return [
      { value: 1, title: Lang.getL("Monday") },
      { value: 2, title: Lang.getL("Tuesday") },
      { value: 3, title: Lang.getL("Wednesday") },
      { value: 4, title: Lang.getL("Thursday") },
      { value: 5, title: Lang.getL("Friday") },
      { value: 6, title: Lang.getL("Saturday") },
      { value: 7, title: Lang.getL("Sunday") },
    ];
  }

  static getMonths() {
    return [
      { value: 1, title: Lang.getL("January") },
      { value: 2, title: Lang.getL("February") },
      { value: 3, title: Lang.getL("March") },
      { value: 4, title: Lang.getL("April") },
      { value: 5, title: Lang.getL("May") },
      { value: 6, title: Lang.getL("June") },
      { value: 7, title: Lang.getL("July") },
      { value: 8, title: Lang.getL("August") },
      { value: 9, title: Lang.getL("September") },
      { value: 10, title: Lang.getL("October") },
      { value: 11, title: Lang.getL("November") },
      { value: 12, title: Lang.getL("December") },
    ];
  }

  static getWeek(id) {
    return DateLib.getWeeks()[id - 1];
  }

  static getMonth(id) {
    return DateLib.getMonths()[id - 1];
  }

  static getUnixtime() {
    let time = new Date().getTime();
    time = Math.floor(time / 1000);
    return time;
  }

  // Convert unixtime to date format
  static date(format = "Y-m-d H:i:s", unixtime = 0) {
    let date = new Date(unixtime * 1000);
    if (unixtime < 1) date = new Date();
    let d = date.getDate();
    if (d < 10) d = "0" + d;
    let m = date.getMonth() + 1; //January is 0!
    if (m < 10) m = "0" + m;
    let Y = date.getFullYear();
    let H = date.getHours();
    if (H < 10) H = "0" + H;
    let i = date.getMinutes();
    if (i < 10) i = "0" + i;
    let s = date.getSeconds();
    if (s < 10) s = "0" + s;

    let months = DateLib.getShortMonth();
    let replaceWith = [
      ["Y", Y],
      ["m", m],
      ["M", months[parseInt(m) - 1]],
      ["w", date.getDay()],
      ["W", 0],
      ["d", d],
      ["H", H],
      ["i", i],
      ["s", s],
    ];
    for (let key in replaceWith) {
      let [find, replace] = replaceWith[key];
      format = format.replace(find, replace);
    }
    return format;
  }

  static getWeekNumber(unixtime = 0) {
    let d = new Date(unixtime * 1000);
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    let yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    let W = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
    return W;
  }

  static getWeekDay(unixtime = 0) {
    let W = DateLib.date("w", unixtime);
    W = DateLib.getWeeks()[W].title;
    return W.toString();
  }

  static toTimestamp(strDate) {
    if (typeof strDate === "string") strDate = strDate.replace(/-/gi, "/");
    let datum = Date.parse(strDate);
    return datum / 1000;
  }

  // Calculate time elapse from current time
  static elapse(unixtime) {
    let time = new Date().getTime();
    time = Math.floor(time / 1000);
    let elapse = time - unixtime;
    if (elapse < 0) elapse = 0;

    let { d, h, m, s } = DateLib.parseElapse(elapse);

    return {
      d: d < 10 ? "0" + d : d,
      h: h < 10 ? "0" + h : h,
      m: m < 10 ? "0" + m : m,
      s: s < 10 ? "0" + s : s,
    };
  }

  static parseElapse(elapse) {
    let d = Math.floor(elapse / 86400);
    let h = Math.floor((elapse - d * 86400) / 3600);
    let m = Math.floor((elapse - d * 86400 - h * 3600) / 60);
    let s = elapse - d * 86400 - h * 3600 - m * 60;
    return { d, h, m, s };
  }

  static convertSeconds(elapse) {
    let txt = "";
    let { d, h, m, s } = DateLib.parseElapse(elapse);
    if (d > 0) txt += d + "d ";
    if (h > 0) txt += h + "h ";
    if (m > 0 && (h === 0 || d === 0)) txt += m + "m ";
    if (m === 0 && h === 0 && d === 0) txt += 0 + "";

    return txt;
  }
}
