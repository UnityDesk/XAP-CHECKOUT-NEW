<template>
  <div id="infoData" :class="{ textArea: textArea }">
    <label :for="label" v-if="label">{{ label }}</label>
    <div class="contain" :class="{ linked: linked }">
      <div class="toCopy" :class="{ visible: visible }">
        <textarea
          v-if="textArea"
          ref="data"
          v-model="data"
          name="data"
          :maxlength="maxLength"
          :readonly="readOnly"
          rows="3"
        >
        </textarea>
        <input
          v-else
          ref="data"
          type="text"
          :maxlength="maxLength"
          :readonly="readOnly"
          :value="data"
          :placeholder="placeholder"
          @input="input ? input : validate"
        />
      </div>
      <div class="links">
        <div v-if="copied" class="copyText" @click="copy()">
          <img
            src="@/assets/img/success/copy.svg"
            alt="link"
            class="link"
            v-if="$colorMode.value === 'white'"
          />
          <img
            src="@/assets/img/success/copyWhite.svg"
            alt="link"
            class="link"
            v-else
          />
        </div>
        <a v-if="linked" target="_blank" :href="data">
          <div class="goTo">
            <img
              src="@/assets/img/success/goTo.svg"
              alt="go to"
              class="goToLink"
            />
          </div>
        </a>
        <div v-if="add">
          <button
            ref="addMac"
            class="addMac"
            :disabled="
              data.length !== 17 || productDetails.macAddress.value === data
            "
            @click="updateMac"
          >
            {{
              data.length !== 17
                ? $t('success.button.add')
                : $t('success.button.update')
            }}
          </button>
        </div>
        <div class="openUrl" v-if="openUrl">
          <NuxtLink :to="localePath('/resellers?email=' + user.email)">
            <button>
              {{ $t('resellers.success.button') }}
            </button>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  props: {
    label: { type: String, required: false },
    data: { type: String, required: false, default: '' },
    linked: { type: Boolean, default: false },
    add: { type: Boolean, default: false },
    readOnly: { type: Boolean, default: true },
    placeholder: { type: String, required: false, default: '' },
    copied: { type: Boolean, default: true },
    maxLength: { type: Number, default: 1000 },
    textArea: { type: Boolean, default: false },
    openUrl: { type: Boolean, default: false },
  },
  data() {
    return {
      visible: false,
      score: 0,
      addMac: false,
    }
  },
  computed: {
    ...mapState(['productDetails', 'user']),
  },
  mounted() {
    this.key()
  },
  methods: {
    ...mapActions({
      updateClientsProducts: 'productDetails/updateClientsProducts',
      restartService: 'productDetails/restartService',
    }),
    copy() {
      this.$refs.data.select()
      this.$refs.data.setSelectionRange(0, 99999)
      document.execCommand('copy')
      this.visible = true
      document.getSelection().removeAllRanges()
      setTimeout(() => {
        this.visible = false
      }, 2500)
    },
    validate() {
      this.$refs.data.value = this.$refs.data.value
        .replace(/[^a-zA-Z0-9]/g, '')
        .replace(/:/g, '')
      if (this.$refs.data.value.length) {
        this.$refs.data.value = this.$refs.data.value
          .match(/.{1,2}/g)
          .join(':')
          .toUpperCase()
      }
      this.$refs.addMac.disabled = !(
        this.$refs.data.value.length === 17 &&
        this.$refs.data.value !== this.productDetails.macAddress.value
      )
    },
    async updateMac() {
      this.$refs.addMac.disabled = true
      this.$refs.addMac.classList.add('loading')
      const response = await this.updateClientsProducts(this.$refs.data.value)
      await this.restartService()
      if (response.result === 'success') {
        this.$refs.addMac.classList.remove('loading')
        this.$refs.addMac.textContent = this.$t('success.button.success')
        setTimeout(
          () =>
            (this.$refs.addMac.textContent = this.$t('success.button.update')),
          2000
        )
      } else {
        this.$refs.addMac.disabled = false
        this.$refs.addMac.classList.remove('loading')
        this.$refs.addMac.textContent = this.$t('success.button.failed')
        setTimeout(
          () =>
            (this.$refs.addMac.textContent =
              this.data.length === 17
                ? this.$t('success.button.update')
                : this.$t('success.button.add')),
          2000
        )
      }
    },
    key() {
      if (this.add) {
        document.addEventListener('keydown', async (e) => {
          if (e.keyCode === 13 && this.add)
            if (!this.$refs.addMac.disabled) await this.updateMac()
        })
      }
    },
  },
}
</script>
