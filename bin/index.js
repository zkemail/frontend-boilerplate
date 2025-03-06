#!/usr/bin/env node

import inquirer from "inquirer";
import { createProject } from "../src/createProject.js";

const questions = [
  {
    type: "list",
    name: "language",
    message: "Choose your language:",
    choices: ["JavaScript", "TypeScript"],
  },
  {
    type: "confirm",
    name: "tailwind",
    message: "Do you want to install Tailwind CSS?",
  },
  {
    type: "confirm",
    name: "eslint",
    message: "Do you want to set up ESLint?",
  },
  {
    type: "confirm",
    name: "prettier",
    message: "Do you want to set up Prettier?",
  },
  {
    type: "confirm",
    name: "zk-sdk",
    message: "Do you want to add zk-sdk?",
  },
  {
    type: "confirm",
    name: "relayer-utils",
    message: "Do you want to add relayer-utils?",
  },
];

async function main() {
  const answers = await inquirer.prompt(questions);
  await createProject(answers);
}

main();
