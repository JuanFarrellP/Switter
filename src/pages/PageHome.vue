<template>
  <q-page class="relative-position">
    <q-scroll-area class="absolute full-height full-width">
      <div class="q-py-lg q-px-md row items-end q-col-gutter-md">
        <div class="col">
          <q-input
            class="new-sweet"
            bottom-slots
            v-model="newSweetContent"
            placeholder="What's happening?"
            counter
            maxlength="280"
            autogrow
          >
            <template v-slot:before>
              <q-avatar size="xl">
                <img src="https://cdn.quasar.dev/img/avatar2.jpg" />
              </q-avatar>
            </template>
          </q-input>
        </div>

        <div class="col col-shrink">
          <q-btn
            class="q-mb-lg"
            :disable="!newSweetContent"
            @click="addNewSweet"
            unelevated
            rounded
            color="primary"
            label="Sweet"
            no-caps
          />
        </div>
      </div>

      <q-separator class="divider" size="10px" color="grey-2" />

      <q-list>
        <transition-group
          appear
          enter-active-class="animated fadeIn slow"
          leave-active-class="animated fadeOut slow"
        >
          <q-item v-for="sweet in sweets" :key="sweet.id" class="sweet q-py-md">
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
                <q-btn
                  flat
                  round
                  color="grey"
                  size="sm"
                  icon="far fa-comment"
                />
                <q-btn
                  flat
                  round
                  color="grey"
                  size="sm"
                  icon="fas fa-retweet"
                />
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
                    dialog = true;
                    getSweetId(sweet);
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
        </transition-group>
      </q-list>
    </q-scroll-area>
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
  </q-page>
</template>

<script>
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  addDoc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import db from "src/boot/firebase";
import { formatDistance } from "date-fns";
import { defineComponent } from "vue";

export default defineComponent({
  name: "PageHome",
  data() {
    return {
      dialog: false,
      sweetId: "",
      newSweetContent: "",
      sweets: [
        // {
        //   content: "Hello world!",
        //   date: 1690169000000,
        // },
        // {
        //   content:
        //     "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iste voluptate ad nisi tenetur autem odit error assumenda animi, ratione quo vero, provident deserunt quae sunt? Minus nesciunt atque consequatur odit!",
        //   date: 1690163941673,
        // },
      ],
    };
  },

  methods: {
    addNewSweet() {
      let newSweet = {
        content: this.newSweetContent,
        date: Date.now(),
        liked: false,
      };
      // this.sweets.unshift(newSweet);
      const docRef = addDoc(collection(db, "sweets"), newSweet);
      console.log("Document written with ID: ", docRef.id);
      this.newSweetContent = "";
    },
    getSweetId(sweet) {
      this.sweetId = sweet.id;
    },
    deleteSweet() {
      deleteDoc(doc(db, "sweets", this.sweetId));
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

  mounted() {
    const q = query(collection(db, "sweets"), orderBy("date", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        let sweetChange = change.doc.data();
        sweetChange.id = change.doc.id;
        if (change.type === "added") {
          console.log("New sweet: ", sweetChange);
          this.sweets.unshift(sweetChange);
        }
        if (change.type === "modified") {
          console.log("Modified sweet: ", sweetChange);
          let index = this.sweets.findIndex(
            (sweet) => sweet.id === sweetChange.id
          );
          Object.assign(this.sweets[index], sweetChange);
        }
        if (change.type === "removed") {
          console.log("Removed sweet: ", sweetChange);
          let index = this.sweets.findIndex(
            (sweet) => sweet.id === sweetChange.id
          );
          this.sweets.splice(index, 1);
        }
      });
    });
  },
});
</script>

<style lang="sass">
.new-sweet
  textarea
    font-size: 19px
    line-height: 1.4 !important

.divider
  border-top: 1px solid
  border-bottom: 1px solid
  border-color: $grey-4

.sweet:not(:first-child)
  border-top: 1px solid rgba(0,0,0,0.12)

.sweet-content
  white-space: pre-line

.sweet-icons
  margin-left: -5px
</style>
