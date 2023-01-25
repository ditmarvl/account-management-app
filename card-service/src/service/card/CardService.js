const Operation = require("../Operation");

const {
  INVALID_INPUT_ERROR_MSG,
  CREATE_CARD_ERROR_MSG,
  GET_CARD_ERROR_MSG,
  GET_CARDS_ERROR_MSG,
} = require("../../constants/errorMessages");

class CardService extends Operation {
  constructor({ logger, cardRepository, cardMapper }) {
    super();
    this.logger = logger;
    this.cardRepository = cardRepository;
    this.cardMapper = cardMapper;
  }

  async addCard(cardData) {
    const { CREATE_CARD_SUCCESS, INVALID_INPUT, ERROR } = this.outputs;

    try {
      if (!cardData) {
        return this.emit(INVALID_INPUT, INVALID_INPUT_ERROR_MSG);
      }

      const card = await this.cardRepository.addCard(cardData);
      if (!card) {
        return this.emit(ERROR, CREATE_CARD_ERROR_MSG);
      }

      return this.emit(CREATE_CARD_SUCCESS, this.cardMapper.toDto(card));
    } catch (error) {
      this.logger.error(CREATE_CARD_ERROR_MSG, {
        data: {
          errorMessage: error.toString(),
          inputParameters: JSON.stringify({ cardData }),
          stack: error.stack,
        },
      });

      return this.emit(ERROR, CREATE_CARD_ERROR_MSG);
    }
  }

  async getCardById(id) {
    const { GET_CARD_SUCCESS, INVALID_INPUT, ERROR } = this.outputs;

    try {
      if (!id) {
        return this.emit(INVALID_INPUT, INVALID_INPUT_ERROR_MSG);
      }

      const card = await this.cardRepository.getCardById(id);

      return this.emit(GET_CARD_SUCCESS, this.cardMapper.toDto(card));
    } catch (error) {
      this.logger.error(GET_CARDS_ERROR_MSG, {
        data: {
          errorMessage: error.toString(),
          inputParameters: JSON.stringify({ id }),
          stack: error.stack,
        },
      });

      return this.emit(ERROR, GET_CARD_ERROR_MSG);
    }
  }

  async getCardsByUserId(userId) {
    const { GET_CARDS_SUCCESS, INVALID_INPUT, ERROR } = this.outputs;

    try {
      if (!userId) {
        return this.emit(INVALID_INPUT, INVALID_INPUT_ERROR_MSG);
      }

      const cards = await this.cardRepository.getCardsByUserId(userId);

      return this.emit(
        GET_CARDS_SUCCESS,
        cards.map((card) => this.cardMapper.toDto(card))
      );
    } catch (error) {
      this.logger.error(GET_CARDS_ERROR_MSG, {
        data: {
          errorMessage: error.toString(),
          inputParameters: JSON.stringify({ userId }),
          stack: error.stack,
        },
      });

      return this.emit(ERROR, GET_CARDS_ERROR_MSG);
    }
  }
}

CardService.setOutputs([
  "CREATE_CARD_SUCCESS",
  "GET_CARD_SUCCESS",
  "GET_CARDS_SUCCESS",
  "INVALID_INPUT",
  "ERROR",
]);

module.exports = CardService;
