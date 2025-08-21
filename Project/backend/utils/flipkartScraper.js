const puppeteer = require("puppeteer");
const cheerio = require("cheerio");

let PAGE_URL = "https://www.flipkart.com/search?q=";

const flipkartScraper = async (searchQuery) => {
  const searchUrl = PAGE_URL + encodeURIComponent(searchQuery);
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  await page.goto(searchUrl, { waitUntil: "domcontentloaded" });
  const html = await page.content();
  await browser.close();

  const $ = cheerio.load(html);
  const products = [];

  $(".tUxRFH").each((i, element) => {
    let name = null;
    let price = 0;
    let rating = 0;
    let productUrl = null;
    let imageUrl = null;

    // Name
    name = $(element).find(".KzDlHZ").text().trim() || null;

    // Price
    const priceText = $(element).find(".Nx9bqj").first().text().trim();
    if (priceText) {
      price = parseInt(priceText.replace(/[₹,]/g, ""), 10) || 0;
    }

    // Rating (1 digit after .)
    const ratingText = $(element).find(".XQDdHH").first().text().trim();
    if (ratingText) {
      rating = Math.floor(parseFloat(ratingText) * 10) / 10;
    }

    // Product URL
    const relativeUrl = $(element).find("a.CGtC98").attr("href");
    productUrl = relativeUrl
      ? new URL(relativeUrl, "https://www.flipkart.com").href
      : null;

    // Image URL
    imageUrl = $(element).find("img.DByuf4").attr("src") || null;

    if (!name || !price || !productUrl || !imageUrl) return;
    
    // Only push if essentials exist
    if (name && price && productUrl && imageUrl) {
      products.push({
        name,
        price,
        rating,
        productUrl,
        imageUrl,
        source: "Flipkart",
        searchQuery, // keep original search term
      });
    }
  });

  return products;
};

module.exports = flipkartScraper;

// Example test run
(async () => {
  const results = await flipkartScraper("macbook");
  console.log(results);
})();
