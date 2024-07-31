import { type IPaginationBody } from "@common/schemas/pagination";
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

  const searchOldValue = ref<typeof paginationBody.value.searchQuery>(
    paginationBody.value.searchQuery ?? ""
  );

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

  // --------------------------
  // REFRESH VALUES
  // --------------------------s
  const handleRefresh = (newValue: IPaginationBody<T>) => {
    refresh();
    router.push({
      query: {
        ...route.query,
        page: newValue.page || 1,
      },
    });
  };
  const debouncedRefresh = debounce((newValue: IPaginationBody<T>) => {
    handleRefresh(newValue);
  }, 500);

  watch(
    paginationBody,
    (newValue) => {
      if (newValue.searchQuery !== searchOldValue.value) {
        debouncedRefresh(newValue);
        searchOldValue.value = newValue.searchQuery;
      } else {
        handleRefresh(newValue);
      }
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
