<template>
  <section>
    <header>
      <h1>My Friends</h1>
    </header>
    <add-friend @friend-added="addContact"></add-friend>
    <ul>
      <friend-contact
        v-for="friend in friends"
        :key="friend.id"
        :id="friend.id"
        :name="friend.name"
        :phone-number="friend.phoneNumber"
        :email-address="friend.emailAddress"
        :is-favorite="friend.isFavorite"
        @toggle-favorite="setFavorite"
        @delete-contact="deleteContact"
      ></friend-contact>
    </ul>
  </section>
</template>

<script>
import FriendContact from './components/FriendContact.vue';
import AddFriend from './components/AddFriend.vue';
export default {
  components: { FriendContact, AddFriend },
  data() {
    return {
      friends: [
        {
          id: 'manuel',
          name: 'Manuel Lorenz',
          phoneNumber: '0123 45678 90',
          emailAddress: 'manuel@localhost.com',
          isFavorite: false,
        },
        {
          id: 'julie',
          name: 'Julie Jones',
          phoneNumber: '0987 654421 21',
          emailAddress: 'julie@localhost.com',
          isFavorite: true,
        },
      ],
    };
  },
  methods: {
    setFavorite(id) {
      const foundFriend = this.friends.find((friend) => friend.id === id);
      if (foundFriend) foundFriend.isFavorite = !foundFriend.isFavorite;
    },
    addContact(newFriend) {
      if (!newFriend) return;
      this.friends.push({ ...newFriend, id: new Date().getMilliseconds() });
    },
    deleteContact(id) {
      const friend = this.friends.find((friend) => friend.id === id);
      const index = this.friends.indexOf(friend);
      this.friends.splice(index, 1);
    },
  },
};
</script>

<style>
* {
  box-sizing: border-box;
}
html {
  font-family: 'Jost', sans-serif;
}
body {
  margin: 0;
}
header {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
  margin: 3rem auto;
  border-radius: 10px;
  padding: 1rem;
  background-color: #58004d;
  color: white;
  text-align: center;
  width: 90%;
  max-width: 40rem;
}
#app ul {
  margin: 0;
  padding: 0;
  list-style: none;
}
#app li,
#app form {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
  margin: 1rem auto;
  border-radius: 10px;
  padding: 1rem;
  text-align: center;
  width: 90%;
  max-width: 40rem;
}
#app h2 {
  font-size: 2rem;
  border-bottom: 4px solid #ccc;
  color: #58004d;
  margin: 0 0 1rem 0;
}
#app button {
  font: inherit;
  cursor: pointer;
  border: 1px solid #ff0077;
  background-color: #ff0077;
  color: white;
  padding: 0.05rem 1rem;
  box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.26);
  margin: 2px;
}
#app button:hover,
#app button:active {
  background-color: #ec3169;
  border-color: #ec3169;
  box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.26);
}
#app input {
  font: inherit;
  padding: 0.15rem;
}
#app label {
  font-weight: bold;
  margin-right: 1rem;
  width: 7rem;
  display: block;
}
#app form div {
  margin: 1rem 0;
}
</style>
