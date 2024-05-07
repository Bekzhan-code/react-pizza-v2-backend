import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import {
  loginValidation,
  registerValidation,
} from "./validations/authValidation.js";
import { checkAuth, handleValidationErrors } from "./utils/index.js";
import {
  PizzaController,
  UserController,
  CartPizzaController,
} from "./controllers/index.js";

const app = express();
app.use(cors());
app.use(express.json());

const DB = "mongodb://127.0.0.1:27017/react-pizza-v2";

mongoose.connect(DB).then(
  () => console.log("Successfully connected to database"),
  (err) => console.log(err)
);

app.get("/pizzas", PizzaController.getAll);

app.get("/auth/me", checkAuth, UserController.getMe);
app.post(
  "/auth/login",
  loginValidation,
  handleValidationErrors,
  UserController.login
);
app.post(
  "/auth/register",
  registerValidation,
  handleValidationErrors,
  UserController.register
);

app.get("/cartPizzas", checkAuth, CartPizzaController.getAll);
app.post("/cartPizzas", checkAuth, CartPizzaController.add);
app.patch(
  "/cartPizzas/:id",
  checkAuth,
  CartPizzaController.decrement,
  CartPizzaController.remove
);
app.delete("/cartPizzas/:id", checkAuth, CartPizzaController.remove);
app.delete("/cartPizzas", checkAuth, CartPizzaController.clear);

app.listen(5000, (err) => {
  if (err) console.log(err);
  console.log("server running on port 5000");
});
