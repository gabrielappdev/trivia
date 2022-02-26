import { Tag } from "@chakra-ui/react";

const difficultyTagTransformer = {
  easy: {
    label: "Easy",
    color: "blue",
  },
  medium: {
    label: "Medium",
    color: "yellow",
  },
  hard: {
    label: "Hard",
    color: "red",
  },
};

type DifficultyTagProps = {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  difficulty: "easy" | "medium" | "hard";
};

const DifficultyTag = ({ difficulty, size = "md" }: DifficultyTagProps) => {
  const { color, label } = difficultyTagTransformer[difficulty];
  return (
    <Tag
      aria-label="Difficulty tag"
      data-scheme={color}
      colorScheme={color}
      size={size}
    >
      {label}
    </Tag>
  );
};

export default DifficultyTag;
