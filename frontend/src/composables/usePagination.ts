import { type IPaginationBody } from "@common/schemas/paginateRoute";

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

  const paginationBody = ref<IPaginationBody<T>>(
    initialBody || {
      limit: 10,
      page: 1,
    }
  ) as Ref<IPaginationBody<T>>;

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

  watch(
    paginationBody,
    (newValue) => {
      refresh();
      router.push({
        query: {
          ...route.query,
          page: newValue.page || 1,
        },
      });
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
    paginationBody,
  };
};
