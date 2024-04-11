<template>
  <span>
    <b-row>
      <b-col sm="12">
        <div slot="buttonGroup" class="float-right mb-3">
          <y-btn
            v-if="editable"
            title="마커 초기화"
            color="red"
            @btnClicked="markClear"
          />
        </div>
      </b-col>
    </b-row>
    <!-- align="center" justify="center" -->
    <b-row>
      <b-col :sm="editable ? '10' : '12'">
        <div v-if="imgBase64">
          <img
            :id="'mapImg'"
            ref="mapImg"
            v-on:click="markUp"
            :style="{ width: '100%' }"
            :src="imgBase64"
          />
        </div>
        <div v-if="imgBase64">
          <img :id="'mapImgHidden'" ref="mapImgHidden" :src="imgBase64" />
        </div>
        <div v-else>
          <img
            :id="'mapImg'"
            ref="mapImg"
            v-if="path && fileName"
            v-on:click="markUp"
            :style="{ width: '100%' }"
            :src="path + fileName"
          />
          <img
            :id="'mapImgHidden'"
            ref="mapImgHidden"
            v-if="path && fileName"
            :src="path + fileName"
          />
        </div>
        <!-- ,float:'right' -->
        <component
          v-for="mark in vMarks"
          v-if="mark"
          :key="mark.markNo"
          is="MarkUp"
          :mark="mark"
          @markClick="markClick"
          @markMouseover="markMouseover"
          @markMouseout="markMouseout"
        ></component>
        <span
          v-if="showDetailPopUp && popupVisible"
          class="markDetailPopup"
          :style="{ position: 'absolute', top: topValue, left: leftValue }"
        >
          <span v-if="hoverMark.workType"
            ><span class="title">작업구분</span> :
            {{ hoverMark.workType }}</span
          >
          <br v-if="hoverMark.workType" />
          <span class="title">작업일자</span> : {{ hoverMark.wkodDt }}
          <br />
          <span class="title">작업명</span> : {{ hoverMark.wkodTitle }}
          <br />
          <span class="title">작업업체</span> : {{ hoverMark.subconnNm }}
        </span>
      </b-col>
      <b-col sm="2" v-show="editable">
        <b-row v-for="(item, index) in markItems" :key="item.code">
          <b-col sm="12" class="mb-2">
            <b-row
              :class="markBtnClss[index]"
              @click="selectMark(item.code, index)"
            >
              <b-col sm="3">
                <el-image
                  style="left: -15px; width: 30px; height: 30px"
                  :src="publicPath + '/src/assets/images/' + item.code + '.png'"
                  fit="contain"
                ></el-image>
              </b-col>
              <b-col sm="9" class="mt-2">
                <y-label :label="item.codeNm" />
              </b-col>
            </b-row>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </span>
</template>

<script>
/* eslint-disable */
import MarkUp from '@/components/MarkUp/index.vue';

