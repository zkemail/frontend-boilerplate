#!/usr/bin/env node

import inquirer from "inquirer";
import { createProject } from "../src/createProject.js";

const questions = [
  {
    type: "input",
    name: "projectName",
    message: "Enter your project name:",
  },
  {
    type: "list",
    name: "language",
    message: "Choose your language:",
    choices: ["JavaScript", "TypeScript"],
  },
  {
    type: "confirm",
    name: "zkSdk",
    message: "Do you want to add zkSdk?",
  },
  {
    type: "confirm",
    name: "relayerUtils",
    message: "Do you want to add relayerUtils?",
  },
];

async function main() {
  const answers = await inquirer.prompt(questions);
  await createProject(answers);
}

main();
