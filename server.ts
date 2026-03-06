import express from "express";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API routes FIRST
  app.get("/api/news/random", async (req, res) => {
    try {
      const apiKey = process.env.NEWS_API_KEY || "2ec4384d64de4043ab5496cfaf3b8a3c";
      const response = await fetch(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`);
      
      if (!response.ok) {
        throw new Error(`NewsAPI responded with status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.articles && data.articles.length > 0) {
        // Filter out articles with missing URLs or [Removed]
        const validArticles = data.articles.filter((a: any) => a.url && a.title !== "[Removed]");
        
        if (validArticles.length > 0) {
          const randomIndex = Math.floor(Math.random() * validArticles.length);
          const randomArticle = validArticles[randomIndex];
          res.json({ url: randomArticle.url });
          return;
        }
      }
      
      res.status(404).json({ error: "No valid articles found" });
    } catch (error) {
      console.error("Error fetching news:", error);
      res.status(500).json({ error: "Failed to fetch news" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static("dist"));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
