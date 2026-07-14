# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm test                # lint + unit tests
npm run lint             # ESLint check
npm run lint:fix         # ESLint auto-fix
npm run test:int         # integration tests against a deployed table (jest.config.int.js)
npm run deploy           # deploy via Serverless Framework (osls)
```

There is no `test:e2e` script and no e2e Jest config — see "Known issues" below.

## Architecture

The name and description ("Example architecture using Momento's caching") describe the _intended_
project. **The code as it exists does not use Momento at all** — there is no Momento dependency
anywhere in `package.json`. What's actually implemented is a plain DynamoDB repository:
`src/productRepository.js` (get/save/update) backed by a single `ProductsTable` defined in
`serverless.yml`, accessed via `src/common/documentClient.js` (`@aws-sdk/lib-dynamodb`).

**`serverless.yml` defines zero Lambda functions** — only the DynamoDB table resource. Int tests
(`test/productRepository/*.int.test.js`) call the repository functions directly against the
deployed table; there's no handler layer to invoke.

**Test layers present:** unit (`test/identity.unit.test.js`) and int only. `test/bdd/given.js` +
`test/adapters/dynamoDbAdapter.js` are a partial attempt at the fleet's Farley DSL/adapter
pattern for test setup, structurally closer to it than any other project in the fleet, but see the
broken-imports issue below.

## Known issues (tracked in `../CONSISTENCY-AUDIT.md`, section E)

This project is a scaffold from a single 2025-07-01 commit, untouched since except dependabot/CI
churn — treat it as unfinished, not regressed:

- `saveProduct.int.test.js` and `updateProduct.int.test.js` import `../bdd/then`, which does not
  exist (only `../bdd/given.js` is present) — these test files cannot run.
- `src/common/constants.js` is empty despite being imported (`ProductStatus`) by
  `src/productRepository.js`.
- CI (`.github/workflows/ci.yml`) only runs unit tests and deploy; the e2e and teardown steps are
  commented out, so a deployed stack from CI is never torn down.

If picking this project back up to build it out for real, decide first whether to actually wire in
Momento (matching the name) or rename/repurpose it as a plain DynamoDB repository example — right
now it's neither cleanly.
