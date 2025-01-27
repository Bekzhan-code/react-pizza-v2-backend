import { body } from "express-validator";

export const loginValidation = [
  body("email", "Неверный формат почты").isEmail(),
  body("password", "Пароль должен содержать минимум 8 символов").isLength({
    min: 8,
  }),
];

export const registerValidation = [
  body("email", "Неверный формат почты").isEmail(),
  body("password", "Пароль должен содержать минимум 8 символов").isLength({
    min: 8,
  }),
  body("fullName", "").isLength({ min: 3, max: 40 }),
];
