<script setup lang="ts">
import type { IAssessment } from "@common/schemas/assessment/assessment";
import type { IPaginationBody } from "@common/schemas/pagination";
import type { IUserFull } from "@common/schemas/user/user";
import { API_ROUTE } from "@common/static/routes";
import { ROUTE } from "@static/routes";
import { getSingleParams } from "~/helpers/getSingleParams";
import { LineChart, type BaseChartProps } from "@/components/ui/chart-line";
import {
  zAssessmentSection,
  type IAssessmentKey,
  type IAssessmentSection,
} from "@common/schemas/assessment/enums";
import { beautifyObjectName } from "~/components/ui/auto-form/utils";
import { formatDate } from "~/helpers/formatDate";
import { parseToDate } from "@common/helpers/parseToDate";
import { format } from "date-fns";

const userStore = useUserStore();
const { currentUser } = storeToRefs(userStore);

const { fetchApi } = useFetchApi();

const id = getSingleParams("id");
const isLoading = ref(false);

const { data: userRes } = await useGetApi<IUserFull>({
  url: API_ROUTE.users.get.url(id),
  loadingRefs: [isLoading],
});
const user = computed(() => userRes.value?.data);

const key = ref<IAssessmentKey>("moodAndMindsetRating");

const sectionOptions = zAssessmentSection.options;
const selectedSection = ref<IAssessmentSection>(sectionOptions[0]);

// --------------------------
// FETCH
// --------------------------

const paginateAssessmentRef = computed<IPaginationBody<IAssessment>>(() => {
  return {
    filters: {
      user: user.value?._id,
      section: selectedSection.value,
    },
    sortBy: "date",
    sortOrder: "asc",
  };
});

const {
  data: paginationResult,
  error,
  status,
  refresh,
} = await usePaginateApi<IAssessment>({
  bodyRef: paginateAssessmentRef,
  url: API_ROUTE.assessments.paginate.url,
  immediate: true,
  noLimit: true,
});

const assessments = computed(() => {
  const list = paginationResult.value?.data?.list || [];

  return list.map((item) => {
    const date = parseToDate(item.date);
    const formattedDate = item.date ? format(date, "MM/dd") : "";
    return {
      date: formattedDate,
      score: item.value,
      key: `Topic: ${beautifyObjectName(item.key)}`,
      section: `Section: ${beautifyObjectName(item.section)}`,
      justification: `Justification: ${item.justification}`,
    };
  });
});

watch(paginateAssessmentRef, () => {
  refresh();
});

const yFormatter: BaseChartProps<any>["yFormatter"] = (tick, i) => {
  return tick.toString();
};
const xFormatter: BaseChartProps<any>["xFormatter"] = (tick, i, ticks) => {
  return assessments.value[tick as number]?.["date"] ?? "";
};
</script>

<template>
  <NuxtLayout name="dashboard-layout">
    <DashboardSection v-if="user" :title="`${user.name} assessments`">
      <template v-slot:actions-right>
        <NuxtLink :to="ROUTE.createOrganization.href">
          <UiButton>Something</UiButton>
        </NuxtLink>
      </template>
      <div>
        <div class="flex items-center flex-wrap gap-4">
          <UiButton
            v-for="option in sectionOptions"
            @click="
              () => {
                selectedSection = option;
              }
            "
            :variant="selectedSection === option ? 'secondary' : 'outline'"
            >{{ beautifyObjectName(option) }}</UiButton
          >
        </div>
        <LineChart
          :data="assessments"
          index="date"
          :categories="['score']"
          :y-formatter="yFormatter"
          :xFormatter="xFormatter"
        />
      </div>
      <!-- <div>
        {{ paginationResult?.data }} -->
      <!-- </div> -->
    </DashboardSection>
  </NuxtLayout>
</template>
