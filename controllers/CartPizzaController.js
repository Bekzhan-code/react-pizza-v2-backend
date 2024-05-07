import CartPizzaModel from "../models/CartPizza.js";

export const getAll = async (req, res) => {
  try {
    const cartPizzas = await CartPizzaModel.find().populate("user").exec();
    const userCartPizzas = cartPizzas.filter((obj) => {
      return obj.user._id.toString() === req.userId;
    });
    res.json(userCartPizzas);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не удалось получить пиццы в корзине",
    });
  }
};

export const add = async (req, res) => {
  try {
    const { name, type, size } = req.body;
    const existingCartPizza = await CartPizzaModel.find({
      name,
      type,
      size,
      user: req.userId,
    });
    if (existingCartPizza.length !== 0) {
      await CartPizzaModel.findOneAndUpdate(
        { name, type, size },
        { $inc: { amount: 1 } },
        {
          returnDocument: "after",
        }
      );
      res.json(existingCartPizza);
    } else {
      const cartPizza = await CartPizzaModel.create({
        ...req.body,
        user: req.userId,
      });

      res.json(cartPizza);
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "Не удалось добавить пиццу в корзину",
    });
  }
};

export const decrement = async (req, res, next) => {
  try {
    const cartPizza = await CartPizzaModel.findById(req.params.id);

    console.log(cartPizza);

    if (cartPizza.amount === 1) {
      next();
    } else {
      await CartPizzaModel.findByIdAndUpdate(
        req.params.id,
        {
          $inc: { amount: -1 },
        },
        {
          returnDocument: "after",
        }
      );
      res.json(cartPizza);
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "Не удалось уменьшить количество пицц",
    });
  }
};

export const remove = async (req, res) => {
  try {
    const cartPizza = await CartPizzaModel.findByIdAndDelete(req.params.id);

    res.json(cartPizza);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      messsage: "Не удалось удалить пиццу из корзины",
    });
  }
};

export const clear = async (req, res) => {
  try {
    const cartPizzas = await CartPizzaModel.deleteMany({
      user: req.query.userId,
    });

    res.json(cartPizzas);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      messsage: "Не удалось очистить корзину",
    });
  }
};
