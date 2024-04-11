<template>
  <b-container fluid>
    <b-row class="mt-3" ref="detailBox">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 주요액션등록 -->
            <y-label
              label="L0000002718"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 저장 -->
              <y-btn
                title="L0000002474"
                color="orange"
                action-type="POST"
                @btnClicked="btnSaveClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 닫기 -->
              <y-btn title="L0000000881" @btnClicked="btnClosePopup" />
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <!-- 경로 -->
              <y-text
                :width="10"
                :editable="editable"
                :maxlength="100"
                :required="true"
                ui="bootstrap"
                label="L0000004561"
                name="servletPath"
                v-model="impoAction.servletPath"
                :state="validateState('servletPath')"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 유형 -->
              <y-select
                :width="8"
                :editable="editable"
                :comboItems="crudCdItems"
                :required="true"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="L0000002203"
                name="crudCd"
                v-model="impoAction.crudCd"
                v-validate="'required'"
                :state="validateState('crudCd')"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 유형명 -->
              <y-text
                :width="8"
                :editable="editable"
                :maxlength="100"
                ui="bootstrap"
                label="L0000002204"
                name="crudNm"
                v-model="impoAction.crudNm"
              ></y-text>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <!-- 유형설명 -->
              <y-textarea
                :width="10"
                :editable="editable"
                ui="bootstrap"
                label="L0000004559"
                name="crudDesc"
                v-model="impoAction.crudDesc"
              ></y-textarea>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 사용여부 -->
              <y-select
                :width="8"
                :editable="editable"
                :comboItems="useYnItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="L0000001439"
                name="useYn"
                v-model="impoAction.useYn"
              ></y-select>
            </b-col>
            <!-- <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
               주요액션 목록 
              <y-data-table
                v-model="gridOptions.selectValue"
                ref="dataTable"
                label="L0000004562"
                :height="gridOptions.height"
                :headers="gridOptions.header"
                :items="gridOptions.data"
                :use-paging="true"
                @selectedRow="selectedRow"
              ></y-data-table>
            </b-col> -->
            <b-col sm="12">
              <y-auigrid
                ref="yAuiGrid"
                :name="gridOptions.name"
                :headers="gridOptions.header"
                :btns="gridOptions.btns"
                :height="gridOptions.height"
                :label="this.$comm.getLangSpecInfoLabel('L0000004562')"
                :useExcelExport="false"
                :enableSorting="true"
                :showGridSetSave="true"
                @cellClick="cellClickHandler"
                @btnSearchClicked="btnSearchClicked"
              />
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  name: 'impo-action-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        // heaCheckupPlanNo: 0,
        // gridOptions1: {
        //   data: [],
        // },
        // pageNm: '',
        // noAccUseYn: false,
      },
    },
  },
  data() {
    return {
      impoAction: {
        servletPath: '',
        crudCd: '',
        crudNm: '',
        crudDesc: '',
        useYn: '',
        index: '',
      },

      gridOptions: {
        header: [],
        data: [],
        height: '220',
        selectValue: [],
      },
      //   searchParam: {
      //     heaCheckupPlanPeriod: [],
      //     plantCd: '', // 사업장 코드
      //     heaCheckupClassCd: '', // 검진 종류
      //   },
      editable: false,
      updateMode: false,
      crudCdItems: [],
      useYnItems: [],
      //   heaCheckupOrgItems: [],
      insertUrl: '',
      editUrl: '',
      isInsert: false,
      isEmit: false,
      isDelete: false,
      selectedValue: [],
      cookieName: '',
      routeName: '',

      YAuiGrid: null,
    };
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
  },
  beforeDestroy() {
    // 윈도우 resize event 제거-SPA 기반이므로 제거하지 않으면 다른페이지에서 해당 이벤트가 호출됨

    // cookie는 2시간
    this.$cookies.set(this.$data.cookieName, this.$data.searchParam, {
      expires: 1 / 12,
    });
  },
  /** methods **/
  methods: {
    init() {
      // URL 셋팅
      this.searchUrl = selectConfig.manage.log.impoAction.list.url;
      this.insertUrl = transactionConfig.manage.log.impoAction.insert.url;
      this.editUrl = transactionConfig.manage.log.impoAction.edit.url;
      this.editable = this.$route.meta.editable;

      this.routeName = this.$route.name;
      this.cookieName = 'SHE' + this.$store.getters.token; // cookieName 설정

      this.setHeader();
      this.getComboItems();
      this.getDetail();
    },

    setHeader() {
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004561'), // 경로
          dataField: 'servletPath',
          width: '20%',
          style: 'left-align',
        },
        {
          text: this.$comm.getLangSpecInfoLabel('L0000002203'), // 유형
          dataField: 'crudCd',
          width: '20%',
          style: 'center-align',
        },
        {
          text: this.$comm.getLangSpecInfoLabel('L0000002204'), // 유형명
          dataField: 'crudNm',
          width: '20%',
        },
        {
          text: this.$comm.getLangSpecInfoLabel('L0000004559'), // 유형설명
          dataField: 'crudDesc',
          width: '20%',
        },
        {
          text: this.$comm.getLangSpecInfoLabel('L0000001439'), // 사용여부
          dataField: 'useYn',
          width: '20%',
          style: 'center-align',
        },
      ];
    },
    // 콤보 셋팅
    getComboItems() {
      // crudCdItems: [],
      //       useYnItems: [],
      this.crudCdItems = [
        { code: '', codeNm: this.$comm.getLangSpecInfoLabel('L0000002519') }, // 전체
        {
          code: 'POST',
          codeNm: this.$comm.getLangSpecInfoLabel('L0000003758'), // 등록
        },
        { code: 'PUT', codeNm: this.$comm.getLangSpecInfoLabel('L0000001696') }, // 수정
        {
          code: 'DELETE',
          codeNm: this.$comm.getLangSpecInfoLabel('L0000001495'), // 삭제
        },
        { code: 'GET', codeNm: this.$comm.getLangSpecInfoLabel('L0000004563') }, // 조회
      ];

      this.useYnItems = [
        { code: 'Y', codeNm: this.$comm.getLangSpecInfoLabel('L0000003644') }, // 예
        { code: 'N', codeNm: this.$comm.getLangSpecInfoLabel('L0000003645') }, // 아니오
      ];
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
    getDetail() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          // this.gridOptions.data = this.$_.clone(_result.data);
          this.YAuiGrid.setGridData(this.$_.clone(_result.data));
        },
        (_error) => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            'M0000000016' // 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
          );
        }
      );
    },

    // 신규등록
    btnSaveClickedCallback(_result) {
      this.beforeSave();
      // if (this.beforeSave() === 'insert') {
      //   // 신규등록
      //   this.$http.url = this.insertUrl;
      //   this.$http.type = 'POST';
      // } else {
      //   // 수정
      //   this.$http.url = this.editUrl;
      //   this.$http.type = 'PUT';
      // }
      // this.$http.param = this.impoAction;
      // this.$http.request(
      //   _result => {
      //     window.getApp.$emit('ALERT', {
      //       title: '안내',
      //       message: '저장되었습니다.',
      //       type: 'success',
      //     });
      //     this.getDetail();
      //   },
      //   _error => {
      //     window.getApp.$emit('APP_REQUEST_ERROR', _error);
      //   }
      // );
    },

    selectedRow(_row) {
      this.impoAction = this.$_.clone(_row);

      if (_row.useYn === this.$comm.getLangSpecInfoLabel('L0000003644')) {
        // 예
        this.impoAction.useYn = 'Y';
      } else {
        this.impoAction.useYn = 'N';
      }

      if (_row.crudCd === this.$comm.getLangSpecInfoLabel('L0000003758')) {
        // 등록
        this.impoAction.crudCd = 'POST';
      } else if (
        _row.crudCd === this.$comm.getLangSpecInfoLabel('L0000001696')
      ) {
        // 수정
        this.impoAction.crudCd = 'PUT';
      } else if (
        _row.crudCd === this.$comm.getLangSpecInfoLabel('L0000001495')
      ) {
        // 삭제
        this.impoAction.crudCd = 'DELETE';
      } else {
        this.impoAction.crudCd = 'GET';
      }
    },

    /** validation checking **/
    checkDuplicate() {
      var test = {
        servletPath: this.impoAction.servletPath,
        crudCd: this.impoAction.crudCd,
      };

      if (test.crudCd === 'POST') {
        test.crudCd = this.$comm.getLangSpecInfoLabel('L0000003758'); // 등록
      } else if (test.crudCd === 'PUT') {
        test.crudCd = this.$comm.getLangSpecInfoLabel('L0000001495'); // 수정
      } else if (test.crudCd === 'DELETE') {
        test.crudCd = this.$comm.getLangSpecInfoLabel('L0000001495'); // 삭제
      } else {
        test.crudCd = this.$comm.getLangSpecInfoLabel('L0000004563'); // 조회
      }

      var item = this.$_.find(this.gridOptions.data, test);
      if (item != null) {
        // 중복값이 없는경우
        return true;
      }
      return false;
    },
    /** 신규등록 하기전 UI단 유효성 검사 **/
    beforeSave() {
      if (!this.checkDuplicate()) {
        this._beforeCheck('insert');
      } else {
        this._beforeCheck('update');
      }
    },
    // 버튼 에러 처리
    btnClickedErrorCallback(_result) {
      this.isInsert = false;
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    saveData(type) {
      if (type === 'insert') {
        // 신규등록
        this.$http.url = this.insertUrl;
        this.$http.type = 'POST';
      } else {
        // 수정
        this.$http.url = this.editUrl;
        this.$http.type = 'PUT';
      }
      this.$http.param = this.impoAction;
      this.$http.request(
        (_result) => {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395', // 안내
            message: 'M0000000006', // 저장되었습니다.
            type: 'success',
          });
          this.getDetail();
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },

    _beforeCheck(mode) {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321', // 확인
              // message: 'M0000000011', // 저장하시겠습니까
              type: 'info',
              confirmCallback: () => {
                this.saveData(mode);
              },
            });
          } else if (!_result) {
            this.$popupRequired.check('impoAction', this.$data, this.errors);
          }
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000004' // 유효성 검사 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
          );
        });
    },

    // 팝업 닫기
    btnClosePopup() {
      // 부모창에 값 전달
      this.$emit('closePopup', { success: true });
    },
  },
};
</script>