export default {
  name: 'img-mark',
  components: { MarkUp },
  props: {
    editable: {
      type: Boolean,
      default: true,
    },
    showDetailPopUp: {
      type: Boolean,
      default: false,
    },
    fileName: {
      type: String,
      default: '',
    },
    path: {
      type: String,
      default: '',
    },
    imgBase64: {
      type: String,
      default: '',
    },
    // selectMarkType: {
    //   type: String,
    //   default: 'none',
    // },
    marks: {
      type: Array,
      default: () => [],
    },
    markItems: {
      type: Array,
      default: () => [],
    },
    research: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    marks() {
      this.setMark();
    },
    markItems() {
      if (this.editable) {
        this.setButtonCls();
      }
    },
    research() {
      this.setMark();
    },
  },
  data() {
    return {
      markIndex: 0,
      vRatioMarks: [],
      vMarks: [],
      mark: {
        markNo: 0,
        markType: '',
        locationX: 0,
        locationY: 0,
        wkodDt: '',
        wkodTitle: '',
        subconnNm: '',
        wkodNo: '',
        wkodStepCd: '',
      },
      hoverMark: {
        markNo: 0,
        markType: '',
        locationX: 0,
        locationY: 0,
        wkodDt: '',
        wkodTitle: '',
        subconnNm: '',
        wkodNo: '',
        wkodStepCd: '',
      },
      markBtnClss: [],
      selectMarkType: '',
      topValue: '',
      leftValue: '',
      popupVisible: false,
      popupDisplay: 'none',
    };
  },
  computed: {
    publicPath: function () {
      return process.env.PUBLIC_PATH;
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {},
    setMark() {
      this.vMarks = [];
      $('#mapImgHidden').hide();
      if (this.marks !== null) {
        if (this.marks.length > 0) {
          $('#mapImgHidden').show();
          // 여기서 비율계산 해서 vMarks 에 insert
          const clientRect = this.$refs['mapImg'].getBoundingClientRect();
          const clientRectHidden =
            this.$refs['mapImgHidden'].getBoundingClientRect();
          var widthPercent = clientRect.width / clientRectHidden.width;

          $('#mapImgHidden').hide();

          this.vRatioMarks = this.$_.clone(this.marks);
          this.marks.forEach((item) => {
            this.vMarks.push({
              markNo: item.markNo,
              markType: item.markType,
              locationX: widthPercent * item.locationX,
              locationY: widthPercent * item.locationY - 12,
              workType:
                item.workType && item.workType === 'N'
                  ? '일반'
                  : item.workType && item.workType === 'S'
                  ? '특별'
                  : '',
              wkodDt: item.wkodDt,
              wkodTitle: item.wkodTitle,
              subconnNm: item.subconnNm,
              wkodNo: item.wkodNo,
              wkodStepCd: item.wkodStepCd,
            });
          });
          this.markIndex = this.$_.clone(this.marks.length);
        }
      }
    },
    markUp(event) {
      if (!this.editable) {
        return;
      } else if (this.selectMarkType === '') {
        window.getApp.$emit('ALERT', {
          title: '안내',
          message: '작업종류를 선택하세요.',
          type: 'info', // success / info / warning / error
        });
        return;
      }
      // const target = document.getElementById('mapImg'); // 요소의 id는 mapImg
      // const clientRect = target.getBoundingClientRect(); // DomRect 구하기 (각종 좌표값이 들어있는 객체)
      // const relativeLeft = clientRect.left; // Viewport의 시작지점을 기준으로한 상대좌표 X 값.
      // const relativeTop = clientRect.top; // Viewport의 시작지점을 기준으로한 상대좌표 Y 값.

      const clientRect = this.$refs['mapImg'].getBoundingClientRect();
      const relativeLeft = clientRect.left;
      const relativeTop = clientRect.top;

      var imgWidth = clientRect.width;
      var imgHeight = clientRect.height;

      var pointX = event.clientX - relativeLeft + 5;
      var pointY = event.clientY - relativeTop - 10;

      this.mark.markNo = this.markIndex;
      this.mark.markType = this.selectMarkType;
      this.mark.locationX = this.$_.parseInt(event.clientX - relativeLeft + 5);
      this.mark.locationY = this.$_.parseInt(event.clientY - relativeTop - 10);

      // 여기서 비율계산 해서 반환
      var tmpMark = this.$_.clone(this.mark);
      tmpMark.locationX = this.$_.parseInt((pointX / imgWidth) * 1000);
      tmpMark.locationY = this.$_.parseInt((pointY / imgHeight) * 1000);

      this.vRatioMarks.push(this.$_.clone(tmpMark));
      this.vMarks.push(this.$_.clone(this.mark));
      this.markIndex++;

      this.$emit('getMakrs', this.vRatioMarks);
    },
    setButtonCls(index) {
      this.markBtnClss = [];
      this.$_.forEach(this.markItems, (item) => {
        this.markBtnClss.push('el-button');
      });
      if (typeof index !== 'undefined' && index > -1) {
        this.markBtnClss.splice(index, 1, 'el-button selectMarkButton');
      }
    },
    markClick(mark) {
      if (this.editable) {
        this.vRatioMarks.splice(
          this.$_.indexOf(this.$_.map(this.vRatioMarks, 'markNo'), mark.markNo),
          1
        );
        this.vMarks.splice(
          this.$_.indexOf(this.$_.map(this.vMarks, 'markNo'), mark.markNo),
          1
        );
        this.$emit('getMakrs', this.vRatioMarks);
      } else {
        this.$emit('clickedIcon', mark);
      }
    },
    markMouseover(mark) {
      this.hoverMark = this.$_.clone(mark);
      this.topValue = this.hoverMark.locationY + 'px';
      if ($('#divDailyMap').width() - this.hoverMark.locationX > 200) {
        this.leftValue = this.hoverMark.locationX + 30 + 'px';
      } else {
        this.leftValue = this.hoverMark.locationX - 230 + 'px';
      }
      this.popupVisible = true;
    },
    markMouseout() {
      this.popupVisible = false;
    },
    markClear() {
      this.vRatioMarks = [];
      this.vMarks = [];
      this.selectMarkType = '';
      if (this.editable) {
        this.setButtonCls();
      }

      this.$emit('getMakrs', this.vRatioMarks);
    },
    selectMark(selectValue, index) {
      if (this.selectMarkType === selectValue) {
        this.selectMarkType = '';
        this.setButtonCls();
      } else {
        this.selectMarkType = selectValue;
        this.setButtonCls(index);
      }
    },
  },
};
</script>
<style scoped>
.markDetailPopup {
  display: block;
  z-index: 1000;
  background-color: rgba(0, 0, 0, 0.8);
  box-shadow: 0px 0px 3px 1px rgba(50, 50, 50, 0.4);
  border-radius: 5px;
  color: #fff;
  font-size: 13px;
  margin-bottom: 10px;
  padding: 7px 12px;
  width: 220px;
}
.markDetailPopup .title {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  padding: 1px;
}
.selectMarkButton {
  color: #fff;
  background-color: #409eff;
  border-color: #409eff;
}
</style>
