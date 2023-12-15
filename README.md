# PokeTeams

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Tests

### Unit Tests

Unit tests have the pattern `*.unit.test.ts` (or `.tsx`) are implemented with Vitest and React Testing Library; see `package.json` and
`vitest.config.ts`. Run them with:

```bash
npm test
```

The starting point for the test setup was the [Next.js testing documentation](https://nextjs.org/docs/pages/building-your-application/optimizing/testing). The tests use [Vitest](https://vitest.dev/) and [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/).

The [Testing Library documentation recommends a browser extension](https://testing-library.com/docs/queries/about#browser-extension) that allows you to inspect elements on your page and provides suggested queries. These can in turn be used to help with UI testing. Find the [Testing Playground extension here](https://chromewebstore.google.com/detail/testing-playground/hejbmebodbijjdhflfknehhcgaklhano)

### Integration Tests

Integration tests also use Vitest, but they correspond to file ending in `integ.test.ts` (or `.tsx`); see `package.json` and `vitest.config.ts`. Moreover, they require using [Docker](https://docs.docker.com/engine/install/). Create a Docker container:

```bash
# Services defined in the docker-compose.yml file.
docker compose up
```

Once the containers/services have initialized, you can run the integration tests with:

```bash
npm run test:integration
```

Note that environment variables are loaded from `.env.local.test`, and they contain values from `docker-compose.yml`.

#### Mock API

During tests, API requests to PokeAPI are mocked using the `msw` package; see [MSW - Mock Service Worker](https://mswjs.io/).

### End-To-End Tests

End-to-end tests are implemented with Playwright; see `package.json`. Run them with:

```bash
# See https://playwright.dev/docs/running-tests

# Build the app.
npm run build

# Run in headless mode.
npm run test:e2e

# Run interactively in headed mode.
npm run test:e2e -- --headed

# Run interactively in UI mode.
npm run test:e2e -- --ui
```

See [Playwright docs](https://playwright.dev/). Also, see the [basic Next.js Test Playwright setup](https://nextjs.org/docs/pages/building-your-application/optimizing/testing#manual-setup-1).

### Issues

There currently is no clear way to test React Server Components with React Testing Library. See: https://github.com/testing-library/react-testing-library/issues/1209.

## Learn More about Next.js

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app). To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Disclaimer

This website was made with the intention to learn how to use web technologies, and in no way makes any attempt to profit or claim ownership for any intellectual or creative property found. The data used in this site comes from the which in turn is based on Pokémon, a Nintendo trademark.

## Acknowledgements

- [Sweet Farm](https://thenounproject.com/sweetfarm/collection/pokemon-go/), from which I created a red version `public/poketeams-logo.png` that I am using as a logo.
- [Nature illustrations by Storyset](https://storyset.com/nature)
- [People illustrations by Storyset](https://storyset.com/people)
- [PokeAPI](https://pokeapi.co/): All Pokemon images, information, moves, etc, come from this great free, open source API.