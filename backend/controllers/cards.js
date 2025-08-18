const Card = require('../models/card');
const {
  BAD_REQUEST,
  FORBIDDEN,
  NOT_FOUND,
  SERVER_ERROR
} = require('../utils/constants');

module.exports.getCards = async (req, res) => {
  try {
    const cards = await Card.find({})
      .populate('owner', '_id name about avatar') // Mantenha apenas informações essenciais do dono
      .select('-__v') // Remova campos desnecessários
      .lean(); // Converta para objetos JavaScript simples

    // Transforme os likes para conter apenas IDs
    const transformedCards = cards.map(card => ({
      ...card,
      likes: card.likes.map(like => like._id ? like._id : like) // Mantenha apenas IDs
    }));

    return res.send(transformedCards);
  } catch (err) {
    return res.status(SERVER_ERROR).send({ message: 'Erro ao buscar cartões' });
  }
};

module.exports.createCard = async (req, res) => {
  try {
    const { name, link } = req.body;
    const card = await Card.create({ name, link, owner: req.user._id });
    return res.status(201).send(card);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(BAD_REQUEST).send({ message: 'Dados inválidos' });
    }
    return res.status(SERVER_ERROR).send({ message: 'Erro ao criar cartão' });
  }
};

module.exports.deleteCard = async (req, res) => {
  try {
    const card = await Card.findById(req.params.cardId)
      .orFail(() => {
        const error = new Error('Cartão não encontrado');
        error.statusCode = NOT_FOUND;
        throw error;
      });

    if (!card.owner.equals(req.user._id)) {
      return res.status(FORBIDDEN).send({ message: 'Permissão negada' });
    }

    await card.deleteOne();
    return res.send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(BAD_REQUEST).send({ message: 'ID inválido' });
    }
    if (err.statusCode === NOT_FOUND) {
      return res.status(NOT_FOUND).send({ message: err.message });
    }
    return res.status(SERVER_ERROR).send({ message: 'Erro no servidor' });
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
        error.statusCode = NOT_FOUND;
        throw error;
      });
    return res.send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(BAD_REQUEST).send({ message: 'ID inválido' });
    }
    if (err.statusCode === NOT_FOUND) {
      return res.status(NOT_FOUND).send({ message: err.message });
    }
    return res.status(SERVER_ERROR).send({ message: 'Erro no servidor' });
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
        error.statusCode = NOT_FOUND;
        throw error;
      });
    return res.send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(BAD_REQUEST).send({ message: 'ID inválido' });
    }
    if (err.statusCode === NOT_FOUND) {
      return res.status(NOT_FOUND).send({ message: err.message });
    }
    return res.status(SERVER_ERROR).send({ message: 'Erro no servidor' });
  }
};