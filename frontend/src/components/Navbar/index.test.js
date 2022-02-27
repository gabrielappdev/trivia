import { render } from "../../test";
import Navbar from ".";

test("Should render a navbar with logo and join button", () => {
  const { getByAltText, getByText } = render(<Navbar />);
  expect(getByAltText(/Trivia logo/i)).toBeInTheDocument();
  expect(getByText(/Join now/i)).toBeInTheDocument();
});
