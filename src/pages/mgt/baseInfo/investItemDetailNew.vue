<!--
  목적 : 경영>기준정보>투자항목관리
  Detail : 투자항목관리 검색 화면
  *
  examples: 코드마스터 관리 상세/수정/등록
  *
  -->
<template>
  <b-container fluid>
    <b-row ref="detailBox">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <b-row>
            <b-col sm="12">
              <!-- 투자항목 등록 -->
              <y-label
                label="L0000004260"
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
                  v-if="editable && updateMode"
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
                  :disabled="updateMode"
                  :maxlength="codeGroup.codeLength"
                  ui="bootstrap"
                  label="L0000002969"
                  name="code"
                  v-model="codeMaster.code"
                  v-validate="'required'"
                  :state="validateState('code')"
                />
              </b-col>
              <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
                <!-- 투자분류 -->
                <y-text
                  :width="8"
                  :editable="editable"
                  :required="true"
                  :maxlength="30"
                  ui="bootstrap"
                  label="L0000004226"
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

    <!-- <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
             추가 
            <y-btn v-if="editable" title="L0000002892" color="orange" @btnClicked="btnAddItemCheck" />
             삭제 
            <y-btn v-if="editable" title="L0000001495" color="red" @btnClicked="btnDeleteItemCheck" />
          </div>
             투자항목(중분류) 목록 
            <y-data-table
              label="L0000004263"
              ref="dataTableCheck"
              :height="gridOptions.height"
              :headers="gridOptions.header"
              :items="gridOptions.data"
              :editable="editable"            
              :popMode="true"
              v-model="selectedValue"
              @change="change"
            >          
            <el-table-column align="center" type="selection" slot="selection" width="55"></el-table-column>
          </y-data-table>
        </b-col>
      </b-col>
    </b-row>         -->
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :editable="editable"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000004263')"
          :useExcelExport="false"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showRowCheckColumn="true"
          :showGridCtrl="true"
          :softRemoveRowMode="false"
          @btnAddRow="btnAddRow"
          @btnDelRow="btnDelRow"
        />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
