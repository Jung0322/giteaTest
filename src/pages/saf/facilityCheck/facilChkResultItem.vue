<!--
     
  목적 : 설비점검 관리 - 설비점검결과  - 점검자
  Detail : 설비점검 점검자
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 등록 -->
    <b-row>
      <b-col sm="12">
        <!-- 점검팀원 테이블 -->
        <b-row>
          <b-col sm="12">
            <b-col sm="12" class="px-0">
              <!-- 설비점검결과 목록 -->
              <y-auigrid
                ref="yAuiGridChkResult"
                :editable="editable"
                :name="chkResultGridOptions.name"
                :headers="chkResultGridOptions.header"
                :items="chkResultGridOptions.data"
                :btns="chkResultGridOptions.btns"
                :height="chkResultGridOptions.height"
                :label="this.$comm.getLangSpecInfoLabel('L0000001609')"
                :useExcelExport="false"
                :showRowCheckColumn="false"
                @cellClick="selectedRow"
                @btnAdd="btnAdd"
                @btnDelete="btnDelete"
                @cellEditEnd="cellEditEndHandler"
              />
            </b-col>
          </b-col>
        </b-row>
        <b-row class="mt-1 mb-1">
          <b-col>
            <div
              v-if="
                editable && isSelected && !isComplete && planFlag && confirmFlag
              "
              slot="buttonGroup"
              class="float-right"
            >
              <!-- ※ 점검결과 입력 후 '설비별 점검결과 저장' 버튼을 클릭하셔야 합니다. -->
              {{ $comm.getLangSpecInfoLabel('L0000003710') }}
              <!-- 설비별 점검결과 저장 -->
              <y-btn
                :action-url="editUrl"
                :param="safFacilChkResult"
                :is-submit="isEdit"
                title="L0000003712"
                color="orange"
                action-type="PUT"
                beforeSubmit="beforeEdit"
                @beforeEdit="beforeEdit"
                @btnClicked="btnEditClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <b-row>
                <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
                  <!-- 설비유형 -->
                  <y-label label="L0000001597" />
                </b-col>
                <b-col sm="8" md="8" lg="8" xl="8" class="col-xxl-8">
                  <y-label
                    v-if="isSelected"
                    :label="safFacilChkResult.safFacilityTypeNm"
                    :fieldable="true"
                  />
                  <div v-else>
                    <i>
                      <!-- ※ '설비점검결과 목록'에서 설비를 먼저 선택하세요. -->
                      {{ $comm.getLangSpecInfoLabel('L0000003711') }}
                    </i>
                  </div>
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <b-row>
                <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
                  <!-- 설비코드/설비명 -->
                  <y-label label="L0000001619" />
                </b-col>
                <b-col sm="8" md="8" lg="8" xl="8" class="col-xxl-8">
                  <y-label
                    :label="
                      safFacilChkResult.safFacilityCd
                        ? safFacilChkResult.safFacilityCd +
                          ' / ' +
                          safFacilChkResult.facilityNm
                        : ''
                    "
                    :fieldable="true"
                  />
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <b-row>
                <!-- 점검예정일 -->
                <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
                  <y-label label="L0000002564" />
                </b-col>
                <b-col sm="8" md="8" lg="8" xl="8" class="col-xxl-8">
                  <y-label
                    :label="safFacilChkResult.safFacilityCheckSchYmd"
                    :fieldable="true"
                  />
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 점검완료일 -->
              <y-datepicker
                :width="baseWidth"
                :editable="isResultEditable"
                :disabled="isComplete || !planFlag || !confirmFlag"
                label="L0000002569"
                name="chkYmd"
                :required="true"
                :default="safFacilChkResult.chkYmd"
                v-model="safFacilChkResult.chkYmd"
                v-validate="'required'"
                :state="validateState('chkYmd')"
              ></y-datepicker>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 점검결과 -->
              <y-select
                :width="baseWidth"
                :editable="isResultEditable"
                :disabled="isComplete || !planFlag || !confirmFlag"
                :comboItems="chkResultItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="L0000002536"
                name="chkResultCd"
                :required="true"
                v-model="safFacilChkResult.chkResultCd"
                v-validate="'required'"
                :state="validateState('chkResultCd')"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 점검완료여부 -->
              <y-select
                :width="baseWidth"
                :editable="isResultEditable"
                :disabled="isComplete || !planFlag || !confirmFlag"
                :comboItems="chkEndYnItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="L0000002568"
                name="chkEndYn"
                :required="true"
                v-model="safFacilChkResult.chkEndYn"
                v-validate="'required'"
                :state="validateState('chkEndYn')"
              ></y-select>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <!-- 점검결과요약 -->
              <y-textarea
                :width="10"
                :rows="2"
                :editable="isResultEditable"
                :disabled="isComplete || !planFlag || !confirmFlag"
                :maxlength="50"
                ui="bootstrap"
                type="search"
                label="L0000002538"
                name="chkResult"
                :required="true"
                v-model="safFacilChkResult.chkResult"
                v-validate="'required'"
                :state="validateState('chkResult')"
              ></y-textarea>
            </b-col>
            <b-col sm="12">
              <b-col sm="12" class="px-0">
                <!-- 점검항목별 결과" -->
                <y-auigrid
                  ref="yAuiGridChkItem"
                  v-if="planFlag"
                  :name="chkItemResultGridOptions.name"
                  :headers="chkItemResultGridOptions.header"
                  :height="chkItemResultGridOptions.height"
                  :label="this.$comm.getLangSpecInfoLabel('L0000002585')"
                  :items="chkItemResultGridOptions.data"
                  :useExcelExport="false"
                  :showRowCheckColumn="true"
                  :editable="
                    this.editable && !this.isComplete && this.confirmFlag
                  "
                />
                <y-auigrid
                  ref="yAuiGridChkItem"
                  v-if="!planFlag"
                  :name="chkItemResultGridOptions.name"
                  :headers="chkItemResultGridOptions.header"
                  :height="chkItemResultGridOptions.height"
                  :label="this.$comm.getLangSpecInfoLabel('L0000002585')"
                  :items="chkItemResultGridOptions.data"
                  :useExcelExport="false"
                  :showRowCheckColumn="true"
                  :editable="false"
                />
              </b-col>
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
import searchIcon from '@/assets/images/info.png';

