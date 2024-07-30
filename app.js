const Hapi = require("@hapi/hapi");
const Path = require("path");
const controllers = require("./controllers");

const init = async () => {
  const server = Hapi.server({
    port: 8000,
    host: "localhost",
  });

  await server.register([require("@hapi/inert"), require("@hapi/vision")]);

  server.views({
    engines: { ejs: require("ejs") },
    relativeTo: __dirname,
    path: "static",
  });

  server.route({
    method: "GET",
    path: "/",
    handler: controllers.MainPageController,
  });

  server.route({
    method: "GET",
    path: "/ekle",
    handler: controllers.AddUserGet,
  });

  server.route({
    method: "POST",
    path: "/ekle",
    handler: controllers.AddUserPost,
  });

  server.route({
    method: "GET",
    path: "/tum",
    handler: (request, h) => {
      const users = controllers.users;
      return h.view("tum", { users });
    },
  });

  server.route({
    method: "GET",
    path: "/guncelle/{id}",
    handler: controllers.UpdateUserGet,
  });

  server.route({
    method: "POST",
    path: "/guncelle/{id}",
    handler: controllers.UpdateUserPost,
  });

  server.route({
    method: "GET",
    path: "/sil/{id}",
    handler: controllers.DeleteUser,
  });

  await server.start();
  console.log(`Server running on ${server.info.uri}`);
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
