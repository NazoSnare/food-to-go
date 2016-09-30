REPORTER = nyan

install:
	curl -X PUT http://127.0.0.1:5984/orders
	curl -X PUT http://127.0.0.1:5984/items
	curl -X PUT http://127.0.0.1:5984/categories
	curl -X PUT http://127.0.0.1:5984/ftgusers

clear-db:
	curl -X DELETE http://127.0.0.1:5984/orders
	curl -X DELETE http://127.0.0.1:5984/items
	curl -X DELETE http://127.0.0.1:5984/categories
	curl -X DELETE http://127.0.0.1:5984/ftgusers
