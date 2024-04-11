<!--
  목적 : 검진 계획 감사팀
  Detail : 검진계획 감사팀/등록/수정 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row>
      <b-col sm="12">
        <!-- PSM 감사팀 목록 -->
        <y-auigrid
          ref="yAuiGrid"
          :editable="!disabled && editable"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :items="gridOptions.data"
          :label="this.$comm.getLangSpecInfoLabel('L0000000147')"
          :showRowCheckColumn="editable && !disabled"
          @cellEditEnd="cellEditEndHandler"
          @openPopup="openPopup"
          @userDelete="userDelete"
          @btnClickedError="btnClickedErrorCallback"
        />
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>
<script>
import selectConfig from '@/js/selectConfig';

export default {
  name: 'audit-user-plan',
  props: {
    disabled: {
      type: Boolean,
      default: function () {
        return false;
      },
    },
    safPsmAuditRslt: {
      type: Object,
      default: function () {
        return {
          auditRsltNo: 0,
          safPsmAuditRsltUsers: [], // 감사결과 감사원
          deleteSafPsmAuditRsltUsers: [], // 삭제할 감사결과 감사원
        };
      },
    },
  },
  data() {
    return {
      YAuiGrid: null,
      gridOptions: {
        header: [],
        data: [],
        height: '320',
        btns: [],
      },
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '90%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      editable: false,
      searchUrl: '',
      searchParam: {
        plantCd: '',
        year: '',
        useYn: 'Y',
      },
    };
  },
  watch: {
    'safPsmAuditRslt.auditRsltNo': {
      handler: function (val, oldVal) {
        this.getList(); // 감사팀
      },
      deep: true,
    },
    'safPsmAuditRslt.auditYear': {
      handler: function (val, oldVal) {
        this.getList(); // 감사팀
      },
      deep: true,
    },
    'safPsmAuditRslt.plantCd': {
      handler: function (val, oldVal) {
        this.getList(); // 감사팀
      },
      deep: true,
    },
    'gridOptions.data': {
      handler: function (val, oldVal) {
        let deleteData = this.$_.clone(
          this.safPsmAuditRslt.safPsmAuditRsltUsers
        );
        this.$_.forEach(this.safPsmAuditRslt.safPsmAuditRsltUsers, (item) => {
          if (item.auditUserNo) {
            let index = this.$_.findIndex(this.gridOptions.data, {
              auditUserNo: item.auditUserNo,
            });
            if (index === -1) {
              deleteData = this.$_.reject(deleteData, {
                auditUserNo: item.auditUserNo,
              });
            }
          } else {
            let index = this.$_.findIndex(this.gridOptions.data, {
              tempId: item.tempId,
            });
            if (index === -1) {
              deleteData = this.$_.reject(deleteData, {
                tempId: item.tempId,
              });
            }
          }
        });
        this.safPsmAuditRslt.safPsmAuditRsltUsers = deleteData;

        this.$_.forEach(this.gridOptions.data, (item) => {
          if (item.auditUserNo) {
            let index = this.$_.findIndex(
              this.safPsmAuditRslt.safPsmAuditRsltUsers,
              {
                auditUserNo: item.auditUserNo,
              }
            );
            if (index > -1) {
              this.safPsmAuditRslt.safPsmAuditRsltUsers[index] = item;
            } else {
              this.safPsmAuditRslt.safPsmAuditRsltUsers.push(item);
            }
          } else {
            let index = this.$_.findIndex(
              this.safPsmAuditRslt.safPsmAuditRsltUsers,
              {
                tempId: item.tempId,
              }
            );
            if (index > -1) {
              this.safPsmAuditRslt.safPsmAuditRsltUsers[index] = item;
            } else {
              this.safPsmAuditRslt.safPsmAuditRsltUsers.push(item);
            }
          }
        });
      },
      deep: true,
    },
    disabled: {
      handler: function (val, oldVal) {
        this.gridOptions.btns[0].visible = !this.disabled;
        this.gridOptions.btns[1].visible = !this.disabled;
      },
      deep: true,
    },
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;

    this.getList();
  },
  activated() {
    this.resizeGrid();
  },
  beforeDestroy() {},
  /** methods **/
  methods: {
    init() {
      // URL 셋팅
      this.searchUrl = selectConfig.saf.auditUser.list.url;
      this.editable = this.$route.meta.editable;

      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000686'),
          dataField: 'auditTypeNm',
          width: '11%',
          editable: false,
        } /* 구분 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001662'),
          dataField: 'deptNm',
          width: '11%',
          editable: false,
        } /* 소속 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002769'),
          dataField: 'dutyNm',
          width: '11%',
          editable: false,
        } /* 직위 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001630'),
          dataField: 'userNm',
          width: '11%',
          editable: false,
        } /* 성명 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002491'),
          dataField: 'majorDesc',
          width: '11%',
          editable: false,
        } /* 전공 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000458'),
          dataField: 'careerDesc',
          width: '11%',
          editable: false,
        } /* 경력 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000665'),
          dataField: 'eduDesc',
          width: '11%',
          editable: false,
        } /* 교육이수 현황 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002304'),
          dataField: 'certiDesc',
          width: '11%',
          editable: false,
        } /* 자격증 보유현황 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001360'),
          dataField: 'remark',
          width: '12%',
          style: 'left-align',
          editRenderer: {
            type: 'InputEditRenderer',
            maxlength: 200,
          },
        } /* 비고 */,
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002892'),
          color: 'orange',
          btnClicked: 'openPopup',
          btnClickedError: 'btnClickedError',
          visible: true,
        }, // 추가
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001495'),
          color: 'red',
          btnClicked: 'userDelete',
          btnClickedError: 'btnClickedError',
          visible: true,
        }, // 삭제
      ];
    },
    // 검진 계획 그리드
    getList() {
      if (this.safPsmAuditRslt.auditRsltNo > 0) {
        this.gridOptions.data = [];
        if (
          this.safPsmAuditRslt.safPsmAuditRsltUsers &&
          this.safPsmAuditRslt.safPsmAuditRsltUsers.length > 0
        ) {
          this.gridOptions.data = this.safPsmAuditRslt.safPsmAuditRsltUsers;
        }
      } else {
        this.searchParam.plantCd = this.safPsmAuditRslt.plantCd;
        this.searchParam.year = this.safPsmAuditRslt.auditYear;
        this.searchParam.useYn = 'Y';
        this.$http.url = this.searchUrl;
        this.$http.type = 'GET';
        this.$http.param = this.searchParam;
        this.$http.request(
          (_result) => {
            if (this.safPsmAuditRslt.auditRsltNo === 0) {
              this.gridOptions.data = _result.data;
            }
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      }
    },
    openPopup() {
      this.popupOptions.target = () =>
        import(`${'@/pages/saf/psm/auditUser.vue'}`);
      this.popupOptions.param = {
        isPopup: true,
      };
      this.popupOptions.title = 'L0000000145'; /* PSM 감사원 목록 */
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
    },
    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      if (data !== 'CLOSE') {
        this.$_.forEach(data, (item) => {
          if (
            this.$_.findIndex(this.gridOptions.data, {
              auditUserNo: item.auditUserNo,
            }) === -1
          ) {
            this.gridOptions.data.push(item);
          }
        });
      }
    },
    userDelete() {
      const selectedRows = this.YAuiGrid.getCheckedRowItemsAll();
      if (selectedRows.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'M0000000057' /* 삭제할 항목을 선택해주세요. */,
          type: 'warning',
        });
        return;
      } else {
        if (!this.safPsmAuditRslt.deleteSafPsmAuditRsltUsers) {
          this.safPsmAuditRslt.deleteSafPsmAuditRsltUsers = [];
        }
        this.$_.forEach(selectedRows, (item) => {
          if (item.tempId) {
            this.gridOptions.data.splice(
              this.$_.findIndex(this.gridOptions.data, { tempId: item.tempId }),
              1
            );
          } else {
            this.safPsmAuditRslt.deleteSafPsmAuditRsltUsers.push(item);
            this.gridOptions.data.splice(
              this.$_.findIndex(this.gridOptions.data, {
                auditUserNo: item.auditUserNo,
              }),
              1
            );
          }
        });
      }
    },
    cellEditEndHandler(event) {
      this.gridOptions.data[event.rowIndex][event.dataField] = event.value;
    },
    /** Button Event **/
    // 버튼 에러 처리
    btnClickedErrorCallback(_result) {
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    /** /Button Event **/
    resizeGrid() {
      this.YAuiGrid.resize(null, this.gridOptions.height);
    },
  },
};
</script>
