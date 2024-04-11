<!--
  목적 : 설비점검관리 - 점검일정 등록
  Detail : 설비점검일정 등록/수정 화면
           설비점검일정을 점검계획사용여부가 사용으로 지정된 점검종류별로  주관부서와 수행부서들을 지정하고, 점검주기 별로 기간을 지정하여 점검예정일을 지정
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
            <!-- 설비점검일정 -->
            <y-label
              label="L0000001615"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 결재요청 -->
              <y-btn
                v-if="editable && updateMode && !disabled"
                title="L0000003418"
                color="black"
                @btnClicked="btnAppr"
              />
              <!-- 저장 -->
              <y-btn
                v-if="editable && insertMode && !disabled"
                :action-url="insertUrl"
                :param="facilChkPlan"
                :is-submit="isInsert"
                title="L0000002474"
                color="orange"
                action-type="POST"
                beforeSubmit="beforeInsert"
                @beforeInsert="beforeInsert"
                @btnClicked="btnInsertClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <y-btn
                v-if="editable && updateMode && !disabled"
                :action-url="editUrl"
                :param="facilChkPlan"
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
                v-if="editable && updateMode && !disabled"
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
                v-model="facilChkPlan.plantCd"
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
                      facilChkPlan.createUserNm + ' / ' + facilChkPlan.createDt
                    "
                    :fieldable="true"
                  />
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 점검종류 -->
              <y-select
                :width="8"
                :comboItems="comboCheckTypeItems"
                :required="true"
                :editable="editable"
                :disabled="disabled"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                type="edit"
                name="safCheckTypeCd"
                label="L0000002576"
                v-model="facilChkPlan.safCheckTypeCd"
                v-validate="'required'"
                :state="validateState('safCheckTypeCd')"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 점검부서 -->
              <y-tree-dept
                :editable="editable"
                :required="true"
                :disabled="disabled"
                :plantCd="facilChkPlan.plantCd"
                label="L0000002578"
                name="deptCd"
                v-model="facilChkPlan.deptCd"
                v-validate="'required'"
                :state="validateState('deptCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 점검명 -->
              <y-text
                :width="8"
                :maxlength="50"
                :editable="editable"
                :disabled="disabled"
                :required="true"
                ui="bootstrap"
                name="safFacilChkTitle"
                label="L0000002551"
                v-model="facilChkPlan.safFacilChkTitle"
                v-validate="'required'"
                :state="validateState('safFacilChkTitle')"
              ></y-text>
            </b-col>
            <b-col
              v-if="facilChkPlan.safCheckTypeCd === 'INSBO'"
              sm="6"
              md="6"
              lg="6"
              xl="6"
              class="col-xxl-3"
            >
              <!-- 변경발의번호 -->
              <y-text
                :width="8"
                :disabled="true"
                :editable="editable"
                ui="bootstrap"
                label="L0000004754"
                name="chngNum"
                v-model="facilChkPlan.chngNum"
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
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <!-- <b-col sm="12">
              <b-col sm="12" class="px-0"> -->
              <!-- <div slot="buttonGroup" class="float-right mb-1">
                   추가  
                  <y-btn
                    v-if="editable && !disabled"
                    color="orange"
                    title="L0000002892"
                    @btnClicked="openPopup"
                  />
                   제외  
                  <y-btn
                    v-if="editable && !disabled"
                    color="red"
                    title="L0000002620"
                    @btnClicked="btnDeleteFacilityClickedCallback"
                    @btnClickedErrorCallback="btnClickedErrorCallback"
                  />
                </div> -->
              <!-- 점검설비 목록 -->
              <!-- <y-data-table
                  ref="dataTable"
                  :height="gridOptions.height"
                  :headers="gridOptions.header"
                  :items="gridOptions.data"
                  :editable="editable && !disabled"
                  :useRownum="false"
                  v-model="selectValue"
                  label="L0000002556"
                  :popMode="true"
                  @tableLinkClicked="tableLinkClicked"
                >
                  <el-table-column
                    type="selection"
                    slot="selection"
                    align="center"
                    width="55"
                  ></el-table-column>
                </y-data-table> -->
              <y-auigrid
                ref="yAuiGrid"
                :editable="editable"
                :name="gridOptions.name"
                :headers="gridOptions.header"
                :btns="gridOptions.btns"
                :items="gridOptions.data"
                :height="gridOptions.height"
                :label="this.$comm.getLangSpecInfoLabel('L0000002556')"
                :useExcelExport="false"
                :showRowCheckColumn="true"
                :popMode="true"
                @cellClick="cellClickHandler"
                @openPopup="openPopup"
                @btnDeleteFacilityClickedCallback="
                  btnDeleteFacilityClickedCallback
                "
                @cellEditEnd="cellEditEndHandler"
              />
            </b-col>
            <!--  </b-col>
            </b-col> -->
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
import searchIcon from '@/assets/images/info.png';
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
  data: () => ({
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

    facilChkPlan: {
      plantCd: '', // 사업장 코드
      safCheckTypeCd: null, // 점검종류
      deptCd: '', // 점검주관부서
      safFacilChkTitle: '', // 점검명
      chkStepCd: '', // 점검진행상태
      createUserId: '', // 등록자 ID
      createUserNm: '',
      pDeptCd: '', // 점검수행부서
      createUser: '',
      createDept: '',
      createDeptCd: '',
      createDeptNm: '',
      createDt: '', // 등록일
      facilChkResults: [],
      chngNum: '', // 변경발의번호
      safChngNo: 0,
    },

    popupOptions: {
      target: null,
      title: '',
      visible: false,
      param: null,
      width: '85%',
      top: '50px',
      closeCallback: null,
    },
    gridOptions: {
      name: 'failChkPlanDetail',
      header: [],
      data: [],
      height: '350',
    },
    comboCheckTypeItems: [], // 점검종류
    selectValue: [],
    YAuiGrid: null,
  }),
  watch: {},
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    if (this.popupParam.safFacilChkNo && this.popupParam.safFacilChkNo > 0) {
      this.getPlanDetail();
    }
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;

      this.facilChkPlan.createUserNm = this.$store.getters.name;
      this.facilChkPlan.createDt = this.$comm.getToday();

      // URL Settings
      this.searchUrl = selectConfig.saf.facilChkPlan.get.url;
      this.editUrl = transactionConfig.saf.facilChkPlan.edit.url;
      this.insertUrl = transactionConfig.saf.facilChkPlan.insert.url;
      this.deleteUrl = transactionConfig.saf.facilChkPlan.delete.url;

      this.$comm.getComboItems('SAF_FACILITY_CHECK', false).then((_result) => {
        this.comboCheckTypeItems = _result;
      });
      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001597'),
          dataField: 'safFacilityTypeNm',
          width: '11%',
          style: 'left-align',
        }, // 설비유형
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000515'),
          dataField: 'processNm',
          width: '11%',
          style: 'left-align',
        }, // 공정
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001618'),
          dataField: 'safFacilityCd',
          width: '11%',
          style: 'center-align',
        }, // 설비코드
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001596'),
          dataField: 'facilityNm',
          width: '11%',
          style: 'left-align',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        }, // 설비명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000590'),
          dataField: 'facilityMgrNum',
          width: '11%',
          style: 'center-align',
        }, // 관리번호
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002549'),
          dataField: 'tDeptNm',
          width: '11%',
          style: 'center-align',
        }, // 점검대상부서
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004852'),
          dataField: 'createDeptNm',
          width: '11%',
          style: 'left-align',
          renderer: {
            type: 'IconRenderer',
            iconPosition: 'aisleRight',
            iconWidth: 20,
            iconHeight: 20,
            iconFunction: (rowIndex, columnIndex, value, item) => {
              if (this.editable && !this.disabled) {
                return searchIcon;
              }
            },
            onClick: (event) => {
              this.btnSearchDeptClicked(event);
            },
          },
        }, // 점검수행부서
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004853'),
          dataField: 'createUserNm',
          width: '11%',
          style: 'left-align',
          renderer: {
            type: 'IconRenderer',
            iconPosition: 'aisleRight',
            iconWidth: 20,
            iconHeight: 20,
            iconFunction: (rowIndex, columnIndex, value, item) => {
              if (this.editable && !this.disabled) {
                return searchIcon;
              }
            },
            onClick: (event) => {
              this.btnSearchUserClicked(event);
            },
          },
        }, // 점검수행자
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002564'),
          dataField: 'safFacilityCheckSchYmd',
          width: '11%',
          style: 'center-align',
          editRenderer: {
            type: 'CalendarRenderer',
            onlyCalendar: true,
            defaultFormat: 'yyyy-mm-dd',
          },
        },
      ]; // 점검예정일

      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002892'),
          color: 'orange',
          btnClicked: 'openPopup',
          visible: this.editable && !this.disabled,
        }, // 추가
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002620'),
          color: 'red',
          btnClicked: 'btnDeleteFacilityClickedCallback',
          btnClickedError: 'btnClickedErrorCallback',
          visible: this.editable && !this.disabled,
        }, //  제외
      ];

      if (this.popupParam.safFacilChkNo && this.popupParam.safFacilChkNo > 0) {
        this.getPlanDetail();
      }
    },
    getPlanDetail() {
      this.$http.url = this.$format(
        this.searchUrl,
        this.popupParam.safFacilChkNo
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.facilChkPlan = _result.data;
          this.gridOptions.data = [];
          if (
            this.facilChkPlan.facilChkResults &&
            this.facilChkPlan.facilChkResults.length > 0
          ) {
            this.$_.forEach(_result.data.facilChkResults, (item) => {
              let pushData = {
                safFacilityTypeNm: item.safFacilityTypeNm,
                safFacilityTypeCd: item.safFacilityTypeCd,
                processNm: item.processNm,
                safFacilityCd: item.safFacilityCd,
                facilityNm: item.facilityNm,
                facilityMgrNum: item.facilityMgrNum,
                tDeptNm: item.tDeptNm,
                createDeptCd: item.pDeptCd,
                createDeptNm: item.pDeptNm,
                createUserId: item.userId,
                createUserNm: item.userNm,
                safFacilityCheckSchYmd: item.safFacilityCheckSchYmd,
              };
              this.gridOptions.data.push(pushData);
              // this.YAuiGrid = this.gridOptions.data;
            });
          }

          this.insertMode = false;
          this.updateMode = true;

          if (
            this.facilChkPlan.chkStepCd === 'CHS01' &&
            this.facilChkPlan.bizApprStepCd !== 'BAPSA'
          ) {
            // 상태가 '계획'이고 결재중이 아닐때만 작성 가능
            this.disabled = false;
          } else {
            this.disabled = true;
          }

          if (this.popupParam.isSearch) {
            this.disabled = true;
          }
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

            // for (let i = 0; i < items.length; i++) {
            //   if (!items[i].createDept.deptCd) {
            //     window.getApp.$emit('ALERT', {
            //       title: 'L0000003395',
            //       message: 'M0000001583',
            //       // 부서는 필수 지정되야 합니다.
            //       type: 'warning', // success / info / warning / error
            //     });
            //     return;
            //   }
            //   if (!items[i].safFacilityCheckSchYmd) {
            //     window.getApp.$emit('ALERT', {
            //       title: 'L0000003395',
            //       message: 'M0000000727',
            //       // 점검예정일은 필수 지정되야 합니다.
            //       type: 'warning', // success / info / warning / error
            //     });
            //     return;
            //   }
            // }
            console.log('1111111', this.gridOptions.data);
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321',
              message: 'M0000000011', // 저장하시겠습니까?
              // TODO : 필요시 추가하세요.
              type: 'info', // success / info / warning / error
              // 확인 callback 함수
              confirmCallback: () => {
                this.facilChkPlan.createUserId = this.$store.getters.token;
                this.facilChkPlan.updateUserId = this.$store.getters.token;
                this.facilChkPlan.facilChkResults = this.YAuiGrid.getGridData();

                // this.$_.forEach(this.facilChkPlan.facilChkResults, (item) => {
                //   console.log('123123123', item);
                //   item.createUserId = item.createUser;
                //   item.createDeptCd = item.createDept;
                // });
                if (this.facilChkPlan.safCheckTypeCd !== 'INSBO') {
                  this.facilChkPlan.chngNum = '';
                  this.facilChkPlan.safChngNo = 0;
                }

                if (flag === 'insert') this.isInsert = true;
                else if (flag === 'edit') this.isEdit = true;
              },
              // 취소 callback 함수
              cancelCallback: () => {},
            });
          } else if (!_result) {
            this.$popupRequired.check(
              'facilChkPlanDetail',
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
      this.$emit('closePopup', {});
    },
    /** button 관련 이벤트 **/
    openPopup() {
      if (!this.facilChkPlan.safCheckTypeCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: 'M0000000728',
          // 점검종류를 선택하세요.
          type: 'warning', // success / info / warning / error
        });
      } else {
        this.popupOptions.target = () =>
          import(`${'../../baseInfo/facility/facilityMstPopup.vue'}`);
        this.popupOptions.title = 'L0000003680';
        this.popupOptions.width = '85%';
        // 설비 추가
        this.popupOptions.param = {
          // 설비 추가 팝업에서 점검설비 목록에 있는 데이터를 넘기지 않음
          // 따라서 제외는 제외버튼을 통해 제외
          selectedFacilityMstValue: [],
          safCheckTypeCd: this.facilChkPlan.safCheckTypeCd,
          plantCd: this.facilChkPlan.plantCd,
        };
        this.popupOptions.visible = true;
        this.popupOptions.closeCallback = this.closeFacilityPopup;
      }
    },
    closeFacilityPopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data === 'CLOSE') return;
      // 데이터의 타입이 배열이 아닌 알 수 없는값으로 표기 될 시에 배열로 초기화
      if (!this.gridOptions.data) {
        this.gridOptions.data = [];
      }
      this.$_.forEach(data, (facility) => {
        // 점검설비 목록에 선택되어져 온 설비를 바인딩한다.
        let index = this.$_.findIndex(this.gridOptions.data, {
          safFacilityCd: facility.safFacilityCd,
        });
        // 팝업창에서 선택한 값이 기존에 없는 값이라면 점검설비목록에 추가한다.
        if (index === -1) {
          this.gridOptions.data.splice(0, 0, {
            safFacilityTypeNm: facility.safFacilityTypeNm,
            safFacilityTypeCd: facility.safFacilityTypeCd,
            processNm: facility.processNm,
            safFacilityCd: facility.safFacilityCd,
            facilityNm: facility.facilityNm,
            facilityMgrNum: facility.facilityMgrNum,
            tDeptNm: facility.deptNm,
            createUserId: '',
            createDeptCd: '',
            safFacilityCheckSchYmd: '',
          });
        } else {
          // 기존에 있는 데이터의 경우에는 데이터를 추가하지 않고 그대로 놔둔다.
        }
      });
    },
    btnClickedErrorCallback(_result) {
      // this.isInsert = false;
      // this.isEdit = false;
      // this.isComplete = false;
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    btnAppr() {
      this.popupOptions.target = () =>
        import(`${'@/pages/manage/appr/comApprRequest.vue'}`);
      this.popupOptions.title = 'L0000003418'; // 결재요청
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closeApprPop;
      this.popupOptions.width = '80%';
      this.popupOptions.param = {
        apprBizCd: 'SA_FC-01',
        apprParams: {
          safFacilChkNo: this.popupParam.safFacilChkNo,
        },
      };
    },
    closeApprPop(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getPlanDetail();
    },
    btnInsertClickedCallback(_result) {
      this.popupParam.safFacilChkNo = _result.data;
      this.facilChkPlan.safFacilChkNo = _result.data;
      this.isInsert = false;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395',
        message: 'M0000000006',
        type: 'success', // success / info / warning / error
      });
      this.getPlanDetail();
    },
    btnEditClickedCallback(_result) {
      this.isEdit = false;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395',
        message: 'M0000000006',
        type: 'success', // success / info / warning / error
      });
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
            this.facilChkPlan.safFacilChkNo
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
    btnDeleteFacilityClickedCallback(_result) {
      const selectValue = this.YAuiGrid.getCheckedRowItems();
      if (selectValue <= 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: 'M0000000092',
          // 설비목록에서 설비를 한개이상 선택하세요.
          type: 'warning', // success / info / warning / error
        });
        return;
      } else {
        window.getApp.$emit('CONFIRM', {
          title: 'L0000003321',
          message: 'M0000000093',
          // 제외하시겠습니까?
          type: 'info', // success / info / warning / error
          // 확인 callback 함수
          confirmCallback: () => {
            let gridData = this.YAuiGrid.getGridData();
            this.$_.forEach(selectValue, (item) => {
              gridData = this.$_.reject(gridData, {
                safFacilityCd: item.item.safFacilityCd,
              });
            });
            this.YAuiGrid.setGridData(gridData);

            window.getApp.$emit('ALERT', {
              title: 'L0000003395',
              message: 'M0000000686', // 제외되었습니다.
              type: 'success', // success / info / warning / error
            });
          },
          // 취소 callback 함수
          cancelCallback: () => {},
        });
      }
    },
    btnDeleteFacilityClickedCallback1(_result) {
      if (this.selectValue.length <= 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: 'M0000000092',
          // 설비목록에서 설비를 한개이상 선택하세요.
          type: 'warning', // success / info / warning / error
        });
        return;
      } else {
        window.getApp.$emit('CONFIRM', {
          title: 'L0000003321',
          message: 'M0000000093',
          // 제외하시겠습니까?
          type: 'info', // success / info / warning / error
          // 확인 callback 함수
          confirmCallback: () => {
            this.$_.forEach(this.selectValue, (item) => {
              this.gridOptions.data = this.$_.reject(this.gridOptions.data, {
                safFacilityCd: item.safFacilityCd,
              });
            });
          },
          // 취소 callback 함수
          cancelCallback: () => {},
        });
      }
    },
    searchMoc() {
      this.popupOptions.param = {
        plantCd: this.facilChkPlan.plantCd,
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
        this.facilChkPlan.chngNum = data.chngNum;
        this.facilChkPlan.safChngNo = data.safChngNo;
      }
    },
    removeMoc() {
      this.facilChkPlan.chngNum = '';
      this.facilChkPlan.safChngNo = 0;
    },
    cellClickHandler(event) {
      if (event.dataField !== 'facilityNm') return;
      this.popupOptions.param = {
        plantCd: this.facilChkPlan.plantCd,
        safCheckTypeCd: this.facilChkPlan.safCheckTypeCd,
        safFacilityTypeCd: event.item.safFacilityTypeCd,
      };
      this.popupOptions.target = () =>
        import(`${'./facilityCheckItemPopup.vue'}`);
      this.popupOptions.title = '설비유형 점검항목';
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      this.popupOptions.closeCallback = this.closeMocPopup;
    },
    btnSearchUserClicked(event) {
      this.popupOptions.target = () =>
        import(`${'@/pages/manage/user/userSearch.vue'}`);
      this.popupOptions.param = {
        plantCd: this.facilChkPlan.plantCd,
        deptCd: event.item.deptCd,
      };
      this.popupOptions.selectedRowInfo = event;

      this.popupOptions.title = '사용자검색';
      this.popupOptions.visible = true;
      this.popupOptions.width = '60%';
      this.popupOptions.top = '100px';
      this.popupOptions.closeCallback = this.closePopupSearchUser;
    },
    closePopupSearchUser(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      if (data.user) {
        const rowIndex = this.popupOptions.selectedRowInfo.rowIndex;
        this.gridOptions.data[rowIndex].createUserId = data.user.userId;
        this.gridOptions.data[rowIndex].createUserNm = data.user.userNm;
      }
    },
    btnSearchDeptClicked(event) {
      this.popupOptions.target = () =>
        import(`${'@/pages/baseInfo/deptManage/deptSearchPopup.vue'}`);
      this.popupOptions.param = {
        plantCd: this.facilChkPlan.plantCd,
        deptCd: event.item.deptCd,
      };
      this.popupOptions.selectedRowInfo = event;

      this.popupOptions.title = 'L0000001287'; // 부서
      this.popupOptions.visible = true;
      this.popupOptions.width = '60%';
      this.popupOptions.top = '100px';
      this.popupOptions.closeCallback = this.closePopupSearchDept;
    },
    closePopupSearchDept(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      if (data.dept) {
        const rowIndex = this.popupOptions.selectedRowInfo.rowIndex;
        this.gridOptions.data[rowIndex].createDeptCd = data.dept.deptCd;
        this.gridOptions.data[rowIndex].createDeptNm = data.dept.deptNm;
      }
    },
    cellEditEndHandler() {
      this.facilChkPlan.facilChkResults = this.YAuiGrid.getGridData();
    },
    /** end button 관련 이벤트 **/
  },
};
</script>
