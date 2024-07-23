<script setup lang="ts">
import type { ColumnDef } from "@tanstack/vue-table";
import { h, ref } from "vue";
import { type IUser } from "@common/schemas/user/user";
import { type IPaginationBody } from "@common/schemas/paginateRoute";
import { type IRole } from "@common/schemas/roles";
import TableActiveCell from "@/components/Table/ActiveCell.vue";
import TableRoleCell from "@/components/Table/RoleCell.vue";
import { formatDate } from "@helpers/formatDate";
import { ROUTE } from "@static/routes";
import Dropdown from "@/components/Dropdown/index.vue";
import { type IDropdownItem } from "../../../@schemas/dropdown";
import { DotsHorizontalIcon } from "@radix-icons/vue";

const pagination = ref<IPaginationBody<IUser>>({
  limit: 10,
  page: 1,
});
// const data: IUser[] = [];

const { data, error } = await usePaginateApi<IUser>({
  bodyRef: pagination,
  url: "/users",
  immediate: true,
});

const getDropdownItems = ({ id }: { id: string }): IDropdownItem[] => {
  return [
    {
      label: "Edit",
      action: () => {
        navigateTo(ROUTE.editUser.href + `/${id}`);
      },
    },
  ];
};

const columns: ColumnDef<IUser>[] = [
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
      const items = getDropdownItems({ id: values._id });
      return h(
        "div",
        { class: "relative" },
        h(Dropdown, {
          items,
          trigger: "dots",
          // onExpand: row.toggleExpanded,
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
      <Table :data="data?.data?.list ?? []" :columns="columns" />
    </DashboardSection>
  </NuxtLayout>
</template>
