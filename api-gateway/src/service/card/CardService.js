const Operation = require("../Operation");

const {
  INVALID_INPUT_ERROR_MSG,
  ADD_CARD_ERROR_MSG,
  GET_CARDS_BY_USER_ERROR_MSG,
} = require("../../constants/errorMessages");

class CardService extends Operation {
  constructor({ logger, cardClient, accountClient }) {
    super();
    this.logger = logger;
    this.cardClient = cardClient;
    this.accountClient = accountClient;
  }

  async addCard(userData, cardData) {
    const { ADD_CARD_SUCCESS, INVALID_INPUT, ERROR } = this.outputs;

    try {
      if (!userData || !cardData) {
        return this.emit(INVALID_INPUT, INVALID_INPUT_ERROR_MSG);
      }
      const account = await this.accountClient.getByUserId(userData.id);
      const card = await this.cardClient.addCard({
        ...cardData,
        // eslint-disable-next-line no-underscore-dangle
        accountId: account.id,
      });
      if (!card) {
        return this.emit(ERROR, ADD_CARD_ERROR_MSG);
      }

      return this.emit(ADD_CARD_SUCCESS, card);
    } catch (error) {
      this.logger.error(ADD_CARD_ERROR_MSG, {
        data: {
          errorMessage: error.toString(),
          inputParameters: JSON.stringify({ userData, cardData }),
          stack: error.stack,
        },
      });

      return this.emit(ERROR, ADD_CARD_ERROR_MSG);
    }
  }

  async getCardsByUserId(userId) {
    const { GET_CARDS_BY_USER_SUCCESS, INVALID_INPUT, ERROR } = this.outputs;

    try {
      if (!userId) {
        return this.emit(INVALID_INPUT, INVALID_INPUT_ERROR_MSG);
      }

      const cards = await this.cardClient.getCardsByUserId(userId);

      return this.emit(GET_CARDS_BY_USER_SUCCESS, cards);
    } catch (error) {
      this.logger.error(GET_CARDS_BY_USER_ERROR_MSG, {
        data: {
          errorMessage: error.toString(),
          inputParameters: JSON.stringify({ userId }),
          stack: error.stack,
        },
      });

      return this.emit(ERROR, ADD_CARD_ERROR_MSG);
    }
  }
}

CardService.setOutputs([
  "ADD_CARD_SUCCESS",
  "INVALID_INPUT",
  "GET_CARDS_BY_USER_SUCCESS",
  "ERROR",
]);

module.exports = CardService;
