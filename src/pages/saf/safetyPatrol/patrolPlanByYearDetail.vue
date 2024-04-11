<!--
  목적 : 연간순회점검계획 - 연간순회점검계획 등록
  Detail : 연간순회점검계획 등록/수정 화면
  etg
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
            <!-- 연간순회점검계획 상세 -->
            <y-label
              label="L0000001979"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 완료 -->
              <y-btn
                v-if="popupParam.patrolMstNo > 0 && editable && !complete"
                color="black"
                title="L0000002039"
                @beforeComplete="openAppr"
                @btnClicked="btnComplete"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 저장 -->
              <y-btn
                v-if="editable && !complete"
                :action-url="saveUrl"
                :param="patrolPlan"
                :is-submit="isSave"
                title="L0000002474"
                color="orange"
                :action-type="actionType"
                beforeSubmit="beforeSave"
                @beforeSave="beforeSave"
                @btnClicked="btnSaveClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 삭제 -->
              <y-btn
                v-if="popupParam.patrolMstNo > 0 && editable && !complete"
                color="red"
                title="L0000001495"
                @btnClicked="btnDeleteClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <y-btn title="L0000000881" @btnClicked="closePopup" />
              <!-- 닫기 -->
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
                :disabled="popupParam.patrolMstNo > 0"
                name="plantCd"
                v-model="patrolPlan.plantCd"
                v-validate="'required'"
                :state="validateState('plantCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 순회주관부서 -->
              <y-tree-dept
                :editable="editable"
                :required="true"
                label="L0000001721"
                name="deptCd"
                :disabled="complete"
                :plantCd="patrolPlan.plantCd"
                v-model="patrolPlan.deptCd"
                v-validate="'required'"
                :state="validateState('deptCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 점검종류 상세 -->
              <y-select
                :width="8"
                :required="true"
                :comboItems="patrolTypeItems"
                :disabled="complete"
                :editable="editable"
                itemText="safCheckKindNm"
                itemValue="safCheckKindNo"
                ui="bootstrap"
                name="safCheckKindNo"
                label="L0000003718"
                v-model="patrolPlan.safCheckKindNo"
                v-validate="'required'"
                :state="validateState('safCheckKindNo')"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 등록자/등록일 -->
              <y-text
                :width="8"
                :disabled="true"
                ui="bootstrap"
                name="createUserNm"
                label="L0000000978"
                v-model="patrolPlan.createUserNm"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 점검(일정)명 -->
              <y-text
                :width="8"
                :required="true"
                ui="bootstrap"
                name="title"
                label="L0000002535"
                :disabled="complete"
                v-model="patrolPlan.title"
                v-validate="'required'"
                :state="validateState('title')"
              ></y-text>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <b-row>
                <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
                  <!-- 순회대상부서 목록 -->
                  <y-auigrid
                    ref="yAuiGrid2"
                    :name="gridOptions2.name"
                    :headers="gridOptions2.header"
                    :items="gridOptions2.data"
                    :btns="gridOptions2.btns"
                    :height="gridOptions2.height"
                    label="순회대상부서 목록"
                    :useExcelExport="false"
                    :showGridSetSave="true"
                    :useContextMenu="true"
                    :enableRightDownFocus="true"
                    :showGridCtrl="true"
                    :enableSorting="true"
                    @btnDeptAdd="btnDeptAdd"
                    @btnDeptDelete="btnDeptDelete"
                  />
                </b-col>
                <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
                  <!-- 순회 대상 협력업체 목록 -->
                  <y-auigrid
                    ref="yAuiGrid3"
                    :name="gridOptions3.name"
                    :headers="gridOptions3.header"
                    :items="gridOptions3.data"
                    :btns="gridOptions3.btns"
                    :height="gridOptions3.height"
                    label="순회 대상 협력업체 목록"
                    :useExcelExport="false"
                    :showGridSetSave="true"
                    :useContextMenu="true"
                    :enableRightDownFocus="true"
                    :showGridCtrl="true"
                    :enableSorting="true"
                    @btnVendorAdd="btnVendorAdd"
                    @btnVendorDelete="btnVendorDelete"
                  />
                </b-col>
              </b-row>
            </b-col>
          </b-row>
          <el-divider content-position="left">{{
            $comm.getLangSpecInfoLabel('L0000002580')
          }}</el-divider>
          <!-- 점검주기 상세 -->
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 점검주기 -->
              <y-select
                :width="8"
                :editable="editable"
                :disabled="complete"
                :comboItems="comboCycleItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                name="cycle"
                label="L0000002579"
                v-model="searchParam.cycle"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 점검기간 -->
              <y-datepicker
                :width="8"
                :editable="editable"
                :disabled="complete"
                :range="true"
                label="L0000002545"
                name="period"
                v-model="searchParam.period"
              ></y-datepicker>
            </b-col>
          </b-row>
          <!-- 검색 결과 테이블 -->
          <b-row class="mt-3">
            <b-col sm="12">
              <b-col sm="12" class="px-0">
                <y-auigrid
                  ref="yAuiGrid"
                  :name="gridOptions.name"
                  :headers="gridOptions.header"
                  :btns="gridOptions.btns"
                  :height="gridOptions.height"
                  :items="patrolPlan.patrolList"
                  :label="this.$comm.getLangSpecInfoLabel('L0000002540')"
                  :useExcelExport="false"
                  :showGridSetSave="true"
                  :useContextMenu="true"
                  :enableRightDownFocus="true"
                  :showGridCtrl="true"
                  :enableSorting="true"
                  @btnSearchCheckYmdClicked="btnSearchCheckYmdClicked"
                  @btnDeleteCheckYmd="btnDeleteCheckYmd"
                />
              </b-col>
            </b-col>
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
  name: 'patrol-plan-by-year-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        patrolMstNo: 0, // 연간순회점검일련번호
      },
    },
  },
  data() {
    return {
      patrolPlan: {
        patrolMstNo: 0, // 연간순회점검일련번호
        deptCd: null, // 주관부서코드
        deptNm: '', // 주관부서명
        pgpDeptCd: null,
        tgtDeptCd: null,
        arrayCheckSchYmd: [], // 배열된 가능성 있음 (점검일)
        arrayCheckTitle: [], // 배열된 가능성 있음 (점검명)
        updateUserId: '',
        createUserId: '',
        createUserNm: '',
        checkPerd: '', // 점검주기
        checkPlanSYmd: '', // 점검계획시작일
        checkPlanEYmd: '', // 점검계획종료일
        plantCd: '', // 사업장 코드
        title: '', // 점검명
        tgtDeptList: [],
        tgtVendorList: [],
        safCheckKindNo: null,
        patrolList: [],
        apprRqstNo: 0, // 결재 번호
        stepCd: '',
      },
      searchParam: {
        cycle: '', // 점검주기
        period: [], // 점검기간
      },
      gridOptions: {
        header: [],
        data: [],
        height: '350',
      },
      gridOptions2: {
        header: [],
        data: [],
        height: '200',
        selectedValue: [],
      },
      gridOptions3: {
        header: [],
        data: [],
        height: '200',
        selectedValue: [],
      },
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '500px',
        top: '50px',
        param: {},
        closeCallback: null,
      },
      checkItemTempData: [],
      checkYmdValue: [],
      patrolTypeItems: [],
      comboCycleItems: [], // 점검주기
      editable: false,
      complete: false,
      isSave: false,
      isComplete: false,
      actionType: 'POST',
      saveUrl: '',
      insertUrl: '',
      editUrl: '',
      completeUrl: '',
      apprMode: false,
      isCompleteYn: false,
      createDept: {
        deptCd: '',
        deptNm: '',
      },
      YAuiGrid: null,
      YAuiGrid2: null,
      YAuiGrid3: null,
    };
  },
  computed: {
    isAdd() {
      return this.gridOptions3.data && this.gridOptions2.data.length > 0;
    },
    isAdd2() {
      return this.gridOptions3.data && this.gridOptions3.data.length > 0;
    },
    isAdd3() {
      return (
        this.patrolPlan.patrolList && this.patrolPlan.patrolList.length > 0
      );
    },
  },
  watch: {
    'patrolPlan.plantCd'() {
      this.getPatrolKindList();
    },
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.YAuiGrid2 = this.$refs.yAuiGrid2;
    this.YAuiGrid3 = this.$refs.yAuiGrid3;
  },
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      // URL setting
      this.insertUrl = transactionConfig.saf.patrolMst.insert.url;
      this.editUrl = transactionConfig.saf.patrolMst.edit.url;
      this.completeUrl = transactionConfig.saf.patrolMst.complete.url;

      // 점검주기
      this.$comm.getComboItems('SAF_CHECK_CYCLE', false).then((_result) => {
        this.comboCycleItems = _result;
      });
      this.getPatrolKindList(); // 순회종류

      this.gridOptions2.header = [
        {
          headerText: '부서명',
          dataField: 'deptNm',
          width: '100%',
          align: 'center',
        }, // 부서명
      ];
      this.gridOptions2.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001300'),
          color: 'blue',
          btnClicked: 'btnDeptAdd',
          btnClickedError: 'btnClickedError',
          visible: this.editable && !this.complete,
        }, // 부서 추가
        {
          title: this.$comm.getLangSpecInfoLabel('L0000003223'),
          color: 'red',
          btnClicked: 'btnDeptDelete',
          visible: this.editable && this.isAdd && !this.complete,
        }, // 행 삭제
      ];
      this.gridOptions3.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003265'),
          dataField: 'vendorNm',
          width: '100%',
          style: 'center-align',
        }, // 협력업체명
      ];
      this.gridOptions3.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000003255'),
          color: 'blue',
          btnClicked: 'btnVendorAdd',
          btnClickedError: 'btnClickedError',
          visible: this.editable && !this.complete,
        }, // 협력업체 추가
        {
          title: this.$comm.getLangSpecInfoLabel('L0000003223'),
          color: 'red',
          btnClicked: 'btnVendorDelete',
          visible: this.editable && this.isAdd2 && !this.complete,
        }, // 행 삭제
      ];

      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: '순회대상부서/협력업체', //
          dataField: 'tgtNm',
          width: '25%',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004852'),
          dataField: 'temptDept',
          width: '25%',
          style: 'center-align',
          type: 'deptsearch',
        }, // 점검수행부서
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002564'), // 점검예정일
          dataField: 'checkSchYmd',
          width: '25%',
          style: 'center-align',
          type: 'datepicker',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001642'), // 세부점검계획
          dataField: 'checkTitle',
          width: '25%',
          style: 'left-align',
          type: 'text',
        },
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002547'),
          color: 'blue',
          btnClicked: 'btnSearchCheckYmdClicked',
          btnClickedError: 'btnClickedError',
          visible: this.editable && !this.complete,
        }, // 점검기간 생성
        {
          title: this.$comm.getLangSpecInfoLabel('L0000003223'),
          color: 'red',
          btnClicked: 'btnDeleteCheckYmd',
          visible: this.editable && this.isAdd2 && !this.complete,
        }, // 행 삭제
      ];
      if (this.popupParam.patrolMstNo > 0) {
        // 그리드 헤더 설정
        this.gridOptions.header.splice(0, 0, {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002779'), // 진행상태
          dataField: 'checkPlanStepNm',
          width: '10%',
          style: 'center-align',
        });

        // 상세조회
        this.getScheduleDetail();
      } else {
        this.searchParam.cycle = 'CCY1W';

        // 기간 Setting
        let from = this.$comm.getToday();
        let to = this.$comm.getCalculatedDate(
          from,
          '2m',
          'YYYY-MM-DD',
          'YYYY-MM-DD'
        );
        this.searchParam.period = [from, to];

        // 등록자 setting
        this.patrolPlan.createUserNm =
          this.$store.getters.name + ' / ' + this.$comm.getToday();
      }
    },
    // 상세 조회
    getScheduleDetail() {
      this.$http.url = this.$format(
        selectConfig.saf.patrolMst.get.url,
        this.popupParam.patrolMstNo
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.$_.extend(this.patrolPlan, _result.data);
          this.searchParam.cycle = this.patrolPlan.checkPerd;
          this.searchParam.period = [
            _result.data.checkPlanSYmd,
            _result.data.checkPlanEYmd,
          ];
          this.$_.forEach(this.patrolPlan.patrolList, (item) => {
            if (item.pgpDeptCd) {
              item.createDept = {
                deptCd: item.pgpDeptCd,
                deptNm: item.pgpDeptNm,
              };
              item.temptDept = item.pgpDeptNm;
            } else {
              item.createDept = {
                deptCd: '',
                deptNm: '',
              };
            }
          });
          this.patrolPlan.createUserNm =
            this.patrolPlan.createUserNm + '/' + this.patrolPlan.year; // 등록자 setting

          // 아직 결재상태를 구현하지않았기때문에 상태값을 주기위해 임시적으로 9999넣음
          // 결재를 넣으면 수정할 예정
          if (
            this.patrolPlan.stepCd === 'COMPLT' ||
            this.patrolPlan.apprRqstNo === 9999
          ) {
            this.complete = true;
          }

          this.gridOptions2.data = [];
          this.gridOptions3.data = [];
          if (
            this.patrolPlan.patrolList &&
            this.patrolPlan.patrolList.length > 0
          ) {
            this.$_.forEach(this.patrolPlan.patrolList, (checkSchedule) => {
              if (
                checkSchedule.isDept === 'Y' &&
                this.$_.findIndex(this.gridOptions2.data, [
                  'deptCd',
                  checkSchedule.tgtCd,
                ]) <= -1
              ) {
                this.gridOptions2.data.push({
                  deptCd: checkSchedule.tgtCd,
                  deptNm: checkSchedule.tgtNm,
                });
              }
            });
            this.YAuiGrid2.setGridData(this.$_.clone(this.gridOptions2.data));
            this.$_.forEach(this.patrolPlan.patrolList, (checkSchedule) => {
              if (
                checkSchedule.isDept === 'N' &&
                this.$_.findIndex(this.gridOptions3.data, [
                  'vendorCd',
                  checkSchedule.tgtCd,
                ]) <= -1
              ) {
                this.gridOptions3.data.push({
                  vendorCd: checkSchedule.tgtCd,
                  vendorNm: checkSchedule.tgtNm,
                });
              }
            });
            this.YAuiGrid3.setGridData(this.$_.clone(this.gridOptions3.data));

            // 수정가능 상태 확인
            if (this.patrolPlan.stepCd === 'COMPLT') {
              // 그리드 헤더 설정
              this.gridOptions.header = [
                {
                  headerText: this.$comm.getLangSpecInfoLabel('L0000002779'), // 진행상태
                  dataField: 'checkPlanStepNm',
                  width: '10',
                  style: 'center-align',
                },
                {
                  headerText: this.$comm.getLangSpecInfoLabel('L0000002549'), // 점검대상부서
                  dataField: 'tgtNm',
                  width: '10%',
                  style: 'center-align',
                },
                {
                  headerText: this.$comm.getLangSpecInfoLabel('L0000002564'), // 점검예정일
                  dataField: 'checkSchYmd',
                  width: '20%',
                  style: 'center-align',
                },
                {
                  headerText: this.$comm.getLangSpecInfoLabel('L0000001642'), // 세부점검계획
                  dataField: 'checkTitle',
                  width: '20%',
                  style: 'left-align',
                },
              ];
            }
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getPatrolKindList() {
      this.$http.url = selectConfig.saf.checkKind.list.url;
      this.$http.type = 'GET';
      this.$http.param = {
        patrolYn: 'Y',
        chngKind: 'CKC04',
        plantCd: this.patrolPlan.plantCd,
      };
      this.$http.request(
        (_result) => {
          this.patrolTypeItems = this.$_.clone(_result.data);
          this.patrolTypeItems.splice(0, 0, {
            safCheckKindNo: null,
            safCheckKindNm: this.$comm.getLangSpecInfoLabel('L0000003394'), // '선택하세요',
          });
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /** 점검기간  목록 조회 **/
    btnSearchCheckYmdClicked() {
      /**
       * 2020-02-09 KDH
       * 점검기간을 생성하기 앞서 점검기간 목록에 데이터가 들어 있는 경우
       * 새롭게 점검계획이 생성됨으로 기존에 입력/저장된 목록은 지워집니다. 라는 컨펌창을 보여주게 변경
       * 위의 내용은 점검종류, 점검주기, 점검기간, 점검대상부서에 대해 유효성 체크를 끝낸 후 만들기 직전에 처리
       */
      if (!this.searchParam.cycle) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000061', // 점검주기를 선택해주세요.,
          type: 'warning', // success / info / warning / error
        });
        return;
      }
      if (!this.searchParam.period || this.searchParam.period.length <= 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000062', // 점검기간을 선택해주세요.
          type: 'warning', // success / info / warning / error
        });
        return;
      }
      if (
        this.gridOptions3.data.length <= 0 &&
        this.gridOptions2.data.length <= 0
      ) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000063', // 점검대상부서/협력업체중 하나 이상 선택해주세요.
          type: 'warning', // success / info / warning / error
        });
        return;
      }
      if (this.patrolPlan.patrolList && this.patrolPlan.patrolList.length > 0) {
        window.getApp.$emit('CONFIRM', {
          title: 'L0000003321', // '확인',
          message: 'M0000000064', // 새롭게 점검계획이 생성됨으로 기존에 입력/저장된 목록은 지워집니다. 진행하시겠습니까?
          type: 'info', // success / info / warning / error
          confirmCallback: () => {
            this.createSchedule();
          },
          cancelCallback: () => {},
        });
      } else {
        this.createSchedule();
      }
    },
    createSchedule() {
      var gapOfDate = '';
      switch (this.searchParam.cycle) {
        case 'CCY1W':
          gapOfDate = '7d'; // 1주
          break;
        case 'CCY1M':
          gapOfDate = '1m'; // 1달
          break;
        case 'CCYPD':
          gapOfDate = '3m'; // 분기
          break;
        case 'CCYHY':
          gapOfDate = '6m'; // 반기
          break;
        case 'CCY1Y':
          gapOfDate = '1y'; // 1년
          break;
        default:
        // code block
      }
      var startDate = this.searchParam.period[0];
      var endDate = this.searchParam.period[1];
      var date = new Date();
      var safCheckKindNm = this.patrolPlan.title;
      var gridData = [];

      while (
        this.$comm.getDatediff(
          this.$comm.moment(startDate),
          this.$comm.moment(endDate)
        ) >= 0
      ) {
        for (let i in this.gridOptions2.data) {
          gridData.push({
            tgtCd: this.gridOptions2.data[i].deptCd,
            tgtNm: this.gridOptions2.data[i].deptNm,
            checkSchYmd: startDate,
            checkTitle: safCheckKindNm + '(' + startDate + ')',
            isDept: 'Y',
            createDept: {
              deptCd: this.$store.getters.deptCd,
              deptNm: this.$store.getters.deptNm,
            },
            temptDept: this.$store.getters.deptNm,
          });
        }
        for (let i in this.gridOptions3.data) {
          gridData.push({
            tgtCd: this.gridOptions3.data[i].vendorCd,
            tgtNm: this.gridOptions3.data[i].vendorNm,
            checkSchYmd: startDate,
            checkTitle: safCheckKindNm + '(' + startDate + ')',
            isDept: 'N',
            createDept: {
              deptCd: this.$store.getters.deptCd,
              deptNm: this.$store.getters.deptNm,
            },
            temptDept: this.$store.getters.deptNm,
          });
        }
        startDate = this.$comm.getCalculatedDate(
          startDate,
          gapOfDate,
          'YYYY-MM-DD',
          'YYYY-MM-DD'
        );
      }
      this.patrolPlan.patrolList = this.$_.clone(gridData);
    },
    btnDeleteCheckYmd() {
      if (!this.checkYmdValue || this.checkYmdValue.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000073', // 점검계획을 하나 이상 선택해주세요.
          type: 'warning', // success / info / warning / error
        });
      } else {
        this.$_.forEach(this.checkYmdValue, (item) => {
          this.patrolPlan.patrolList = this.$_.reject(
            this.patrolPlan.patrolList,
            item
          );
        });
      }
    },
    selectedCheck() {
      return this.editable;
    },
    /** 신규등록 하기전 UI단 유효성 검사 **/
    beforeComplate() {
      this.isCompleteYn = true;
      if (this.popupParam.patrolMstNo > 0) {
        this.actionType = 'PUT';
        this.saveUrl = this.$_.clone(this.editUrl);
      } else {
        this.actionType = 'POST';
        this.saveUrl = this.$_.clone(this.insertUrl);
      }
      this.save();
    },
    beforeSave() {
      if (this.popupParam.patrolMstNo > 0) {
        this.actionType = 'PUT';
        this.saveUrl = this.$_.clone(this.editUrl);
        this.isCompleteYn = true;
      } else {
        this.actionType = 'POST';
        this.saveUrl = this.$_.clone(this.insertUrl);
      }
      this.check();
    },
    check() {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            if (
              this.patrolPlan.patrolList &&
              this.patrolPlan.patrolList.length <= 0
            ) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395', // '안내',
                message: 'M0000000065', // 점검계획은 최소 1개 이상 필수 지정되야 합니다.
                type: 'warning', // success / info / warning / error
              });
              return;
            }

            if (!this.isAppr) {
              window.getApp.$emit('CONFIRM', {
                title: 'L0000003321', // '확인',
                message: 'M0000000011', // 저장하시겠습니까?
                type: 'info', // success / info / warning / error
                confirmCallback: () => {
                  this.save();
                },
                cancelCallback: () => {},
              });
            } else {
              this.save();
            }
          } else if (!_result) {
            this.$popupRequired.check(
              'patrolPlanbyYearDetail',
              this.$data,
              this.errors
            );
          }
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000881' // 유효성 검사도중 에러가 발생하였습니다.
          );
          this.isSave = false;
        });
    },
    save() {
      this.patrolPlan.createUserId = this.$store.getters.token;
      this.patrolPlan.updateUserId = this.$store.getters.token;
      this.patrolPlan.stepCd = 'ING';

      if (this.popupParam.patrolMstNo === 0) {
        this.patrolPlan.year = this.$comm.getToday();
      }

      this.patrolPlan.checkPerd = this.$_.clone(this.searchParam.cycle);
      this.patrolPlan.checkPlanSYmd = this.searchParam.period[0];
      this.patrolPlan.checkPlanEYmd = this.searchParam.period[1];

      this.$_.forEach(this.patrolPlan.patrolList, (item) => {
        item.pgpDeptCd = item.createDept.deptCd;
        item.pgpDeptNm = item.createDept.deptNm;
      });

      this.isSave = true;
    },
    async btnComplete() {
      await this.beforeComplate();
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321', // '확인',
        message: 'M0000000838', // 완료하시겠습니까?
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          this.$http.url = this.$format(
            this.completeUrl,
            this.popupParam.patrolMstNo
          );
          this.$http.type = 'PUT';
          this.$http.request(
            (_result) => {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395', // '안내',
                message: 'M0000000078', // 완료되었습니다.
                type: 'success', // success / info / warning / error
              });
              this.getScheduleDetail();
            },
            (_error) => {
              window.getApp.$emit('APP_REQUEST_ERROR', _error);
            }
          );
        },
        cancelCallback: () => {},
      });
    },
    btnDeleteClickedCallback(_result) {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321', // '확인',
        message: 'M0000000074', // 연간순회점검계획과 생성된 순회점검계획들이 삭제됩니다. 삭제하시겠습니까?
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          this.$http.url = this.$format(
            transactionConfig.saf.patrolMst.delete.url,
            this.popupParam.patrolMstNo
          );
          this.$http.type = 'DELETE';
          this.$http.request(
            (_result) => {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395', // '안내',
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
        cancelCallback: () => {},
      });
    },
    validateState(ref) {
      if (
        this.veeBag[ref] &&
        (this.veeBag[ref].dirty || this.veeBag[ref].validated)
      ) {
        return !this.errors.has(ref);
      }
      return null;
    },
    closePopup(data) {
      this.$emit('closePopup', {});
    },
    openAppr() {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321', // '확인',
        message: 'M0000000718', // 결재요청 전 저장됩니다. 진행하시겠습니까?
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          this.isAppr = true;
          this.actionType = 'PUT';
          this.saveUrl = this.$_.clone(this.editUrl);

          this.check();
        },
        cancelCallback: () => {},
      });
    },
    btnSaveClickedCallback(_result) {
      if (!this.isComplete) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000006', // 저장되었습니다.
          type: 'success', // success / info / warning / error
        });
      } else {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000078', // 완료되었습니다.
          type: 'success', // success / info / warning / error
        });
        this.isComplete = false;
      }

      this.isSave = false;
      this.popupParam.patrolMstNo = _result.data;
      this.getScheduleDetail();

      if (!this.isAppr) {
        if (!this.isCompleteYn) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395', // '안내',
            message: 'M0000000006', // 저장되었습니다.
            type: 'success', // success / info / warning / error
          });
        }
      } else {
        this.isAppr = false;
        this.popupOptions.target = () =>
          import(`${'@/pages/manage/appr/comApprRequest.vue'}`);
        this.popupOptions.title = 'L0000003418'; // 결재요청
        this.popupOptions.visible = true;
        this.popupOptions.closeCallback = this.closeApprPop;
        this.popupOptions.width = '80%';
        this.popupOptions.param = {
          apprBizCd: 'SA-CE-01',
          apprParams: {
            patrolMstNo: this.popupParam.patrolMstNo,
          },
        };
      }
    },
    closeApprPop(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data.resultFlag) {
        this.apprMode = true;
        this.getScheduleDetail();
      }
    },
    btnClickedErrorCallback(_result) {
      this.isSave = false;
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    btnDeptAdd() {
      if (!this.patrolPlan.plantCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000066', // 사업장을 선택하세요.
          type: 'warning',
        });
        return;
      } else {
        this.popupOptions.target = () =>
          import(`${'@/pages/baseInfo/deptManage/deptSearchPopup.vue'}`);
        this.popupOptions.title = 'L0000004281'; // 대상부서 검색
        this.popupOptions.param = {
          multiple: true,
          plantCd: this.patrolPlan.plantCd,
          isSubDeptSelection: true,
        };
        this.popupOptions.width = '35%';
        this.popupOptions.top = '10px';
        this.popupOptions.visible = true;
        this.popupOptions.closeCallback = this.closeDeptPopup;
      }
    },
    closeDeptPopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.$_.forEach(data, (item) => {
        if (item.deptCd) {
          if (!this.$_.find(this.gridOptions2.data, { deptCd: item.deptCd })) {
            let addItem = {
              deptCd: item.deptCd,
              deptNm: item.deptNm,
            };
            if (item.plantCd === this.patrolPlan.plantCd) {
              this.gridOptions2.data.push(addItem);
            }
          }
        }
      });
    },
    btnDeptDelete() {
      if (this.gridOptions2.selectedValue.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003321', // '확인',
          message: 'M0000000068', // 하나 이상 선택하세요
          type: 'warning',
        });
        return;
      }
      this.$_.forEach(this.gridOptions2.selectedValue, (item) => {
        this.gridOptions2.data = this.$_.reject(this.gridOptions2.data, item);
      });
    },
    btnVendorAdd() {
      if (!this.patrolPlan.plantCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000066', // 사업장을 선택하세요.
          type: 'warning',
        });
        return;
      } else {
        this.popupOptions.target = () =>
          import(`${'@/pages/vendor/baseInfo/vendorMaster.vue'}`);
        this.popupOptions.title = 'L0000004283'; // 협력업체 검색
        this.popupOptions.param = {
          plantCd: this.patrolPlan.plantCd,
          popupMode: true,
          multiSelect: true,
        };
        this.popupOptions.width = '80%';
        this.popupOptions.top = '10px';
        this.popupOptions.visible = true;
        this.popupOptions.closeCallback = this.closeVendorPopup;
      }
    },
    closeVendorPopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.$_.forEach(data.data, (item) => {
        if (item.vendorCd) {
          if (
            !this.$_.find(this.gridOptions3.data, { vendorCd: item.vendorCd })
          ) {
            let addItem = {
              vendorCd: item.vendorCd,
              vendorNm: item.vendorNm,
            };
            this.gridOptions3.data.push(addItem);
          }
        }
      });
    },
    btnVendorDelete() {
      if (this.gridOptions3.selectedValue.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003321', // '확인',
          message: 'M0000000068', // 하나 이상 선택하세요
          type: 'warning',
        });
        return;
      }
      this.$_.forEach(this.gridOptions3.selectedValue, (item) => {
        this.gridOptions3.data = this.$_.reject(this.gridOptions3.data, item);
      });
    },
    /** end button 관련 이벤트 **/
    /** 기타 function **/
    confirm(_option) {
      var type = '';
      if (_option.hasOwnProperty('type')) type = _option.type;
      this.$confirm(_option.message, _option.title, {
        confirmButtonText: 'L0000003644', // 예
        cancelButtonText: 'L0000003645', // 아니오
        type: type,
      })
        .then(
          typeof _option.confirmCallback === 'function'
            ? _option.confirmCallback
            : null
        )
        .catch(
          typeof _option.cancelCallback === 'function'
            ? _option.cancelCallback
            : null
        );
    },
    /** /기타 function **/
  },
};
</script>
