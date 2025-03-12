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

  // Add shadcn dependencies
  dependencies.push(
    "tailwindcss",
    "postcss",
    "autoprefixer",
    "@radix-ui/react-slot",
    "class-variance-authority",
    "clsx",
    "tailwind-merge",
    "@radix-ui/react-alert-dialog",
    "@radix-ui/react-checkbox",
    "@radix-ui/react-dropdown-menu",
    "@radix-ui/react-icons",
    "@radix-ui/react-label",
    "@radix-ui/react-radio-group",
    "@radix-ui/react-select",
    "@radix-ui/react-separator",
    "@radix-ui/react-slot",
    "@radix-ui/react-switch",
    "@radix-ui/react-tooltip",
    "@react-oauth/google",
    "@zk-email/sdk",
    "framer-motion",
    "lottie-web",
    "lucide-react",
    "react-toastify",
    "tailwindcss-animate"
  );
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

  // Add template page content
  const pageTemplate = `export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">
          Welcome to your ZK Email Project
        </h1>
        
        <div className="bg-white/5 p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
          Edit{" "}
          <code className="bg-gray-800 px-2 py-1 rounded">
            src/app/page.tsx
          </code>
        </div>
      </div>
    </main>
  )
}`;

  // Remove leading slash on Windows
  const currentDir = path.dirname(new URL(import.meta.url).pathname);
  const normalizedDir =
    process.platform === "win32" ? currentDir.slice(1) : currentDir;

  // Add relayer API template if relayerUtils is selected
  if (answers.relayerUtils) {
    const relayerApiTemplate = await fs.readFile(
      path.join(normalizedDir, "templates", "relayerApi.ts"),
      "utf-8"
    );

    // Create lib directory
    const libDir = path.join(process.cwd(), "src", "lib");
    await fs.ensureDir(libDir);

    // Write the relayer API template
    const relayerApiPath = path.join(libDir, "relayerApi.ts");
    await fs.writeFile(relayerApiPath, relayerApiTemplate);

    console.log(chalk.blue("Created relayer API utility file"));
  }

  // Write the template to the page.tsx file
  const pagePath = path.join(process.cwd(), "src", "app", "page.tsx");
  await fs.writeFile(pagePath, pageTemplate);

  const source = path.join(normalizedDir, "boilerplateContent"); // Folder to copy
  const destination = path.join(process.cwd()); // Destination folder

  console.log(source, destination);

  fs.copy(source, destination)
    .then(() => console.log("Boilerplate copied successfully!"))
    .catch((err) => console.error("Error copying boilerplate:", err));

  console.log(chalk.green("Project setup complete!"));
  console.log(chalk.yellow(`\nRun the following to start your project:\n`));
  console.log(chalk.cyan(`cd ${projectName} && npm run dev`));
}
