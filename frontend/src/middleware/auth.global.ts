export default defineNuxtRouteMiddleware(async (to, from) => {
  const isServerSide = typeof window === "undefined";
  if (isServerSide) {
    // --------------------------
    // SERVER SIDE
    // --------------------------

    return;
  }

  // --------------------------
  // CLIENT SIDE
  // --------------------------
  console.log("❗❗❗ CLIENT SIDE SIDE ");

  const userStore = useUser();
  const { currentUser } = storeToRefs(userStore);
  const { handleFetchCurrentUser } = userStore;
  const authToken = useAuthToken();

  // --------------------------
  // HANDLE CURRENT USER
  // --------------------------
  if (!currentUser.value && authToken.value) {
    await handleFetchCurrentUser(authToken.value);
  }
  if (currentUser.value && !authToken.value) {
    currentUser.value = null;
  }

  // const resCurrentUser = await fetchCurrentUser();

  // console.log("❗ CLIENT resCurrentUser -->", resCurrentUser);
  console.log("❗ CLIENT currentUser -->", currentUser.value);
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
