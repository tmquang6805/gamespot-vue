<template>
  <div class="dashboard_form">
    <h1>Add Post</h1>
    <form @submit.prevent="submitHandler">
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
        <p class="error_label" v-if="!$v.formdata.desc.required">
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
        <p class="error_label" v-if="!$v.formdata.rating.required">
          You need to select at least one
        </p>
      </div>

      <button type="submit">Add Post</button>
    </form>
  </div>
</template>

<script>

import {required, maxLength} from "vuelidate/lib/validators"

export default {
  name: "AddPost",
  data() {
    return  {
      formdata: {
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
        maxLength: maxLength(10)
      },
      rating: {
        required
      }
    }
  },
  methods: {
    submitHandler() {

    }
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
