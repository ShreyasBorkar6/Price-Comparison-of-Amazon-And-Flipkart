const puppeteer = require("puppeteer");
const cheerio = require("cheerio");

let PAGE_URL = "https://www.myntra.com/";

const myntraScraper = async (searchTerm) => {
  //const searchUrl = PAGE_URL + encodeURIComponent(searchTerm);
    const searchUrl = searchTerm
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  await page.goto(searchUrl, { waitUntil: "domcontentloaded" });
  const html = await page.content();
  await browser.close();

  const $ = cheerio.load(html);
  const products = [];

  $("li.product-base").each((i, element) => {
    const brand = $(element).find(".product-brand").text().trim();
    const name = $(element).find(".product-product").text().trim();
    const priceText = $(element).find(".product-discountedPrice").text().replace("Rs. ", "").trim();
    const originalPriceText = $(element).find(".product-strike").text().replace("Rs. ", "").trim();
    const discount = $(element).find(".product-discountPercentage").text().trim();

    const relativeUrl = $(element).find("a").attr("href");
    const url = relativeUrl ? new URL(relativeUrl, "https://www.myntra.com").href : null;

    const price = priceText ? parseInt(priceText.replace(/,/g, ""), 10) : null;
    const originalPrice = originalPriceText ? parseInt(originalPriceText.replace(/,/g, ""), 10) : null;

    if (!brand || !price) return;

    products.push({
      brand,
      name,
      price,
      originalPrice,
      discount,
      url,
    });
  });

  return products;
};

module.exports = myntraScraper;

// Example 
(async () => {
  const results = await myntraScraper("https://www.myntra.com/running-shoes?rawQuery=running%20shoes");
  console.log(results);
})();

