import { execa } from "execa";
import fs from "fs-extra";
import chalk from "chalk";
import path from "path";

export async function createProject(answers) {
  const { projectName, language } = answers;

  console.log(chalk.green(`Creating Next.js project: ${projectName}...`));

  // Step 1: Construct `npx create-next-app` command with flags
  const flags = [
    projectName,
    "--language",
    language,
    "--use-npm", // Default to npm; you can modify this to allow selection
    "--eslint",
    "true",
    "--tailwind",
    "true",
    "--typescript",
    "true",
    "--src-dir",
    "true",
    "--app",
    "true",
    "--import-alias",
    "@/*",
    "--turbopack",
    "false",
    "--no-install", // We will handle installations manually
  ];

  await execa("npx", ["create-next-app@latest", ...flags], {
    stdio: "inherit",
  });

  // Step 2: Change directory
  process.chdir(projectName);

  // Step 3: Install additional dependencies
  const dependencies = [];
  const devDependencies = [];

  dependencies.push("tailwindcss", "postcss", "autoprefixer");
  devDependencies.push("eslint", "eslint-config-next");

  if (answers.zkSdk) {
    dependencies.push("@zk-email/sdk");
  }

  if (answers.relayerUtils) {
    dependencies.push("@zk-email/relayer-utils");
  }

  if (dependencies.length) {
    console.log(chalk.blue("Installing dependencies...", dependencies));
    await execa("yarn", ["add", ...dependencies], { stdio: "inherit" });
  }

  if (devDependencies.length) {
    console.log(chalk.blue("Installing dev dependencies...", devDependencies));
    await execa("yarn", ["add", "-D", ...devDependencies], {
      stdio: "inherit",
    });
  }

  console.log(chalk.green("Project setup complete!"));
  console.log(chalk.yellow(`\nRun the following to start your project:\n`));
  console.log(chalk.cyan(`cd ${projectName} && npm run dev`));
}
