import { type IPaginationBody } from "@common/schemas/paginateRoute";
import debounce from "lodash.debounce";

type IUsePagination<T> = {
  url: string;
  initialBody?: IPaginationBody<T>;
};

export const usePagination = async <T extends any>({
  url,
  initialBody,
}: IUsePagination<T>) => {
  const router = useRouter();
  const route = useRoute();

  const paginationBody = ref<IPaginationBody<T>>({
    limit: 10,
    page: 1,
    ...(initialBody || {}),
  }) as Ref<IPaginationBody<T>>;

  const {
    data: paginationResult,
    error,
    status,
    refresh,
  } = await usePaginateApi<T>({
    bodyRef: paginationBody,
    url: url,
    immediate: true,
  });

  const debouncedRefresh = debounce((newValue: IPaginationBody<T>) => {
    console.log("❗ newValue -->", newValue);
    refresh();
    router.push({
      query: {
        ...route.query,
        page: newValue.page || 1,
      },
    });
  }, 500);

  watch(
    paginationBody,
    (newValue) => {
      debouncedRefresh(newValue);
    },
    {
      deep: true,
    }
  );

  const isLoading = computed(() => {
    return status.value === "pending";
  });

  return {
    isLoading,
    paginationResult,
    error,
    status,
    refresh,
    paginationBody,
  };
};
