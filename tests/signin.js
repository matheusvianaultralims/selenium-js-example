const { Builder, By, Key, until, Actions } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
require("dotenv").config();

let options = new chrome.Options();
options.addArguments("--disable-dev-shm-usage");
options.addArguments("--incognito"); // Usar o modo incógnito
options.addArguments("--disable-cache"); // Desabilitar cache
options.addArguments("--disable-application-cache"); // Desabilitar cache de aplicativos

let driver = new Builder()
  .forBrowser("chrome")
  .setChromeOptions(options)
  .build();

// Função para aguardar um tempo específico
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Função para desenhar um marcador (círculo) no local do clique
async function drawClickMarker(x, y) {
  await driver.executeScript(`
    var marker = document.createElement('div');
    marker.style.position = 'absolute';
    marker.style.top = '${y}px';
    marker.style.left = '${x}px';
    marker.style.width = '20px';
    marker.style.height = '20px';
    marker.style.backgroundColor = 'red';
    marker.style.borderRadius = '50%';
    marker.style.zIndex = 9999; // Para garantir que o marcador fique acima de outros elementos
    document.body.appendChild(marker);
  `);
}

async function login() {
  console.log("#1 - Testando logar no sistema UltraLIMS");

  await driver.get("https://master.ultralims.com.br/public/index.php");
  const usernameField = await driver.findElement(By.id("icon-id"));
  const passwordField = await driver.findElement(By.id("icon_password"));

  await usernameField.sendKeys(process.env.USERNAMEUL);
  await passwordField.sendKeys(process.env.PASSWORD, Key.RETURN);

  const submitButton = await driver.wait(
    until.elementLocated(By.id("buttonSubmit")),
    5000
  );
  await submitButton.click();

  try {
    const profileName = await driver.wait(
      until.elementLocated(By.className("hidden-xs")),
      10000
    );
    if (profileName) {
      console.log("Usuário logado no sistema com sucesso - O teste passou");
    }
  } catch (err) {
    console.log("Falha ao fazer login", err);
  }
}

async function closeModal() {
  try {
    const modalButton = await driver.wait(
      until.elementIsVisible(
        driver.findElement(By.className("btn btn-default"))
      ),
      5000
    );
    await modalButton.click();
    await sleep(1000);
    console.log("Modal fechado com sucesso");
  } catch (err) {
    console.log("Erro ao fechar o modal", err);
  }
}

async function loadDashboardData() {
  // Maximizar a janela para garantir que as coordenadas estejam dentro da tela
  await driver.manage().window().maximize();

  // Definindo as coordenadas de onde você quer clicar (por exemplo, x=700, y=200)
  const xCoord = 1250;
  const yCoord = 250;

  // Desenhando um marcador no local do clique
  await drawClickMarker(xCoord, yCoord);

  // Criando a instância de Actions corretamente
  const actions = driver.actions();

  // Mova o mouse para as coordenadas (por exemplo, 700, 200) e clique manualmente
  await actions.move({ x: xCoord, y: yCoord }).click().perform();

  // Espera 5 segundos após o clique
  await sleep(5000);
}

async function run() {
  try {
    await login();
    await closeModal();
    await loadDashboardData();
  } catch (err) {
    console.log("Erro no processo de teste: ", err);
  } finally {
    await driver.quit();
  }
}

run();
