const Joi = require("@hapi/joi");
const { v4: uuidv4 } = require("uuid");
const users = [];

const MainPageController = (req, h) => {
  return h.view("MainPage");
};

const AddUserGet = (req, h) => {
  return h.view("AddUser");
};

const AddUserPost = async (req, h) => {
  const schema = Joi.object({
    name: Joi.string().min(1).max(30).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().optional().allow(""),
  });

  try {
    await schema.validateAsync(req.payload);

    const { name, email, phone } = req.payload;
    const id = uuidv4();
    users.push({ id, name, email, phone });

    return h.redirect("/tum");
  } catch (error) {
    return h.view("AddUser", { error: error.details[0].message });
  }
};

const UpdateUserGet = (req, h) => {
  const id = req.params.id;
  const user = users.find((user) => user.id === id);

  if (user) {
    return h.view("UpdateUser", { user });
  }

  return h.response("Kullanıcı bulunamadı").code(404);
};

const UpdateUserPost = async (req, h) => {
  const id = req.params.id;
  const { name, email, phone } = req.payload;

  const userIndex = users.findIndex((user) => user.id === id);

  if (userIndex > -1) {
    const schema = Joi.object({
      name: Joi.string().min(3).max(30).required(),
      email: Joi.string().email().required(),
      phone: Joi.string().optional().allow(""),
    });

    try {
      await schema.validateAsync(req.payload);

      users[userIndex] = { id, name, email, phone };
      return h.redirect("/tum");
    } catch (error) {
      return h.view("UpdateUser", {
        user: req.payload,
        error: error.details[0].message,
      });
    }
  }

  return h.response("Kullanıcı bulunamadı").code(404);
};

const DeleteUser = (req, h) => {
  const id = req.params.id;
  const userIndex = users.findIndex((user) => user.id === id);

  if (userIndex > -1) {
    users.splice(userIndex, 1);
    return h.redirect("/tum");
  }

  return h.response("Kullanıcı bulunamadı").code(404);
};

module.exports = {
  MainPageController,
  AddUserGet,
  AddUserPost,
  DeleteUser,
  UpdateUserGet,
  UpdateUserPost,
  users,
};
