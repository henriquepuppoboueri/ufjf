<template>
  <div id="app">
    <form @submit.prevent="addPerson">
      <label>Name:<input type="text" v-model="name" /></label>
      <br />
      <label>Age:<input type="number" v-model="age" /></label>
      <br />
      <button>Add person</button>
    </form>
  </div>
</template>

<script>
export default {
  components: {},
  emits: ['person-added'],
  data() {
    return {
      age: 20,
      name: '',
    };
  },
  methods: {
    addPerson() {
      this.$emit('person-added', { age: this.age, name: this.name });
    },
  },
};
</script>
