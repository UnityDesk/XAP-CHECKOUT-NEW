const https = require('https');
const fs = require('fs');
const path = require('path');

// Backup posters with alternative URLs
const backupPosters = [
  { name: 'forrest-gump', url: 'https://image.tmdb.org/t/p/w500/arw2vcBveWOVTi6BsNBTeM8X1cl.jpg' },
  { name: 'jurassic-park', url: 'https://image.tmdb.org/t/p/w500/oU7Oq2kFAAlGqbP4U9pbOySIX9r.jpg' },
  { name: 'office', url: 'https://image.tmdb.org/t/p/w500/7DJKHzAiZ0l7O4quJkxAXW40Yjh.jpg' },
  { name: 'crown', url: 'https://image.tmdb.org/t/p/w500/1M876Kj8VfK1M3ePmVaObqwRHhx.jpg' },
  { name: 'house-of-cards', url: 'https://image.tmdb.org/t/p/w500/hKWxWjF0SAWmxXrySX1dXv5tVhJ.jpg' },
  { name: 'westworld', url: 'https://image.tmdb.org/t/p/w500/y55oBgf6Vry0u3a0B7T5zQl7n1R.jpg' },
  { name: 'black-mirror', url: 'https://image.tmdb.org/t/p/w500/7WRpQyYINRFq3eLxG5H5X5F3Q1O.jpg' },
  { name: 'better-call-saul', url: 'https://image.tmdb.org/t/p/w500/fC2HDm5t0kHl7mTm7jxMR31bqby.jpg' },
  { name: 'witcher', url: 'https://image.tmdb.org/t/p/w500/7vjaCdMw15FEbXyLQTVa04URsPm.jpg' },
  { name: 'mandalorian', url: 'https://image.tmdb.org/t/p/w500/eU1i6eHXlzMOlEq0X1i4YgqHUBc.jpg' }
];

const postersDir = path.join(__dirname, '..', 'static', 'posters');

function downloadPoster(poster) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(postersDir, `${poster.name}.jpg`);
    
    if (fs.existsSync(filePath)) {
      console.log(`✓ ${poster.name} already exists, skipping...`);
      resolve();
      return;
    }

    const file = fs.createWriteStream(filePath);
    
    https.get(poster.url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`✓ Downloaded: ${poster.name}.jpg`);
          resolve();
        });
      } else {
        console.log(`✗ Failed to download ${poster.name}: ${response.statusCode}`);
        reject(new Error(`HTTP ${response.statusCode}`));
      }
    }).on('error', (err) => {
      console.log(`✗ Error downloading ${poster.name}:`, err.message);
      reject(err);
    });
  });
}

async function downloadBackupPosters() {
  console.log('Downloading backup posters...\n');
  
  for (const poster of backupPosters) {
    try {
      await downloadPoster(poster);
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.log(`Failed to download ${poster.name}:`, error.message);
    }
  }
  
  console.log('\n✓ Backup poster downloads completed!');
}

downloadBackupPosters().catch(console.error);
