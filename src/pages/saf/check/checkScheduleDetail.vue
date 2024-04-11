<!--
  목적 : 안전점검관리 - 점검일정 등록
  Detail : 안전점검일정 등록/수정 화면
           안전점검일정을 점검계획사용여부가 사용으로 지정된 점검종류별로  주관부서와 수행부서들을 지정하고, 점검주기 별로 기간을 지정하여 점검예정일을 지정
           
           **
           2021-05-14 jkl
           현재 화면을 수정할 경우 결재용 vue파일도 같이 현행화 해야함
           checkScheduleDetailAppr.vue
           **
           
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 등록 -->
    <b-row>
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 안전점검일정 -->
            <y-label
              label="L0000001882"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 결재요청 -->
              <y-btn
                v-if="
                  checkResult.safCheckNo &&
                  editable &&
                  !disabled &&
                  checkResult.bizApprStepCd !== 'BAPSD'
                "
                color="black"
                title="L0000003418"
                @btnClicked="openAppr"
              />
              <!-- 저장 -->
              <y-btn
                v-if="!checkResult.safCheckNo && editable && !disabled"
                :action-url="insertUrl"
                :param="checkResult"
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
                v-if="checkResult.safCheckNo && editable && !disabled"
                :action-url="editUrl"
                :param="checkResult"
                :is-submit="isInsert"
                title="L0000002474"
                color="orange"
                action-type="PUT"
                beforeSubmit="beforeInsert"
                @beforeInsert="beforeInsert"
                @btnClicked="btnInsertClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 삭제 -->
              <y-btn
                v-if="checkResult.safCheckNo && editable && !disabled"
                color="red"
                title="L0000001495"
                @btnClicked="btnDeleteClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 닫기 -->
              <y-btn title="L0000000881" @btnClicked="closePopup" />
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col
              v-if="checkResult.safCheckNo && editable && !disabled"
              sm="12"
              md="12"
              lg="12"
              xl="12"
              class="col-xxl-12 mb-2"
            >
              <el-tag size="medium" type="info">
                <!-- 입력된 사업장 정보에 맞추어 주관부서, 대상부서가 선정된 상태임으로 사업장 정보를 바꾸시길 원하시면 현재 일정은 삭제하시고 새로운 일정을 만드십시오. -->
                <i class="el-icon-info"></i>
                {{ $comm.getLangSpecInfoLabel('L0000002290') }}
              </el-tag>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-plant
                type="edit"
                :editable="!checkResult.safCheckNo && editable"
                :required="true"
                :disabled="disabled"
                name="plantCd"
                v-model="checkResult.plantCd"
                v-validate="'required'"
                :state="validateState('plantCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 점검종류 상세 -->
              <y-select
                :width="8"
                :comboItems="comboCheckKindItems"
                :required="true"
                :editable="editable"
                :disabled="disabled"
                itemText="safCheckKindNm"
                itemValue="safCheckKindNo"
                ui="bootstrap"
                type="edit"
                name="safCheckKindNo"
                label="L0000003718"
                v-model="checkResult.safCheckKindNo"
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
                v-model="checkResult.createUserNm"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 점검주관부서 -->
              <y-tree-dept
                :editable="editable"
                :disabled="disabled"
                :required="true"
                label="L0000002578"
                name="deptCd"
                :plantCd="checkResult.plantCd"
                v-model="checkResult.deptCd"
                v-validate="'required'"
                :state="validateState('deptCd')"
              />
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <!-- 점검(일정)명 -->
              <y-text
                :width="10"
                :editable="editable"
                :disabled="disabled"
                :required="true"
                ui="bootstrap"
                name="checkMasterTitle"
                label="L0000002535"
                v-model="checkResult.checkMasterTitle"
                v-validate="'required'"
                :state="validateState('checkMasterTitle')"
              ></y-text>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <b-row>
                <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
                  <!-- 점검대상부서 목록 -->
                  <y-auigrid
                    ref="yAuiGrid"
                    :height="tgtDeptGridOptions.height"
                    :headers="tgtDeptGridOptions.header"
                    :btns="tgtDeptGridOptions.btns"
                    :items="tgtDeptGridOptions.data"
                    :editable="editable && !disabled"
                    :label="this.$comm.getLangSpecInfoLabel('L0000002530')"
                    :useExcelExport="false"
                    :enableSorting="true"
                    :showGridSetSave="true"
                    :useContextMenu="true"
                    :enableRightDownFocus="true"
                    :showGridCtrl="true"
                    :softRemoveRowMode="false"
                    :showRowCheckColumn="true"
                    @btnDeptAdd="btnDeptAdd"
                    @btnDeptDelete="btnDeptDelete"
                  />
                </b-col>
              </b-row>
            </b-col>
          </b-row>
          <!-- 점검계획 상세 -->
          <el-divider content-position="left">{{
            $comm.getLangSpecInfoLabel('L0000002541')
          }}</el-divider>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 점검주기 -->
              <y-select
                :width="8"
                :disabled="disabled"
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
                :disabled="disabled"
                :range="true"
                label="L0000002545"
                name="period"
                :default="searchParam.period"
                v-model="searchParam.period"
              ></y-datepicker>
            </b-col>
          </b-row>
          <!-- 검색 결과 테이블 -->
          <b-row class="mt-3">
            <b-col sm="12">
              <b-col sm="12" class="px-0">
                <!-- 점검계획 목록 -->
                <y-auigrid
                  ref="yAuiGrid2"
                  :editable="editable && !disabled"
                  :height="gridOptions.height"
                  :headers="gridOptions.header"
                  :items="gridOptions.data"
                  :btns="gridOptions.btns"
                  :label="this.$comm.getLangSpecInfoLabel('L0000002540')"
                  :useExcelExport="false"
                  :enableSorting="true"
                  :showGridSetSave="true"
                  :useContextMenu="true"
                  :enableRightDownFocus="true"
                  :showGridCtrl="true"
                  :showRowCheckColumn="true"
                  :softRemoveRowMode="false"
                  @btnSearchCheckYmdClicked="btnSearchCheckYmdClicked"
                  @LineDelete="LineDelete"
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
  name: 'check-schedule-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        safCheckNo: 0, // 안전점검일련번호
      },
    },
  },
  data() {
    return {
      checkResult: {
        safCheckNo: 0, // 안전점검결과번호
        safCheckNos: [],
        tempTgtDeptCd: [],
        arrayTgtDeptCd: [],
        tgtDeptCd: '', // 대상부서코드
        tgtDeptNm: '', // 대상부서명
        deptCd: null, // 주관부서코드
        deptNm: '', // 주관부서명
        safCheckKindNo: null, // 점검종류번호
        safCheckKindNm: '', // 점검종류명
        arrayCheckSchYmd: [], // 배열된 가능성 있음 (점검일)
        arrayCheckTitle: [], // 배열된 가능성 있음 (점검명)
        updateUserId: '',
        createUserId: '',
        createUserNm: '',
        createDept: {
          deptCd: '',
          deptNm: '',
        },
        safCheckPerd: '', // 점검주기
        safCheckPlanSymd: '', // 점검계획시작일
        safCheckPlanEymd: '', // 점검계획종료일
        plantCd: '', // 사업장 코드
        checkMasterTitle: '', // 점검명
        checkScheduleList: [], // 안전점검일정 목록
        apprRqstNo: 0, // 결재 번호
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
      tgtDeptGridOptions: {
        header: [],
        data: [],
        height: '200',
      },
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '80%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      checkItemData: [],
      editable: false,
      isInsert: false,
      isComplete: false,
      comboCheckKindItems: [], // 점검종류
      comboCycleItems: [], // 점검주기
      insertUrl: '',
      editUrl: '',
      completeUrl: '',
      checkYmdValue: [],
      disabled: false,
      selectedValue: [],
      authGrpSubDeptUrl: '',
      YAuiGrid: null,
      YAuiGrid2: null,
    };
  },
  watch: {
    'checkResult.plantCd'() {
      this.getComboCheckKindItems();
    },
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.YAuiGrid2 = this.$refs.yAuiGrid2;
  },
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      // URL setting
      this.insertUrl = transactionConfig.saf.checkSchedule.insert.url;
      this.editUrl = transactionConfig.saf.checkSchedule.edit.url;
      this.completeUrl = transactionConfig.saf.checkSchedule.complete.url;

      // 선택된 부서의 하위부서 조회
      this.authGrpSubDeptUrl = selectConfig.authGrpPlantDept.authGrpSubDept.url;

      this.checkResult.safCheckNo = this.popupParam.safCheckNo;

      // 점검주기
      this.$comm.getComboItems('SAF_CHECK_CYCLE', false).then((_result) => {
        this.comboCycleItems = _result;
        // 점검주기 기본값 설정 필요시 주석해제하여 사용
        // this.searchParam.cycle = 'CCY1W';
      });

      this.getComboCheckKindItems(); // 점검종류
      this.tgtDeptGridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002892'),
          color: 'blue',
          btnClicked: 'btnDeptAdd',
          visible: this.editable && !this.disabled,
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001495'),
          color: 'red',
          btnClicked: 'btnDeptDelete',
          visible: this.editable && !this.disabled,
        },
      ];

      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002547'), // 점검기간 생성
          color: 'blue',
          btnClicked: 'btnSearchCheckYmdClicked',
          visible: !this.disabled,
        },
        {
          title: '행삭제',
          color: 'red',
          btnClicked: 'LineDelete',
          visible: !this.disabled,
        },
      ];

      this.tgtDeptGridOptions.header = [
        // 부서
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001287'),
          dataField: 'deptNm',
          width: '100%',
          align: 'center',
        },
        {
          headerText: 'deptCd',
          dataField: 'deptCd',
          visible: false,
        },
      ];

      if (this.checkResult.safCheckNo && this.checkResult.safCheckNo > 0) {
        // 수정
        this.gridOptions.header = [
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000002779'),
            dataField: 'checkStepNm',
            width: '25%',
            style: 'center-align',
          }, // 진행상태
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000002549'),
            dataField: 'tgtDeptNm',
            width: '25%',
            style: 'center-align',
          }, // 점검대상부서
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000004852'),
            dataField: 'createDept',
            width: '25%',
            style: 'center-align',
            // type: 'deptsearch',
          }, // 점검수행부서
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000002564'),
            dataField: 'checkSchYmd',
            width: '25%',
            style: 'center-align',
            type: 'datepicker',
          }, // 점검예정일
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000001642'),
            dataField: 'checkTitle',
            width: '25%',
            style: 'left-align',
            type: 'text',
          }, // 세부점검계획
        ];

        // 상세조회
        this.getDetail();
      } else {
        // 신규등록
        this.gridOptions.header = [
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000002549'),
            dataField: 'tgtDeptNm',
            width: '33%',
            style: 'center-align',
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000002564'),
            dataField: 'checkSchYmd',
            width: '33%',
            style: 'center-align',
            type: 'datepicker',
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000001642'),
            dataField: 'checkTitle',
            width: '34%',
            style: 'left-align',
            type: 'text',
          },
        ];

        // 기간 Setting
        let from = this.$comm.getToday();
        let to = this.$comm.getCalculatedDate(
          from,
          '2m',
          'YYYY-MM-DD',
          'YYYY-MM-DD'
        );
        this.searchParam.period = [from, to];

        // 등록자/등록일
        this.checkResult.createUserNm =
          this.$store.getters.name + ' / ' + this.$comm.getToday();
      }
    },
    // 상세 조회
    getDetail() {
      this.$http.url = this.$format(
        selectConfig.saf.checkSchedule.get.url,
        this.checkResult.safCheckNo
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.$_.extend(this.checkResult, _result.data);
          this.searchParam.cycle = _result.data.safCheckPerd;
          this.searchParam.period = [
            _result.data.safCheckPlanSymd,
            _result.data.safCheckPlanEymd,
          ];
          // 등록자/등록일
          this.checkResult.createUserNm =
            this.checkResult.createUserNm + '/' + this.checkResult.createDt;

          if (this.checkResult.bizApprStepCd) {
            if (this.checkResult.bizApprStepCd === 'BAPSD') {
              // 반려(BAPSD)일때 수정가능
              this.disabled = false;
            } else {
              // 결재중(BAPSA), 결재완료(BAPSG) 일때 수정 불가능
              this.disabled = true;
            }
          }

          if (this.checkResult.checkScheduleList.length > 0) {
            this.gridOptions.data = [];

            this.$_.forEach(this.checkResult.checkScheduleList, (item) => {
              let pushData = {
                safCheckNo: item.safCheckNo,
                safCheckScheduleNo: item.safCheckScheduleNo,
                checkSchYmd: item.checkSchYmd,
                checkTitle: item.checkTitle,
                tgtDeptCd: item.tgtDeptCd,
                tgtDeptNm: item.tgtDeptNm,
                checkStepCd: item.checkStepCd,
                checkStepNm: item.checkStepNm,
                // createDept: {
                //   deptCd: item.pfmDeptCd,
                //   deptNm: item.pfmDeptNm,
                // },
                createDept: item.pfmDeptNm,
                noPlanYn: item.noPlanYn,
                createUserId: item.createUserId,
                createDt: item.createDt,
              };

              this.gridOptions.data.push(pushData);
            });
            this.checkResult.checkScheduleList.forEach((checkSchedule) => {
              if (
                this.$_.findIndex(this.tgtDeptGridOptions.data, [
                  'deptCd',
                  checkSchedule.tgtDeptCd,
                ]) <= -1
              ) {
                this.tgtDeptGridOptions.data.push({
                  deptCd: checkSchedule.tgtDeptCd,
                  deptNm: checkSchedule.tgtDeptNm,
                });
              }
              /**
               * 2020-02-09 KDH
               * 계획이 등록된 건이 있는 경우 저장 된 데이터만 보이도록 수정
               * 점검주기에 따른 점검기간에 맞추어 점검을 생성하고 그 중 저장된 데이터를 체크하는 방향으로 가지 않음
               * 저장이 되지 않은 데이터는 보이지 않게 처리
               */
              // this.gridOptions.data = this.$_.clone(
              //   this.checkResult.checkScheduleList
              // );
            });
            // 수정가능 상태 확인
            if (this.checkResult.checkScheduleList[0].checkStepCd !== 'CHS00') {
              // 계획 리스트에서 하나라도 상태의 값이 일정수립이 아니라면 결재가 이루어진 상태이며 전부 일정수립이 아닌 상태로 바뀌어 있다는 뜻
              // 따라서 전부 수정 불가 상태로 두는 것이 맞음
              // 수정불가 일때
              this.disabled = true;
              // 그리드 헤더 설정
              this.gridOptions.header = [
                // 진행상태
                {
                  headerText: this.$comm.getLangSpecInfoLabel('L0000002779'),
                  dataField: 'checkStepNm',
                  width: '10%',
                  style: 'center-align',
                },
                {
                  headerText: this.$comm.getLangSpecInfoLabel('L0000002549'),
                  dataField: 'tgtDeptNm',
                  width: '10%',
                  style: 'center-align',
                }, // 점검대상부서
                {
                  headerText: this.$comm.getLangSpecInfoLabel('L0000002564'),
                  dataField: 'checkSchYmd',
                  width: '20%',
                  style: 'center-align',
                }, // 점검예정일
                {
                  headerText: this.$comm.getLangSpecInfoLabel('L0000001642'),
                  dataField: 'checkTitle',
                  width: '20%',
                  style: 'left-align',
                }, // 세부점검계획
              ];
            }
          }
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
      if (!this.checkResult.safCheckKindNo) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: 'M0000000712',
          // 점검종류를 선택해주세요.
          type: 'warning', // success / info / warning / error
        });
        return;
      }
      if (!this.searchParam.cycle) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: 'M0000000061',
          // 점검주기를 선택해주세요.
          type: 'warning', // success / info / warning / error
        });
        return;
      }
      if (!this.searchParam.period || this.searchParam.period.length <= 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: 'M0000000062',
          // 점검기간을 선택해주세요.
          type: 'warning', // success / info / warning / error
        });
        return;
      }
      if (this.tgtDeptGridOptions.data.length <= 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: 'M0000000715',
          // 점검대상부서를 선택해주세요.
          type: 'warning', // success / info / warning / error
        });
        return;
      }

      if (this.gridOptions.data && this.gridOptions.data.length > 0) {
        window.getApp.$emit('CONFIRM', {
          title: '확인', // L0000003321
          message:
            '새롭게 점검계획이 생성됨으로 기존에 입력/저장된 목록은 지워집니다. 진행하시겠습니까? ', // M0000000064
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
      var safCheckKindNm = '';
      if (this.comboCheckKindItems.length > 1) {
        safCheckKindNm =
          this.comboCheckKindItems[
            this.$_.findIndex(this.comboCheckKindItems, [
              'safCheckKindNo',
              this.checkResult.safCheckKindNo,
            ])
          ].safCheckKindNm;
      }
      var gridData = [];

      while (
        this.$comm.getDatediff(
          this.$comm.moment(startDate),
          this.$comm.moment(endDate)
        ) >= 0
      ) {
        for (let i in this.tgtDeptGridOptions.data) {
          gridData.push({
            tgtDeptCd: this.tgtDeptGridOptions.data[i].deptCd,
            tgtDeptNm: this.tgtDeptGridOptions.data[i].deptNm,
            checkSchYmd: startDate,
            checkTitle: safCheckKindNm + '(' + startDate + ')',
            createDept: {
              deptCd: this.$store.getters.deptCd,
              deptNm: this.$store.getters.deptNm,
            },
          });
        }
        startDate = this.$comm.getCalculatedDate(
          startDate,
          gapOfDate,
          'YYYY-MM-DD',
          'YYYY-MM-DD'
        );
      }
      this.gridOptions.data = this.$_.clone(gridData);
    },
    selectedCheck() {
      return this.editable;
    },
    /** 신규등록 하기전 UI단 유효성 검사 **/
    beforeInsert() {
      var notOrderedCheckSchYmd = this.$_.clone(
        this.$_.map(this.checkYmdValue, 'checkSchYmd')
      );

      notOrderedCheckSchYmd.sort(function compare(a, b) {
        var dateA = new Date(a);
        var dateB = new Date(b);
        return dateA - dateB;
      });
      this.$validator
        .validateAll()
        .then((_result) => {
          this.checkYmdValue = this.gridOptions.data;
          if (_result) {
            if (this.checkYmdValue.length <= 0) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395', // 안내
                message: 'M0000000065', // 점검계획은 최소 1개 이상 필수 지정되야 합니다.
                type: 'warning', // success / info / warning / error
              });
              return;
            }

            window.getApp.$emit('CONFIRM', {
              title: '확인', // L0000003321
              message: '저장하시겠습니까?', // M0000000011
              type: 'info', // success / info / warning / error
              confirmCallback: () => {
                this.checkResult.createUserId = this.$store.getters.token;
                this.checkResult.updateUserId = this.$store.getters.token;
                this.checkResult.checkScheduleList = this.$_.clone(
                  this.checkYmdValue
                );
                this.$_.forEach(this.checkResult.checkScheduleList, (item) => {
                  item.pfmDeptCd = item.createDept.deptCd;
                });

                this.checkResult.safCheckPerd = this.$_.clone(
                  this.searchParam.cycle
                );
                this.checkResult.safCheckPlanSymd = this.$_.clone(
                  notOrderedCheckSchYmd[0]
                );
                this.checkResult.safCheckPlanEymd = this.$_.clone(
                  notOrderedCheckSchYmd[notOrderedCheckSchYmd.length - 1]
                );

                this.isInsert = true;
              },
              cancelCallback: () => {
                this.isInsert = false;
              },
            });
          } else if (!_result) {
            this.$popupRequired.check(
              'checkScheduleDetail',
              this.$data,
              this.errors
            );
          }
        })
        .catch(() => {
          window.getApp.$emit('APP_VALID_ERROR', 'M0000000876');
          this.isInsert = false;
        });
    },
    getComboCheckKindItems() {
      this.$http.url = selectConfig.saf.checkKind.list.url;
      this.$http.type = 'GET';
      this.$http.param = {
        planUseYn: 'Y',
        useYn: 'Y',
        plantCd: this.checkResult.plantCd
          ? this.checkResult.plantCd
          : this.$store.getters.plantCd,
      };
      this.$http.request(
        (_result) => {
          this.comboCheckKindItems = this.$_.clone(_result.data);
          this.comboCheckKindItems.splice(0, 0, {
            safCheckKindNo: null,
            safCheckKindNm: this.$comm.getLangSpecInfoLabel('L0000003394'), // 선택하세요.
          });
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
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
    btnInsertClickedCallback(_result) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // 안내
        message: 'M0000000006', // 저장되었습니다.
        type: 'success', // success / info / warning / error
      });
      this.isInsert = false;
      this.checkResult.safCheckNo = _result.data;
      this.getDetail();
      // this.gridOptions.data = this.$_.clone(this.checkYmdValue);
      // this.checkItemData = [];
    },

    btnClickedErrorCallback(_result) {
      this.isInsert = false;
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    // 안전점검일정 삭제
    btnDeleteClickedCallback(_result) {
      window.getApp.$emit('CONFIRM', {
        title: '확인', //  L0000003321
        message:
          '안전점검 일정과 생성된 안전점검계획들이 삭제됩니다.\n삭제하시겠습니까? ', // M0000000716
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          this.$http.url = this.$format(
            transactionConfig.saf.checkSchedule.delete.url,
            this.checkResult.safCheckNo
          );
          this.$http.type = 'DELETE';
          this.$http.request(
            (_result) => {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395', // 안내
                message: 'M0000000007', // 삭제되었습니다
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
    openAppr() {
      this.popupOptions.target = () =>
        import(`${'@/pages/manage/appr/comApprRequest.vue'}`);
      this.popupOptions.title = 'L0000003418'; // 결재요청
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closeApprPop;
      this.popupOptions.width = '80%';
      this.popupOptions.param = {
        apprBizCd: 'SA-CE-01',
        apprParams: {
          safCheckNo: this.checkResult.safCheckNo,
        },
      };
    },
    closeApprPop(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getDetail();
      // if (data.resultFlag) {
      //   this.disabled = true;
      //   this.checkResult.apprRqstNo = data.apprRqstNo;
      // }
    },
    btnDeptAdd() {
      if (!this.checkResult.plantCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000000066', // 사업장을 선택하세요.
          type: 'warning',
        });
        return;
      } else {
        this.popupOptions.target = () =>
          import(`${'@/pages/baseInfo/deptManage/deptSearchPopup.vue'}`);
        this.popupOptions.title = 'L0000001287'; // 부서
        this.popupOptions.param = {
          multiple: true,
          plantCd: this.checkResult.plantCd,
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
          if (
            !this.$_.find(this.tgtDeptGridOptions.data, { deptCd: item.deptCd })
          ) {
            let addItem = {
              deptCd: item.deptCd,
              deptNm: item.deptNm,
            };
            if (item.plantCd === this.checkResult.plantCd) {
              this.tgtDeptGridOptions.data.push(addItem);
            }
          }
        }
      });
    },
    /**
     * 선택된 부서들의 하위부서 목록 조회
     */
    getSubDept() {
      return new Promise((resolve) => {
        const subDeptItem = [];
        let deptCds = '';
        let selectedValue = this.YAuiGrid.getCheckedRowItemsAll();
        selectedValue.forEach((item) => {
          deptCds += ',' + item.deptCd;
        });

        this.$http.url = this.authGrpSubDeptUrl;
        this.$http.type = 'GET';
        this.$http.param = {
          deptCds: deptCds,
        };
        this.$http.request(
          (_result) => {
            if (_result.data.length > 0) {
              this.$_.clone(_result.data).forEach((item) => {
                const idx = this.tgtDeptGridOptions.data.findIndex(
                  (x) => x.deptCd === item.deptCd
                );
                if (idx > -1) {
                  const selectedIdx = selectedValue.findIndex(
                    (x) => x.deptCd === item.deptCd
                  );
                  if (selectedIdx < 0) {
                    subDeptItem.push(item);
                    this.YAuiGrid.addCheckedRowsByValue('deptCd', item.deptCd);
                  }
                }
              });
              resolve();
            }
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      });
    },
    btnDeptDelete() {
      if (this.YAuiGrid.getCheckedRowItemsAll().length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000000911', // 삭제 할 데이터를 선택하세요.
          type: 'warning',
        });
        return;
      } else {
        this.confirm({
          title: '확인', //  L0000003321
          message: '하위부서와 같이 제외하시겠습니까?', //  M0000000531
          type: 'info',
          // 확인 callback 함수 (선택된 부서의 하위부서도 같이 삭제)
          confirmCallback: () => {
            // 선택된 부서들의 하위부서 목록 조회
            this.getSubDept().then((_) => {
              let gridData = this.YAuiGrid.getGridData();
              const selectedRows = this.YAuiGrid.getCheckedRowItemsAll();
              this.$_.forEach(selectedRows, (item) => {
                gridData = this.$_.reject(gridData, item);
              });

              this.tgtDeptGridOptions.data = gridData;
            });
          },
          // 취소 callback 함수 (선택된 부서만 삭제)
          cancelCallback: () => {
            let gridData = this.YAuiGrid.getGridData();
            const selectedRows = this.YAuiGrid.getCheckedRowItemsAll();
            this.$_.forEach(selectedRows, (item) => {
              gridData = this.$_.reject(gridData, item);
            });

            this.tgtDeptGridOptions.data = gridData;
          },
        });
      }
    },
    confirm(_option) {
      var type = '';
      if (_option.hasOwnProperty('type')) type = _option.type;
      this.$confirm(_option.message, _option.title, {
        confirmButtonText: this.$comm.getLangSpecInfoLabel('L0000003644'), // 예
        cancelButtonText: this.$comm.getLangSpecInfoLabel('L0000003645'), // 아니오
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
    // 2022-03-15 수정사항 행삭제기능추가
    LineDelete() {
      let checkYmdValue = this.YAuiGrid2.getCheckedRowItems();
      this.$_.forEach(checkYmdValue, (item) => {
        let idx = this.$_.indexOf(
          this.$_.map(this.gridOptions.data, 'checkTitle'),
          item.checkTitle
        );
        this.gridOptions.data.splice(idx, 1);
      });
      console.log('this.gridOptions.data: ', this.gridOptions.data);
      this.YAuiGrid2 = this.gridOptions.data;
      console.log('this.YAuiGrid2: ', this.YAuiGrid2);
    },
  },
};
</script>
