import { By, until, WebDriver } from "selenium-webdriver";

export class LoginPage {
  driver: WebDriver;

  constructor(driver: WebDriver) {
    this.driver = driver;
  }

  async open() {
    await this.driver.get("https://magento.softwaretestingboard.com/customer/account/login");
  }

  async enterEmail(email: string) {
    const emailField = await this.driver.wait(
        until.elementLocated(By.id("email")),
        10000 // 10 seconds
    );
    await emailField.sendKeys(email);
  }


  async enterPassword(password: string) {
    const passwordField = await this.driver.wait(
        until.elementLocated(By.id("pass")),
        10000
    );
    await passwordField.sendKeys(password);
  }

  async clickLogin() {
    const loginButton = await this.driver.wait(
        until.elementLocated(By.id("send2")),
        10000
    );
    await loginButton.click();
  }

}
