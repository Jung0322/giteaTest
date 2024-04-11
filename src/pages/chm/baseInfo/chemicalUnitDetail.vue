<!--
  목적 : 물질관리 > 기준정보 > 물질단위관리
  작성자 : kdh
  Detail : 물질단위관리 상세/등록/수정 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 물질단위 상세 -->
    <b-row class="mt-3" ref="detailBox">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 물질단위 상세 -->
            <y-label
              label="L0000001055"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 저장 -->
              <y-btn
                v-if="!updateMode && editable"
                :action-url="insertUrl"
                :param="chemicalUnit"
                :is-submit="isInsert"
                title="L0000002474"
                color="orange"
                action-type="POST"
                beforeSubmit="beforeInsert"
                @beforeInsert="beforeInsert"
                @btnClicked="btnInsertClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <y-btn
                v-if="updateMode && editable"
                :action-url="editUrl"
                :param="chemicalUnit"
                :is-submit="isEdit"
                title="L0000002474"
                color="orange"
                action-type="PUT"
                beforeSubmit="beforeEdit"
                @beforeEdit="beforeEdit"
                @btnClicked="btnEditClickedCallback"
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
              <!-- 단위명 -->
              <y-text
                :width="8"
                :editable="editable"
                :maxlength="5"
                :required="true"
                ui="bootstrap"
                label="L0000000871"
                name="unitNm"
                v-model="chemicalUnit.unitNm"
                v-validate="'required'"
                :state="validateState('unitNm')"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 단위코드 -->
              <y-text
                :width="8"
                :editable="editable"
                :maxlength="30"
                ui="bootstrap"
                label="L0000000879"
                name="unitCd"
                v-model="chemicalUnit.unitCd"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 단위코드(상업) -->
              <y-text
                :width="8"
                :editable="editable"
                :maxlength="30"
                ui="bootstrap"
                label="L0000000880"
                name="unitBusiness"
                v-model="chemicalUnit.unitBusiness"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- KG환산값 -->
              <y-number
                :width="8"
                :editable="editable"
                :maxlength="20"
                :pointNumber="10"
                type="search"
                ui="bootstrap"
                name="factor"
                label="L0000000125"
                v-model="chemicalUnit.factor"
              ></y-number>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 사용여부 -->
              <!-- 사용, 미사용 -->
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
                v-model="chemicalUnit.useYn"
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
                name="sortOrder"
                label="L0000002601"
                v-model="chemicalUnit.sortOrder"
              ></y-number>
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
  name: 'y-chemical-branch-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        unitNo: 0,
      },
    },
  },
  data() {
    return {
      chemicalUnit: {
        unitNm: '',
        unitCd: '',
        unitBusiness: '',
        factor: 0,
        sortOrder: '',
        useYn: 'Y',
        createUserId: '',
        updateUserId: '',
      },
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '90%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      editable: false,
      updateMode: false,

      detailUrl: '',
      checkUrl: '',
      insertUrl: '',
      editUrl: '',
      isInsert: false,
      isEdit: false,
    };
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {},
  beforeDestroy() {},
  /** methods **/
  methods: {
    init() {
      this.detailUrl = selectConfig.chm.chemicalUnit.get.url;
      this.checkUrl = selectConfig.chm.chemicalUnit.check.url;
      this.insertUrl = transactionConfig.chm.chemicalUnit.insert.url;
      this.editUrl = transactionConfig.chm.chemicalUnit.edit.url;

      this.editable = this.$route.meta.editable;

      if (this.popupParam.unitNo !== 0) {
        this.getDetail();
      }
    },
    getDetail() {
      this.$http.url = this.$format(this.detailUrl, this.popupParam.unitNo);
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.chemicalUnit = this.$_.clone(_result.data);
          this.updateMode = true;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
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
    /** validation checking **/
    beforeInsert() {
      this.checkValidator('insert');
    },
    beforeEdit() {
      this.checkValidator('edit');
    },
    checkValidator(flag) {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            this.$http.url = this.checkUrl;
            this.$http.type = 'GET';
            this.$http.param = {
              unitNm: this.chemicalUnit.unitNm,
              unitNo: flag === 'edit' ? this.unitNo : 0,
            };
            this.$http.request(
              (_result) => {
                var returnVal = this.showMessage(_result.data, flag);

                if (returnVal) {
                  window.getApp.$emit('CONFIRM', {
                    title: 'L0000003321',
                    message: flag === 'edit' ? 'M0000000011' : 'M0000000011',
                    // 저장하시겠습니까?
                    type: 'info',
                    // 확인 callback 함수
                    confirmCallback: () => {
                      this.chemicalUnit.createUserId =
                        this.$store.getters.token;
                      this.chemicalUnit.updateUserId =
                        this.$store.getters.token;
                      if (flag === 'edit') this.isEdit = true;
                      else this.isInsert = true;
                    },
                    cancelCallback: () => {
                      if (flag === 'edit') this.isEdit = false;
                      else this.isInsert = false;
                    },
                  });
                }
              },
              (_error) => {
                window.getApp.$emit('APP_REQUEST_ERROR', _error);
              }
            );
          } else {
            this.$popupRequired.check(
              'chemicalUnitDetail',
              this.$data,
              this.errors
            );
          }
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000876'
            // 유효성 검사도중 에러가 발생하였습니다.
          );
        });
    },
    showMessage(checkList, flag) {
      var checkText = '';
      var i = 0;
      for (; i < checkList.length; i++) {
        if (this.$_.parseInt(checkList[i].cnt) > 0 && !this.updateMode) {
          checkText = 'M0000000152';
          // 이미 존재하는 단위명입니다.
          break;
        }
      }
      if (checkText) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: checkText,
          type: 'warning',
        });
        return false;
      } else {
        return true;
      }
    },
    // 수정
    btnEditClickedCallback(_result) {
      this.isEdit = false;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // 안내
        message: 'M0000000006', // 저장되었습니다.
        type: 'success',
      });
    },
    // 버튼 에러 처리
    btnClickedErrorCallback(_result) {
      this.isInsert = false;
      this.isEdit = false;
      this.updateMode = false;
      window.getApp.emit('APP_REQUEST_ERROR', _result);
    },
    // 신규등록
    btnInsertClickedCallback(_result) {
      this.isInsert = false;
      this.updateMode = true;
      this.chemicalUnit.unitNo = _result.data;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // 안내
        message: 'M0000000006', // 저장되었습니다
        type: 'success',
      });
    },
    btnClosePopup() {
      // 부모창에 값 전달
      this.$emit('closePopup', { success: true });
    },
  },
};
</script>
