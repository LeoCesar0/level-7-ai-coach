<script setup lang="ts">
import type { ColumnDef } from "@tanstack/vue-table";
import { h, ref } from "vue";
import { type IUser, type IUserFull } from "@common/schemas/user/user";
import { type IPaginationBody } from "@common/schemas/paginateRoute";
import { type IRole } from "@common/schemas/roles";
import TableActiveCell from "@/components/Table/ActiveCell.vue";
import TableRoleCell from "@/components/Table/RoleCell.vue";
import { formatDate } from "@helpers/formatDate";
import { ROUTE } from "@static/routes";
import Dropdown from "@/components/Dropdown/index.vue";
import { type IDropdownItem } from "../../../@schemas/dropdown";
import { makeDeleteToastOptions } from "~/helpers/fetch/toastOptions";

type TUser = IUserFull;

// --------------------------
// PAGINATION FETCH
// --------------------------

const { paginationBody, paginationResult, isLoading, refresh } =
  await usePagination<TUser>({
    url: "/users",
  });
// --------------------------

const { fetchApi } = useFetchApi();

const handleDeleteUser = async (id: string) => {
  await fetchApi({
    url: `/users/${id}`,
    method: "DELETE",
    toastOptions: makeDeleteToastOptions({ label: "User" }),
  });
  await refresh();
};

const { openDialog } = useAlertDialog();

const getDropdownItems = (user: TUser): IDropdownItem[] => {
  const handleDeleteDialog = () => {
    openDialog({
      title: "Delete " + user.name,
      message:
        "This action cannot be undone. Are you sure you want to delete this user?",
      confirm: {
        label: "Delete",
        variant: "danger",
        action: async () => {
          handleDeleteUser(user._id);
        },
      },
    });
  };
  return [
    {
      label: "View",
      action: () => {
        navigateTo(ROUTE.viewUser.href + `/${user._id}`);
      },
    },
    {
      label: "Edit",
      action: () => {
        navigateTo(ROUTE.editUser.href + `/${user._id}`);
      },
    },
    {
      label: "Delete",
      action: () => {
        handleDeleteDialog();
      },
      variant: "danger",
    },
  ];
};

const columns: ColumnDef<TUser>[] = [
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
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => row.getValue("email"),
  },
  {
    accessorKey: "organization",
    header: "Team/Organization",
    cell: ({ row }) => row.original.organization.name,
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.getValue<IRole>("role");
      return h(TableRoleCell, {
        role: role,
      });
    },
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
    <DashboardSection title="Users">
      <template v-slot:actions-right>
        <NuxtLink :to="ROUTE.createUser.href">
          <UiButton>New User</UiButton>
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
