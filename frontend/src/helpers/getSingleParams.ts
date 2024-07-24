export const getSingleParams = (key: string) => {
  const route = useRoute();
  const param = route.params[key];
  if (typeof param === "string") {
    return param ?? "";
  }
  return param[0] ?? "";
};
