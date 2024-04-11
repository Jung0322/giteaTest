<!--
  목적 : 등록/접수/조치결과 - 조사결과
  Detail : 조사결과
  *
  examples: 
  *
  -->
<template>
  <b-container fluid>
    <!-- 등록 -->
    <b-row>
      <b-col sm="12">
        <!-- 조사결과 테이블 -->
        <b-row>
          <!--<b-col sm="12">
            <b-col sm="12" class="px-0">
              <div slot="buttonGroup" class="float-right mb-1">
                !-- 추가 --
                <y-btn
                  v-if="!disabled && editable"
                  title="L0000002892"
                  color="blue"
                  :showLoading="false"
                  @btnClicked="btnInAdd"
                />
                <-- 삭제 --
                <y-btn
                  v-if="!disabled && editable && industrialSafetyHealthCommittee.inMgtCommitteePsn.length > 0"
                  title="L0000001495"
                  color="red"
                  :showLoading="false"
                  @btnClicked="btnInDelete"
                />
              </div>
              !-- 사내 참석자 목록 --
              <y-data-table
                ref="dataTableIn"
                :height="inGridOptions.height"
                :headers="inGridOptions.header"
                :items="industrialSafetyHealthCommittee.inMgtCommitteePsn"
                :editable="!disabled && editable"
                v-model="inSelectedValue"
                label="L0000001408"
              >
                <el-table-column
                  v-if="!disabled && editable"
                  type="selection"
                  slot="selection"
                  align="center"
                  width="55"
                ></el-table-column>
                !-- 사인 --
                <el-table-column
                  v-if="industrialSafetyHealthCommittee.progressStepCd !== 'CMS01'"
                  slot="tag"
                  align="center"
                  width="100px"
                  :label="$comm.getLangSpecInfoLabel('L0000001484')"
                ></el-table-column>
              </y-data-table>
            </b-col>
          </b-col>-->
          <!-- 사내 참석자 목록 -->
          <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <y-auigrid
                ref="yAuiGrid1"
                :editable="!this.disabled && this.editable"
                :name="inGridOptions.name"
                :headers="inGridOptions.header"
                :btns="inGridOptions.btns"
                :height="inGridOptions.height"
                :items="industrialSafetyHealthCommittee.inMgtCommitteePsn"
                :label="this.$comm.getLangSpecInfoLabel('L0000001408')"
                :useExcelExport="false"
                :enableSorting="true"
                :showGridSetSave="true"
                :showRowCheckColumn="true"
                @btnInAdd="btnInAdd"
                @btnInDelete="btnInDelete"
                @cellEditEnd="cellEditEndHandler"
              />
          </b-col>
        </b-row>
        <b-row class="mt-3">
          <!--<b-col sm="12">
            <b-col sm="12" class="px-0">
              <div slot="buttonGroup" class="float-right mb-1">
                !-- 추가 --
                <y-btn
                  v-if="!disabled && editable"
                  title="L0000002892"
                  color="blue"
                  :showLoading="false"
                  @btnClicked="btnOutAdd"
                />
                !-- 삭제 --
                <y-btn
                  v-if="!disabled && editable && industrialSafetyHealthCommittee.outMgtCommitteePsn.length > 0"
                  title="L0000001495"
                  color="red"
                  :showLoading="false"
                  @btnClicked="btnOutDelete"
                />
              </div>
              !-- 외부 참석자 목록 --
              <y-data-table
                ref="dataTableIn"
                :height="outGridOptions.height"
                :headers="outGridOptions.header"
                :items="industrialSafetyHealthCommittee.outMgtCommitteePsn"
                :editable="!disabled && editable"
                v-model="outSelectedValue"
                label="L0000002047"
              >
                <el-table-column
                  v-if="!disabled && editable"
                  type="selection"
                  slot="selection"
                  align="center"
                  width="55"
                ></el-table-column>
                <-- 사인 --
                <el-table-column
                  v-if="industrialSafetyHealthCommittee.progressStepCd !== 'CMS01'"
                  slot="tag"
                  align="center"
                  width="100px"
                  :label="$comm.getLangSpecInfoLabel('L0000001484')"
                ></el-table-column>
              </y-data-table>
            </b-col>
          </b-col>-->
          <!-- 외부 참석자 목록 -->
          <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <y-auigrid
                ref="yAuiGrid2"
                :editable="!this.disabled && this.editable"
                :name="outGridOptions.name"
                :headers="outGridOptions.header"
                :btns="outGridOptions.btns"
                :height="outGridOptions.height"
                :items="industrialSafetyHealthCommittee.outMgtCommitteePsn"
                :label="this.$comm.getLangSpecInfoLabel('L0000002047')"
                :useExcelExport="false"
                :enableSorting="true"
                :showGridSetSave="true"
                :showRowCheckColumn="true"
                @btnOutAdd="btnOutAdd"
                @btnOutDelete="btnOutDelete"
                @cellEditEnd="cellEditEndHandler"
              />
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';
export default {
  /* attributes: name, components, props, data */
  name: 'attendants',
  props: {
    industrialSafetyHealthCommittee: {
      type: Object,
      default() {
        return {
          // col0: 0,
          committeeConfNo: 0,
          progressStepCd: null,
          inMgtCommitteePsn: [],
          outMgtCommitteePsn: [],
        }
      },
    },
    editable: false,
    disabled: false,
  },
  data() {
    return {
      inGridOptions: {
        header: [],
        height: '400',
      },
      outGridOptions: {
        header: [],
        height: '400',
      },
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '60%',
        top: '100px',
        param: {},
        closeCallback: null,
      },
      inSelectedValue: [],
      outSelectedValue: [],
      YAuiGrid1: null,
      YAuiGrid2: null,
    }
  },
  watch: {
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    this.YAuiGrid1 = this.$refs.yAuiGrid1;
    this.YAuiGrid2 = this.$refs.yAuiGrid2;
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.inGridOptions.header = [
        { /* 부서 */
          headerText: this.$comm.getLangSpecInfoLabel('L0000001287'),
          dataField: 'deptNm',
          width: '150',
          style: 'center-align',
          editable: false,
        },
        { /* 성명 */
          headerText: this.$comm.getLangSpecInfoLabel('L0000001630'),
          dataField: 'userNm',
          width: '150',
          style: 'center-align',
          editable: false,
        },
        {  /* 직책 */
          headerText: this.$comm.getLangSpecInfoLabel('L0000002772'),
          dataField: 'dutyNm',
          width: '150',
          style: 'center-align',
          editable: false,
        },
        { /* 비고 */
          headerText: this.$comm.getLangSpecInfoLabel('L0000001360'),
          dataField: 'remark',
          width: '250',
          style: 'left-align',
          editRenderer: {
            type: 'InputEditRenderer', 
            maxlength: 1000,
          }, 
        },
        {  /* 사인 */
          headerText: this.$comm.getLangSpecInfoLabel('L0000001484'),
          width: '110',
          style: 'center-align',
          editable: false,
          visible: this.industrialSafetyHealthCommittee.progressStepCd !== 'CMS01'
        },
      ];
      this.inGridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002892'), // 추가
          color: 'blue',
          btnClicked: 'btnInAdd',
          visible: !this.disabled && this.editable
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001495'), // 삭제
          color: 'red',
          btnClicked: 'btnInDelete',
          visible: !this.disabled && this.editable && this.industrialSafetyHealthCommittee.inMgtCommitteePsn.length > 0
        },
      ];

      this.outGridOptions.header = [
        { /* 소속(*) */
          headerText: this.$comm.getLangSpecInfoLabel('L0000001663'),
          dataField: 'deptNm',
          width: '150',
          style: 'center-align',
          editable: false,
        },
        { /* 성명(*) */
          headerText: this.$comm.getLangSpecInfoLabel('L0000001631'),
          dataField: 'userNm',
          width: '150',
          style: 'left-align',
          editRenderer: {
            type: 'InputEditRenderer', 
            maxlength: 25,
          },
        },
        { /* 직책 */
          headerText: this.$comm.getLangSpecInfoLabel('L0000002772'),
          dataField: 'dutyNm',
          width: '150',
          style: 'left-align',
          editRenderer: {
            type: 'InputEditRenderer', 
            maxlength: 50,
          }, 
        },
        { /* 비고 */
          headerText: this.$comm.getLangSpecInfoLabel('L0000001360'),
          dataField: 'remark',
          width: '250',
          style: 'left-align',
          editRenderer: {
            type: 'InputEditRenderer', 
            maxlength: 1000,
          }, 
        },
        {  /* 사인 */
          headerText: this.$comm.getLangSpecInfoLabel('L0000001484'),
          width: '110',
          style: 'center-align',
          editable: false,
          visible: this.industrialSafetyHealthCommittee.progressStepCd !== 'CMS01'
        },
      ];
      this.outGridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002892'), // 추가
          color: 'blue',
          btnClicked: 'btnOutAdd',
          visible: !this.disabled && this.editable
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001495'), // 삭제
          color: 'red',
          btnClicked: 'btnOutDelete',
          visible: !this.disabled && this.editable && this.industrialSafetyHealthCommittee.outMgtCommitteePsn.length > 0
        },
      ];
    },
    btnInAdd() {
      this.popupOptions.target = () => import(`${'@/pages/manage/user/userSearch.vue'}`);
      this.popupOptions.param = {
        multiple: true,
        plantCd: this.$store.getters.plantCd,
        user: this.industrialSafetyHealthCommittee.inMgtCommitteePsn,
      };
      this.popupOptions.title = 'L0000001466'; /* 사용자검색 */
      this.popupOptions.visible = true;
      this.popupOptions.width = '60%';
      this.popupOptions.top = '100px';
      this.popupOptions.closeCallback = this.closePersonPopup;
    },
    closePersonPopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      if (data.users) {
        // 추가
        this.$_.forEach(data.users, item => {
          if (
            this.$_.findIndex(this.industrialSafetyHealthCommittee.inMgtCommitteePsn, {
              userId: item.userId,
            }) === -1
          ) {
            this.industrialSafetyHealthCommittee.inMgtCommitteePsn.splice(0, 0, {
              mgtCommitteePsnNo: 0,
              committeeConfNo: 0,
              psnClsCd: 'CLS01', // 내부
              userId: item.userId,
              userNm: item.userNm,
              deptCd: item.deptCd,
              vendorCd: null,
              deptNm: item.deptNm,
              dutyNm: item.dutyNm,
              remark: null,
              signImg: null,
              signCfmYn: 'N',
              signRegDt: null,
            });
          }
        });
      }
    },
    btnInDelete() {
      if (this.YAuiGrid1.getCheckedRowItems().length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', /* 안내 */
          message: 'M0000000911', /* 삭제 할 데이터를 선택하세요. */
          type: 'warning', // success / info / warning / error
        });
      } else {
        let gridData = this.YAuiGrid1.getGridData();
        const selectedRows = this.YAuiGrid1.getCheckedRowItems().map(
          (row) => row.item
        );
        this.$_.forEach(selectedRows, (item) => {
          gridData = this.$_.reject(gridData, item);
        });

        this.inGridOptions.data = gridData;
        this.YAuiGrid1.setGridData(gridData);
        this.cellEditEndHandler();
      }
    },
    btnOutAdd() {
      this.popupOptions.target = () => import(`${'@/pages/vendor/baseInfo/vendorMaster.vue'}`);
      this.popupOptions.title = 'L0000003848'; /* 협력업체검색 */
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        popupMode: true,
        multiSelect: false,
        // vendors:
        // vendorTypeCd:
        plantCd: this.industrialSafetyHealthCommittee.plantCd,
      };
      this.popupOptions.closeCallback = this.closeVendorPopup;
    },
    closeVendorPopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      if (data.data !== 'C') {
        this.industrialSafetyHealthCommittee.outMgtCommitteePsn.splice(0, 0, {
          rowId: uuidv4(),
          mgtCommitteePsnNo: 0,
          committeeConfNo: 0,
          psnClsCd: 'CLS02', // 외부
          userId: null,
          userNm: null,
          deptCd: null,
          vendorCd: data.data.vendorCd,
          deptNm: data.data.vendorNm,
          dutyNm: null,
          remark: null,
          signImg: null,
          signCfmYn: 'N',
          signRegDt: null,
        });
      }
    },
    btnOutDelete() {
      if (this.YAuiGrid2.getCheckedRowItems().length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', /* 안내 */
          message: 'M0000000911', /* 삭제 할 데이터를 선택하세요. */
          type: 'warning', // success / info / warning / error
        });
      } else {
        /* this.$_.forEach(this.outSelectedValue, item => {
          this.industrialSafetyHealthCommittee.outMgtCommitteePsn.splice(
            this.$_.findIndex(this.industrialSafetyHealthCommittee.outMgtCommitteePsn, { rowId: item.rowId }),
            1
          );
        }); */
        let gridData = this.YAuiGrid2.getGridData();
        const selectedRows = this.YAuiGrid2.getCheckedRowItems().map(
          (row) => row.item
        );
        this.$_.forEach(selectedRows, (item) => {
          gridData = this.$_.reject(gridData, item);
        });

        this.outGridOptions.data = gridData;
        this.YAuiGrid2.setGridData(gridData);
        this.cellEditEndHandler();
      }
    },
    cellEditEndHandler() {
      this.industrialSafetyHealthCommittee.inMgtCommitteePsn = this.YAuiGrid1.getGridData();
      this.industrialSafetyHealthCommittee.outMgtCommitteePsn = this.YAuiGrid2.getGridData();
    },
  },
};
</script>
