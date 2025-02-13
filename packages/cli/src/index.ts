#!/usr/bin/env node

import { program } from "commander";
import { handleInit } from "./commands/init.js";
import { handleAdd } from "./commands/add.js";
import { handleUpdate } from "./commands/update.js";
import { handleBrand } from "./commands/brand.js";

program
  .name("brand-ui")
  .description("CLI to manage shadcn components with base/brand layering")
  .version("0.0.1");

program
  .command("init")
  .description("Initialize the base and brand component structure")
  .action(handleInit);

program
  .command("add")
  .argument("<componentName>", "Name of the shadcn component to add")
  .description("Add a shadcn component to the base folder")
  .action(handleAdd);

program
  .command("update")
  .argument("<componentName>", "Name of the component to update")
  .description("Update a previously added shadcn component")
  .action(handleUpdate);

program
  .command("brand")
  .argument("<subcommand>", "Brand subcommand to run")
  .description("Manage brand overrides or tokens")
  .action(handleBrand);

program.parse(); 
