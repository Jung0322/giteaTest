<!--
  목적 : 설비점검 관리 - 설비점검결과 - 결과
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
              <!-- 순회결과 -->
              <y-select
                :width="8"
                :required="true"
                :comboItems="patrolResultCdItems"
                :disabled="disabled"
                :editable="editable"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                name="checkResultCd"
                label="L0000001710"
                v-model="checkPlanDetail.checkResultCd"
              ></y-select>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <!-- 순회결과요약 -->
              <y-textarea
                :width="10"
                :maxlength="60"
                :required="true"
                :editable="editable"
                :disabled="disabled"
                ui="bootstrap"
                label="L0000001713"
                name="checkResult"
                v-model="checkPlanDetail.checkResult"
              />
            </b-col>
          </b-row>
          <!-- 검색 결과 테이블 -->
          <b-row>
            <b-col sm="12">
              <b-col sm="12" class="px-0">
                <!-- 순회항목별 결과 목록 -->
                <!-- <y-data-table
                  ref="dataFaciliyItemResultTable"
                  :height="gridOptions.height"
                  :editable="editable&&!disabled"
                  :headers="gridOptions.header"
                  :items="gridOptions.data"
                  :print="true"
                  label="L0000001722"
                  :popMode="true"
                ></y-data-table> -->
                <y-auigrid
                  ref="yAuiGrid"
                  :name="gridOptions.name"
                  :headers="gridOptions.header"
                  :btns="gridOptions.btns"
                  :height="gridOptions.height"
                  :items="gridOptions.data"
                  :label="this.$comm.getLangSpecInfoLabel('L0000001722')"
                  :useExcelExport="false"
                  :showItemCount="false"
                  :showRowCheckColumn="true"
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
export default {
  /* attributes: name, components, props, data */
  name: 'y-patrol-item-result',
  props: {
    checkPlanDetail: {
      type: Object,
      default: {
        safCheckRsltNo: 0,
        safCheckKindNo: null,
        checkStepCd: '',
        checkResultCd: null,
        checkResult: '',
        tgtDeptCd: '',
        deptCd: '',
        patrolItems: [],
      },
    },
    disabled: false,
    YAuiGrid: null,
  },
  data: () => ({
    gridOptions: {
      header: [],
      data: [],
      height: '300',
    },
    patrolResultCdItems: [],
    editable: false,
    searchUrl: '',
  }),
  watch: {
    'checkPlanDetail.safCheckRsltNo': {
      handler: function (val, oldVal) {
        this.getList();
      },
    },
    'checkPlanDetail.safCheckKindNo': {
      handler: function (val, oldVal) {
        this.getList();
      },
    },
    'gridOptions.data': {
      handler: function (val, oldVal) {
        this.checkPlanDetail.patrolItems = this.$_.clone(this.gridOptions.data);
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
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;

      // Url Setting
      this.searchUrl = selectConfig.saf.patrol.resultItem.url;
      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002584'),
          dataField: 'safCheckTypeNm',
          width: '33%',
        }, // 점검항목
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002536'),
          dataField: 'checkResult',
          width: '33%',
          editRenderer: {
            type: 'InputEditRenderer',
            maxlength: 30,
          },
        }, // 점검결과
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001360'),
          dataField: 'remark',
          width: '34%',
          editRenderer: {
            type: 'InputEditRenderer',
            maxlength: 300,
          },
        }, // 비고
      ];

      this.getComboItems('SAF_PATROL_RSLT_CLS'); // 순회결과
      this.getList();

      this.$forceUpdate();
    },
    /** 안전점검결과 목록 조회 **/
    getList() {
      if (!this.checkPlanDetail.safCheckKindNo) return;
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = {
        safCheckRsltNo: this.checkPlanDetail.safCheckRsltNo,
        safCheckKindNo: this.checkPlanDetail.safCheckKindNo,
      };
      this.$http.request(
        (_result) => {
          this.gridOptions.data = this.$_.clone(_result.data);
          this.$forceUpdate();
          // this.YAuiGrid.setGridData(_result.data);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /**
     * 공통 마스터 정보 조회 (순회결과)
     * codeGroupCd : 마스터 테이블 codeGroupCd 정보
     */
    getComboItems(codeGroupCd) {
      this.$http.url = this.$format(
        selectConfig.codeMaster.getSelect.url,
        codeGroupCd
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          if (codeGroupCd === 'SAF_PATROL_RSLT_CLS') {
            this.patrolResultCdItems = this.$_.clone(_result.data);
            this.patrolResultCdItems.splice(0, 0, {
              code: null,
              codeNm: this.$comm.getLangSpecInfoLabel('L0000003394'), // 선택하세요
            });
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
  },
};
</script>
