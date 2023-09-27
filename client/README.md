## PokeTeams Frontend

The frontend for this application is built with vanilla JS (no frameworks), but it uses Webpack to enable usage of modules, among other things. It consists of three pages: home (landing) page, auth page for login and registering, and the app page for logged in users. The app page is the core of the application, with a side tab that gives access to a Pokedex, a move searcher, and a team maker.

Check it out! You can create an account without needing an email; just be sure to click the captcha. Sign up, login, and try it out!

### Webpack Configuration

The package uses the **Webpack** static module bundler. Learn more at: https://webpack.js.org/concepts. In this package, my configuration is found at `webpack.config.js`. Note that in it I set global variables using `DefinePlugin`; ensure they're right for your needs.

### Installation

```bash
# Run in development.
npm run dev

# Run in production (update webpack.config.js if necessary).
npm run start
```


### APIs

The application uses the free [PokeAPI](https://pokeapi.co/) as its source of Pokemon data. For saving user information, including login, teams created, etc, it uses the PokeTeams API that is creted as part of this application, accessed via the global `API_URL` variable defined in the `plugins` section of `webpack.config.js`:

```js
    ...
    new webpack.DefinePlugin({
      API_URL: JSON.stringify(isProduction ? 'your-prod-url': 'http://localhost:5000/api/v1'),
    }),
    ...
```