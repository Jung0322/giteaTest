<!--
  목적 : 시스템관리-다국어관리-다국어 관리
  작성자 : jkl
  Detail : 라벨관리
  -->
<template>
  <b-container fluid>
    <b-row>
      <b-col sm="6">
        <b-col sm="12">
          <y-text
            size="sm"
            placeholder="search"
            name="keyword"
            v-model="keyword"
          />
          <!-- 다국어 목록 -->
          <y-auigrid
            ref="yAuiGrid"
            :name="gridDtlOptions.name"
            :headers="gridDtlOptions.header"
            :btns="gridDtlOptions.btns"
            :height="gridDtlOptions.height"
            :items="dataFilter"
            :label="$comm.getLangSpecInfoLabel('L0000005029')"
            :useExcelExport="false"
            :showGridSetSave="true"
            :useContextMenu="true"
            :enableRightDownFocus="true"
            :showGridCtrl="true"
            :enableSorting="true"
            @cellClick="selectedRow"
          />
        </b-col>
      </b-col>
      <b-col sm="6">
        <b-row>
          <b-col sm="12">
            <!-- 다국어 상세 -->
            <y-label
              label="L0000005030"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 신규 -->
              <y-btn
                v-if="btnClear"
                title="L0000004584"
                color="blue"
                @btnClicked="btnClearClicked"
              />
              <!-- 삭제 -->
              <y-btn
                v-if="btnDelete"
                title="L0000001495"
                color="red"
                @btnClicked="btnDeleteClicked"
              />
              <!-- 저장 -->
              <y-btn
                v-if="btnSave"
                title="L0000002474"
                color="orange"
                @btnClicked="btnSaveClicked"
              />
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <!-- 다국어타입 코드 -->
              <y-text
                ui="bootstrap"
                label="L0000005027"
                name="mstCd"
                v-validate="'required'"
                v-model="lblDtl.mstCd"
                :width="8"
                :disabled="true"
                :required="true"
                :maxlength="50"
                :state="validateState('mstCd')"
              />
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <!-- 다국어 코드 -->
              <y-text
                ui="bootstrap"
                label="L0000005031"
                name="lblCd"
                v-model="lblDtl.lblCd"
                :width="8"
                :disabled="true"
                :maxlength="100"
              />
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <!-- 한국어 -->
              <y-text
                ui="bootstrap"
                label="L0000003168"
                name="lblVal"
                v-validate="'required'"
                v-model="lblDtl.lblVal"
                :width="8"
                :required="true"
                :editable="editable"
                :maxlength="100"
                :state="validateState('lblVal')"
              />
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <!-- 영어 -->
              <y-text
                ui="bootstrap"
                label="L0000002013"
                name="lblValEn"
                v-model="lblDtl.lblValEn"
                :width="8"
                :editable="editable"
                :maxlength="100"
              />
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <!-- 일본어 -->
              <y-text
                ui="bootstrap"
                label="L0000002266"
                name="lblValJa"
                v-model="lblDtl.lblValJa"
                :width="8"
                :editable="editable"
                :maxlength="100"
              />
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <!-- 중국어간체 -->
              <y-text
                ui="bootstrap"
                label="L0000002725"
                name="lblValZhCn"
                v-model="lblDtl.lblValZhCn"
                :width="8"
                :editable="editable"
                :maxlength="100"
              />
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <!-- 중국어번체 -->
              <y-text
                ui="bootstrap"
                label="L0000002726"
                name="lblValZhTw"
                v-model="lblDtl.lblValZhTw"
                :width="8"
                :editable="editable"
                :maxlength="100"
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
  name: 'lang-lbl-dtl',
  props: {
    tabParam: {
      type: Object,
      default: {
        mstCd: '',
      },
    },
  },
  data() {
    return {
      gridDtlOptions: {
        name: 'labelDtl',
        header: [],
        data: [],
        height: 'auto',
      },
      lblDtl: {
        mstCd: '',
        lblCd: '',
        lblVal: '',
        lblValEn: '',
        lblValJa: '',
        lblValZhCn: '',
        lblValZhTw: '',
      },
      editable: false,
      disabled: false,
      keyword: '',
      YAuiGrid: null,
    };
  },
  computed: {
    btnClear() {
      return (
        this.editable && this.lblDtl.lblCd && this.tabParam.mstCd !== 'all'
      );
    },
    btnDelete() {
      return this.editable && this.lblDtl.lblCd;
    },
    btnSave() {
      return this.editable && this.lblDtl.mstCd !== 'all' && this.lblDtl.mstCd;
    },
    // 검색
    dataFilter() {
      return this.gridDtlOptions.data.filter(
        (data) =>
          !this.keyword ||
          data.lblVal.toLowerCase().includes(this.keyword.toLowerCase()) ||
          data.lblCd.toLowerCase().includes(this.keyword.toLowerCase())
      );
    },
  },
  watch: {
    'tabParam.mstCd': {
      handler(val, oldVal) {
        this.getDetail();
      },
      deep: true,
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
    this.getDetail();
  },
  beforeDestroy() {},
  /** methods **/
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      this.gridDtlOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005031'),
          dataField: 'lblCd',
          width: '120',
        }, // 다국어 코드
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000810'),
          dataField: 'lblVal',
          width: '250px',
        }, // 내용
      ];
      this.getDetail();
    },
    getDetail() {
      if (this.tabParam.mstCd) {
        this.lblDtl.mstCd =
          this.tabParam.mstCd !== 'all'
            ? this.tabParam.mstCd
            : this.lblDtl.mstCd;
        this.$http.url = this.$format(
          selectConfig.manage.lang.lblDtl.list.url,
          this.tabParam.mstCd
        );
        this.$http.type = 'GET';
        this.$http.request(
          (_result) => {
            // this.YAuiGrid.setGridData(this.$_.clone(_result.data));
            this.gridDtlOptions.data = this.$_.clone(_result.data);
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      }
    },
    selectedRow(row) {
      this.$http.url = this.$format(
        selectConfig.manage.lang.lblDtl.get.url,
        // row.lblCd
        row.item.lblCd
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.lblDtl = this.$_.clone(_result.data);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    // 신규(초기화)
    btnClearClicked() {
      this.lblDtl.lblCd = null;
      this.lblDtl.lblVal = null;
      this.lblDtl.lblValEn = null;
      this.lblDtl.lblValJa = null;
      this.lblDtl.lblValZhCn = null;
      this.lblDtl.lblValZhTw = null;
      this.$validator.reset();
    },
    btnDeleteClicked() {
      let promises = [
        {
          func: this.confirmMessage,
          param: this.$comm.getLangSpecInfoLabel('L0000001495'), // 삭제
        },
        {
          func: this.saveData,
          param: 'delete',
          successMessage: 'M0000000007', // 삭제되었습니다.
        },
      ];
      this.$comm.orderedPromise(promises);
    },
    btnSaveClicked() {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (!_result) {
            this.$popupRequired.check('labelDtl', this.$data, this.errors);
          } else {
            let flag = '';
            let promises = [];
            if (this.lblDtl.lblCd) {
              flag = 'edit';
              promises = [
                {
                  func: this.checkValidation,
                  exceptionMessage: 'M0000000005', // 필수입력값을 입력해주세요.
                },
                {
                  func: this.confirmMessage,
                  param: this.$comm.getLangSpecInfoLabel('L0000002474'), // 저장
                },
                {
                  func: this.saveData,
                  param: flag,
                  successMessage: 'M0000000006', // 저장되었습니다.
                },
              ];
            } else {
              flag = 'insert';
              promises = [
                {
                  func: this.checkValidation,
                  exceptionMessage: 'M0000000005', // 필수입력값을 입력해주세요
                },
                {
                  func: this.checkData,
                  exceptionMessage: 'M0000000537', // 이미 등록된 내용입니다.
                },
                {
                  func: this.confirmMessage,
                  param: this.$comm.getLangSpecInfoLabel('L0000002474'), // 저장
                },
                {
                  func: this.saveData,
                  param: flag,
                  successMessage: 'M0000000006', // 저장되었습니다.
                },
              ];
            }
            this.$comm.orderedPromise(promises);
          }
          return _result;
        })
        .catch(() => {
          return false;
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
    checkValidation() {
      return this.$validator.validateAll();
    },
    confirmMessage(message) {
      return new Promise((_resolve, _reject) => {
        window.getApp.$emit('CONFIRM', {
          title: 'L0000003321', // 확인
          message: message + this.$comm.getLangSpecInfoMessage('M0000000097'), // 하시겠습니까?
          type: 'info',
          // 확인 callback 함수
          confirmCallback: () => {
            _resolve(true);
          },
          cancelCallback: () => {
            _resolve(false);
          },
        });
      });
    },
    checkData() {
      return new Promise((_resolve, _reject) => {
        this.$http.url = selectConfig.manage.lang.lblDtl.check.url;
        this.$http.param = {
          mstCd: this.lblDtl.mstCd,
          lblVal: this.lblDtl.lblVal,
        };
        this.$http.type = 'GET';
        this.$http.request(
          (_result) => {
            if (_result.data > 0) {
              _resolve(false);
            } else {
              _resolve(true);
            }
          },
          (_error) => {
            _reject(_error);
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      });
    },
    saveData(flag) {
      return new Promise((_resolve, _reject) => {
        if (flag === 'insert') {
          this.$http.url = transactionConfig.manage.lang.lblDtl.insert.url;
          this.$http.type = 'POST';
          this.lblDtl.createUserId = this.$store.getters.token;
        } else {
          this.$http.url = transactionConfig.manage.lang.lblDtl.edit.url;
          this.$http.type = 'PUT';
          this.lblDtl.updateUserId = this.$store.getters.token;
          if (flag === 'delete') {
            this.lblDtl.delYn = 'Y';
          } else {
            this.lblDtl.delYn = 'N';
          }
        }
        this.$http.param = this.lblDtl;
        this.$http.request(
          (_result) => {
            _resolve(true);
            if (flag === 'delete') {
              this.btnClearClicked(); // 초기화
            } else {
              this.lblDtl.lblCd = this.$_.clone(_result.data);
            }
            this.getDetail();
          },
          (_error) => {
            _reject(_error);
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      });
    },
    resizeGrid() {
      let _height = window.innerHeight - 373;
      if (window.innerHeight < 500) {
        _height = 250;
      }

      this.YAuiGrid.resize(null, _height);
    },
  },
};
</script>
