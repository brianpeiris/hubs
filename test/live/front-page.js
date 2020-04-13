const test = require("ava");
const webdriver = require("selenium-webdriver");

const browsers = {
  //firefox: { browserName: "Firefox", os: "Windows", os_version: "10" },
  //chrome: { browserName: "Chrome", os: "Windows", os_version: "10" },
  //ie: { browserName: "IE", os: "Windows", os_version: "10" },
  edge: { browserName: "Edge", os: "Windows", os_version: "10" },
  //safari_mac: { browserName: "Safari", os: "OS X", os_version: "Catalina" },
  //safari_ios: { browserName: "iPhone", device: "iPhone 8", os_version: "13", real_mobile: true }
};

const creds = {
  "browserstack.user": process.env.BROWSERSTACK_USER,
  "browserstack.key": process.env.BROWSERSTACK_KEY
};

async function retryUntilElContains(driver, selector, expectedText, retry = 10) {
  for (let i = 0; i < retry; i++) {
    const els = await driver.findElements(webdriver.By.css(selector));

    for (const el of els) {
      const text = await el.getText();
      if (text === expectedText) {
        return;
      }
    }

    await driver.sleep(200);
  }

  throw new Error("failed to find element", selector, expectedText);
}

const drivers = [];

test.after.always("cleanup", () => {
  for (const driver of drivers) {
    driver.quit();
  }
});

for (const browser in browsers) {
  const capabilities = Object.assign(browsers[browser], creds);

  const driver = new webdriver.Builder()
    .usingServer("http://hub-cloud.browserstack.com/wd/hub")
    .withCapabilities(capabilities)
    .build();

  drivers.push(driver);

  test.serial(`${browser} front page loads`, async t => {
    await driver.get("https://hubs.mozilla.com");

    try {
      await retryUntilElContains(driver, "button", "Create a Room");
      t.pass("CTA button found");
    } catch (e) {
      t.fail("CTA button not found");
    }
  });

  test.serial(`${browser} room loads`, async t => {
    await driver.get("https://hubs.mozilla.com/TvCNeYa/browserstack-room");

    try {
      await retryUntilElContains(driver, "button", "Enter Room");
      t.pass("Enter Room button found");
    } catch (e) {
      t.fail("Enter Room button not found");
    }
  });
}
