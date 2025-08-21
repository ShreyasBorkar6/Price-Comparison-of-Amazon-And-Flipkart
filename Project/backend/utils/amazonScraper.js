const puppeteer = require("puppeteer");
const cheerio = require("cheerio");

let PAGE_URL = "https://www.amazon.in/s?k=";

const amazonScraper = async (searchQuery) => {
  const searchUrl = PAGE_URL + encodeURIComponent(searchQuery);
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  await page.goto(searchUrl, { waitUntil: "domcontentloaded" });
  const html = await page.content();
  await browser.close();

  const $ = cheerio.load(html);
  const products = [];

  $(".s-widget-container").each((i, element) => {
    const name = $(element).find(".s-title-instructions-style").text().trim();
    const priceText = $(element).find(".a-price > span").first().text().trim();
    const ratingText = $(element).find(".a-size-small").first().text().trim();
    const imageUrl = $(element).find("img.s-image").attr("src");

    const relativeUrl = $(element).find(".a-text-normal").attr("href");

    // skip if mandatory fields missing
    if (!name || !priceText || !relativeUrl || !imageUrl) return;

    const price = parseInt(priceText.replace(/[₹,]/g, ""), 10);
    const rating = ratingText
      ? Math.floor(parseFloat(ratingText.replace(/[^0-9.]/g, "")) * 10) / 10
      : 0;

    const productUrl = new URL(relativeUrl, "https://www.amazon.in").href;

    products.push({
      name,
      price,
      rating,
      productUrl,
      imageUrl,
      source: "Amazon", // matches Product model
      searchQuery,      // store original query
    });
  });

  return products;
};

module.exports = amazonScraper;

// Example run
(async () => {
  const results = await amazonScraper("books");
  console.log(results);
})();
