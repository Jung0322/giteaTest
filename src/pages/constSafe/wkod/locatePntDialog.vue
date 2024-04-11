<!--
  목적 : 작업허가서 상세 > 작업위치
  Detail : 작업허가서 상세 > 작업위치
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row>
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 작업위치 -->
            <y-label label="L0000002406" icon="user-edit" color-class="cutstom-title-color" />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 지도선택 -->
              <y-btn
                v-if="!popupParam.disabled && editable"
                title="L0000002756"
                color="black"
                @btnClicked="mapOpenPopup"
              />
              <!-- 저장 -->
              <y-btn
                v-if="!popupParam.disabled && editable"
                title="L0000002474"
                color="orange"
                @btnClicked="closePopup('S')"
              />
              <!-- 닫기 -->
              <y-btn
                title="L0000000881"
                @btnClicked="closePopup('C')"
              />
            </div>
          </b-col>
        </b-row>
        <b-card header-class="default-card" body-class="default-body-card" class="py-0">
          <b-row>
            <b-col>
              <!-- 지도명 :  -->
              <y-label label="L0000004272" />
              <y-label :label="map.mapName" color-class="cutstom-title-color" />
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12" style="overflow:scroll">
              <canvas id="canvas" @click="imageClick"></canvas>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';

export default {
  /* attributes: name, components, props, data */
  name: 'locate-pnt-dialog',
  props: {
    popupParam: {
      type: Object,
      default: {
        locatePntX: 0,
        locatePntY: 0,
        mapNo: 0,
        plantCd: '',
        disabled: false,
      },
    },
  },
  data() {
    return {
      oldParam: {
        locatePntX: 0,
        locatePntY: 0,
        mapNo: 0,
      },
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '60%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      map: {
        mapId: '',
        mapName: '',
        imgBase64: '',
        description: '',
        useYn: '',
        plantCd: '',
      },
      editable: false,
    };
  },
  watch: {
    'map.imgBase64'() {
      this.setCanvas();
    },
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {
    this.init();
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      this.oldParam.locatePntX = this.popupParam.locatePntX;
      this.oldParam.locatePntY = this.popupParam.locatePntY;
      this.oldParam.mapNo = this.popupParam.mapNo;

      let promises = [
        {
          func: this.getMap,
        },
        {
          func: this.setCanvas,
        }
      ];
      this.$comm.orderedPromise(promises);
      // this.getMap();
      // this.setCanvas();
      this.draw();
    },
    getMap() {
      return new Promise((_resolve, _reject) => {
        if (this.map.mapId) this.popupParam.mapNo = this.map.mapId;
        this.$http.url = selectConfig.saf.wkodMaster.getMap.url;
        this.$http.param = {
          plantCd: this.popupParam.plantCd,
          mapNo: this.popupParam.mapNo,
        }
        this.$http.type = 'GET';
        this.$http.request(
          _result => {
            if (!_result.data) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395', // '안내',
                message: 'M0000000234', // 해당 프로젝트에 지도가 없습니다.
                type: 'warning',
              });
              this.closePopup('C');
              _resolve(false);
            } else {
              this.map = this.$_.clone(_result.data);
              this.popupParam.mapNo = this.map.mapId;
              $('#canvas').css({
                'background': 'url(' + this.map.imgBase64 + ')',
                'background-repeat': 'no-repeat'
              });
              _resolve(true);
            }
          },
          _error => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
            _reject(_error)
          }
        );
      });
    },
    /**
     * 사용자의 입력을 받는다.
     */
    imageClick() {
      this.popupParam.locatePntX = event.offsetX;
      this.popupParam.locatePntY = event.offsetY;
      // if (this.popupParam.wkodStepCd === 'WKS01') {
      // }
      this.draw();
    },
    getConfirm() {},
    mapOpenPopup() {
      this.popupOptions.title = 'L0000002407'; // 작업위치 지도선택
      this.popupOptions.param = {
        activation: true,
        plantCd: this.popupParam.plantCd,
        popupMode: true,
      };
      this.popupOptions.target = () => import(`${'../../saf/baseInfo/map/map.vue'}`);
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.mapClosePopup;
    },
    mapClosePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data) {
        this.map = this.$_.clone(data);
        this.popupParam.mapNo = data.mapId;
        this.init();
      } else {
        // this.getMap();
      }
    },
    setCanvas() {
      return new Promise((_resolve, _reject) => {
        const canvas = document.getElementById('canvas');
        let img = new Image();
        img.src = this.map.imgBase64;
        setTimeout(() => {
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          // canvas.width = 700;
          // canvas.height = 580;
          this.draw();
        }, 100);
        _resolve(true);
      });
    },
    draw() {
      const canvas = document.getElementById('canvas');
      if (canvas.getContext) {
        const ctx = canvas.getContext('2d');
        // let img = new Image();
        // img.src = this.map.imgBase64;

        // canvas.width = img.naturalWidth;
        // canvas.height = img.naturalHeight;

        ctx.clearRect(0, 0, canvas.width, canvas.height); // 픽셀 정리
        ctx.beginPath(); // 컨텍스트 리셋
        ctx.strokeStyle = 'red'; // 선색
        ctx.fillStyle = 'red'; // 채우기 색
        ctx.globalAlpha = '0.8'; // 투명도

        ctx.beginPath();

        // 설정
        const x = this.popupParam.locatePntX; // x 좌표
        const y = this.popupParam.locatePntY; // y 좌표
        const radius = 7; // 반지름
        const startAngle = 0; // 시작각도
        const endAngle = Math.PI * 2; // 종료각도
        const anticlockwise = false; // 시계방향 or 시계반대방향

        ctx.arc(x, y, radius, startAngle, endAngle, anticlockwise);
        // ctx.stroke(); // 채우기 없음
        ctx.fill(); // 채우기
      }
    },
    closePopup(flag) {
      if (flag === 'S') this.$emit('closePopup', this.popupParam);
      else this.$emit('closePopup', this.oldParam);
    },
    /** button 관련 이벤트 **/
    /** end button 관련 이벤트 **/
  },
};
</script>

<style>
</style>