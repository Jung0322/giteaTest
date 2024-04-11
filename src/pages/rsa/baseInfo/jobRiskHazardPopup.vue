<!--
  목적 : 위험성평가 > 기준정보 > 작업 관리 > 유해위험요인 탭 > 신규등록 팝업
  작성자 : kga
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
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 저장 -->
              <y-btn
                v-if="editable"
                :action-url="insertUrl"
                :param="addSelectedRow"
                :is-submit="isInsert"
                title="L0000002474"
                color="blue"
                action-type="POST"
                beforeSubmit="beforeInsert"
                @beforeInsert="beforeInsert"
                @btnClicked="btnInsertClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 닫기 -->
              <y-btn title="L0000000881" @btnClicked="btnClosePopup" />
            </div>
          </b-col>
        </b-row>
      </b-col>
    </b-row>

    <!-- 설비 grid -->
    <!-- <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <y-tree-data-table
            :headers="gridOptions.header"
            :items="menuTreeDataTable"
            :height="450"
            :checkableLevel="true"
            check-name="checkNm"
            expand-column-name="riskHazardNm"
            expand-column-width="350"
            data-key="riskHazardNo"
            parent-key="priskHazardNo"
            @rowClicked="rowClicked"
            @checkChange="checkChange"
          >
          </y-tree-data-table>
        </b-col>
      </b-col>
    </b-row> -->
    <!-- 유해위험요인 목록 -->
    <y-auigrid
      ref="yAuiGrid"
      :name="gridOptions.name"
      :headers="gridOptions.header"
      :btns="gridOptions.btns"
      :height="gridOptions.height"
      :label="this.$comm.getLangSpecInfoLabel('L0000002180')"
      :useExcelExport="true"
      :useContextMenu="true"
      :enableRightDownFocus="true"
      :showGridCtrl="true"
      :enableSorting="true"
      :showGridSetSave="true"
      :showRowCheckColumn="true"
      @getMenuTreeDatatableBases="getMenuTreeDatatableBases"
      @cellClick="rowClicked"
    />
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
import YTree from '@/components/YTree';
import arrayToTree from 'array-to-tree';
import YTreeDataTable from '@/components/YTreeDataTable';
export default {
  name: 'job-risk-hazard-popup',
  components: {
    YTreeDataTable,
  },
  props: {
    popupParam: {
      type: Object,
      default: {
        jobStepId: 0,
        // jobStepNo: 0,
        addSelectedRow: {},
      },
    },
  },
  data() {
    return {
      menu: {
        upMenuId: '',
        upMenuNm: '',
      },
      gridOptions: {
        header: [],
        data: [],
        height: '500',
      },
      editable: false,
      // jobId: 0,
      jobRiskHazards: [],
      menuTree: [],
      menuTreeDataTable: [],
      searchUrl: '',
      insertUrl: '',
      isInsert: false,
      selRows: 0,
      YAuiGrid: null,
      addSelectedRow: [],
    };
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
  },
  /** methods **/
  methods: {
    init() {
      // URL 셋팅
      this.searchUrl = selectConfig.rsa.jobRiskHazard.listall.url;
      this.insertUrl = transactionConfig.rsa.jobRiskHazard.insert.url;
      this.editable = this.$route.meta.editable;
      // this.jobId = this.popupParam.jobId;
      this.addSelectedRow = this.$_.clone(this.popupParam.addSelectedRow);
      this.getMenuTreeDatatableBases();
      this.gridOptions.header = [
        {
          headerText: '',
          dataField: 'riskHazardNm',
          width: '200px',
          style: 'center',
        },
      ];
    },
    // 메뉴 tree 기초 정보 조회
    getMenuTreeDatatableBases() {
      this.$http.url = this.searchUrl;
      this.$http.param = {
        jobStepId: this.popupParam.jobStepId,
      };
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          console.log('result', _result.data);
          this.YAuiGrid.setGridData(this.convertTree(_result.data));
        },
        (_error) => {
          window.getApp.emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    // 그리드 row click 이벤트
    rowClicked(_row) {
      var row = _row;
      var key = '';
      for (key in this.menu) {
        if (_row.hasOwnProperty(key)) this.menu[key] = _row[key];
        if (_row.hasOwnProperty('parent')) {
          this.menu.upMenuId = _row.parent.menuId;
          this.menu.upMenuNm = _row.parent.menuNm;
        } else {
          this.menu.upMenuId = null;
          this.menu.upMenuNm = null;
        }
      }
    },
    // 메뉴 트리용 기초 정보를 Tree 메뉴로 변환
    convertTree(_treeBases) {
      if (!_treeBases || _treeBases.length <= 0) return null;
      var tree = arrayToTree(_treeBases, {
        parentProperty: 'priskHazardNo',
        customID: 'riskHazardNo',
      });
      return tree;
    },

    /** validation checking **/
    beforeInsert() {
      this.addSelectedRow = this.YAuiGrid.getCheckedRowItemsAll();
      if (this.addSelectedRow.length > 0) {
        window.getApp.$emit('CONFIRM', {
          title: 'L0000003321', // 확인
          message: 'M0000000011', // 저장하시겠습니까?
          type: 'info',
          // 확인 callback 함수
          confirmCallback: () => {
            this.$_.forEach(this.addSelectedRow, (row) => {
              row.jobStepId = this.popupParam.jobStepId;
              row.createUserId = this.$store.getters.token;
              row.updateUserId = this.$store.getters.token;
            });
            this.isInsert = true;
          },
          cancelCallback: () => {
            this.isInsert = false;
          },
        });
      } else {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000000660', // 유해 위험요인을 선택해주세요.
          type: 'warning',
        });
      }
    },
    checkChange(data) {
      if (this.jobRiskHazards.length === 0) {
        this.jobRiskHazards = [];
      }
      if (data.val === 'N') {
        this.jobRiskHazards.splice(
          this.$_.indexOf(
            this.$_.map(this.jobRiskHazards, 'riskHazardNo'),
            data.row.riskHazardNo
          ),
          1
        );
      } else {
        if (
          this.$_.indexOf(
            this.$_.map(this.jobRiskHazards, 'riskHazardNo'),
            data.row.riskHazardNo
          ) > -1
        ) {
          return;
        }

        this.jobRiskHazards.push({
          jobStepId: this.popupParam.jobStepId,
          riskHazardNo: data.row.riskHazardNo,
        });
      }
    },
    /** /validation checking **/

    /** Button Event **/
    // 팝업 닫기
    btnClosePopup() {
      // 부모창에 값 전달
      this.$emit('closePopup', { addSelectedRow: this.addSelectedRow });
    },
    // 저장
    btnInsertClickedCallback(_result) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // 안내
        message: 'M0000000006', // 저장되었습니다.
        type: 'success',
      });
      this.btnClosePopup();
      this.isInsert = false;
    },
    // 버튼 에러 처리
    btnClickedErrorCallback(_result) {
      this.isInsert = false;
      window.getApp.emit('APP_REQUEST_ERROR', _result);
    },
    /** /Button Event **/
  },
};
</script>
