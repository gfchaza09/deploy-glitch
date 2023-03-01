import express from "express";
import MongoStore from "connect-mongo";
import session from "express-session";
import passport from "passport";
import { Strategy } from "passport-local";
import bcrypt from "bcrypt";

import config from "./config.js";

import { Server as HttpServer } from "http";
import { Server as Socket } from "socket.io";

import { authWebRouter, usersApi } from "./routers/web/auth.js";
import homeWebRouter from "./routers/web/home.js";
import productosApiRouter from "./routers/api/productos.js";
import randomsApiRouter from "./routers/api/randoms.js";

import configurarSocketProductos from "./routers/ws/productos.js";
import configurarSocketMensajes from "./routers/ws/mensajes.js";

const LocalStrategy = Strategy;

const createServer = () => {
  //--------------------------------------------
  // instancio servidor, socket y api

  const app = express();
  const httpServer = new HttpServer(app);
  const io = new Socket(httpServer);

  // Passport

  const verifyPass = async (usuario, password) => {
    const match = await bcrypt.compare(password, usuario.password);
    return match;
  };

  passport.use(
    "local",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true,
      },
      async function (req, email, password, done) {
        //Logica para validar si un usuario existe
        const users = await usersApi.listAll();
        const existeUsuario = users.find((usuario) => usuario.email == email);

        if (!existeUsuario) {
          return done(null, false);
        } else {
          const match = await verifyPass(existeUsuario, password);

          if (!match) {
            return done(null, false);
          }
          return done(null, existeUsuario);
        }
      }
    )
  );

  passport.serializeUser((usuario, done) => {
    done(null, usuario.email);
  });

  passport.deserializeUser(async (email, done) => {
    const users = await usersApi.listAll();
    const existeUsuario = users.find((usuario) => usuario.email == email);
    done(null, existeUsuario);
  });

  //--------------------------------------------
  // configuro el socket

  io.on("connection", async (socket) => {
    await configurarSocketProductos(socket, io);

    await configurarSocketMensajes(socket, io);
  });

  //--------------------------------------------
  // configuro el servidor

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static("public"));

  app.set("views", "./views");
  app.set("view engine", "ejs");

  app.use(
    session({
      store: MongoStore.create(config.mongodb),
      secret: "secreto",
      rolling: true,
      resave: true,
      saveUninitialized: false,
      cookie: {
        maxAge: 600000,
        httpOnly: false,
        secure: false,
      },
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  //--------------------------------------------
  // rutas del servidor API REST
  app.use(productosApiRouter);
  app.use(randomsApiRouter);
  //--------------------------------------------
  // rutas del servidor web
  app.use(authWebRouter);
  app.use(homeWebRouter);
  //--------------------------------------------

  return {
    listen: (port) =>
      new Promise((resolve, reject) => {
        const connectedServer = httpServer.listen(port, () => {
          resolve(connectedServer);
        });
        connectedServer.on("error", (error) => {
          reject(error);
        });
      }),
  };
};

export default { createServer };
