import { makeStoreKey } from "~/helpers/makeStoreKey";

export const useDashboardStore = defineStore(makeStoreKey("dashboard"), () => {
  const menuIsOpen = ref(true);

  return {
    menuIsOpen,
  };
});
