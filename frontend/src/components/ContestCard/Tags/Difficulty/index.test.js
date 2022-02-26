import { render } from "@testing-library/react";
import DifficultyTag from ".";

test("Should render easy tag with the correct attributes", () => {
  const { getByText, getByLabelText } = render(
    <DifficultyTag difficulty="easy" />
  );
  expect(getByText(/Easy/i)).toBeInTheDocument();
  expect(getByLabelText(/Difficulty tag/i)).toHaveAttribute(
    "data-scheme",
    "blue"
  );
});
test("Should render medium tag with the correct attributes", () => {
  const { getByText, getByLabelText } = render(
    <DifficultyTag difficulty="medium" />
  );
  expect(getByText(/Medium/i)).toBeInTheDocument();
  expect(getByLabelText(/Difficulty tag/i)).toHaveAttribute(
    "data-scheme",
    "yellow"
  );
});
test("Should render hard tag with the correct attributes", () => {
  const { getByText, getByLabelText } = render(
    <DifficultyTag difficulty="hard" />
  );
  expect(getByText(/Hard/i)).toBeInTheDocument();
  expect(getByLabelText(/Difficulty tag/i)).toHaveAttribute(
    "data-scheme",
    "red"
  );
});
