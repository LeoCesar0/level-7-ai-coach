export default defineNuxtRouteMiddleware(async (to, from) => {
  if (typeof window === "undefined") {
    // --------------------------
    // SERVER SIDE
    // --------------------------

    return;
  }
  console.log("❗❗❗ CLIENT SIDE SIDE ");

  // --------------------------
  // CLIENT SIDE
  // --------------------------

  const userStore = useUser();
  const { currentUser } = storeToRefs(userStore);
  const { fetchCurrentUser } = userStore;

  const resCurrentUser = await fetchCurrentUser();

  console.log("❗ CLIENT currentUser -->", currentUser.value);
  console.log("❗ CLIENT resCurrentUser -->", resCurrentUser);
  console.log("------------");

  // if (!currentUser.value && authToken.value) {
  //   const runtimeConfig = useRuntimeConfig();
  //   const apiBaseURL = runtimeConfig.app.apiBaseURL;
  //   const auth = new Auth({
  //     apiBaseURL: apiBaseURL,
  //     fetcher: commonFetcher,
  //     onUserChange: (user) => {
  //       currentUser.value = user;
  //     },
  //     token: authToken.value || undefined,
  //   });
  //   await auth.getAuthenticatedUser();
  // }

  // // --------------------------
  // // HANDLE ROUTING
  // // --------------------------
  // abortNavigation;
  // const toPath: string = to.path;

  // const currentPage = APP_PAGES.find((page) =>
  //   compareRoute(page.link, toPath, {
  //     ignoreQuery: true,
  //     rootOnly: true,
  //   })
  // );

  // if (currentPage?.link === APP_PAGE_LOGIN.link && currentUser.value) {
  //   return navigateTo("/");
  // }

  // if ((currentPage?.private || currentPage?.adminOnly) && !currentUser.value) {
  //   return navigateTo("/login");
  // }

  // if (currentPage?.adminOnly && currentUser.value?.role !== "admin") {
  //   return abortNavigation();
  // }
});
