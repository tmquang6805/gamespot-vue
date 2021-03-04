<template>
  <div>
    <carousel
        :per-page="1"
        :mouse-drag="true"
        :paginationEnabled="false"
    >
      <slide v-for="(slide, index) in slides" :key="index">
        <div class="slider_bck"
             :style="{'background': `url(${slide.bck})`}"
        >
          <div class="gradient">
            <div class="container">
              <div class="content">
                <app-button
                    type="link"
                    link-to="com"
                    :ov-style="{'color': 'yellow'}"
                >
                  See Review
                </app-button>
                <div class="item">
                  {{ slide.title }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </slide>
    </carousel>
  </div>
</template>

<script>
import {Carousel, Slide} from 'vue-carousel'
import SlideOne from '../../assets/images/featured/1.jpg'
import SlideTwo from '../../assets/images/featured/2.jpg'
import SlideThree from '../../assets/images/featured/3.jpg'
import SlideFour from '../../assets/images/featured/4.jpg'

export default {
  name: "Featured",
  data() {
    return {
      slides: [
        {
          title: 'This is one',
          bck: SlideOne
        },
        {
          title: 'This is two',
          bck: SlideTwo
        },
        {
          title: 'This is three',
          bck: SlideThree
        },
        {
          title: 'This is four',
          bck: SlideFour
        },
      ]
    }
  },
  components: {
    Slide,
    Carousel
  },
  methods: {
    trigger(){
      console.log('Trigger');
    }
  },
}
</script>

<style scoped>

</style>
