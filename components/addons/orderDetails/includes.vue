<template>
  <div id="includes">
    <p class="title">
      <span></span>
      This IPTV Plan Includes
      <span></span>
    </p>

    <ul>
      <li v-for="(el, i) in $t('checkout.includes.list')" :key="i">
        <img src="@/assets/img/check-2.svg" alt="check" />

        {{ el }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {}
</script>
