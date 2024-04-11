<!--
  목적 : 경영>기준정보>투자항목관리(중분류)
  Detail : 중분류 등록/수정 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row>
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <!-- 발생형태(중분류) 목록 -->
          <y-data-table
            ref="dataTable"
            label="L0000004263"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            @selectedRow="getDetail"
            :popMode="true"
          />
        </b-col>
      </b-col>
    </b-row>
    <b-row class="mt-3">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 발생형태 (중분류) 상세 -->
            <y-label
              label="L0000004659"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 코드 -->
              <y-number
                :width="8"
                :editable="editable"
                :required="true"
                :maxlength="codeGroup.codeLength"
                :hasSeperator="false"
                :disabled="!createMode"
                ui="bootstrap"
                label="L0000002969"
                name="mgtMgInfoItmNo"
                v-model="investItem.mgtMgInfoItmNo"
                v-validate="'required'"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 투자항목(중분류) -->
              <y-text
                :width="8"
                :editable="editable"
                :required="true"
                :maxlength="30"
                ui="bootstrap"
                label="L0000004262"
                name="mgInfoItmNm"
                v-model="investItem.mgInfoItmNm"
                v-validate="'required'"
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
                v-model="investItem.useYn"
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
                v-model="investItem.sortOrder"
              />
            </b-col>
          </b-row>
          <div class="float-right mt-3">
            <!-- 초기화 -->
            <y-btn
              v-if="editable"
              title="L0000002859"
              @btnClicked="btnClearClickedCallback"
            />
            <!-- 등록저장 -->
            <y-btn
              v-if="editable && createMode && !updateMode"
              :action-url="insertUrl"
              :param="investItem"
              :is-submit="isCreateSubmit"
              title="L0000002474"
              color="orange"
              action-type="post"
              beforeSubmit="beforeCreateSubmit"
              @beforeCreateSubmit="beforeCreateSubmit"
              @btnClicked="btnCreateClickedCallback"
              @btnClickedErrorCallback="btnClickedErrorCallback"
            />
            <!-- 수정저장 -->
            <y-btn
              v-if="editable && !createMode && updateMode"
              :action-url="editUrl"
              :param="investItem"
              :is-submit="isUpdateSubmit"
              title="L0000002474"
              color="orange"
              action-type="put"
              beforeSubmit="beforeUpdateSubmit"
              @beforeUpdateSubmit="beforeUpdateSubmit"
              @btnClicked="btnUpdateClickedCallback"
              @btnClickedErrorCallback="btnClickedErrorCallback"
            />
          </div>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  /** attributes: name, components, props, data **/
  name: 'y-occurr-att',
  props: {
    code: '',
  },
  data() {
    return {
      investItem: {
        mgtMgInfoItmNo: '',
        mgInfoItmNm: '',
        sortOrder: 0,
        useYn: 'Y',
        createUserId: '',
        createUserNm: '',
        createDt: '',
        updateUserId: '',
        updateUserNm: '',
        updateDt: '',
        useYnNm: '',
        infoItmAttCd: '',
      },
      codeMaster: {
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
      },
      codeGroup: {
        codeLength: 5,
      },
      gridOptions: {
        header: [],
        data: [],
        height: '250',
      },
      searchParam: {
        infoItmAttCd: '',
        mgtMgInfoItmNo: '',
        useYn: 'Y',
      },
      editable: false,
      createMode: true,
      updateMode: false,
      cmupdateMode: false,
      isCreateSubmit: false,
      isCmCreateSubmit: false,
      isUpdateSubmit: false,
      isCmUpdateSubmit: false,

      insertUrl: '',
      cmInsertUrl: '',
      editUrl: '',
      cmEditUrl: '',
      searchUrl: '',
      detailUrl: '',
      checkUrl: '',
      checkVal: false,
    };
  },
  watch: {
    'investItem.mgtMgInfoItmNo': function (newValue, oldValue) {
      this.checkSaveVal();
    },
    'investItem.mgInfoItmNm': function (newValue, oldValue) {
      this.checkSaveVal();
    },
    'investItem.sortOrder': function (newValue, oldValue) {
      this.checkSaveVal();
    },
    code(nVal, oVal) {
      this.investItem.infoItmAttCd = this.code;
      this.searchParam.infoItmAttCd = this.code;
    },
  },
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {},
  beforeDestory() {},
  methods: {
    init() {
      this.investItem.infoItmAttCd = this.code;
      this.searchParam.infoItmAttCd = this.code;
      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          text: 'L0000002969',
          name: 'mgtMgInfoItmNo',
          width: '100px',
          align: 'center',
        }, // 코드
        { text: 'L0000004262', name: 'mgInfoItmNm', width: '250px' }, // 중분류명
        {
          text: 'L0000001439',
          name: 'useYnNm',
          width: '100px',
          align: 'center',
        }, // 사용여부
        {
          text: 'L0000000973',
          name: 'createDt',
          width: '110px',
          align: 'center',
        }, // 등록일
        {
          text: 'L0000000976', // 등록자
          name: 'createUserNm',
          width: '100px',
          align: 'center',
        },
        {
          text: 'L0000001697',
          name: 'updateDt',
          width: '110px',
          align: 'center',
        }, // 수정일
        {
          text: 'L0000001698', // 수정자
          name: 'updateUserNm',
          width: '100px',
          align: 'center',
        },
      ];

      this.insertUrl = transactionConfig.mgt.investItem.insert.url;
      this.searchUrl = selectConfig.mgt.investItem.middleList.url;
      this.editUrl = transactionConfig.mgt.investItem.edit.url;
      this.detailUrl = selectConfig.mgt.investItem.get.url;

      this.editable = this.$route.meta.editable;

      this.getList();
    },
    getList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          if (_result.data[0].mgtMgInfoItmNo !== 0) {
            this.gridOptions.data = _result.data;
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getDetail(data) {
      this.$http.url = this.$format(
        this.detailUrl,
        this.code,
        data.mgtMgInfoItmNo
      );
      this.$http.type = 'get';
      this.$http.request(
        (_result) => {
          this.createMode = false;
          this.updateMode = true;
          this.investItem = _result.data;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    checkSaveVal() {
      if (
        this.investItem.mgtMgInfoItmNo !== 0 &&
        this.investItem.mgInfoItmNm !== '' &&
        this.investItem.sortOrder !== 0
      ) {
        this.checkVal = true;
      }
    },
    beforeCreateSubmit() {
      this.checkBeforSubmit('insert');
    },
    beforeUpdateSubmit() {
      this.checkBeforSubmit('edit');
    },
    checkBeforSubmit(flag) {
      let cis = parseInt(this.investItem.mgtMgInfoItmNo, 10);
      var mgtMgInfoItmNo = { mgtMgInfoItmNo: cis };
      var mgInfoItmNm = { mgInfoItmNm: this.investItem.mgInfoItmNm };
      this.investItem.infoItmAttCd = this.code;

      if (
        flag === 'insert' &&
        this.$_.find(this.gridOptions.data, mgtMgInfoItmNo) != null
      ) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000001027', // 이미 같은 이름의 코드가 존재합니다.
          type: 'warning',
        });
        return;
      }
      if (this.$_.find(this.gridOptions.data, mgInfoItmNm) != null) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000001122', // 이미 같은 이름의 코드가 존재합니다.
          type: 'warning',
        });
        return;
      }
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321', // 확인
              message: 'M0000000011', // 저장하시겠습니까?
              type: 'info',
              confirmCallback: () => {
                if (flag === 'insert') {
                  this.isCreateSubmit = true;
                } else this.isUpdateSubmit = true;
              },
            });
          }
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000004' // 유효성 검사 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
          );
        });
    },
    btnCreateClickedCallback(_result) {
      this.isCreateSubmit = false;
      this.createMode = false;
      this.updateMode = true;
      this.getList();
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // 안내
        message: 'M0000000006', // 저장되었습니다.
        type: 'success',
      });
    },
    btnUpdateClickedCallback(_result) {
      this.isUpdateSubmit = false;
      this.createMode = true;
      this.updateMode = false;
      this.getList();
      Object.assign(this.$data.investItem, this.$options.data().investItem);
      window.getApp.$emit('ALERT', {
        title: 'L0000003395',
        message: 'M0000000006',
        type: 'success',
      });
    },
    // btnCmCreateClickedCallback() {
    //   this.isCmCreateSubmit = false;
    //   this.getList();
    //   window.getApp.$emit('ALERT', {
    //     title: '안내',
    //     message: '저장하였습니다.',
    //     type: 'success',
    //   });
    // },
    // btnCmUpdateClickedCallback(_result) {
    //   this.isUpdateSubmit = false;
    //   this.isCmUpdateSubmit = false;
    //   this.getList();
    //   window.getApp.$emit('ALERT', {
    //     title: '안내',
    //     message: '저장하였습니다.',
    //     type: 'success',
    //   });
    // },
    // beforeCmCreateSubmit() {
    //   this.codeMaster.createUserId = this.$store.getters.token;
    //   this.isCmCreateSubmit = true;
    // },
    // beforeCmUpdateSubmit() {
    //   this.$validator
    //     .validateAll()
    //     .then(_result => {
    //       if (_result) {
    //         this.codeMaster.updateUserId = this.$store.getters.token;
    //         this.isCmUpdateSubmit = true;
    //       }
    //     })
    //     .catch(() => {
    //       window.getApp.$emit(
    //         'APP_VALID_ERROR',
    //         '유효성 검사 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.'
    //       );
    //     });
    // },
    btnClearClickedCallback(_result) {
      this.createMode = true;
      this.updateMode = false;
      Object.assign(this.$data.investItem, this.$options.data().investItem);
    },
    btnClickedErrorCallback(_result) {
      this.isCreateSubmit = false;
      this.isUpdateSubmit = false;
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
  },
};
</script>
