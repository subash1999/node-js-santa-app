const { createLetter } = require("../../controllers/Letter.controller");
const Letter = require("../../models/Letter.model");

describe("createLetter", () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: { username: "test", message: "test" } };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  // -----------------------------------------------------------------------------------------------------------------------------------------------
  // -----------------------------------------------------------------------------------------------------------------------------------------------

  it("should create a letter and return 201 status code with the letter", async () => {
    Letter.create = jest
      .fn()
      .mockResolvedValueOnce({ _id: "123", username: "test", content: "test" });

    await createLetter(req, res, next);

    expect(Letter.create).toHaveBeenCalledWith({
      username: "test",
      message: "test",
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      _id: "123",
      username: "test",
      content: "test",
    });
  });
  // -----------------------------------------------------------------------------------------------------------------------------------------------
  // -----------------------------------------------------------------------------------------------------------------------------------------------

  it("should return 400 status code with error message if letter creation fails", async () => {
    const errorMessage = "Something went wrong";
    Letter.create = jest.fn().mockRejectedValueOnce(new Error(errorMessage));

    await createLetter(req, res, next);

    expect(Letter.create).toHaveBeenCalledWith({
      username: "test",
      message: "test",
    });
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ errors: errorMessage });
  });
});
