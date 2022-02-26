import { render } from "@testing-library/react";
import ActiveTag from ".";

test("Should render active tag with the correct attributes", () => {
  const { getByText, getByLabelText } = render(<ActiveTag status="active" />);
  expect(getByText(/Active/i)).toBeInTheDocument();
  expect(getByLabelText(/Active tag/i)).toHaveAttribute("data-scheme", "green");
});
test("Should render inactive tag with the correct attributes", () => {
  const { getByText, getByLabelText } = render(<ActiveTag status="inactive" />);
  expect(getByText(/Inactive/i)).toBeInTheDocument();
  expect(getByLabelText(/Active tag/i)).toHaveAttribute("data-scheme", "gray");
});
