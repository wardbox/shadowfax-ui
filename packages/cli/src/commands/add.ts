import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import { execSync } from 'child_process';

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

function resolveAliasPath(aliasPath: string): string {
  // Convert @/components to src/components
  return aliasPath.replace(/^@\//, 'src/');
}

export async function handleAdd(componentName: string) {
  try {
    // Read configs
    const config: Config = await fs.readJSON('.brand-uirc.json');
    const shadcnConfig = await fs.readJSON('components.json') as ShadcnConfig;
    
    // Convert @ alias paths to real paths
    const baseDir = resolveAliasPath(config.baseDir);
    const brandDir = resolveAliasPath(config.brandDir);
    const originalComponentsDir = resolveAliasPath(shadcnConfig.aliases?.components || 'components');

    // Temporarily restore shadcn's original components directory for the add command
    const tempComponentsDir = 'src/components/ui';
    shadcnConfig.aliases.components = tempComponentsDir;
    await fs.writeJSON('components.json', shadcnConfig, { spaces: 2 });

    // Run shadcn add command
    console.log(chalk.blue(`\nAdding ${componentName} component via shadcn...`));
    try {
      execSync(`pnpm dlx shadcn@latest add ${componentName}`, { stdio: 'inherit' });
    } catch (error) {
      console.error(chalk.red(`Error running shadcn add ${componentName}`));
      process.exit(1);
    }

    // Move the component to our base directory
    const originalPath = path.join(tempComponentsDir, `${componentName}.tsx`);
    const baseComponentPath = path.join(baseDir, `${componentName}.tsx`);
    const brandComponentPath = path.join(brandDir, `${componentName}.tsx`);

    // Create directories if they don't exist
    await fs.ensureDir(baseDir);
    await fs.ensureDir(brandDir);

    // Move the original component to base directory
    await fs.move(originalPath, baseComponentPath, { overwrite: true });
    
    // Fix the utils import in the base component
    let baseContent = await fs.readFile(baseComponentPath, 'utf8');
    baseContent = baseContent.replace('from "src/lib/utils"', 'from "@/lib/utils"');
    await fs.writeFile(baseComponentPath, baseContent);
    
    console.log(chalk.green('✓ Moved and updated base component:', baseComponentPath));

    // Create brand override with default styling
    const capitalizedName = componentName.charAt(0).toUpperCase() + componentName.slice(1);
    const brandComponent = `import { ${capitalizedName} as Base${capitalizedName}, type ${capitalizedName}Props } from "../base/${componentName}"
import { twMerge } from "tailwind-merge"

/**
 * This is your brand's ${componentName} component.
 * It wraps the base ${componentName} and can be enhanced with:
 * 
 * 1. Extended props for brand-specific features:
 *    interface Brand${capitalizedName}Props extends ${capitalizedName}Props {
 *      // Add your brand-specific props here
 *      // Example: isLoading?: boolean
 *    }
 * 
 * 2. Custom styling:
 *    - Apply your brand's colors, spacing, and typography
 *    - Add hover, focus, and active states
 *    - Style different variants
 * 
 * 3. Additional functionality:
 *    - Add brand-specific features
 *    - Enhance with additional behaviors
 *    - Wrap with brand-specific logic
 */
export function ${capitalizedName}({ className, ...props }: ${capitalizedName}Props) {
  return (
    <Base${capitalizedName} 
      {...props} 
      className={twMerge(
        // Add your brand-specific styles here
        className
      )}
    />
  )
}`;

    await fs.writeFile(brandComponentPath, brandComponent);
    console.log(chalk.green('✓ Created brand component:', brandComponentPath));

    // Clean up the temporary ui directory if it's empty
    const uiDir = path.dirname(originalPath);
    const uiFiles = await fs.readdir(uiDir);
    if (uiFiles.length === 0) {
      await fs.remove(uiDir);
    }

    // Restore our base directory in shadcn config
    shadcnConfig.aliases.components = config.baseDir;
    await fs.writeJSON('components.json', shadcnConfig, { spaces: 2 });

    console.log(chalk.blue('\nComponent added successfully!'));
    console.log(chalk.gray('You can now customize the brand override in:', brandComponentPath));

  } catch (error) {
    if (isFileError(error) && error.code === 'ENOENT' && error.path === '.brand-uirc.json') {
      console.error(chalk.red('Error: Project not initialized. Run "brand-ui init" first.'));
    } else {
      console.error(chalk.red('Error adding component:'), error);
    }
    process.exit(1);
  }
} 
