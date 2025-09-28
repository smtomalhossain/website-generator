const fs = require("fs-extra");
const csv = require("csv-parser");
const path = require("path");

const results = [];
const buildDir = path.join(__dirname, "build");

// Hero section random words
const heroOptions = ["Quick", "Fast", "Speedy"];

// Function to replace placeholders in all .js and .html files
function replacePlaceholders(siteDir, replacements) {
  const srcDir = path.join(siteDir, "src");
  const publicDir = path.join(siteDir, "public");

  function processDir(dir) {
    const files = fs.readdirSync(dir);

    files.forEach((file) => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        processDir(fullPath); // recursion
      } else if (file.endsWith(".js") || file.endsWith(".html")) {
        let content = fs.readFileSync(fullPath, "utf8");

        Object.keys(replacements).forEach((key) => {
          const regex = new RegExp(`{{${key}}}`, "g");
          content = content.replace(regex, replacements[key] || "");
        });

        fs.writeFileSync(fullPath, content, "utf8");
      }
    });
  }

  processDir(srcDir);
  processDir(publicDir);
}

// Read CSV file
fs.createReadStream(path.join(__dirname, "websites.csv"))
  .pipe(csv())
  .on("data", (data) => results.push(data))
  .on("end", async () => {
    await fs.remove(buildDir); // clear old build
    await fs.mkdirp(buildDir);

    results.forEach((site) => {
      const heroWord =
        heroOptions[Math.floor(Math.random() * heroOptions.length)];
      const heroText = `${heroWord} delivery service in dhaka.`;

      // Create output folder for this site
      const siteDir = path.join(buildDir, site.domain);
      fs.copySync(path.join(__dirname, "template"), siteDir, { overwrite: true });

      // Replace placeholders in all .js & .html files
      replacePlaceholders(siteDir, {
        hero: heroText,
        phone: site.phone,
        address: site.address,
        description: site.description,
        title: site.title,
      });

      console.log(`✅ Generated site for ${site.domain}`);
    });

    console.log("\nAll done. Check the /build folder.");
  })
  .on("error", (err) => {
    console.error("Error reading CSV:", err);
  });
