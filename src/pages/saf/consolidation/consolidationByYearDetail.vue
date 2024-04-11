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
            <y-label
              label="연간합동점검계획 상세"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- <el-tag v-if="consolPlan.bizApprStepCd === 'BAPSD'" size="mini" type="danger">
                <i class="el-icon-warning"></i>
                반려된 문서로 재결재요청은 반려문서 메뉴에서 하시기 바랍니다.
              </el-tag> -->
              <y-btn
                v-if="
                  updateMode &&
                  !complete &&
                  editable &&
                  consolPlan.bizApprStepCd !== 'BAPSD'
                "
                color="black"
                title="결재요청"
                @btnClicked="openAppr"
              />
              <y-btn
                v-if="!updateMode && editable && !complete"
                :action-url="insertUrl"
                :param="consolPlan"
                :is-submit="isInsert"
                title="저장"
                color="orange"
                action-type="POST"
                beforeSubmit="beforeInsert"
                @beforeInsert="beforeInsert"
                @btnClicked="btnInsertClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <y-btn
                v-if="updateMode && editable && !complete"
                :action-url="editUrl"
                :param="consolPlan"
                :is-submit="isInsert"
                title="저장"
                color="orange"
                action-type="PUT"
                beforeSubmit="beforeInsert"
                @beforeInsert="beforeInsert"
                @btnClicked="btnInsertClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <y-btn
                v-if="
                  updateMode &&
                  editable &&
                  !complete &&
                  consolPlan.bizApprStepCd !== 'BAPSD'
                "
                color="red"
                title="삭제"
                @btnClicked="btnDeleteClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <y-btn title="L0000000881" @btnClicked="closePopup" />
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
                :disabled="updateMode"
                name="plantCd"
                v-model="consolPlan.plantCd"
                v-validate="'required'"
                :state="validateState('plantCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-tree-dept
                :editable="editable"
                :required="true"
                label="주관부서"
                :disabled="complete"
                :plantCd="consolPlan.plantCd"
                v-model="consolPlan.deptCd"
                v-validate="'required'"
                :state="validateState('deptCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-select
                :width="8"
                :required="true"
                :comboItems="consolTypeItems"
                :disabled="complete"
                :editable="editable"
                itemText="safCheckKindNm"
                itemValue="safCheckKindNo"
                ui="bootstrap"
                name="safCheckKindNo"
                label="합동종류"
                v-model="consolPlan.safCheckKindNo"
                v-validate="'required'"
                :state="validateState('safCheckKindNo')"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-text
                :width="8"
                :disabled="true"
                ui="bootstrap"
                name="createUserNm"
                label="등록자/등록일"
                v-model="consolPlan.createUserNm"
              ></y-text>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <y-text
                :width="10"
                :required="true"
                ui="bootstrap"
                name="chkYearTitle"
                label="연간합동점검계획명"
                :disabled="complete"
                :editable="editable"
                v-model="consolPlan.chkYearTitle"
                v-validate="'required'"
                :state="validateState('chkYearTitle')"
              ></y-text>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <b-row>
                <!-- 참여 부서 목록-->
                <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
                  <y-auigrid
                    ref="yAuiGrid2"
                    :name="gridOptions2.name"
                    :headers="gridOptions2.header"
                    :btns="gridOptions2.btns"
                    :height="gridOptions2.height"
                    label="참여 부서 목록"
                    :items="gridOptions2.data"
                    :useExcelExport="false"
                    :showItemCount="false"
                    :showRowCheckColumn="true"
                    @btnDeptAdd="btnDeptAdd"
                    @btnDeptDelete="btnDeptDelete"
                  />
                </b-col>
                <!-- 참여 협력업체 목록-->
                <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
                  <y-auigrid
                    ref="yAuiGrid3"
                    :name="gridOptions3.name"
                    :headers="gridOptions3.header"
                    :btns="gridOptions3.btns"
                    :height="gridOptions3.height"
                    label="참여 협력업체 목록"
                    :items="gridOptions3.data"
                    :useExcelExport="false"
                    :showItemCount="false"
                    :showRowCheckColumn="true"
                    @btnVendorAdd="btnVendorAdd"
                    @btnVendorDelete="btnVendorDelete"
                  />
                </b-col>
              </b-row>
            </b-col>
          </b-row>
          <el-divider content-position="left">점검주기 상세</el-divider>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-select
                :width="8"
                :disabled="complete"
                :comboItems="comboCycleItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                name="cycle"
                :editable="editable"
                label="점검주기"
                v-model="searchParam.cycle"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-datepicker
                :width="8"
                :disabled="editable && complete"
                :range="true"
                label="점검기간"
                :editable="editable"
                name="period"
                v-model="searchParam.period"
              ></y-datepicker>
            </b-col>
          </b-row>
          <!-- 검색 결과 테이블 -->
          <b-row class="mt-3">
            <b-col sm="12">
              <y-auigrid
                ref="yAuiGrid"
                :editable="editable && !complete"
                :name="gridOptions.name"
                :headers="gridOptions.header"
                :btns="gridOptions.btns"
                :height="gridOptions.height"
                label="점검계획 목록"
                :items="gridOptions.data"
                :useExcelExport="false"
                :showItemCount="false"
                :showRowCheckColumn="true"
                @btnSearchCheckYmd="btnSearchCheckYmdClicked"
                @btnDeleteCheckYmd="btnDeleteCheckYmd"
              />
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
  name: 'consolidation-by-year-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        safCongChkRsltNo: 0, // 연간점검일련번호
        safCongChkPlanNo: 0, // 연간점검공통번호
      },
    },
  },
  data() {
    return {
      consolPlan: {
        safCongChkRsltNo: 0,
        safCongChkPlanNo: 0,
        deptCd: null, // 주관부서코드
        deptNm: '', // 주관부서명
        updateUserId: '',
        createUserId: '',
        createUserNm: '',
        createDt: '',
        safCheckPerd: '', // 점검주기
        planSymd: '', // 점검계획시작일
        planEymd: '', // 점검계획종료일
        plantCd: '', // 사업장 코드
        bizApprStepCd: '',
        chkYearTitle: '', // 점검명
        safCheckKindNo: null,
        vendorDeptList: [],
        vendorList: [],
        deptList: [],
        pApprRqstNo: 0, // 결재 번호
        rApprRqstNo: 0, // 결재 번호
        checkStepCd: '',
        stepCd: '',
      },
      searchParam: {
        cycle: '', // 점검주기
        period: [], // 점검기간
      },
      YAuiGrid: null,
      gridOptions: {
        header: [],
        data: [],
        height: '350',
      },
      YAuiGrid2: null,
      gridOptions2: {
        header: [],
        data: [],
        height: '200',
      },
      YAuiGrid3: null,
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
      editable: false,
      isInsert: false,
      comboCycleItems: [], // 점검주기
      insertUrl: '',
      editUrl: '',
      completeUrl: '',
      complete: false,
      consolTypeItems: [],
      disabled: false,
      updateMode: false,
    };
  },
  computed: {},
  watch: {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.YAuiGrid2 = this.$refs.yAuiGrid2;
    this.YAuiGrid3 = this.$refs.yAuiGrid3;

    if (
      this.popupParam.safCongChkRsltNo > 0 ||
      this.popupParam.safCongChkPlanNo > 0
    ) {
      // 상세조회
      this.getScheduleDetail().then(() => {
        // 부서/협력업체 조회
        this.getInspDept();
        this.setGridBtns();
      });
    } else {
      this.setGridBtns();
    }
  },
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      // URL setting
      this.insertUrl = transactionConfig.saf.consolMst.insert.url;
      this.editUrl = transactionConfig.saf.consolMst.edit.url;
      this.completeUrl = transactionConfig.saf.consolMst.complete.url;

      this.consolPlan.safCongChkRsltNo = this.popupParam.safCongChkRsltNo;
      this.consolPlan.safCongChkPlanNo = this.popupParam.safCongChkPlanNo;

      this.getComboItems('SAF_CHECK_CYCLE'); // 점검주기
      this.getConsolKindList(); // 합동종류

      this.gridOptions2.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004367'),
          dataField: 'deptNm',
          width: '100%',
        }, // 부서명
      ];

      this.gridOptions3.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003265'),
          dataField: 'vendorNm',
          width: '100%',
        }, // 협력업체명
      ];

      if (
        this.popupParam.safCongChkRsltNo > 0 ||
        this.popupParam.safCongChkPlanNo > 0
      ) {
        // 그리드 헤더 설정
        this.gridOptions.header = [
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000002779'),
            dataField: 'checkStepNm',
            width: '14%',
            editable: false,
          }, // 진행상태
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000002809'),
            dataField: 'depts',
            width: '17%',
            editable: false,
          }, // 참여부서
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000002813'),
            dataField: 'vendors',
            width: '17%',
            editable: false,
          }, // 참여협력업체
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000002564'),
            dataField: 'congChkSchYmd',
            width: '26%',
            editRenderer: {
              type: 'CalendarRenderer',
              onlyCalendar: true,
              defaultFormat: 'yyyy-mm-dd',
            },
          }, // 점검예정일
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000001642'),
            dataField: 'chkTitle',
            width: '26%',
            style: 'left-align',
            editRenderer: {
              type: 'InputEditRenderer',
            },
          }, // 세부점검계획
        ];
      } else {
        // 그리드 헤더 설정
        this.gridOptions.header = [
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000002809'),
            dataField: 'depts',
            width: '25%',
          }, // 참여부서
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000002813'),
            dataField: 'vendors',
            width: '25%',
          }, // 참여협력업체
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000002564'),
            dataField: 'congChkSchYmd',
            width: '25%',
            editRenderer: {
              type: 'CalendarRenderer',
              onlyCalendar: true,
              defaultFormat: 'yyyy-mm-dd',
            },
          }, // 점검예정일
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000001642'),
            dataField: 'chkTitle',
            width: '25%',
            style: 'left-align',
            editRenderer: {
              type: 'InputEditRenderer',
            },
          }, // 세부점검계획
        ];

        // 기간 Setting
        const from = this.$comm.getToday();
        const to = this.$comm.getCalculatedDate(
          from,
          '2m',
          'YYYY-MM-DD',
          'YYYY-MM-DD'
        );
        this.searchParam.period = [from, to];

        // 등록자 setting
        this.consolPlan.createUserNm = this.popupParam.createUserNm
          ? this.popupParam.createUserNm + '/' + this.popupParam.createDt
          : this.$store.getters.name + ' / ' + this.$comm.getToday();

        this.updateMode = false;
      }
    },
    setGridBtns() {
      this.gridOptions.btns = [
        {
          title: 'L0000002547',
          color: 'blue',
          btnClicked: 'btnSearchCheckYmd',
          visible: this.editable && !this.complete,
        }, // 점검기간 생성
        {
          title: 'L0000003223',
          color: 'red',
          btnClicked: 'btnDeleteCheckYmd',
          visible: this.editable && !this.complete,
        }, // 행 삭제
      ];
      this.YAuiGrid.setBtnArr(this.gridOptions.btns);

      this.gridOptions2.btns = [
        {
          title: 'L0000001300',
          color: 'blue',
          btnClicked: 'btnDeptAdd',
          visible: this.editable && !this.complete,
        }, // 부서 추가
        {
          title: 'L0000003223',
          color: 'red',
          btnClicked: 'btnDeptDelete',
          visible: this.editable && !this.complete,
        }, // 행 삭제
      ];
      this.YAuiGrid2.setBtnArr(this.gridOptions2.btns);

      this.gridOptions3.btns = [
        {
          title: 'L0000003255',
          color: 'blue',
          btnClicked: 'btnVendorAdd',
          visible: this.editable && !this.complete,
        }, // 협력업체 추가
        {
          title: 'L0000003223',
          color: 'red',
          btnClicked: 'btnVendorDelete',
          visible: this.editable && !this.complete,
        }, // 행 삭제
      ];
      this.YAuiGrid3.setBtnArr(this.gridOptions3.btns);
    },
    // 합동종류 조회
    getConsolKindList() {
      this.$http.url = selectConfig.saf.checkKind.list.url;
      this.$http.type = 'GET';
      this.$http.param = {
        congYn: 'Y',
        plantCd: this.consolPlan.plantCd,
      };
      this.$http.request(
        (_result) => {
          _result.data.splice(0, 0, {
            safCheckKindNo: null,
            safCheckKindNm: '선택하세요',
          });
          this.consolTypeItems = this.$_.clone(_result.data);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    // 상세 조회
    getScheduleDetail() {
      return new Promise((resolve, reject) => {
        this.$http.url = this.$format(
          selectConfig.saf.consolMst.get.url,
          this.consolPlan.safCongChkPlanNo
        );
        this.$http.type = 'GET';
        this.$http.request(
          (_result) => {
            // 조회되는 계획목록들은 전부 일괄적으로 마스터데이터가 같아서
            // INDEX = 0 으로 고정
            // 데이터가 다른경우는 점검계획목록의 점검예정일과 세부점검계획
            this.$_.extend(this.consolPlan, _result.data[0]);

            this.updateMode = true;
            if (_result.data[0].safCheckPerd) {
              this.searchParam.cycle = _result.data[0].safCheckPerd;
            }
            this.searchParam.period = [
              _result.data[0].planSymd,
              _result.data[0].planEymd,
            ];
            this.consolPlan.createUserNm =
              this.consolPlan.createUserNm +
              '/' +
              this.consolPlan.createDt.substring(0, 10); // 등록자 setting

            if (this.consolPlan.stepCd === 'COMPLT') {
              this.complete = true;
            }
            this.gridOptions.data = [];
            this.$_.forEach(_result.data, (_item) => {
              this.gridOptions.data.push({
                checkStepNm: _item.checkStepNm,
                depts: _item.depts,
                vendors: _item.vendors,
                congChkSchYmd: _item.congChkSchYmd,
                chkTitle: _item.chkTitle,
                safCongChkRsltNo: _item.safCongChkRsltNo,
              });
            });

            // 결재에 따른 상태값 주기
            if (_result.data[0].bizApprStepCd) {
              if (_result.data[0].bizApprStepCd === 'BAPSD') {
                this.complete = false;
                this.updateMode = true;
              } else {
                this.updateMode = false;
                this.complete = true;
              }
            } else {
              this.complete = false;
              this.updateMode = true;
            }
            this.updateMode = true;

            resolve();
          },
          (_error) => {
            reject(_error);
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      });
    },
    // 참여부서와 참여업체 조회(deptCd, vendorCd 못들고 와서 따로 조회 api 추가)
    getInspDept() {
      this.$http.url = this.$format(
        selectConfig.saf.consolMst.inspDept.url,
        this.consolPlan.safCongChkPlanNo
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.gridOptions2.data = [];
          this.gridOptions3.data = [];

          this.$_.forEach(_result.data, (_item) => {
            if (_item.inspClsCd === 'DPT') {
              // DPT : 참여부서
              this.gridOptions2.data.push({
                deptCd: _item.deptCd,
                deptNm: _item.deptNm,
                inspClsCd: 'DPT',
              });
            } else if (_item.inspClsCd === 'VDR') {
              // VDR : 참여업체
              this.gridOptions3.data.push({
                vendorCd: _item.vendorCd,
                vendorNm: _item.vendorNm,
                inspClsCd: 'VDR',
              });
            }
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
       **/
      if (!this.searchParam.cycle) {
        window.getApp.$emit('ALERT', {
          title: '안내',
          message: '점검주기를 선택해주세요.',
          type: 'warning', // success / info / warning / error
        });
        return;
      }
      if (!this.searchParam.period || this.searchParam.period.length <= 0) {
        window.getApp.$emit('ALERT', {
          title: '안내',
          message: '점검기간을 선택해주세요.',
          type: 'warning', // success / info / warning / error
        });
        return;
      }
      if (
        this.gridOptions3.data.length <= 0 &&
        this.gridOptions2.data.length <= 0
      ) {
        window.getApp.$emit('ALERT', {
          title: '안내',
          message: '점검대상부서/협력업체중 하나 이상 선택해주세요.',
          type: 'warning', // success / info / warning / error
        });
        return;
      }
      if (this.gridOptions.data && this.gridOptions.data.length > 0) {
        window.getApp.$emit('CONFIRM', {
          title: '확인',
          message:
            '새롭게 점검계획이 생성됨으로 기존에 입력/저장된 목록은 지워집니다. 진행하시겠습니까?',
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
      var safCheckKindNm = this.consolPlan.chkYearTitle;
      var gridData = [];
      var depts = '';
      var vendors = '';

      while (
        this.$comm.getDatediff(
          this.$comm.moment(startDate),
          this.$comm.moment(endDate)
        ) >= 0
      ) {
        depts = '';
        vendors = '';
        for (let i in this.gridOptions2.data) {
          if (Number(i) === Number(this.gridOptions2.data.length - 1)) {
            depts += this.gridOptions2.data[i].deptNm;
          } else {
            depts += this.gridOptions2.data[i].deptNm + ', ';
          }
        }
        for (let j in this.gridOptions3.data) {
          if (Number(j) === Number(this.gridOptions3.data.length - 1)) {
            vendors += this.gridOptions3.data[j].vendorNm;
          } else {
            vendors += this.gridOptions3.data[j].vendorNm + ', ';
          }
        }
        gridData.push({
          depts: depts,
          vendors: vendors,
          congChkSchYmd: startDate,
          chkTitle: safCheckKindNm + '(' + startDate + ')',
        });
        startDate = this.$comm.getCalculatedDate(
          startDate,
          gapOfDate,
          'YYYY-MM-DD',
          'YYYY-MM-DD'
        );
      }
      this.gridOptions.data = this.$_.clone(gridData);
    },
    /** 신규등록 하기전 UI단 유효성 검사 **/
    beforeInsert() {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: '확인',
              message: '저장하시겠습니까?',
              type: 'info', // success / info / warning / error
              confirmCallback: () => {
                this.consolPlan.createUserId = this.$store.getters.token;
                this.consolPlan.updateUserId = this.$store.getters.token;
                this.consolPlan.checkStepCd = 'ING';
                this.consolPlan.vendorDeptList = this.$_.clone(
                  this.gridOptions.data
                );

                this.consolPlan.deptList = this.gridOptions2.data;
                this.consolPlan.vendorList = this.gridOptions3.data;

                this.consolPlan.safCheckPerd = this.$_.clone(
                  this.searchParam.cycle
                );
                this.consolPlan.planSymd = this.searchParam.period[0];
                this.consolPlan.planEymd = this.searchParam.period[1];

                this.isInsert = true;
              },
              cancelCallback: () => {
                this.isInsert = false;
              },
            });
          } else if (!_result) {
            window.getApp.$emit('ALERT', {
              title: '안내',
              message: '필수입력값을 입력해주세요.',
              type: 'warning', // success / info / warning / error
            });
          }
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            '유효성 검사도중 에러가 발생하였습니다.'
          );
          this.isInsert = false;
        });
    },
    getComboItems(codeGroupCd) {
      this.$http.url = this.$format(
        selectConfig.codeMaster.getSelect.url,
        codeGroupCd
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          if (codeGroupCd === 'SAF_CHECK_CYCLE') {
            this.comboCycleItems = this.$_.clone(_result.data);
            this.comboCycleItems.splice(0, 0, {
              code: null,
              codeNm: '선택하세요',
            });
            this.searchParam.cycle = 'CCY1W';
          }
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
      this.$emit('closePopup', { data: data });
    },
    btnInsertClickedCallback(_result) {
      window.getApp.$emit('ALERT', {
        title: '안내',
        message: '저장되었습니다.',
        type: 'success', // success / info / warning / error
      });
      this.isInsert = false;
      this.updateMode = true;
      this.consolPlan.safCongChkPlanNo = _result.data;

      this.getScheduleDetail().then(() => {
        this.getInspDept();
      });
    },
    btnClickedErrorCallback(_result) {
      this.isInsert = false;
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    btnDeleteClickedCallback(_result) {
      window.getApp.$emit('CONFIRM', {
        title: '확인',
        message:
          '연간합동점검계획과 생성된 합동점검계획들이 삭제됩니다.\n삭제하시겠습니까?',
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          this.$_.forEach(this.gridOptions.data, (_item) => {
            this.$http.url = this.$format(
              transactionConfig.saf.consolMst.delete.url,
              _item.safCongChkRsltNo,
              this.consolPlan.safCongChkPlanNo
            );
            this.$http.type = 'DELETE';
            this.$http.request(
              (_result) => {
                this.closePopup('delete');
              },
              (_error) => {
                window.getApp.$emit('APP_REQUEST_ERROR', _error);
              }
            );
          });
        },
        cancelCallback: () => {},
      });
    },
    openAppr() {
      window.getApp.$emit('CONFIRM', {
        title: '확인',
        message: '결재요청 전 저장됩니다. 진행하시겠습니까?',
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          this.consolPlan.createUserId = this.$store.getters.token;
          this.$http.url = transactionConfig.saf.consolMst.edit.url;
          this.$http.type = 'PUT';
          this.consolPlan.createUserId = this.$store.getters.token;
          this.consolPlan.updateUserId = this.$store.getters.token;
          this.consolPlan.checkStepCd = 'ING';
          this.consolPlan.vendorDeptList = this.$_.clone(this.gridOptions.data);

          this.consolPlan.deptList = this.gridOptions2.data;
          this.consolPlan.vendorList = this.gridOptions3.data;

          this.consolPlan.safCheckPerd = this.$_.clone(this.searchParam.cycle);
          this.consolPlan.planSymd = this.searchParam.period[0];
          this.consolPlan.planEymd = this.searchParam.period[1];

          this.$http.param = this.consolPlan;
          this.$http.request(
            (_result) => {
              this.consolPlan.safCongChkPlanNo = _result.data;

              this.popupOptions.target = () =>
                import(`${'@/pages/manage/appr/comApprRequest.vue'}`);
              this.popupOptions.title = '결재요청';
              this.popupOptions.visible = true;
              this.popupOptions.closeCallback = this.closeApprPop;
              this.popupOptions.width = '80%';
              this.popupOptions.param = {
                apprBizCd: 'SA_CO_0',
                apprParams: {
                  safCongChkPlanNo: _result.data,
                },
              };
            },
            (_error) => {
              window.getApp.$emit('APP_REQUEST_ERROR', _error);
            }
          );
        },
      });
    },
    closeApprPop(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data.resultFlag) {
        this.updateMode = false;
        this.disabled = true;
        this.consolPlan.apprRqstNo = data.apprRqstNo;

        this.getScheduleDetail().then(() => {
          this.getInspDept();
        });
      }
    },
    btnDeleteCheckYmd() {
      const selectedRows = this.YAuiGrid.getCheckedRowItemsAll();
      if (selectedRows.length === 0) {
        window.getApp.$emit('ALERT', {
          title: '안내',
          message: '점검계획을 하나 이상 선택해주세요.',
          type: 'warning', // success / info / warning / error
        });
      } else {
        let gridData = this.YAuiGrid.getGridData();
        this.$_.forEach(selectedRows, (item) => {
          gridData = this.$_.reject(gridData, item);
        });
        this.gridOptions.data = this.$_.clone(gridData);
      }
    },
    btnDeptAdd() {
      if (!this.consolPlan.plantCd) {
        window.getApp.$emit('ALERT', {
          title: '안내',
          message: '사업장을 선택하세요.',
          type: 'warning',
        });
        return;
      } else {
        this.popupOptions.target = () =>
          import(`${'@/pages/baseInfo/deptManage/deptSearchPopup.vue'}`);
        this.popupOptions.title = '대상부서 검색';
        this.popupOptions.param = {
          multiple: true,
          plantCd: this.consolPlan.plantCd,
          isSubDeptSelection: true,
        };
        this.popupOptions.width = '35%';
        this.popupOptions.top = '10px';
        this.popupOptions.visible = true;
        this.popupOptions.closeCallback = this.closeDeptPopup;
      }
    },
    btnVendorAdd() {
      if (!this.consolPlan.plantCd) {
        window.getApp.$emit('ALERT', {
          title: '안내',
          message: '사업장을 선택하세요.',
          type: 'warning',
        });
        return;
      } else {
        this.popupOptions.target = () =>
          import(`${'@/pages/vendor/baseInfo/vendorMaster.vue'}`);
        this.popupOptions.title = '협력업체 검색';
        this.popupOptions.param = {
          plantCd: this.consolPlan.plantCd,
          popupMode: true,
          multiSelect: true,
        };
        this.popupOptions.width = '80%';
        this.popupOptions.top = '10px';
        this.popupOptions.visible = true;
        this.popupOptions.closeCallback = this.closeVendorPopup;
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
              inspClsCd: 'DPT',
            };
            if (item.plantCd === this.consolPlan.plantCd) {
              this.gridOptions2.data.push(addItem);
            }
          }
        }
      });
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
              inspClsCd: 'VDR',
            };
            this.gridOptions3.data.push(addItem);
          }
        }
      });
    },
    btnDeptDelete() {
      const selectedRows = this.YAuiGrid2.getCheckedRowItemsAll();

      if (selectedRows.length === 0) {
        window.getApp.$emit('ALERT', {
          title: '확인',
          message: '하나 이상 선택하세요',
          type: 'warning',
        });
        return;
      }
      this.$_.forEach(selectedRows, (item) => {
        this.gridOptions2.data = this.$_.reject(this.gridOptions2.data, {
          deptCd: item.deptCd,
        });
      });
    },
    btnVendorDelete() {
      const selectedRows = this.YAuiGrid3.getCheckedRowItemsAll();

      if (selectedRows.length === 0) {
        window.getApp.$emit('ALERT', {
          title: '확인',
          message: '하나 이상 선택하세요',
          type: 'warning',
        });
        return;
      }
      this.$_.forEach(selectedRows, (item) => {
        this.gridOptions3.data = this.$_.reject(this.gridOptions3.data, {
          vendorCd: item.vendorCd,
        });
      });
    },
  },
};
</script>
