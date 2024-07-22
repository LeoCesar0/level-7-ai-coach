export const parsePath = ({ url }: { url: string }) => {
  let res = url;
  if (!res.startsWith("/")) {
    res = "/" + res;
  }
  res = res.replaceAll("//", "/");

  return res;
};
