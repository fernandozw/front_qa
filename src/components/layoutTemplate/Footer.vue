<template>
  <span>Copyright© 1998-{{ thisYear }} 腾讯 All Rights Reserved</span>
</template>

<script>
export default {
  data() {
    return {
      thisYear: this.$moment(new Date()).format('YYYY')
    };
  }
};
</script>
