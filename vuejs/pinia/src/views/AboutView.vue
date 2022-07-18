<script setup>
// import { storeToRefs } from 'pinia';
import { useCounterStore } from '../stores/counter';
// import { ref } from 'vue';

const counterStore = useCounterStore();
// const { counter } = storeToRefs(useCounterStore());
// const counter = ref(counterStore.counter);

function incCounter() {
  counterStore.increment();
}
</script>

<template>
  <div class="about">
    <p>Counter:</p>
    <p>{{ counterStore.counter }}</p>
    <button @click="incCounter">Inc</button>
  </div>
</template>

<style></style>
