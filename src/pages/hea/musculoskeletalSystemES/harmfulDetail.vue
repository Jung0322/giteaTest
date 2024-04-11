<!--
  목적 : 근골격계 체크리스트 등록/수정
  Detail : 체크리스트 등록/수정
  examples:
  -->
<template>
  <b-container fluid>
    <b-row>
      <!-- 체크리스트 상세 -->
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 유해요인 상세 -->
            <y-label
              label="L0000002169"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 저장 -->
              <y-btn
                v-if="!popupParam.disabled"
                :isFileRequestPost="true"
                :action-url="saveUrl"
                :param="saveData"
                :is-submit="isSave"
                title="L0000002474"
                color="orange"
                action-type="PUT"
                beforeSubmit="beforeSave"
                @beforeSave="beforeSave"
                @btnClicked="btnSaveClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 조사구분 -->
              <y-radio
                :width="baseWidth"
                :editable="editable"
                :disabled="popupParam.disabled"
                :required="true"
                :comboItems="surveryTypeItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                name="surveryType"
                label="L0000002645"
                v-model="harmful.surveryType"
                v-validate="'required'"
                :state="validateState('surveryType')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4"></b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 조사일시 -->
              <y-datepicker
                id="focusChange"
                tabindex="0"
                :width="baseWidth"
                :editable="editable"
                :disabled="popupParam.disabled"
                :required="true"
                label="L0000002661"
                name="surveryDt"
                default="harmful.surveryDt"
                v-model="harmful.surveryDt"
                v-validate="'required'"
                :state="validateState('surveryDt')"
              ></y-datepicker>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 단위작업 -->
              <y-text
                :width="baseWidth"
                :editable="editable"
                :disabled="true"
                :comboItems="muscUnitList"
                itemText="unitWorkNm"
                itemValue="unitWorkNm"
                ui="bootstrap"
                label="L0000000872"
                name="unitWorkNm"
                v-model="harmful.unitWorkNm"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 조사대상부서 -->
              <y-tree-dept
                :width="baseWidth"
                label="L0000004264"
                type="edit"
                :plantCd="harmful.plantCd"
                v-model="harmful.deptCd"
                :editable="editable"
                :disabled="true"
                name="deptCd"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 조사자 -->
              <y-text
                :width="8"
                :required="true"
                :editable="editable"
                :disabled="true"
                ui="bootstrap"
                label="L0000002662"
                name="surveryUserNm"
                v-model="harmful.surveryUserNm"
                :appendIcon="[{ icon: 'search', callbackName: 'searchUser' }]"
                @searchUser="btnSearchUserClicked"
                :state="validateState('surveryUserNm')"
              />
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <!-- 작업내용 -->
              <y-textarea
                :width="10"
                :editable="editable"
                :disabled="true"
                ui="bootstrap"
                label="L0000002374"
                name="processDesc"
                v-model="harmful.processDesc"
              ></y-textarea>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
    <!-- <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
           작업장 상황 조사 
          <y-data-table
            label="L0000002419"
            ref="dataTableCheck"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :useRownum="false"
            :editable="!popupParam.disabled"
            :disabled="popupParam.disabled"
            @singlecheckedRow="singlecheckedRow"
            @inputValueChange="inputValueChange"
          ></y-data-table>
        </b-col>
      </b-col>
    </b-row> -->
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :editable="!popupParam.disabled"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000002419')"
          :useExcelExport="false"
          :enableCellMerge="true"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          @singlecheckedRow="singlecheckedRow"
        />
      </b-col>
    </b-row>
    <el-tabs type="border-card" v-model="tabIndex" class="mt-3">
      <el-tab-pane
        v-for="(item, i) in tabItems"
        :key="i"
        stretch
        class="default-tab-pane"
      >
        <span slot="label">
          <i class="el-icon-date"></i>
          {{ item.title }}
        </span>
      </el-tab-pane>
      <keep-alive>
        <component
          :is="component"
          v-if="component"
          :harmful.sync="harmful"
          :getFile="getFile"
          :saveData.sync="saveData"
          :editable="editable"
          :disabled="popupParam.disabled"
          sm="12"
        />
      </keep-alive>
    </el-tabs>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
