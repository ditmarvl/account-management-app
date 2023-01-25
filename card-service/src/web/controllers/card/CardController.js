const { Router } = require("express");
const { inject } = require("awilix-express");
const Status = require("http-status");

const {
  INVALID_INPUT_ERROR_CODE,
  UNEXPECTED_ERROR_CODE,
} = require("../../../constants/errorCodes");

const UserController = {
  get router() {
    const router = Router();

    router.post(
      "/",
      inject(() => this.addCard)
    );

    router.get(
      "/:id",
      inject(() => this.getCardById)
    );

    router.get(
      "/user/:id",
      inject(() => this.getCardsByUserId)
    );

    return router;
  },

  addCard(req, res) {
    const { cardService } = req.container.cradle;
    const { CREATE_CARD_SUCCESS, INVALID_INPUT, ERROR } = cardService.outputs;

    cardService
      .once(CREATE_CARD_SUCCESS, (data) => {
        res.status(Status.CREATED).json(data);
      })
      .once(INVALID_INPUT, (data) => {
        res.status(Status.BAD_REQUEST).json({
          error: data,
          errorCode: INVALID_INPUT_ERROR_CODE,
        });
      })
      .once(ERROR, (data) => {
        res
          .status(Status.INTERNAL_SERVER_ERROR)
          .json({ error: data, errorCode: UNEXPECTED_ERROR_CODE });
      });

    cardService.addCard(req.body);
  },

  getCardById(req, res) {
    const { cardService } = req.container.cradle;
    const { GET_CARD_SUCCESS, INVALID_INPUT, ERROR } = cardService.outputs;

    cardService
      .once(GET_CARD_SUCCESS, (data) => {
        res.status(Status.CREATED).json(data);
      })
      .once(INVALID_INPUT, (data) => {
        res.status(Status.BAD_REQUEST).json({
          error: data,
          errorCode: INVALID_INPUT_ERROR_CODE,
        });
      })
      .once(ERROR, (data) => {
        res
          .status(Status.INTERNAL_SERVER_ERROR)
          .json({ error: data, errorCode: UNEXPECTED_ERROR_CODE });
      });

    cardService.getCardById(req.params.id);
  },

  getCardsByUserId(req, res) {
    const { cardService } = req.container.cradle;
    const { GET_CARDS_SUCCESS, INVALID_INPUT, ERROR } = cardService.outputs;

    cardService
      .once(GET_CARDS_SUCCESS, (data) => {
        res.status(Status.CREATED).json(data);
      })
      .once(INVALID_INPUT, (data) => {
        res.status(Status.BAD_REQUEST).json({
          error: data,
          errorCode: INVALID_INPUT_ERROR_CODE,
        });
      })
      .once(ERROR, (data) => {
        res
          .status(Status.INTERNAL_SERVER_ERROR)
          .json({ error: data, errorCode: UNEXPECTED_ERROR_CODE });
      });

    cardService.getCardsByUserId(req.params.id);
  },
};

module.exports = UserController;
