<!--
  목적 : 평가대상 작업 신규등록 팝업
  작성자 : kyh
  Detail :
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 검색 -->
    <y-search-box :gridOptions="gridOptions">
      <div slot="header">
        <y-label label="L0000000327" />
      </div>
      <b-row slot="search">
        <b-col sm="12">
          <b-row>
            <!-- 공정 -->
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-select
                :width="8"
                :comboItems="processCdItems"
                itemText="processNm"
                itemValue="processCd"
                ui="bootstrap"
                label="공정"
                name="processCd"
                v-model="Planmgmt.processCd"
                :required="true"
                v-validate="'required'"
                :state="validateState('processCd')"
              ></y-select>
            </b-col>

            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 작업명 -->
              <y-text
                :width="8"
                :clearable="true"
                ui="bootstrap"
                label="작업명"
                name="workNm"
                v-model="Planmgmt.workNm"
                :required="true"
                v-validate="'required'"
                :state="validateState('workNm')"
              />
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </y-search-box>
    <!-- 검색 결과 테이블 -->
    <b-row class="mt-3">
      <b-col sm="12" class="px-0">
        <b-col sm="12">
          <!-- <div slot="buttonGroup" class="float-right mb-1"> -->
          <!-- 작성 -->
          <!-- <y-btn title="작성" color="green" @btnClicked="addGridData" /> -->
          <!-- 선택 -->
          <!-- <y-btn
              v-if="!updateMode && editable"
              :action-url="insertUrl"
              :param="assessJob"
              :is-submit="isInsert"
              title="선택"
              color="orange"
              action-type="POST"
              beforeSubmit="beforeInsert"
              @beforeInsert="beforeValidateChk"
              @btnClicked="btnInsertClickedCallback"
              @btnClickedErrorCallback="btnClickedErrorCallback"
            /> -->

          <!-- 닫기 -->
          <!-- <y-btn title="L0000000881" @btnClicked="closePopup" /> -->
          <!-- </div> -->
          <!-- 평가대상 작업 목록 -->
          <!-- <y-data-table
            ref="dataTable"
            label="평가대상 작업 목록"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :checkItemData="checkItemData"
            checkKey="rowNum"
            :use-paging="true"
            v-model="selectedValue"
          >
            <el-table-column
              align="center"
              type="selection"
              slot="selection"
              width="55"
            ></el-table-column>
          </y-data-table> -->
          <y-auigrid
            ref="yAuiGrid"
            :name="gridOptions.name"
            :headers="gridOptions.header"
            :btns="gridOptions.btns"
            :height="gridOptions.height"
            :label="this.$comm.getLangSpecInfoLabel('L0000003053')"
            :useExcelExport="false"
            :enableCellMerge="true"
            :enableSorting="true"
            :showGridSetSave="true"
            :useContextMenu="true"
            :enableRightDownFocus="true"
            :showGridCtrl="true"
            :showRowCheckColumn="true"
            @addGridData="addGridData"
            @btnSaveClicked="btnSaveClicked"
          />
        </b-col>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import arrayToTree from 'array-to-tree';
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
import YTreeDataTable from '@/components/YTreeDataTable';

