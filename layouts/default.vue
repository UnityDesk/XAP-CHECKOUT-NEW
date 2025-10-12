<template>
  <div class="layout-container">
    <!-- Persistent Background Animation - Key ensures it doesn't re-render on language change -->
    <div class="background-animation-persistent" :key="animationKey">
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
    
    <div class="content-wrapper">
      <client-only>
        <Header></Header>
        <Nuxt id="UI" />
      </client-only>
    </div>
    
    <client-only>
      <Footer></Footer>
    </client-only>
  </div>
</template>

<style>
html {
  font-family: 'Inter', 'Geist Sans', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif !important;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

.layout-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.background-animation-persistent {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: -1;
  pointer-events: none;
  overflow: hidden;
}

.content-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 10;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}

.button--green {
  display: inline-block;
  border-radius: 8px;
  border: 1px solid #4ECDC4;
  color: #0a1929;
  background-color: #4ECDC4;
  text-decoration: none;
  padding: 12px 24px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.button--green:hover {
  color: #0a1929;
  background-color: #3bb5ad;
  transform: scale(1.02);
}

.button--grey {
  display: inline-block;
  border-radius: 8px;
  border: 1px solid rgba(78, 205, 196, 0.3);
  color: #ffffff;
  background-color: rgba(15, 23, 42, 0.6);
  text-decoration: none;
  padding: 12px 24px;
  margin-left: 15px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.button--grey:hover {
  color: #ffffff;
  background-color: rgba(78, 205, 196, 0.2);
  border-color: #4ECDC4;
}
</style>

<script>
import Header from '../components/header/header'
import Footer from '../components/footer/footer'
import { mapActions } from 'vuex'

export default {
  components: {
    Header,
    Footer,
  },
  data() {
    return {
      // Static base URL for all environments
      baseUrl: '/checkout',
      isMobile: false,
      // Animation key that persists across language changes
      animationKey: 'persistent',
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
    this.getCurrency(this.$t('currency.currency'))
    this.fetchCurrencies()
    this.checkMobile()
    this.setupResizeListener()
  },
  methods: {
    ...mapActions({
      getCurrency: 'userCurrency/getCurrency',
      fetchCurrencies: 'currency/fetchCurrencies',
    }),
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
  watch: {
    // Prevent animation re-rendering on locale change
    '$i18n.locale'() {
      // Keep the same animation key to prevent re-rendering
      this.animationKey = 'persistent'
    }
  },
}
</script>
