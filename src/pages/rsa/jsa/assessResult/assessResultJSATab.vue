<!--
  목적 : 위험성평가 JSA 결과 목록
  Detail : 위험성평가 JSA 결과 목록 Tab
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 등록 -->
    <!-- <b-row class="mt-1">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
             위험등록부 등록 
            <y-btn
              v-if="updateMod&&editable"
              :action-url="insertUrl"
              :param="checkJobRiskBookList"
              :is-submit="isInsert"
              title="L0000002127"
              color="orange"
              action-type="POST"
              beforeSubmit="beforeInsert"
              @beforeInsert="beforeInsert"
              @btnClicked="btnInsertClickedCallback"
              @btnClickedErrorCallback="btnClickedErrorCallback"
            />
          </div>
           평가대상 JSA 목록 
          <y-data-table
            ref="dataTable"
            label="L0000003076"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :checkItemData="checkItemData"
            checkKey="jobRiskBookYn"
            v-model="checkJobRiskBookList"
            :popMode="true"
          >
            <el-table-column
              :selectable="editableSelectedCheck"
              type="selection"
              slot="selection"
              align="center"
              width="50"
            ></el-table-column>
          </y-data-table>
        </b-col>
      </b-col>
    </b-row> -->
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000003076')"
          :useExcelExport="false"
          :enableCellMerge="true"
          :enableSorting="true"
          :showRowCheckColumn="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"  
          @insertItem="insertItem"
        />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  /* attributes: name, components, props, data */
  name: 'assess-JSA-tab',
  props: {
    assess: {
      assessPlanNo: 0,
      deptCd: '',
      assessNm: '',
      paneName: '',
      processCd: '',
      assessStatus: '',
      createUserId: '',
      updateUserId: '',
    },
    disabled: false,
  },
  data() {
    return {
      gridOptions: {
        name: 'assessResultJSATab',
        btns: [],
        header: [],
        data: [],
        height: 400,
      },
      YAuiGrid: null,
      checkItemData: [],
      jobRiskBookYn: '',
      searchUrl: '',
      insertUrl: '',
      isInsert: false,
      updateMod: false,
      editable: true,
      checkJobRiskBookList: [],
    };
  },
  watch: {
    assess: {
      handler: function(val, oldVal) {
        this.getList();
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
  updated() {},
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;

      // Url Setting
      this.searchUrl = selectConfig.rsa.assessResult.jsaList.url;
      this.insertUrl = transactionConfig.rsa.assessResult.insert.url;

      // GridHeader
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002134'), 
          dataField: 'jobRiskBookYn', 
          width: '10%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001287'), 
          dataField: 'deptNm', 
          width: '10%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000515'), 
          dataField: 'processNm', 
          width: '10%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002423'), 
          dataField: 'jobCd', 
          width: '10%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002389'), 
          dataField: 'jobNm', 
          width: '10%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002401'), 
          dataField: 'jobStepNo', 
          width: '10%', 
          style: 'left-align'
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002375'), 
          dataField: 'jobStepNm', 
          width: '10%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002181'), 
          dataField: 'pRiskHazardNm', 
          width: '10%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002179'), 
          dataField: 'riskHazardNm', 
          width: '10%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000273'), 
          children: [
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000001378'), 
              dataField: 'currentFrequencySize', 
              width: '5%', 
            }, 
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000000248'), 
              dataField: 'currentStrongSize', 
              width: '5%', 
            },
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000002121'), 
              dataField: 'currentRiskSize', 
              width: '5%', 
            }, 

          ],
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000254'), 
          dataField: 'improve', 
          width: '10%', 
        }, 
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000284'), 
          children: [
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000001378'), 
              dataField: 'afterFrequencySize', 
              width: '5%', 
            }, 
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000000248'), 
              dataField: 'afterStrongSize', 
              width: '5%', 
            }, 
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000002121'), 
              dataField: 'afterRiskSize', 
              width: '5%', 
            }, 
          ],
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003083'), 
          dataField: 'evalDesc', 
          width: '10%', 
        }, 
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003093'), 
          dataField: 'assessUserNm', 
          width: '10%', 
        }, 
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003092'), 
          dataField: 'assessDate', 
          width: '10%', 
        }, 
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002127'),
          color: 'orange',
          btnClicked: 'insertItem',
        },
      ]
      this.getList();
      if (this.assess.assessStatus === 'E' && !this.disabled) {
        this.updateMod = true;
      }
    },
    getList() {
      this.assess.searchFlag = 'R';
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.assess;
      this.$http.request(
        _result => {
          this.gridOptions.data = this.$_.clone(_result.data);
          this.YAuiGrid.setGridData(this.$_.clone(_result.data));
          var Indexes = this.$_.keys(
            this.$_.pickBy(_result.data, { jobRiskBookYn: 'Y' })
          );
          var i = 0;
          if (Indexes) {
            this.checkItemData = [];
            for (; i < Indexes.length; i++) {
              this.checkItemData.push(this.gridOptions.data[Indexes[i]]);
            }
          }
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    editableSelectedCheck(row, index) {
      if (!this.editable) return false;
      else if (row.jobRiskBookYn === 'Y') return false;
      else return true;
    },
    insertItem() {
      let checkInsertData = this.YAuiGrid.getCheckedRowItems();
      if (!checkInsertData || checkInsertData.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: 'M0000000651', // 선택된 평가대상 JSA가 존재하지 않습니다.
          type: 'warning', // success / info / warning / error
        });
        return;
      }
      this.checkJobRiskBookList = [];
      this.$_.forEach(checkInsertData, item => {
        this.checkJobRiskBookList.push(item.item)
      });

      this.beforeInsert();

    },
    beforeInsert(data) {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321',
        message: 'M0000000011', // 저장하시겠습니까?
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          this.$_.forEach(this.checkJobRiskBookList, row => {
            row.createUserId = this.$store.getters.token;
            row.updateUserId = this.$store.getters.token;
          });
          this.$http.url = this.insertUrl;
          this.$http.type = 'POST';
          this.$http.param = this.checkJobRiskBookList;
          this.$http.request(
            (__result) => {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395', // '안내',
                message: 'M0000000006', // '저장되었습니다.',
                type: 'success',
              });
              this.getList();
            },
            (_error) => {
              window.getApp.$emit('APP_REQUEST_ERROR', _error);
            }
          );
          this.isInsert = true;
        },
        cancelCallback: () => {},
      });
    },
    btnInsertClickedCallback() {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395',
        message: 'M0000000006',
        type: 'success', // success / info / warning / error
      });
      this.isInsert = false;
      this.getList();
    },
    btnClickedErrorCallback(_result) {
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
  },
};
</script>

<style>
</style>
