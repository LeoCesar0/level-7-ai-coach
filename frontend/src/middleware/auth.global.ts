import { compareRoute } from "~/helpers/compareRoute";
import { ROUTE, ROUTES_LIST } from "~/static/routes";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const toPath: string = to.path;

  const userStore = useUser();
  const { currentUser } = storeToRefs(userStore);
  const { handleFetchCurrentUser } = userStore;
  const authToken = useAuthToken();

  // const { firebaseAuth } = useFirebase();
  // await firebaseAuth.authStateReady();

  // --------------------------
  // HANDLE CURRENT USER
  // --------------------------
  if (!currentUser.value && authToken.value) {
    await handleFetchCurrentUser(authToken.value);
  }
  if (currentUser.value && !authToken.value) {
    currentUser.value = null;
  }
  // --------------------------

  // --------------------------
  // HANDLE ROUTING
  // --------------------------

  const currentPage = ROUTES_LIST.find((page) =>
    compareRoute(page.href, toPath, {
      ignoreQuery: true,
      rootOnly: true,
    })
  );

  const pagePermissions = currentPage?.permissions;

  if (currentPage?.href === ROUTE["sign-in"].href && currentUser.value) {
    // --------------------------
    // HAS SIGNED IN, REDIRECT TO DASHBOARD
    // --------------------------
    return navigateTo("/dashboard");
  }

  if (pagePermissions && !currentUser.value) {
    // --------------------------
    // ROUTE IS PROTECTED, USER IS NOT AUTHENTICATED
    // --------------------------
    return navigateTo(ROUTE["sign-in"].href);
  }

  if (pagePermissions && currentUser.value && pagePermissions.length > 0) {
    // PAGE IS PROTECTED, ONLY SPECIFIED ROLES CAN ACCESS
    const userCanAccess = pagePermissions.includes(currentUser.value.role);

    if (!userCanAccess) {
      return abortNavigation();
    }
  }
});
