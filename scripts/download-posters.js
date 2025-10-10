const https = require('https');
const fs = require('fs');
const path = require('path');

// Famous movies and series with their TMDB poster paths
const posters = [
  // Movies
  { name: 'shawshank-redemption', url: 'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg' },
  { name: 'godfather', url: 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg' },
  { name: 'dark-knight', url: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg' },
  { name: 'pulp-fiction', url: 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg' },
  { name: 'inception', url: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg' },
  { name: 'matrix', url: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg' },
  { name: 'interstellar', url: 'https://image.tmdb.org/t/p/w500/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg' },
  { name: 'fight-club', url: 'https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg' },
  { name: 'forrest-gump', url: 'https://image.tmdb.org/t/p/w500/arw2vcBveWOVTi6BsNBTeM8X1cl.jpg' },
  { name: 'goodfellas', url: 'https://image.tmdb.org/t/p/w500/aKuFiU82s5ISJpGZp7YkIr3kCUd.jpg' },
  { name: 'schindlers-list', url: 'https://image.tmdb.org/t/p/w500/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg' },
  { name: 'titanic', url: 'https://image.tmdb.org/t/p/w500/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg' },
  { name: 'avatar', url: 'https://image.tmdb.org/t/p/w500/jRXYjXNq0Cs2TcJjLkki24MLp7u.jpg' },
  { name: 'jurassic-park', url: 'https://image.tmdb.org/t/p/w500/oU7Oq2kFAAlGqbP4U9pbOySIX9r.jpg' },
  { name: 'back-to-future', url: 'https://image.tmdb.org/t/p/w500/fNOH9f1aA7XRTzl1sAOx9iF553Q.jpg' },
  
  // TV Series
  { name: 'breaking-bad', url: 'https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg' },
  { name: 'game-of-thrones', url: 'https://image.tmdb.org/t/p/w500/u3bZgnGQ9T01sWNhyveQz0wH0Hl.jpg' },
  { name: 'stranger-things', url: 'https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg' },
  { name: 'friends', url: 'https://image.tmdb.org/t/p/w500/f496cm9enuEsZkSPzCwnTESEK5s.jpg' },
  { name: 'office', url: 'https://image.tmdb.org/t/p/w500/7DJKHzAiZ0l7O4quJkxAXW40Yjh.jpg' },
  { name: 'peaky-blinders', url: 'https://image.tmdb.org/t/p/w500/vUUqzWa2LnHIVqkaKVlVGkVcZIW.jpg' },
  { name: 'money-heist', url: 'https://image.tmdb.org/t/p/w500/reEMJA1uzscCbkpeRJeTT2bjqUp.jpg' },
  { name: 'crown', url: 'https://image.tmdb.org/t/p/w500/1M876Kj8VfK1M3ePmVaObqwRHhx.jpg' },
  { name: 'narcos', url: 'https://image.tmdb.org/t/p/w500/7vjaCdMw15FEbXyLQTVa04URsPm.jpg' },
  { name: 'house-of-cards', url: 'https://image.tmdb.org/t/p/w500/hKWxWjF0SAWmxXrySX1dXv5tVhJ.jpg' },
  { name: 'westworld', url: 'https://image.tmdb.org/t/p/w500/y55oBgf6Vry0u3a0B7T5zQl7n1R.jpg' },
  { name: 'black-mirror', url: 'https://image.tmdb.org/t/p/w500/7WRpQyYINRFq3eLxG5H5X5F3Q1O.jpg' },
  { name: 'walking-dead', url: 'https://image.tmdb.org/t/p/w500/rqeYMLryjcawh2JeRpCVUDXYM5b.jpg' },
  { name: 'better-call-saul', url: 'https://image.tmdb.org/t/p/w500/fC2HDm5t0kHl7mTm7jxMR31bqby.jpg' },
  { name: 'ozark', url: 'https://image.tmdb.org/t/p/w500/mY7SeH4HFFxW1hiI6cWuwCRKptN.jpg' }
];

// Create static/posters directory if it doesn't exist
const postersDir = path.join(__dirname, '..', 'static', 'posters');
if (!fs.existsSync(postersDir)) {
  fs.mkdirSync(postersDir, { recursive: true });
}

// Function to download a single poster
function downloadPoster(poster) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(postersDir, `${poster.name}.jpg`);
    
    // Skip if file already exists
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

// Download all posters
async function downloadAllPosters() {
  console.log('Starting poster downloads...\n');
  
  for (const poster of posters) {
    try {
      await downloadPoster(poster);
      // Add small delay to be respectful to TMDB servers
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.log(`Failed to download ${poster.name}:`, error.message);
    }
  }
  
  console.log('\n✓ All poster downloads completed!');
  console.log(`Posters saved to: ${postersDir}`);
}

// Run the download
downloadAllPosters().catch(console.error);
