<script setup>
import { storeToRefs } from 'pinia';
import { useCounterStore } from '../stores/counter';

const counterStore = useCounterStore();
const { counter } = storeToRefs(useCounterStore());
const { doubleCount } = useCounterStore();

function incCounter() {
  counterStore.increment();
}
</script>

<template>
  <div class="about">
    <p>Counter:</p>
    <p>{{ counter }}</p>
    <p>{{ doubleCount }}</p>
    <button @click="incCounter">Inc</button>
  </div>
</template>

<style></style>
