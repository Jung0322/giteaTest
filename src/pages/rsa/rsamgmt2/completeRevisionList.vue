<!--
  목적 : 작업 위험성평가(HE) 이력 조회
  Detail : 결제진행 상태 팝업
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 검색 결과 테이블 -->
    <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
            <!-- 닫기 -->
            <y-btn title="L0000000881" @btnClicked="closePopup('CLOSE')" />
          </div>

          <!-- <y-data-table
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :span-options="gridOptions.merge"
            @tableLinkClicked="tableLinkAccidentTitleClicked"
            :useRownum="false"
            :use-paging="true"
          ></y-data-table> -->
          <y-auigrid
            ref="yAuiGrid"
            :name="gridOptions.name"
            :headers="gridOptions.header"
            :btns="gridOptions.btns"
            :height="gridOptions.height"
            :useExcelExport="false"
            :enableCellMerge="true"
            :enableSorting="true"
            :showGridSetSave="true"
            :useContextMenu="true"
            :enableRightDownFocus="true"
            :showGridCtrl="true"
            :showRowCheckColumn="true"
            @getList="getList"
          />
        </b-col>
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
export default {
  name: 'appr-progress-popup',
  props: {
    popupParam: {
      type: Object,
      default() {
        return {
          jobNo: '', // 결재번호
        };
      },
    },
  },
  data() {
    return {
      gridOptions: {
        header: [],
        data: [],
        height: '250',
        merge: [],
      },
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '95%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      searchUrl: '',
      YAuiGrid: null,
    };
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  updated() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    if (this.popupParam.jobNo && this.popupParam.jobNo > 0) {
      this.getList();
    }
  },
  //* methods */
  methods: {
    init() {
      // Url Setting
      this.searchUrl = selectConfig.rsa.planmgmt2.getRevisionList.url;

      // 그리드 헤더 설정

      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005835'),
          dataField: 'revNo',
          width: 180,
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: (rowIndex, columnIndex, value, item) => {
              this.openPopup(item);
            },
          },
        } /* 이력번호 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000590'),
          dataField: 'jobManageNo',
          width: 180,
        } /* 관리번호 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002389'),
          dataField: 'jobNm',
          width: 180,
        } /* 작업명 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003081'),
          dataField: 'assessNm',
          width: 100,
        } /* 평가명 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003065'),
          dataField: 'assessYear',
          width: 150,
        } /* 평가년도 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003091'),
          dataField: 'assessDate',
          width: 100,
        } /* 평가일 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004201'),
          dataField: 'userNm',
          width: 150,
        } /* 평가담당자 */,
      ];

      this.gridOptions.merge.push({ index: 1, field: 'jobManageNo' });
      this.gridOptions.merge.push({ index: 2, field: 'jobNm' });
    },
    getList() {
      this.$http.url = this.$format(this.searchUrl, this.popupParam.jobNo);
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          // this.gridOptions.data = this.$_.clone(_result.data);
          this.YAuiGrid.setGridData(_result.data);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    closePopup(data) {
      this.$emit('closePopup', data);
    },
    tableLinkAccidentTitleClicked(header, data) {
      this.openPopup(data);
    },
    openPopup(data) {
      this.popupOptions.target = () =>
        import(`${'@/pages/rsa/rsamgmt2/planmgmtResultDetail.vue'}`);

      this.popupOptions.width = '90%';
      this.popupOptions.visible = true;
      this.popupOptions.title = 'L0000005863'; // '위험성평가 결과 등록';
      this.popupOptions.param = {
        assessRsltNo: data.assessRsltNo,
        assessPlanNo: data.assessPlanNo,
      };

      this.popupOptions.closeCallback = this.closePopup;
    },
  },
};
</script>
