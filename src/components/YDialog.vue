<!--
  목적 : 팝업다이얼로그
  작성자 : khk
  Detail :
  *
  examples:
  *
  -->
<template>
  <div name="dialog" ref="dialog">
  <el-dialog
    v-if="param.customCallBack"
    :visible.sync="param.visible"
    :fullscreen="isFullScreen"
    :append-to-body="true"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    :width="param.width"
    :height="param.height"
    :top="param.top"
    :style="`opacity:` + bodyOpacity"
  >
    <span slot="title" class="custom-dialog-title">{{$comm.getLangSpecInfoLabel(param.title)}}
      <div><el-button icon="el-icon-close" circle size="mini" @click.stop="param.closeCallback"/></div>
      <div><el-button icon="el-icon-full-screen" circle size="large" style="font-size: 20px !important; color: white; margin-right: 10px;" @click="resize"/></div>
    </span>
    <component
      :is="param.target"
      :popupParam="param.param"
      :attachFileGrp="param.param"
      @callBack="param.customCallBack"
      @closePopup="param.closeCallback"
      :style="`background:` + bodyColor"
    />
  </el-dialog>
  <el-dialog
    v-else
    :visible.sync="param.visible"
    :fullscreen="isFullScreen"
    :append-to-body="true"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    :width="param.width"
    :height="param.height"
    :top="param.top"
    :style="`opacity:` + bodyOpacity"
  >
    <span slot="title" class="custom-dialog-title">{{$comm.getLangSpecInfoLabel(param.title)}}
      <div><el-button icon="el-icon-close" circle size="mini" @click.stop="param.closeCallback"/></div>
      <div><el-button icon="el-icon-full-screen" circle size="large" style="font-size: 20px !important; color: white; margin-right: 10px;" @click="resize"/></div>
    </span>
     
    <component
      :is="param.target"
      :popupParam="param.param"
      :attachFileGrp="param.param"
      @closePopup="param.closeCallback"
      :style="`background:` + bodyColor"
    />
  </el-dialog>
  </div>
</template>

<script>
var isChrome = /* @cc_on!@ */false || !document.documentMode
export default {
  name: 'y-dialog',
  props: {
    param: {
      type: Object,
      default: () => ({
        target: null,
        title: '',
        visible: true,
        width: '80%',
        height: null,
        top: '50px',
        param: {},
        customCallBack: null,
        closeCallback: null,
      }),
    },
  },
  data() {
    return {
      bodyColor: '#F1F1F1',
      bodyOpacity: '0.99 !important',
      bodyTimer: '',
      isFullScreen: false
    };
    
  },
  computed: {},
  watch: {
    'param.visible': function() {
      this.isFullScreen = false;
    }
  },
  beforeCreate() {
  },
  created() {
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
  },
  mounted() {
    this.init();
  },
  beforeDestory() {
    if (this.param.visible && this.bodyTimer) {
      clearTimeout(this.bodyTimer)
    }
    if (!isChrome) {
      this.bodyOpacity = '0.99 !important';
    }
  },
  updated() {
    if (this.param.visible) {
      if (!isChrome) {
        this.bodyTimer = setTimeout(this.setBodyTimer, 2000)
      } else {
        this.bodyOpacity = '1 !important';
      }
    } else {
      if (!isChrome) {
        this.bodyOpacity = '0.99 !important';
      }
    }
  },
  
  methods: {
    init() {

      this.setBodyColor();
      window.getApp.$on('mainColorChanged', (_color) => {
        this.bodyColor = _color;
      });      
    },
    setBodyTimer() {
      this.bodyOpacity = '1 !important';
      clearTimeout(this.bodyTimer)
    },
    setBodyColor() {
      this.$nextTick(() => {
        let localStorageColor = window.localStorage.getItem('bodyColor');
        this.bodyColor = localStorageColor || this.bodyColor; 
        // let elDialogBodies = $(document.body).find('.el-dialog__body');
        // this.$_.forEach(elDialogBodies, _item => {
        //   let $elDialogBody = $(_item);
        //   $elDialogBody.css('background-color', this.bodyColor);
        // });
      });
    },
    resize() {
      if (this.isFullScreen) {
        this.isFullScreen = false;
      } else {
        this.isFullScreen = true;
      }
      window.dispatchEvent(new Event('resize'));
    }
  },
};
</script>