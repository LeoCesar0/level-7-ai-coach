export const getIsServerSide = () => {
  return typeof window === "undefined";
};
