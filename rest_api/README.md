## PokeTeams Backend

REST API for PokeTeams built with Express.js and MongoDB. The root of the API is `http://localhost:5000/api/v1`. It exposes the following endpoints:

- `/api/v1`: API Docs.
- `/api/v1/teams`: CRUD API for teams. A team is a set of up to 6 Pokemon.
- `/api/v1/pokemons`: CRUD API for pokemon you may add to your team.
- `/api/v1/auth`: Endpoint for authentication and authorization. Allows login, register, and ensuring the right resources are accessed.
- `/api/v1/users`: Endpoint for accessing users that have been created.

### Installation

Assumes you're on GNU/Linux.

```bash
# Run in development.
npm run dev

# Run in production.
npm run start
```

### Config

Rename the existing `config/config.dev.env` to `config.env`. Then, populate the blank fields, which are:

- `MONGO_URI`: URI for your mongo database. You can create a free cluster at https://mongodb.com.
- `JWT_SECRET`: Generate a random string.
- `CAPTCHA_SECRET_KEY`: This application uses Google Captcha for registering and login. Sign up for an API key at: https://developers.google.com/recaptcha/intro.