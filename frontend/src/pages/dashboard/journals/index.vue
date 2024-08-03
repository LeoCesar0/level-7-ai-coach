<script setup lang="ts">
import type { ColumnDef } from "@tanstack/vue-table";
import { h } from "vue";
import { formatDate } from "@helpers/formatDate";
import { ROUTE } from "@static/routes";
import Dropdown from "@/components/Dropdown/index.vue";
import { type IDropdownItem } from "../../../@schemas/dropdown";
import { makeDeleteToastOptions } from "~/helpers/fetch/toastOptions";
import { PERMISSION } from "@common/static/permissions";
import { verifyRoutePermission } from "@common/helpers/verifyRoutePermission";
import { API_ROUTE } from "@common/static/routes";
import type { IJournal } from "@common/schemas/journal/journal";

const userStore = useUserStore();
const { currentUser } = storeToRefs(userStore);

const apiRoute = API_ROUTE.journals;

// --------------------------
// PAGINATION FETCH
// --------------------------

const { paginationBody, paginationResult, isLoading, refresh } =
  await usePagination<IJournal>({
    url: apiRoute.paginate.url,
  });
// --------------------------

const { fetchApi } = useFetchApi();

const handleDeleteItem = async (id: string) => {
  await fetchApi({
    url: apiRoute.delete.url(id),
    method: "DELETE",
    toastOptions: makeDeleteToastOptions({ label: "Journal" }),
  });
  await refresh();
};

const { openDialog } = useAlertDialog();

const getDropdownItems = (item: IJournal): IDropdownItem[] => {
  const handleDeleteDialog = () => {
    openDialog({
      title: "Delete " + item.title,
      message:
        "This action cannot be undone. Are you sure you want to delete this journal?",
      confirm: {
        label: "Delete",
        variant: "danger",
        action: async () => {
          handleDeleteItem(item._id);
        },
      },
    });
  };
  const canDelete = verifyRoutePermission({
    item,
    routePermissions: PERMISSION.journals,
    user: currentUser.value,
    action: "delete",
  });
  const canEdit = verifyRoutePermission({
    item,
    routePermissions: PERMISSION.journals,
    user: currentUser.value,
    action: "update",
  });

  const items: IDropdownItem[] = [
    {
      label: "Edit",
      action: () => {
        navigateTo(ROUTE.editJournal.href + `/${item._id}`);
      },
      disabled: !canEdit,
    },
    {
      label: "Delete",
      action: () => {
        handleDeleteDialog();
      },
      variant: "danger",
      disabled: !canDelete,
    },
  ];

  return items;
};

const columns: ColumnDef<IJournal>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => row.getValue("name"),
  },
  {
    accessorKey: "createdAt",
    header: "Created at",
    cell: ({ row }) =>
      formatDate(row.getValue<Date>("createdAt"), { time: true }),
  },

  {
    accessorKey: "updatedAt",
    header: "Updated at",
    cell: ({ row }) =>
      formatDate(row.getValue<Date>("updatedAt"), { time: true }),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const values = row.original;
      const items = getDropdownItems(values);
      return h(
        "div",
        { class: "relative" },
        h(Dropdown, {
          items,
          trigger: "dots",
        })
      );
    },
  },
];
</script>

<template>
  <NuxtLayout name="dashboard-layout">
    <DashboardSection title="Journals">
      <template v-slot:actions-right>
        <NuxtLink :to="ROUTE.createJournal.href">
          <UiButton>New Journal</UiButton>
        </NuxtLink>
      </template>
      <Table
        :columns="columns"
        :isLoading="isLoading"
        :paginationBody="paginationBody"
        :paginationResult="paginationResult?.data"
      />
    </DashboardSection>
  </NuxtLayout>
</template>
