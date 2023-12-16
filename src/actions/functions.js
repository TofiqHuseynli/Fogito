import { config } from "@config";

export const getFilterToLocal = (name, target, filter = "") => {
  let url =
    JSON.parse(localStorage.getItem(`${config.appName}-${config.appID}`))?.find(
      (x) => x.name === name
    )?.url || "";
  if (target) {
    return new URLSearchParams(url).get(target) || false;
  } else {
    const _params = new URLSearchParams(url);
    _params.delete(filter);
    return _params.toString();
  }
};

export const historyPushByName = (
    obj = {},
    name,
    frame = config.appName,
    appID = config.appID
  ) => {
    const paramsUrl = new URLSearchParams(
      JSON.parse(localStorage.getItem(`${frame}-${appID}`))?.find(
        (x) => x.name === name
      )?.url || ""
    );
    let urlss = (function () {
      let urls = [];
      paramsUrl.forEach((value, label) => {
        urls.push({ label, value });
      });
      return urls;
    })();
    if (obj?.value?.length) {
      if (urlss.find((url) => url.label === obj?.label)) {
        urlss.map((url) => {
          if (url.label === obj?.label) {
            url.value = obj?.value;
          }
          return url;
        });
      } else {
        urlss.push(obj);
      }
    } else {
      urlss = urlss.filter((url) => url.label !== obj?.label);
    }
    let newArr = [];
    for (let i in urlss) {
      let row = urlss[i];
      if (i === "0") {
        newArr.push(`?${row.label}=${row.value}`);
      } else {
        newArr.push(`&${row.label}=${row.value}`);
      }
    }
    const url =
      !!newArr?.length &&
      newArr?.reduce(
        (previousValue, currentValue) => previousValue + currentValue
      );
    let localUrl = JSON.parse(localStorage.getItem(`${frame}-${appID}`)) || [];
    if (localUrl.find((x) => x.name === name)) {
      localUrl.map((x) => {
        if (x.name === name) {
          x.url = url;
        }
        return x;
      });
    } else {
      localUrl = localUrl.concat([{ name, url }]);
    }
    localStorage.setItem(`${frame}-${appID}`, JSON.stringify(localUrl));
  };
  

  
export const onFilterStorageBySection = (
  name,
  frame = config.appName,
  appID = config.appID
) => {
  let section = JSON.parse(
    localStorage.getItem(`${config.appName}-${config.appID}`)
  );
  section.find((x) => x.name === name).url = "";
  localStorage.setItem(`${frame}-${appID}`, JSON.stringify(section));
};