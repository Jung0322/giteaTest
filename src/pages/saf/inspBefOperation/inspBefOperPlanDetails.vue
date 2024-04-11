<!--
  목적 : 가동전점검관리 - 가동전 등록
  Detail : 가동전점검일정 등록/수정 화면
           가동전점검일정을 점검계획사용여부가 사용으로 지정된 점검종류별로  주관부서와 수행부서들을 지정하고, 점검주기 별로 기간을 지정하여 점검예정일을 지정
           **
           현재 화면을 수정할 경우 결재용 vue파일도 같이 현행화 해야함
           facilChkPlanDetailAppr.vue
           **
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 등록 -->
    <b-row ref="editBox">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 가동전점검계획 -->
            <y-label
              label="L0000003985"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 결재요청 -->
              <y-btn
                v-if="
                  editable &&
                  updateMode &&
                  !disabled &&
                  inspBefChkPlan.bizApprStepCd !== 'BAPSD' &&
                  !popupParam.apprFlag
                "
                title="L0000003418"
                color="black"
                @btnClicked="btnAppr"
              />
              <!-- 기본정보 저장 -->
              <y-btn
                v-if="
                  editable && insertMode && !disabled && !popupParam.apprFlag
                "
                :action-url="insertUrl"
                :param="inspBefChkPlan"
                :is-submit="isInsert"
                title="L0000000778"
                color="orange"
                action-type="POST"
                beforeSubmit="beforeInsert"
                @beforeInsert="beforeInsert"
                @btnClicked="btnInsertClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 저장 -->
              <y-btn
                v-if="editable && updateMode && !disabled"
                :action-url="editUrl"
                :param="inspBefChkPlan"
                :is-submit="isEdit"
                title="L0000002474"
                color="orange"
                action-type="PUT"
                beforeSubmit="beforeEdit"
                @beforeEdit="beforeEdit"
                @btnClicked="btnEditClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 삭제 -->
              <y-btn
                v-if="
                  editable &&
                  updateMode &&
                  !disabled &&
                  inspBefChkPlan.bizApprStepCd !== 'BAPSD' &&
                  !popupParam.apprFlag
                "
                color="red"
                title="L0000001495"
                @btnClicked="btnDeleteClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 닫기 -->
              <y-btn
                v-if="!popupParam.apprFlag"
                title="L0000000881"
                @btnClicked="closePopup"
              />
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-plant
                type="edit"
                :editable="editable"
                :required="true"
                :disabled="disabled"
                name="plantCd"
                v-model="inspBefChkPlan.plantCd"
                v-validate="'required'"
                :state="validateState('plantCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <b-row>
                <!-- 등록자/등록일 -->
                <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
                  <y-label label="L0000000978" />
                </b-col>
                <b-col sm="8" md="8" lg="8" xl="8" class="col-xxl-8">
                  <y-label
                    :label="
                      inspBefChkPlan.createUserNm +
                      ' / ' +
                      inspBefChkPlan.createDt
                    "
                    :fieldable="true"
                  />
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 점검주관부서 -->
              <y-tree-dept
                :editable="editable"
                :required="true"
                :disabled="disabled"
                :plantCd="inspBefChkPlan.plantCd"
                label="L0000002578"
                name="deptCd"
                v-model="inspBefChkPlan.deptCd"
                v-validate="'required'"
                :state="validateState('deptCd')"
              />
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <!-- 점검명 -->
              <y-text
                :width="10"
                :maxlength="50"
                :editable="editable"
                :disabled="disabled"
                :required="true"
                ui="bootstrap"
                name="safFacilChkTitle"
                label="L0000002551"
                v-model="inspBefChkPlan.safFacilChkTitle"
                v-validate="'required'"
                :state="validateState('safFacilChkTitle')"
              ></y-text>
            </b-col>
            <!-- <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">

              <y-text
                :width="8"
                :disabled="true"
                :editable="editable"
                ui="bootstrap"
                label="변경발의번호"
                name="chngNum"
                v-model="inspBefChkPlan.chngNum"
                :appendIcon="
                  editable && !disabled
                    ? [
                        { icon: 'search', callbackName: 'searchMoc' },
                        { icon: 'times', callbackName: 'removeMoc' },
                      ]
                    : null
                "
                @searchMoc="searchMoc"
                @removeMoc="removeMoc"
              ></y-text>
            </b-col> -->
          </b-row>
        </b-card>
        <el-tabs
          v-if="isUpdate"
          type="border-card"
          v-model="tabIndex"
          class="mt-2"
        >
          <el-tab-pane
            v-for="(item, i) in tabItems"
            :key="i"
            stretch
            class="default-tab-pane"
          >
            <span slot="label">
              <i class="el-icon-date"></i>
              {{ $comm.getLangSpecInfoLabel(item.title) }}
            </span>
          </el-tab-pane>
          <insp-bef-oper-info
            v-show="tabIndex === '0'"
            ref="component"
            :inspBefItemView.sync="inspBefItemView"
            :disabled="disabled"
            :inspBefChkPlan="inspBefChkPlan"
          />
          <insp-bef-oper-inspector
            v-show="tabIndex === '1'"
            ref="component2"
            :inspBefItemView.sync="inspBefItemView"
            :disabled="disabled"
            :inspBefChkPlan="inspBefChkPlan"
          />
          <!-- <keep-alive> -->
          <!-- <component
              v-if="component"
              :is="component"
              ref="component"
              :inspBefItemView.sync="inspBefItemView"
              :disabled="disabled"
              :inspBefChkPlan="inspBefChkPlan"
            /> -->
          <!-- </keep-alive> -->
        </el-tabs>
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
import inspBefOperInfo from './inspBefOperInfo.vue';
import inspBefOperInspector from './inspBefOperInspector.vue';
export default {
  /* attributes: name, components, props, data */
  name: 'insp-bef-oper-plan-details',
  components: {
    'insp-bef-oper-info': inspBefOperInfo,
    'insp-bef-oper-inspector': inspBefOperInspector,
  },
  props: {
    popupParam: {
      type: Object,
      default: {
        safFacilChkNo: 0, // 설비점검마스터번호
        isSearch: false,
        apprFlag: false,
      },
    },
  },
  data() {
    return {
      searchUrl: '',
      editUrl: '',
      insertUrl: '',
      deleteUrl: '',

      updateMode: false,
      insertMode: true,

      isInsert: false,
      isEdit: false,
      editable: false,
      disabled: false,

      inspBefChkPlan: {
        safFacilChkNo: 0,
        plantCd: '', // 사업장 코드
        deptCd: '', // 점검부서
        safFacilChkTitle: '', // 점검명
        chkStepCd: '', // 점검진행상태
        createUserId: '', // 등록자 ID
        createUserNm: '',
        bizApprStepCd: '',
        createDt: '', // 등록일
        facilChkResults: [],
        facilityChkItems: [],
        chngNum: null,
        safChngNo: null,
        preOperChkPsns: [], // 점검자
      },
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        param: null,
        width: '80%',
        top: '10px',
        closeCallback: null,
      },
      inspBefItemView: {
        safFacilChkNo: 0,
        plantCd: '',
        safCheckTypeCd: '',
        safFacilityCd: '',
        typeInfoList: [],
      },
      gridOptions: {
        header: [],
        data: [],
        height: '180',
      },
      selectValue: [],

      tempSafCheckTypeCd: '', // 점검항목 추가 버튼 눌릴때 필요한 데이터 담는 용도
      tempSafFacilityCd: '',
      typeInfoList: [],
      isItems: false,
      component: null,
      subInsertUrl: '',
      isSub: false,
      isAll: true,

      data: '',
      tabIndex: 0,
      loading: true,
      headerName: '',
      tabItems: [],
    };
  },
  computed: {
    isAdd() {
      return this.gridOptions.data.length > 0;
    },
    /**
     * 기본정보 저장 후 tab rendering 하도록 조건 추가
     */
    isUpdate() {
      return this.tabItems && this.tabItems.length;
    },
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
      this.editable = this.$route.meta.editable;

      this.inspBefChkPlan.createUserNm = this.$store.getters.name;
      this.inspBefChkPlan.createDt = this.$comm.getToday();

      // URL Settings
      this.searchUrl = selectConfig.saf.befInspPlan.get.url;
      this.editUrl = transactionConfig.saf.befInspPlan.edit.url;
      this.insertUrl = transactionConfig.saf.befInspPlan.insert.url;
      this.deleteUrl = transactionConfig.saf.befInspPlan.delete.url;
      if (this.popupParam.safFacilChkNo && this.popupParam.safFacilChkNo > 0) {
        this.getPlanDetail();
      }
    },
    getPlanDetail() {
      this.loading = true;
      this.$http.url = this.$format(
        this.searchUrl,
        this.popupParam.safFacilChkNo
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.inspBefChkPlan = _result.data;

          this.gridOptions.data = [];
          if (
            this.inspBefChkPlan.facilChkResults &&
            this.inspBefChkPlan.facilChkResults.length > 0
          ) {
            this.$_.forEach(_result.data.facilChkResults, (item) => {
              let pushData = {
                safFacilityTypeNm: item.safFacilityTypeNm,
                processNms: item.processNms,
                safFacilityCd: item.safFacilityCd,
                facilityNm: item.facilityNm,
                facilityMgrNum: item.facilityMgrNum,
                deptNm: item.deptNm,
                createUserNm: item.createUserNm,
                chkSchYmd: item.chkSchYmd,
                chkUserNm: item.chkUserNm,
                chkUserId: item.chkUserId,
              };

              this.gridOptions.data.push(pushData);
            });
          }
          this.isItems = true;
          this.insertMode = false;
          this.updateMode = true;

          if (
            this.inspBefChkPlan.chkStepCd === 'CHS01' &&
            this.inspBefChkPlan.bizApprStepCd !== 'BAPSA'
          ) {
            // 상태가 '계획'이고 결재중이 아닐때만 작성 가능
            this.disabled = false;
          } else {
            this.disabled = true;
          }

          if (this.popupParam.isSearch) {
            this.disabled = true;
          }

          this.tabItems = [
            { title: 'L0000000466' }, // 계획
            { title: 'L0000002572' }, // 점검자
          ];

          this.getSubDetail();
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /** 신규등록 하기전 UI단 유효성 검사 **/
    beforeInsert() {
      this.beforeSubmitCheck('insert');
    },
    /** 신규등록 하기전 UI단 유효성 검사 **/
    beforeEdit() {
      this.beforeSubmitCheck('edit');
    },

    beforeSubmitCheck(flag) {
      this.$validator
        .validateAll()
        .then((_result) => {
          // TODO : 전역 성공 메시지 처리
          // 이벤트는 ./event.js 파일에 선언되어 있음
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321',
              message: 'M0000000011', // 저장하시겠습니까?
              // TODO : 필요시 추가하세요.
              type: 'info', // success / info / warning / error
              // 확인 callback 함수
              confirmCallback: () => {
                this.inspBefChkPlan.createUserId = this.$store.getters.token;
                this.inspBefChkPlan.updateUserId = this.$store.getters.token;
                this.inspBefChkPlan.chkStepCd = 'CHS01';
                this.inspBefChkPlan.facilChkResults = this.gridOptions.data;

                if (flag === 'insert') this.isInsert = true;
                else if (flag === 'edit') this.isEdit = true;
              },
              // 취소 callback 함수
              cancelCallback: () => {},
            });
          } else if (!_result) {
            this.$popupRequired.check(
              'inspBefOperPlanDetails',
              this.$data,
              this.errors
            );
          }
        })
        .catch(() => {
          window.getApp.$emit('APP_VALID_ERROR', 'M0000000876');
          if (flag === 'insert') this.isInsert = false;
          else if (flag === 'edit') this.isEdit = false;
        });
    },

    getSubDetail() {
      this.isItems = true;
      this.$http.url = selectConfig.saf.befInspResult.forEachType.url;
      this.$http.type = 'GET';
      this.$http.param = {
        safFacilChkNo: this.popupParam.safFacilChkNo,
        plantCd: this.inspBefChkPlan.plantCd,
      };
      this.$http.request(
        (_result) => {
          this.typeInfoList = [];
          this.typeInfoList.push({
            safCheckTypeCd: null,
            safFacilChkNo: this.popupParam.safFacilChkNo,
          });
          let inspBefItemView = null;
          if (this.$_.clone(_result.data).length > 0) {
            inspBefItemView = this.$_.clone(_result.data);
          } else {
            inspBefItemView = [
              {
                safCheckTypeCd: null,
                safFacilChkNo: this.popupParam.safFacilChkNo,
              },
            ];
          }

          this.inspBefItemView = {
            typeInfoList: inspBefItemView,
            safFacilChkNo: this.popupParam.safFacilChkNo,
            // safFacilityCd: data.safFacilityCd ? data.safFacilityCd : null,
            plantCd: this.inspBefChkPlan.plantCd,
          };
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /**
     * 필수입력값 유효성 검사
     */
    validateState(ref) {
      if (
        this.veeBag[ref] &&
        (this.veeBag[ref].dirty || this.veeBag[ref].validated)
      ) {
        return !this.errors.has(ref);
      }
      return null;
    },
    /**
     *  팝업 안 보이도록 closePopup emit
     *  팝업 close
     * data : 팝업창에서 return하는 데이터
     */
    closePopup(data) {
      this.$emit('closePopup');
    },
    /** button 관련 이벤트 **/

    btnClickedErrorCallback(_result) {
      this.isInsert = false;
      this.isEdit = false;
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    btnAppr() {
      var returnVal = true;
      if (returnVal) {
        window.getApp.$emit('CONFIRM', {
          title: 'L0000003321',
          message: 'M0000000718',
          // 결재요청 전 저장됩니다. 진행하시겠습니까?
          type: 'info', // success / info / warning / error
          confirmCallback: () => {
            this.inspBefChkPlan.createUserId = this.$store.getters.token;
            this.inspBefChkPlan.updateUserId = this.$store.getters.token;
            this.$refs.component.$refs.inspBefOperInfoItem
              .promiseSubEdit()
              .then(
                () => {
                  this.$http.url = this.editUrl;
                  this.$http.type = 'PUT';
                  this.$http.param = this.inspBefChkPlan;
                  this.$http.request(
                    (_result) => {
                      this.popupOptions.target = () =>
                        import(`${'@/pages/manage/appr/comApprRequest.vue'}`);
                      this.popupOptions.title = 'L0000003418'; // 결재요청
                      this.popupOptions.visible = true;
                      this.popupOptions.closeCallback = this.closeApprPop;
                      this.popupOptions.width = '80%';
                      this.popupOptions.param = {
                        apprBizCd: 'SA-OP-01',
                        apprParams: {
                          safFacilChkNo: this.popupParam.safFacilChkNo,
                        },
                      };
                    },
                    (_error) => {
                      window.getApp.$emit('APP_REQUEST_ERROR', _error);
                    }
                  );
                },
                () => {
                  window.getApp.$emit('ALERT', {
                    title: 'L0000003395',
                    message: 'M0000001151', // 점검유형을 선택하세요.
                    type: 'warning',
                  });
                }
              );
          },
          cancelCallback: () => {},
        });
      }
    },
    closeApprPop(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getPlanDetail();
    },
    btnInsertClickedCallback(_result) {
      this.popupParam.safFacilChkNo = _result.data;
      this.inspBefChkPlan.safFacilChkNo = _result.data;
      this.isInsert = false;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395',
        message: 'M0000000006', // 기본정보가 저장되었습니다. 점검설비별 점검항목을 저장하셔야 합니다.
        type: 'success', // success / info / warning / error
      });
      this.getPlanDetail();
    },
    btnEditClickedCallback(_result) {
      this.isEdit = false;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395',
        message: 'M0000000006', // 기본정보가 저장되었습니다. 점검설비별 점검항목을 저장하셔야 합니다.
        type: 'success', // success / info / warning / error
      });
    },
    rowClassName({ row, rowIndex }) {
      if (this.rowIndex === rowIndex) {
        row.index = rowIndex;
        return 'select-row';
      } else {
        return '';
      }
    },
    btnDeleteClickedCallback(_result) {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321',
        message: 'M0000000012', // 삭제하시겠습니까?
        // TODO : 필요시 추가하세요.
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          this.$http.url = this.$format(
            this.deleteUrl,
            this.inspBefChkPlan.safFacilChkNo
          );
          this.$http.type = 'DELETE';
          this.$http.request(
            (_result) => {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395',
                message: 'M0000000007', // 삭제되었습니다.
                type: 'success', // success / info / warning / error
              });
              this.closePopup(null);
            },
            (_error) => {
              window.getApp.$emit('APP_REQUEST_ERROR', _error);
            }
          );
        },
        // 취소 callback 함수
        cancelCallback: () => {},
      });
    },
    searchMoc() {
      this.popupOptions.param = {
        plantCd: this.inspBefChkPlan.plantCd,
        chngRefWorkCd: 'CGRW5',
      };
      this.popupOptions.target = () =>
        import(`${'@/pages/saf/change/changePop.vue'}`);
      this.popupOptions.title = 'L0000001221'; // 변경관리
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      this.popupOptions.closeCallback = this.closeMocPopup;
    },
    closeMocPopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data !== 'CLOSE') {
        this.inspBefChkPlan.chngNum = data.chngNum;
        this.inspBefChkPlan.safChngNo = data.safChngNo;
      }
    },
    removeMoc() {
      this.inspBefChkPlan.chngNum = '';
      this.inspBefChkPlan.safChngNo = 0;
    },

    /** end button 관련 이벤트 **/
  },
};
</script>

<style>
.select-row {
  background-color: #d9e9d9 !important;
}
</style>
