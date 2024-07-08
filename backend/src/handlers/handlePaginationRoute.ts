import { FilterQuery, Model } from "mongoose";
import { AppResponse } from "../@schemas/app";
import { IPaginationBodyOutput } from "../@schemas/listRoute";
import { IPaginationResult } from "../@schemas/pagination";
import { IUser } from "../routes/users/schemas/user";

export type IHandlePaginationRoute<T> = {
  body: IPaginationBodyOutput;
  model: Model<T>;
  reqUser: IUser;
  modelHasActive: boolean;
  populates?: (keyof T extends string ? keyof T : never)[];
};

export const handlePaginationRoute = async <T>({
  body,
  model,
  reqUser,
  modelHasActive,
  populates,
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
    const filters: FilterQuery<T> = body.filters ?? {};
    let res = model.find({ ...filters });
    if (reqUser.role !== "admin" && modelHasActive) {
      res = res.where("active").equals(true);
    }
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
