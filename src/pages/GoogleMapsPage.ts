import {Locator, Page} from '@playwright/test';
import { BasePage} from "./BasePage";

export class GoogleMapsPage extends BasePage {

    private readonly searchInput: Locator;
    private readonly firstSearchSuggestion: Locator;
    private readonly directionsButton: Locator;
    private readonly destinationField: Locator;
    private readonly locationNotFoundMessage: Locator;
    private readonly searchIcon: Locator;

    constructor(page: Page) {
        super(page);

        this.searchInput = this.page.getByLabel(/Search Google Maps/i);
        this.firstSearchSuggestion = this.page.locator('//*[@aria-label = "Suggestions"]//div[@data-suggestion-index=0]//span//span').first();
        this.directionsButton = this.page.locator('//button[@data-value="Directions"]');
        this.destinationField = this.page.locator('//div[@id="directions-searchbox-1"]//input');
        this.locationNotFoundMessage = this.page.locator('//div[contains(text(), "Google Maps can\'t find")]');
        this.searchIcon = this.page.locator('//button[@aria-label="Search"]').first();
    }

    async openMaps(): Promise<void> {
        await this.open('/maps?hl=en');
    }

    async searchForLocation(location: string): Promise<void> {
        await this.searchInput.fill(location);
    }

    async selectFirstLocation(): Promise<void> {
        await this.firstSearchSuggestion.click();
    }

    async getFirstSearchLocationSuggestion(): Promise<string> {
        return await this.firstSearchSuggestion.textContent() ?? '';
    }

    async inputLocationAndSearch(location: string): Promise<void> {
        await this.searchInput.fill(location);
        await this.searchIcon.click();
    }

    async isDirectionsButtonVisible(timeout?: number): Promise<boolean> {
        try {
            await this.directionsButton.waitFor({ state: 'visible', timeout: 8000 });
            return true;
        } catch {
            return false;
        }
    }

    async getDirections(): Promise<void> {
        await this.directionsButton.click();
    }

    async getDestinationFieldValue(): Promise<string> {
        return await this.destinationField.getAttribute('aria-label') ?? '';
    }

    async isLocationNotFoundMessageVisible(): Promise<boolean> {
        try {
            await this.locationNotFoundMessage.waitFor({ state: 'visible', timeout: 5000 });
            return true;
        } catch {
            return false;
        }
    }

    async getLocationNotFoundMessage(): Promise<string> {
        return await this.locationNotFoundMessage.textContent() ?? '';
    }
}