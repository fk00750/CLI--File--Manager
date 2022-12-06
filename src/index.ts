import {
  prompt,
  createPromptModule,
  PromptModule,
  Answers,
} from "inquirer";
import figlet from "figlet";
import { exec } from "child_process";
import { existsSync, mkdirSync } from "fs";

console.log(figlet.textSync("File Manager"));

class File__Manager {
  prompt: PromptModule;
  createNewPrompt: (options: any) => Promise<Answers>;
  constructor() {
    this.prompt = createPromptModule();
    this.createNewPrompt = async (options) => {
      return this.prompt(options);
    };
  }

  async createDirectory(directoryName: string) {
    const directories = directoryName.split(" ");
    directories.map((name) => {
      if (!existsSync(name)) {
        mkdirSync(name);
        console.log(`${name} directory has been created successfully`);
      }
    });
  }

  async listDir() {
    try {
      exec("ls -lt", (error, stdOut, stderr) => {
        if (error) {
          console.log(`exec error ${error}`);
        }

        if (stdOut) {
          console.log(stdOut);
        }

        if (stderr) {
          console.log(`std err ${stderr}`);
        }
      });
    } catch (error) {
      console.log("Error in listing dir", error);
    }
  }
}

async function main() {
  const initialPrompt = prompt([
    {
      type: "list",
      name: "task",
      message: "What do you want to do",
      choices: ["Create Directory", "List Directory Content"],
    },
  ]);

  const answers = await initialPrompt;

  const fileManager = new File__Manager();

  if (answers.task === "List Directory Content") {
    fileManager.listDir();
  }

  if (answers.task === "Create Directory") {
    const directoryName = await fileManager.createNewPrompt({
      name: "dirName",
      message: "Enter Directory Name?",
    });
    fileManager.createDirectory(directoryName.dirName);
  }
}

main();
