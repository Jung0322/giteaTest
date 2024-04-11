<!--
  목적 : psm 감사항목 관리
  Detail : psm 감사항목 검색 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row>
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
            <!-- 추가 -->
            <y-btn
              v-if="editable && !disabled"
              title="L0000002892"
              color="orange"
              @btnClicked="openPopup"
            />
            <!-- 삭제 -->
            <y-btn
              v-if="editable && !disabled"
              title="L0000001495"
              color="red"
              @btnClicked="itemDelete"
            />
          </div>
          <!-- 감사기준 목록 -->
          <y-data-table
            label="L0000000230"
            ref="planDataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :editable="!disabled && editable"
            v-model="selectedValue"
            :print="true"
            @selectedRow="selectedRow"
          >
            <div v-if="editable && !disabled" slot="selection">
              <el-table-column align="center" width="55" type="selection" />
            </div>
          </y-data-table>
        </b-col>
      </b-col>
    </b-row>
    <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <!-- 감사항목 목록 -->
          <y-data-table
            label="L0000000241"
            ref="dataTableItem"
            :height="gridOptions.itemHeight"
            :headers="gridOptions.itemHeader"
            :items="gridOptions.itemData"
          ></y-data-table>
        </b-col>
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>
<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  name: 'audit-item',
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
          plantCd: '',
          safPsmAuditRsltStds: [], // 감사결과_기준
          deleteSafPsmAuditRsltStds: [], // 삭제할 감사결과_기준
          files: [],
        };
      },
    },
  },
  data() {
    return {
      gridOptions: {
        header: [],
        data: [],
        height: '320',
        itemHeader: [],
        itemData: [],
        itemHeight: '320',
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
      searchItemInfoUrl: '',
      selectedValue: [],
      index: -1,
      searchParam: {
        plantCd: '',
        useYn: 'Y',
      },
    };
  },
  watch: {
    'safPsmAuditRslt.auditRsltNo': {
      handler: function (val, oldVal) {
        this.getList(); // 감사범위
      },
      deep: true,
    },
    'gridOptions.data': {
      handler: function (val, oldVal) {
        let deleteData = this.$_.clone(
          this.safPsmAuditRslt.safPsmAuditRsltStds
        );
        this.$_.forEach(this.safPsmAuditRslt.safPsmAuditRsltStds, (item) => {
          if (item.auditStdNo) {
            let index = this.$_.findIndex(this.gridOptions.data, {
              auditStdNo: item.auditStdNo,
            });
            if (index === -1) {
              deleteData = this.$_.reject(deleteData, {
                auditStdNo: item.auditStdNo,
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
        this.safPsmAuditRslt.safPsmAuditRsltStds = deleteData;

        this.$_.forEach(this.gridOptions.data, (item) => {
          if (item.auditStdNo) {
            let index = this.$_.findIndex(
              this.safPsmAuditRslt.safPsmAuditRsltStds,
              {
                auditStdNo: item.auditStdNo,
              }
            );
            if (index > -1) {
              this.safPsmAuditRslt.safPsmAuditRsltStds[index] = item;
            } else {
              this.safPsmAuditRslt.safPsmAuditRsltStds.push(item);
            }
          } else {
            let index = this.$_.findIndex(
              this.safPsmAuditRslt.safPsmAuditRsltStds,
              {
                tempId: item.tempId,
              }
            );
            if (index > -1) {
              this.safPsmAuditRslt.safPsmAuditRsltStds[index] = item;
            } else {
              this.safPsmAuditRslt.safPsmAuditRsltStds.push(item);
            }
          }
        });
        let files = [];
        let data = this.$refs.planDataTable.getSaveFiles();
        this.safPsmAuditRslt.files = this.$_.concat(files, data.files);
      },
      deep: true,
    },
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {},
  /** methods **/
  methods: {
    init() {
      // URL 셋팅
      this.searchUrl = selectConfig.saf.auditItem.list.url;
      this.searchItemInfoUrl = selectConfig.saf.auditItemInfo.list.url;
      this.editable = this.$route.meta.editable;

      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          text: 'L0000000233', // 감사범위
          name: 'auditStdNm',
          width: '120px',
          align: 'center',
        },
        {
          text: 'L0000000229', // 감사기준
          name: 'auditStdDesc',
          width: '200px',
        },
        {
          text: 'L0000002842', // 첨부자료
          name: 'files',
          width: '200px',
          type: 'attach',
          keyText: 'files',
          disabled: true,
        },
      ];

      this.gridOptions.itemHeader = [
        {
          text: 'L0000000233', // 감사범위
          name: 'auditStdNm',
          width: '120px',
          align: 'center',
        },
        {
          text: 'L0000003783', // 감사항목
          name: 'auditItemNm',
          width: '350px',
        },
        {
          text: 'L0000001360', // 비고
          name: 'remark',
          width: '200px',
          align: 'center',
        },
      ];

      this.getList();
    },
    // 검진 계획 그리드
    getList() {
      if (this.safPsmAuditRslt.auditRsltNo > 0) {
        this.gridOptions.data = [];
        if (
          this.safPsmAuditRslt.safPsmAuditRsltStds &&
          this.safPsmAuditRslt.safPsmAuditRsltStds.length > 0
        ) {
          this.$_.forEach(this.safPsmAuditRslt.safPsmAuditRsltStds, (item) => {
            var date = new Date();

            this.gridOptions.data.push({
              auditRsltNo: item.auditRsltNo,
              auditRsltDeptStdNo: item.auditRsltDeptStdNo,
              auditStdDesc: item.auditStdDesc,
              auditStdNm: item.auditStdNm,
              auditStdNo: item.auditStdNo,
              auditorDesc: item.auditorDesc,
              auditorUserId: item.auditorUserId,
              createDt: item.createDt,
              createUserId: item.createUserId,
              files: item.files ? item.files : [],
              reltFiles: item.reltFiles ? item.reltFiles : [],
              safPsmAuditRsltItems: item.safPsmAuditRsltItems,
              tempId: item.tempId
                ? item.tempId
                : item.auditStdNo + String(date.getTime()),
              updateDt: item.updateDt,
              updateUserId: item.updateUserId,
            });
          });
        }
      } else {
        this.searchParam.plantCd = this.safPsmAuditRslt.plantCd;
        this.searchParam.useYn = 'Y';
        this.$http.url = this.searchUrl;
        this.$http.type = 'GET';
        this.$http.param = this.searchParam;
        this.$http.request(
          (_result) => {
            this.$_.forEach(_result.data, (item) => {
              var date = new Date();
              this.gridOptions.data.push({
                auditRsltNo: item.auditRsltNo,
                auditRsltDeptStdNo: item.auditRsltDeptStdNo,
                auditStdDesc: item.auditStdDesc,
                auditStdNm: item.auditStdNm,
                auditStdNo: item.auditStdNo,
                auditorDesc: item.auditorDesc,
                auditorUserId: item.auditorUserId,
                createDt: item.createDt,
                createUserId: item.createUserId,
                files: item.files ? item.files : [],
                reltFiles: item.reltFiles ? item.reltFiles : [],
                safPsmAuditRsltItems: item.safPsmAuditRsltItems,
                tempId: item.tempId
                  ? item.tempId
                  : item.auditStdNo + String(date.getTime()),
                updateDt: item.updateDt,
                updateUserId: item.updateUserId,
              });
            });
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      }
    },
    /**
     * 수정 팝업 호출
     */
    // 그리드 row click 이벤트
    selectedRow(data) {
      this.$http.url = this.searchItemInfoUrl;
      this.$http.type = 'GET';
      this.$http.param = {
        auditStdNo: data.auditStdNo,
      };
      this.$http.request(
        (_result) => {
          this.gridOptions.itemData = _result.data;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /**
     * 등록 팝업  호출
     */
    openPopup(data) {
      this.popupOptions.target = () =>
        import(`${'@/pages/saf/psm/auditItem.vue'}`);
      this.popupOptions.title = 'L0000004677'; // PSM 감사항목
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        isPopup: true,
      };
      this.popupOptions.closeCallback = this.closePopup;
    },
    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      if (data !== 'CLOSE') {
        this.$_.forEach(data, (item) => {
          if (
            this.$_.findIndex(this.gridOptions.data, {
              auditStdNo: item.auditStdNo,
            }) === -1
          ) {
            let date = new Date();
            this.gridOptions.data.splice(0, 0, {
              auditItems: item.auditItems,
              auditStdDesc: item.auditStdDesc,
              auditStdNm: item.auditStdNm,
              auditStdNo: item.auditStdNo,
              chargeDeptCd: item.chargeDeptCd,
              chargeDeptNm: item.chargeDeptNm,
              convFactor: item.convFactor,
              createDt: item.createDt,
              createUserId: item.createUserId,
              deleteAuditItems: item.deleteAuditItems,
              plantCd: item.plantCd,
              plantNm: item.plantNm,
              remark: item.remark,
              updateDt: item.updateDt,
              updateUserId: item.updateUserId,
              useYn: item.useYn,
              tempId: item.auditStdNo + String(date.getTime()),
              files: item.files ? item.files : [],
            });
          }
        });
      }
    },
    itemDelete() {
      if (!this.selectedValue || this.selectedValue.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000000057', // 삭제할 항목을 선택해주세요.
          type: 'warning',
        });
      } else {
        if (!this.safPsmAuditRslt.deleteSafPsmAuditRsltStds) {
          this.safPsmAuditRslt.deleteSafPsmAuditRsltStds = [];
        }
        this.$_.forEach(this.selectedValue, (item) => {
          if (item.tempId) {
            this.gridOptions.data.splice(
              this.$_.findIndex(this.gridOptions.data, { tempId: item.tempId }),
              1
            );
          } else {
            this.safPsmAuditRslt.deleteSafPsmAuditRsltStds.push(item);
            this.gridOptions.data.splice(
              this.$_.findIndex(this.gridOptions.data, {
                auditStdNo: item.auditStdNo,
              }),
              1
            );
          }
        });
      }
    },
    /** Button Event **/
    // 버튼 에러 처리
    btnClickedErrorCallback(_result) {
      this.isDelete = false;
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    // linkClicked(scope) {
    //   window.alert('개발중');
    //   // TODO : 페이지 이동은 준비중
    // },
    /** /Button Event **/
  },
};
</script>
<style>
.auditItemPlanTag .button-new-tag {
  padding-top: 0 !important;
}
</style>
