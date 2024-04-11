<!--
  목적 : 안전점검 관리 - 안전점검결과 - 결과
  Detail : 안전점검 항목별 점검결과
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 등록 -->
    <b-row>
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 항목별점검결과 -->
            <y-label
              label="L0000003208"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 점검결과 -->
              <y-select
                :width="8"
                :comboItems="checkResultItems"
                :disabled="disabled || this.popupMode"
                :editable="editable"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                name="checkResultCd"
                label="L0000002536"
                v-model="checkResultDetail.checkResultCd"
              ></y-select>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <!-- 점검결과요약 -->
              <y-textarea
                :disabled="disabled"
                :width="10"
                :editable="editable"
                :maxlength="1200"
                :required="true"
                ui="bootstrap"
                label="L0000002538"
                name="checkResult"
                v-model="checkResultDetail.checkResult"
                v-validate="'required'"
                :state="validateState('checkResult')"
              />
            </b-col>
          </b-row>
          <!-- 검색 결과 테이블 -->
          <b-row>
            <b-col sm="12">
              <b-col sm="12" class="px-0">
                <!-- 점검항목별 결과 목록 -->
                <!-- <y-data-table
                  ref="dataItemResultTable"
                  :editable="editable && !checkResultDetail.checkPlanFlag"
                  :height="gridOptions.height"
                  :headers="gridOptions.header"
                  :items="gridOptions.data"
                  :print="true"
                  label="L0000002586"
                ></y-data-table> -->
                <y-auigrid
                  ref="yAuiGrid"
                  :editable="editable && !checkResultDetail.checkPlanFlag"
                  :headers="gridOptions.header"
                  :btns="gridOptions.btns"
                  :height="gridOptions.height"
                  :items="gridOptions.data"
                  :label="this.$comm.getLangSpecInfoLabel('L0000002586')"
                />
              </b-col>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  /* attributes: name, components, props, data */
  name: 'y-check-item-result',
  props: {
    popupMode: false,
    checkResultDetail: {
      type: Object,
      default: {
        safCheckNo: 0, // 안전점검마스터 일련번호
        safCheckScheduleNo: 0, // 안전점검일정 일련번호
        safCheckKindNo: 0,
        checkResult: null,
        checkItemResults: [],
        checkStepCd: '',
        checkResultCd: '',
        checkPlanFlag: false,
      },
    },
  },
  data: () => ({
    gridOptions: {
      header: [],
      data: [],
      height: '400',
    },
    checkResultItems: [], // 점검결과 목록
    editable: false,
    isInsert: false,
    isEdit: false,
    searchUrl: '',
    disabled: false,
    YAuiGrid: null,
  }),
  watch: {
    'checkResultDetail.safCheckScheduleNo': function (newValue, oldValue) {
      this.getList();
    },
    'checkResultDetail.safCheckKindNo': function (newValue, oldValue) {
      this.getList();
    },
    'checkResultDetail.checkPlanFlag': function (newVal, oldVal) {
      this.disabled = this.checkResultDetail.checkPlanFlag;
    },
    'gridOptions.data': {
      handler: function (val, oldVal) {
        this.checkResultDetail.checkItemResults = this.gridOptions.data;
      },
      deep: true,
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
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.getList();
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      // Url Setting
      this.searchUrl = selectConfig.saf.checkItemResult.list.url;

      this.disabled = this.checkResultDetail.checkPlanFlag;

      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002584'),
          dataField: 'safCheckTypeNm',
          width: '30%',
        }, // 점검항목
      ];

      if (
        this.checkResultDetail.checkStepCd === 'CHS04' ||
        this.checkResultDetail.checkStepCd === 'CHS03'
      ) {
        this.gridOptions.header.splice(1, 0, {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002536'),
          dataField: 'checkResult',
          width: '30%',
          editRenderer: {
            type: 'InputEditRenderer',
            showEditorBtnOver: true, // 마우스 오버 시 에디터버턴 보이기
            textAlign: 'left', // 인푸터 텍스트 왼쪽 정렬(기본값)
          },
        }); // 점검결과
        this.gridOptions.header.splice(2, 0, {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001360'),
          dataField: 'remark',
          width: '40%',
          editRenderer: {
            type: 'InputEditRenderer',
            showEditorBtnOver: true, // 마우스 오버 시 에디터버턴 보이기
            textAlign: 'left', // 인푸터의 텍스트 정렬 오른쪽 설정
            maxlength: 30,
          },
        }); // 비고
        this.gridOptions.height = '280';
      } else {
        this.gridOptions.header.splice(1, 0, {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002536'),
          dataField: 'checkResult',
          width: '30%',
          editRenderer: {
            type: 'InputEditRenderer',
            showEditorBtnOver: true, // 마우스 오버 시 에디터버턴 보이기
            textAlign: 'left', // 인푸터 텍스트 왼쪽 정렬(기본값)
          },
        }); // 점검결과
        this.gridOptions.header.splice(2, 0, {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001360'),
          dataField: 'remark',
          width: '40%',
          editRenderer: {
            type: 'InputEditRenderer',
            showEditorBtnOver: true, // 마우스 오버 시 에디터버턴 보이기
            textAlign: 'left', // 인푸터의 텍스트 정렬 오른쪽 설정
            maxlength: 30,
          },
        }); // 비고
        this.gridOptions.height = '400';
      }

      // 점검결과 목록 조회
      this.$comm.getComboItems('SAF_CHK_RSLT_CLS', false).then((_result) => {
        this.checkResultItems = _result;
      });
      if (this.popupMode) {
        this.disabled = true;
      }
    },
    /** 안전점검결과 목록 조회 **/
    getList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = {
        safCheckScheduleNo: this.checkResultDetail.safCheckScheduleNo,
        safCheckNo: this.checkResultDetail.safCheckNo,
        safCheckKindNo: this.checkResultDetail.safCheckKindNo,
      };
      this.$http.request(
        (_result) => {
          // this.gridOptions.data = _result.data; // this.$_.clone(_result.data);
          this.YAuiGrid.setGridData(this.$_.clone(_result.data));
          this.checkResultDetail.checkItemResults = _result.data;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /**
     * 필수입력값 유효성 검사
     */
    validateState(ref) {
      if (
        this.veeBag[ref] &&
        (this.veeBag[ref].dirty || this.veeBag[ref].validated)
      ) {
        return !this.errors.has(ref);
      }
      return null;
    },
    /** button 관련 이벤트 **/
    /**
     * 수정 버튼 안보여지도록 처리
     *  버튼 http 통신 중 error 발생 callback
     * _result : error return하는 데이터
     */
    btnClickedErrorCallback(_result) {
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    /** end button 관련 이벤트 **/
  },
};
</script>
