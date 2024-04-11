<!--
  목적 : 시설점검 - 시설점검계획
  Detail : 시설점검계획 등록화면으로  시설유형별로 시설을 조회 및 선택하여 시설점검종류와 시설점검예정일을 등록한다.
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row ref="editBox">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 시설점검계획 -->
            <y-label label="L0000004294" icon="user-edit" color-class="cutstom-title-color" />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 저장 -->
              <y-btn
                v-if="editable"
                :action-url="insertUrl"
                :param="facilityCheckResult"
                :is-submit="isInsert"
                title="L0000002474"
                color="orange"
                action-type="POST"
                beforeSubmit="beforeInsert"
                @beforeInsert="beforeInsert"
                @btnClicked="btnInsertClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- <y-btn 
                v-if="editable"
                color="red"
                title="삭제"
                @btnClicked="btnDeleteClickedCallback" 
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />-->
              <!-- 닫기 -->
              <y-btn title="L0000000881" @btnClicked="closePopup" />
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 시설점검 계획명 -->
              <y-text
                :width="8"
                :required="true"
                :editable="editable"
                :disabled="disabled"
                ui="bootstrap"
                name="safFacilityCheckPlanNm"
                label="L0000004672"
                v-model="facilityCheckResult.safFacilityCheckPlanNm"
                v-validate="'required'"
                :state="validateState('safFacilityCheckPlanNm')"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 시설점검종류 -->
              <y-select
                :width="8"
                :comboItems="comboCheckTypeItems"
                :required="true"
                :editable="editable"
                :disabled="disabled"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="L0000001765"
                name="safFacilityCheckCd"
                v-model="facilityCheckResult.safFacilityCheckCd"
                v-validate="'required'"
                :state="validateState('safFacilityCheckCd')"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 점검계획기간 -->
              <y-datepicker
                :width="8"
                :required="true"
                :range="true"
                :editable="editable"
                label="L0000002542"
                name="safFacilityCheckPlanPeriod"
                v-model="facilityCheckResult.safFacilityCheckPlanPeriod"
                v-validate="'required'"
                :state="validateState('safFacilityCheckPlanPeriod')"
              ></y-datepicker>
            </b-col>
            <!-- <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <b-row>
                <b-col sm="8">
                  <y-textarea
                    :width="9"
                    :maxlength="150"
                    :disabled="true"
                    :editable="editable"
                    label="시설" 
                    ui="bootstrap"
                    name="handleFacility"
                    v-model="facilityCheckResult.handleFacility"
                  />
                </b-col>
                <b-col sm="4">
                  <y-btn
                      v-if="editable"
                      title="추가/삭제"
                      @btnClicked="openPopup()" 
                  />
                </b-col>
              </b-row>
            </b-col>-->
          </b-row>

          <!-- <b-row ref="searchBox" class="mt-3">
            <b-col sm="12">
              <b-card header-class="default-card" body-class="default-body-card" class="py-0">
                <div slot="header" >
                    <y-label label="검색" />
                  <div class="float-right">
                    <y-btn
                      :title="searchArea.title"
                      color="green"                
                      @btnClicked="btnSearchVisibleClicked" 
                    />
                    <y-btn
                      :action-url="searchUrl"
                      :param="searchParam"
                      title="검색"
                      color="green"
                      action-type="get"
                      @btnClicked="btnSearchClickedCallback" 
                      @btnClickedErrorCallback="btnClickedErrorCallback"
                    />
                  </div>
                </div>
                <b-row v-if="searchArea.show">
                  <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
                    <b-row>
                      <b-col sm="8" md="8" lg="8" xl="8" class="col-xxl-8">
                        <y-select
                          :width="6"
                          :comboItems="comboFacilityTypeItems"
                          itemText="safFacilityTypeNm"
                          itemValue="safFacilityTypeCd"
                          ui="bootstrap"
                          name="safFacilityTypeCd"
                          label="시설유형/공정"
                          v-model="searchParam.safFacilityTypeCd"
                        >
                        </y-select>
                      </b-col>
                      <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
                        <y-select
                          :width="12"
                          :comboItems="comboProcessItems"
                          itemText="processNm"
                          itemValue="processNo"
                          ui="bootstrap"
                          name="processNo"
                          v-model="searchParam.processNo"
                        >
                        </y-select>
                      </b-col>
                    </b-row>
                  </b-col>
                  <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
                    <y-text
                      :width="8"
                      ui="bootstrap"
                      name="facilityNm"
                      label="시설명" 
                      v-model="searchParam.facilityNm"
                      >
                    </y-text>
                  </b-col>
                  <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
                    <y-tree-dept 
                      type="search"
                      label="시설관리부서"
                      v-model="searchParam.deptCd"
                    />
                  </b-col>
                </b-row>
              </b-card>
            </b-col>
          </b-row>-->

          <!-- 검색 결과 테이블 -->
          <b-row class="mt-3">
            <b-col sm="12">
              <b-col sm="12" class="px-0">
                <div slot="buttonGroup" class="float-right mb-1">
                  <!-- 추가 -->
                  <y-btn v-if="editable" color="orange" title="L0000002892" @btnClicked="openPopup()" />
                  <!-- 삭제 -->
                  <y-btn
                    v-if="editable"
                    color="red"
                    title="L0000001495"
                    @btnClicked="btnDeleteClickedCallback"
                    @btnClickedErrorCallback="btnClickedErrorCallback"
                  />
                </div>
                <!-- 시설점검계획 목록 -->
                <y-data-table
                  ref="dataTable"
                  :height="gridOptions.height"
                  :headers="gridOptions.header"
                  :items="gridOptions.data"
                  :editable="editable"
                  :print="true"
                  :checkItemData="checkItemData"
                  checkKey="safFacilityCd"
                  v-model="selectValue"
                  label="L0000001758"
                >
                  <el-table-column
                    :selectable="selectedCheck"
                    type="selection"
                    slot="selection"
                    align="center"
                    width="55"
                  ></el-table-column>
                </y-data-table>
              </b-col>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
    <b-row>
      <b-col sm="12">
        <div class="float-right mt-2">
          <!-- 저장 -->
          <y-btn
            v-if="editable"
            title="L0000002474"
            color="orange"
            @btnClicked="beforeInsert"
            @btnClickedErrorCallback="btnClickedErrorCallback"
          />
          <!-- <y-btn 
            v-if="editable"
            color="red"
            title="삭제"
            @btnClicked="btnDeleteClickedCallback" 
            @btnClickedErrorCallback="btnClickedErrorCallback"
          />-->
          <!-- 닫기 -->
          <y-btn title="L0000000881" size="mini" @btnClicked="closePopup" />
        </div>
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
  name: 'y-facility-check-result-plan',
  props: {
    popupParam: {
      type: Object,
      default: {
        safFacilityCheckResultNo: 0, // 시설점검번호
        safFacilityCheckCd: null, // 시설점검종류
        safFacilityCheckSchYmd: '', // 시설점검예정일
        safFacilityCheckPlanNo: 0, // 시설점검계획번호
        safFacilityCheckPlanNm: '', // 시설점검계획명
        safFacilityCheckPlanStartYmd: '',
        safFacilityCheckPlanEndYmd: '',
      },
    },
  },
  data: () => ({
    facilityCheckResult: {
      safFacilityCheckCd: null, // 시설점검종류
      safFacilityCheckSchYmd: '', // 시설점검예정일
      facilityCheckPlans: [],
      safFacilityCds: [], // 안전시설코드
      safFacilityCheckResultNos: [],
      createUserId: '',
      updateUserId: '',
      handleFacility: '',
      safFacilityCheckPlanNm: '', // 시설점검계획명
      safFacilityCheckPlanStartYmd: '',
      safFacilityCheckPlanEndYmd: '',
      safFacilityCheckPlanPeriod: [],
    },
    gridOptions: {
      header: [],
      data: [],
      height: '350',
      // merge: [],
    },
    popupOptions: {
      target: null,
      title: '',
      visible: false,
      param: null,
      width: '90%',
      top: '10px',
      closeCallback: null,
    },
    checkItemTempData: [],
    checkItemData: [],
    baseWidth: 9,
    editable: false,
    disabled: false,
    isInsert: false,
    comboCheckTypeItems: [], // 시설점검종류
    facilityMstValue: [], // 체크된 시설목록
    selectValue: [],
    tempGridDate: [],
    insertUrl: '',
    searchUrl: '',
    searchCheckUrl: '',
    sampleData: [
      {
        // -- SampleData  시설점검계획 List1 --
        safFacilityInsCheckPlanNo: 1, // 시설점검계획번호
        safFacilityInsCheckResultNo: 1, // 시설점검번호
        safFacilityInsCheckPlanNm: '테스트 계획명', // 시설점검계획명
        insCheckStepNm: '계획', // 진행단계
        safFacilityInsCheckNm: '점검종류4', // 시설점검종류
        safFacilityInsCheckCd: '14', // 시설점검종류코드
        safFacilityInsCheckPlanSchPeriod: '2019-07-17~2019-09-10', // 점검계획기간
        safFacilityInsCheckPlanStartYmd: '2019-07-17', // 계획시작일
        safFacilityInsCheckPlanEndYmd: '2019-09-10', // 계획종료일
        safFacilityCheckSchYmd: '2019-07-17', // 시설점검예정일
        safFacilityTypeNm: '수질', // 시설유형
        facilityNm: '시설명1', // 시설명
        safFacilityCd: 'ABCD12345', // 시설코드
        createUserNm: '개발자', // 등록자
        createDt: '2019-07-17', // 등록일
      },
      {
        // -- SampleData  시설점검계획 List2 --
        safFacilityInsCheckPlanNo: 1,
        safFacilityInsCheckResultNo: 2,
        safFacilityInsCheckPlanNm: '테스트 계획명',
        insCheckStepNm: '계획',
        safFacilityInsCheckNm: '점검종류2',
        safFacilityInsCheckCd: '12',
        safFacilityInsCheckPlanSchPeriod: '2019-07-17~2019-09-10',
        safFacilityInsCheckPlanStartYmd: '2019-07-17',
        safFacilityInsCheckPlanEndYmd: '2019-09-10',
        safFacilityCheckSchYmd: '2019-07-17',
        safFacilityTypeNm: '수질',
        facilityNm: '시설명2',
        safFacilityCd: 'ABCD12345',
        createUserNm: '개발자',
        createDt: '2019-07-17',
      },
      {
        // -- SampleData  시설점검계획 List3 --
        safFacilityInsCheckPlanNo: 2,
        safFacilityInsCheckResultNo: 3,
        safFacilityInsCheckPlanNm: '테스트 계획명2',
        insCheckStepNm: '계획',
        safFacilityInsCheckNm: '점검종류3',
        safFacilityInsCheckCd: '13',
        safFacilityInsCheckPlanSchPeriod: '2019-07-17~2019-09-10',
        safFacilityInsCheckPlanStartYmd: '2019-07-17',
        safFacilityInsCheckPlanEndYmd: '2019-09-10',
        safFacilityCheckSchYmd: '2019-07-17',
        safFacilityTypeNm: '대기',
        facilityNm: '시설명3',
        safFacilityCd: 'ABCD12345',
        createUserNm: '개발자',
        createDt: '2019-07-17',
      },
      {
        // -- SampleData  시설점검계획 List3 --
        safFacilityInsCheckPlanNo: 2,
        safFacilityInsCheckResultNo: 3,
        safFacilityInsCheckPlanNm: '테스트 계획명2',
        insCheckStepNm: '계획',
        safFacilityInsCheckNm: '점검종류3',
        safFacilityInsCheckCd: '13',
        safFacilityInsCheckPlanSchPeriod: '2019-07-17~2019-09-10',
        safFacilityInsCheckPlanStartYmd: '2019-07-17',
        safFacilityInsCheckPlanEndYmd: '2019-09-10',
        safFacilityCheckSchYmd: '2019-07-17',
        safFacilityTypeNm: '대기',
        facilityNm: '시설명4',
        safFacilityCd: 'ABCD12345',
        createUserNm: '개발자',
        createDt: '2019-07-17',
      },
      {
        // -- SampleData  시설점검계획 List4 --
        safFacilityInsCheckPlanNo: 3,
        safFacilityInsCheckResultNo: 4,
        safFacilityInsCheckPlanNm: '테스트 계획명3',
        insCheckStepNm: '계획',
        safFacilityInsCheckNm: '점검종류1',
        safFacilityInsCheckCd: '11',
        safFacilityInsCheckPlanSchPeriod: '2019-07-17~2019-09-10',
        safFacilityInsCheckPlanStartYmd: '2019-07-17',
        safFacilityInsCheckPlanEndYmd: '2019-09-10',
        safFacilityCheckSchYmd: '2019-07-17',
        safFacilityTypeNm: '대기',
        facilityNm: '시설명4',
        safFacilityCd: 'ABCD12345',
        createUserNm: '개발자',
        createDt: '2019-07-17',
      },
    ],
    comboSampleData: [
      // 시설점검종류
      { code: '11', codeNm: '점검종류1' },
      { code: '12', codeNm: '점검종류2' },
      { code: '13', codeNm: '점검종류3' },
      { code: '14', codeNm: '점검종류4' },
      { code: '15', codeNm: '점검종류5' },
      { code: '16', codeNm: '점검종류6' },
    ],
  }),
  watch: {
    /* 시설점검계획기간이 바뀌게 될시
     * - 그리드에 보여지는 점검예정일의 입력 가능한 날짜의 범위를 바꾼다.
     * - 범위가 바뀌면서 이미 입력되어 있던 예정일이 범위 안에 속하지 않는 경우 값을 빈값으로 바꾸어 다시 입력하도록 한다.
     */
    'facilityCheckResult.safFacilityCheckPlanPeriod': {
      handler: function (newValue, oldValue) {
        var gridData = this.gridOptions.data;
        var checkSchYmd = false; // 점검예정일이 모두 비어있는지 여부 체크
        if (newValue) {
          if (newValue.length === 2) {
            this.facilityCheckResult.safFacilityCheckPlanStartYmd = this.facilityCheckResult.safFacilityCheckPlanPeriod[0];
            this.facilityCheckResult.safFacilityCheckPlanEndYmd = this.facilityCheckResult.safFacilityCheckPlanPeriod[1];

            this.gridOptions.header.splice(0, 1);
            if (gridData.length === 0) {
              this.gridOptions.header.splice(0, 0, {
                text: 'L0000004673', // 시설점검 예정일
                name: 'safFacilityCheckSchYmd',
                width: '180px',
                align: 'center',
                type: 'datepicker',
                start: this.facilityCheckResult.safFacilityCheckPlanPeriod[0],
                end: this.facilityCheckResult.safFacilityCheckPlanPeriod[1],
                default: 'input',
              });
            } else {
              this.gridOptions.header.splice(0, 0, {
                text: 'L0000004673', // 시설점검 예정일
                name: 'safFacilityCheckSchYmd',
                width: '180px',
                align: 'center',
                type: 'datepicker',
                start: this.facilityCheckResult.safFacilityCheckPlanPeriod[0],
                end: this.facilityCheckResult.safFacilityCheckPlanPeriod[1],
              });
            }

            if (this.gridOptions.data.length > 0) {
              this.gridOptions.data = [];
              this.$_.forEach(gridData, item => {
                if (
                  !(
                    this.$comm.dateCompare(
                      this.facilityCheckResult.safFacilityCheckPlanPeriod[0],
                      item.safFacilityCheckSchYmd
                    ) &&
                    this.$comm.dateCompare(
                      item.safFacilityCheckSchYmd,
                      this.facilityCheckResult.safFacilityCheckPlanPeriod[1]
                    )
                  )
                ) {
                  item.safFacilityCheckSchYmd = '';
                  checkSchYmd = true;
                }
              });

              if (checkSchYmd) {
                this.gridOptions.header.splice(0, 1);
                this.gridOptions.header.splice(0, 0, {
                  text: 'L0000004673', // 시설점검 예정일
                  name: 'safFacilityCheckSchYmd',
                  width: '180px',
                  align: 'center',
                  type: 'datepicker',
                  start: this.facilityCheckResult.safFacilityCheckPlanPeriod[0],
                  end: this.facilityCheckResult.safFacilityCheckPlanPeriod[1],
                  default: 'input',
                });
              }
              this.gridOptions.data = this.$_.clone(gridData);
            }
          }
        }
      },
      deep: true,
    },
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate () {},
  created () {},
  beforeMount () {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted () {},
  beforeDestroy () {},
  //* methods */
  methods: {
    init () {
      // 콤보박스 조회한다
      //
      this.editable = this.$route.meta.editable;
      // Url Setting
      this.searchUrl = selectConfig.saf.facilityCheckResult.list.url;
      this.searchCheckUrl =
        selectConfig.saf.facilityCheckResult.duplicateCheck.url;
      this.insertUrl = transactionConfig.saf.facilityCheckResult.insert.url;
      // 그리드 헤더 설정
      this.gridOptions.header = [
        // { text: '진행단계', name: 'checkStepNm', width: '130px', align: 'center' },
        // { text: '시설점검계획명', name: 'safFacilityCheckPlanNm', width: '150px', align: 'left' },
        // { text: '점검종류', name: 'safFacilityCheckNm', width: '110px', align: 'center' },
        {
          text: 'L0000004673', // 시설점검 예정일
          name: 'safFacilityCheckSchYmd',
          width: '180px',
          align: 'center',
          type: 'datepicker',
          start: '',
          end: '',
          default: 'input',
        },
        { text: 'L0000001747', name: 'safFacilityTypeNm', width: '110px' }, // 시설유형
        {
          text: 'L0000001767', // 시설코드
          name: 'safFacilityCd',
          width: '130px',
          align: 'center',
        },
        { text: 'L0000001743', name: 'facilityNm', width: '180px' }, // 시설명
        { text: 'L0000000976', name: 'createUserNm', width: '130px' }, // 등록자
      ];

      // this.gridOptions.merge = [];
      // this.gridOptions.merge.push({ index: 2, field: 'safFacilityCheckPlanNm' });
      this.getComboItems('SAF_FACILITY_CHECK'); // 시설점검종류
      if (this.popupParam.safFacilityInsCheckResultNo > 0) {
        this.facilityCheckResult.safFacilityCheckResultNo = this.popupParam.safFacilityCheckResultNo;
        this.facilityCheckResult.safFacilityCheckCd = this.popupParam.safFacilityInsCheckCd;
        // this.facilityCheckResult.safFacilityCheckSchYmd = this.popupParam.safFacilityCheckSchYmd;
        this.facilityCheckResult.safFacilityCheckPlanNo = this.popupParam.safFacilityInsCheckPlanNo;
        this.facilityCheckResult.safFacilityCheckPlanNm = this.popupParam.safFacilityInsCheckPlanNm;
        this.facilityCheckResult.safFacilityCheckPlanPeriod = [
          this.popupParam.safFacilityInsCheckPlanStartYmd,
          this.popupParam.safFacilityInsCheckPlanEndYmd,
        ];
        this.disabled = true;

        this.getList();
      }

      setTimeout(() => {
        // this.facilityCheckResult.safFacilityCheckSchYmd = this.popupParam.safFacilityCheckSchYmd ? this.popupParam.safFacilityCheckSchYmd : this.$comm.getToday();
      }, 300);
    },
    selectedCheck () {
      return this.editable;
    },
    /**
     * 공통 마스터 정보 조회 (시설점검종류)
     * codeGroupCd : 마스터 테이블 codeGroupCd 정보
     */
    getComboItems (codeGroupCd) {
      this.comboCheckTypeItems = this.comboSampleData;
      this.comboCheckTypeItems.splice(0, 0, {
        code: null,
        codeNm: this.$comm.getLangSpecInfoLabel('L0000003394') // 선택하세요
      });
      // this.$http.url = this.$format(
      //   selectConfig.codeMaster.getSelect.url,
      //   codeGroupCd
      // );
      // this.$http.type = 'GET';
      // this.$http.request(
      //   _result => {
      //     if (codeGroupCd === 'SAF_FACILITY_CHECK') {
      //       this.comboCheckTypeItems = this.$_.clone(_result.data);
      //       this.comboCheckTypeItems.splice(0, 0, {
      //         code: null,
      //         codeNm: '선택하세요',
      //       });
      //       // this.facilityCheckResult.safFacilityCheckCd = '';
      //     }
      //   },
      //   _error => {
      //     window.getApp.$emit('APP_REQUEST_ERROR', _error);
      //   }
      // );
    },
    /** 시설 목록 조회 **/
    getList () {
      // alert('받아온 PlanNo : ' + this.popupParam.safFacilityInsCheckPlanNo);
      for (let i = 0; i < this.sampleData.length; i++) {
        if (
          this.popupParam.safFacilityInsCheckPlanNo ===
          this.sampleData[i].safFacilityInsCheckPlanNo
        ) {
          this.gridOptions.data.push(this.sampleData[i]);
        }
      }

      // this.$http.url = this.searchUrl;
      // this.$http.type = 'GET';
      // this.$http.param = {
      //   safFacilityCheckPlanNo: this.popupParam.safFacilityCheckPlanNo,
      //   checkStepCd: 'CHS01',
      // };
      // this.$http.request(
      //   _result => {
      //     this.gridOptions.data = this.$_.clone(_result.data);
      //     if (this.gridOptions.data.length !== 0) {
      //       if (this.gridOptions.data.length === 1) {
      //         this.facilityCheckResult.safFacilityCheckPlanPeriod = [
      //           this.gridOptions.data[0].safFacilityCheckPlanStartYmd,
      //           this.gridOptions.data[0].safFacilityCheckPlanEndYmd,
      //         ];
      //       } else {
      //         this.facilityCheckResult.safFacilityCheckPlanPeriod = [
      //           this.gridOptions.data[0].safFacilityCheckPlanStartYmd,
      //           this.gridOptions.data[1].safFacilityCheckPlanEndYmd,
      //         ];
      //       }
      //     }
      //     this.tempGridDate = this.$_.clone(_result.data);
      //     this.facilityMstValue = this.$_.clone(_result.data);
      //   },
      //   _error => {
      //     window.getApp.$emit('APP_REQUEST_ERROR', _error);
      //   }
      // );
    },
    /** 신규등록 하기전 UI단 유효성 검사 **/
    beforeInsert () {
      var checkSchYmd = false;
      this.$validator
        .validateAll()
        .then(_result => {
          // TODO : 전역 성공 메시지 처리
          // 이벤트는 ./event.js 파일에 선언되어 있음
          if (_result) {
            if (this.gridOptions.data.length <= 0) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395', // 계획
                message: 'M0000000732', // 계획을 추가하세요.
                type: 'warning', // success / info / warning / error
              });
              return;
            } else {
              this.$_.forEach(this.gridOptions.data, item => {
                if (!item.safFacilityCheckSchYmd) {
                  checkSchYmd = true;
                }
              });

              if (checkSchYmd) {
                window.getApp.$emit('ALERT', {
                  title: 'L0000003395', // 안내
                  message: 'M0000000747', // 시설점검예정일을 입력하세요.
                  type: 'warning', // success / info / warning / error
                });
                return;
              } else {
                this.$http.url = this.searchCheckUrl;
                this.$http.type = 'GET';
                this.$http.param = {
                  safFacilityCheckPlanNm: this.facilityCheckResult
                    .safFacilityCheckPlanNm,
                };
                this.$http.request(
                  _result => {
                    if (
                      (_result.data.toString() === '0' && !this.disabled) ||
                      (_result.data === this.gridOptions.data.length &&
                        this.disabled)
                    ) {
                      // 안전시설코드
                      this.$_.forEach(this.gridOptions.data, item => {
                        var facilityCheckPlans = {
                          safFacilityCd: item.safFacilityCd,
                          safFacilityCheckSchYmd: item.safFacilityCheckSchYmd,
                        };
                        this.facilityCheckResult.facilityCheckPlans.push(
                          facilityCheckPlans
                        );
                      });

                      window.getApp.$emit('CONFIRM', {
                        title: 'L0000003321', // 확인
                        message: 'M0000000011', // 저장하시겠습니까?
                        // TODO : 필요시 추가하세요.
                        type: 'info', // success / info / warning / error
                        // 확인 callback 함수
                        confirmCallback: () => {
                          this.facilityCheckResult.createUserId = this.$store.getters.token;
                          this.facilityCheckResult.updateUserId = this.$store.getters.token;
                          this.isInsert = true;
                        },
                        // 취소 callback 함수
                        cancelCallback: () => {
                          this.isInsert = false;
                        },
                      });
                    } else {
                      window.getApp.$emit('ALERT', {
                        title: 'L0000003395', // 안내
                        message: 'M0000000748', // 시설점검계획명이 이미 존재합니다.
                        type: 'warning', // success / info / warning / error
                      });
                      return;
                    }
                  },
                  _error => {
                    window.getApp.$emit('APP_REQUEST_ERROR', _error);
                  }
                );
              }
            }
          } else if (!_result) {
            // window.alert("필수입력값을 입력해주세요");
            window.getApp.$emit('ALERT', {
              title: 'L0000003395', // 안내
              message: 'M0000000710', // 필수입력값을 입력 후 저장해주세요.
              type: 'warning', // success / info / warning / error
            });
          }
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000881' // 유효성 검사도중 에러가 발생하였습니다.
          );
          this.isInsert = false;
        });
    },
    /**
     * 필수입력값 유효성 검사
     */
    validateState (ref) {
      if (
        this.veeBag[ref] &&
        (this.veeBag[ref].dirty || this.veeBag[ref].validated)
      ) {
        return !this.errors.has(ref);
      }
      return null;
    },
    /**
     *  팝업 안 보이도록 closePopup emit
     *  팝업 close
     * data : 팝업창에서 return하는 데이터
     */
    closePopup (data) {
      this.$emit('closePopup', {});
    },
    openPopup () {
      if (!this.facilityCheckResult.safFacilityCheckPlanNm) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000001150', // 시설점검계획명을 입력하세요.
          type: 'warning', // success / info / warning / error
        });
        return;
      } else if (!this.facilityCheckResult.safFacilityCheckCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000000752', // 시설점검종류를 선택하세요.
          type: 'warning', // success / info / warning / error
        });
        return;
      } else if (
        this.facilityCheckResult.safFacilityCheckPlanPeriod.length === 0
      ) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000000751', // 시설점검계획기간을 선택하세요.
          type: 'warning', // success / info / warning / error
        });
        return;
      } else {
        this.popupOptions.target = () =>
          import(`${'../../baseInfo/facility/facilityMstPopup.vue'}`);
        this.popupOptions.title = 'L0000004674'; // 시설 등록
        this.popupOptions.param = {
          selectedFacilityMstValue: this.facilityMstValue,
        };
        this.popupOptions.visible = true;
        this.popupOptions.closeCallback = this.closeFacilityPopup;
      }
    },
    closeFacilityPopup (data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data === 'CLOSE') return;
      var i = 0;
      this.facilityMstValue = data;
      this.facilityCheckResult.handleFacility = '';
      var safFacilityCheckNm = this.$_.find(this.comboCheckTypeItems, {
        code: this.facilityCheckResult.safFacilityCheckCd,
      }).codeNm;
      this.gridOptions.data = this.$_.clone(this.tempGridDate);
      this.$_.forEach(this.gridOptions.data, item => {
        data = this.$_.clone(
          this.$_.reject(data, { safFacilityCd: item.safFacilityCd })
        );
      });
      this.$_.forEach(data, item => {
        // if (i === 0) {
        //   i++;
        //   this.facilityCheckResult.handleFacility = data.facilityNm;
        // } else {
        //   this.facilityCheckResult.handleFacility += " ," + data.facilityNm;
        // }
        this.gridOptions.data.splice(0, 0, {
          safFacilityCheckNm: safFacilityCheckNm,
          safFacilityCheckSchYmd: '', // this.facilityCheckResult.safFacilityCheckSchYmd,
          safFacilityTypeNm: item.safFacilityTypeNm,
          safFacilityCd: item.safFacilityCd,
          facilityNm: item.facilityNm,
          safFacilityCheckPlanNm: this.facilityCheckResult
            .safFacilityCheckPlanNm,
          safFacilityCheckResultNo: 0,
        });
      });
    },
    /** button 관련 이벤트 **/
    /**
     * 수정 버튼 안보여지도록 처리
     *  버튼 http 통신 중 error 발생 callback
     * _result : error return하는 데이터
     */
    btnClickedErrorCallback (_result) {
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    /**
     * 질환 목록 조회 및 수정버튼 보여지도록 처리
     *  신규등록 버튼 callback
     * _result : backend에서 return하는 데이터
     */
    btnInsertClickedCallback (_result) {
      this.facilityMstValue = [];
      // window.alert("저장되었습니다.");
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // 안내
        message: 'M0000000006', // 저장되었습니다.
        type: 'success', // success / info / warning / error
      });
      this.isInsert = false;
      this.closePopup();
    },
    // /**
    //  * 데이터 및 이벤트 초기화, 수정버튼 안보여지도록 처리
    //  *  초기화 버튼 callback
    //  */
    // btnClearClickedCallback () {
    //   Object.assign(this.$data.facilityCheckResult, this.$options.data().facilityCheckResult);
    //   // Object.assign(this.$data.searchParam, this.$options.data().searchParam);
    //   this.facilityMstValue = [];
    //   this.$validator.reset();
    // },
    /**
     * 안전점검계획 삭제
     *  삭제 버튼 callback
     * _result : backend에서 return하는 데이터
     */
    btnDeleteClickedCallback (_result) {
      if (this.selectValue.length <= 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000000750', // 시설점검계획목록에서 계획을 한개이상 선택하세요.
          type: 'warning', // success / info / warning / error
        });
        return;
      } else {
        window.getApp.$emit('CONFIRM', {
          title: 'L0000003321', // 확인
          message: 'M0000000012', // 삭제하시겠습니까?
          // TODO : 필요시 추가하세요.
          type: 'info', // success / info / warning / error
          // 확인 callback 함수
          confirmCallback: () => {
            var keys = [];
            this.$_.forEach(this.selectValue, item => {
              if (item.safFacilityCheckResultNo !== 0) {
                keys.push({
                  safFacilityCheckResultNo: item.safFacilityCheckResultNo,
                });
              }
            });
            this.$http.url =
              transactionConfig.saf.facilityCheckResult.deletes.url;
            this.$http.type = 'DELETE';
            this.$http.param = {
              data: Object.values(this.$_.clone(keys)),
            };
            this.$http.request(
              _result => {
                this.$_.forEach(this.selectValue, item => {
                  this.gridOptions.data = this.$_.reject(
                    this.gridOptions.data,
                    { safFacilityCd: item.safFacilityCd }
                  );
                });

                if (this.gridOptions.data.length === 0) {
                  window.getApp.$emit('ALERT', {
                    title: 'L0000003395', // 안내
                    message: 'M0000000749', // 시설점검계획이 삭제되었습니다.
                    type: 'success', // success / info / warning / error
                  });
                  this.closePopup(null);
                } else {
                  window.getApp.$emit('ALERT', {
                    title: 'L0000003395', // 안내
                    message: 'M0000000007', // 삭제되었습니다.
                    type: 'success', // success / info / warning / error
                  });
                  this.tempGridDate = this.$_.clone(this.gridOptions.data);
                }
              },
              _error => {
                window.getApp.$emit('APP_REQUEST_ERROR', _error);
              }
            );
          },
          // 취소 callback 함수
          cancelCallback: () => {},
        });
      }
    },
    /** end button 관련 이벤트 **/
  },
};
</script>