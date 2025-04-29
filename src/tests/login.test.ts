import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { Builder, WebDriver, By, until } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome";
import { LoginPage } from "../pages/LoginPage.js";
import fs from "fs";

let driver: WebDriver;

const credentials = JSON.parse(fs.readFileSync('credentials.json', 'utf8'));

beforeAll(async () => {
    const options = new chrome.Options();
    driver = await new Builder()
        .forBrowser("chrome")
        .setChromeOptions(options)
        .build();
}, 10000);

afterAll(async () => {
    await driver.quit();
});

describe("Magento Login Tests", () => {
    // @ts-ignore
    credentials.forEach(({ email, password, shouldLogin }) => {
        it(`should ${shouldLogin ? 'login successfully' : 'show error'} for ${email}`, async () => {
            const loginPage = new LoginPage(driver);

            await loginPage.open();
            await loginPage.enterEmail(email);
            await loginPage.enterPassword(password);
            await loginPage.clickLogin();

            if (shouldLogin) {
                // Wait for the welcome message after successful login
                const welcomeMessage = await driver.wait(until.elementLocated(By.css('.logged-in')), 10000); // Adjust selector if needed
                const welcomeText = await welcomeMessage.getText();
                expect(welcomeText).toContain("Welcome");
            } else {
                const errorMsg = await driver.wait(until.elementLocated(By.css('[data-bind="html: $parent.prepareMessageForHtml(message.text)"]')), 10000); // Adjust selector if needed
                const errorText = await errorMsg.getText();
                expect(errorText).toContain("The account sign-in was incorrect or your account is disabled temporarily");  // Check for specific error message
            }
        }, 30000);
    });
});
