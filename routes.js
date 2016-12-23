"use strict";

const config = require("./config.json");

const app = require("./index.js").app;
const passport = require("./index.js").passport;
const Router = require("koa-router");

const routes = new Router();

const api = require("./controllers/api.js");
const store = require("./controllers/store.js");

// routes

// consumer api routes
routes.post("/api/info", api.saveInfo);
routes.post("/api/items", api.getAllItems);
routes.post("/api/addItem", api.addItem);
routes.post("/api/getCategory", store.getCategory);
routes.post("/api/save", api.savepid);
routes.post("/api/stripe", api.payment);
routes.post("/api/geocode", api.geocode);

// get info back for store end
routes.post("/store/retrieve", store.getOrders);
routes.post("/store/items/add", store.newItem);
routes.post("/store/newCat", store.newCategory);
routes.post("/store/addUser", store.addUser);

// you can add as many strategies as you want
// TODO: Add google, reddit, and facebook strategies!
routes.get("/auth/stripe",
	passport.authenticate("stripe")
);

routes.get("/auth/stripe/callback",
	passport.authenticate("stripe", {
		successRedirect: "/account",
		failureRedirect: "/"
	})
);

routes.post("/auth/local",
	passport.authenticate("local", {
		successRedirect: "/store",
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
