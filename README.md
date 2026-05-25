# google-maps-playwright-demo-tests

This is a demo test automation project written in **TypeScript** using  **Playwright** framework
The project contains 3 layers of testing:

1. **UI tests** for Google Maps service https://www.google.com/maps?hl=en
2. **API tests** for Geocoding endpoint https://geocoding-api.open-meteo.com/v1/search
3. **Contract tests** for validating Geocoding API response https://geocoding-api.open-meteo.com/v1/search

The goal is to show a clean and scalable TAF structure using Playwright, POM in UI tests, API testing, contract validation, environment configuration, and reporting.

## Initial setup

1. Check Node.js version `node -v` - should be 18+
2. Check npm installed `npm -v`

## Installation

1. Clone git repository: 

    `git clone git@github.com:maria2709/google-maps-playwright-demo-tests.git`

2. Go to project folder and install dependencies

   `npm install`

3. Install playwright browsers

    `npx playwright install`



## Tests execution

The projects (test suites) are defined in playwright.config.ts. 

### Execute tests from command line - examples
#### To run **all** the tests:

    `npx playwright test`

To run all desktop **UI** tests in Chrome(default) browser:

    `npx playwright test --project ui-desktop`

To run desktop UI tests in Chrome browser and debug:

    `npx playwright test --project ui-desktop --debug`

To run positive/negative desktop UI tests in Chrome(default) browser:

    `npx playwright test --project ui-desktop --grep @positive`


To run all **API** tests:

    `npx playwright test --project api`

To run positive/negative API tests:

    `npx playwright test --project api --grep @positive`


To run all **contract** tests:

    `npx playwright test --project contract`

To run success/error **contract** tests:

    `npx playwright test --project contract --grep @error`