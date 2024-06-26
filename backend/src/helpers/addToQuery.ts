export const addToQuery = ({
  url,
  obj,
}: {
  obj: Record<string, any>;
  url: string;
}) => {
  let finalUrl = url;
  finalUrl += "?";

  let hasAddFirst = false;
  let hasAddAnd = false;

  const check = () => {
    if (!hasAddAnd && hasAddFirst) finalUrl += "&";
    hasAddFirst = true;
  };

  for (const key in obj) {
    const value = obj[key];
    if (value !== undefined && typeof value !== "object") {
      check();
      finalUrl += `${key}=${value}`;
    }
    if (Array.isArray(value)) {
      for (const v of value) {
        check();
        finalUrl += `${key}=${v}`;
      }
    }
    if (value && value instanceof Object) {
      for (const k in value) {
        check();
        finalUrl += `${key}.${k}=${value[k]}`;
      }
    }
  }
  return finalUrl;
};
