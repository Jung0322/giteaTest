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
            <y-label label="항목별점검결과" icon="user-edit" color-class="cutstom-title-color" />
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <y-textarea
                :width="10"
                :maxlength="500"
                :required="true"
                :editable="editable"
                :disabled="disabled"
                ui="bootstrap"
                label="합동결과요약"
                name="checkResult"
                v-model="checkPlanDetail.checkResult"
              />
            </b-col>
          </b-row>
          <!-- 검색 결과 테이블 -->
          <b-row>
            <b-col sm="12">
              <y-auigrid
                ref="yAuiGrid"
                :editable="editable&&!disabled"
                :headers="gridOptions.header"
                :btns="gridOptions.btns"
                :height="gridOptions.height"
                label="합동점검 항목별 결과 목록"
                :items="gridOptions.data"
                :useExcelExport="false"
                 @cellEditEnd="cellEditEndHandler"
              />
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
        safCongChkRsltNo: 0,
        safCheckKindNo: 0,
        checkStepCd: '',
        checkResult: '',
        deptCd: '',
        consolItems: [],
      },
    },
    disabled: false,
  },
  data: () => ({
    YAuiGrid: null,
    gridOptions: {
      header: [],
      data: [],
      height: '300',
    },
    editable: false,
    searchUrl: '',
    selVal: [],
  }),
  watch: {
    'checkPlanDetail.safCongChkRsltNo': {
      handler: function(val, oldVal) {
        this.getList();
      },
    },
    'checkPlanDetail.safCheckKindNo': {
      handler: function(val, oldVal) {
        this.getList();
      }
    },
    'gridOptions.data': {
      handler: function(val, oldVal) {
        this.checkPlanDetail.consolItems = this.$_.clone(this.gridOptions.data);
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
    window.addEventListener('resize', this.resizeGrid);
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.resizeGrid();
    this.getList();
  },
  beforeDestroy() { },
  activated() {
    this.resizeGrid();
  },
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;

      this.getComboItems('SAF_CHK_RSLT_CLS2').then(() => {
        this.gridOptions.header = [
          { 
            headerText: '점검항목', 
            dataField: 'safCheckTypeNm', 
            width: '30%', 
            editable: false,
          }, 
          { 
            headerText: '점검결과', 
            dataField: 'chkRsltCd', 
            width: '30%', 
            renderer: {
              type: "TemplateRenderer"
            }, 
            // dataField 로 정의된 필드 값이 HTML 이라면 labelFunction 으로 처리할 필요 없음.
            labelFunction: (rowIndex, columnIndex, value, headerText, item) => { 
              const name = "chkRsltCd_" + item.safCheckItemNo;
              const obj = document.querySelector('input[name="' + name + '"]:checked');
              if ((obj || null) !== null) {
                if (value !== obj.value) {
                  item.chkRsltCd = obj.value;
                  value = obj.value;
                  this.gridOptions.data[rowIndex].chkRsltCd = value;
                }
              }

              let template = '<div> ';
              this.selVal.forEach(row => {
                let checkedTag = '';
                let disabledTab = '';
                if (value === row.code) checkedTag = " checked='checked'";
                if ((!this.disabled && this.editable) === false) disabledTab = " disabled ";

                const id = name + "_" + row.code;
                template += " <input type='radio' id='" + id + "' name='" + name + "' value='" + row.code + "'" + checkedTag + disabledTab + ">";
                template += "<label for='" + id + "' class='grid-input-radio'>" + row.codeNm + " </label>";
                template += " </>";
              });
              template += ' </div>';
              return template;
            }
          }, 
          { 
            headerText: '비고', 
            dataField: 'remark', 
            width: '40%', 
            style: 'left-align',
            editRenderer: {
              type: 'InputEditRenderer', 
            }, 

          }, 

        ];
      });
    },
    getComboItems(codeGroupCd) {
      return new Promise((resolve, reject) => {
        this.$http.url = this.$format(
          selectConfig.codeMaster.getSelect.url,
          codeGroupCd
        );
        this.$http.type = 'GET';
        this.$http.request(
          (_result) => {
            if (codeGroupCd === 'SAF_CHK_RSLT_CLS2') {
              this.selVal = this.$_.clone(_result.data);
            }
            resolve();
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
            reject(_error);
          }
        );
      });
    },
    /** 안전점검결과 목록 조회 **/
    getList() {
      if (!this.checkPlanDetail.safCheckKindNo) return;
      this.$http.url = selectConfig.saf.consolPlan.resultItem.url;
      this.$http.type = 'GET';
      this.$http.param = {
        safCheckKindNo: this.checkPlanDetail.safCheckKindNo,
        safCongChkRsltNo: this.checkPlanDetail.safCongChkRsltNo,
      };
      this.$http.request(
        _result => {
          const result = [];
          if (_result.data.length > 0) {
            this.$_.forEach(_result.data, _item => {
              result.push({
                safCheckKindNo: _item.safCheckKindNo,
                safCheckKindNm: _item.safCheckKindNm,
                safCheckTypeNm: _item.safCheckTypeNm,
                safCongChkRsltNo: _item.safCongChkRsltNo,
                safCheckItemNo: _item.safCheckItemNo,
                chkRsltCd: _item.chkRsltCd ? _item.chkRsltCd : 'SCRD1',
                remark: _item.reamrk,
                checkResult: _item.checkResult,
              });
            });
          }
          this.gridOptions.data = result;
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    cellEditEndHandler(event) {
      this.gridOptions.data[event.rowIndex][event.dataField] = event.value;
    },
    resizeGrid() {
      this.YAuiGrid.resize(null, this.gridOptions.height);
    },
  },
};
</script>