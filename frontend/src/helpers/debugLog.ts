export const debugLog = (name: string, variable: any) => {
  const serverSide = typeof window === "undefined";

  console.log(`❗${serverSide ? "server" : "client"} ${name} -->`, variable);
};
