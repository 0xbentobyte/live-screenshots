import puppeteer from 'puppeteer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url, region } = req.body;

  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto(url);
    await page.setViewport({ width: 1920, height: 1080 });
    const screenshot = await page.screenshot({
      clip: {
        x: region.x,
        y: region.y,
        width: region.width,
        height: region.height
      }
    });

    await browser.close();

    const base64Image = `data:image/png;base64,${screenshot.toString('base64')}`;
    const widgetUrl = `https://your-vercel-deployment-url.vercel.app/api/widget?image=${encodeURIComponent(base64Image)}`;

    res.status(200).json({ widgetUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