// 이전 점검 계획 결과
let prevSafFacilChkResult = null;

export default {
  /* attributes: name, components, props, data */
  name: 'facil-chk-result-item',
  props: {
    safFacilChkNo: {
      type: Number,
      default: 0,
    },
    isComplete: {
      type: Boolean,
      default: false,
    },
    reFlash: {
      type: Boolean,
      default: false,
    },
    facilChkPlan: {
      type: Object,
      default: function () {
        return {
          plantCd: '',
          safCheckTypeCd: '',
          reflash: false,
          noPlanYn: 'N',
          tDeptCd: '',
          // tPlantCd: '',
          pDeptCd: '',
          // pPlantCd: '',
          safFacilityCd: '',
          planFlag: true,
          facilChkResults: [], // 없길래 추가함
        };
      },
    },
  },
  data: () => ({
    chkResultGridOptions: {
      header: [],
      data: [],
      btns: [],
      height: '250',
    },
    chkItemResultGridOptions: {
      header: [],
      data: [],
      height: '250',
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
    safFacilChkResult: {
      safFacilChkNo: 0,
      safFacilityCd: '',
      facilityNm: '',
      safFacilityTypeNm: '',
      safFacilityCheckSchYmd: '', // 설비점검예정일
      createUserId: '', // 설비점검자ID
      chkYmd: '', // 설비점검완료일
      chkEndYn: null, // 설비점검완료여부
      chkResult: '', // 설비점검결과요약
      chkResultCd: null, // 설비점검결과코드
      facilChkItems: [], // 점검항목 목록
      facilChkResults: [], // 점검항목 목록
      userId: '',
      userNm: '',
    },
    createDept: {
      deptCd: '',
      deptNm: '',
    },
    baseWidth: 8,
    editable: false,
    isEdit: false,
    isSelected: false,
    planFlag: true,
    confirmFlag: true,
    searchUrl: '',
    detailUrl: '',
    editUrl: '',
    chkResultItems: [], // 점검결과콤보
    chkEndYnItems: [], // 점검완료여부콤보
    selectValue: [],

    YAuiGridChkResult: null,
    YAuiGridChkItem: null,
  }),
  computed: {
    // 설비 점검 결과 입력 가능 여부(쓰기 권한 + 설비점검결과 목록의 항목 선택)
    isResultEditable() {
      return this.editable && this.isSelected;
    },
  },
  watch: {
    'safFacilChkResult.facilChkResults': {
      handler: function () {
        // this.facilChkPlan.facilChkResults = this.chkResultGridOptions.data;
        let count = 0;
        this.$_.forEach(this.safFacilChkResult.facilChkResults, (result) => {
          if (result.chkComYn === '확정') {
            count++;
          }
        });
        if (
          this.safFacilChkResult.facilChkResults.length !== 0 &&
          this.safFacilChkResult.facilChkResults.length === count
        ) {
          this.confirmFlag = false;
          this.$emit('confirmFlagCheck', false);
        }
      },
      deep: true,
    },

    'facilChkPlan.reflash'() {
      if (this.facilChkPlan.reflash) {
        this.getDataList();
        this.facilChkPlan.reflash = false;
      }
    },
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    this.YAuiGridChkResult = this.$refs.yAuiGridChkResult;
    this.YAuiGridChkItem = this.$refs.yAuiGridChkItem;
    this.getDataList();
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      this.planFlag = this.facilChkPlan.planFlag;
      // Url Setting
      this.searchUrl = selectConfig.saf.facilChkResult.list.url;
      this.detailUrl = selectConfig.saf.facilChkResult.get.url;
      this.editUrl = transactionConfig.saf.facilChkResult.edit.url;

      // 점검완료여부
      this.chkEndYnItems.push({
        code: null,
        codeNm: this.$comm.getLangSpecInfoLabel('L0000003394'),
      });
      this.chkEndYnItems.push({
        code: 'Y',
        codeNm: this.$comm.getLangSpecInfoLabel('L0000002039'),
      });
      this.chkEndYnItems.push({
        code: 'N',
        codeNm: this.$comm.getLangSpecInfoLabel('L0000003563'),
      });
      // 점검결과

      this.$comm.getComboItems('SAF_F_CHK_RSLT_CLS', false).then((_result) => {
        this.chkResultItems = _result;
      });
      // 점검결과목록 조회
      this.setHeader();
      this.setGridBtn();
    },
    beforeEdit() {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321',
              message: 'M0000000011', // 저장하시겠습니까?
              // TODO : 필요시 추가하세요.
              type: 'info', // success / info / warning / error
              // 확인 callback 함수
              confirmCallback: () => {
                // 점검항목별 결과 setting
                this.safFacilChkResult.facilChkItems =
                  this.chkItemResultGridOptions.data;
                this.isEdit = true;
              },
              // 취소 callback 함수
              cancelCallback: () => {},
            });
          } else if (!_result) {
            this.$popupRequired.check(
              'facilChkResultItem',
              this.$data,
              this.errors
            );
          }
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000876'
            // 유효성 검사도중 에러가 발생하였습니다.
          );
          this.isEdit = false;
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
    /** 설비점검결과 목록 조회 **/
    getDataList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';

      this.$http.param = {
        safFacilChkNo: this.safFacilChkNo,
        tDeptCd: this.facilChkPlan.tDeptCd,
        pDeptCd: this.facilChkPlan.pDeptCd,
        safFacilityCd: this.facilChkPlan.safFacilityCd,
      };

      this.$http.request(
        (_result) => {
          // this.facilChkPlan.facilChkResults = _result.data;
          this.safFacilChkResult.facilChkResults = _result.data;
          let gridData = this.safFacilChkResult.facilChkResults;

          this.YAuiGridChkResult.setGridData(gridData);

          if (this.facilChkPlan.noPlanYn === 'Y') {
            gridData = gridData.map((row) => {
              row.user = {
                userId: row.createUserId,
                userNm: row.userNm,
              };

              return row;
            });
          }
          let uncompleteChkResult = _result.data.filter(
            (v) => v.chkEndYn === 'N'
          );
          if (uncompleteChkResult.length > 0) {
            this.$emit('countUnComplete', uncompleteChkResult.length);
          } else if (uncompleteChkResult.length === 0) {
            this.$emit('countUnComplete', 0);
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    setHeader() {
      // 그리드 헤더 설정
      this.chkResultGridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001597'),
          dataField: 'safFacilityTypeNm',
          width: '11%',
          style: 'center-align',
        }, // 설비유형
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000515'),
          dataField: 'processNm',
          width: '11%',
          style: 'center-align',
        }, // 공정
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001618'),
          dataField: 'safFacilityCd',
          width: '11%',
        }, // 설비코드
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001596'),
          dataField: 'facilityNm',
          width: '11%',
        }, // 설비명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002549'),
          dataField: 'tDeptNm',
          width: '11%',
          style: 'center-align',
        }, // 점검대상부서
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004852'),
          dataField: 'pDeptNm',
          width: '11%',
          style: 'center-align',
        }, // 점검수행부서
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004853'),
          dataField: 'userNm',
          width: '11%',
          style: 'center-align',
        }, // 점검수행자

        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002564'),
          dataField: 'safFacilityCheckSchYmd',
          width: '11%',
          style: 'center-align',
        }, // 점검예정일
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002040'),
          dataField: 'chkEndYnNm',
          width: '11%',
          style: 'center-align',
        }, // 완료여부
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002569'),
          dataField: 'chkYmd',
          width: '11%',
          style: 'center-align',
        }, // 점검완료일
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004867'),
          dataField: 'chkComYn',
          width: '11%',
          style: 'center-align',
        }, // 확정여부
      ];

      if (this.facilChkPlan.noPlanYn === 'Y' && !this.isComplete) {
        this.chkResultGridOptions.header.splice(6, 1, {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002572'),
          dataField: 'userNm',
          width: '11%',
          style: 'center-align',
          renderer: {
            type: 'IconRenderer',
            iconPosition: 'aisleRight',
            iconWidth: 20,
            iconHeight: 20,
            iconFunction: (rowIndex, columnIndex, value, item) => {
              return searchIcon;
            },
            onClick: (event) => {
              this.btnSearchUserClicked(event);
            },
          },
        }); // 점검자
        this.chkResultGridOptions.header.splice(7, 1, {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002564'),
          dataField: 'safFacilityCheckSchYmd',
          width: '11%',
          style: 'center-align',
          editRenderer: {
            type: 'CalendarRenderer',
            onlyCalendar: true,
            defaultFormat: 'yyyy-mm-dd',
          },
        }); // 점검예정일
      }

      this.chkItemResultGridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002584'),
          dataField: 'safFacilityCheckNm',
          width: '33%',
        }, // 점검항목
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002536'),
          dataField: 'chkResult',
          width: '34%',
          type: 'text',
          editable: this.isComplete,
        }, // 점검결과
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001360'),
          dataField: 'remark',
          width: '33%',
          type: 'text',
          editable: this.isComplete,
        }, // 비고
      ];
    },

    setGridBtn() {
      this.chkResultGridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002892'),
          color: 'orange',
          btnClicked: 'btnAdd',
          visible:
            !this.isComplete &&
            this.facilChkPlan.noPlanYn === 'Y' &&
            this.editable &&
            this.planFlag &&
            this.confirmFlag,
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002620'),
          color: 'red',
          btnClicked: 'btnDelete',
          visible:
            !this.isComplete &&
            this.facilChkPlan.noPlanYn === 'Y' &&
            this.editable &&
            this.planFlag &&
            this.confirmFlag,
        },
      ];
      // this.YAuiGridChkResult.setBtnArr(this.chkResultGridOptions.btns);
    },
    // 설비별 점검결과 저장
    btnEditClickedCallback(_result) {
      // this.popupParam.safFacilChkNo = _result.data;
      // this.facilChkPlan.safFacilChkNo = _result.data;
      this.isEdit = false;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395',
        message: 'M0000000006',
        type: 'success', // success / info / warning / error
      });
      this.getDataList();
    },
    btnClickedErrorCallback(_result) {
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    selectedRow(data) {
      if (data === null || !data.item.safFacilChkNo) return;
      this.$http.url = this.detailUrl;
      this.$http.type = 'GET';
      this.$http.param = {
        safFacilChkNo: data.item.safFacilChkNo,
        safFacilityCd: data.item.safFacilityCd,
        plantCd: this.facilChkPlan.plantCd,
        safCheckTypeCd: this.facilChkPlan.safCheckTypeCd,
      };
      this.$http.request(
        (_result) => {
          this.safFacilChkResult = this.$_.clone(_result.data);

          if (!this.safFacilChkResult.chkYmd) {
            this.safFacilChkResult.chkYmd = this.$comm.getToday();
          }

          this.chkItemResultGridOptions.data =
            this.safFacilChkResult.facilChkItems;
          this.isSelected = true;
        },
        (_error) => {
          this.isSelected = false;
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    btnAdd() {
      if (!this.facilChkPlan.safCheckTypeCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: 'M0000000728',
          // 점검종류를 선택하세요.
          type: 'warning', // success / info / warning / error
        });
      } else {
        this.popupOptions.target = () =>
          import(`${'../../baseInfo/facility/facilityMstPopup.vue'}`);
        this.popupOptions.title = 'L0000003680';
        this.popupOptions.width = '85%';
        // 설비 추가
        this.popupOptions.param = {
          // 설비 추가 팝업에서 점검설비 목록에 있는 데이터를 넘기지 않음
          // 따라서 제외는 제외버튼을 통해 제외
          selectedFacilityMstValue: [],
          safCheckTypeCd: this.facilChkPlan.safCheckTypeCd,
          plantCd: this.facilChkPlan.plantCd,
          deptCd: this.facilChkPlan.tDeptCd,
        };
        this.popupOptions.visible = true;
        this.popupOptions.closeCallback = this.closeFacilityPopup;
      }
    },
    closeFacilityPopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data === 'CLOSE') return;
      // 데이터의 타입이 배열이 아닌 알 수 없는값으로 표기 될 시에 배열로 초기화
      var i = 0;
      this.$_.forEach(this.YAuiGridChkResult.getGridData(), (item) => {
        data = this.$_.clone(
          this.$_.reject(data, { safFacilityCd: item.item.safFacilityCd })
        );
      });
      let gridData = this.YAuiGridChkResult.getGridData();
      this.$_.forEach(data, (item) => {
        gridData.splice(0, 0, {
          safFacilityTypeNm: item.safFacilityTypeNm,
          safFacilityTypeCd: item.safFacilityTypeCd,
          processNm: item.processNm,
          safFacilityCd: item.safFacilityCd,
          facilityNm: item.facilityNm,
          facilityMgrNum: item.facilityMgrNum,
          tDeptNm: item.deptNm,
          tDeptCd: item.deptCd,
          userId: '',
          userNm: '',
          pDeptNm: '',
          pDeptCd: '',
          chkComYn: '미확정',
        });
      });
      this.safFacilChkResult.facilChkResults = gridData;
      this.YAuiGridChkResult.setGridData(gridData);
      this.cellEditEndHandler();
    },
    btnDelete() {
      const selectValue = this.YAuiGridChkResult.getCheckedRowItems();
      if (selectValue <= 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: 'M0000000092', // 설비목록에서 설비를 한개이상 선택하세요.
          type: 'warning', // success / info / warning / error
        });
        return;
      } else {
        window.getApp.$emit('CONFIRM', {
          title: 'L0000003321',
          message: 'M0000000093', // 제외하시겠습니까?
          type: 'info', // success / info / warning / error
          // 확인 callback 함수
          confirmCallback: () => {
            let gridData = this.YAuiGridChkResult.getGridData();
            this.$_.forEach(selectValue, (rows) => {
              gridData = this.$_.reject(gridData, {
                safFacilityCd: rows.item.safFacilityCd,
              });
            });
            this.YAuiGridChkResult.setGridData(gridData);

            window.getApp.$emit('ALERT', {
              title: 'L0000003395',
              message: 'M0000000686', // 제외되었습니다.
              type: 'success', // success / info / warning / error
            });
          },
          // 취소 callback 함수
          cancelCallback: () => {},
        });
      }
    },
    selectedCheck() {
      return (
        !this.isComplete && this.facilChkPlan.noPlanYn === 'Y' && this.editable
      );
    },
    btnSearchUserClicked(event) {
      this.popupOptions.target = () =>
        import(`${'@/pages/manage/user/userSearch.vue'}`);
      this.popupOptions.param = {
        plantCd: this.facilChkPlan.plantCd,
        deptCd: event.item.deptCd,
      };
      this.popupOptions.selectedRowInfo = event;

      this.popupOptions.title = '사용자검색';
      this.popupOptions.visible = true;
      this.popupOptions.width = '60%';
      this.popupOptions.top = '100px';
      this.popupOptions.closeCallback = this.closePopupSearchUser;
    },
    closePopupSearchUser(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data.user) {
        const rowIndex = this.popupOptions.selectedRowInfo.rowIndex;
        const gridData2 = this.YAuiGridChkResult.getGridData();
        gridData2[rowIndex].userId = data.user.userId;
        gridData2[rowIndex].userNm = data.user.userNm;

        gridData2[rowIndex].pDeptCd = data.user.deptCd;
        gridData2[rowIndex].pDeptNm = data.user.deptNm;

        this.YAuiGridChkResult.setGridData(gridData2);
      }
    },
    cellEditEndHandler() {
      this.facilChkPlan.facilChkResults = this.YAuiGridChkResult.getGridData();
    },
    /** end button 관련 이벤트 **/
  },
};
</script>
