export const formatContests = (contests) => {
  const { data } = contests;
  return data.map(({ id, attributes }) => ({
    ...attributes,
    id,
    category: attributes?.category?.data?.attributes?.title ?? "",
    users: attributes?.users_permissions_users?.data?.map(({ id }) => id),
  }));
};
