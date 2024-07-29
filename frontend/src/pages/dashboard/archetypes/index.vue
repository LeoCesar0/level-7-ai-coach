<script setup lang="ts">
import type { ColumnDef } from "@tanstack/vue-table";
import { h } from "vue";
import TableActiveCell from "@/components/Table/ActiveCell.vue";
import { formatDate } from "@helpers/formatDate";
import { ROUTE } from "@static/routes";
import Dropdown from "@/components/Dropdown/index.vue";
import { type IDropdownItem } from "../../../@schemas/dropdown";
import { makeDeleteToastOptions } from "~/helpers/fetch/toastOptions";
import { PERMISSION } from "@common/static/permissions";
import { verifyMutatePermission } from "@common/helpers/verifyMutatePermission";
import { verifyRoutePermission } from "@common/helpers/verifyRoutePermission";
import { API_ROUTE } from "@common/static/routes";
import type { IArchetype } from "@common/schemas/archetype/archetype";

const userStore = useUserStore();
const { currentUser } = storeToRefs(userStore);

// --------------------------
// PAGINATION FETCH
// --------------------------

const { paginationBody, paginationResult, isLoading, refresh } =
  await usePagination<IArchetype>({
    url: API_ROUTE.archetypes.paginate.url,
  });
// --------------------------

const { fetchApi } = useFetchApi();

const handleDeleteItem = async (id: string) => {
  await fetchApi({
    url: API_ROUTE.archetypes.delete.url(id),
    method: "DELETE",
    toastOptions: makeDeleteToastOptions({ label: "Archetype" }),
  });
  await refresh();
};

const { openDialog } = useAlertDialog();

const getDropdownItems = (item: IArchetype): IDropdownItem[] => {
  const handleDeleteDialog = () => {
    openDialog({
      title: "Delete " + item.name,
      message:
        "This action cannot be undone. Are you sure you want to delete this archetype?",
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
    routePermissions: PERMISSION.archetypes,
    user: currentUser.value,
    action: "delete",
  });
  const canEdit = verifyRoutePermission({
    item,
    routePermissions: PERMISSION.archetypes,
    user: currentUser.value,
    action: "update",
  });

  const items: IDropdownItem[] = [
    {
      label: "Edit",
      action: () => {
        navigateTo(ROUTE.editArchetype.href + `/${item._id}`);
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

const columns: ColumnDef<IArchetype>[] = [
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
    <DashboardSection title="Archetypes">
      <template v-slot:actions-right>
        <NuxtLink :to="ROUTE.createArchetype.href">
          <UiButton>New Archetype</UiButton>
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
