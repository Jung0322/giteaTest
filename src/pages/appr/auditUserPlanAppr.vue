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
              @btnClicked="userDelete"
            />
          </div>
          <!-- PSM 감사팀 목록 -->
          <y-data-table
            label="L0000004678"
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :editable="editable && !disabled"
            v-model="selectedValue"
          >
            <div v-if="editable && !disabled" slot="selection">
              <el-table-column align="center" width="55" type="selection" />
            </div>
          </y-data-table>
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
      gridOptions: {
        header: [],
        data: [],
        height: '320',
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
      selectedValue: [],
      searchParam: {
        plantCd: '',
        useYn: 'Y',
      },
    };
  },
  watch: {
    'safPsmAuditRslt.auditRsltNo': {
      handler: function (val, oldVal) {
        this.getDataList(); // 감사팀
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
      this.searchUrl = selectConfig.saf.auditUser.list.url;
      this.editable = this.$route.meta.editable;

      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          text: 'L0000000686', // 구분
          name: 'auditTypeNm',
          width: '120px',
          align: 'center',
        },
        {
          text: 'L0000001662', // 소속
          name: 'deptNm',
          width: '120px',
          align: 'center',
        },
        {
          text: 'L0000002769', // 직위
          name: 'dutyNm',
          width: '150px',
          align: 'center',
        },
        {
          text: 'L0000001630', // 성명
          name: 'userNm',
          width: '150px',
          align: 'center',
        },
        {
          text: 'L0000002491', // 전공
          name: 'majorDesc',
          width: '120px',
          align: 'center',
        },
        {
          text: 'L0000000458', // 경력
          name: 'careerDesc',
          width: '130px',
          align: 'center',
        },
        {
          text: 'L0000000665', // 교육이수 현황
          name: 'eduDesc',
          width: '130px',
          align: 'center',
        },
        {
          text: 'L0000002304', // 자격증 보유현황
          name: 'certiDesc',
          width: '130px',
          align: 'center',
        },
        {
          text: 'L0000001360', // 비고
          name: 'remark',
          width: '200px',
          type: 'textarea',
          maxlength: 200,
        },
      ];

      this.getDataList();
    },
    // 검진 계획 그리드
    getDataList() {
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
      this.popupOptions.title = 'L0000004679'; // PSM 감사원
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
            this.gridOptions.data.splice(0, 0, item);
          }
        });
      }
    },
    userDelete() {
      if (!this.selectedValue || this.selectedValue.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000000057', // 삭제할 항목을 선택해주세요.
          type: 'warning',
        });
        return;
      } else {
        if (!this.safPsmAuditRslt.deleteSafPsmAuditRsltUsers) {
          this.safPsmAuditRslt.deleteSafPsmAuditRsltUsers = [];
        }
        this.$_.forEach(this.selectedValue, (item) => {
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
    /** Button Event **/
    // 버튼 에러 처리
    btnClickedErrorCallback(_result) {
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    /** /Button Event **/
  },
};
</script>
