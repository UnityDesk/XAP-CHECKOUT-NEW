<template>
  <div class="background-animation">
    <!-- Animated Background Elements -->
    <div class="movie-posters">
      <div class="poster-row row-1">
        <div class="poster" v-for="(movie, index) in movies" :key="'row1-' + index">
          <img :src="movie.poster" :alt="movie.title" class="poster-image" />
        </div>
        <div class="poster" v-for="(movie, index) in movies" :key="'row1-dup-' + index">
          <img :src="movie.poster" :alt="movie.title" class="poster-image" />
        </div>
        <div class="poster" v-for="(movie, index) in movies" :key="'row1-dup2-' + index">
          <img :src="movie.poster" :alt="movie.title" class="poster-image" />
        </div>
      </div>
      <div class="poster-row row-2">
        <div class="poster" v-for="(movie, index) in movies2" :key="'row2-' + index">
          <img :src="movie.poster" :alt="movie.title" class="poster-image" />
        </div>
        <div class="poster" v-for="(movie, index) in movies2" :key="'row2-dup-' + index">
          <img :src="movie.poster" :alt="movie.title" class="poster-image" />
        </div>
        <div class="poster" v-for="(movie, index) in movies2" :key="'row2-dup2-' + index">
          <img :src="movie.poster" :alt="movie.title" class="poster-image" />
        </div>
      </div>
    </div>

    <div class="particles">
      <div class="particle" v-for="n in particleCount" :key="'particle-' + n"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BackgroundAnimation',
  data() {
    return {
      // Static base URL for all environments
      baseUrl: '/checkout',
      isMobile: false,
    }
  },
  computed: {
    movies() {
      return [
        { title: 'The Shawshank Redemption', poster: `${this.baseUrl}/posters/shawshank-redemption.jpg` },
        { title: 'The Godfather', poster: `${this.baseUrl}/posters/godfather.jpg` },
        { title: 'The Dark Knight', poster: `${this.baseUrl}/posters/dark-knight.jpg` },
        { title: 'Pulp Fiction', poster: `${this.baseUrl}/posters/pulp-fiction.jpg` },
        { title: 'Inception', poster: `${this.baseUrl}/posters/inception.jpg` },
        { title: 'The Matrix', poster: `${this.baseUrl}/posters/matrix.jpg` },
        { title: 'Interstellar', poster: `${this.baseUrl}/posters/interstellar.jpg` },
        { title: 'Fight Club', poster: `${this.baseUrl}/posters/fight-club.jpg` },
        { title: 'Goodfellas', poster: `${this.baseUrl}/posters/goodfellas.jpg` },
        { title: 'Schindler\'s List', poster: `${this.baseUrl}/posters/schindlers-list.jpg` },
        { title: 'Titanic', poster: `${this.baseUrl}/posters/titanic.jpg` },
        { title: 'Avatar', poster: `${this.baseUrl}/posters/avatar.jpg` }
      ]
    },
    movies2() {
      return [
        { title: 'Breaking Bad', poster: `${this.baseUrl}/posters/breaking-bad.jpg` },
        { title: 'Game of Thrones', poster: `${this.baseUrl}/posters/game-of-thrones.jpg` },
        { title: 'Stranger Things', poster: `${this.baseUrl}/posters/stranger-things.jpg` },
        { title: 'Friends', poster: `${this.baseUrl}/posters/friends.jpg` },
        { title: 'Peaky Blinders', poster: `${this.baseUrl}/posters/peaky-blinders.jpg` },
        { title: 'Money Heist', poster: `${this.baseUrl}/posters/money-heist.jpg` },
        { title: 'Narcos', poster: `${this.baseUrl}/posters/narcos.jpg` },
        { title: 'The Walking Dead', poster: `${this.baseUrl}/posters/walking-dead.jpg` },
        { title: 'Ozark', poster: `${this.baseUrl}/posters/ozark.jpg` },
        { title: 'The Witcher', poster: `${this.baseUrl}/posters/witcher.jpg` },
        { title: 'Back to the Future', poster: `${this.baseUrl}/posters/back-to-future.jpg` },
        { title: 'The Shawshank Redemption', poster: `${this.baseUrl}/posters/shawshank-redemption.jpg` }
      ]
    },
    particleCount() {
      // Reduce particles on mobile for better Safari performance
      return this.isMobile ? 10 : 20
    }
  },
  mounted() {
    this.checkMobile()
    this.setupResizeListener()
  },
  methods: {
    checkMobile() {
      this.isMobile = window.innerWidth <= 768
    },
    setupResizeListener() {
      window.addEventListener('resize', this.checkMobile)
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.checkMobile)
  },
}
</script>

