# Food to go! [![Build Status](https://travis-ci.org/cynical89/food-to-go.svg?branch=master)](https://travis-ci.org/cynical89/food-to-go)
A great way to order your food online!

## Prerequisites
* [Node.js](https://nodejs.org/en/) (Version 5 and up recommended)
* [CouchDB](http://couchdb.apache.org/)
* [Stripe API key](https://stripe.com/) (for payment processing)
* [Github Client ID and Secret](https://github.com/settings/developers) (for OAuth)

### Installation

* Clone down the repository.
```
git clone https://github.com/cynical89/food-to-go.git
```

* Install packages (from inside the food-to-go folder).
```
npm install
```

* Create your config.  There's a `config.json.example` file in the root.  Edit it to include all your values for the site.  Save it as `config.json` and leave it in the root.

* For production you must change the stripe secret_key to your own live secret key in the config.json. view your keys here [https://dashboard.stripe.com/account/apikeys](https://dashboard.stripe.com/account/apikeys)

* If you want to use Google Analytics, set `config.site.analytics` to your Tracking ID and make sure the analytics partial (analytics.hbs) contains the correct Universal Analytics tracking code.  If you don't want to use Google Analytics, remove that property or set it to false.

* Start it up.
```
npm start
```
* Enjoy!

### Tests

There's a number of tests written against basic functionality of the backend.  They can be found in the `tests` folder.

* Running tests
```
npm test
```

* Generating code coverage
```
npm run coverage
```
### Setting up Database

* Download and Install CouchDB
```
http://couchdb.apache.org/
```

* Download & Install Make
```
https://sourceforge.net/projects/gnuwin32/files/make/3.81/make-3.81.exe/
```

* Download & Extract curl
```
http://curl.haxx.se/gknw.net/7.40.0/dist-w64/curl-7.40.0-rtmp-ssh2-ssl-sspi-zlib-winidn-static-bin-w64.7z
```

1. Setup environment variables for Make
	- Check if 'C:\Program Files (x86)\GnuWin32' exists
	- If it exists, then open up your environment variables
	- Start Menu > type: 'Edit the system environment variables' (start typing 'environment') > hit enter
	- Click on the 'Environment Variables...' button
	- Under System variables, find the variable named "Path", and select it
	- Hit the 'Edit...' button
	- Add 'C:\Program Files (x86)\GnuWin32\bin' to the list

2. Setup environment variables for curl
	- Move the extracted curl folder to 'C:\Program Files (x86)\curl'
	- Open environment variables like you did above for Make
	- Find 'Path' variable > Edit button
	- Add 'C:\Program Files (x86)\curl'

3. Run 'Start CouchDB' (see windows start search)
4. Open node cmd and navigate (cd) into your open-hearts folder
5. Type 'Make install' and hit enter
6. This should create the database
7. If you would like to clear the database type 'Make clear-db'
