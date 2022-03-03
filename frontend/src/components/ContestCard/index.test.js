import { render } from "../../test";
import { within, waitFor, screen, fireEvent } from "@testing-library/react";
import ContestCard from ".";

const activeContestMock = {
  title: "Contest #1 - Animals",
  description: "Easy contest with entrance cost of 37 coins",
  prizePool: 0,
  active: true,
  expiration_date: "2021-01-25T00:13:32.362Z",
  slug: "contest-1-animals",
  cost: 37,
  difficulty: "easy",
  category: "animals",
};

const inactiveContestMock = {
  title: "Contest #1 - Animals",
  description: "Easy contest with entrance cost of 37 coins",
  prizePool: 0,
  active: false,
  expiration_date: "3000-01-25T00:13:32.362Z",
  slug: "contest-1-animals",
  cost: 37,
  difficulty: "easy",
  category: "animals",
};

test("Should render an active card correctly", () => {
  const { getByText, getByTestId } = render(
    <ContestCard {...activeContestMock} />
  );
  expect(getByTestId("contest-card-wrapper")).toHaveStyle(
    "pointer-events: auto"
  );
  expect(getByTestId("contest-card-body")).toHaveStyle("filter: none");
  expect(getByText(activeContestMock.title)).toBeInTheDocument();
  expect(getByText(activeContestMock.description)).toBeInTheDocument();
  expect(getByText(activeContestMock.category)).toBeInTheDocument();
  expect(getByText("Active")).toBeInTheDocument();
  expect(
    within(getByTestId("pool")).getByText(
      new RegExp(activeContestMock.prizePool, "i")
    )
  ).toBeInTheDocument();
});
test("Should render an inactive card correctly", () => {
  const { getByText, getByTestId } = render(
    <ContestCard {...inactiveContestMock} />
  );
  expect(getByTestId("contest-card-wrapper")).toHaveStyle(
    "pointer-events: none"
  );
  expect(getByTestId("contest-card-body")).toHaveStyle("filter: grayscale(1)");
  expect(getByText(inactiveContestMock.title)).toBeInTheDocument();
  expect(getByText(inactiveContestMock.description)).toBeInTheDocument();
  expect(getByText(inactiveContestMock.category)).toBeInTheDocument();
  expect(getByText("Inactive")).toBeInTheDocument();
  expect(
    within(getByTestId("pool")).getByText(
      new RegExp(inactiveContestMock.prizePool, "i")
    )
  ).toBeInTheDocument();
});

test("Shouldn`t render the play button if the expiration date is in the future", () => {
  const { queryByText } = render(<ContestCard {...inactiveContestMock} />);
  expect(queryByText(activeContestMock.cost)).not.toBeInTheDocument();
});

test("Clicking the play button should render the dialog confirmation", async () => {
  const { queryByText } = render(
    <ContestCard {...activeContestMock} isTesting />
  );
  const playButton = queryByText(activeContestMock.cost);
  await fireEvent.click(playButton);
  await waitFor(() => {
    expect(screen.getByRole("alertdialog")).toBeInTheDocument();
  });
});
