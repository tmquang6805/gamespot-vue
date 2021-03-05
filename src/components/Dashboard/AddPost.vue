<template>
  <div class="dashboard_form">
    <h1>Add Post</h1>
    <form @submit.prevent="submitHandler">

      <div v-if="imageUploadUrl">
        <img :src="imageUploadUrl" alt="">
      </div>
      <div class="input_field">
        <input ref="myFileInput" type="file" @change="processFile($event)">
      </div>

      <div class="input_field" :class="{invalid: $v.formdata.title.$error}">
        <label for="title">Title</label>
        <input type="text" id="title" v-model="formdata.title" @blur="$v.formdata.title.$touch()">
        <p class="error_label" v-if="$v.formdata.title.$error">
          This input is required
        </p>
      </div>
      <div class="input_field" :class="{invalid: $v.formdata.desc.$error}">
        <label for="desc">Description</label>
        <input type="text" id="desc" v-model="formdata.desc" @blur="$v.formdata.desc.$touch()">
        <p class="error_label" v-if="$v.formdata.desc.$error">
          This input is required
        </p>
        <p class="error_label" v-if="!$v.formdata.desc.maxLength">
          Must not be greater than {{ $v.formdata.desc.$params.maxLength.max }} characters
        </p>
      </div>

      <div class="input_field">
        <wysiwyg v-model="formdata.content"></wysiwyg>
      </div>

      <div class="input_field" :class="{invalid: $v.formdata.rating.$error}">
        <label for="rating">Rating</label>
        <select name="" id="rating" v-model="formdata.rating" @blur="$v.formdata.rating.$touch()">
          <option v-for="(val, index) in [1,2,3,4,5]" :key="index" :value="val">{{ val}} </option>
        </select>
        <p class="error_label" v-if="$v.formdata.rating.$error">
          You need to select at least one
        </p>
      </div>

      <button type="submit">Add Post</button>
    </form>

    <md-dialog :md-active="dialog" :md-backdrop="true">
      <p>Your post has no content, are you sure you want to add this?</p>
      <md-dialog-actions>
        <md-button class="md-primary" @click="dialogOnCancel">
          Oop, I want to add content
        </md-button>
        <md-button class="md-primary" @click="dialogOnConfirm">
          Yes, I want to add post
        </md-button>
      </md-dialog-actions>
    </md-dialog>

    <div v-if="addPostStatus" class="post_succesfull">
      Your post was posted
    </div>

  </div>
</template>

<script>

import {required, maxLength} from "vuelidate/lib/validators"

export default {
  name: "AddPost",
  data() {
    return  {
      dialog: false,
      formdata: {
        img: "",
        title: "",
        desc: "",
        content: "",
        rating: ""
      }
    }
  },
  validations: {
    formdata: {
      title: {
        required,
      },
      desc: {
        required,
        maxLength: maxLength(100)
      },
      rating: {
        required
      }
    }
  },
  methods: {
    submitHandler() {
      if (this.$v.$invalid) {
        alert("Some thing wrong");
        return false;
      }

      if (this.formdata.content === '') {
        this.dialog = true;
      } else {
        this.addPost();
      }

    },
    dialogOnCancel() {
      this.dialog = false;
    },
    dialogOnConfirm() {
      this.dialog = false;
      this.addPost();
    },
    addPost() {
      this.$store.dispatch('admin/addPost', this.formdata)
    },
    clearPost() {
      this.$v.$reset();
      this.$refs.myFileInput.value = "";
      this.formdata = {
        img: "",
        title: "",
        desc: "",
        content: "",
        rating: ""
      };
    },
    processFile(event) {
      const file = event.target.files[0];
      this.$store.dispatch("admin/imageUpload", file);
    }
  },
  computed: {
    addPostStatus() {
      const status = this.$store.getters["admin/getPostStatus"];
      if (status) {
        this.clearPost();
        this.$store.commit("admin/clearImageUpload");
      }

      return status;
    },
    imageUploadUrl() {
      const imgUrl = this.$store.getters["admin/getImageUrl"];
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.formdata.img = imgUrl;
      return imgUrl;
    }
  },
  destroyed() {
    this.$store.commit("admin/clearImageUpload");
  }
}
</script>

<style scoped>

  @import "~vue-wysiwyg/dist/vueWysiwyg.css";

  .input_field.invalid input,
  .input_field.invalid select{
    border: 1px solid red;
  }
</style>
