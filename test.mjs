import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import assert from "node:assert";

const repoRoot = path.resolve(".");

console.log("🧪 Running ApplyPilot repository sanity test suite...");

// 1. Check for banned upstream usernames/emails
const bannedStrings = ["Pickle-Pixel", "hamzeh.k.muhiar@gmail.com"];
const textExtensions = [".md", ".toml", ".json", ".py", ".cff", ".yaml", ".yml", ".txt"];

function scanDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === ".git" || entry.name === "node_modules" || entry.name === "__pycache__") continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanDir(fullPath);
    } else {
      const ext = path.extname(entry.name);
      if (textExtensions.includes(ext) || entry.name === "LICENSE") {
        const content = fs.readFileSync(fullPath, "utf8");
        for (const banned of bannedStrings) {
          assert(
            !content.includes(banned),
            `Banned string '${banned}' found in ${fullPath}`
          );
        }
      }
    }
  }
}

scanDir(repoRoot);
console.log("  ✅ Zero banned upstream references found.");

// 2. Check metadata files
const requiredFiles = [
  "README.md",
  "LICENSE",
  "MAINTAINERS.md",
  "CITATION.cff",
  "pyproject.toml",
  "package.json",
  "docs/demo.mp4"
];

for (const file of requiredFiles) {
  assert(fs.existsSync(path.join(repoRoot, file)), `Missing expected file: ${file}`);
}
console.log("  ✅ All required metadata files and demo video exist.");

// 3. Verify Abdullah Formuli attribution
const readme = fs.readFileSync(path.join(repoRoot, "README.md"), "utf8");
assert(readme.includes("Abdullah Formuli"), "README.md missing Abdullah Formuli");
assert(readme.includes("authrain-cloud-abdullahformuli"), "README.md missing GitHub handle");

const pyproject = fs.readFileSync(path.join(repoRoot, "pyproject.toml"), "utf8");
assert(pyproject.includes("Abdullah Formuli"), "pyproject.toml missing Abdullah Formuli");
assert(pyproject.includes("authrainmedia@gmail.com"), "pyproject.toml missing email");

const maintainers = fs.readFileSync(path.join(repoRoot, "MAINTAINERS.md"), "utf8");
assert(maintainers.includes("Abdullah Formuli"), "MAINTAINERS.md missing Abdullah Formuli");
assert(maintainers.includes("External contributions or third-party pull requests are not accepted"), "MAINTAINERS.md missing strict policy");

const citation = fs.readFileSync(path.join(repoRoot, "CITATION.cff"), "utf8");
assert(citation.includes("Formuli"), "CITATION.cff missing Formuli");
assert(citation.includes("authrainmedia@gmail.com"), "CITATION.cff missing email");

console.log("  ✅ Abdullah Formuli attribution verified across all manifests.");

// 4. Verify Python compilation
try {
  execSync("python3 -m compileall src", { stdio: "pipe" });
  console.log("  ✅ All Python source files compiled with 0 syntax errors.");
} catch (err) {
  assert.fail(`Python compileall failed: ${err.message}`);
}

console.log("\n🎉 All 4 validation suites passed cleanly!");
