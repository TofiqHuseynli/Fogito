export const useCookie = () => {
  const set = (key, value, exdays = 0) => {
    var date = new Date();
    date.setTime(date.getTime() + exdays * 24 * 60 * 60 * 1000);
    var expires = "expires=" + date.toUTCString();
    document.cookie = key + "=" + value + ";" + expires + ";path=/";
  };

  const get = (key) => {
    var name = key + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var result = decodedCookie.split(";");
    for (var i = 0; i < result.length; i++) {
      var c = result[i];
      while (c.charAt(0) === " ") {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  };

  const remove = (key) => {
    var date = new Date();
    date.setTime(date.getTime());
    var expires = "expires=" + date.toUTCString();
    document.cookie = key + "=;" + expires + ";path=/";
  };

  const clear = (key) => {
    var result = get(key);
    if (result !== "") {
      return true;
    } else {
      return false;
    }
  };

  return {
    set,
    get,
    remove,
    clear,
  };
};