export default {
  /** attributes: name, components, props, data **/
  name: 'user-search', // 반드시 입력하세요(안 하면 warning 발생). 네이밍 룰은 현재 vue component의 파일명의 단어를 "-"로 구분(예:exam-data)하여 입력하시면 됩니다. 입력후 이 주석은 지워주세요.
  components: {
    YTreeDataTable,
  },
  props: {
    popupParam: {
      type: Object,
      default: {
        multiple: false, // 멀티체크여부
        disabled: false,
        plantEditable: true,
        plantDisabled: false,
        deptDisabled: false,
        plantCd: '', // 사업장코드
        // 여기부터 신규 데이터
        deptCd: '', // 평가팀 부서코드
        deptNm: '', // 평가팀 부서명
        classificationCd: '', // 분류코드
        classificationNm: '', // 분류명
        year: '', // 년도
        userId: '', // 평가담당자
        userNm: '', // 평가담당자명
        alias: '', // 부서 약어
      },
    },
  },
  // TODO: 화살표 함수(=>)는 data에 사용하지 말 것
  //    data: () => { return { a: this.myProp }}) 화살표 함수가 부모 컨텍스트를 바인딩하기 때문에 this는 예상과 달리 Vue 인스턴스가 아니기 때문에 this.myProp는 undefined로 나옵니다.
  //    참고url: https://kr.vuejs.org/v2/api/index.html#data
  data() {
    return {
      // Naming Rule : JAVA model class와 연동되는 vue model은 model class명을 Camel case로 변환해서 선언하시고 기본값은 {}로 초기화 시켜주세요.
      // 예) ExamData -> examData: {},
      Planmgmt: {
        deptCd: '', // 평가팀 부서코드
        deptNm: '', // 평가팀 부서명
        classificationCd: '', // 분류코드
        classificationNm: '', // 분류명
        year: '', // 년도
        userId: '',
        userNm: '',
        processCd: '', // 공정명
        processNm: '', // 공정코드
        workNm: '', // 작업명
        plantCd: '', // 사업장코드
      },
      selectedDept: null,
      gridOptions: {
        header: [],
        data: [],

        height: '350',
        searchboxStatus: true, // 팝업의 검색박스는 목록의 검색박스 보이기/숨기기와 상관없이 무조건 보이도록 설정.
      },
      headCheckItemData: [], // 그리드에 체크박스 적용하기 위한 데이터
      treeDeptData: [], // 조직트리 목록
      realSelData: {
        // 하위부서 포함하여 체크된 데이터
        oldData: [], // 과거 데이터
        newData: [], // 신규 데이터
      },
      isSearchDeptNm: false, // 부서명 검색 여부
      timeLimit: 0, // 하위 부서를 체크/해제하기 위한 시간
      searchUrl: '',
      processUrl: '', // 사업장별 공정 url
      // 여기부터 데이터 신규
      processCdItems: [], // 공정
      selectedValue: [],
      rsaAssessTypeItems: [],
      insertUrl: '',
      assessJob: [], // 평가대상 작업목록(저장용)
      isInsert: false,
      updateMode: false,
      editable: false,
      deptUrl: '',
      alias: '',
      aliasUrl: '',
      checkItemData: [],
      YAuiGrid: null,
    };
  },
  computed: {
    // deptDisabled() {
    //   // 2021년 04월 09일 jkl
    //   // 부서가 '전체', 하위부서 포함 여부(deptSubYn)가 'N' 일경우 검색되어지는 유저가 없어서
    //   // 하위부서 포함 여부(deptSubYn)가 'N'인 경우는 부서 선택을 못하도록 막음
    //   return this.popupParam.deptDisabled || this.popupParam.deptSubYn === 'N';
    // },
    getHeadCheckKey() {
      return this.popupParam.multiple ? 'deptCd' : 'userId';
    },
  },
  watch: {},
  /** Vue lifecycle: created, mounted, destroyed, etc **/
  beforeCreate() {},
  created() {},
  beforeMount() {
    // TODO : data를 초기화 시켜줌(검색 조건 유지가 필요할 때는 삭제할 것)
    // 이유 : vue.js는 SPA기반으로 동작하기 때문에 페이지를 이동하더라도 기존 입력된 정보가 그대로 남아 있는 문제가 있음

    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
  },
  beforeDestory() {},
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      this.editable = this.$route.meta.editable;
      // TODO : 여기에 초기 설정용 함수를 호출하거나 로직을 입력하세요.
      // 초기값 설정
      this.aliasUrl = selectConfig.rsa.planmgmt2.getDeptAlias.url;
      this.insertUrl = transactionConfig.rsa.planmgmt2.insertAssessJob.url;
      this.processUrl = selectConfig.manage.dept.get.url;
      this.deptUrl = selectConfig.manage.dept.get.url;
      this.$comm.getComboItems('RSA_ASSESS_TYPE', false).then((_result) => {
        this.rsaAssessTypeItems = _result;
      });
      this.getProcessCdItems();
      this.getDeptDetail();
      // this.getAlias()
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004990'),
          dataField: 'deptNm',
          width: 200,
        }, // 평가팀
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001341'),
          dataField: 'classificationNm',
          width: 150,
        }, // 분류
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000590'),
          dataField: 'jobManageNo',
          width: 400,
        }, // 관리번호
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000515'),
          dataField: 'processNm',
          width: 200,
        }, // 공정
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002389'),
          dataField: 'jobNm',
          width: 700,
        }, // 작업명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003065'),
          dataField: 'year',
          width: 200,
        }, // 평가년도
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004201'),
          dataField: 'userNm',
          width: 200,
        }, // 평가담당자 (평가담당자는 결재 기안자를 말함)
      ];

      // 그리드 버튼 설정
      this.gridOptions.btns = [
        // 작성
        {
          title: this.$comm.getLangSpecInfoLabel('L0000005925'),
          color: 'orange',
          btnClicked: 'addGridData',
        },
        // 선택
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001561'),
          color: 'green',
          btnClicked: 'btnSaveClicked',
        },
      ];
    },
    btnSaveClicked() {
      this.$comm.recursivePromise([
        {
          func: this.confirm,
        },
        { func: this.saveData },
      ]);
    },
    confirm() {
      return new Promise((_resolve, _reject) => {
        window.getApp.$emit('CONFIRM', {
          title: 'L0000003321', // '확인',
          message: 'L0000005929', // 선택하지 않은 항목은 삭제됩니다. 진행하시겠습니까?
          type: 'info',
          confirmCallback: () => {
            _resolve(true);
          },
          cancelCallback: () => {
            _resolve(false);
          },
        });
      });
    },
    saveData() {
      return new Promise((_resolve, _reject) => {
        this.assessJob = this.YAuiGrid.getCheckedRowItemsAll();
        let tempPlantNm;
        let tempNum = 0;
        let tempStr = '';
        if (this.popupParam.plantCd === '0000') {
          // 공통
          tempPlantNm = 'ALL';
        } else if (this.popupParam.plantCd === '1000') {
          // 본사(세종)
          tempPlantNm = 'M';
        } else if (this.popupParam.plantCd === '3000') {
          // 군산공장
          tempPlantNm = 'G';
        } else if (this.popupParam.plantCd === '2000') {
          // 여수공장
          tempPlantNm = 'Y';
        }

        this.$_.forEach(this.assessJob, (item) => {
          tempNum += 1;
          tempStr = String(tempNum);
          item.jobManageNo =
            tempPlantNm +
            '-JSA-' +
            this.popupParam.alias +
            '-' +
            this.popupParam.classificationNm +
            '-00' +
            tempStr;
          item.plantNm = tempPlantNm;
          item.userNm = this.$store.getters.name;
        });

        this.$http.url = this.insertUrl;
        this.$http.type = 'POST';
        this.$http.param = this.assessJob;
        this.$http.request(
          (_result) => {
            // _resolve(true);
            this.btnInsertClickedCallback(_result);
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
            _reject(_error);
          }
        );
      });
    },
    getDeptDetail() {
      this.$http.url = this.$format(this.deptUrl, this.popupParam.deptCd);
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.alias = _result.data.alias;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getAlias() {
      if (this.popupParam.deptCd) {
        this.$http.url = this.aliasUrl;
        this.$http.param = this.popupParam.deptCd;
        this.$http.type = 'GET';
        this.$http.request(
          (_result) => {
            if (_result.data) {
              this.alias = _result.data.alias;
            }
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      } else {
        this.alias = '';
      }
    },
    btnClickedErrorCallback(result) {
      this.isInsert = false;
      window.getApp.$emit('APP_REQUEST_ERROR', result);
    },
    btnInsertClickedCallback(_result) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395',
        message: 'M0000000006',
        type: 'success', // success / info / warning / error
      });

      this.$_.forEach(_result.data, (item) => {
        item.year = this.popupParam.year;
        item.userNm = this.$store.getters.name;
      });
      this.$emit('closePopup', _result.data);
    },
    beforeValidateChk() {
      if (!this.selectedValue || this.selectedValue.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message:
            '선택된 평가대상 작업 목록이 존재하지 않습니다.' /* 평가대상 작업 목록이 존재하지 않습니다. */,
          type: 'warning', // success / info / warning / error
        });

        return false;
      } else {
        this.nextInsert();
      }
    },
    nextInsert() {
      this.$validator
        .validateAll()
        .then((_result) => {
          window.getApp.$emit('CONFIRM', {
            title: '확인',
            message: '선택하지 않은 항목은 삭제됩니다. 진행하시겠습니까?',
            type: 'info',
            confirmCallback: () => {
              this.assessJob = this.YAuiGrid.getCheckedRowItemsAll();
              let tempPlantNm;
              let tempNum = 0;
              let tempStr = '';
              if (this.popupParam.plantCd === '0000') {
                // 공통
                tempPlantNm = 'ALL';
              } else if (this.popupParam.plantCd === '1000') {
                // 본사(세종)
                tempPlantNm = 'M';
              } else if (this.popupParam.plantCd === '3000') {
                // 군산공장
                tempPlantNm = 'G';
              } else if (this.popupParam.plantCd === '2000') {
                // 여수공장
                tempPlantNm = 'Y';
              }

              this.$_.forEach(this.assessJob, (item) => {
                tempNum += 1;
                tempStr = String(tempNum);
                item.jobManageNo =
                  tempPlantNm +
                  '-JSA-' +
                  this.popupParam.alias +
                  '-' +
                  this.popupParam.classificationNm +
                  '-00' +
                  tempStr;
                item.plantNm = tempPlantNm;
                item.userNm = this.$store.getters.name;
              });

              this.isInsert = true;
            },
          });
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            '유효성 검사도중 에러가 발생하였습니다.'
          );
        });
    },
    addWorkProcess() {},
    validateState(ref) {
      if (
        this.veeBag[ref] &&
        (this.veeBag[ref].dirty || this.veeBag[ref].validated)
      ) {
        return !this.errors.has(ref);
      }
      return null;
    },
    getProcessCdItems() {
      this.$http.url = this.$format(this.processUrl, this.popupParam.deptCd);

      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          if (_result.data) {
            this.processCdItems = _result.data.selectProcess;
            this.processCdItems.splice(0, 0, {
              processCd: null,
              processNm: this.$comm.getLangSpecInfoLabel('L0000003394'),
            }); // 선택하세요
          } else {
            this.processCdItems.splice(0, 0, {
              processCd: null,
              processNm: '해당 사업장 소속의 공정이 존재하지 않습니다.',
            }); // 선택하세요
          }
          this.processCdItems = _result.data.selectProcess;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    addGridData() {
      let addFlag = false;
      let selectedValue = this.YAuiGrid.getGridData();
      var i = 0;
      // 체크목록 초기화 (작성버튼 클릭시 행이 자동으로 체크되도록 하기 위함)
      this.checkItemData = [];
      if (!this.Planmgmt.workNm) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          // 작업명을 입력해주세요.
          message: this.$comm.getLangSpecInfoLabel('M0000001323'),
          type: 'warning',
        });
        return false;
      }
      if (!this.Planmgmt.processCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          // 공정을 선택해주세요.
          message: this.$comm.getLangSpecInfoLabel('M0000001281'),
          type: 'warning',
        });
        return false;
      }
      this.$_.forEach(this.processCdItems, (item) => {
        if (item.processCd === this.Planmgmt.processCd) {
          this.Planmgmt.processNm = item.processNm;
        }
      });
      if (selectedValue.length > 0 || selectedValue) {
        this.$_.forEach(selectedValue, (item) => {
          if (item.jobNm === this.Planmgmt.workNm) {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395' /* 안내 */,
              message:
                '평가대상 작업 목록 중 작성한 작업명이 존재합니다.' /* 공정을 선택하세요. */,
              type: 'warning',
            });
            addFlag = true;
          }
        });
      }
      if (addFlag === false) {
        let data = {
          deptCd: this.popupParam.deptCd, // 평가팀 부서코드
          deptNm: this.popupParam.deptNm, // 평가팀 부서명
          classificationCd: this.popupParam.classificationCd, // 분류코드
          classificationNm: this.popupParam.classificationNm, // 분류명
          year: this.popupParam.year, // 년도
          jobNm: this.Planmgmt.workNm, // 작업명
          processCd: this.Planmgmt.processCd, // 공정코드
          processNm: this.Planmgmt.processNm, // 공정명
          plantCd: this.popupParam.plantCd, // 사업장코드
          jobManageNo: '', // 관리번호
          createUserId: this.$store.getters.token,
          jobNo: 0, // 작업번호 (PK)
          userNm: this.$store.getters.name,
        };

        selectedValue.push(data);
        this.YAuiGrid.setGridData(selectedValue);

        // 추가시 행 자동 선택
        this.YAuiGrid.setAllCheckedRows(true);

        this.Planmgmt.workNm = '';
        this.Planmgmt.processCd = null;
      }
    },
    /**
     * 부서 트리용 기초 정보를 Tree 메뉴로 변환
     */
    convertTree(_treeBases) {
      if (!_treeBases || _treeBases.length <= 0) return null;
      var tree = arrayToTree(_treeBases, {
        parentProperty: 'pdeptCd',
        customID: 'deptCd',
      });
      return tree;
    },

    selectUser() {
      // 멀티 체크한 값을 부모 컴포넌트로 리턴
      if (
        !this.selectedValue ||
        (this.selectedValue && this.selectedValue.length === 0)
      ) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: '평가대상 작업 목록을 한개 이상 선택하세요.', // 평가대상 작업 목록을 한개 이상 선택하세요.
          type: 'warning', // success / info / warning / error
        });
        return;
      }
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321', // 확인
        message: '선택하지 않은 항목은 삭제됩니다. 진행하시겠습니까?',
        type: 'info',
        confirmCallback: () => {
          this.$emit('closePopup', this.selectedValue);
        },
        cancelCallback: () => {},
      });
    },
    selectUser2() {
      if (!this.selectedDept) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000001065', // 부서를 먼저 선택하세요
          type: 'warning', // success / info / warning / error
        });
      } else {
        this.$emit('closePopup', { success: true, dept: this.selectedDept });
      }
    },
    closePopup() {
      // 부모창에 값 전달
      this.$emit('closePopup', { success: true });
    },
    /** Button Event **/

    /** /기타 function **/
  },
};
</script>
