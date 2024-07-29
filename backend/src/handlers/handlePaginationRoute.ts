import { FilterQuery, Model } from "mongoose";
import { IPaginationResult } from "@common/schemas/pagination";
import { AppResponse } from "@common/schemas/app";
import { IPaginationBodyOutput } from "@common/schemas/paginateRoute";
import { IUserDoc } from "@/routes/users/schemas/user";
import { IUser } from "@common/schemas/user/user";

export type IHandlePaginationRoute<T> = {
  body: IPaginationBodyOutput;
  obligatoryFilters: FilterQuery<T>;
  model: Model<T>;
  populates?: (keyof T extends string ? keyof T : never)[];
};

export const handlePaginationRoute = async <T>({
  body,
  model,
  populates,
  obligatoryFilters,
}: IHandlePaginationRoute<T>) => {
  const limit = body.limit;
  const page = body.page;
  const sortBy = (body.sortBy as keyof T) ?? "createdAt";
  const sortOrder = body.sortOrder ?? "desc";
  const skip = (page - 1) * limit;

  const sortObj = { [sortBy]: sortOrder };
  if (!sortObj["createdAt"]) {
    sortObj["createdAt"] = "desc";
  }
  const getBaseQuery = () => {
    const filters: FilterQuery<T> = {
      ...(body.filters || {}),
      ...obligatoryFilters,
    };
    console.log("❗ filters -->", filters);
    let res = model.find({ ...filters });

    // if (reqUser.role === "user" && modelHasActive) {
    //   res = res.where("active").equals(true);
    // }

    // if (reqUser.role === "coach") {
    //   res = res.where("organization").equals(reqUser.organization.toString());
    // }

    if (populates) {
      res.populate(populates);
    }
    return res;
  };

  const totalItems = await getBaseQuery().countDocuments();
  const list = await getBaseQuery().sort(sortObj).skip(skip).limit(limit);

  const totalPages = Math.ceil(totalItems / limit);
  const _nextPage = page + 1;
  const nextPage = _nextPage > totalPages ? null : _nextPage;

  const _prevPage = page - 1;
  const prevPage = _prevPage < 1 ? null : _prevPage;

  const resData: AppResponse<IPaginationResult<T>> = {
    data: {
      list: list,
      totalItems: totalItems,
      page: page,
      limit: limit,
      totalPages: totalPages,
      hasNextPage: nextPage !== null,
      hasPrevPage: prevPage !== null,
      nextPage: nextPage,
      prevPage: prevPage,
    },
    error: null,
  };

  return resData;
};
