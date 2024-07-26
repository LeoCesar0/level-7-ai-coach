<script setup lang="ts">
import type { ColumnDef } from "@tanstack/vue-table";
import { h } from "vue";
import TableActiveCell from "@/components/Table/ActiveCell.vue";
import { formatDate } from "@helpers/formatDate";
import { ROUTE } from "@static/routes";
import Dropdown from "@/components/Dropdown/index.vue";
import { type IDropdownItem } from "../../../@schemas/dropdown";
import { makeDeleteToastOptions } from "~/helpers/fetch/toastOptions";
import type { IOrganization } from "@common/schemas/organization/organization";
import { verifyUserPermission } from "@common/helpers/verifyUserPermission";
import { PERMISSION } from "@common/static/permissions";
import { verifyMutatePermission } from "@common/helpers/verifyMutatePermission";
import { verifyRoutePermission } from "@common/helpers/verifyRoutePermission";

const userStore = useUserStore();
const { currentUser } = storeToRefs(userStore);

// --------------------------
// PAGINATION FETCH
// --------------------------

const { paginationBody, paginationResult, isLoading, refresh } =
  await usePagination<IOrganization>({
    url: "/organizations",
  });
// --------------------------

const { fetchApi } = useFetchApi();

const handleDeleteItem = async (id: string) => {
  await fetchApi({
    url: `/organizations/${id}`,
    method: "DELETE",
    toastOptions: makeDeleteToastOptions({ label: "Team" }),
  });
  await refresh();
};

const { openDialog } = useAlertDialog();

const getDropdownItems = (item: IOrganization): IDropdownItem[] => {
  const handleDeleteDialog = () => {
    openDialog({
      title: "Delete " + item.name,
      message:
        "This action cannot be undone. Are you sure you want to delete this team?",
      confirm: {
        label: "Delete",
        variant: "danger",
        action: async () => {
          handleDeleteItem(item._id);
        },
      },
    });
  };
  const canView = verifyRoutePermission({
    item,
    routePermissions: PERMISSION.organizations,
    user: currentUser.value,
    method: "get",
  });
  const canDelete = verifyRoutePermission({
    item,
    routePermissions: PERMISSION.organizations,
    user: currentUser.value,
    method: "delete",
  });
  const canEdit = verifyRoutePermission({
    item,
    routePermissions: PERMISSION.organizations,
    user: currentUser.value,
    method: "put",
  });

  const items: IDropdownItem[] = [
    {
      label: "View",
      action: () => {
        navigateTo(ROUTE.viewOrganization.href + `/${item._id}`);
      },
      disabled: !canView,
    },
    {
      label: "Edit",
      action: () => {
        navigateTo(ROUTE.editOrganization.href + `/${item._id}`);
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

const columns: ColumnDef<IOrganization>[] = [
  {
    accessorKey: "active",
    header: "Active",
    cell: ({ row }) => {
      const value = row.getValue<boolean>("active");
      return h(TableActiveCell, {
        active: value,
      });
    },
  },
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
    <DashboardSection title="Team">
      <template v-slot:actions-right>
        <NuxtLink :to="ROUTE.createOrganization.href">
          <UiButton>New Team</UiButton>
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
