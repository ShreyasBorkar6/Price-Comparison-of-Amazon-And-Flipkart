const amazonScraper = require("../utils/amazonScraper");
const flipkartScraper = require("../utils/flipkartScraper");
//const History = require('../models/History') 
// Helper: Compare products
// console.log("Product coltroller");



const compareProducts = (products) => {
  if (!products || products.length === 0) {
    return {
      bestOverall: null,
      bestByPrice: null,
      bestByRating: null,
      allProducts: [],
    };
  }

  const sortedByPrice = [...products].sort((a, b) => a.price - b.price);
  const sortedByRating = [...products].sort(
    (a, b) => (b.rating || 0) - (a.rating || 0)
  );

  const rankedProducts = products.map((product) => {
    const priceRank =
      sortedByPrice.findIndex((p) => p.productUrl === product.productUrl) + 1;
    const ratingRank =
      sortedByRating.findIndex((p) => p.productUrl === product.productUrl) + 1;

    const combinedScore =
      product.rating === null || isNaN(product.rating)
        ? priceRank + products.length * 2 // penalty if rating missing
        : priceRank + (products.length - ratingRank);

    return { ...product, combinedScore };
  });

  rankedProducts.sort((a, b) => a.combinedScore - b.combinedScore);

  return {
    bestOverall: rankedProducts[0] || null,
    bestByPrice: sortedByPrice[0] || null,
    bestByRating: sortedByRating[0] || null,
    allProducts: products,
  };
};

// @desc    Search Amazon + Flipkart products (no DB save)
// @route   GET /api/products/search?query=<search_term>
// @access  Public
exports.searchProducts = async (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res
      .status(400)
      .json({ message: "Please provide a search query." });
  }

  let allScrapedProducts = [];
  

  try {
    const results = await Promise.allSettled([
      amazonScraper(query),
      flipkartScraper(query),
    ]);

    results.forEach((result) => {
      if (result.status === "fulfilled" && Array.isArray(result.value)) {
        allScrapedProducts = allScrapedProducts.concat(result.value);
      } else if (result.status === "rejected") {
        console.error("Scraper failed:", result.reason);
      }
    });

    if (allScrapedProducts.length === 0) {
      return res.status(404).json({
        message: `No products found for "${query}" from Amazon or Flipkart.`,
      });
    }

    // Directly compare results (no DB insert)
    const comparisonResult = compareProducts(allScrapedProducts);

    res.json(comparisonResult);
  } catch (error) {
    console.error("Error in searchProducts controller:", error);
    res
      .status(500)
      .json({ message: "Internal server error while processing search." });
  }
};
