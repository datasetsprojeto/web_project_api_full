const Card = require('../models/card');
const {
  BAD_REQUEST_ERROR_CODE,
  FORBIDDEN_ERROR_CODE,
  NOT_FOUND_ERROR_CODE,
  SERVER_ERROR_CODE,
} = require('../utils/constants');

module.exports.getCards = async (req, res) => {
  try {
    const cards = await Card.find({}).populate(['owner', 'likes']);
    return res.send(cards);
  } catch (err) {
    return res.status(SERVER_ERROR_CODE).send({ message: 'Erro ao buscar cartões' });
  }
};

module.exports.createCard = async (req, res) => {
  try {
    const { name, link } = req.body;
    const card = await Card.create({ name, link, owner: req.user._id });
    return res.status(201).send(card);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(BAD_REQUEST_ERROR_CODE).send({ message: 'Dados inválidos' });
    }
    return res.status(SERVER_ERROR_CODE).send({ message: 'Erro ao criar cartão' });
  }
};

module.exports.deleteCard = async (req, res) => {
  try {
    const card = await Card.findById(req.params.cardId)
      .orFail(() => {
        const error = new Error('Cartão não encontrado');
        error.statusCode = NOT_FOUND_ERROR_CODE;
        throw error;
      });

    if (card.owner.toString() !== req.user._id) {
      return res.status(FORBIDDEN_ERROR_CODE).send({ message: 'Permissão negada' });
    }

    await card.deleteOne();
    return res.send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(BAD_REQUEST_ERROR_CODE).send({ message: 'ID inválido' });
    }
    if (err.statusCode === NOT_FOUND_ERROR_CODE) {
      return res.status(NOT_FOUND_ERROR_CODE).send({ message: err.message });
    }
    return res.status(SERVER_ERROR_CODE).send({ message: 'Erro no servidor' });
  }
};

module.exports.likeCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
      .orFail(() => {
        const error = new Error('Cartão não encontrado');
        error.statusCode = NOT_FOUND_ERROR_CODE;
        throw error;
      });
    return res.send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(BAD_REQUEST_ERROR_CODE).send({ message: 'ID inválido' });
    }
    if (err.statusCode === NOT_FOUND_ERROR_CODE) {
      return res.status(NOT_FOUND_ERROR_CODE).send({ message: err.message });
    }
    return res.status(SERVER_ERROR_CODE).send({ message: 'Erro no servidor' });
  }
};

module.exports.dislikeCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
      .orFail(() => {
        const error = new Error('Cartão não encontrado');
        error.statusCode = NOT_FOUND_ERROR_CODE;
        throw error;
      });
    return res.send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(BAD_REQUEST_ERROR_CODE).send({ message: 'ID inválido' });
    }
    if (err.statusCode === NOT_FOUND_ERROR_CODE) {
      return res.status(NOT_FOUND_ERROR_CODE).send({ message: err.message });
    }
    return res.status(SERVER_ERROR_CODE).send({ message: 'Erro no servidor' });
  }
};