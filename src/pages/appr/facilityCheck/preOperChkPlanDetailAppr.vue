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
              <!-- 기본정보 저장 -->
              <y-btn
                v-if="editable && updateMode && !disabled"
                :action-url="editUrl"
                :param="inspBefChkPlan"
                :is-submit="isEdit"
                title="L0000000778"
                color="orange"
                action-type="PUT"
                beforeSubmit="beforeEdit"
                @beforeEdit="beforeEdit"
                @btnClicked="btnEditClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
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
              <!-- 점검부서 -->
              <y-tree-dept
                :editable="editable"
                :required="true"
                :disabled="disabled"
                :plantCd="inspBefChkPlan.plantCd"
                label="L0000002552"
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
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 변경발의번호 -->
              <y-text
                :width="8"
                :disabled="true"
                :editable="editable"
                ui="bootstrap"
                label="L0000004754"
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
            </b-col>
          </b-row>
          <b-row class="mt-3">
            <component
              v-if="isItems"
              :is="component"
              :inspBefItemView.sync="inspBefItemView"
              :disabled="disabled"
            />
          </b-row>
        </b-card>
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  /* attributes: name, components, props, data */
  name: 'facil-chk-plan-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        safFacilChkNo: 0, // 설비점검마스터번호
        isSearch: false,
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
      tabIndex: '-1',
      loading: true,
      headerName: '',
    };
  },
  computed: {
    isAdd() {
      return this.gridOptions.data.length > 0;
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
      this.component = () =>
        import('@/pages/saf/inspBefOperation/inspBefOperInfo.vue');

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
        _result => {
          this.inspBefChkPlan = _result.data;

          this.gridOptions.data = [];
          if (
            this.inspBefChkPlan.facilChkResults &&
            this.inspBefChkPlan.facilChkResults.length > 0
          ) {
            this.$_.forEach(_result.data.facilChkResults, item => {
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

          // 첫번째 row default로 조회
          this.getSubDetail();
        },
        _error => {
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
        .then(_result => {
          // TODO : 전역 성공 메시지 처리
          // 이벤트는 ./event.js 파일에 선언되어 있음
          if (_result) {
            if (!this.gridOptions.data || this.gridOptions.data.length === 0) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395',
                message: 'M0000000090',
                // 설비는 최소 1개 이상 지정되야 합니다.
                type: 'warning', // success / info / warning / error
              });
              return;
            }
            let items = this.gridOptions.data;
            for (let i = 0; i < items.length; i++) {
              if (!items[i].chkUserId || items[i].chkUserId.length === 0) {
                window.getApp.$emit('ALERT', {
                  title: 'L0000003395',
                  message: 'M0000000091',
                  // 점검자는 필수 지정되야 합니다.
                  type: 'warning', // success / info / warning / error
                });
                return;
              }
              if (!items[i].chkSchYmd) {
                window.getApp.$emit('ALERT', {
                  title: 'L0000003395',
                  message: 'M0000000727',
                  // 점검예정일은 필수 지정되야 합니다.
                  type: 'warning', // success / info / warning / error
                });
                return;
              }
            }
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321',
              message: 'M0000000011', // 저장하시겠습니까? 저장 후 점검설비 목록은 추가 및 제외를 할 수 없습니다.
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
            window.getApp.$emit('ALERT', {
              title: 'L0000003395',
              message: 'M0000000005',
              // 필수입력값을 입력해주세요.
              type: 'warning', // success / info / warning / error
            });
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
        _result => {
          this.typeInfoList = [];
          this.typeInfoList.push({
            safCheckTypeCd: null,
            safFacilChkNo: this.popupParam.safFacilChkNo,
          });
          let typeInfoList = null;
          if (this.$_.clone(_result.data).length > 0) {
            typeInfoList = this.$_.clone(_result.data);
          } else {
            typeInfoList = [
              {
                safCheckTypeCd: null,
                safFacilChkNo: this.popupParam.safFacilChkNo,
              },
            ];
          }
          this.inspBefItemView = {
            typeInfoList: typeInfoList,
            safFacilChkNo: this.popupParam.safFacilChkNo,
            // safFacilityCd: data.safFacilityCd ? data.safFacilityCd : null,
            plantCd: this.inspBefChkPlan.plantCd,
          };
        },
        _error => {
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
    openPopup() {
      this.popupOptions.target = () =>
        import(`${'../../baseInfo/facility/facilityMstPopup.vue'}`);
      this.popupOptions.title = 'L0000003680';
      // 설비 추가
      this.popupOptions.param = {
        multiple: true,
        plantCd: this.inspBefChkPlan.plantCd,
      };
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closeFacilityPopup;
    },
    closeFacilityPopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data === 'CLOSE') return;
      // 데이터의 타입이 배열이 아닌 알 수 없는값으로 표기 될 시에 배열로 초기화
      if (!this.gridOptions.data) this.gridOptions.data = [];
      this.$_.forEach(data, facility => {
        // 점검설비 목록에 선택되어져 온 설비를 바인딩한다.
        let index = this.$_.findIndex(this.gridOptions.data, {
          safFacilityCd: facility.safFacilityCd,
        });
        // 팝업창에서 선택한 값이 기존에 없는 값이라면 점검설비목록에 추가한다.
        if (index === -1) {
          this.gridOptions.data.splice(0, 0, {
            safFacilityTypeNm: facility.safFacilityTypeNm,
            processNms: facility.processNms,
            safFacilityCd: facility.safFacilityCd,
            facilityNm: facility.facilityNm,
            facilityMgrNum: facility.facilityMgrNum,
            deptNm: facility.deptNm,
            chkUserNm: '',
            chkUserId: [],
          });
        } else {
          // 기존에 있는 데이터의 경우에는 데이터를 추가하지 않고 그대로 놔둔다.
        }
      });
    },
    btnClickedErrorCallback(_result) {
      this.isInsert = false;
      this.isEdit = false;
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    btnInsertClickedCallback(_result) {
      this.popupParam.safFacilChkNo = _result.data;
      this.inspBefChkPlan.safFacilChkNo = _result.data;
      this.isInsert = false;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395',
        message: 'M0000000974', // 기본정보가 저장되었습니다. 점검설비별 점검항목을 저장하셔야 합니다.
        type: 'success', // success / info / warning / error
      });
      this.setHeader();
      this.getPlanDetail();
    },
    btnEditClickedCallback(_result) {
      this.isEdit = false;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395',
        message: 'M0000000974', // 기본정보가 저장되었습니다. 점검설비별 점검항목을 저장하셔야 합니다.
        type: 'success', // success / info / warning / error
      });
      this.setHeader();
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
            _result => {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395',
                message: 'M0000000007', // 삭제되었습니다.
                type: 'success', // success / info / warning / error
              });
              this.closePopup(null);
            },
            _error => {
              window.getApp.$emit('APP_REQUEST_ERROR', _error);
            }
          );
        },
        // 취소 callback 함수
        cancelCallback: () => {},
      });
    },
    btnDeleteFacilityClickedCallback(_result) {
      if (this.selectValue.length <= 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: 'M0000000092',
          // 설비목록에서 설비를 한개이상 선택하세요.
          type: 'warning', // success / info / warning / error
        });
        return;
      } else {
        this.$_.forEach(this.selectValue, item => {
          this.gridOptions.data = this.$_.reject(this.gridOptions.data, {
            safFacilityCd: item.safFacilityCd,
          });
        });
        this.isItems = false;
      }
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
    btnSearchUserClicked(row) {
      if (!this.editable) return;
      // 선택한 row와 헤더의 명칭을 저장한다.
      this.data = row;

      this.popupOptions.target = () =>
        import(`${'@/pages/manage/user/userSearch.vue'}`);
      this.popupOptions.param = {
        multiple: true,
        plantCd: this.$store.getters.plantCd,
        deptCd: this.$store.getters.deptCd,
      };
      this.popupOptions.title = 'L0000001466'; // 사용자검색
      this.popupOptions.visible = true;
      this.popupOptions.width = '70%';
      this.popupOptions.top = '100px';
      this.popupOptions.closeCallback = this.closePopupSearchUser;
    },
    closePopupSearchUser(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      let i = 0;
      if (data.users) {
        this.data.chkUserNm = '';
        this.data.chkUserId = [];
        this.$_.forEach(data.users, _item => {
          if (data.users.length - 1 === i) {
            this.data.chkUserNm += _item.userNm;
          } else {
            this.data.chkUserNm += _item.userNm + ', ';
            i++;
          }
          this.data.chkUserId.push(_item.userId);
        });
      }
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
