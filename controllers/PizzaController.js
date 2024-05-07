import PizzaModel from "../models/Pizza.js";

export const getAll = async (req, res) => {
  try {
    const { category, sortBy } = req.query;
    const pizzas = await PizzaModel.find(
      Number(category) > 0 ? { category: Number(category) } : {}
    ).sort(sortBy);
    res.json(pizzas);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "Не удалось получить пиццы",
    });
  }
};
