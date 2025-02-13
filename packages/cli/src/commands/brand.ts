import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';

interface Config {
  baseDir: string;
  brandDir: string;
}

interface FileError {
  code: string;
  path: string;
}

function isFileError(error: unknown): error is FileError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'path' in error
  );
}

export async function handleBrand(subcommand: string, ...args: string[]) {
  try {
    // Read config
    const config: Config = await fs.readJSON('.brand-uirc.json');

    switch (subcommand) {
      case 'list':
        await listBrandOverrides(config);
        break;
      default:
        console.error(chalk.red(`Unknown subcommand: ${subcommand}`));
        console.log(chalk.gray('Available subcommands: list'));
        process.exit(1);
    }

  } catch (error) {
    if (isFileError(error) && error.code === 'ENOENT' && error.path === '.brand-uirc.json') {
      console.error(chalk.red('Error: Project not initialized. Run "brand-ui init" first.'));
    } else {
      console.error(chalk.red('Error in brand command:'), error);
    }
    process.exit(1);
  }
}

async function listBrandOverrides(config: Config) {
  try {
    const brandFiles = await fs.readdir(config.brandDir);
    
    if (brandFiles.length === 0) {
      console.log(chalk.yellow('No brand overrides found.'));
      console.log(chalk.gray('Try adding a component first with: brand-ui add button'));
      return;
    }

    console.log(chalk.blue('\nBrand overrides:'));
    for (const file of brandFiles) {
      if (file.endsWith('.tsx')) {
        const componentName = path.basename(file, '.tsx');
        console.log(chalk.green(`✓ ${componentName}`));
      }
    }
  } catch (error) {
    console.error(chalk.red('Error listing brand overrides:'), error);
    process.exit(1);
  }
} 
