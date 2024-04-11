<!--
  목적 : 안전 > 안전관찰(BBS) > 안전관찰 상세 > 체크리스트 탭
  Detail : 체크리스트 탭 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 검색 결과 테이블 -->
    <b-row>
      <b-col sm="12">
        <y-auigrid
          ref="yAuiGrid"
          :headers="gridOptions.header"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000002856')"
          :useExcelExport="false"
          :editable="!disabled&&editable"
        />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';

export default {
  /* attributes: name, components, props, data */
  name: 'y-cto-check-list',
  props: {
    disabled: false,
    cto: {
      type: Object,
      default: {
        safCtoNo: 0, // 번호
        ctoCheckResults: [],
      },
    },
  },
  data: () => ({
    // TODO : 현재까지 파악된 바로는 tab은 같은 폴더 또는 하위 폴더의 컴포넌트만 접근이 가능한 것으로 파악됨
    //                즉, 반드시 메인페이지 역할을 하는 vue와 동일 폴더나 하위 폴더에 tabItem 역할을 하는 vue 파일을 위치 시킬 것
    YAuiGrid: null,
    gridOptions: {
      header: [],
      data: [],
      height: '300',
    },
    editable: true,
  }),
  watch: {
    'cto.safCtoNo': {
      handler: function(newValue, oldValue) {
        this.getComboItems('SAF_SEL_VAL2'); // 선택값
      },
      deep: true,
    },
    'gridOptions.data': {
      handler: function(newValue, oldValue) {
        this.$_.forEach(this.gridOptions.data, gridData => {
          let index = this.$_.findIndex(this.cto.ctoCheckResults, {
            ctoActCd: gridData.ctoActCd,
          });
          if (index > -1) {
            this.cto.ctoCheckResults.splice(index, 1);
            this.cto.ctoCheckResults.splice(0, 0, {
              ctoActCd: gridData.ctoActCd,
              ctoActNm: gridData.ctoActNm,
              selCd: gridData.selCd,
              remarks: gridData.remarks,
            });
          } else {
            this.cto.ctoCheckResults.splice(0, 0, {
              ctoActCd: gridData.ctoActCd,
              ctoActNm: gridData.ctoActNm,
              selCd: gridData.selCd,
              remarks: gridData.remarks,
            });
          }
        });
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

      // 선택값
      this.getComboItems('SAF_SEL_VAL2').then(result => {
        // 그리드 헤더 설정
        this.gridOptions.header = [
          { 
            headerText: this.$comm.getLangSpecInfoLabel('L0000002857'), 
            dataField: 'ctoActNm', 
            width: '37%', 
            style: 'left-align',
            editable: false,
          }, // 체크리스트 항목 
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000001929'), 
            dataField: "selCd",
            width: '25%',
            editable: !this.disabled && this.editable,
            renderer: {
              type: "TemplateRenderer"
            }, 
            // dataField 로 정의된 필드 값이 HTML 이라면 labelFunction 으로 처리할 필요 없음.
            labelFunction: function (rowIndex, columnIndex, value, headerText, item) { 
              const name = "selCd_" + rowIndex;
              
              const obj = document.querySelector('input[name="' + name + '"]:checked');
              if ((obj || null) !== null) {
                if (value !== obj.value) {
                  item.selCd = obj.value;
                  value = obj.value;
                }
              }

              let template = '<div> ';
              result.forEach(row => {
                let checkedTag = '';
                let disabledTab = '';
                if (value === row.code) checkedTag = " checked='checked'";
                if ((!this.disabled && this.editable) === false) disabledTab = " disabled ";

                const id = name + "_" + row.code;
                template += " <input type='radio' id='" + id + "' name='" + name + "' value='" + row.code + "'" + checkedTag + disabledTab + ">";
                template += "<label for='" + id + "' class='grid-input-radio'>" + row.codeNm + " </label>";
                template += " </input>";
              });
              template += ' </div>';
              return template;
            }
          }, // 양호/불량/해당없음
          { 
            headerText: this.$comm.getLangSpecInfoLabel('L0000000812'), 
            dataField: 'remarks', 
            width: '38%',
            style: 'left-align',
            editRenderer: {
              type: 'InputEditRenderer', 
            }, 
          }, // 내용설명 

        ];
      });
    },
    /**
     * 공통 마스터 정보 조회
     * codeGroupCd : 마스터 테이블 codeGroupCd 정보
     */
    getComboItems(codeGroupCd) {
      return new Promise(resolve => {
        this.$http.url = this.$format(
          selectConfig.codeMaster.getSelect.url,
          codeGroupCd
        );
        this.$http.type = 'GET';
        this.$http.request(
          _result => {
            if (codeGroupCd === 'SAF_SEL_VAL2') {
              this.getComboItems('SAF_CTO_ACT'); // 항목코드
            } else if (codeGroupCd === 'SAF_CTO_ACT') {
              let index = 0;
              this.gridOptions.data = [];
              this.$_.forEach(_result.data, item => {
                let filterData = this.$_.filter(this.cto.ctoCheckResults, {
                  ctoActCd: item.code,
                });
                this.gridOptions.data.splice(index, 0, {
                  ctoActCd: item.code,
                  ctoActNm: item.codeNm,
                  selCd:
                  filterData && filterData.length > 0
                    ? filterData[0].selCd
                    : '',
                  remarks:
                  filterData && filterData.length > 0
                    ? filterData[0].remarks
                    : '',
                });
                index++;
              });

              this.YAuiGrid.setGridData(this.gridOptions.data);
            }

            resolve(_result.data);
          },
          _error => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      });
    },
    /** end button 관련 이벤트 **/
  },
};
</script>