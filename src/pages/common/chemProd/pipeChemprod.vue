<!--
  목적 : (배관 및 개스킷)화학물질 등록(팝업 & 탭)
  작성자 : kdh
  Detail : 
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 화학물질 grid -->
    <b-row>
      <b-col sm="12">
        <!-- 화학자재 목록 -->
        <y-auigrid
          ref="yAuiGrid"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :label="this.$comm.getLangSpecInfoLabel('L0000003311')"
          :items="gridOptions.data"
          :editable="editable"
          :showRowNumColumn="false"
          :showRowCheckColumn="true"
          :useExcelExport="false"
          :enableCellMerge="true"
          :cellMergeRowSpan="true"
          @btnAddChemprod="btnAddChemprod"
          @btnDeleteChemprod="btnDeleteChemprod"
        />
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  name: 'y-pipe-chemprod',
  props: {
    tabParam: {
      type: Object,
      default: () => ({
        pipeNo: 0,
      }),
    },
  },
  data: function () {
    return {
      searchParam: {
        pipeNo: 0,
      },
      YAuiGrid: null,
      gridOptions: {
        header: [],
        data: [],
        height: 500,
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
      editable: false,
      searchUrl: '',
      deleteUrl: '',
      chemProds: [],
    };
  },
  watch: {
    'gridOptions.data': {
      handler: function (val, oldVal) {
        this.chemProds = val;
      },
      deep: true,
    },
    'tabParam.pipeNo': {
      handler: function (val, oldVal) {
        this.searchUrl = selectConfig.psm.pipeChemprod.list.url;
        this.getDataList();
      },
    },
  },
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
      // URL 셋팅
      this.searchUrl = selectConfig.psm.pipeChemprod.list.url;
      this.deleteUrl = transactionConfig.psm.pipeChemprod.delete.url;

      this.editable = this.$route.meta.editable;
      this.getDataList();

      // 그리드 헤더 설정
      this.gridOptions.header = [
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'), 
          dataField: 'plantNm', 
          width: '150', 
          cellMerge: true,
          mergeRef: "chemProdNmKr",
          mergePolicy: "restrict"
        }, // 사업장 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000003315'), 
          dataField: 'chemProdNmKr', 
          width: '150', 
          cellMerge: true,
          mergeRef: "chemProdNmKr",
          mergePolicy: "restrict"
        }, // 화학자재명 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000003298'), 
          dataField: 'chemNmKr', 
          width: '150', 
          style: 'left-align',
          cellMerge: true,
          mergeRef: "chemProdNmKr",
          mergePolicy: "restrict" 
        }, // 화학물질명 
        { 
          headerText: 'CAS No.', 
          dataField: 'casNo', 
          width: '150', 
        }, 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000001348'), 
          dataField: 'moleFormula', 
          width: '150', 
          style: 'left-align', 
        }, // 분자식 
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003147'), // 폭발한계(%)
          children: [
            { 
              headerText: this.$comm.getLangSpecInfoLabel('L0000001540'), 
              dataField: 'explUpLimit', 
              width: '80', 
              style: 'right-align', 
            }, // 상한 
            { 
              headerText: this.$comm.getLangSpecInfoLabel('L0000003166'), 
              dataField: 'explLowLimit', 
              width: '80', 
              style: 'right-align', 
            }, // 하한 
          ],
        },
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000000845'), 
          dataField: 'leakThresh', 
          width: '130', 
          style: 'left-align', 
          cellMerge: true,
          mergeRef: "chemProdNmKr",
          mergePolicy: "restrict"
        }, // 노출기준 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000000959'), 
          dataField: 'lc50', 
          width: '180', 
          style: 'left-align', 
          cellMerge: true,
          mergeRef: "chemProdNmKr",
          mergePolicy: "restrict"
        }, // 독성치 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000002261'), 
          dataField: 'flashingPnt', 
          width: '130', 
          style: 'right-align', 
          cellMerge: true,
          mergeRef: "chemProdNmKr",
          mergePolicy: "restrict"
        }, // 인화점 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000001104'), 
          dataField: 'IgnitionPnt', 
          width: '130', 
          style: 'right-align', 
          cellMerge: true,
          mergeRef: "chemProdNmKr",
          mergePolicy: "restrict"
        }, // 발화점 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000002744'), 
          dataField: 'vaporPressure', 
          width: '130', 
          style: 'right-align', 
          cellMerge: true,
          mergeRef: "chemProdNmKr",
          mergePolicy: "restrict"
        }, // 증기압 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000001335'), 
          dataField: 'corrosivenessYnNm', 
          width: '130', 
          cellMerge: true,
          mergeRef: "chemProdNmKr",
          mergePolicy: "restrict"
        }, // 부식성유무 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000002210'), 
          dataField: 'extraReactionYnNm', 
          width: '130', 
          cellMerge: true,
          mergeRef: "chemProdNmKr",
          mergePolicy: "restrict"
        }, // 이상반응유무 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000002271'), 
          dataField: 'dailyVol', 
          width: '130', 
          style: 'right-align', 
          cellMerge: true,
          mergeRef: "chemProdNmKr",
          mergePolicy: "restrict"
        }, // 일일취급량 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000002477'), 
          dataField: 'maxVol', 
          width: '130', 
          style: 'right-align', 
          cellMerge: true,
          mergeRef: "chemProdNmKr",
          mergePolicy: "restrict"
        }, // 저장량 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000001360'), 
          dataField: 'remark', 
          width: '200', 
          style: 'left-align', 
          cellMerge: true,
          mergeRef: "chemProdNmKr",
          mergePolicy: "restrict"
        }, // 비고 

      ];
      this.gridOptions.btns = [
        { 
          title: this.$comm.getLangSpecInfoLabel('L0000002892'), 
          color: 'orange', 
          btnClicked: 'btnAddChemprod',
          visible: this.editable && this.tabParam.pipeNo !== 0,
        },  // 추가
        { 
          title: this.$comm.getLangSpecInfoLabel('L0000001495'), 
          color: 'red', 
          btnClicked: 'btnDeleteChemprod',
          visible: this.editable && this.tabParam.pipeNo !== 0,
        },  // 삭제
      ];
    },
    selectCheck() {
      if (!this.editable) return false;
      else return true;
    },
    // 화학물질 grid
    getDataList() {
      this.searchParam.pipeNo = this.tabParam.pipeNo;
      this.$http.url = this.searchUrl;
      this.$http.type = 'get';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          this.gridOptions.data = this.$_.clone(_result.data);
        },
        (_error) => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            'M0000000016' // 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
          );
        }
      );
    },
    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data === 'CLOSE') return;

      this.gridOptions.data = this.$_.clone(data);
    },
    // 버튼 에러 처리
    btnClickedErrorCallback(_result) {
      window.getApp.emit('APP_REQUEST_ERROR', _result);
    },
    btnAddChemprod() {
      this.popupOptions.target = () =>
        import(`${'../../common/chemProd/chemprodPopup.vue'}`);
      this.popupOptions.title = 'L0000003309'; // 화학자재
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      this.popupOptions.top = '10px';
      this.popupOptions.param = {
        pipeNo: this.tabParam.pipeNo,
        chemProds: this.chemProds,
      };
      this.popupOptions.closeCallback = this.closePopup;
    },
    btnDeleteChemprod() {
      const selectedRows = this.YAuiGrid.getCheckedRowItemsAll();
      if (selectedRows.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000911', // 삭제 할 데이터를 선택하세요.
          type: 'warning',
        });
        return;
      } else {
        window.getApp.$emit('CONFIRM', {
          title: 'L0000003321', // '확인',
          message: 'M0000000012', // 삭제하시겠습니까?
          type: 'info',
          // 확인 callback 함수
          confirmCallback: () => {
            this.$http.url = this.deleteUrl;
            this.$http.type = 'DELETE';
            this.$http.param = {
              data: Object.values(this.$_.clone(selectedRows)),
            };
            this.$http.request(
              (_result) => {
                window.getApp.$emit('ALERT', {
                  title: 'L0000003395', // '안내',
                  message: 'M0000000007', // 삭제되었습니다.
                  type: 'success',
                });
                this.getDataList();
              },
              (_error) => {
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
