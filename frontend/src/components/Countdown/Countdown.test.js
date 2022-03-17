import { render } from "../../test";
import { waitFor } from "@testing-library/react";
import Countdown from ".";

let date = null;

beforeEach(() => {
  const currentDate = new Date();
  date = currentDate.setSeconds(currentDate.getSeconds() + 1);
});

test("Should render the passed children if the countdown reach its end mark", async () => {
  const { queryByLabelText } = render(
    <Countdown date={date}>
      <div aria-label="Visible content" />
    </Countdown>
  );
  await waitFor(() =>
    expect(queryByLabelText("Visible content")).toBeInTheDocument()
  );
});
test("Should apply the prefix before the date", () => {
  const { queryByText } = render(
    <Countdown date={date} prefix="Testing">
      <div aria-label="Visible content" />
    </Countdown>
  );
  expect(queryByText("Testing")).toBeInTheDocument();
});
