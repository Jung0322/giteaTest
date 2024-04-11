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
            <!-- 연간합동점검계획 상세 -->
            <y-label
              label="L0000001985"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 저장 -->
              <y-btn
                :action-url="editUrl"
                :param="consolPlan"
                :is-submit="isInsert"
                title="L0000002474"
                color="orange"
                action-type="PUT"
                beforeSubmit="beforeInsert"
                @beforeInsert="beforeInsert"
                @btnClicked="btnInsertClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 닫기 -->
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
              <!-- 주관부서 -->
              <y-tree-dept
                :editable="editable"
                :required="true"
                label="L0000002713"
                :disabled="complete"
                :plantCd="consolPlan.plantCd"
                v-model="consolPlan.deptCd"
                v-validate="'required'"
                :state="validateState('deptCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 합동종류 -->
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
                label="L0000003197"
                v-model="consolPlan.safCheckKindNo"
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
                v-model="consolPlan.createUserNm"
              ></y-text>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <!-- 연간합동점검계획명 -->
              <y-text
                :width="10"
                :required="true"
                ui="bootstrap"
                name="chkYearTitle"
                label="L0000001986"
                :disabled="complete"
                v-model="consolPlan.chkYearTitle"
                v-validate="'required'"
                :state="validateState('chkYearTitle')"
              ></y-text>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <b-row>
                <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
                  <div slot="buttonGroup" class="float-right mb-1">
                    <!--부서추가  -->
                    <y-btn
                      v-if="editable && !complete"
                      title="L0000001300"
                      :showLoading="false"
                      color="blue"
                      @btnClicked="btnDeptAdd"
                    />
                    <!-- 행삭제 -->
                    <y-btn
                      v-if="editable && isAdd && !complete"
                      title="L0000003223"
                      :showLoading="false"
                      color="red"
                      @btnClicked="btnDeptDelete"
                    />
                  </div>
                  <!-- 참여 부서 목록 -->
                  <y-data-table
                    label="L0000002807"
                    ref="dataTable"
                    :rows="3"
                    :height="gridOptions2.height"
                    :headers="gridOptions2.header"
                    :items="gridOptions2.data"
                    :editable="editable"
                    :useRownum="false"
                    minHeight="200px"
                    v-model="gridOptions2.selectedValue"
                    :popMode="true"
                  >
                    <el-table-column
                      v-if="editable && !complete"
                      type="selection"
                      slot="selection"
                      align="center"
                      width="55"
                    ></el-table-column>
                  </y-data-table>
                </b-col>
                <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
                  <div slot="buttonGroup" class="float-right mb-1">
                    <!-- 협력업체 추가 -->
                    <y-btn
                      v-if="editable && !complete"
                      title="L0000003255"
                      :showLoading="false"
                      color="blue"
                      @btnClicked="btnVendorAdd"
                    />
                    <!-- 행 삭제 -->
                    <y-btn
                      v-if="editable && isAdd2 && !complete"
                      title="L0000003223"
                      :showLoading="false"
                      color="red"
                      @btnClicked="btnVendorDelete"
                    />
                  </div>
                  <!-- 참여 협력업체 목록 -->
                  <y-data-table
                    label="L0000002808"
                    ref="dataTable"
                    :rows="3"
                    :height="gridOptions3.height"
                    :headers="gridOptions3.header"
                    :items="gridOptions3.data"
                    :editable="editable && !complete"
                    :useRownum="false"
                    minHeight="200px"
                    v-model="gridOptions3.selectedValue"
                    :popMode="true"
                  >
                    <el-table-column
                      v-if="editable && !complete"
                      type="selection"
                      slot="selection"
                      align="center"
                      width="55"
                    ></el-table-column>
                  </y-data-table>
                </b-col>
              </b-row>
            </b-col>
          </b-row>
          <!-- 점검주기 상세 -->
          <el-divider content-position="left">{{
            $comm.getLangSpecInfoLabel('L0000002580')
          }}</el-divider>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 점검주기 -->
              <y-select
                :width="8"
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
                :disabled="complete"
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
                <div slot="buttonGroup" class="float-right mb-1">
                  <!--점검기간 생성  -->
                  <y-btn
                    v-if="!complete"
                    title="L0000002547"
                    color="blue"
                    @btnClicked="btnSearchCheckYmdClicked"
                  />
                </div>
                <!-- 점검계획 목록 -->
                <y-data-table
                  :height="gridOptions.height"
                  :headers="gridOptions.header"
                  :items="gridOptions.data"
                  :checkItemData="checkItemData"
                  :editable="editable && !complete"
                  :print="true"
                  :useRownum="false"
                  checkKey="safCheckScheduleNo"
                  v-model="checkYmdValue"
                  label="L0000002540"
                  ref="checkPriodDataTable"
                  :popMode="true"
                >
                  <el-table-column
                    v-if="editable && !complete"
                    :selectable="selectedCheck"
                    type="selection"
                    slot="selection"
                    align="center"
                    width="55"
                  ></el-table-column>
                </y-data-table>
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
        safCongChkRsltNo: 0, // 연간점검일련번호
        safCongChkPlanNo: 0, // 연간점검 공통번호
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
      checkItemData: [],
      baseWidth: 9,
      editable: false,
      isInsert: false,
      isComplete: false,
      comboCycleItems: [], // 점검주기
      insertUrl: '',
      editUrl: '',
      completeUrl: '',
      complete: false,
      checkYmdValue: [],
      patrolTypeItems: [],
      disabled: false,
      updateMode: false,
      insertMode: false,
      apprMode: false,
      authDuringAppr: false,
      collectCheck: false,
    };
  },
  computed: {
    isAdd() {
      return !(this.gridOptions2.data.length === 0);
    },
    isAdd2() {
      return !(this.gridOptions3.data.length === 0);
    },
  },
  watch: {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
  },
  mounted() {
    this.init();
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
        { text: 'L0000004367', name: 'deptNm', width: '100%', align: 'center' }, // 부서명
      ];
      this.gridOptions3.header = [
        {
          text: 'L0000003265',
          name: 'vendorNm',
          width: '100%',
          align: 'center',
        }, // 협력업체명
      ];
      if (
        this.popupParam.safCongChkRsltNo > 0 ||
        this.popupParam.safCongChkPlanNo > 0
      ) {
        // 그리드 헤더 설정
        this.gridOptions.header = [
          {
            text: 'L0000002779',
            name: 'checkStepNm',
            width: '10%',
            align: 'center',
          }, // 진행상태
          {
            text: 'L0000002809',
            name: 'depts',
            width: '10%',
            align: 'center',
          }, // 참여부서
          {
            text: 'L0000002813',
            name: 'vendors',
            width: '10%',
            align: 'center',
          }, // 참여협력업체
          {
            text: 'L0000002564',
            name: 'congChkSchYmd',
            width: '20%',
            align: 'center',
            type: 'datepicker',
          }, // 점검예정일
          {
            text: 'L0000001642',
            name: 'chkTitle',
            width: '20%',
            align: 'left',
            type: 'text',
          }, // 세부점검계획
        ];

        // 상세조회
        this.getScheduleDetail();
      } else {
        // 그리드 헤더 설정
        this.gridOptions.header = [
          {
            text: 'L0000002809',
            name: 'depts',
            width: '10%',
            align: 'center',
          }, // 참여부서
          {
            text: 'L0000002813',
            name: 'vendors',
            width: '10%',
            align: 'center',
          }, // 참여협력업체
          {
            text: 'L0000002564',
            name: 'congChkSchYmd',
            width: '20%',
            align: 'center',
            type: 'datepicker',
          }, // 점검예정일
          {
            text: 'L0000001642',
            name: 'chkTitle',
            width: '20%',
            align: 'left',
            type: 'text',
          }, // 세부점검계획
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

        // 등록자 setting
        this.consolPlan.createUserNm = this.popupParam.createUserNm
          ? this.popupParam.createUserNm + '/' + this.popupParam.createDt
          : this.$store.getters.name + ' / ' + this.$comm.getToday();

        this.updateMode = false;
        this.insertMode = true;
      }
    },
    getConsolKindList() {
      this.$http.url = selectConfig.saf.checkKind.list.url;
      this.$http.type = 'GET';
      this.$http.param = {
        useYn: 'Y',
        congYn: 'Y',
        plantCd: this.consolPlan.plantCd,
      };
      this.$http.request(
        (_result) => {
          _result.data.splice(0, 0, {
            safCheckKindNo: null,
            safCheckKindNm:
              this.$comm.getLangSpecInfoLabel('L0000003394') /* 선택하세요 */,
          });
          this.patrolTypeItems = this.$_.clone(_result.data);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getInspDept() {
      this.$http.url = this.$format(
        selectConfig.saf.consolMst.inspDept.url,
        this.consolPlan.safCongChkRsltNo
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.gridOptions2.data = [];
          this.gridOptions3.data = [];

          this.$_.forEach(_result.data, (_item) => {
            if (_item.inspClsCd === 'DPT') {
              this.gridOptions2.data.push({
                deptCd: _item.deptCd,
                deptNm: _item.deptNm,
                inspClsCd: 'DPT',
              });
            } else if (_item.inspClsCd === 'VDR') {
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
    // 상세 조회
    getScheduleDetail() {
      this.$http.url = this.$format(
        selectConfig.saf.consolMst.get.url,
        this.consolPlan.safCongChkPlanNo
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
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
          this.getInspDept(); // 부서/협력업체 조회

          if (_result.data && _result.data.length > 0) {
            // 수정가능 상태 확인
            if (this.consolPlan.stepCd === 'COMPLT') {
              // 그리드 헤더 설정
              this.gridOptions.header = [
                {
                  text: 'L0000002779',
                  name: 'checkStepNm',
                  width: '10%',
                  align: 'center',
                }, // 진행상태
                {
                  text: 'L0000002809',
                  name: 'depts',
                  width: '10%',
                  align: 'center',
                }, // 참여부서
                {
                  text: 'L0000002813',
                  name: 'vendors',
                  width: '10%',
                  align: 'center',
                }, // 참여협력업체
                {
                  text: 'L0000002564',
                  name: 'congChkSchYmd',
                  width: '20%',
                  align: 'center',
                  type: 'datepicker',
                }, // 점검예정일
                {
                  text: 'L0000001642',
                  name: 'chkTitle',
                  width: '20%',
                  align: 'left',
                  type: 'text',
                }, // 세부점검계획
              ];
            }
          }
          this.updateMode = true;
          this.insertMode = false;
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
          title: 'L0000003395', // 안내
          message: 'M0000000061', // 점검주기를 선택해주세요.
          type: 'warning', // success / info / warning / error
        });
        return;
      }
      if (!this.searchParam.period || this.searchParam.period.length <= 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
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
          title: 'L0000003395', // 안내
          message: 'M0000000063', // 점검대상부서/협력업체중 하나 이상 선택해주세요.
          type: 'warning', // success / info / warning / error
        });
        return;
      }
      if (this.gridOptions.data && this.gridOptions.data.length > 0) {
        window.getApp.$emit('CONFIRM', {
          title: 'L0000003321', // 확인
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
    selectedCheck() {
      return this.editable;
    },
    /** 신규등록 하기전 UI단 유효성 검사 **/
    beforeInsert() {
      this.$validator
        .validateAll()
        .then((_result) => {
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
              title: 'L0000003321', // 확인
              message: 'M0000000011', // 저장하시겠습니까?
              type: 'info', // success / info / warning / error
              confirmCallback: () => {
                this.consolPlan.createUserId = this.$store.getters.token;
                this.consolPlan.updateUserId = this.$store.getters.token;
                this.consolPlan.checkStepCd = 'ING';
                this.consolPlan.vendorDeptList = this.$_.clone(
                  this.checkYmdValue
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
              title: 'L0000003395', // 안내
              message: 'M0000001226', // 필수입력값을 입력해주세요.
              type: 'warning', // success / info / warning / error
            });
          }
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000881' /* 유효성 검사도중 에러가 발생하였습니다. */
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
              codeNm:
                this.$comm.getLangSpecInfoLabel('L0000003394') /* 선택하세요 */,
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
      this.$emit('closePopup', {});
    },
    btnInsertClickedCallback(_result) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395' /* 안내 */,
        message: 'M0000000006.', // 저장되었습니다.
        type: 'success', // success / info / warning / error
      });
      this.isInsert = false;
      this.updateMode = true;
      this.insertMode = false;
      this.consolPlan.safCongChkPlanNo = _result.data;

      this.getScheduleDetail();
    },
    btnClickedErrorCallback(_result) {
      this.isInsert = false;
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    btnDeleteClickedCallback(_result) {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321' /* 확인 */,
        message: 'M0000000717', // 연간합동점검계획과 생성된 합동점검계획들이 삭제됩니다.\n삭제하시겠습니까?
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
                this.closePopup(null);
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
      this.popupOptions.target = () =>
        import(`${'@/pages/manage/appr/comApprRequest.vue'}`);
      this.popupOptions.title = 'L0000003418'; // 결재요청
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closeApprPop;
      this.popupOptions.width = '80%';
      this.popupOptions.param = {
        apprBizCd: 'SA_CO_0',
        apprParams: {
          safCongChkPlanNo: this.consolPlan.safCongChkPlanNo,
        },
      };
    },
    closeApprPop(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data.resultFlag) {
        this.apprMode = true;
        this.insertMode = false;
        this.updateMode = false;
        this.disabled = true;
        this.consolPlan.apprRqstNo = data.apprRqstNo;
        this.collectCheck = true;
      }
    },
    btnDeptAdd() {
      if (!this.consolPlan.plantCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
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
          title: 'L0000003395' /* 안내 */,
          message: 'M0000000066', // 사업장을 선택하세요.
          type: 'warning',
        });
        return;
      } else {
        this.popupOptions.target = () =>
          import(`${'@/pages/vendor/baseInfo/vendorMaster.vue'}`);
        this.popupOptions.title = 'L0000004283'; // 협력업체 검색
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
      if (this.gridOptions2.selectedValue.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003321' /* 확인 */,
          message: 'L0000004282', // 하나 이상 선택하세요
          type: 'warning',
        });
        return;
      }
      this.$_.forEach(this.gridOptions2.selectedValue, (item) => {
        this.gridOptions2.data = this.$_.reject(this.gridOptions2.data, item);
      });
    },
    btnVendorDelete() {
      if (this.gridOptions3.selectedValue.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003321' /* 확인 */,
          message: 'L0000004282', // 하나 이상 선택하세요
          type: 'warning',
        });
        return;
      }
      this.$_.forEach(this.gridOptions3.selectedValue, (item) => {
        this.gridOptions3.data = this.$_.reject(this.gridOptions3.data, item);
      });
    },
    /** /기타 function **/
  },
};
</script>
