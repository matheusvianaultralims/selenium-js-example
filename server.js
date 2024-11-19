const { Builder, By, Key } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

let options = new chrome.Options();
options.addArguments("--disable-dev-shm-usage");

let driver = new Builder()
  .forBrowser("chrome")
  .setChromeOptions(options)
  .build();

async function run() {
  try {
    await driver.get("https://google.com");
    const searchBar = await driver.findElement(By.name("q"));
    await searchBar.sendKeys("nodejs", Key.RETURN);
  } finally {
    setTimeout(async () => {
      await driver.quit();
    }, 5000);
  }
}

run();
