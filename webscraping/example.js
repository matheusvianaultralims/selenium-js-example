const { Builder, By, Key, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
require("dotenv").config();

let options = new chrome.Options();
options.addArguments("--disable-dev-shm-usage");

let driver = new Builder()
  .forBrowser("chrome")
  .setChromeOptions(options)
  .build();

async function run() {
  console.log(
    "Pegando todos os títulos de aulas da trilha Engenharia de Soluções"
  );

  try {
    await driver.get(
      "https://universidade.ultralims.com.br/app/cursos/be8f3aa0-7b69-4b95-a813-ee2fea03beed/presentation"
    );

    setTimeout(async () => {
      const email = await driver.findElement(By.id("input_credenciais_User"));
      const password = await driver.findElement(
        By.id("input_credenciais_Senha")
      );

      await email.sendKeys(process.env.EMAIL);
      await password.sendKeys(process.env.PASSWORD, Key.RETURN);
      setTimeout(async () => {
        const titles = await driver.findElements(By.css(".title"));
        if (titles.length === 0) {
          throw new Error("Nenhum título de aula encontrado.");
        }

        for (let title of titles) {
          const titleText = await title.getText();
          console.log(titleText);
        }
      }, 8000);
    }, 10000);
  } catch (error) {
    console.error("Erro durante a execução do script:", error);
  }
}

run();
