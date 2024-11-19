const { Builder, By, Key } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
require("dotenv").config();

let options = new chrome.Options();
options.addArguments("--disable-dev-shm-usage");

let driver = new Builder()
  .forBrowser("chrome")
  .setChromeOptions(options)
  .build();

async function run() {
  console.log("#1 - Testando logar no sistema ULtraLIMS");
  try {
    await driver.get("https://master.ultralims.com.br/public/index.php");
    const username = await driver.findElement(By.id("icon-id"));
    const password = await driver.findElement(By.id("icon_password"));
    await username.sendKeys(process.env.USERNAME);
    await password.sendKeys(process.env.PASSWORD, Key.RETURN);
    setTimeout(async () => {
      const submitButton2 = await driver.findElement(By.id("buttonSubmit"));
      await submitButton2.click();
      const profileName = await driver.findElement(By.className("hidden-xs"));
      if (profileName) {
        console.log("Usuário logado no sistema com sucesso - O teste passou");
      } else {
        console.log("O teste falhou");
      }
    }, 3000);
  } finally {
    setTimeout(async () => {
      await driver.quit();
    }, 5000);
  }
}

run();
