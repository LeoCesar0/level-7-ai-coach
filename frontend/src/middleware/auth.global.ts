import { compareRoute } from "~/helpers/compareRoute";
import { getCurrentRoute } from "~/helpers/routing/getCurrentRoute";
import { getCurrentRouteFromPath } from "~/helpers/routing/getCurrentRouteFromPath";
import { ROUTE, ROUTES_LIST } from "~/static/routes";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const toPath: string = to.path;
  const fromPath: string = from.path;

  const userStore = useUserStore();
  const { currentUser } = storeToRefs(userStore);
  const { handleFetchCurrentUser } = userStore;

  const authStore = useAuthToken();
  const { authToken } = storeToRefs(authStore);

  // --------------------------
  // HANDLE CURRENT USER
  // --------------------------
  if (!currentUser.value && authToken.value) {
    await handleFetchCurrentUser();
  }
  if (currentUser.value && !authToken.value) {
    currentUser.value = null;
  }
  // --------------------------

  // --------------------------
  // HANDLE ROUTING
  // --------------------------

  const currentPage = getCurrentRouteFromPath(toPath);

  const pagePermissions = currentPage?.permissions;

  if (
    toPath !== ROUTE.dashboard.href &&
    toPath === ROUTE["sign-in"].href &&
    currentUser.value
  ) {
    // --------------------------
    // HAS SIGNED IN, REDIRECT TO DASHBOARD
    // --------------------------

    return navigateTo(ROUTE.dashboard.href);
  }

  if (
    toPath !== ROUTE["sign-in"].href &&
    pagePermissions &&
    !currentUser.value
  ) {
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

  if (
    toPath !== ROUTE["athlete-form"].href &&
    pagePermissions &&
    currentUser.value &&
    currentUser.value.role === "user" &&
    !currentUser.value.athleteInfo
  ) {
    // --------------------------
    // ATHLETE SHOULD COMPLETE FORM
    // --------------------------
    return navigateTo(ROUTE["athlete-form"].href);
  }
});
