<!--
  목적 : 공정시설정보 - 동력기계(입력 tab)
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
            <!-- 동력기계 상세 -->
            <y-label
              label="L0000000962"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 저장 -->
              <y-btn
                v-if="!flag && editable"
                :action-url="insertUrl"
                :param="facilityPwrInfo"
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
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <!-- 명세 -->
              <y-textarea
                :width="9"
                :editable="editable"
                :disabled="flag"
                :maxlength="200"
                ui="bootstrap"
                label="L0000001018"
                name="specInfo"
                v-model="facilityPwrInfo.specInfo"
              ></y-textarea>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <!-- 주요재질 -->
              <y-text
                :width="9"
                :editable="editable"
                :disabled="flag"
                :maxlength="60"
                ui="bootstrap"
                type="search"
                label="L0000002719"
                name="matQuality"
                v-model="facilityPwrInfo.matQuality"
              ></y-text>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <!-- 전동기용량 -->
              <y-text
                :width="9"
                :editable="editable"
                :disabled="flag"
                :maxlength="60"
                ui="bootstrap"
                type="search"
                label="L0000002499"
                name="motorVol"
                v-model="facilityPwrInfo.motorVol"
              ></y-text>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <!-- 방호장치종류 -->
              <y-text
                :width="9"
                :editable="editable"
                :disabled="flag"
                :maxlength="60"
                ui="bootstrap"
                type="search"
                label="L0000001128"
                name="protectType"
                v-model="facilityPwrInfo.protectType"
              ></y-text>
            </b-col>
            <!-- 2021-06-01 etg 인버터-가동락방식 -> 비고로 명칭 변경 -->
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <!-- 비고 -->
              <y-textarea
                :width="9"
                :editable="editable"
                :disabled="flag"
                :maxlength="200"
                ui="bootstrap"
                type="search"
                label="L0000001360"
                name="invertorNm"
                v-model="facilityPwrInfo.invertorNm"
              ></y-textarea>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-3">
              <!-- 변경발의번호 -->
              <y-text
                :width="9"
                :disabled="flag"
                :editable="editable"
                ui="bootstrap"
                type="search"
                label="L0000004754"
                name="chngNum"
                v-model="facilityPwrInfo.chngNum"
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
  name: 'power-machine-tab',
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
      facilityPwrInfo: {
        safFacilityCd: '',
        specInfo: '',
        invertorNm: '',
        protectType: '',
        motorVol: '',
        matQuality: '',
        chemprods: [],
        chngNum: '',
        chngNo: 0,
        createUserId: '',
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
      this.searchUrl = selectConfig.psm.processFacility.powerMachine.get.url;
      this.insertUrl =
        transactionConfig.psm.processFacility.powerMachine.insert.url;

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
          if (_result.data) this.facilityPwrInfo = this.$_.clone(_result.data);
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
          this.facilityPwrInfo.safFacilityCd = this.facilityMst.safFacilityCd;
          this.facilityPwrInfo.chemprods = [];
          this.facilityPwrInfo.createUserId = this.$store.getters.token;
          this.$_.forEach(this.facilityMst.chemprods, (item) => {
            item.equipmentNo = 0;
            this.facilityPwrInfo.chemprods.push(item);
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
        this.facilityPwrInfo.chngNum = data.chngNum;
        this.facilityPwrInfo.safChngNo = data.safChngNo;
      }
    },
    removeMoc() {
      this.facilityPwrInfo.chngNum = '';
      this.facilityPwrInfo.safChngNo = 0;
    },
  },
};
</script>
