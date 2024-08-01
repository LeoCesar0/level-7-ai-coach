import { ref, onMounted, onUnmounted } from "vue";
import { makeStoreKey } from "~/helpers/makeStoreKey";

export const useDarkModeStore = defineStore(
  makeStoreKey("dark-mode-store"),
  () => {
    const isDark = ref(false);

    const toggleDarkMode = () => {
      isDark.value = !isDark.value;
      localStorage.setItem(makeStoreKey("dark-mode"), isDark.value.toString());

      if (isDark.value) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    };

    onMounted(() => {
      const savedMode = localStorage.getItem(makeStoreKey("dark-mode"));
      if (savedMode === "true") {
        isDark.value = true;
        document.documentElement.classList.add("dark");
      }
    });

    return {
      isDark,
      toggleDarkMode,
    };
  }
);
