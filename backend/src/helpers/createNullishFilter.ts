export const createNullishFilter = (field: string) => {
  return [
    { [field]: { $exists: false } },
    { [field]: { $eq: false } },
    { [field]: { $eq: null } },
  ];
};