<style scoped>
.background-animation {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 1;
  pointer-events: none;
  overflow: hidden;
}

/* Movie poster animations */
.movie-posters {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 4;
  pointer-events: none;
  overflow: hidden;
  will-change: transform;
  transform: translate3d(0, 0, 0);

  .poster-row {
    position: absolute;
    display: flex;
    gap: 24px;
    animation-duration: 120s;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
    animation-fill-mode: both;
    will-change: transform;
    transform: translate3d(0, 0, 0);

    &.row-1 {
      top: 10%;
      animation-name: scrollPostersLeft;
      animation-delay: -20s;
    }

    &.row-2 {
      top: 40%;
      animation-name: scrollPostersRight;
      animation-delay: -40s;
    }

    .poster {
      width: 240px;
      height: 320px;
      border-radius: 12px;
      opacity: 0.25;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
      border: 2px solid rgba(78, 205, 196, 0.3);
      background: linear-gradient(135deg, #1a2332, #0f1729);
      position: relative;
      overflow: hidden;
      will-change: transform;
      transform: translate3d(0, 0, 0);

      .poster-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 10px;
        transition: all 0.3s ease;
        will-change: transform;
        transform: translate3d(0, 0, 0);
      }

      &:hover .poster-image {
        opacity: 0.8;
        transform: scale(1.05);
      }

      @media screen and (max-width: 768px) {
        width: 160px;
        height: 224px;
        opacity: 0.3;
      }

      @media screen and (max-width: 480px) {
        width: 120px;
        height: 180px;
        opacity: 0.2;
      }
    }
  }
}

/* Particle system */
.particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 2;
  pointer-events: none;
  will-change: transform;
  transform: translate3d(0, 0, 0);

  .particle {
    position: absolute;
    width: 2px;
    height: 2px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    animation: floatParticle 15s infinite linear;
    will-change: transform;
    transform: translate3d(0, 0, 0);

    &:nth-child(1) { left: 10%; animation-delay: 0s; }
    &:nth-child(2) { left: 20%; animation-delay: 2s; }
    &:nth-child(3) { left: 30%; animation-delay: 4s; }
    &:nth-child(4) { left: 40%; animation-delay: 6s; }
    &:nth-child(5) { left: 50%; animation-delay: 8s; }
    &:nth-child(6) { left: 60%; animation-delay: 10s; }
    &:nth-child(7) { left: 70%; animation-delay: 12s; }
    &:nth-child(8) { left: 80%; animation-delay: 14s; }
    &:nth-child(9) { left: 90%; animation-delay: 16s; }
    &:nth-child(10) { left: 15%; animation-delay: 18s; }
    &:nth-child(11) { left: 25%; animation-delay: 20s; }
    &:nth-child(12) { left: 35%; animation-delay: 22s; }
    &:nth-child(13) { left: 45%; animation-delay: 24s; }
    &:nth-child(14) { left: 55%; animation-delay: 26s; }
    &:nth-child(15) { left: 65%; animation-delay: 28s; }
    &:nth-child(16) { left: 75%; animation-delay: 30s; }
    &:nth-child(17) { left: 85%; animation-delay: 32s; }
    &:nth-child(18) { left: 95%; animation-delay: 34s; }
    &:nth-child(19) { left: 5%; animation-delay: 36s; }
    &:nth-child(20) { left: 12%; animation-delay: 38s; }
  }

  // Reduce particles on mobile for better performance
  @media screen and (max-width: 768px) {
    .particle:nth-child(n+11) {
      display: none;
    }
  }
}

/* Keyframes for poster animations */
@keyframes scrollPostersLeft {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-100%);
  }
}

@keyframes scrollPostersRight {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(0);
  }
}

@keyframes floatParticle {
  0% {
    transform: translateY(100vh) translateX(0);
    opacity: 0;
  }
  10% {
    opacity: 0.3;
  }
  90% {
    opacity: 0.3;
  }
  100% {
    transform: translateY(-100px) translateX(20px);
    opacity: 0;
  }
}

/* Safari-specific optimizations */
@supports (-webkit-backdrop-filter: blur(1px)) {
  .movie-posters {
    -webkit-backface-visibility: hidden;
    -webkit-perspective: 1000;
  }
  
  .particles {
    -webkit-backface-visibility: hidden;
    -webkit-perspective: 1000;
  }
}

/* Respect user's motion preferences */
@media (prefers-reduced-motion: reduce) {
  .movie-posters .poster-row {
    animation: none;
  }
  
  .particles .particle {
    animation: none;
  }
}
</style>
