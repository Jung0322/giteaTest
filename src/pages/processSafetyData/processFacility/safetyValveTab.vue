<!--
  목적 : 공정시설정보 - 안전밸브 및 파열판(입력 tab)
  작성자 : kdh
  Detail :
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
            <!-- 안전밸브 및 파열판 상세 -->
            <y-label
              label="L0000001857"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 저장 -->
              <y-btn
                v-if="!flag && editable"
                :action-url="insertUrl"
                :param="safetyValve"
                :is-submit="isInsert"
                title="L0000002474"
                color="orange"
                action-type="POST"
                beforeSubmit="beforeInsert"
                @beforeInsert="beforeInsert"
                @btnClicked="btnInsertClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 내용물 -->
              <y-text
                :width="8"
                :editable="editable"
                :disabled="flag"
                :maxlength="60"
                ui="bootstrap"
                type="search"
                label="L0000000811"
                name="inMat"
                v-model="safetyValve.inMat"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 상태 -->
              <y-text
                :width="8"
                :editable="editable"
                :disabled="flag"
                :maxlength="60"
                ui="bootstrap"
                type="search"
                label="L0000001538"
                name="condition"
                v-model="safetyValve.condition"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 배출용량(kg/hr) -->
              <y-text
                :width="8"
                :editable="editable"
                :disabled="flag"
                :maxlength="60"
                ui="bootstrap"
                type="search"
                label="L0000001183"
                name="outVol"
                v-model="safetyValve.outVol"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 정격용량(kg/hr) -->
              <y-text
                :width="8"
                :editable="editable"
                :disabled="flag"
                :maxlength="60"
                ui="bootstrap"
                type="search"
                label="L0000002595"
                name="regulVol"
                v-model="safetyValve.regulVol"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 노즐크기-입구 -->
              <y-text
                :width="8"
                :editable="editable"
                :disabled="flag"
                :maxlength="60"
                ui="bootstrap"
                type="search"
                label="L0000000843"
                name="nozSizeIn"
                v-model="safetyValve.nozSizeIn"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 노즐크기-출구 -->
              <y-text
                :width="8"
                :editable="editable"
                :disabled="flag"
                :maxlength="60"
                ui="bootstrap"
                type="search"
                label="L0000000844"
                name="nozSizeOut"
                v-model="safetyValve.nozSizeOut"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 압력-기기번호 -->
              <y-text
                :width="8"
                :editable="editable"
                :disabled="flag"
                :maxlength="60"
                ui="bootstrap"
                type="search"
                label="L0000001908"
                name="protectSerial"
                v-model="safetyValve.protectSerial"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 압력-운전(MPa) -->
              <y-text
                :width="8"
                :editable="editable"
                :disabled="flag"
                :maxlength="60"
                ui="bootstrap"
                type="search"
                label="L0000001912"
                name="protectOpr"
                v-model="safetyValve.protectOpr"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 압력-설계(MPa) -->
              <y-text
                :width="8"
                :editable="editable"
                :disabled="flag"
                :maxlength="60"
                ui="bootstrap"
                type="search"
                label="L0000001910"
                name="protectPlan"
                v-model="safetyValve.protectPlan"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 밸브-설정(Mpa) -->
              <y-text
                :width="8"
                :editable="editable"
                :disabled="flag"
                :maxlength="60"
                ui="bootstrap"
                type="search"
                label="L0000001204"
                name="valveSetting"
                v-model="safetyValve.valveSetting"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 밸브-몸체재질 -->
              <y-text
                :width="8"
                :editable="editable"
                :disabled="flag"
                :maxlength="60"
                ui="bootstrap"
                type="search"
                label="L0000001203"
                name="valueMat"
                v-model="safetyValve.valueMat"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 밸브-Trim재질 -->
              <y-text
                :width="8"
                :editable="editable"
                :disabled="flag"
                :maxlength="60"
                ui="bootstrap"
                type="search"
                label="L0000001202"
                name="valveTrim"
                v-model="safetyValve.valveTrim"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <y-text
                :width="8"
                :editable="editable"
                :disabled="flag"
                :maxlength="60"
                ui="bootstrap"
                type="search"
                label="정밀도(오차범위)"
                name="precision"
                v-model="safetyValve.precision"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 배출연결부위 -->
              <y-text
                :width="8"
                :editable="editable"
                :disabled="flag"
                :maxlength="60"
                ui="bootstrap"
                type="search"
                label="L0000001181"
                name="outConnect"
                v-model="safetyValve.outConnect"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 배출원인 -->
              <y-text
                :width="8"
                :editable="editable"
                :disabled="flag"
                :maxlength="60"
                ui="bootstrap"
                type="search"
                label="L0000001184"
                name="outReason"
                v-model="safetyValve.outReason"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 형식 -->
              <y-text
                :width="8"
                :editable="editable"
                :disabled="flag"
                :maxlength="60"
                ui="bootstrap"
                type="search"
                label="L0000003270"
                name="form"
                v-model="safetyValve.form"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 변경발의번호 -->
              <y-text
                :width="8"
                :disabled="flag"
                :editable="editable"
                ui="bootstrap"
                type="search"
                label="L0000004754"
                name="chngNum"
                v-model="safetyValve.chngNum"
              ></y-text>
            </b-col>
          </b-row>

          <!-- <component :is="facilityChemprod" v-if="facilityChemprod" :facilityMst.sync="facilityMst" :flag="flag" /> -->
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
  name: 'safety-valve-tab',
  props: {
    facilityMst: {
      type: Object,
      default: () => ({
        safFacilityCd: '',
        chemprods: [],
        plantCd: '',
      }),
    },
    flag: false,
  },
  data() {
    return {
      safetyValve: {
        safFacilityCd: '',
        inMat: '',
        condition: '',
        outVol: '',
        regulVol: '',
        nozSizeIn: '',
        nozSizeOut: '',
        protectSerial: '',
        protectOpr: '',
        protectPlan: '',
        valveSetting: '',
        valueMat: '',
        valveTrim: '',
        precision: '',
        outConnect: '',
        outReason: '',
        form: '',
        chemprods: [],

        chngNum: '',
        chngNo: 0,
        createUserId: '',
        updateUserId: '',
      },
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        param: {},
        width: '80%',
        top: '10px',
        closeCallback: null,
      },
      editable: false,
      isInsert: false,
      searchUrl: '',
      insertUrl: '',
      facilityChemprod: null,
    };
  },
  watch: {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    this.loadComponent();
  },
  beforeDestroy() {},
  methods: {
    init() {
      // URL 셋팅
      this.searchUrl = selectConfig.psm.processFacility.safetyValve.get.url;
      this.insertUrl =
        transactionConfig.psm.processFacility.safetyValve.insert.url;

      this.editable = this.$route.meta.editable;

      this.getList();
    },
    loadComponent() {
      this.facilityChemprod = () =>
        import('@/pages/common/chemProd/facilityChemprod');
    },
    getList() {
      this.$http.url = this.$format(
        this.searchUrl,
        this.facilityMst.safFacilityCd
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          // this.facilityMst.powerMachine = this.$_.clone(_result.data);
          if (_result.data) this.safetyValve = this.$_.clone(_result.data);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    beforeInsert() {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321', // '확인',
        message: 'M0000000011', // 저장하시겠습니까?
        type: 'info',
        // 확인 callback 함수
        confirmCallback: () => {
          this.safetyValve.safFacilityCd = this.facilityMst.safFacilityCd;
          this.safetyValve.createUserId = this.$store.getters.token;
          this.safetyValve.chemprods = [];
          this.$_.forEach(this.facilityMst.chemprods, (item) => {
            item.equipmentNo = 0;
            this.safetyValve.chemprods.push(item);
          });
          this.isInsert = true;
        },
        // 취소 callback 함수
        cancelCallback: () => {
          this.isInsert = false;
        },
      });
    },
    // 신규등록
    btnInsertClickedCallback(_result) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // '안내',
        message: 'M0000000006', // 저장되었습니다.
        type: 'success',
      });
      this.isInsert = false;
    },
    // 버튼 에러 처리
    btnClickedErrorCallback(_result) {
      this.isInsert = false;
      window.getApp.emit('APP_REQUEST_ERROR', _result);
    },
    searchMoc() {
      this.popupOptions.param = {
        plantCd: this.facilityMst.plantCd,
        chngRefWorkCd: 'CGRW1',
      };
      this.popupOptions.target = () =>
        import(`${'@/pages/saf/change/changePop.vue'}`);
      this.popupOptions.title = 'L0000001221'; // 변경관리
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      this.popupOptions.closeCallback = this.closeMocPopup;
    },
    closeMocPopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data !== 'CLOSE') {
        this.safetyValve.chngNum = data.chngNum;
        this.safetyValve.safChngNo = data.safChngNo;
      }
    },
    removeMoc() {
      this.safetyValve.chngNum = '';
      this.safetyValve.safChngNo = 0;
    },
  },
};
</script>
