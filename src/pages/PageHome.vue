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
        <sweetBox v-for="sweet in sweets" :sweet="sweet" :key="sweet.id" />
      </q-list>
    </q-scroll-area>
  </q-page>
</template>

<script>
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
} from "firebase/firestore";
import db from "src/boot/firebase";
import { defineComponent } from "vue";
import sweetBox from "src/components/sweetBox.vue";

export default defineComponent({
  name: "PageHome",
  components: {
    sweetBox,
  },

  data() {
    return {
      newSweetContent: "",
      sweets: [],
    };
  },

  methods: {
    addNewSweet() {
      let newSweet = {
        content: this.newSweetContent,
        date: Date.now(),
        liked: false,
      };
      const docRef = addDoc(collection(db, "sweets"), newSweet);
      console.log("Document written with ID: ", docRef.id);
      this.newSweetContent = "";
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
</style>
