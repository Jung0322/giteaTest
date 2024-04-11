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
          <b-col sm="12">
            <b-col sm="12" class="px-0">
              <div slot="buttonGroup" class="float-right mb-1">
                <!-- 추가 -->
                <y-btn
                  v-if="!disabled && editable"
                  title="L0000002892"
                  color="blue"
                  :showLoading="false"
                  @btnClicked="btnInAdd"
                />
                <!-- 삭제 -->
                <y-btn
                  v-if="
                    !disabled &&
                    editable &&
                    industrialSafetyHealthCommittee.inMgtCommitteePsn.length > 0
                  "
                  title="L0000001495"
                  color="red"
                  :showLoading="false"
                  @btnClicked="btnInDelete"
                />
              </div>
              <!-- 사내 참석자 목록 -->
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
                <!-- 사인 -->
                <el-table-column
                  v-if="
                    industrialSafetyHealthCommittee.progressStepCd !== 'CMS01'
                  "
                  slot="tag"
                  align="center"
                  width="100px"
                  label="L0000001484"
                ></el-table-column>
              </y-data-table>
            </b-col>
          </b-col>
        </b-row>
        <b-row class="mt-3">
          <b-col sm="12">
            <b-col sm="12" class="px-0">
              <div slot="buttonGroup" class="float-right mb-1">
                <!-- 추가 -->
                <y-btn
                  v-if="!disabled && editable"
                  title="L0000002892"
                  color="blue"
                  :showLoading="false"
                  @btnClicked="btnOutAdd"
                />
                <!-- 삭제 -->
                <y-btn
                  v-if="
                    !disabled &&
                    editable &&
                    industrialSafetyHealthCommittee.outMgtCommitteePsn.length >
                      0
                  "
                  title="L0000001495"
                  color="red"
                  :showLoading="false"
                  @btnClicked="btnOutDelete"
                />
              </div>
              <!-- 외부 참석자 목록 -->
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
                <!-- 사인 -->
                <el-table-column
                  v-if="
                    industrialSafetyHealthCommittee.progressStepCd !== 'CMS01'
                  "
                  slot="tag"
                  align="center"
                  width="100px"
                  label="L0000001484"
                ></el-table-column>
              </y-data-table>
            </b-col>
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
      default: {
        // col0: 0,
        committeeConfNo: 0,
        progressStepCd: null,
        inMgtCommitteePsn: [],
        outMgtCommitteePsn: [],
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
    };
  },
  watch: {},
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {},
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.inGridOptions.header = [
        {
          text: 'L0000001287' /* 부서 */,
          name: 'deptNm',
          width: '150px',
          align: 'center',
        },
        {
          text: 'L0000001630' /* 성명 */,
          name: 'userNm',
          width: '150px',
          align: 'center',
        },
        {
          text: 'L0000002772' /* 직책 */,
          name: 'dutyNm',
          width: '150px',
          align: 'center',
        },
        {
          text: 'L0000001360' /* 비고 */,
          name: 'remark',
          width: '250px',
          type: 'text',
          maxlength: 1000,
        },
      ];
      this.outGridOptions.header = [
        {
          text: 'L0000001663' /* 소속(*) */,
          name: 'deptNm',
          width: '150px',
          align: 'center',
        },
        {
          text: 'L0000001631' /* 성명(*) */,
          name: 'userNm',
          width: '150px',
          align: 'center',
          type: 'text',
          maxlength: 25,
        },
        {
          text: 'L0000002772' /* 직책 */,
          name: 'dutyNm',
          width: '150px',
          align: 'center',
          type: 'text',
          maxlength: 50,
        },
        {
          text: 'L0000001360' /* 비고 */,
          name: 'remark',
          width: '250px',
          type: 'text',
          maxlength: 1000,
        },
      ];
    },
    btnInAdd() {
      this.popupOptions.target = () =>
        import(`${'@/pages/manage/user/userSearch.vue'}`);
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
        this.$_.forEach(data.users, (item) => {
          if (
            this.$_.findIndex(
              this.industrialSafetyHealthCommittee.inMgtCommitteePsn,
              {
                userId: item.userId,
              }
            ) === -1
          ) {
            this.industrialSafetyHealthCommittee.inMgtCommitteePsn.splice(
              0,
              0,
              {
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
              }
            );
          }
        });
      }
    },
    btnInDelete() {
      if (!this.inSelectedValue || this.inSelectedValue.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'M0000000057', // 삭제할 항목을 선택해주세요.
          type: 'warning', // success / info / warning / error
        });
      } else {
        this.$_.forEach(this.inSelectedValue, (item) => {
          this.industrialSafetyHealthCommittee.inMgtCommitteePsn.splice(
            this.$_.findIndex(
              this.industrialSafetyHealthCommittee.inMgtCommitteePsn,
              { userId: item.userId }
            ),
            1
          );
        });
      }
    },
    btnOutAdd() {
      this.popupOptions.target = () =>
        import(`${'@/pages/vendor/baseInfo/vendorMaster.vue'}`);
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
      if (!this.outSelectedValue || this.outSelectedValue.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'M0000000057', // 삭제할 항목을 선택해주세요.
          type: 'warning', // success / info / warning / error
        });
      } else {
        this.$_.forEach(this.outSelectedValue, (item) => {
          this.industrialSafetyHealthCommittee.outMgtCommitteePsn.splice(
            this.$_.findIndex(
              this.industrialSafetyHealthCommittee.outMgtCommitteePsn,
              { rowId: item.rowId }
            ),
            1
          );
        });
      }
    },
  },
};
</script>
