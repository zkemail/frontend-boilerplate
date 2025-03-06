import { execa } from "execa";
import fs from "fs-extra";
import path from "path";
import chalk from "chalk";

export async function createProject(answers) {
  const projectName = "my-next-app";
  console.log(chalk.green(`Creating Next.js project: ${projectName}...`));

  // Step 1: Run create-next-app
  await execa(
    "npx",
    [
      "create-next-app@latest",
      projectName,
      answers.language === "TypeScript" ? "--ts" : "--js",
    ],
    {
      stdio: "inherit",
    }
  );

  // Step 2: Change directory
  process.chdir(projectName);

  // Step 3: Install additional dependencies
  const dependencies = [];
  const devDependencies = [];

  if (answers.tailwind) {
    dependencies.push("tailwindcss", "postcss", "autoprefixer");
  }

  if (answers.eslint) {
    devDependencies.push("eslint", "eslint-config-next");
  }

  if (answers.prettier) {
    devDependencies.push("prettier");
  }

  if (answers.zkSdk) {
    devDependencies.push("@zk-email/sdk");
  }

  if (answers.relayerUtils) {
    devDependencies.push("@zk-email/relayer-utils");
  }

  if (dependencies.length) {
    console.log(chalk.blue("Installing dependencies..."));
    await execa("npm", ["install", ...dependencies], { stdio: "inherit" });
  }

  if (devDependencies.length) {
    console.log(chalk.blue("Installing dev dependencies..."));
    await execa("npm", ["install", "-D", ...devDependencies], {
      stdio: "inherit",
    });
  }

  console.log(chalk.green("Project setup complete!"));
  console.log(chalk.yellow(`\nRun the following to start your project:\n`));
  console.log(chalk.cyan(`cd ${projectName} && npm run dev`));
}
