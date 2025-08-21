const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
let PAGE_URL = "https://www.amazon.in/s?k=";
const amazonScraper = async (add) => {
  PAGE_URL = PAGE_URL + add;
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.goto(PAGE_URL);
  const html = await page.content();
  await browser.close();
  const $ = cheerio.load(html);
  const products = [];
  $(".s-widget-container").each((i, element) => {
    const titleElement = $(element).find(".s-title-instructions-style");
    const priceElement = $(element).find(".a-price > span").first();
    const ratingElement = $(element).find(".a-size-small").first(); // New code to find and extract the URL
    const urlElement = $(element).find('[data-action="puis-link"]');
    let url = null;
    if (urlElement.length) {
      const dataPuisLink = urlElement.attr("data-puis-link");
      try {
        const linkData = JSON.parse(dataPuisLink);
        url = linkData.url;
      } catch (e) {
        console.error("Failed to parse data-puis-link attribute", e);
      }
    }
    const title = titleElement.text();
    const priceText = priceElement.text();
    const price = priceText
      ? parseInt(priceText.replace(/[₹,]/g, ""), 10)
      : null;
    const rating = ratingElement.text();
    if (!title || !price) {
      return;
    }
    products.push({
      title,
      price,
      rating,
      url,
    });
  });
  console.log(products);
  
};


amazonScraper("macbook+pro");