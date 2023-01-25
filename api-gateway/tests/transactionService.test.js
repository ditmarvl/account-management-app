const axios = require("axios");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { v4 } = require("uuid");
const TransactionClient = require("../src/clients/TransactionClient");
// const TransactionMapper = require("../src/mapper/TransactionMapper");
const TransactionService = require("../src/service/transaction/TransactionService");
const { customLogger } = require("./utils/utils");
const config = require("../config");
const { transactionMock } = require("./mocks/transactionService.mock");
const {
  CREATE_TRANSACTION_ERROR_MSG,
} = require("../src/constants/errorMessages");

describe("transaction service tests", () => {
  let transactionClient;
  let transactionService;
  let spy;

  beforeEach(() => {
    transactionClient = new TransactionClient({
      logger: customLogger,
      httpClient: axios,
      config,
    });
    transactionService = new TransactionService({
      logger: customLogger,
      transactionClient,
      bcrypt,
      jwt,
      uuidv4: v4,
      config,
    });

    spy = jest.spyOn(transactionService, "emit");
  });

  describe("testing addTransaction", () => {
    it("should create and emit transaction successfully", async () => {
      const { ADD_TRANSACTION_SUCCESS } = transactionService.outputs;
      transactionClient.createTransaction = jest.fn(() => transactionMock);

      await transactionService.createTransaction(transactionMock);

      expect(transactionClient.createTransaction).toBeCalledWith(
        transactionMock
      );
      expect(spy).toBeCalledWith(ADD_TRANSACTION_SUCCESS, transactionMock);
    });

    it("should emit failure when transaction client fails", async () => {
      const { ERROR } = transactionService.outputs;
      transactionClient.createTransaction = jest.fn(() => {
        throw Error();
      });

      await transactionService.createTransaction(transactionMock);

      expect(transactionClient.createTransaction).toBeCalledWith(
        transactionMock
      );
      expect(spy).toBeCalledWith(ERROR, CREATE_TRANSACTION_ERROR_MSG);
    });
  });
});
