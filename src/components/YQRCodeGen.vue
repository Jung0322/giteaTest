<!--
  목적 : QRcode 생성 component
  작성자 : dylee
  Detail :
  *
  examples:
  *
  -->
<template>
  <div class="qrcodediv">
    <vue-qrcode :value="value" :tag="tag" :options="getOptions">
    </vue-qrcode>
    <div class="qrtext" v-text="text"></div>
  </div>
</template>

<script>
import VueQrcode from '@chenfengyuan/vue-qrcode';

export default {
  name: 'y-qrcodegen',
  components: { VueQrcode },
  props: {
    value: {
      type: String,
      default: ''
    },
    tag: {
      type: String,
      default: 'svg'
    },
    text: {
      type: String,
      default: ''
    },
    width: {
      type: String,
      default: '150'
    },
    margin: {
      type: String,
      default: '0'
    }
  },
  data() {
    return {
      options: {
        width: 150,
        errorCorrectionLevel: 'M',
        margin: 1,
        scale: 1,
        color: {
          dark: '#000000ff',
          light: '#ffffffff'
        },
      },
    };
  },
  computed: {
    getOptions() {
      this.options.width = parseInt(this.width);
      return this.options;
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      $('.div-appdownload > div > svg').attr('style', 'width:' + this.width + 'px;height:' + this.width + 'px;')
      $('.div-appdownload > div').attr('style', 'margin:' + this.margin + 'px;')
      $('.qrtext').attr('style', 'width:' + this.width + 'px;')
    }
  },
};
</script>
<style scoped>
.qrtext {
  font-size: 0.7em;
  line-height: 1.1em;
}
.qrcodediv {
  display: inline-block;
}
</style>
