<template><p>Nothing</p></template>

<script setup>
import { onBeforeMount, onMounted } from 'vue';

onMounted(() => console.log('onMount'));
onBeforeMount(() => console.log('onBeforeMount'));
</script>