import { resolve } from 'q';
export default {
  /** attributes: name, components, props, data **/
  name: 'y-code-master-detail',
  props: {
    popupParam: {
      default: {
        codeGroupCd: 'MICS3', // 경영 투자항목관리 분류코드
        codeNm: '', // 대분류 코드명
        code: '', // 대분류 코드
      },
    },
  },
  data() {
    return {
      code: '', // 대분류 코드
      codeNm: '', // 대분류 코드명
      codeGroupCd: 'MICS3', // 대분류 그룹코드
      editable: false, // 수정 가능 여부

      codeMaster: {
        // 대분류 코드 정보
        codeGroupCd: 'MICS3',
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
        investItems: [], // 중분류 목록
      },
      codeGroup: {
        codeLength: 5,
      },
      gridOptions: {
        name: 'investItemDetailNew',
        btns: [],
        header: [],
        data: [],
        height: '250',
      },
      YAuiGrid: null,
      selectedValue: [], // 체크된 중분류 목록
      dbInvestItems: [], // db등록된 중분류 목록 얕은 복사
      dbInvestItemsOrigin: [], // db등록된 중분류 목록 깊은 복사
      duplInvestItemValueStr: '', // 중분류 중복값 체크 변수

      createMode: true, // 투자항목 신규등록 여부
      updateMode: false, // 투자항목 수정 여부
      isCreateSubmit: false,
      isUpdateSubmit: false,

      insertUrl: '', // 신규 등록 버튼 /api/manage/codemaster
      editUrl: '', // 저장(수정)버튼 /api/manage/codemaster
      detailUrl: '', // 대분류 코드 정보(중분류 목록 포함) 조회 /api/manage/codemaster/codemaster/{0}/{1}/{2}
      duplicationCheckUrl: '', // 동일 코드(그룹코드, 중분류코드) 존재 체크 /api/manage/codemaster/duplicationCheck/{0}
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
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
  },
  beforeDestory() {},
  methods: {
    init() {
      if (this.popupParam.code) {
        this.code = this.popupParam.code; // 대분류 코드
        this.codeNm = this.popupParam.codeNm; // 대분류 코드명
        this.codeGroupCd = this.popupParam.codeGroupCd;
      }
      this.editable = this.$route.meta.editable;

      this.insertUrl = transactionConfig.manage.codeMaster.insert.url; // 신규 등록 버튼
      this.editUrl = transactionConfig.manage.codeMaster.edit.url; // 저장(수정)버튼
      this.detailUrl = selectConfig.codeMaster.get.url; // 대분류 코드 정보(중분류 목록 포함) 조회
      this.duplicationCheckUrl =
        selectConfig.codeMaster.getDuplicationCheck.url; // 동일 코드(그룹코드, 중분류코드) 존재 체크
      this.getDetail(); // 코드 정보 db 조회

      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002969'),
          dataField: 'mgtMgInfoItmNo',
          dataType: 'numeric',
          width: '30%',
          style: 'right-align',
          editRenderer: {
            type: 'InputEditRenderer',
            onlyNumeric: true,
            autoThousandSeparator: true,
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004262'),
          dataField: 'mgInfoItmNm',
          width: '50%',
          editRenderer: {
            type: 'InputEditRenderer',
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001439'),
          dataField: 'useYn',
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
        // { text: 'L0000002969', name: 'mgtMgInfoItmNo', width: '100px', type: 'number', align: 'center', maxlength: 5, placeholder: this.$comm.getLangSpecInfoMessage('M0000001572') }, // 중분류 코드
        // { text: 'L0000004262', name: 'mgInfoItmNm', width: '250px', type: 'text' }, // 투자항목(중분류)
        // { text: 'L0000001439', name: 'useYn', width: '100px', type: 'switch', align: 'center' }, // 사용여부
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002892'),
          color: 'orange',
          btnClicked: 'btnAddRow',
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001495'),
          color: 'red',
          btnClicked: 'btnDelRow',
        },
      ];
    },
    getDetail() {
      // 코드 정보 조회
      if (!this.code) return;
      this.$http.url = this.$format(
        this.detailUrl,
        this.codeGroupCd,
        this.code // 대분류 코드
      );
      this.$http.type = 'get';
      this.$http.request(
        (_result) => {
          this.createMode = false;
          this.updateMode = true;
          this.codeMaster = _result.data;
          this.gridOptions.data = _result.data.investItems;
          this.YAuiGrid.setGridData(_result.data.investItems);
          this.dbInvestItems = this.$_.clone(_result.data.investItems); // 중분류 행 삭제 전 체크를 위해
          this.dbInvestItemsOrigin = this.$_.cloneDeep(
            _result.data.investItems
          ); // 중분류 행 변경 체크를 위해
        },
        (_error) => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            'M0000000016' // 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
          );
        }
      );
    },
    btnAddRow() {
      let row = {
        mgtMgInfoItmNo: '', // 중분류 코드
        mgInfoItmNm: '', // 중분류명
        sortOrder: 0,
        useYn: 'Y',
      };
      this.YAuiGrid.addRow(row, 'last');
    },

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
            message: 'M0000001120', // 투자분류를 입력해주세요.
            type: 'warning', // success / info / warning / error
          });
          return false;
        }
      });
      if (!stepACheck) return;

      // 중분류 값 입력 체크
      let stepBCheck = true;
      let chkPatten = /[^0-9]/; // 중분류 코드 - 숫자 외 문자 체크
      this.$_.forEach(this.YAuiGrid.getGridData(), (item) => {
        item.mgtMgInfoItmNo = this.$_.trim(item.mgtMgInfoItmNo);
        item.mgInfoItmNm = this.$_.trim(item.mgInfoItmNm);

        if (item.mgtMgInfoItmNo === '0') {
          stepBCheck = false;
          window.getApp.$emit('ALERT', {
            title: 'L0000003395', // 안내
            message: 'M0000001164', // 중분류 코드를 입력해주세요
            type: 'warning', // success / info / warning / error
          });
          return false;
        } else if (chkPatten.test(item.mgtMgInfoItmNo)) {
          // 중분류 코드는 숫자 5자리 까지 넣을 수 있다.
          stepBCheck = false;
          window.getApp.$emit('ALERT', {
            title: 'L0000003395' /* 안내 */,
            message: 'M0000001573',
            type: 'warning',
          });
          return false;
        } else if (item.mgtMgInfoItmNo > 99999) {
          // 5자리 초과 숫자일 경우
          stepBCheck = false;
          window.getApp.$emit('ALERT', {
            title: 'L0000003395' /* 안내 */,
            message: 'M0000001574',
            type: 'warning',
          });
          return false;
        } else if (item.mgInfoItmNm === '') {
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
          }
        })
        .catch((e) => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000876' // 유효성 검사도 에러가 발생하였습니다.
          );
        });
    },
    checkDuplCodeMaster() {
      // 대분류 코드 중복 체크
      this.$http.url = this.$format(
        this.detailUrl,
        this.codeGroupCd,
        this.codeMaster.code // 대분류 코드
      );
      this.$http.type = 'get';
      this.$http.request(
        (_result) => {
          let result = true;
          if (this.createMode && _result.data) {
            // 동일코드(그룹코드, 대분류코드) 존재 시
            result = false;
            window.getApp.$emit('ALERT', {
              title: 'L0000003395', // 안내
              message: 'M0000001027', // 이미 같은 코드가 존재합니다.
              type: 'warning',
            });
          }
          if (result) this.checkMiddleItems();
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    checkMiddleItems() {
      // 중분류 체크)
      // 이미 등록된 중분류 코드 변경 여부
      let changeCheck = false;
      let idx = 0;
      this.$_.forEach(this.dbInvestItems, (item) => {
        if (
          item.mgtMgInfoItmNo !== this.dbInvestItemsOrigin[idx].mgtMgInfoItmNo
        ) {
          changeCheck = true;
          window.getApp.$emit('ALERT', {
            title: 'L0000003395' /* 안내 */,
            message: 'M0000001575',
            type: 'warning',
          });
        }
        if (changeCheck) return false;
        idx++;
      });
      if (changeCheck) return;

      // 신규 추가된 중분류행 중복 체크
      let duplCheck = true;
      let newMiddleItems = this.gridOptions.data.filter(
        (item) => !this.dbInvestItems.includes(item)
      ); // 신규 추가한 중분류 행
      let newMiddleItems2 = [];
      this.$_.forEach(this.YAuiGrid.getGridData(), (item) => {
        if (item.code === undefined) {
          newMiddleItems2.push(item);
        }
      });
      if (newMiddleItems2 && newMiddleItems2.length > 0) {
        // 신규 추가한 행을 그리드 목록 내에서 중복 체크
        this.$_.forEach(newMiddleItems2, (item) => {
          let itemCount = 0;
          let itemNmCount = 0;
          // 추가한 행들끼리 중복 체크
          this.$_.forEach(newMiddleItems2, (target) => {
            if (item.mgtMgInfoItmNo === target.mgtMgInfoItmNo) itemCount++;
            if (item.mgInfoItmNm === target.mgInfoItmNm) itemNmCount++;
          });
          if (itemCount > 1) {
            duplCheck = false;
            window.getApp.$emit('ALERT', {
              title: 'L0000003395' /* 안내 */,
              message: `${item.mgtMgInfoItmNo}은 중복된 코드입니다.`,
              type: 'warning',
            });
          } else if (itemNmCount > 1) {
            duplCheck = false;
            window.getApp.$emit('ALERT', {
              title: 'L0000003395' /* 안내 */,
              message: `${this.mgInfoItmNm}은 중복된 중분류명입니다.`,
              type: 'warning',
            });
          }
          if (!duplCheck) return false; // foreach break

          itemCount = 0;
          itemNmCount = 0;
          // 추가한 행을 기존 등록된 행과 체크
          this.$_.forEach(this.dbInvestItems, (target) => {
            if (item.mgtMgInfoItmNo === target.mgtMgInfoItmNo) itemCount++;
            if (item.mgInfoItmNm === target.mgInfoItmNm) itemNmCount++;
          });
          if (itemCount > 0) {
            duplCheck = false;
            window.getApp.$emit('ALERT', {
              title: 'L0000003395' /* 안내 */,
              message: `${item.mgtMgInfoItmNo}은 사용중인 코드입니다.`,
              type: 'warning',
            });
          } else if (itemNmCount > 0) {
            duplCheck = false;
            window.getApp.$emit('ALERT', {
              title: 'L0000003395' /* 안내 */,
              message: `${this.mgInfoItmNm}은 사용중인 중분류명입니다.`,
              type: 'warning',
            });
          }
          if (!duplCheck) return false; // foreach break
        });
        if (!duplCheck) return;

        // db 중복 체크
        newMiddleItems.map((item) => this.checkDuplicationValue(item));
        setTimeout(() => {
          // 1초 뒤에 동일코드 메시지가 존재하면 경고
          if (this.duplInvestItemValueStr !== '') {
            this.showInsertDuplicateionAlert();
          } else {
            // 동일코드 메시지 존재하지 않으면
            this.codeMasterSubmit();
          }
        }, 500);
      } else {
        this.codeMasterSubmit();
      }
    },
    checkDuplicationValue(value) {
      // 동일코드(그룹코드(MICS3), 중분류코드) 존재 체크
      this.$http.url = this.$format(
        this.duplicationCheckUrl,
        value.mgtMgInfoItmNo
      );
      this.$http.type = 'get';
      this.$http.request(
        // 동일한 코드(그룹코드, 중분류코드) 갯수 조회
        (_result) => {
          if (_result.data > 0) {
            // 동일코드 존재 시 this.duplInvestItemValueStr 속성에 코드 정보 입력
            this.duplInvestItemValueStr += `${value.mgtMgInfoItmNo}: ${value.mgInfoItmNm}  `;
          }
        },
        (_error) => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            'M0000000016' // 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
          );
        }
      );
    },
    showInsertDuplicateionAlert() {
      // 중복코드 존재 시 알림
      window.getApp.$emit('ALERT', {
        title: 'L0000003395' /* 안내 */,
        message: `${this.duplInvestItemValueStr}은 사용중인 코드입니다.`,
        type: 'warning',
      });
      this.duplInvestItemValueStr = '';
    },
    codeMasterSubmit() {
      // 저장
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321', // 확인
        message: 'M0000000011', // 저장하시겠습니까?
        type: 'info',
        confirmCallback: () => {
          this.codeMaster.createUserId = this.$store.getters.token;
          this.codeMaster.updateUserId = this.$store.getters.token;
          this.codeMaster.investItems = this.YAuiGrid.getGridData();
          this.$_.forEach(this.codeMaster.investItems, (item) => {
            item.infoItmTypeCd = this.codeMaster.codeGroupCd;
            item.infoItmAttCd = this.codeMaster.code;
          });
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
      // this.gridOptions.data 배열에 객체 1개를 추가한다.
      this.gridOptions.data.splice(0, 0, {
        mgtMgInfoItmNo: '', // 중분류 코드
        mgInfoItmNm: '', // 중분류명
        sortOrder: 0,
        useYn: 'Y',
      });
    },
    btnDelRow() {
      let removeData = this.YAuiGrid.getCheckedRowItems();
      if (!removeData || removeData.length === 0) {
        // 체크 항목 미존재 시
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'M0000000057' /* 삭제할 항목을 선택해주세요. */,
          type: 'warning',
        });
        return;
      }
      let count = 0;
      let removeData2 = [];
      this.$_.forEach(removeData, (item) => {
        if (item.item.code !== undefined) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395' /* 안내 */,
            message: `${item.item.mgtMgInfoItmNo}은 사용중인 코드입니다.`,
            type: 'warning',
          });
          count++;
        } else {
          removeData2.push(item);
        }
      });
      this.deleteItem(removeData2);
    },
    // 중분류 행 삭제 버튼
    btnDeleteItemCheck() {
      if (!this.selectedValue || this.selectedValue.length === 0) {
        // 체크 항목 미존재 시
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'M0000000057' /* 삭제할 항목을 선택해주세요. */,
          type: 'warning',
        });
        return;
      }
      let registerdCodeStr = '';
      this.$_.forEach(this.selectedValue, (item) => {
        if (this.dbInvestItems.includes(item)) {
          registerdCodeStr += `${item.mgtMgInfoItmNo}, `;
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
    deleteItem(removeData2) {
      if (removeData2 && removeData2.length > 0) {
        for (let i = 0; i < removeData2.length; i++) {
          this.YAuiGrid.removeRow(removeData2[i].rowIndex);
        }
      }
    },
    // 입력된 값 변경시 체크
    change(data) {},
    beforeCreateSubmit() {
      this.checkBeforeSubmit();
    },
    beforeUpdateSubmit() {
      this.checkBeforeSubmit();
    },
    btnCreateClickedCallback(_result) {
      this.isCreateSubmit = false;
      this.createMode = false;
      this.updateMode = true;
      this.code = this.codeMaster.code;
      this.getDetail();
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // 안내
        message: 'M0000000006', // 저장되었습니다.
        type: 'success',
      });
      this.$emit('code', { code: this.codeMaster.code });
    },
    btnUpdateClickedCallback(_result) {
      this.isUpdateSubmit = false;
      this.getDetail();
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
