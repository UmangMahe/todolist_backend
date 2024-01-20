# todolist_backend
My Notes Backend

### Configuration

1) Rename the `.env.example` file to `.env`
2) The default PORT is `3002`.
3) Add the url of the Mongodb database to the `MONGODB_URI` variable
4) Add `JWT_SECRET`, it can be any arbitrary string (24 characters is recommended)
5) Open terminal and type - `$ npm run dev`. This will run the server.js and try connecting with the database.
6) Visit `https://umangmahe.github.io/todolist_frontend` and check whether server responses are working or not (Only works on port 3002)

##### Make sure to only configure the PORT when required (default: 3002)
