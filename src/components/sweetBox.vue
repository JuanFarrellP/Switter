<template>
  <transition
    appear
    enter-active-class="animated fadeIn slow"
    leave-active-class="animated fadeOut slow"
  >
    <q-item v-if="show" class="sweet q-py-md">
      <q-item-section avatar top>
        <q-avatar size="xl">
          <img src="https://cdn.quasar.dev/img/avatar2.jpg" />
        </q-avatar>
      </q-item-section>

      <q-item-section>
        <q-item-label class="text-subtitle1">
          <strong>Janet</strong>
          <span class="text-grey-7">
            @janet_124 <br class="lt-sm" />&bull;
            {{ relativeDate(sweet.date) }}</span
          >
        </q-item-label>

        <q-item-label class="sweet-content text-body1">
          {{ sweet.content }}
        </q-item-label>

        <div class="sweet-icons row justify-between q-mt-sm">
          <q-btn flat round color="grey" size="sm" icon="far fa-comment" />
          <q-btn flat round color="grey" size="sm" icon="fas fa-retweet" />
          <q-btn
            @click="toggleLiked(sweet)"
            flat
            round
            :color="sweet.liked ? 'pink' : 'grey'"
            :icon="sweet.liked ? 'fas fa-heart' : 'far fa-heart'"
            size="sm"
          />
          <q-btn
            @click="
              getSweetId(sweet);
              dialog = true;
            "
            flat
            round
            color="grey"
            size="sm"
            icon="fas fa-trash"
          />
        </div>
      </q-item-section>
    </q-item>
  </transition>

  <q-dialog v-model="dialog" persistent>
    <q-card
      class="my-card"
      style="width: 380px; border-radius: 25px; padding: 16px"
    >
      <q-card-section class="row items-center q-gutter-sm">
        <span class="text-h5 text-bold">Delete Sweet?</span>
        <span class="text-body1 text-center">
          This can't be undone and it will be removed from your profile, the
          timeline of any accounts that follow you, and from Switter search
          results.
        </span>
      </q-card-section>

      <q-card-actions align="around">
        <q-btn
          class="q-mb-sm"
          unelevated
          rounded
          no-caps
          color="primary"
          label="Cancel"
          style="padding: 10px 20px"
          v-close-popup
        />
        <q-btn
          class="q-mb-sm"
          unelevated
          rounded
          no-caps
          color="primary"
          label="Delete"
          style="padding: 10px 20px"
          @click="deleteSweet()"
          v-close-popup
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import db from "src/boot/firebase";
import { formatDistance } from "date-fns";
import { defineComponent } from "vue";

export default defineComponent({
  name: "sweetBox",
  props: ["sweet"],
  data() {
    return {
      show: true,
      dialog: false,
      sweetId: "",
    };
  },

  methods: {
    getSweetId(sweet) {
      this.sweetId = sweet.id;
    },
    deleteSweet() {
      this.show = false;
      setTimeout(() => {
        deleteDoc(doc(db, "sweets", this.sweetId));
      }, 600);
    },
    toggleLiked(sweet) {
      updateDoc(doc(db, "sweets", sweet.id), {
        liked: !sweet.liked,
      });
    },

    relativeDate(value) {
      return formatDistance(value, new Date());
    },
  },
});
</script>

<style lang="sass">
.sweet:not(:first-child)
  border-top: 1px solid rgba(0,0,0,0.12)

.sweet-content
  white-space: pre-line

.sweet-icons
  margin-left: -5px
</style>
