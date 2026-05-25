import {Locator, Page} from '@playwright/test';

export abstract class BasePage {
    protected readonly page: Page;

    private readonly acceptCookiesButton: Locator;
    private readonly goToWebButtonFromSmarterGoogleMapsPopup: Locator;

    protected constructor(page: Page) {
        this.page = page;

        this.acceptCookiesButton = this.page.getByRole('button', { name: /accept all/i });
        this.goToWebButtonFromSmarterGoogleMapsPopup = this.page.getByRole('button', { name: /Go back to web/i });
    }

    async open(path: string): Promise<void> {
        await this.page.goto(path);
        await this.page.waitForLoadState('domcontentloaded');

        await this.acceptCookiesIfDisplayed();
        await this.continueFromSmarterGoogleMapsPopupIfDispalyed();
    }

    private async acceptCookiesIfDisplayed(): Promise<void> {

        if (await this.acceptCookiesButton.isVisible().catch(() => false)) {
            await this.acceptCookiesButton.click();
        }
    }

    private async continueFromSmarterGoogleMapsPopupIfDispalyed(): Promise<void> {

        if (await this.goToWebButtonFromSmarterGoogleMapsPopup.isVisible().catch(() => false)) {
            await this.goToWebButtonFromSmarterGoogleMapsPopup.click();
        }
    }
}