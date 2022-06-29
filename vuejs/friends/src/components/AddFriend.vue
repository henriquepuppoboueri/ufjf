<template>
  <form @submit.prevent="addFriend">
    <label for="name"
      >Name:
      <input type="text" name="name" v-model.trim="newFriend.name" />
    </label>
    <label for="phone"
      >Phone Number:
      <input type="tel" name="phone" v-model="newFriend.phoneNumber" />
    </label>
    <label for="email"
      >E-mail Address:
      <input type="email" name="email" v-model="newFriend.emailAddress" />
    </label>
    <label for="is-favorite"
      >Is favorite?
      <input
        type="checkbox"
        name="is-favorite"
        ref="box"
        :checked="newFriend.isFavorite"
    /></label>
    <button type="submit">Add new friend</button>
  </form>
  <!-- <q-btn label="My Button" /> -->
</template>

<script>
export default {
  emits: ['friend-added'],
  data() {
    return {
      newFriend: {
        name: '',
        phoneNumber: '',
        emailAddress: '',
        isFavorite: false,
      },
    };
  },
  methods: {
    addFriend() {
      this.$emit('friend-added', {
        ...this.newFriend,
        isFavorite: this.$refs.box.checked,
      });
    },
  },
};
</script>
