<template>
  <li>
    <h2>{{ name }} {{ isFavorite ? '(Favorite)' : '' }}</h2>
    <button @click="toggleDetails">
      {{ detailsAreVisible ? 'Hide' : 'Show' }} Details
    </button>
    <button @click="toggleFavorite">
      {{ isFavorite ? 'Unfavorite' : 'Favorite' }}
    </button>
    <ul v-if="detailsAreVisible">
      <li>
        <strong>Phone:</strong>
        {{ phoneNumber }}
      </li>
      <li>
        <strong>Email:</strong>
        {{ emailAddress }}
      </li>
      <button @click="deleteContact">Delete</button>
    </ul>
  </li>
</template>

<script>
export default {
  emits: ['toggle-favorite', 'delete-contact'],
  props: ['id', 'name', 'phoneNumber', 'emailAddress', 'isFavorite'],
  data() {
    return {
      detailsAreVisible: false,
    };
  },
  methods: {
    toggleDetails() {
      this.detailsAreVisible = !this.detailsAreVisible;
    },
    toggleFavorite() {
      // always kebab-case
      this.$emit('toggle-favorite', this.id);
    },
    deleteContact() {
      this.$emit('delete-contact', this.id);
    },
  },
};
</script>
