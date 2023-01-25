class CardRepository {
  constructor({ CardModel, logger }) {
    this.CardModel = CardModel;
    this.logger = logger;
  }

  async addCard(cardData) {
    const cardModelEntity = new this.CardModel(cardData);

    const validationErrors = cardModelEntity.validateSync();
    if (validationErrors) {
      this.logger.error("Validation Error when saving Card", {
        error: validationErrors,
      });
    }

    const entity = await this.CardModel.create(cardModelEntity);

    this.logger.info(`Successfully created card with id ${entity.id}`);

    return entity;
  }

  async getCardById(id) {
    const card = await this.CardModel.findById(id);

    return card;
  }

  async getAllCards() {
    const filter = {};
    const cards = await this.CardModel.find(filter);

    return cards;
  }

  async updateCard(id, cardData) {
    const card = await this.CardModel.findByIdAndUpdate(id, cardData, {
      new: true,
    });

    return card;
  }

  async deleteCardById(id) {
    const card = await this.CardModel.findByIdAndDelete(id);

    return card;
  }

  async getCardByEmail(email) {
    const card = await this.CardModel.findOne({ email });

    return card;
  }

  async getCardsByUserId(userId) {
    const cards = await this.CardModel.find({ userId });

    return cards;
  }
}

module.exports = CardRepository;
