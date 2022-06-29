<template>
  <q-page class="relative-position">
    <q-scroll-area class="absolute full-width full-height">
      <div class="q-py-lg q-px-md row items-end q-col-gutter-md">
        <div class="col">
          <q-input
            v-model="newQweetContent"
            bottom-slots
            placeholder="What's happening?"
            counter
            maxlength="280"
            dense
            autogrow
            class="new-qweet"
          >
            <template v-slot:before>
              <q-avatar size="xl">
                <img src="https://cdn.quasar.dev/img/avatar5.jpg" />
              </q-avatar>
            </template>

            <template v-slot:after> </template>
          </q-input>
        </div>
        <div class="col col-shrink">
          <q-btn
            :disabled="!newQweetContent"
            no-caps
            unelevated
            rounded
            color="primary"
            label="Qweet"
            class="q-mb-lg"
            @click="addNewQweet"
          />
        </div>
      </div>
      <q-separator class="divider" size="10px" color="grey-2" />
      <q-list separator>
        <transition-group
          appear
          enter-active-class="animated fadeIn slower"
          leave-active-class="animated fadeOut slow"
        >
          <q-item
            class="q-py-md"
            v-for="(qweet, qweetIndex) in qweets"
            :key="qweet.id"
          >
            <q-item-section top avatar>
              <q-avatar size="xl">
                <img src="https://cdn.quasar.dev/img/avatar5.jpg" />
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-subtitle1 row wrap">
                <strong class="q-mr-xs">Henrique Puppo Boueri</strong>
                <span class="text-grey-7">
                  @puppitcho &bull; {{ relativeDistance(qweetIndex) }}</span
                >
              </q-item-label>
              <q-item-label class="qweet-content text-body1">
                {{ qweet.content }}
              </q-item-label>
              <div class="qweet-icons row justify-between q-mt-sm">
                <q-btn
                  flat
                  round
                  color="grey"
                  icon="fa-regular fa-comment"
                  size="sm"
                />
                <q-btn
                  flat
                  round
                  color="grey"
                  icon="fa-solid fa-retweet"
                  size="sm"
                />
                <q-btn
                  flat
                  round
                  :color="qweet.liked ? 'pink' : 'grey'"
                  :icon="
                    qweet.liked ? 'fa-solid fa-heart' : 'fa-regular fa-heart'
                  "
                  size="sm"
                  @click="likeQweet(qweet)"
                />
                <q-btn
                  flat
                  round
                  color="grey"
                  icon="fa-solid fa-trash"
                  size="sm"
                  @click="deleteQweet(qweet)"
                />
              </div>
            </q-item-section>
          </q-item>
        </transition-group>
      </q-list>
    </q-scroll-area>
  </q-page>
</template>

<script setup>
import { defineComponent, reactive, ref, onMounted } from "vue";
import { formatDistance } from "date-fns";
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  addDoc,
  deleteDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import db from "src/boot/firebase";

const relativeDistance = (qweetIndex) => {
  return formatDistance(qweets[qweetIndex].date, new Date(), {
    addSuffix: true,
  });
};

const deleteQweet = async (qweet) => {
  await deleteDoc(doc(db, "qweets", qweet.id));
};

const likeQweet = async (qweet) => {
  await setDoc(doc(db, "qweets", qweet.id), { ...qweet, liked: !qweet.liked });
};

const addNewQweet = async () => {
  const newQweet = {
    content: newQweetContent.value,
    date: Date.now(),
    liked: false,
  };
  const qweetId = await addDoc(collection(db, "qweets"), newQweet);
  newQweetContent.value = "";
};

defineComponent({
  name: "PageHome",
});

onMounted(() => {
  const q = query(collection(db, "qweets"), orderBy("date"));
  const unsubscribe = onSnapshot(q, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      const qweetChange = change.doc.data();
      qweetChange.id = change.doc.id;

      if (change.type === "added") {
        qweets.unshift(qweetChange);
      }
      if (change.type === "modified") {
        const qweetIndex = qweets.findIndex((q) => q.id === qweetChange.id);
        // qweets[qweetIndex].liked = qweetChange.liked;
        Object.assign(qweets[qweetIndex], qweetChange);
      }
      if (change.type === "removed") {
        const qweetIndex = qweets.findIndex((q) => q.id === qweetChange.id);
        qweets.splice(qweetIndex, 1);
      }
    });
  });
});

const newQweetContent = ref("");
let qweets = reactive([]);
</script>

<style lang="sass">
.qweet-content
  white-space: pre-line
  text-align: justify

.new-qweet
  textarea
    font-size: 19px
    line-height: 1.4 !important

.divider
  border-top: 1px solid
  border-bottom: 1px solid
  border-color: $grey-4

.qweet-icons
  margin-left: -5px
</style>
