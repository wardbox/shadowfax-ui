import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import { execSync } from 'child_process';

const CONFIG_FILE = '.shadowfax.json';

interface Config {
  baseDir: string;
  brandDir: string;
}

interface ShadcnConfig {
  $schema: string;
  style: string;
  rsc: boolean;
  tsx: boolean;
  tailwind: {
    config: string;
    css: string;
    baseColor: string;
    cssVariables: boolean;
  };
  aliases: {
    utils: string;
    components: string;
  };
}

function resolveAliasPath(aliasPath: string): string {
  // Convert @/components to src/components
  return aliasPath.replace(/^@\//, 'src/');
}

export async function handleInit() {
  try {
    // Run shadcn initialization first
    console.log(chalk.blue('\nInitializing shadcn...'));
    try {
      execSync('pnpm dlx shadcn@latest init', { stdio: 'inherit' });
    } catch (error) {
      console.error(chalk.red('Error running shadcn init. Please ensure you have a Next.js project set up.'));
      process.exit(1);
    }

    // Read shadcn's components.json
    const shadcnConfig = await fs.readJSON('components.json') as ShadcnConfig;
    
    // Default configuration using shadcn's directory structure
    const config: Config = {
      baseDir: '@/components/base',
      brandDir: '@/components/brand'
    };

    // Update shadcn's config to use our base directory
    shadcnConfig.aliases.components = config.baseDir;
    await fs.writeJSON('components.json', shadcnConfig, { spaces: 2 });
    console.log(chalk.green('✓ Updated components.json with base directory'));

    // Create config file
    await fs.writeJSON(CONFIG_FILE, config, { spaces: 2 });
    console.log(chalk.green('✓ Created configuration file:', CONFIG_FILE));

    // Create directories using resolved paths
    const baseDir = resolveAliasPath(config.baseDir);
    const brandDir = resolveAliasPath(config.brandDir);

    await fs.ensureDir(baseDir);
    console.log(chalk.green('✓ Created base components directory:', config.baseDir));
    
    await fs.ensureDir(brandDir);
    console.log(chalk.green('✓ Created brand components directory:', config.brandDir));

    console.log(chalk.blue('\nInitialization complete! You can now start adding components.'));
    console.log(chalk.gray('Try running: shadowfax add button'));

  } catch (error) {
    if (error instanceof Error) {
      console.error(chalk.red('Error during initialization:'), error.message);
    } else {
      console.error(chalk.red('Error during initialization:'), error);
    }
    process.exit(1);
  }
} 
