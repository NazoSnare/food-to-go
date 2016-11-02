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
const storeapi = require("./controllers/storeapi.js");

// routes

// show pages
routes.get("/", main.index);
routes.get("/ordering", main.ordering);
routes.get("/store", store.store);
// routes.get("/store/add", store.add);
routes.get("/checkout", main.cart);
routes.get("/store/add/item", store.addItemPage);
routes.get("/store/admin", store.admin);
routes.get("/store/add/user", store.addUserPage);

// get info back for consumer end
routes.post("/api/info", api.saveInfo);
routes.post("/api/items", api.getAllItems);
routes.post("/api/addItem", api.addItem);
routes.post("/api/getCategory", store.getCategory);
routes.post("/api/save", api.savepid);
routes.post("/stripe", api.payment);

// for remote api
routes.get("/api/success", storeapi.success);
routes.get("/api/failure", storeapi.failure);

// get info back for store end
routes.post("/store/retrieve", store.getOrders);
routes.post("/store/items/add", store.newItem);
routes.post("/store/newCat", store.newCategory);
routes.post("/store/addUser", store.addUser);

// for passport
routes.get("/login", account.login);
routes.get("/logout", account.logout);
routes.get("/account", account.index);
routes.get("/login_error", account.loginError);

// you can add as many strategies as you want
// TODO: Add google, reddit, and facebook strategies!
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

routes.post("/api/login/local",
	passport.authenticate("local", {
		successRedirect: "/api/success",
		failureRedirect: "/api/failure"
	})
);


app.use(routes.middleware());
