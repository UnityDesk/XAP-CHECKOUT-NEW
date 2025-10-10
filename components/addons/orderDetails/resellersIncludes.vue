<template>
  <div id="includes">
    <p class="title">
      <span> </span>
      {{ $t('checkout.includes.title') }}
      <span></span>
    </p>

    <ul>
      <li v-for="(el, i) in $t('resellers.includes.list')" :key="i">
        <img src="@/assets/img/check-2.svg" alt="check" />

        {{ el }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {}
</script>
