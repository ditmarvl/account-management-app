const AccountRepository = require("../src/repository/AccountRepository");
const AccountMapper = require("../src/mapper/AccountMapper");
const AccountService = require("../src/service/account/AccountService");
const { customLogger } = require("./utils/utils");
// const { accountMock } = require("./mocks/accountService.mock");

describe("account service tests", () => {
  const AccountModel = {};
  let accountRepository;
  let accountService;
  let spy;

  beforeEach(() => {
    accountRepository = new AccountRepository({
      logger: customLogger,
      AccountModel,
      accountMapper: AccountMapper,
    });
    accountService = new AccountService({
      logger: customLogger,
      accountRepository,
      accountMapper: AccountMapper,
    });

    spy = jest.spyOn(accountService, "emit");
    spy();
  });

  describe("testing createAccount", () => {});
});
