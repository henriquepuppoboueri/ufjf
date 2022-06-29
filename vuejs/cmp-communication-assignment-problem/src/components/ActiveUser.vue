<template>
  <h2>{{ name }}</h2>
  <h3>{{ age }}</h3>
</template>

<script>
export default {
  props: ['name', 'age'],
};
</script>
