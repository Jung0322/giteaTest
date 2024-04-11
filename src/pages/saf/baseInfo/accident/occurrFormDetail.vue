<!--
  목적 : 안전 > 기준정보 > 발생형태 상세
  Detail : 
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row ref="detailBox">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <b-row>
            <b-col sm="12">
              <!-- 발생형태 상세 -->
              <y-label
                label="L0000001086"
                icon="user-edit"
                color-class="cutstom-title-color"
              />
              <div slot="buttonGroup" class="float-right mb-1">
                <!-- 저장(insert) -->
                <y-btn
                  v-if="editable && createMode"
                  :action-url="insertUrl"
                  :param="codeMaster"
                  :is-submit="isCreateSubmit"
                  title="L0000002474"
                  color="orange"
                  action-type="post"
                  beforeSubmit="beforeCreateSubmit"
                  @beforeCreateSubmit="beforeCreateSubmit"
                  @btnClicked="btnCreateClickedCallback"
                  @btnClickedErrorCallback="btnClickedErrorCallback"
                />
                <!-- 저장(update) -->
                <y-btn
                  v-if="editable && !createMode && updateMode"
                  :action-url="editUrl"
                  :param="codeMaster"
                  :is-submit="isUpdateSubmit"
                  title="L0000002474"
                  color="orange"
                  action-type="put"
                  beforeSubmit="beforeUpdateSubmit"
                  @beforeUpdateSubmit="beforeUpdateSubmit"
                  @btnClicked="btnUpdateClickedCallback"
                  @btnClickedErrorCallback="btnClickedErrorCallback"
                />
                <!-- 닫기 -->
                <y-btn title="L0000000881" @btnClicked="btnClosePopup" />
              </div>
            </b-col>
          </b-row>

          <b-card>
            <b-row>
              <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
                <!-- 코드 -->
                <y-text
                  :width="8"
                  :editable="editable"
                  :required="true"
                  :maxlength="codeGroup.codeLength"
                  :disabled="!createMode"
                  ui="bootstrap"
                  label="L0000002969"
                  name="code"
                  v-model="codeMaster.code"
                  v-validate="'required'"
                  :state="validateState('code')"
                />
              </b-col>
              <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
                <!-- 대분류명 -->
                <y-text
                  :width="8"
                  :editable="editable"
                  :required="true"
                  :maxlength="30"
                  ui="bootstrap"
                  label="L0000000915"
                  name="codeNm"
                  v-model="codeMaster.codeNm"
                  v-validate="'required'"
                  :state="validateState('codeNm')"
                />
              </b-col>
              <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
                <!-- 사용여부 -->
                <y-switch
                  :width="8"
                  :editable="editable"
                  true-value="Y"
                  false-value="N"
                  ui="bootstrap"
                  label="L0000001439"
                  name="useYn"
                  selectText="L0000001440"
                  unselectText="L0000001063"
                  v-model="codeMaster.useYn"
                />
              </b-col>
              <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
                <!-- 정렬순서 -->
                <y-number
                  :width="8"
                  :editable="editable"
                  :maxlength="5"
                  :hasSeperator="false"
                  :isPositive="true"
                  ui="bootstrap"
                  label="L0000002601"
                  name="sortOrder"
                  v-model="codeMaster.sortOrder"
                />
              </b-col>
            </b-row>
          </b-card>
        </b-col>
      </b-col>
    </b-row>

    <b-row>
      <b-col sm="12">
        <!-- 투자항목(중분류) 목록 -->
        <y-auigrid
          ref="yAuiGrid"
          :editable="editable"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000001088')"
          :useExcelExport="false"
          :showRowCheckColumn="true"
          @btnAddItemCheck="btnAddItemCheck"
          @btnDeleteItemCheck="btnDeleteItemCheck"
        />
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  /** attributes: name, components, props, data **/
  name: 'y-occurr-form-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        code: 0,
        pageNm: '',
        noAccUseYn: false,
      },
    },
  },
  data() {
    return {
      code: '', // 대분류 코드
      editable: false,

      // 대분류 데이터
      codeMaster: {
        codeGroupCd: '',
        code: '',
        codeNm: '',
        sortOrder: 0,
        useYn: 'Y',
        createUserId: '',
        createUserNm: '',
        createDt: '',
        updateUserId: '',
        updateUserNm: '',
        updateDt: '',
        middleItems: [], // 중분류 목록
      },
      codeGroup: {
        codeLength: 5,
      },
      // 그리드 중분류 목록
      YAuiGrid: null,
      gridOptions: {
        header: [],
        data: [],
        height: '300',
      },
      dbMiddleItems: [], // db등록된 중분류 목록

      createMode: true,
      updateMode: false,
      isCreateSubmit: false,
      isUpdateSubmit: false,

      insertUrl: '',
      editUrl: '',
      detailUrl: '',
      checkUrl: '',

      middleSearchUrl: '',
      middleCheckUrl: '',
    };
  },
  watch: {
    'popupParam.code': function (newValue, oldValue) {
      // props속성이 변경될 경우
      this.init();
    },
  },
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data()); // mount 전 데이터를 default 설정값으로 초기화
    this.init(); // 초기 설정
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.getDetail().then(() => {
      this.getMiddleList(); // 중분류 목록 db 조회
    });
  },
  beforeDestroy() {},
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      this.code = this.popupParam.code;
      this.editable = this.$route.meta.editable;

      // URL 셋팅
      this.insertUrl = transactionConfig.saf.accidentOccurrForm.insert.url;
      this.editUrl = transactionConfig.saf.accidentOccurrForm.edit.url;
      this.detailUrl = selectConfig.saf.accidentOccurrForm.get.url;
      this.checkUrl = selectConfig.saf.accidentOccurrForm.check.url;

      this.middleSearchUrl = selectConfig.saf.accidentOccurrAtt.list.url;
      this.middleCheckUrl = selectConfig.saf.accidentOccurrAtt.checkAtts.url;
      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002969'),
          dataField: 'code',
          width: '30%',
          editRenderer: {
            editable: this.editable,
            type: 'InputEditRenderer',
            maxlength: Number(this.codeMaster.codeLength),
          },
        }, // 중분류 코드
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002731'),
          dataField: 'codeNm',
          width: '50%',
          style: 'left-align',
          editRenderer: {
            editable: this.editable,
            type: 'InputEditRenderer',
          },
        }, // 중분류 코드명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001439'),
          dataField: 'useYn',
          width: '20%',
          renderer: {
            type: 'CheckBoxEditRenderer',
            showLabel: false,
            editable: this.editable,
            checkValue: 'Y',
            unCheckValue: 'N',
          },
        }, // 사용여부
      ];

      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002892'),
          color: 'orange',
          btnClicked: 'btnAddItemCheck',
          btnClickedError: 'btnClickedError',
          visible: this.editable,
        }, // 추가
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001495'),
          color: 'red',
          btnClicked: 'btnDeleteItemCheck',
          btnClickedError: 'btnClickedError',
          visible: this.editable,
        }, // 삭제
      ];
    },
    /** 대분류 코드 정보 조회 */
    getDetail() {
      return new Promise((resolve, reject) => {
        if (!this.code) return;
        this.$http.url = this.$format(this.detailUrl, this.code);
        this.$http.type = 'get';
        this.$http.request(
          (_result) => {
            this.createMode = false;
            this.updateMode = true;
            this.codeMaster = _result.data; // db 대분류 코드 정보 조회

            resolve();
          },
          (_error) => {
            reject(_error);
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      });
    },
    // 중분류 코드 목록 조회
    getMiddleList() {
      if (!this.code) return;
      this.$http.url = this.middleSearchUrl;
      this.$http.type = 'get';
      this.$http.param = {
        codeGroupCd: this.code,
      };
      this.$http.request(
        (_result) => {
          this.YAuiGrid.setGridData(_result.data);
          this.dbMiddleItems = this.YAuiGrid.getGridData(); // 중분류 행 삭제 전 체크를 위해
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /** /초기화 관련 함수 **/

    /** validation checking **/
    checkBeforeSubmit() {
      // 저장 전 체크
      this.checkValidation(); // 값 유효성 체크
    },
    checkValidation() {
      // 값 유효성 체크
      let stepACheck = true;
      // 대분류 값 입력 체크
      this.$_.forEach(this.codeMaster, (val, key) => {
        val = this.$_.trim(val); // 좌우 공백 제거
        if (val === '' && key === 'code') {
          stepACheck = false;
          window.getApp.$emit('ALERT', {
            title: 'L0000003395', // 안내
            message: 'M0000001119', // 코드를 입력해주세요
            type: 'warning', // success / info / warning / error
          });
          return false;
        } else if (val === '' && key === 'codeNm') {
          stepACheck = false;
          window.getApp.$emit('ALERT', {
            title: 'L0000003395', // 안내
            message: 'M0000001163', // 대분류명을 입력해주세요
            type: 'warning', // success / info / warning / error
          });
          return false;
        }
      });
      if (!stepACheck) return;

      // 중분류 값 입력 체크
      let stepBCheck = true;
      const gridData = this.YAuiGrid.getGridData();
      this.$_.forEach(gridData, (item) => {
        item.code = this.$_.trim(item.code);
        item.codeNm = this.$_.trim(item.codeNm);

        if (item.code === '') {
          stepBCheck = false;
          window.getApp.$emit('ALERT', {
            title: 'L0000003395', // 안내
            message: 'M0000001164', // 중분류 코드를 입력해주세요
            type: 'warning', // success / info / warning / error
          });
          return false;
        } else if (item.codeNm === '') {
          stepBCheck = false;
          window.getApp.$emit('ALERT', {
            title: 'L0000003395', // 안내
            message: 'M0000001165', // 중분류명을 입력해주세요
            type: 'warning', // success / info / warning / error
          });
          return false;
        }
      });
      if (!stepBCheck) return;

      // 유효성 검사 체크
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            this.checkDuplCodeMaster();
          } else {
            this.$popupRequired.check(
              'occurrFormAttDetail',
              this.$data,
              this.errors
            );
          }
        })
        .catch((e) => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000876' // 유효성 검사도 에러가 발생하였습니다.
          );
        });
    },
    // 대분류 코드 중복 체크
    checkDuplCodeMaster() {
      this.$http.url = this.checkUrl;
      this.$http.type = 'get';
      this.$http.param = {
        code: this.codeMaster.code,
        codeNm: this.codeMaster.codeNm,
      };
      this.$http.request(
        (_result) => {
          let result = true;
          // 동일코드(그룹코드, 대분류코드) 존재 시 또는 다른 코드(동일 코드그룹, 다른 코드) 같은 코드명 존재 시
          if (_result.data && _result.data.length > 0) {
            if (
              // 대분류 신규 등록이면서 코드가 이미 존재할 경우
              this.createMode &&
              this.$_.findIndex(_result.data, { gubun: 'code' }) > -1
            ) {
              result = false;
              window.getApp.$emit('ALERT', {
                title: 'L0000003395', // 안내
                message: 'M0000000342', // 이미 같은 코드가 존재합니다.
                type: 'warning',
              });
            } else if (
              // 다른 코드(동일 그룹코드, 다른 코드) 같은 코드명(code_nm) 존재할 경우
              this.$_.findIndex(_result.data, { gubun: 'name' }) > -1
            ) {
              result = false;
              window.getApp.$emit('ALERT', {
                title: 'L0000003395', // 안내
                message: 'M0000000697', // 이미 같은 대분류명이 존재합니다.
                type: 'warning',
              });
            }
          }
          if (result) this.checkDuplMiddleItems();
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    // 중분류 중복 체크
    checkDuplMiddleItems() {
      let duplCheck = true;
      const gridData = this.YAuiGrid.getGridData();
      // let newMiddleItems = gridData.filter(item => !this.dbMiddleItems.includes(item)); // 신규 추가한 중분류 행
      // 신규 추가한 중분류 행
      let newMiddleItems = this.YAuiGrid.getGridData();
      this.$_.forEach(this.dbMiddleItems, (item) => {
        newMiddleItems = this.$_.reject(newMiddleItems, item);
      });

      if (newMiddleItems && newMiddleItems.length > 0) {
        // 신규 추가한 행을 그리드 목록 내에서 중복 체크
        this.$_.forEach(newMiddleItems, (item) => {
          let codeCount = 0;
          let codeNmCount = 0;
          this.$_.forEach(this.dbMiddleItems, (target) => {
            if (item.code === target.code) codeCount++;
            if (item.codeNm === target.codeNm) codeNmCount++;
          });
          if (codeCount > 0) {
            duplCheck = false;
            window.getApp.$emit('ALERT', {
              title: 'L0000003395' /* 안내 */,
              message: `${item.code}은 사용중인 코드입니다.`,
              type: 'warning',
            });
          } else if (codeNmCount > 0) {
            duplCheck = false;
            window.getApp.$emit('ALERT', {
              title: 'L0000003395' /* 안내 */,
              message: `${this.codeNm}은 사용중인 중분류명입니다.`,
              type: 'warning',
            });
          }
          if (!duplCheck) return false; // foreach break
        });
        if (!duplCheck) return;

        // db 그룹코드 SAF_ACCIDENT_OCC_PTN_CLS 안에서 중분류 코드 중복 체크
        let data = newMiddleItems.map((item) => item.code).join(',');

        // db 데이터에서 중복 체크
        this.$http.url = this.middleCheckUrl;
        this.$http.type = 'get';
        this.$http.param = {
          code: data,
        };
        this.$http.request(
          (_result) => {
            // 동일코드 존재시
            if (_result.data && _result.data.length > 0) {
              let duplCodes = _result.data.map((item) => item.code).join(', ');
              window.getApp.$emit('ALERT', {
                title: 'L0000003395' /* 안내 */,
                message: `${duplCodes}은 사용중인 코드입니다.`,
                type: 'warning',
              });
            } else {
              this.codeMasterSubmit();
            }
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      } else {
        this.codeMasterSubmit();
      }
    },
    // 저장
    codeMasterSubmit() {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321', // 확인
        message: 'M0000000011', // 저장하시겠습니까?
        type: 'info',
        confirmCallback: () => {
          this.codeMaster.createUserId = this.$store.getters.token;
          this.codeMaster.updateUserId = this.$store.getters.token;
          this.codeMaster.middleItems = this.YAuiGrid.getGridData();
          if (this.createMode) this.isCreateSubmit = true;
          else this.isUpdateSubmit = true;
        },
      });
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
    /** /validation checking **/

    /** Button Event **/
    // 중분류 행 추가 버튼
    btnAddItemCheck() {
      const addData = {
        codeGroupCd: this.codeMaster.code,
        code: '',
        codeNm: '',
        sortOrder: 0,
        useYn: 'Y',
        createUserId: this.codeMaster.createUserId,
        updateUserId: this.codeMaster.updateUserId,
      };

      this.YAuiGrid.addRow(addData);
    },
    // 중분류 행 삭제 버튼
    btnDeleteItemCheck() {
      const selectedRows = this.YAuiGrid.getCheckedRowItemsAll();

      if (selectedRows.length <= 0) {
        // 체크 항목 미존재 시
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'M0000000057' /* 삭제할 항목을 선택해주세요. */,
          type: 'warning',
        });
        return;
      }

      let registerdCodeStr = '';
      this.$_.forEach(selectedRows, (item) => {
        if (this.dbMiddleItems.some((items) => items.code === item.code)) {
          registerdCodeStr += `${item.code}, `;
        }
      });
      if (registerdCodeStr !== '') {
        registerdCodeStr = registerdCodeStr.slice(0, -2);
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: `${registerdCodeStr}은 사용중인 코드입니다.`,
          type: 'warning',
        });
        return;
      }
      this.deleteItem();
    },
    // 행 삭제
    deleteItem() {
      let gridData = this.YAuiGrid.getGridData();
      const selectedRows = this.YAuiGrid.getCheckedRowItemsAll();
      this.$_.forEach(selectedRows, (item) => {
        gridData = this.$_.reject(gridData, item);
      });
      this.YAuiGrid.setGridData(gridData);
    },
    beforeCreateSubmit() {
      this.checkBeforeSubmit();
    },
    beforeUpdateSubmit() {
      this.checkBeforeSubmit();
    },
    btnCreateClickedCallback(_result) {
      this.code = _result.data; // 인서트한 대분류 코드
      this.isCreateSubmit = false;
      this.createMode = false;
      this.updateMode = true;
      this.getDetail().then(() => {
        this.getMiddleList();
      });
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // 안내
        message: 'M0000000006', // 저장되었습니다.
        type: 'success',
      });
    },
    btnUpdateClickedCallback(_result) {
      this.isUpdateSubmit = false;
      this.getDetail().then(() => {
        this.getMiddleList();
      });
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // 안내
        message: 'M0000000006', // 저장되었습니다.
        type: 'success',
      });
    },
    btnClickedErrorCallback(_result) {
      this.isCreateSubmit = false;
      this.isUpdateSubmit = false;
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    btnClosePopup() {
      // 부모창에 값 전달
      this.$emit('closePopup', { success: true });
    },
    /** /Button Event **/
  },
};
</script>
