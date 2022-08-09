import { render } from "@testing-library/react";
import { ActiveLink } from "../../../components/Header/ActiveLink";

jest.mock("next/router", () => {
  return {
    useRouter() {
      return {
        asPath: "/",
      };
    },
  };
});

describe("ActiveLink component", () => {
  it("must be render correctly", () => {
    const { getByText } = render(
      <ActiveLink href="/" activeClassName="active">
        <a>Link</a>
      </ActiveLink>
    );

    expect(getByText("Link")).toBeInTheDocument();
  });

  it("adds active class when link is active", () => {
    const { getByText } = render(
      <ActiveLink href="/" activeClassName="active">
        <a>Link</a>
      </ActiveLink>
    );

    expect(getByText("Link")).toHaveClass("active");
  });
});
