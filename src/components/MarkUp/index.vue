<template>
  <span
    class="imgMark"
    :style="{
      position: 'absolute',
      cursor: 'pointer',
      top: topValue,
      left: leftValue,
    }"
  >
    <!-- <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg">
      <circle
        v-if="mark.markType === 'code1'"
        cx="10"
        cy="10"
        r="10"
        fill="#0000FF"
        @click="click"
      />
      <circle
        v-else-if="mark.markType === 'code2'"
        cx="10"
        cy="10"
        r="10"
        fill="#FF0000"
        @click="click"
      />
      <circle
        v-else-if="mark.markType === 'code3'"
        cx="10"
        cy="10"
        r="10"
        fill="#00FF00"
        @click="click"
      />
      <circle
        v-else-if="mark.markType === 'code4'"
        cx="10"
        cy="10"
        r="10"
        fill="#00FFEE"
        @click="click"
      />
      <circle
        v-else-if="mark.markType === 'code5'"
        cx="10"
        cy="10"
        r="10"
        fill="#BB00FF"
        @click="click"
      />
      <circle
        v-else-if="mark.markType === 'code6'"
        cx="10"
        cy="10"
        r="10"
        fill="#FBFF00"
        @click="click"
      />
      <circle
        v-else-if="mark.markType === 'code7'"
        cx="10"
        cy="10"
        r="10"
        fill="#B8832F"
        @click="click"
      />
      <circle
        v-else-if="mark.markType === 'code8'"
        cx="10"
        cy="10"
        r="10"
        fill="#000000"
        @click="click"
      />
    </svg>-->
    <el-image
      style="width: 25px; height: 25px"
      :src="publicPath + '/src/assets/images/' + mark.markType + '.png'"
      fit="contain"
      @click="click"
      @mouseover="mouseover"
      @mouseout="mouseout"
    ></el-image>
  </span>
</template>

<script>
export default {
  name: 'mark-up',
  props: {
    editable: {
      type: Boolean,
      default: true,
    },
    mark: {
      type: Object,
      default: () => {
        return {
          markNo: 0,
          markType: '',
          locationX: 0,
          locationY: 0,
          wkodDt: '',
          wkodTitle: '',
          subconnNm: '',
          wkodNo: '',
          wkodStepCd: '',
        };
      },
    },
  },
  data() {
    return {
      topValue: '', // this.mark.locationY + 'px',
      leftValue: '', // this.mark.locationX + 'px',
    };
  },
  computed: {
    publicPath: function () {
      return process.env.PUBLIC_PATH;
    },
  },
  watch: {
    mark: {
      handler: function (val, oldVal) {
        this.topValue = this.mark.locationY + 'px';
        this.leftValue = this.mark.locationX + 'px';
      },
      deep: true,
    },
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.topValue = this.mark.locationY + 'px';
    this.leftValue = this.mark.locationX + 'px';
  },
  mounted() {},
  methods: {
    click() {
      this.$emit('markClick', this.mark);
    },
    mouseover() {
      this.$emit('markMouseover', this.mark);
    },
    mouseout() {
      this.$emit('markMouseout');
    },
  },
};
</script>
