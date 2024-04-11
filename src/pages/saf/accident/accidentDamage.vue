<!--
  목적 : 등록/접수/조치결과 - 피해내역
  Detail : 피해내역
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
          <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
            <!-- 인적피해내용 -->
            <y-text
              :width="10"
              :maxlength="600"
              :disabled="disabled"
              :editable="editable"
              ui="bootstrap"
              label="L0000002240"
              name="humanInjuryDesc"
              v-model="accidentDetail.humanInjuryDesc"
            />
          </b-col>
          <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
            <!-- 인적피해상해정도 -->
            <y-select
              :width="8"
              :comboItems="comboHumanInjuryItems"
              :disabled="disabled"
              :editable="editable"
              itemText="codeNm"
              itemValue="code"
              ui="bootstrap"
              label="L0000002242"
              name="humanInjuryCd"
              v-model="accidentDetail.humanInjuryCd"
            ></y-select>
          </b-col>
          <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
            <!-- 예상치료기간 -->
            <!-- 일 -->
            <y-number
              :width="8"
              :maxlength="5"
              :hasSeperator="false"
              :disabled="disabled"
              :editable="editable"
              ui="bootstrap"
              label="L0000002020"
              name="expectCureDay"
              v-model="accidentDetail.expectCureDay"
              appendText="L0000003660"
            />
            <!-- v-model="accidentDetail.expectCureDay" -->
          </b-col>
          <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
            <!-- 근로손실일수 -->
            <!-- 일 -->
            <y-number
              :width="8"
              :disabled="disabled"
              :editable="editable"
              :maxlength="5"
              :hasSeperator="false"
              ui="bootstrap"
              label="L0000000745"
              name="workLostDay"
              v-model="accidentDetail.workLostDay"
              appendText="L0000003660"
            />
          </b-col>
          <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12 mb-2">
            <!-- 사고관계자 테이블 -->
            <b-row>
              <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
                <!-- 사고관계자 목록 -->
                <y-auigrid
                  ref="yAuiGrid"
                  :headers="gridRefPsnOptions.header"
                  :btns="gridRefPsnOptions.btns"
                  :editable="!disabled && editable"
                  :label="this.$comm.getLangSpecInfoLabel('L0000001385')"
                  :useExcelExport="false"
                  :showRowCheckColumn="!disabled && editable"
                  @cellEditEnd="cellEditEndHandler"
                  @btnRefPsnAdd="btnRefPsnAdd"
                  @btnRefPsnDelete="btnRefPsnDelete"
                  @btnClickedError="btnClickedErrorCallback"
                />
              </b-col>
            </b-row>
          </b-col>
          <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
            <!-- 무재해 영향 -->
            <y-multi-select
              :width="10"
              :comboItems="comboNoAccidentItems"
              :disabled="disabled"
              :editable="editable"
              itemText="noAccidentYnNm"
              itemValue="noAccidentYn"
              ui="bootstrap"
              label="L0000001039"
              name="noAccidentYns"
              v-model="accidentDetail.noAccidentYns"
            ></y-multi-select>
          </b-col>
          <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
            <!-- 사고처리 -->
            <y-select
              :width="8"
              :comboItems="comboAccidentProcessItems"
              :disabled="disabled"
              :editable="editable"
              itemText="codeNm"
              itemValue="code"
              type="edit"
              ui="bootstrap"
              label="L0000001407"
              name="endTypeCd"
              v-model="accidentDetail.endTypeCd"
            ></y-select>
          </b-col>
          <!-- 물적피해 -->
          <el-divider content-position="left">{{
            $comm.getLangSpecInfoLabel('L0000001052')
          }}</el-divider>
          <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
            <!-- 직접손실액 -->
            <y-number
              :width="8"
              :maxlength="30"
              :disabled="disabled"
              :editable="editable"
              ui="bootstrap"
              label="L0000002770"
              name="dirLossAmount"
              v-model="accidentDetail.dirLossAmount"
            />
          </b-col>
          <!-- <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-text
              :width="6"
              :maxlength="30"
              :disabled="disabled"
              :editable="editable"
              ui="bootstrap"
              label="물적피해간접손실액"
              name="indirLossAmount"
              v-model="accidentDetail.indirLossAmount"
              />
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <y-text
              :width="9"
              :maxlength="600"
              :disabled="disabled"
              :editable="editable"
              ui="bootstrap"
              label="물적피해내용"
              name="matDamageDesc"
              v-model="accidentDetail.matDamageDesc"
              />
          </b-col>-->
          <!-- 환경피해 -->
          <el-divider content-position="left">{{
            $comm.getLangSpecInfoLabel('L0000003337')
          }}</el-divider>
          <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
            <!-- 수계누출량 -->
            <y-text
              :width="8"
              :maxlength="30"
              :disabled="disabled"
              :editable="editable"
              ui="bootstrap"
              label="L0000001679"
              name="drainLeak"
              v-model="accidentDetail.drainLeak"
            />
          </b-col>
          <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
            <!-- 그외누출량 -->
            <y-text
              :width="8"
              :maxlength="30"
              :disabled="disabled"
              :editable="editable"
              ui="bootstrap"
              label="L0000000737"
              name="etcLeak"
              v-model="accidentDetail.etcLeak"
            />
          </b-col>
          <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
            <!-- 내용 -->
            <y-text
              :width="10"
              :maxlength="600"
              :disabled="disabled"
              :editable="editable"
              ui="bootstrap"
              label="L0000000810"
              name="envDamageDesc"
              v-model="accidentDetail.envDamageDesc"
            />
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
export default {
  /* attributes: name, components, props, data */
  name: 'y-accident-damage',
  props: {
    disabled: false,
    accidentDetail: {
      type: Object,
      default: {
        safAccidentNo: 0,
        accidentYmd: '',
        accidentHour: '',
        accidentMinute: '',

        expectCureDay: 0, // 예상치료기간
        workLostDay: 0, // 근로손실일수

        detailDamageDesc: '', // 상세피해내용

        humanInjuryCd: '', // 인적피해_상해정도
        humanInjuryDesc: '', // 인적피해내용

        dirLossAmount: '', // 물적피해직접손실액
        indirLossAmount: '', // 물적피해간접손실액
        matDamageDesc: '', // 물적피해내용

        drainLeak: '', // 환경피해_수계누출량
        etcLeak: '', // 환경피해_그외누출량
        envDamageDesc: '', // 환경피해내용

        noAccidentYns: [], // 무재해영향여부
        noAccidentYn: 'N', // 무재해영향여부
        noAccidentDeptYn: 'N', // 무재해영향여부
        accidentLvlCd: '', // 사고피해레벨코드

        accidentRefPsns: [], // 사고 관계자 정보

        accidentStepCd: '',
        endTypeCd: null,
      },
    },
  },
  data: () => ({
    expectCureDay: 0,
    popupOptions: {
      target: null,
      title: '',
      visible: false,
      width: '60%',
      top: '10px',
      param: {},
      closeCallback: null,
    },
    YAuiGrid: null,
    gridRefPsnOptions: {
      // 사고관계자
      header: [],
      data: [],
      height: '310',
    },
    searchRefPsnUrl: '', // 사내사고 관계자정보 검색 url
    comboHumanInjuryItems: [], // 인적피해
    comboNoAccidentItems: [], // 무재해영향
    comboAccidentProcessItems: [],
    comboPsnTypeItems: [],
    editable: true,
  }),
  watch: {
    'accidentDetail.noAccidentYns': {
      handler: function (val, oldVal) {
        if (
          this.accidentDetail.noAccidentYns &&
          this.accidentDetail.noAccidentYns.length > 0
        ) {
          if (
            this.$_.findIndex(this.accidentDetail.noAccidentYns, {
              code: 'plant',
            }) > -1
          ) {
            this.accidentDetail.noAccidentYn = 'Y';
          } else {
            this.accidentDetail.noAccidentYn = 'N';
          }

          if (
            this.$_.findIndex(this.accidentDetail.noAccidentYns, {
              code: 'dept',
            }) > -1
          ) {
            this.accidentDetail.noAccidentDeptYn = 'Y';
          } else {
            this.accidentDetail.noAccidentDeptYn = 'N';
          }
        }
      },
    },
    'accidentDetail.noAccidentYn': {
      handler: function (val, oldVal) {
        if (!this.accidentDetail.noAccidentYns) {
          this.accidentDetail.noAccidentYns = [];
        }
      },
    },
    'accidentDetail.noAccidentDeptYn': {
      handler: function (val, oldVal) {
        if (!this.accidentDetail.noAccidentYns) {
          this.accidentDetail.noAccidentYns = [];
        }
      },
    },
    'gridRefPsnOptions.data': {
      handler: function (val, oldVal) {
        this.accidentDetail.accidentRefPsns = this.gridRefPsnOptions.data;
        if ((this.YAuiGrid || null) !== null) {
          this.YAuiGrid.setGridData(this.gridRefPsnOptions.data);
        }
      },
      deep: true,
    },
    'accidentDetail.safAccidentNo': {
      handler: function (val, oldVal) {
        this.getRefPsnList(); // 사내사고 관계자
      },
    },
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;

    this.getRefPsnList(); // 사내사고 관계자
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      // this.disabled =
      //   this.accidentDetail.accidentStepCd === 'ACCS4' ||
      //   this.accidentDetail.accidentStepCd === 'ACCS5';
      // Url Setting
      this.searchRefPsnUrl = selectConfig.saf.accidentRefPsn.list.url; // 사내사고 관계자정보 검색 url
      // 인적피해
      this.$comm.getComboItems('SAF_HUMAN_INJURY', false).then((_result) => {
        this.comboHumanInjuryItems = _result;
      });
      // 사고처리
      this.$comm
        .getComboItems('SAF_ACCIDENT_PROCESS_CLS', false)
        .then((_result) => {
          this.comboAccidentProcessItems = _result;
        });
      // 사고관계자 구분
      this.$comm
        .getComboItems('SAF_ACCIDENT_PSN_TYPE', false)
        .then((_result) => {
          const result = _result.map((items) => {
            items.code = items.code === null ? '' : items.code;
            return items;
          });
          this.comboPsnTypeItems = result;

          this.gridRefPsnOptions.header = [
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000000686'),
              dataField: 'psnTypeCd',
              width: '25%',
              renderer: {
                type: 'DropDownListRenderer',
                list: this.comboPsnTypeItems,
                keyField: 'code',
                valueField: 'codeNm',
              },
            },
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000001630'),
              dataField: 'refNm',
              width: '25%',
              editable: false,
            }, // 성명
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000001287'),
              dataField: 'refDeptNm',
              width: '25%',
              editable: false,
            }, // 부서
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000002772'),
              dataField: 'refDutyNm',
              width: '25%',
              editable: false,
            }, // 직책
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000001360'),
              dataField: 'remarks',
              width: '25%',
              style: 'left-align',
              editRenderer: {
                type: 'InputEditRenderer',
              },
            }, // 비고
          ];
        });
      this.gridRefPsnOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002892'),
          color: 'blue',
          btnClicked: 'btnRefPsnAdd',
          btnClickedError: 'btnClickedError',
          visible: !this.disabled && this.editable,
        }, //  추가
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001495'),
          color: 'red',
          btnClicked: 'btnRefPsnDelete',
          btnClickedError: 'btnClickedError',
          visible: !this.disabled && this.editable,
        }, //  삭제
      ];

      setTimeout(() => {
        this.comboNoAccidentItems = [
          {
            noAccidentYn: 'plant',
            noAccidentYnNm: this.$comm.getLangSpecInfoLabel('L0000003661'),
          }, // 사업장 무재해 반환
          {
            noAccidentYn: 'dept',
            noAccidentYnNm: this.$comm.getLangSpecInfoLabel('L0000003662'),
          }, // 부서 무재해 반환
        ];
        if (!this.accidentDetail.noAccidentYns) {
          this.accidentDetail.noAccidentYns = [];
        }
        if (this.accidentDetail.noAccidentYn === 'Y') {
          this.accidentDetail.noAccidentYns.push({
            code: 'plant',
            name: this.$comm.getLangSpecInfoLabel('L0000003661'), // 사업장 무재해 반환
          });
        }
        if (this.accidentDetail.noAccidentDeptYn === 'Y') {
          this.accidentDetail.noAccidentYns.push({
            code: 'dept',
            name: this.$comm.getLangSpecInfoLabel('L0000003662'), // 부서 무재해 반환
          });
        }

        // this.accidentDetail.noAccidentYn = this.accidentDetail.noAccidentYn
        //   ? this.accidentDetail.noAccidentYn
        //   : 'N';
      }, 300);
      // this.setWorkLostDay();
    },
    /** 사고피해자 조회 **/
    getRefPsnList() {
      if (
        !this.accidentDetail.safAccidentNo ||
        this.accidentDetail.safAccidentNo === 0
      ) {
        return;
      }
      this.$http.url = this.searchRefPsnUrl;
      this.$http.type = 'GET';
      this.$http.param = {
        safAccidentNo: this.accidentDetail.safAccidentNo,
      };
      this.$http.request(
        (_result) => {
          this.gridRefPsnOptions.data = this.$_.clone(_result.data);
          this.YAuiGrid.setGridData(this.gridRefPsnOptions.data);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    setWorkLostDay() {
      if (
        !this.accidentDetail.workLostDay ||
        this.accidentDetail.workLostDay === 0
      ) {
        this.accidentDetail.workLostDay = this.$comm
          .moment()
          .diff(
            this.$comm
              .moment(
                this.accidentDetail.accidentYmd +
                  ' ' +
                  this.accidentDetail.accidentHour +
                  ':' +
                  this.accidentDetail.accidentMinute,
                'YYYY-MM-DD HH-mm'
              )
              .format('YYYY-MM-DD HH-mm'),
            'days'
          );
      }
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
    closePopupSearchUser(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data.users) {
        this.$_.forEach(data.users, (user) => {
          if (
            this.$_.indexOf(
              this.$_.map(this.YAuiGrid.getGridData(), 'refUserId'),
              user.userId
            ) > -1
          ) {
            return;
          }
          let row = {
            psnTypeCd: '',
            refUserId: user.userId,
            refNm: user.userNm,
            refDeptCd: user.deptCd,
            refDeptNm: user.deptNm,
            remarks: '',
          };
          this.YAuiGrid.addRow(row, 'last');
        });

        this.accidentDetail.accidentRefPsns = this.YAuiGrid.getGridData();
      }
    },
    /** button 관련 이벤트 **/
    /**
     * 상해자(당사) 행 추가
     */
    btnRefPsnAdd() {
      this.popupOptions.target = () =>
        import(`${'@/pages/manage/user/userSearch.vue'}`);
      this.popupOptions.title = 'L0000001466'; // 사용자검색
      this.popupOptions.param = {
        multiple: true,
      };
      this.popupOptions.visible = true;
      this.popupOptions.width = '60%';
      this.popupOptions.top = '100px';
      this.popupOptions.closeCallback = this.closePopupSearchUser;
    },
    /**
     * 상해자(당사) 행 삭제
     */
    btnRefPsnDelete() {
      const selectedRows = this.YAuiGrid.getCheckedRowItemsAll();
      this.$_.forEach(selectedRows, (item) => {
        this.gridRefPsnOptions.data.splice(
          this.$_.indexOf(
            this.$_.map(this.gridRefPsnOptions.data, 'refUserId'),
            item.userId
          ),
          1
        );
      });
      this.YAuiGrid.setGridData(this.gridRefPsnOptions.data);
    },
    /**
     * 수정 버튼 안보여지도록 처리
     *  버튼 http 통신 중 error 발생 callback
     * _result : error return하는 데이터
     */
    btnClickedErrorCallback(_result) {
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    /** end button 관련 이벤트 **/
    cellEditEndHandler() {
      this.gridRefPsnOptions.data = this.YAuiGrid.getGridData();
    },
  },
};
</script>
<style>
#cauTypeCd {
  height: auto;
}
</style>
