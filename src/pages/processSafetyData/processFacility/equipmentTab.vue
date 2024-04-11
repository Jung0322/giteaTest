<!--
  목적 : 공정시설정보 - 장치 및 설비(입력 tab)
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
            <!-- 장치 및 설비 상세 -->
            <y-label
              label="L0000002455"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 저장 -->
              <y-btn
                v-if="!flag && editable"
                :action-url="insertUrl"
                :param="facilityEquipment"
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
                v-model="facilityEquipment.inMat"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 용량 -->
              <y-text
                :width="8"
                :editable="editable"
                :disabled="flag"
                :maxlength="60"
                ui="bootstrap"
                type="search"
                label="L0000002061"
                name="vol"
                v-model="facilityEquipment.vol"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 압력-운전 -->
              <y-text
                :width="8"
                :editable="editable"
                :disabled="flag"
                :maxlength="60"
                ui="bootstrap"
                type="search"
                label="L0000001911"
                name="pressOpr"
                v-model="facilityEquipment.pressOpr"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 압력-설계 -->
              <y-text
                :width="8"
                :editable="editable"
                :disabled="flag"
                :maxlength="60"
                ui="bootstrap"
                type="search"
                label="L0000001909"
                name="pressPlan"
                v-model="facilityEquipment.pressPlan"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 온도(℃)-운전 -->
              <y-text
                :width="8"
                :editable="editable"
                :disabled="flag"
                :maxlength="60"
                ui="bootstrap"
                type="search"
                label="L0000002031"
                name="tempOpr"
                v-model="facilityEquipment.tempOpr"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!--  온도(℃)-설계 -->
              <y-text
                :width="8"
                :editable="editable"
                :disabled="flag"
                :maxlength="60"
                ui="bootstrap"
                type="search"
                label="L0000002030"
                name="tempPlan"
                v-model="facilityEquipment.tempPlan"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 사용재질-본체 -->
              <y-text
                :width="8"
                :editable="editable"
                :disabled="flag"
                :maxlength="60"
                ui="bootstrap"
                type="search"
                label="L0000001478"
                name="matMain"
                v-model="facilityEquipment.matMain"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 사용재질-부속품 -->
              <y-text
                :width="8"
                :editable="editable"
                :disabled="flag"
                :maxlength="60"
                ui="bootstrap"
                type="search"
                label="L0000001479"
                name="matSub"
                v-model="facilityEquipment.matSub"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 사용재질-개스킷 -->
              <y-text
                :width="8"
                :editable="editable"
                :disabled="flag"
                :maxlength="60"
                ui="bootstrap"
                type="search"
                label="L0000001477"
                name="matGasket"
                v-model="facilityEquipment.matGasket"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 용접효율 -->
              <y-text
                :width="8"
                :editable="editable"
                :disabled="flag"
                :maxlength="60"
                ui="bootstrap"
                type="search"
                label="L0000002069"
                name="weldEff"
                v-model="facilityEquipment.weldEff"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 계산두께(mm) -->
              <y-text
                :width="8"
                :editable="editable"
                :disabled="flag"
                :maxlength="60"
                ui="bootstrap"
                type="search"
                label="L0000000465"
                name="calcThick"
                v-model="facilityEquipment.calcThick"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 부식여유(mm) -->
              <y-text
                :width="8"
                :editable="editable"
                :disabled="flag"
                :maxlength="60"
                ui="bootstrap"
                type="search"
                label="L0000001336"
                name="corrosBuf"
                v-model="facilityEquipment.corrosBuf"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 사용두께(mm) -->
              <y-text
                :width="8"
                :editable="editable"
                :disabled="flag"
                :maxlength="60"
                ui="bootstrap"
                type="search"
                label="L0000001444"
                name="useThick"
                v-model="facilityEquipment.useThick"
              ></y-text>
            </b-col>
            <!-- <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <y-text
                :width="8"
                :editable="editable"
                :disabled="flag"
                :maxlength="60"
                ui="bootstrap"
                type="search"
                label="비파괴검사방법"
                name="nondestructMethod"
                v-model="facilityEquipment.nondestructMethod"
              ></y-text>
            </b-col> -->
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 후열처리여부 -->
              <y-switch
                :width="8"
                :editable="editable"
                :disabled="flag"
                true-value="Y"
                false-value="N"
                ui="bootstrap"
                label="L0000003369"
                name="aftHeatTreatYn"
                selectText="YES"
                unselectText="NO"
                v-model="facilityEquipment.aftHeatTreatYn"
              ></y-switch>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 비파괴검사율(%) -->
              <y-text
                :width="8"
                :editable="editable"
                :disabled="flag"
                :maxlength="60"
                ui="bootstrap"
                type="search"
                label="L0000001377"
                name="nondestructPer"
                v-model="facilityEquipment.nondestructPer"
              ></y-text>
            </b-col>
            <!-- 2021-06-01 etg 적용법령 > 비고 명칭변경 -->
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 변경발의번호 -->
              <y-text
                :width="8"
                :disabled="flag"
                :editable="editable"
                ui="bootstrap"
                label="L0000004754"
                name="chngNum"
                type="search"
                v-model="facilityEquipment.chngNum"
              ></y-text>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-4">
              <!-- 비고 -->
              <y-textarea
                :width="8"
                :editable="editable"
                :disabled="flag"
                :maxlength="150"
                ui="bootstrap"
                type="search"
                label="L0000001360"
                name="actLaw"
                v-model="facilityEquipment.actLaw"
              ></y-textarea>
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
  name: 'equipment-tab',
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
      facilityEquipment: {
        safFacilityCd: '',
        equipmentNo: 0,
        inMat: '',
        vol: '',
        pressOpr: '',
        pressPlan: '',
        tempOpr: '',
        tempPlan: '',
        matMain: '',
        matSub: '',
        matGasket: '',
        weldEff: '',
        calcThick: '',
        corrosBuf: '',
        useThick: '',
        aftHeatTreatYn: 'N',
        nondestructMethod: '',
        nondestructPer: '',
        actLaw: '',
        createUserId: '',
        updateUserId: '',
        chngNum: '',
        chngNo: 0,
      },
      editable: false,
      isInsert: false,
      searchUrl: '',
      insertUrl: '',
      facilityChemprod: null,
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        param: {},
        width: '80%',
        top: '10px',
        closeCallback: null,
      },
    };
  },
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
      this.searchUrl = selectConfig.psm.processFacility.equipment.get.url;
      this.insertUrl =
        transactionConfig.psm.processFacility.equipment.insert.url;

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
        this.facilityMst.safFacilityCd,
        this.facilityEquipment.equipmentNo
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          if (_result.data) {
            this.facilityEquipment = this.$_.clone(_result.data);
          }
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
          this.facilityEquipment.safFacilityCd = this.facilityMst.safFacilityCd;
          this.facilityEquipment.createUserId = this.$store.getters.token;
          this.facilityEquipment.updateUserId = this.$store.getters.token;
          this.facilityEquipment.chemprods = [];
          this.$_.forEach(this.facilityMst.chemprods, (item) => {
            item.equipmentNo = 0;
            this.facilityEquipment.chemprods.push(item);
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
        this.facilityEquipment.chngNum = data.chngNum;
        this.facilityEquipment.safChngNo = data.safChngNo;
      }
    },
    removeMoc() {
      this.facilityEquipment.chngNum = '';
      this.facilityEquipment.safChngNo = 0;
    },
  },
};
</script>
