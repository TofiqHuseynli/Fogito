export const serializeQuery = (params, prefix) => {
  const query = Object.keys(params).map((key) => {
    const value = params[key];

    if (params.constructor === Array) {
      key = `${prefix}[]`;
    } else if (params.constructor === Object) {
      key = prefix ? `${prefix}[${key}]` : key;
    }
    if (typeof value === "object") {
      return serializeQuery(value, key);
    } else {
      return `${key}=${encodeURIComponent(value)}`;
    }
  });
  return [].concat.apply([], query).join("&");
};

export function genUuid() {
  var chars = "0123456789abcdef".split("");

  var uuid = [],
    rnd = Math.random,
    r;
  uuid[8] = uuid[13] = uuid[18] = uuid[23] = "-";
  uuid[14] = "4"; // version 4

  for (var i = 0; i < 36; i++) {
    if (!uuid[i]) {
      r = 0 | (rnd() * 16);

      uuid[i] = chars[i == 19 ? (r & 0x3) | 0x8 : r & 0xf];
    }
  }

  return uuid.join("");
}

export const inArray = (id, array) => {
  return array.find((key) => key === id) ? true : false;
};

export const is = (target, selector) => {
  return selector === target || target.contains(selector);
};

export const getTimeBySeconds = () => Math.floor(new Date().getTime() / 1000);

export const isEqual = (first_array = [], second_array = []) => {
  let result = true;
  if (first_array.length && second_array.length) {
    if (first_array.length === second_array.length) {
      first_array.map((item, key) => {
        if (item !== second_array[key]) {
          result = false;
        }
      });
    } else {
      result = false;
    }
  } else {
    result = false;
  }
  return result;
};
