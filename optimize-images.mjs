import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import { join } from 'path';

const INPUT_DIR = './client/public/slideshow';
const OUTPUT_DIR = './client/public/slideshow-optimized';
const TARGET_WIDTH = 1920; // Full HD width (4K would be 3840 but that's too large for web)
const TARGET_HEIGHT = 1080;
const QUALITY = 90;

async function optimizeImage(inputPath, outputPath) {
  try {
    const metadata = await sharp(inputPath).metadata();
    
    console.log(`Processing: ${inputPath}`);
    console.log(`Original: ${metadata.width}x${metadata.height}, ${metadata.format}`);

    // Skip if image is too small (likely corrupted)
    if (metadata.width < 100 || metadata.height < 100) {
      console.log(`⚠️  Skipping (too small): ${inputPath}`);
      return;
    }

    // Calculate dimensions to maintain aspect ratio
    let width = TARGET_WIDTH;
    let height = TARGET_HEIGHT;
    
    if (metadata.width && metadata.height) {
      const aspectRatio = metadata.width / metadata.height;
      if (aspectRatio > 16/9) {
        // Wider than 16:9
        width = TARGET_WIDTH;
        height = Math.round(TARGET_WIDTH / aspectRatio);
      } else {
        // Taller than 16:9
        height = TARGET_HEIGHT;
        width = Math.round(TARGET_HEIGHT * aspectRatio);
      }
    }

    // Process image: resize, enhance, convert to WebP
    await sharp(inputPath)
      .resize(width, height, {
        fit: 'cover',
        position: 'center',
        kernel: 'lanczos3' // Best quality upscaling
      })
      .sharpen() // Enhance sharpness
      .webp({ quality: QUALITY, effort: 6 }) // High quality WebP
      .toFile(outputPath);

    const stats = await stat(outputPath);
    const sizeKB = Math.round(stats.size / 1024);
    
    console.log(`✅ Saved: ${outputPath} (${width}x${height}, ${sizeKB}KB)`);
    
  } catch (error) {
    console.error(`❌ Error processing ${inputPath}:`, error.message);
  }
}

async function main() {
  try {
    // Create output directory
    await import('fs').then(fs => {
      if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
      }
    });

    // Get all image files
    const files = await readdir(INPUT_DIR);
    const imageFiles = files.filter(file => 
      /\.(jpg|jpeg|png|webp)$/i.test(file)
    );

    console.log(`\n🎨 Found ${imageFiles.length} images to optimize\n`);

    // Process each image
    for (const file of imageFiles) {
      const inputPath = join(INPUT_DIR, file);
      const outputFile = file.replace(/\.(jpg|jpeg|png|webp)$/i, '.webp');
      const outputPath = join(OUTPUT_DIR, outputFile);
      
      await optimizeImage(inputPath, outputPath);
    }

    console.log(`\n✨ Optimization complete! Check ${OUTPUT_DIR}\n`);
    
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

main();
