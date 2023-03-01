import express, { Router } from "express";
import path from "path";
import bcrypt from "bcrypt";
import passport from "passport";

import ContenedorMongoDb from "../../contenedores/contenedorMongoDb.js";

const app = express();

const authWebRouter = new Router();

const usersApi = new ContenedorMongoDb();

const generateHashPassword = async (password) => {
  const hashPassword = await bcrypt.hash(password, 10);
  return hashPassword;
};

authWebRouter.get("/", (req, res) => {
  res.redirect("/login");
});

authWebRouter.get("/login", (req, res) => {
  if (!req.user) {
    res.sendFile(path.resolve(app.get("views") + "/login.html"));
  } else {
    res.redirect("/home");
  }
});

authWebRouter.get("/signup", (req, res) => {
  if (!req.user) {
    res.sendFile(path.resolve(app.get("views") + "/signup.html"));
  } else {
    res.redirect("/home");
  }
});

authWebRouter.get("/logout", (req, res) => {
  let nameUser = req.user.email;

  req.session.destroy((err) => {
    if (!err) res.render("logout.ejs", { nombre: nameUser });
    else res.send({ status: "Logout ERROR", body: err });
  });
});

authWebRouter.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/faillogin",
    passReqToCallback: true,
  })
);

authWebRouter.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  const users = await usersApi.listAll();

  const newUsuario = users.find((usuario) => usuario.email == email);
  if (newUsuario) {
    res.redirect("/failsignup");
  } else {
    const newUser = {
      email,
      password: await generateHashPassword(password),
    };

    await usersApi.save(newUser);
    res.redirect("/login");
  }
});

authWebRouter.get("/faillogin", (req, res) => {
  res.render("faillogin.ejs");
});

authWebRouter.get("/failsignup", (req, res) => {
  res.render("failsignup.ejs");
});

export { authWebRouter, usersApi };
