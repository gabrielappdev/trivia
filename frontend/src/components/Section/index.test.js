import { render } from "@testing-library/react";
import Section from ".";

test("Should render a section correctly", () => {
  const { getByLabelText, getByText } = render(
    <Section title="Section title" subtitle="This is a section subtitle">
      <div aria-label="children example" />
    </Section>
  );
  expect(getByText(/Section title/i)).toBeInTheDocument();
  expect(getByText(/This is a section subtitle/i)).toBeInTheDocument();
  expect(getByLabelText(/children example/i)).toBeInTheDocument();
});
test("It should not render a subtitle if it`s not passed as prop", () => {
  const { queryByLabelText, getByText } = render(
    <Section title="Section title">
      <div aria-label="children example" />
    </Section>
  );
  expect(queryByLabelText(/Section subtitle/i)).not.toBeInTheDocument();
});
