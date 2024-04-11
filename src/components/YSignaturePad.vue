<!--
  목적 : 서명용 pad 컴포넌트
  작성자 : sch
  비고 :
  -->
<template>
  <div>
    <b-row>
      <b-col sm="12" ref="col">
        <canvas
          :key="canvasKey"
          id="signature-pad"
          class="signature-pad"
          ref="canvas"
          :width="width"
          :height="height"
          style="border: 1px solid #bfbfbf;"
        ></canvas>
      </b-col>
    </b-row>
    <b-row class="text-left">
      <b-col sm="12">
        <y-btn title="서명등록" color="blue" :showLoading="false" @btnClicked="saveAsSvg" />
        <y-btn title="지우기" color="red" :showLoading="false" @btnClicked="eraseSignature" />
      </b-col>
    </b-row>
  </div>
</template>

<script>
import SignaturePadModule from 'signature_pad';
let signaturePad = null;
export default {
  /** attributes: name, components, props, data **/
  name: 'y-signature-pad',
  props: {
    // 수정가능 여부
    editable: {
      type: Boolean,
      default: true,
    },
    height: {
      type: [String, Number],
      default: '200px',
    },
    width: {
      type: [String, Number],
      default: null,
    },
    signData: {
      type: String,
      default: null,
    },
  },
  // TODO: 화살표 함수(=>)는 data에 사용하지 말 것
  //    data:() => { return { a: this.myProp }}) 화살표 함수가 부모 컨텍스트를 바인딩하기 때문에 this는 예상과 달리 Vue 인스턴스가 아니기 때문에 this.myProp는 undefined로 나옵니다.
  //    참고url: https://kr.vuejs.org/v2/api/index.html#data
  data() {
    return {
      canvasKey: '', // 캔버스 렌더링 키
    };
  },
  computed: {
    colWidth() {
      if (!this.$refs.canvas) return;
      return this.width || this.$refs.col.clientWidth;
    },
  },
  watch: {
    signData: {
      handler: function(val, oldVal) {
        if (!this.signData) return;
        this.setSignaturePad(this.signData);
      },
      deep: true,
    }
  },
  /** Vue lifecycle: created, mounted, destroyed, etc **/
  beforeCreate() {},
  created() {},
  beforeMount() {
    // TODO : data를 초기화 시켜줌(검색 조건 유지가 필요할 때는 삭제할 것)
    // 이유 : vue.js는 SPA기반으로 동작하기 때문에 페이지를 이동하더라도 기존 입력된 정보가 그대로 남아 있는 문제가 있음
    Object.assign(this.$data, this.$options.data());
  },
  mounted() {
    this.init();
  },
  beforeDestory() {},
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      this.initSignaturePad();
    },
    initSignaturePad() {
      if (!this.$refs.canvas) {
        return;
      }
      signaturePad = new SignaturePadModule(this.$refs.canvas);
    },
    saveAsSvg() {
      // if (signaturePad.isEmpty()) {
      //   window.getApp.$emit('ALERT', {
      //     title: '안내',
      //     message: '서명을 입력해주세요.',
      //     type: 'warning',
      //   });
      //   return;
      //   // return alert('Please provide a signature first.');
      // }
      // var data = signaturePad.toDataURL('image/svg+xml');
      var data = signaturePad.toDataURL('image/png');
      this.$emit('signatureToSvg', data);
    },
    eraseSignature() {
      signaturePad.clear();
    },
    setSignaturePad(_signData) {
      setTimeout(() => {
        signaturePad.fromDataURL(_signData, {
          width: this.colWidth,
          height: this.height
        });
      }, 300);
    },
    /** functions **/
    /** events **/
  },
};
</script>
