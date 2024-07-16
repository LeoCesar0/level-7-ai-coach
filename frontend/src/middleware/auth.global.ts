export default defineNuxtRouteMiddleware(async (to, from) => {
  if (typeof window === "undefined") {
    // --------------------------
    // SERVER SIDE
    // --------------------------
    console.log("❗❗❗ Here SERVER SIDE");

    const token = useAuthToken();

    console.log("❗ server side token -->", !!token);

    const userStore = useUser();
    const { currentUser } = storeToRefs(userStore);
    const { fetchCurrentUser } = userStore;
    // console.log("❗ SERVER currentUser -->", currentUser.value);
    // console.log("❗ SERVER resCurrentUser -->", resCurrentUser);

    // const resCurrentUser = await fetchCurrentUser();

    const { data, error } = await useFetch(
      // "http://localhost:8000/api/auth/me",
      "http://localhost:8000/api/playground",
      {
        headers: {
          Authorization: "Bearer " + token.value,
        },
      }
    );
    console.log("❗ data.value -->", data.value);
    console.log("❗ error.value -->", error.value);
    // console.log("❗ SERVER currentUser -->", currentUser.value);
    // console.log("❗ SERVER resCurrentUser -->", resCurrentUser);
    console.log("------------");

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
