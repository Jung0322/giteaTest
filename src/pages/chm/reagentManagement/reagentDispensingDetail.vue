<!--
  목적 : 화학물질관리 > 시약관리 > 시약입출고 등록/수정/상세 
  작성자 : kyk
  Detail : 시약입출고 등록/수정/상세화면조회
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row ref="editBox">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 시약입출고 상세 -->
            <y-label
              label="L0000003822"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 저장 -->
              <y-btn
                v-if="editable"
                :action-url="saveUrl"
                :param="chmReagentInout"
                :is-submit="isSave"
                title="L0000002474"
                color="orange"
                :action-type="actionType"
                beforeSubmit="beforeSave"
                @beforeSave="beforeSave"
                @btnClicked="btnSaveClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 삭제 -->
              <y-btn
                v-if="editable && updateMode"
                title="L0000001495"
                color="red"
                @btnClicked="btnDeleteClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 닫기 -->
              <y-btn title="L0000000881" @btnClicked="closePopup" />
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <y-plant
                type="edit"
                filter="chm"
                :required="true"
                :editable="editable"
                name="plantCd"
                v-model="chmReagentInout.plantCd"
                v-validate="'required'"
                :state="validateState('plantCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 입출고일 -->
              <y-datepicker
                :width="8"
                :required="true"
                type="inoutDt"
                label="L0000002296"
                name="inoutDt"
                :default="chmReagentInout.inoutDt"
                v-model="chmReagentInout.inoutDt"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 입출고구분 -->
              <y-select
                :width="8"
                :editable="editable"
                :comboItems="inoutFlagItems"
                :required="true"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                type="search"
                label="L0000002294"
                name="inoutFlag"
                v-model="chmReagentInout.inoutFlag"
                v-validate="'required'"
                :state="validateState('inoutFlag')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 실험실 -->
              <y-select
                :width="8"
                :editable="editable"
                :comboItems="labNoItems"
                :required="true"
                itemText="labNm"
                itemValue="labNo"
                ui="bootstrap"
                name="labNo"
                label="L0000001823"
                v-model="chmReagentInout.labNo"
                v-validate="'required'"
                :state="validateState('labNo')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 시약 -->
              <y-text
                :width="8"
                :required="true"
                :editable="editable"
                :disabled="true"
                ui="bootstrap"
                label="L0000001771"
                name="chemProdNm"
                v-model="chmReagentInout.chemProdNm"
                :appendIcon="[
                  { icon: 'search', callbackName: 'searchChemprod' },
                ]"
                @searchChemprod="searchChemprod"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- CAS No. -->
              <y-text
                :width="8"
                :editable="editable"
                :maxlength="10"
                ui="bootstrap"
                label="L0000000102"
                name="casNo"
                v-model="chmReagentInout.casNo"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <y-number
                ui="bootstrap"
                name="inoutAmt"
                v-model="chmReagentInout.inoutAmt"
                v-validate="'required'"
                :label="inoutAmtLabel"
                :width="8"
                :editable="editable"
                :required="true"
                :maxlength="10"
                :state="validateState('inoutAmt')"
              ></y-number>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 단위 -->
              <y-text
                :width="8"
                :editable="editable"
                :required="true"
                :maxlength="10"
                ui="bootstrap"
                label="L0000000870"
                name="unitNm"
                v-model="chmReagentInout.unitNm"
                v-validate="'required'"
                :state="validateState('unitNm')"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 중량 -->
              <y-text
                :width="8"
                :editable="editable"
                :maxlength="10"
                ui="bootstrap"
                label="L0000002728"
                name="weight"
                v-model="chmReagentInout.weight"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 비중 -->
              <y-text
                :width="8"
                :editable="editable"
                :maxlength="10"
                ui="bootstrap"
                label="L0000001374"
                name="specificGravity"
                v-model="chmReagentInout.specificGravity"
              ></y-text>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-8">
              <!-- 비고 -->
              <y-textarea
                :width="10"
                :editable="editable"
                :disabled="disabled"
                :maxlength="300"
                ui="bootstrap"
                label="L0000001360"
                name="remarks"
                v-model="chmReagentInout.remarks"
              ></y-textarea>
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
  /* attributes: name, components, props, data */
  name: 'reagent-dispensing-detail',
  components: {},
  props: {
    popupParam: {
      type: Object,
      default: {
        reagentInoutNo: 0,
      },
    },
  },
  // TODO: 화살표 함수(=>)는 data에 사용하지 말 것
  //    data: () => { return { a: this.myProp }}) 화살표 함수가 부모 컨텍스트를 바인딩하기 때문에 this는 예상과 달리 Vue 인스턴스가 아니며, this.myProp는 정의되지 않습니다.
  //    참고url: https://kr.vuejs.org/v2/api/index.html#data
  data: function () {
    return {
      chmReagentInout: {
        reagentInoutNo: 0,
        inoutFlag: 'CLSIN',
        inoutDt: '',
        labNo: 0,
        labNm: null,
        chemProdNm: '',
        chemProdNo: 0,
        casNo: '',
        inoutAmt: 0,
        unitNm: '',
        weight: '',
        specificGravity: '',
        remarks: '',
        plantCd: '',
        createUserId: '',
        updateUserId: '',
      },
      inoutAmtLabel: 'L0000002287', // '입고량',
      saveData: {
        reagentInoutNo: 0,
        createUserId: '',
        updateUserId: '',
      },
      changeChemReagentInout: false,
      editable: false,
      updateMode: false,
      disabled: false,
      isSave: false,
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '80%',
        top: '50px',
        param: {},
        closeCallback: null,
      },
      labNoItems: [],
      inoutFlagItems: [],
      searchDetailUrl: '',
      saveUrl: '',
      checkUrl: '',
      deleteUrl: '',
      actionType: 'POST',
    };
  },
  watch: {
    tabIndex() {
      this.loadComponent();
    },
    'chmReagentInout.inoutFlag': {
      handler: function (val, oldVal) {
        if (this.chmReagentInout.inoutFlag === 'CLSIN') {
          this.inoutAmtLabel = 'L0000002287'; // '입고량';
        } else {
          this.inoutAmtLabel = 'L0000002903'; // '출고량';
        }
      },
      deep: true,
    },
    'chmReagentInout.plantCd': {
      handler: function (val, oldVal) {
        this.getReagentLabs();
      },
      deep: true,
    },
    'chmReagentInout.chemProdNm'(val) {
      if (!val || val === '') {
        this.chmReagentInout.chemProdNo = 0;
      }
    },
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.editable = this.$route.meta.editable;
  },
  mounted() {
    this.init();
    this.loadComponent();
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      // Url Setting
      this.searchDetailUrl = selectConfig.chm.chemicalReagentInout.get.url;
      this.checkUrl = selectConfig.chm.chemicalReagentInout.check.url;
      this.saveUrl = transactionConfig.chm.chemicalReagentInout.insert.url;
      this.deleteUrl = transactionConfig.chm.chemicalReagentInout.delete.url;

      // 입출고구분
      this.$comm.getComboItems('CHM_INOUT_CLS', true).then((_result) => {
        this.inoutFlagItems = _result;
      });

      this.getDetail();
    },
    getDetail() {
      if (
        !this.popupParam.reagentInoutNo ||
        this.popupParam.reagentInoutNo === 0
      ) {
        this.chmReagentInout.inoutDt = this.$comm.getToday();
      } else {
        this.$http.url = this.$format(
          this.searchDetailUrl,
          this.popupParam.reagentInoutNo
        );
        this.$http.type = 'GET';
        this.$http.request(
          (_result) => {
            this.updateMode = true;
            this.chmReagentInout = this.$_.clone(_result.data);
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      }
    },
    check(gubun) {
      this.$validator
        .validateAll()
        .then((result) => {
          if (result) {
            if (
              this.chmReagentInout.inoutAmt === '0' ||
              this.chmReagentInout.inoutAmt === 0
            ) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395', // '안내',
                message: 'M0000000193', // '입출고량은 0보다 커야 합니다.',
                type: 'info',
              });
              return;
            }
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321', // '확인',
              message: 'M0000000011', // 저장하시겠습니까?
              // TODO : 필요시 추가하세요.
              type: 'info', // success / info / warning / error
              // 확인 callback 함수
              confirmCallback: () => {
                this.chmReagentInout.createUserId = this.$store.getters.token;
                this.chmReagentInout.updateUserId = this.$store.getters.token;
                if (gubun === 'edit') this.isEdit = true;
                else this.isInsert = true;
                this.isSave = true;
              },
              // 취소 callback 함수
              cancelCallback: () => {
                if (gubun === 'edit') this.isEdit = false;
                else this.isInsert = false;
                this.isSave = false;
              },
            });
          } else if (!result) {
            this.$popupRequired.check(
              'reagentDispensingDetail',
              this.$data,
              this.errors
            );
          }
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000004' // '유효성 검사 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.'
          );
          this.isSave = false;
        });
    },
    /** 신규등록 하기전 UI단 유효성 검사 **/
    beforeSave() {
      var gubun = '';
      // 신규등록
      if (this.popupParam.reagentInoutNo === 0) {
        gubun = 'insert';
        this.saveUrl = transactionConfig.chm.chemicalReagentInout.insert.url;
        this.actionType = 'POST';
      }
      // 수정
      else {
        gubun = 'edit';
        this.saveUrl = transactionConfig.chm.chemicalReagentInout.edit.url;
        this.actionType = 'PUT';
      }

      this.check(gubun);
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
    /** button 관련 이벤트 **/
    /**
     * 대상부서 목록 조회 및 수정버튼 보여지도록 처리
     *  신규등록 버튼 callback
     * _result : backend에서 return하는 데이터
     */
    btnSaveClickedCallback(_result) {
      this.chmReagentInout.reagentInoutNo = _result.data;
      this.isSave = false;
      this.updateMode = true;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // '안내',
        message: 'M0000000006', // '저장되었습니다.',
        type: 'success', // success / info / warning / error
      });
    },
    /**
     * 수정 버튼 안보여지도록 처리 및 isSubmit false 처리
     *  버튼 http 통신 중 error 발생 callback
     * _result : error return하는 데이터
     */
    btnClickedErrorCallback(_result) {
      this.isSave = false;
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    /**
     *  팝업 안 보이도록 closePopup emit
     *  팝업 close
     * data : 팝업창에서 return하는 데이터
     */
    closePopup(data) {
      this.$emit('closePopup', {});
    },
    searchChemprod() {
      this.popupOptions.target = () => import(`${'../chemprod/chemprod.vue'}`);
      this.popupOptions.title = 'L0000003285'; // '화학물질';
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        popupMode: true,
      };
      this.popupOptions.closeCallback = this.closeChemprodPopup;
    },
    closeChemprodPopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data.data !== 'C') {
        this.chmReagentInout.chemProdNm = data.data.chemProdNmKr;
        this.chmReagentInout.chemProdNo = data.data.chemProdNo;
        this.chmReagentInout.casNo = data.data.casNo;
        this.changeChemReagentInout = true;
      }
    },
    /** end button 관련 이벤트 **/
    loadComponent() {
      // this.component = () => import(`${path}`);
    },
    setchangeChemReagentInout() {
      this.changeChemReagentInout = false;
    },
    btnDeleteClickedCallback(_result) {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321', // '확인',
        message: 'M0000000012', // '삭제하시겠습니까?',
        type: 'info',
        // 확인 callback 함수
        confirmCallback: () => {
          this.$http.url = this.$format(
            this.deleteUrl,
            this.chmReagentInout.reagentInoutNo
          );
          this.$http.type = 'DELETE';
          this.$http.request(
            (_result) => {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395', // '안내',
                message: 'M0000000007', // '삭제되었습니다.',
                type: 'success',
              });
              this.closePopup();
            },
            (_error) => {
              window.getApp.$emit('APP_REQUEST_ERROR', _error);
            }
          );
        },
        cancelCallback: () => {},
      });
    },
    getReagentLabs() {
      if (this.chmReagentInout.plantCd === '') {
        this.labNoItems = [
          {
            labNo: null,
            labNm: this.$comm.getLangSpecInfoLabel('L0000003394'), // 선택하세요
          },
        ];
        return;
      }
      this.$http.url = selectConfig.chm.chemicalReagentLab.list.url;
      this.$http.type = 'get';
      this.$http.param = {
        plantCd: this.chmReagentInout.plantCd,
      };
      this.$http.request(
        (_result) => {
          _result.data.splice(0, 0, {
            labNo: null,
            labNm: this.$comm.getLangSpecInfoLabel('L0000003394'), // 선택하세요
          });
          this.labNoItems = _result.data;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
  },
};
</script>
