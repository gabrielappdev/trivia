export const formatContests = (contests) => {
  const { data } = contests;
  return data.map(({ id, attributes }) => ({
    ...attributes,
    id,
    category: attributes?.category?.data?.attributes?.title ?? "",
  }));
};
