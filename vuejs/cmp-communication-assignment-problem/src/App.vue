<template>
  <user-data @person-added="addPerson"></user-data>
  <active-user
    v-for="user in users"
    :key="user.name"
    :name="user.name"
    :age="user.age"
  ></active-user>
</template>

<script>
import UserData from './components/UserData.vue';
import ActiveUser from './components/ActiveUser.vue';
export default {
  components: { UserData, ActiveUser },
  data() {
    return {
      users: [
        { name: 'Henrique', age: 33 },
        { name: 'Fernando', age: 32 },
      ],
    };
  },
  methods: {
    addPerson(person) {
      this.users.push(person);
    },
  },
};
</script>
