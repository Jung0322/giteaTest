<!--
  목적 : 이미지 뷰터 컴포넌트
  작성자 : sch
  비고 :
  -->
<template>
  <div>
    <el-carousel
      indicator-position="none"
      arrow="always"
      :autoplay="autoplay"
      :interval="interval"
      :loop="loop"
      :initial-index="startIndex"
      :height="carouselHeight"
      @change="change"
    >
      <el-carousel-item v-for="(item, i) in files" :key="i">
        <b-card
          no-body
          class="no-border-card"
          align="center"
          style="height: 100%"
        >
          <b-card-body>
            <b-img-lazy
              v-if="base64ImageUrl"
              :src="base64ImageUrl"
              :style="imageSize"
              v-bind="mainProps"
            ></b-img-lazy>
            <!-- <el-image :src="base64ImageUrl" fit="scale-down" :lazy="true" :style="imageSize" /> -->
          </b-card-body>
          <template v-slot:footer>
            <small class="text-muted">{{ getImageInformation(item) }}</small>
          </template>
        </b-card>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
import selectConfig from '@/js/selectConfig.js';
export default {
  /** attributes: name, components, props, data **/
  name: 'y-image-viewer',
  props: {
    // 수정가능 여부
    editable: {
      type: Boolean,
      default: true,
    },
    files: {
      type: Array,
      default: () => {
        return [];
      },
    },
    // 이미지 경로 속성명
    imageUrlAttributeName: {
      type: String,
      default: null,
    },
    // 자동 이미지 전환 여부
    autoplay: {
      type: Boolean,
      default: false,
    },
    // 자동 이미지 전환 간격(밀리초)
    interval: {
      type: Number,
      default: 3000,
    },
    // 마지막 이미지에서 첫 번째 이미지로 이동 여부
    loop: {
      type: Boolean,
      default: true,
    },
    // 시작 번호(여러 파일 중 클릭한 파일 인덱스 번호)
    startIndex: {
      type: Number,
      default: 0,
    },
    // 이미지의 최대 크기로 carousel 높이와 연동 됨
    imageMaxHeight: {
      type: Number,
      default: 500,
    },
    // 첨부파일 그룹 정보
    attachFileGrp: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      base64ImageUrl: null,
      imageFiles: [],
      mainProps: {
        center: true,
        fluidGrow: true,
        blank: true,
        blankColor: '#bbb',
        width: '100%',
        height: 500,
      },
      arrows: null,
    };
  },
  computed: {
    carouselHeight() {
      return this.imageMaxHeight + 50 + 'px';
    },
    imageSize() {
      return 'height: ' + this.imageMaxHeight + 'px; ';      
    },
  },
  watch: {
    startIndex() {
      // this.getBase64Image(this.files[this.startIndex]);
    },
    // files: {
    //   handler: function(newValue, oldValue) {
    //     this.setImageFiles();
    //   },
    //   deep: true,
    // },
  },
  /** Vue lifecycle: created, mounted, destroyed, etc **/
  beforeCreate() {},
  created() {},
  beforeMount() {
    // TODO : data를 초기화 시켜줌(검색 조건 유지가 필요할 때는 삭제할 것)
    // 이유 : vue.js는 SPA기반으로 동작하기 때문에 페이지를 이동하더라도 기존 입력된 정보가 그대로 남아 있는 문제가 있음
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {},
  beforeDestory() {},
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      // TODO : 여기에 초기 설정용 함수를 호출하거나 로직을 입력하세요.
      this.getBase64Image(this.files[0]);
    },
    /** functions **/
    getImageInformation(_item) {
      let information =
        _item.fileOrgNm + ' (' + this.$comm.bytesToSize(_item.fileSize) + ')';
      return information;
    },
    getBase64Image(_item) {
      if (!_item) return;
      let contentType = null;
      if (_item.contentType) contentType = _item.contentType;
      else if (_item.raw && _item.raw.type) contentType = _item.raw.type;
      // 이미지인  경우
      if (_item.fileNo) {
        this.$http.url = selectConfig.attachFile.image64.url;
        this.$http.type = 'GET';
        this.$http.param = {
          fileNo: _item.fileNo,
          taskFlag: this.attachFileGrp.taskFlag
            ? this.attachFileGrp.taskFlag
            : '',
        };
        this.$http.request(
          (_result) => {
            this.base64ImageUrl =
              'data:' + _item.contentType + ';base64,' + _result.data;
            this.$forceUpdate();

            var arrows = document.getElementsByClassName('el-carousel__arrow');
            arrows[0].style.color = 'white';
            arrows[0].style.fontSize = 'x-large';
            arrows[0].style.backgroundColor = 'rgb(0, 0, 0, 0.7)';

            arrows[1].style.color = 'white';
            arrows[1].style.fontSize = 'x-large';
            arrows[1].style.backgroundColor = 'rgb(0, 0, 0, 0.7)';
          },
          (_error) => {
            if (_error.data === 'no_item') {
              window.getApp.$emit('APP_REQUEST_ERROR', _error);
            }
          }
        );
      }
    },
    /** events **/
    change(_i) {
      if (!this.files || this.files.length === 0) {
        return;
      }

      this.getBase64Image(this.files[_i]);
    },
  },
};
</script>

<style scoped>
.no-border-card {
  border: 0px !important;
}
</style>
