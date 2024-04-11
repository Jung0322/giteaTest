<!--
  목적 : 사업장 무재해 등록/수정
  작성자 : kth
  Detail :
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row>
      <!-- 사업장 무재해 상세 -->
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 무재해 등록 -->
            <y-label
              label="L0000001037"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 저장 -->
              <y-btn
                v-if="editable && !updateMode && !popupParam.isSearch"
                :action-url="insertUrl"
                :param="noAccident"
                :is-submit="isInsertSubmit"
                title="L0000002474"
                color="orange"
                action-type="POST"
                beforeSubmit="beforeInsert"
                @beforeInsert="beforeInsert"
                @btnClicked="btnInsertClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 저장 -->
              <y-btn
                v-if="editable && updateMode && editAuth"
                :action-url="editUrl"
                :param="noAccident"
                :is-submit="isEditSubmit"
                title="L0000002474"
                color="orange"
                action-type="PUT"
                beforeSubmit="beforeEdit"
                @beforeEdit="beforeEdit"
                @btnClicked="btnEditClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 삭제 -->
              <y-btn
                v-if="editable && updateMode && editAuth"
                title="L0000001495"
                color="red"
                @btnClicked="btnDeleteClicked"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 닫기 -->
              <y-btn title="L0000000881" @btnClicked="btnClosePopup" />
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <y-plant
                type="edit"
                :editable="editable"
                :disabled="isDisabledPlantCd"
                name="plantCd"
                v-model="noAccident.plantCd"
                :required="true"
                v-validate="'required'"
                :state="validateState('plantCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 무재해시작일 -->
              <y-datepicker
                :width="baseWidth"
                :editable="editable"
                :disabled="isInActiveYn"
                default="today"
                label="L0000001040"
                name="startYmd"
                :clearable="true"
                v-model="noAccident.startYmd"
                :required="true"
                v-validate="'required'"
                :state="validateState('startYmd')"
              ></y-datepicker>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 목표배수 -->
              <y-number
                :width="baseWidth"
                :editable="editable"
                ui="bootstrap"
                :disabled="isInActiveYn"
                label="L0000001029"
                :maxlength="3"
                name="multiple"
                v-model="noAccident.multiple"
                :required="true"
                v-validate="'required'"
                :state="validateState('multiple')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 기준일수 -->
              <y-number
                :width="baseWidth"
                :editable="editable"
                ui="bootstrap"
                :disabled="isInActiveYn"
                label="L0000000791"
                :maxlength="6"
                name="stndDays"
                v-model="noAccident.stndDays"
                :required="true"
                v-validate="'required'"
                :state="validateState('stndDays')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 목표일수 수정 전 소스 => :disabled="isInActiveYn"-->
              <y-number
                :width="baseWidth"
                ui="bootstrap"
                :disabled="true"
                label="L0000001031"
                :maxlength="10"
                name="targetDays"
                v-model="noAccident.targetDays"
                :required="true"
                v-validate="'required'"
                :state="validateState('targetDays')"
              ></y-number>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 목표달성예정일 수정 전 소스 => :disabled="updateMode"-->
              <y-datepicker
                :width="baseWidth"
                :editable="editable"
                :disabled="true"
                label="L0000001026"
                name="endSchYmd"
                :clearable="true"
                v-model="noAccident.endSchYmd"
                :required="true"
                v-validate="'required'"
                :state="validateState('endSchYmd')"
              ></y-datepicker>
            </b-col>
            <!-- <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <y-switch
                :width="8"
                true-value="Y"
                false-value="N"
                ui="bootstrap"
                :disabled="isInActiveYn"
                label="사용여부"
                name="useYn"
                selectText="사용"
                unselectText="미사용"
                v-model="noAccident.useYn"
                :required="true"
                v-validate="'required'"
                :error-msg="errors.first('useYn')"
                :state="validateState('useYn')"
              />
            </b-col>-->
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 현재일수 -->
              <y-number
                :width="8"
                ui="bootstrap"
                :disabled="true"
                label="L0000003242"
                :maxlength="10"
                name="totalDays"
                v-model="noAccident.totalDays"
              ></y-number>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 종료여부 , 종료/미종료 -->
              <y-switch
                :width="8"
                true-value="Y"
                false-value="N"
                ui="bootstrap"
                :disabled="isDisableEndYn"
                label="L0000002704"
                name="closeYn"
                selectText="L0000003618"
                unselectText="L0000003619"
                v-model="noAccident.closeYn"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 종료사유 -->
              <y-select
                :width="8"
                :comboItems="selNoaccEtypeCds"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                :disabled="isDisableEndYmd"
                type="search"
                label="L0000002703"
                name="noaccEtypeCd"
                v-model="noAccident.noaccEtypeCd"
                :required="requiredEnd"
                v-validate="requiredEnd ? 'required' : ''"
                :state="validateState(requiredEnd ? 'noaccEtypeCd' : '')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 달성여부, 달성/미달성 -->
              <y-switch
                :width="8"
                true-value="Y"
                false-value="N"
                ui="bootstrap"
                :disabled="true"
                label="L0000000885"
                name="endYn"
                selectText="L0000000882"
                unselectText="L0000001060"
                v-model="noAccident.endYn"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 목표달성일/종료일 -->
              <y-datepicker
                :width="baseWidth"
                :editable="editable"
                :disabled="isDisableEndYmd"
                label="L0000001027"
                name="endYmd"
                :clearable="true"
                v-model="noAccident.endYmd"
                :required="requiredEnd"
                v-validate="requiredEnd ? 'required' : ''"
                :state="validateState(requiredEnd ? 'endYmd' : '')"
              ></y-datepicker>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 근무인원(정규직) -->
              <y-number
                :width="8"
                ui="bootstrap"
                :disabled="isInActiveYn"
                label="L0000000750"
                :maxlength="5"
                name="dayMancntCpy"
                v-model="noAccident.dayMancntCpy"
              ></y-number>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 근무인원(협력업체) -->
              <y-number
                :width="8"
                ui="bootstrap"
                :disabled="isInActiveYn"
                label="L0000000752"
                :maxlength="5"
                name="dayMancntCon"
                v-model="noAccident.dayMancntCon"
              ></y-number>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 근무인원(합계) -->
              <y-number
                :width="8"
                ui="bootstrap"
                :disabled="true"
                label="L0000000751"
                name="dayMancntCon"
                v-model="noAccident.dayMancntSum"
              ></y-number>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <!-- 비고 -->
              <y-text
                :width="10"
                ui="bootstrap"
                :disabled="isInActiveYn"
                label="L0000001360"
                name="remark"
                :maxlength="1000"
                v-model="noAccident.remark"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 포상금액(천원) -->
              <y-number
                :width="8"
                ui="bootstrap"
                :disabled="isInActiveYn"
                label="L0000003139"
                :maxlength="10"
                name="rewadMoney"
                v-model="noAccident.rewadMoney"
              ></y-number>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 표창인원(대표이사) -->
              <y-number
                :width="8"
                ui="bootstrap"
                :disabled="isInActiveYn"
                label="L0000003154"
                name="cmdaNumCeo"
                :maxlength="10"
                v-model="noAccident.cmdaNumCeo"
              ></y-number>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 무재해 시작 사유 -->
              <y-select
                :width="8"
                :comboItems="selNoaccStypeCds"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                :disabled="isInActiveYn"
                type="search"
                :required="true"
                label="L0000001038"
                name="noaccStypeCd"
                v-model="noAccident.noaccStypeCd"
                v-validate="'required'"
                :state="validateState('noaccStypeCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 표창인원(공장장) -->
              <y-number
                :width="8"
                ui="bootstrap"
                :disabled="isInActiveYn"
                label="L0000003153"
                name="holiMh"
                :maxlength="10"
                v-model="noAccident.cmdaNumPm"
              ></y-number>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
    <!-- 팝업 설정 -->
    <y-dialog :param="popupOptions"></y-dialog>
    <!-- 설비 grid -->
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000000558')"
          :useExcelExport="false"
          :enableSorting="true"
          :showGridSetSave="true"
        />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  /** attributes: name, components, props, data **/
  name: 'create-noAccident',
  props: {
    popupParam: {
      type: Object,
      default: {
        safNoAccidentNo: 0,
        pageNm: '',
        noAccUseYn: false,
        isSearch: false,
      },
    },
  },
  // TODO: 화살표 함수(=>)는 data에 사용하지 말 것
  //    data: () => { return { a: this.myProp }}) 화살표 함수가 부모 컨텍스트를 바인딩하기 때문에 this는 예상과 달리 Vue 인스턴스가 아니기 때문에 this.myProp는 undefined로 나옵니다.
  //    참고url: https://kr.vuejs.org/v2/api/index.html#data
  data() {
    return {
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '90%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      searchParam: {
        duration: [],
        searchFlag: 'HIS',
      },
      component: null,
      noAccident: {
        safNoAccidentNo: 0,
        startYmd: '',
        endSchYmd: '',
        plantCd: null,
        mhUseYn: 'Y',
        targetMh: '',
        initMh: '',
        normMh: '',
        holiMh: '',
        dayMancntCpy: '',
        dayMancntCon: '',
        dayUseYn: 'Y',
        endYn: 'N',
        closeYn: 'N',
        targetDays: '',
        initDays: '',
        normalDays: '',
        holiDays: '',
        remark: '',
        useYn: 'Y',
        createUserId: '',
        createDt: '',
        updateUserId: '',
        updateDt: '',
        totalMh: 0,
        totalDays: 0,
        progressMh: 0,
        bydateMh: '',
        noAccidentDays: 0,
        noaccStypeCd: null,
        noaccStypeNm: '',
        noaccStypeYmd: '',
        updateYn: 0,
        reward: 0,
        cmdaNumCeo: null,
        cmdaNumPm: null,
      },
      gridOptions: {
        name: 'createNoAccident',
        header: [],
        data: [],
        height: '300',
      },
      YAuigrid: null,
      baseWidth: 8,
      editable: true,
      insertMode: false,
      updateMode: false,
      plantCds: [],
      selNoaccStypeCds: [], // 시작사유 종류
      selNoaccEtypeCds: [], // 종료사유 종류
      insertUrl: '',
      editUrl: '',
      deleteUrl: '',
      isInsertSubmit: false,
      isEditSubmit: false,
      deleteValue: null,
      recentendSchYmd: null,
      isInActiveYn: false,
      requiredEnd: false,
      isDisableEndYn: false, // 달성여부 disable 처리
      isDisableEndYmd: false, // 달성일 disable 처리
      isInit: true,
      isDisabledPlantCd: false,
      editAuth: false,
    };
  },
  watch: {
    tabIndex() {},
    // 종료여부
    'noAccident.closeYn': function (newValue, oldValue) {
      if (newValue === 'Y') {
        this.requiredEnd = true;
        this.isDisableEndYmd = false;
      } else {
        this.requiredEnd = false;
        this.noAccident.endYn = 'N';
        this.noAccident.endYmd = '';
        this.noAccident.noaccEtypeCd = '';
        this.isDisableEndYmd = true;
      }
    },
    // 종료사유
    'noAccident.noaccEtypeCd': function (newValue, oldValue) {
      if (newValue === 'NAET1') {
        this.noAccident.endYn = 'Y';
      } else if (newValue === 'NAET2') {
        this.noAccident.endYn = 'N';
      }
    },
    'noAccident.plantCd': function (newValue, oldValue) {
      this.getNoAccidentList();
    },
    'noAccident.startYmd': function (newValue, oldValue) {
      if (this.isInit === false) {
        // 무재해 시작일
        this.noAccident.targetDays =
          Number(this.noAccident.multiple) * Number(this.noAccident.stndDays);

        if (!this.$comm.isStringEmpty(this.noAccident.startYmd)) {
          this.noAccident.endSchYmd = this.$comm.getCalculatedDate(
            this.noAccident.startYmd,
            this.noAccident.targetDays + 'd',
            'YYYY-MM-DD',
            'YYYY-MM-DD'
          );
        }
      }
    },
    'noAccident.multiple': function (newValue, oldValue) {
      if (this.isInit === false) {
        // 목표배수
        this.noAccident.targetDays =
          Number(this.noAccident.multiple) * Number(this.noAccident.stndDays);

        if (!this.$comm.isStringEmpty(this.noAccident.startYmd)) {
          this.noAccident.endSchYmd = this.$comm.getCalculatedDate(
            this.noAccident.startYmd,
            this.noAccident.targetDays + 'd',
            'YYYY-MM-DD',
            'YYYY-MM-DD'
          );
        }
      }
    },
    'noAccident.stndDays': function (newValue, oldValue) {
      if (this.isInit === false) {
        // 기준일수
        this.noAccident.targetDays =
          Number(this.noAccident.multiple) * Number(this.noAccident.stndDays);

        if (!this.$comm.isStringEmpty(this.noAccident.startYmd)) {
          this.noAccident.endSchYmd = this.$comm.getCalculatedDate(
            this.noAccident.startYmd,
            this.noAccident.targetDays + 'd',
            'YYYY-MM-DD',
            'YYYY-MM-DD'
          );
        }
      }
    },
    'noAccident.dayMancntCpy': function (newValue, oldValue) {
      // 직영 근무인원
      this.noAccident.dayMancntSum =
        Number(this.noAccident.dayMancntCpy) +
        Number(this.noAccident.dayMancntCon);
    },
    'noAccident.dayMancntCon': function (newValue, oldValue) {
      // 협력업체 근무인원
      this.noAccident.dayMancntSum =
        Number(this.noAccident.dayMancntCpy) +
        Number(this.noAccident.dayMancntCon);
    },
  },
  /** Vue lifecycle: created, mounted, destroyed, etc **/
  created() {},
  beforeMount() {
    // TODO : data를 초기화 시켜줌(검색 조건 유지가 필요할 때는 삭제할 것)
    // 이유 : vue.js는 SPA기반으로 동작하기 때문에 페이지를 이동하더라도 기존 입력된 정보가 그대로 남아 있는 문제가 있음
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    window.addEventListener('resize', this.setGridSize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.setGridSize);
  },
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      // URL 셋팅
      this.insertUrl = transactionConfig.saf.noAccidentResult.insert.url;
      this.editUrl = transactionConfig.saf.noAccidentResult.edit.url;
      this.searchUrl = selectConfig.saf.noAccidentResult.list.url;
      this.checkUrl = selectConfig.saf.noAccidentResult.check.url; // 사업장 무재해 중복 체크
      this.deleteUrl = transactionConfig.saf.noAccidentResult.delete.url;

      // 수정 또는 신규등록 버튼 Mode
      this.noAccident.safNoAccidentNo = this.popupParam.safNoAccidentNo;
      this.getComboItems('COM_PLANT_CD'); // 사업장

      this.getNoaccStypeCds(); // 시작사유 종류
      this.getNoaccEtypeCds(); // 종료사유 종류

      // 수정
      if (this.popupParam.safNoAccidentNo !== 0) {
        this.isDisabledPlantCd = true;
        this.getNoAccident();
        this.updateMode = true;

        if (this.popupParam.closeYn !== 'Y') this.isDisableEndYmd = true; // 목표달성일 입력불가
        // 신규
      } else {
        this.noAccident.plantCd = this.$store.getters.plantCd; // 사업장코드
        this.getNoAccidentList();
        this.updateMode = false;
        this.isDisableEndYmd = true; // 목표달성일 입력불가
        this.isDisableEndYn = true; // 달성여부 입력불가
      }
      this.editable = this.$route.meta.editable;
      /*
      if (this.popupParam.noAccUseYn !== 'Y' && this.updateMode) {
        this.isInActiveYn = true;
      } */

      if (this.popupParam.isSearch) {
        this.isDisabledPlantCd = true;
        this.isInActiveYn = true;
        this.isDisableEndYn = true;
        this.isDisableEndYmd = true;
        this.updateMode = false;
      }

      // 교육 결과 목록 grid 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002704'),
          dataField: 'closeYnNm',
          width: '11%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000885'),
          dataField: 'endYnNm',
          width: '11%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000883'),
          dataField: 'multiple',
          width: '11%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001778'),
          dataField: 'startYmd',
          width: '11%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000888'),
          dataField: 'endYmd',
          width: '11%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000887'),
          dataField: 'dayMancntSum',
          width: '11%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003139'),
          dataField: 'rewadMoneyDis',
          width: '11%',
          style: 'right-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000941'),
          dataField: 'cmdaNumCeoDis',
          width: '11%',
          style: 'right-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000513'),
          dataField: 'cmdaNumPmDis',
          width: '11%',
          style: 'right-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001777'),
          dataField: 'noaccStypeNm',
          width: '11%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002703'),
          dataField: 'noaccEtypeNm',
          width: '11%',
        },
      ];
      console.log('111', this.popupParam);
      console.log('222', this.noAccident.safNoAccidentNo);

      // this.gridOptions.data = [];
    },
    // 사업장
    getComboItems(codeGroupCd) {
      this.$http.url = this.$format(
        selectConfig.codeMaster.getSelect.url,
        codeGroupCd
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          if (codeGroupCd === 'COM_PLANT_CD') {
            this.plantCds = this.$_.clone(_result.data);
            this.plantCds.splice(0, 0, {
              code: null,
              codeNm: 'L0000003394',
            }); /* 선택하세요 */
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    // 무재해 상세조회
    getNoAccident() {
      this.$http.url = this.$format(
        selectConfig.saf.noAccidentResult.get.url,
        this.popupParam.item.safNoAccidentNo
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.noAccident = _result.data;
          if (this.editable) {
            this.editAuth = true;
            this.isInActiveYn = false;
            this.isDisableEndYn = false;
          } else {
            this.editAuth = false;
            this.isInActiveYn = true;
            this.isDisableEndYn = true;
          }

          // this.editAuth = true;
          // this.isInActiveYn = false;
          // this.isDisableEndYn = false;
          this.getNoAccidentList();
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    // 무재해 이력 조회
    getNoAccidentList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.searchParam.plantCd = this.noAccident.plantCd;
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          // this.gridOptions.data = _result.data;
          this.YAuiGrid.setGridData(this.$_.clone(_result.data));
          // this.recentStartYmd = _result.data[0].startYmd;
          this.isInit = false;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    // 부서
    getDeptItems() {
      this.$http.url = selectConfig.manage.dept.list.url;
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          _result.data.splice(0, 0, {
            deptCd: '',
            deptNm: 'L0000002519',
          }); /* 전체 */
          this.comboDeptItems = _result.data;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    // 무재해 시작 사유 종류
    getNoaccStypeCds() {
      this.$http.url = this.$format(
        selectConfig.codeMaster.getSelect.url,
        'SAF_NOACC_STYPE'
      );
      this.$http.type = 'get';
      this.$http.request(
        (_result) => {
          this.selNoaccStypeCds = this.$_.clone(_result.data);
          this.selNoaccStypeCds.splice(0, 0, {
            code: null,
            codeNm:
              this.$comm.getLangSpecInfoLabel('L0000003394') /* 선택하세요 */,
          });
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    // 종료사유 종류
    getNoaccEtypeCds() {
      this.$http.url = this.$format(
        selectConfig.codeMaster.getSelect.url,
        'SAF_NOACC_ETYPE'
      );
      this.$http.type = 'get';
      this.$http.request(
        (_result) => {
          this.selNoaccEtypeCds = this.$_.clone(_result.data);
          this.selNoaccEtypeCds.splice(0, 0, {
            code: null,
            codeNm:
              this.$comm.getLangSpecInfoLabel('L0000003394') /* 선택하세요 */,
          });
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },

    /** /초기화 관련 함수 **/

    /** Call API service
     * Naming Rule: get, post, put 등의 RESTFul verb를 접두사로 사용하고 그 뒤에 관련 모델명을 Camel case로 추가하세요.
     * Naming Rule: get의 경우 복수의 데이터조회(리스트 데이터 등)시에는 복수를 나타내는 접미사 "s"를 붙여주세요.
     * ex) getExamData () {}
     * ex) getExamDatas () {}
     */

    /** /Call API service **/
    /**
     * 그리드 리사이징
     */
    setGridSize() {
      window.getApp.$emit('LOADING_SHOW');
      setTimeout(() => {
        this.gridOptions.height = window.innerHeight - 260;
        window.getApp.$emit('LOADING_HIDE');
      }, 600);
    },

    /** validation checking(필요없으면 지워주세요) **/
    checkValidationEdit() {
      this.$validator
        .validateAll()
        .then((_result) => {
          this.isEditSubmit = _result;
          // TODO : 전역 성공 메시지 처리
          // 이벤트는 ./event.js 파일에 선언되어 있음
          if (!this.isEditSubmit) {
            window.getApp.$emit(
              'APP_VALID_ERROR',
              'M0000000876'
              /* 유효성 검사도중 에러가 발생하였습니다. */
            );
          }
        })
        .catch(() => {
          this.isEditSubmit = false;
        });
    },
    checkValidationInsert() {
      this.$validator
        .validateAll()
        .then((_result) => {
          this.isInsertSubmit = _result;
          // TODO : 전역 성공 메시지 처리
          // 이벤트는 ./event.js 파일에 선언되어 있음
          if (!this.isInsertSubmit) {
            window.getApp.$emit(
              'APP_VALID_ERROR',
              'M0000000876'
              /* 유효성 검사도중 에러가 발생하였습니다. */
            );
          }
        })
        .catch(() => {
          this.isInsertSubmit = false;
        });
    },
    validateState(_ref) {
      if (
        this.veeBag[_ref] &&
        (this.veeBag[_ref].dirty || this.veeBag[_ref].validated)
      ) {
        return !this.errors.has(_ref);
      }
      return null;
    },
    /** /validation checking **/
    checkValidation() {
      var endSchYmd1 = null;
      var endYmd = null;
      var routine = null;
      var routine2 = null;
      var startYmd1 = this.$comm.convertStringToDate(
        this.noAccident.startYmd,
        '-'
      );
      if (!this.$comm.isStringEmpty(this.noAccident.endSchYmd)) {
        endSchYmd1 = this.$comm.convertStringToDate(
          this.noAccident.endSchYmd,
          '-'
        );
        routine = this.$comm.getDatediff(startYmd1, endSchYmd1);
        if (routine < 0) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003396' /* 에러 */,
            message:
              'M0000000583' /* 목표달성예정일은 시작일 이전 일 수 없습니다. */,
            type: 'error',
          });
          return true;
        }
      }
      if (!this.$comm.isStringEmpty(this.noAccident.endYmd)) {
        endYmd = this.$comm.convertStringToDate(this.noAccident.endYmd, '-');
        routine2 = this.$comm.getDatediff(startYmd1, endYmd);
        if (routine2 < 0) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003396' /* 에러 */,
            message:
              'M0000000607' /* 목표달성일/종료일은 시작일 이전 일 수 없습니다. */,
            type: 'error',
          });
          return true;
        }
      }
      return false;
    },
    /** button 관련 이벤트 **/
    beforeInsert() {
      this.$validator
        .validateAll()
        .then((_result) => {
          this.noAccident.updateYn = 0;
          if (this.checkValidation()) return;

          if (_result) {
            this.$http.url = this.checkUrl;
            this.$http.type = 'get';
            this.$http.param = {
              plantCd: this.noAccident.plantCd,
            };
            this.$http.request(
              (_result) => {
                if (_result.data > 0) {
                  window.getApp.$emit('ALERT', {
                    title: 'L0000003395' /* 안내 */,
                    message:
                      'M0000000905' /* 이미 같은 사업장 무재해 정보가 존재합니다. */,
                    type: 'warning',
                  });
                } else {
                  window.getApp.$emit('CONFIRM', {
                    title: 'L0000003321' /* 확인 */,
                    message: 'M0000000011' /* 저장하시겠습니까? */,
                    type: 'info', // success / info / warning / error
                    // 확인 callback 함수
                    confirmCallback: () => {
                      this.noAccident.createUserId = this.$store.getters.token;
                      this.checkValidationInsert();
                    },
                  });
                }
              },
              (_error) => {
                window.getApp.$emit('APP_REQUEST_ERROR', _error);
              }
            );
          } else {
            this.checkRequiredInput();
          }
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000876'
            /* 유효성 검사도중 에러가 발생하였습니다. */
          );
        });
    },
    checkRequiredInput() {
      if (!this.noAccident.plantCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'M0000000863', // 사업장을 선택해주세요
          type: 'warning', // success / info / warning / error
        });
        return false;
      }
      if (!this.noAccident.startYmd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'M0000001076', // '무재해시작일을 선택해주세요.
          type: 'warning', // success / info / warning / error
        });
        return false;
      }
      if (!this.noAccident.startYmd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'M0000001076', // 무재해시작일을 선택해주세요.
          type: 'warning', // success / info / warning / error
        });
        return false;
      }
      if (!this.noAccident.multiple) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'M0000001077', // 목표배수를 입력해주세요.
          type: 'warning', // success / info / warning / error
        });
        return false;
      }
      if (!this.noAccident.stndDays) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'M0000001078', // 기준일수를 입력해주세요.
          type: 'warning', // success / info / warning / error
        });
        return false;
      }
      if (!this.noAccident.noaccStypeCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'M0000001079', // 무재해 시작 사유를 선택해주세요.
          type: 'warning', // success / info / warning / error
        });
        return false;
      }
      return true;
    },
    beforeEdit() {
      this.$validator
        .validateAll()
        .then((_result) => {
          this.noAccident.updateYn = 1;
          if (this.checkValidation()) return;

          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321' /* 확인 */,
              message: 'M0000000060' /* 수정하시겠습니까? */,
              type: 'info',
              confirmCallback: () => {
                this.noAccident.updateUserId = this.$store.getters.token;
                this.updateMode = true;
                this.checkValidationEdit();
              },
              cancelCallback: () => {
                this.updateMode = false;
              },
            });
          } else {
            this.checkRequiredInput();
          }
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000876'
            /* 유효성 검사도중 에러가 발생하였습니다. */
          );
        });
    },
    // 팝업 닫기
    btnClosePopup() {
      // 부모창에 값 전달
      this.$emit('closePopup', { success: true });
    },
    // 초기화
    btnClearClickedCallback() {
      Object.assign(this.$data.noAccident, this.$options.data().noAccident);
      this.$validator.reset();
      window.getApp.$emit(
        'APP_REQUEST_SUCCESS',
        'M0000000777'
        /* 초기화 버튼이 클릭 되었습니다. */
      );
    },
    // 신규등록
    btnInsertClickedCallback(_result) {
      this.noAccident.safNoAccidentNo = _result.data;
      this.isInsertSubmit = false;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395' /* 안내 */,
        message: 'M0000000106' /* 등록되었습니다. */,
        type: 'success',
      });
      this.updateMode = true;
      this.isDisableEndYn = false;
      this.isDisabledPlantCd = true;
      this.getNoAccident();
    },
    // 수정
    btnEditClickedCallback(_result) {
      this.isEditSubmit = false;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395' /* 안내 */,
        message: 'M0000000836' /* 수정되었습니다. */,
        type: 'success',
      });
      this.getNoAccident();
    },
    /**
     * 버튼 에러 처리용 공통함수
     */
    btnClickedErrorCallback(_result) {
      this.isInsertSubmit = false;
      this.isEditSubmit = false;
      this.editable = false;
      window.getApp.emit('APP_REQUEST_ERROR', _result);
    },
    btnDeleteClicked() {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321' /* 확인 */,
        message: 'M0000000012' /* 삭제하시겠습니까? */,
        type: 'info',
        confirmCallback: () => {
          this.noAccident.updateUserId = this.$store.getters.token;
          this.$http.url = this.deleteUrl;
          this.$http.type = 'PUT';
          this.$http.param = {
            safNoAccidentNo: this.noAccident.safNoAccidentNo,
            updateUserId: this.$store.getters.token,
          };
          this.$http.request(
            (_result) => {
              if (_result.data > 0) {
                window.getApp.$emit('ALERT', {
                  title: 'L0000003395' /* 안내 */,
                  message: 'M0000000007' /* 삭제되었습니다 */,
                  type: 'success',
                });
                this.btnClosePopup();
              } else {
                window.getApp.$emit('ALERT', {
                  title: 'L0000003395' /* 안내 */,
                  message: 'M0000000606' /* 삭제하는 중 오류가 발생했습니다. */,
                  type: 'warning',
                });
              }
            },
            (_error) => {
              window.getApp.$emit('APP_REQUEST_ERROR', _error);
            }
          );
        },
        cancelCallback: () => {},
      });
    },
    /** /Button Event **/

    /** 기타 function **/

    /** /기타 function **/
  },
};
</script>
