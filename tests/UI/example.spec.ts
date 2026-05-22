import { test, expect } from '@playwright/test';
import { GoogleMapsPage } from "../../src/pages/GoogleMapsPage";

let googleMapsPage: GoogleMapsPage;


test.describe('Google Maps Feature Tests', () => {

  let locationToSearch = 'Paris';
  let locationsToSearchAndGetDirections = [
      'London',
      'Eiffel Tower',
      'Buckingham Palace'
  ];
  let invalidLocationsToSearch = [
    ' ',
    '@#$',
    '123456890'
  ];

  test.beforeEach(async ({ page }) => {

    googleMapsPage = new GoogleMapsPage(page);

    // Open Maps once for the entire suite
    await googleMapsPage.openMaps();
    await expect(page).toHaveTitle(/Google Maps/);
  });

  test(`Search for a valid location and verify it is first in suggestions`, { tag: ['@search', '@smoke', '@positive'] }, async ({ page }) => {

    await googleMapsPage.searchForLocation(locationToSearch);
    expect(await googleMapsPage.getFirstSearchLocationSuggestion()).toContain(locationToSearch);
  });

  for(const location of locationsToSearchAndGetDirections) {
    test(`Validate directions to location ${location}`, { tag: ['@search', '@smoke', '@positive'] }, async ({ page }) => {

      await googleMapsPage.searchForLocation(location);
      expect(await googleMapsPage.getFirstSearchLocationSuggestion()).toContain(location);
      await googleMapsPage.selectFirstLocation();
      expect(await googleMapsPage.isDirectionsButtonVisible()).toBeTruthy();
      await googleMapsPage.getDirections();
      expect(await googleMapsPage.getDestinationFieldValue()).toContain(location);
    });
  }

  for(const location of invalidLocationsToSearch) {
    test(`Validate input invalid location ${location}`, { tag: ['@search', '@smoke', '@negative'] }, async ({ page }) => {

      await googleMapsPage.inputLocationAndSearch(location);
      expect(await googleMapsPage.isLocationNotFoundMessageVisible()).toBeTruthy();
      expect(await googleMapsPage.getLocationNotFoundMessage()).toContain(location);
      console.info('Message after input value into Search field:', await googleMapsPage.getLocationNotFoundMessage());
    });
  }

});