/**
 * Check for duplicate entries in a file.
 *
 * Usage: node index.js <filename>
 */

import chalk from "chalk";
import { existsSync, readFileSync, statSync } from "fs";

const filename = process.argv[2];

// Validate input
if (!filename) {
  console.log(chalk.bold.red("Please provide a filename as an argument.\n"));
  process.exit(1);
} else if (!existsSync(filename)) {
  console.log(chalk.bold.red("File does not exist.\n"));
  process.exit(1);
} else if (statSync(filename).isDirectory()) {
  console.log(chalk.bold.red("Path is a directory, expected file.\n"));
  process.exit(1);
}

// Handle Windows and Unix file endings
const phrases = readFileSync(filename, "utf8").split(/\r?\n/).filter(Boolean);
const hasDupes = phrases.some((phrase, index) => phrases.indexOf(phrase) !== index);

if (hasDupes) {
  // Detect duplicates and collect line numbers
  const duplicates = phrases.reduce((acc, phrase, index) => {
    const existing = acc.find((item) => item.phrase === phrase);
    if (existing) {
      existing.lines.push(index + 1); // Add line number (1-based index)
    } else if (phrases.indexOf(phrase) !== index) {
      acc.push({ phrase, lines: [phrases.indexOf(phrase) + 1, index + 1] });
    }
    return acc;
  }, []);

  // Print duplicates with line numbers
  duplicates.forEach((duplicate) => {
    console.log(
      chalk.red(
        `Duplicate entry "${duplicate.phrase}" found on lines ${duplicate.lines.join(", ")}`
      )
    );
  });

  console.log();
} else console.log(chalk.green("No duplicate entries found.\n"));