import vue2Datepicker from 'vue2-datepicker';
import LoginVue from '../../auth/Login.vue';
export default {
  /** attributes: name, components, props, data **/
  name: 'survey-result-job',
  components: {
    'datetime-picker': vue2Datepicker,
  },
  props: {
    popupParam: {
      type: Object,
      default: function () {
        return {
          muscHarmfulNo: 0,
          disabled: false,
        };
      },
    },
  },
  data() {
    return {
      harmful: {
        muscHarmfulNo: 0,
        muscResearchUnitNo: 0,
        muscHarmfulEvalNo: 0,
        unitWorkNm: '',
        surveryType: '',
        surveryDt: '',
        surveryUserId: '',
        surveryUserNm: '',
        plantCd: '',
        deptCd: '',
        deptNm: '',
        processNm: '',
        processDesc: '',
        changeYnEquip: '',
        changeYnWorkload: '',
        changeYnSpeed: '',
        changeYnBusiness: '',
        changeYnEtc: '',
        summaryEquip: '',
        summaryWorkload: '',
        summarySpeed: '',
        summaryBusiness: '',
        summaryEtc: '',
        summaryOverall: '',
        createUserId: '',
        updateUserId: '',
        dataTableIn: [],
        muscHarmfulEvals: [],
        deleteMuscHarmfulEvals: [],
      },
      file: [],
      getFile: false,
      saveData: {
        harmful: '',
        taskClassNm: 'HEA_MUSC_HARMFUL_EVAL',
        files: [],
      },
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '60%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      gridOptions: {
        name: 'harmfulDetail',
        header: [],
        data: [],
        height: '300',
      },
      YAuiGrid: null,
      muscUnitList: [],
      surveryTypeItems: [],
      searchUrl: '',
      saveUrl: '',
      baseWidth: 8,
      updateMode: false,
      editable: true,
      isSubmit: false,
      isSave: false,
      tabItems: [],
      component: null,
      tabIndex: 0,
      excelUploadWatch: 0,
      test: 0,
    };
  },

  watch: {
    tabIndex() {
      if (this.test !== 0) {
        this.loadComponent();
      }
      // this.loadComponent();
    },
    'popupParam.muscHarmfulNo': {
      handler: function () {
        this.getDetail();
      },
    },
    excelUploadWatch() {
      this.getDetail();
    },
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
    window.addEventListener('resize', this.resizeGrid);
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.resizeGrid();
    document.getElementById('focusChange').focus();
  },
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      this.editable = this.$route.meta.editable;
      this.searchUrl = selectConfig.hea.harmful.get.url;
      this.saveUrl = transactionConfig.hea.harmful.edit.url;

      this.tabItems = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002421'),
          url: './harmfulSurvey',
        }, // 작업조건 조사
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002171'),
          url: './harmfulEval',
        }, // 유해요인 평가
      ];

      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000686'),
          dataField: 'gubun',
          width: '20%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001243'),
          dataField: 'changeYn',
          width: '20%',
          renderer: {
            type: 'CheckBoxEditRenderer',
            editable: true, // 체크박스 편집 활성화 여부(기본값 : false)
            checkValue: 'Y', // true, false 인 경우가 기본
            unCheckValue: 'N',
            checkableFunction: function (
              rowIndex,
              columnIndex,
              value,
              isChecked,
              item,
              dataField
            ) {
              if (value) {
                return true;
              }
            },
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000813'),
          dataField: 'summary',
          width: '60%',
        },
        // {
        //   text: 'L0000000686', // 구분
        //   name: 'gubun',
        //   width: '70px',
        //   align: 'center',
        // },
        // {
        //   text: 'L0000001243', // 변화유무
        //   name: 'changeYn',
        //   width: '60px',
        //   align: 'center',
        //   type: 'singlecheckbox',
        //   // singlecheckedRow
        // },
        // {
        //   text: 'L0000000813', // 내용요약
        //   name: 'summary',
        //   width: '230px',
        //   align: 'center',
        //   type: 'text',
        // },
      ];

      this.getSurveryTypeItems();
      this.getDetail();
    },
    getSurveryTypeItems() {
      this.$http.url = this.$format(
        selectConfig.codeMaster.getSelect.url,
        'SURVERY_TYPE'
      );
      this.$http.type = 'get';
      this.$http.request(
        (_result) => {
          this.surveryTypeItems = this.$_.clone(_result.data);
        },
        (_error) => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            'M0000000016' // 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
          );
        }
      );
    },
    // 탭
    loadComponent() {
      var path = this.tabItems[this.tabIndex].url;
      this.component = () => import(`${path}`);
    },
    getDetail() {
      if (!this.popupParam.muscHarmfulNo) {
        this.setWorkArea();
        return;
      }
      this.$http.url = this.$format(
        this.searchUrl,
        this.popupParam.muscHarmfulNo
      );

      this.$http.type = 'get';

      this.$http.request(
        (_result) => {
          this.harmful = this.$_.clone(_result.data);
          this.$_.forEach(this.harmful.muscHarmfulEvals, (item) => {
            if (!item.muscHarmfulEvalNo) {
              let date = new Date();
              item.tempId =
                String(date.getTime()) + String(item.muscResearchChklistNo);
            }
          });
          this.test = 1;
          this.loadComponent();
          this.setWorkArea();
          this.YAuiGrid.setGridData(this.gridOptions.data);
          this.updateMode = true;
        },
        (_error) => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            'M0000000016' // 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
          );
        }
      );
    },
    resizeGrid() {
      let _height = window.innerHeight - 695;
      let _width = window.innerWidth - 755;
      if (window.innerHeight < 500) {
        _height = 250;
      }

      this.YAuiGrid.resize(_width, _height);
    },
    setWorkArea() {
      this.gridOptions.data = [
        {
          checkbox: 'changeYnEquip',
          text: 'summaryEquip',
          gubun: this.$comm.getLangSpecInfoLabel('L0000002398'), // 작업설비
          changeYn: this.harmful.changeYnEquip
            ? this.harmful.changeYnEquip
            : 'N',
          summary: this.harmful.summaryEquip ? this.harmful.summaryEquip : null,
        },
        {
          checkbox: 'changeYnWorkload',
          text: 'summaryWorkload',
          gubun: this.$comm.getLangSpecInfoLabel('L0000002388'), // '작업량',
          changeYn: this.harmful.changeYnWorkload
            ? this.harmful.changeYnWorkload
            : 'N',
          summary: this.harmful.summaryWorkload
            ? this.harmful.summaryWorkload
            : null,
        },
        {
          checkbox: 'changeYnSpeed',
          text: 'summarySpeed',
          gubun: this.$comm.getLangSpecInfoLabel('L0000002399'), // '작업속도',
          changeYn: this.harmful.changeYnSpeed
            ? this.harmful.changeYnSpeed
            : 'N',
          summary: this.harmful.summarySpeed ? this.harmful.summarySpeed : null,
        },
        {
          checkbox: 'changeYnBusiness',
          text: 'summaryBusiness',
          gubun: this.$comm.getLangSpecInfoLabel('L0000004856'), // '업무형태',
          changeYn: this.harmful.changeYnBusiness
            ? this.harmful.changeYnBusiness
            : 'N',
          summary: this.harmful.summaryBusiness
            ? this.harmful.summaryBusiness
            : null,
        },
        {
          checkbox: 'changeYnEtc',
          text: 'summaryEtc',
          gubun: this.$comm.getLangSpecInfoLabel('L0000000794'), // '기타',
          changeYn: this.harmful.changeYnEtc ? this.harmful.changeYnEtc : 'N',
          summary: this.harmful.summaryEtc ? this.harmful.summaryEtc : null,
        },
      ];
    },
    beforeSave() {
      this.getFile = !this.getFile;
      this.checkValidator('edit');
    },
    checkValidator(checkMode) {
      let isIng = true;

      if (!this.harmful.surveryUserNm) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000458', // 조사자를 지정하세요
          type: 'warning',
        });
        isIng = false;
        return;
      } else {
        this.$_.forEach(this.harmful.muscHarmfulEvals, (item) => {
          if (item.workCnt === 0 || item.workload === 0) {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395', // '안내',
              message: 'M0000000459', // 작업부하와 작업빈도를 입력하세요
              type: 'warning',
            });
            isIng = false;
            return;
          }
          if (item.causes === null || item.causes === '') {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395', // '안내',
              message: 'M0000000460', // 발생원인을 입력하세요
              type: 'warning',
            });
            isIng = false;
            return;
          }
        });
      }

      if (isIng) {
        this.$validator
          .validateAll()
          .then((_result) => {
            if (_result) {
              window.getApp.$emit('CONFIRM', {
                title: 'L0000003321', // '확인',
                message: 'M0000000011', // 저장하시겠습니까?
                // TODO : 필요시 추가하세요.
                type: 'info', // success / info / warning / error
                // 확인 callback 함수
                confirmCallback: () => {
                  this.harmful.createUserId = this.$store.getters.token;
                  this.harmful.updateUserId = this.$store.getters.token;

                  this.harmful.summaryOverall = this.harmful.summaryOverall
                    ? this.harmful.summaryOverall
                    : null;
                  if (
                    this.harmful &&
                    this.harmful.muscHarmfulEvals &&
                    this.harmful.muscHarmfulEvals.length > 0
                  ) {
                    this.$_.forEach(this.harmful.muscHarmfulEvals, (item) => {
                      item.tempId = item.tempId
                        ? item.tempId
                        : item.muscHarmfulEvalNo;
                      item.updateUserId = this.$store.getters.token;
                    });
                  }
                  this.YAuiGrid.getGridData().forEach((_item) => {
                    if (_item.text === 'summaryEquip') {
                      this.harmful.summaryEquip = this.$_.clone(_item.summary);
                      this.harmful.changeYnEquip = this.$_.clone(
                        _item.changeYn
                      );
                    }
                    if (_item.text === 'summaryWorkload') {
                      this.harmful.summaryWorkload = this.$_.clone(
                        _item.summary
                      );
                      this.harmful.changeYnWorkload = this.$_.clone(
                        _item.changeYn
                      );
                    }
                    if (_item.text === 'summarySpeed') {
                      this.harmful.summarySpeed = this.$_.clone(_item.summary);
                      this.harmful.changeYnSpeed = this.$_.clone(
                        _item.changeYn
                      );
                    }
                    if (_item.text === 'summaryBusiness') {
                      this.harmful.summaryBusiness = this.$_.clone(
                        _item.summary
                      );
                      this.harmful.changeYnBusiness = this.$_.clone(
                        _item.changeYn
                      );
                    }
                    if (_item.text === 'summaryEtc') {
                      this.harmful.summaryEtc = this.$_.clone(_item.summary);
                      this.harmful.changeYnEtc = this.$_.clone(_item.changeYn);
                    }
                  });

                  this.saveData.harmful = JSON.stringify(this.harmful);
                  this.isSave = true;
                },
              });
            } else {
              window.getApp.$emit(
                'APP_VALID_ERROR',
                'M0000000005' // '필수 입력값을 입력해 주세요.',
              );
            }
          })
          .catch(() => {
            this.isSave = false;
            window.getApp.$emit(
              'APP_VALID_ERROR',
              'M0000000881' // 유효성 검사도중 에러가 발생하였습니다.
            );
          });
      }
    },
    validateState(_ref) {
      if (
        this.veeBag[_ref] &&
        (this.veeBag[_ref].dirty || this.veeBag[_ref].validated)
      ) {
        return !this.errors.has(_ref);
      }
      return null;
    },
    btnSaveClickedCallback(_result) {
      if (!this.popupParam.muscHarmfulNo) {
        this.popupParam.muscHarmfulNo = _result.data;
        this.harmful.muscHarmfulNo = _result.data;
      }

      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // '안내',
        message: 'M0000000006', // 저장되었습니다.
        type: 'success',
      });
      this.getDetail();
      this.$emit('redirectYN', '1');
      this.isSave = false;
    },

    closePopup(data) {
      this.$emit('closePopup', data);
    },
    /**
     * 버튼 에러 처리용 공통함수
     */
    btnClickedErrorCallback(_result) {
      this.isSave = false;
      this.isSubmit = false;
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    btnSearchUserClicked() {
      if (!this.popupParam.disabled) return;
      this.popupOptions.target = () =>
        import(`${'../../manage/user/userSearch.vue'}`);
      this.popupOptions.param = {
        plantCd: this.harmful.plantCd,
        deptCd: this.harmful.deptCd,
      };
      this.popupOptions.title = 'L0000001466'; // 사용자검색
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopupSearchUser;
    },
    closePopupSearchUser(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data.user) {
        this.harmful.surveryUserNm = data.user.userNm;
        this.harmful.surveryUserId = data.user.userId;
      }
    },
    singlecheckedRow(scope) {
      console.log(scope);
      // this.$_.set(this.harmful, scope.row.checkbox, scope.row.changeYn);
    },
    inputValueChange(data) {
      this.$_.set(this.harmful, data.row.text, data.row.summary);
    },
    inputChange(data) {},
  },
};
</script>
<style></style>
