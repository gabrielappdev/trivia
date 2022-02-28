import { Tag } from "@chakra-ui/react";

const activeTagTransformer = {
  active: {
    label: "Active",
    color: "green",
  },
  inactive: {
    label: "Inactive",
    color: "gray",
  },
};

type ActiveTagProps = {
  size?: "sm" | "md" | "lg";
  status: "active" | "inactive";
};

const ActiveTag = ({ status, size = "md" }: ActiveTagProps) => {
  const { color, label } = activeTagTransformer[status];
  return (
    <Tag
      aria-label="Active tag"
      data-scheme={color}
      colorScheme={color}
      size={size}
    >
      {label}
    </Tag>
  );
};

export default ActiveTag;
