import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { HTTP_STATUS } from "../../constants/httpStatus";

import { Form } from "./form";

const server = setupServer(
  rest.post("/products", (req, res, ctx) => {
    const { name, size, type } = req.body as {
      name: string;
      size: number;
      type: string;
    };
    if (name && size && type)
      return res(
        ctx.status(HTTP_STATUS.CREATED_STATUS),
        ctx.json({ message: "Ok" })
      );

    return res(ctx.status(HTTP_STATUS.ERROR_SERVER));
  })
);

beforeAll(() => server.listen());

afterAll(() => server.close());

afterEach(() => server.resetHandlers());

// eslint-disable-next-line testing-library/no-render-in-setup
beforeEach(() => render(<Form />));

describe("when the form is mounted", () => {
  it("there must be a create product form page", () => {
    expect(
      screen.getByRole("heading", { name: /create product/i })
    ).toBeInTheDocument();
  });

  it("should exits the fields: name, size, type(electronic, furniture, clothing) and submit buttons", () => {
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/size/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/type/i)).toBeInTheDocument();

    expect(screen.getByText(/electronic/i)).toBeInTheDocument();
    expect(screen.getByText(/furniture/i)).toBeInTheDocument();
    expect(screen.getByText(/clothing/i)).toBeInTheDocument();
  });

  it("should exist the submit button", () => {
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
  });
});

describe("when the user submits the form without values", () => {
  it("should display validation messages", () => {
    expect(screen.queryByText(/the name is required/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/the size is required/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/the type is required/i)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    expect(screen.getByText(/the name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/the size is required/i)).toBeInTheDocument();
    expect(screen.getByText(/the type is required/i)).toBeInTheDocument();
  });
});

describe("when the user blurs an empty field", () => {
  it("should display a validation error message", () => {
    fireEvent.blur(screen.getByLabelText(/name/i), {
      target: { name: "name", value: "" },
    });
    expect(screen.getByText(/the name is required/i)).toBeInTheDocument();

    fireEvent.blur(screen.getByLabelText(/size/i), {
      target: { name: "size", value: "" },
    });
    expect(screen.getByText(/the size is required/i)).toBeInTheDocument();

    fireEvent.blur(screen.getByLabelText(/type/i), {
      target: { name: "type", value: "" },
    });
    expect(screen.getByText(/the type is required/i)).toBeInTheDocument();
  });
});

describe("when the user submits the form properly and the server returns created status", () => {
  it("should the submit button be disabled until the request is done", async () => {
    const submitBtn = screen.getByRole("button", { name: /submit/i });

    expect(submitBtn).not.toBeDisabled();

    fireEvent.click(submitBtn);

    expect(submitBtn).toBeDisabled();

    await waitFor(() => expect(submitBtn).not.toBeDisabled());
  });

  it('the form page must display the success message "Product stored" and clean the fields values', async () => {
    const nameInput = screen.getByLabelText(/name/i);
    const typeInput = screen.getByLabelText(/type/i);
    const sizeInput = screen.getByLabelText(/size/i);

    fireEvent.change(nameInput, {
      target: { name: "name", value: "test-product" },
    });
    fireEvent.change(sizeInput, {
      target: { name: "size", value: Math.random() },
    });
    fireEvent.change(typeInput, {
      target: { name: "type", value: "electronic" },
    });

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    expect(await screen.findByText(/product stored/i)).toBeInTheDocument();

    expect(nameInput).toHaveValue("");
    expect(sizeInput).toHaveValue(0);
    expect(typeInput).toHaveValue("");
  });
});

describe("when the user submits the form and the server return an unexpected error", () => {
  it('the form page must display the error message "Unexpected error, please try again"', async () => {
    server.use(
      rest.post("/products", (req, res, ctx) => {
        return res(
          ctx.status(500),
          ctx.json({ message: "Unexpected error, please try again" })
        );
      })
    );

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    expect(
      await screen.findByText(/unexpected error, please try again/i)
    ).toBeInTheDocument();
  });
});

describe("when the user submits the form and the server return an invalid error", () => {
  it('the form page must display the error message "the form is invalid, the fields [fields1, ...fieldN] are required"', async () => {
    server.use(
      rest.post("/products", (req, res, ctx) => {
        return res(
          ctx.status(400),
          ctx.json({
            message:
              "the form is invalid, the fields name, size, type are required",
          })
        );
      })
    );

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    expect(
      await screen.findByText(
        /the form is invalid, the fields name, size, type are required/i
      )
    ).toBeInTheDocument();
  });
});


describe("when the user submits the form and not found path", () => {
  it('the form page must display the error message "Connection error, please try later"', async () => {
    server.use(
      rest.post("/products", (req, res, ctx) => res.networkError('Failed to connect'))
    );

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    expect(
      await screen.findByText(
        /Connection error, please try later/i
      )
    ).toBeInTheDocument();
  });
});