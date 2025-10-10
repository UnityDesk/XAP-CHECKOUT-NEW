<template>
  <div id="success">
    <div class="successPage">
      <h1 class="welcome">{{ $t('success.welcome') }}</h1>
      <div class="padd">
        <p class="congrat">
          {{ $t('success.description') }}
          <span>support@xaptv.com</span>
        </p>
        <hr class="successHr" />
        <p class="succesTitle">{{ $t('success.m3u') }}</p>
        <div class="m3u">
          <info
            :text-area="true"
            :label="''"
            :data="
              productDetails.serverhostname +
              '/get.php?username=' +
              productDetails.username +
              '&password=' +
              productDetails.password +
              '&type=m3u_plus&output=mpegts'
            "
            :add="false"
          ></info>
        </div>
        <div class="grouped">
          <a
            :href="
              productDetails.serverhostname +
              '/get.php?username=' +
              productDetails.username +
              '&password=' +
              productDetails.password +
              '&type=m3u_plus&output=ts'
            "
            ><button class="download">
              {{ $t('success.button.download') }}
              <img
                src="@/assets/img/success/download.svg"
                alt="download"
                class="m3u8Down"
              /></button
          ></a>
        </div>
        <hr class="successHr" />
        <p class="succesTitle">{{ $t('success.xtream') }}</p>
        <div class="infos">
          <info
            :label="$t('success.label.server')"
            :data="productDetails.serverhostname"
            :add="false"
          ></info>
          <info
            :label="$t('success.label.username')"
            :data="productDetails.username"
            :add="false"
          ></info>
          <info
            :label="$t('success.label.password')"
            :data="productDetails.password"
            :add="false"
          ></info>
        </div>
        <hr class="successHr" />
        <p class="succesTitle">{{ $t('success.mag') }}</p>
        <div class="magAdd">
          <info
            :label="$t('success.label.hostname')"
            :data="productDetails.serverhostname + '/c/'"
          ></info>
          <info
            :label="$t('success.label.macaddress')"
            :read-only="false"
            :placeholder="'00:1A:79:XX:XX:XX'"
            :copied="false"
            :add="true"
            :data="productDetails.macAddress.value"
            :max-length="17"
          ></info>
        </div>
      </div>
    </div>
    <div class="utilities">
      <!-- <Utilitie
        :img="require('@/assets/img/mail.svg')"
        :name="$t('success.utilite.openTicket')"
        :link="'https://web.xaptv.com/contact'"
      ></Utilitie>
      <Utilitie
        :img="require('@/assets/img/report.svg')"
        :name="$t('success.utilite.reportChannel')"
        :link="'https://report.xaptv.com'"
      ></Utilitie> -->
      <Utilitie
        :img="require('@/assets/img/area.svg')"
        :name="$t('success.utilite.membersArea')"
        :link="`https://panel.xaptv.com/dashboard/?userid=${$auth.user.userid}&email=${user.email}&serviceid=${order.serviceid}`"
      ></Utilitie>
      <nuxt-link :to="localePath('/upsell')">
        <Utilitie
          :img="require('@/assets/img/extraConnect.svg')"
          :name="$t('success.utilite.extraConnection')"
        ></Utilitie>
      </nuxt-link>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import info from '@/components/addons/info.vue'
import Utilitie from '@/components/addons/utilitie.vue'
export default {
  components: {
    info,
    Utilitie,
  },
  computed: {
    ...mapState(['productDetails', 'user', 'order']),
  },
  methods: {
    ...mapActions({
      clearForSuccess: 'order/clearForSuccess',
      userEmail: 'user/userEmail',
      auth: 'user/auth',
      addServiceId: 'order/addServiceId',
      getClientProduct: 'productDetails/getClientProduct',
    }),
  },
  async mounted() {
    const { email, serviceid } = this.$route.query
    this.clearForSuccess()
    if (email && serviceid) {
      this.userEmail(email)
      const data = await this.auth()
      this.$auth.setUser(data)
      this.addServiceId(serviceid)
      await this.getClientProduct()
    } else if (
      !this.productDetails.serverhostname ||
      !this.productDetails.username ||
      !this.productDetails.password
    )
      this.$router.push(this.localePath('/'))
  },
}
</script>
