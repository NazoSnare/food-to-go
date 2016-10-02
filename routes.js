"use strict";

const config = require("./config.json");

const app = require("./index.js").app;
const passport = require("./index.js").passport;
const Router = require("koa-router");

const routes = new Router();

const main = require("./controllers/main.js");
const account = require("./controllers/account.js");
const api = require("./controllers/api.js");
const store = require("./controllers/store.js");

// routes

// show pages
routes.get("/", main.index);
routes.get("/ordering", main.ordering);
routes.get("/store", store.store);
routes.get("/store/add", store.add);

// get info back for consumer end
routes.post("/api/order", api.newOrder);
routes.post("/api/getOrder", api.getOrder);
routes.post("/api/info", api.saveInfo);
routes.post("/api/items", api.getAllItems);
routes.post("/api/addItem", api.addItem);
routes.post("/api/getCategory", store.getCategory);

// get info back for store end
routes.post("/store/retrieve", store.getOrders);
routes.post("/store/items/add", store.newItem);
routes.post("/store/newCat", store.newCategory);
routes.post("/store/admin", store.admin);
routes.post("store/addUser", store.addUser);
// for passport
routes.get("/login", account.login);
routes.get("/logout", account.logout);
routes.get("/account", account.index);
routes.get("/login_error", account.loginError);

// you can add as many strategies as you want
routes.get("/auth/github",
	passport.authenticate("github")
);

routes.get("/auth/github/callback",
	passport.authenticate("github", {
		successRedirect: "/account",
		failureRedirect: "/"
	})
);

routes.post("/auth/local",
	passport.authenticate("local", {
		successRedirect: "/account",
		failureRedirect: "/login_error"
	})
);

app.use(routes.middleware());
