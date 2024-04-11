<!--
  목적 : 물질관리 > 기준정보 > 규제항목관리
  작성자 : kdh
  Detail : 규제항목관리 상세/등록/수정 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 규제항목 상세 -->
    <b-row class="mt-3" ref="detailBox">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 규제항목 상세 -->
            <y-label
              label="L0000000733"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 저장 -->
              <y-btn
                v-if="updateMode && editable"
                :action-url="editUrl"
                :param="chemicalRegulItem"
                :is-submit="isEdit"
                title="L0000002474"
                color="orange"
                action-type="PUT"
                beforeSubmit="beforeEdit"
                @beforeEdit="beforeEdit"
                @btnClicked="btnEditClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <y-btn
                v-if="!updateMode && editable"
                :action-url="insertUrl"
                :param="chemicalRegulItem"
                :is-submit="isInsert"
                title="L0000002474"
                color="orange"
                action-type="POST"
                beforeSubmit="beforeInsert"
                @beforeInsert="beforeInsert"
                @btnClicked="btnInsertClickedCallback"
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
              <!-- 규제법규 -->
              <y-select
                :width="8"
                :required="true"
                :comboItems="regulLawCdSaveItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="L0000000723"
                name="regulLawCdSave"
                v-model="chemicalRegulItem.regulLawCd"
                v-validate="'required'"
                :state="validateState('regulLawCdSave')"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 규제항목명 -->
              <y-text
                :width="8"
                :editable="editable"
                :maxlength="100"
                :required="true"
                ui="bootstrap"
                label="L0000000731"
                name="regulItmNm"
                v-model="chemicalRegulItem.regulItmNm"
                v-validate="'required'"
                :state="validateState('regulItmNm')"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 규제항목코드 -->
              <y-text
                :width="8"
                :editable="editable"
                :maxlength="30"
                ui="bootstrap"
                label="L0000000734"
                name="regulItmCd"
                v-model="chemicalRegulItem.regulItmCd"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 기관 -->
              <y-select
                :width="8"
                :required="true"
                :comboItems="regulOrgCdItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="L0000000773"
                name="regulOrgCdSave"
                v-model="chemicalRegulItem.regulOrgCd"
                v-validate="'required'"
                :state="validateState('regulOrgCdSave')"
              ></y-select>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <y-textarea
                :width="10"
                :editable="editable"
                :maxlength="300"
                ui="bootstrap"
                label="L0000001578"
                name="contents"
                v-model="chemicalRegulItem.contents"
              ></y-textarea>
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
                name="radioValue"
                selectText="L0000001440"
                unselectText="L0000001063"
                v-model="chemicalRegulItem.useYn"
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
                v-model="chemicalRegulItem.sortOrder"
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
        regulItmNo: 0,
      },
    },
  },
  data() {
    return {
      chemicalRegulItem: {
        regulLawCd: null,
        regulItmNm: '',
        regulItmCd: '',
        contents: '',
        sortOrder: '',
        useYn: 'Y',
        createUserId: '',
        updateUserId: '',
        regulOrgCd: null,
      },
      searchParam: {
        regulLawCd: null, // 규제법규
        regulItmNm: '', // 규제항목명
        useYn: 'Y',
      },
      gridOptions: {
        header: [],
        data: [],
        height: 210,
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
      searchUrl: '',
      detailUrl: '',
      checkUrl: '',
      insertUrl: '',
      editUrl: '',
      isInsert: false,
      isEdit: false,
      regulLawCdItems: [], // 규제법규 리스트 (조회)
      regulLawCdSaveItems: [], // 규제법규 리스트 (저장)
      regulOrgCdItems: [], // 기관
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
      // URL 셋팅
      this.searchUrl = selectConfig.chm.chemicalRegulItem.list.url;
      this.detailUrl = selectConfig.chm.chemicalRegulItem.get.url;
      this.checkUrl = selectConfig.chm.chemicalRegulItem.check.url;
      this.insertUrl = transactionConfig.chm.chemicalRegulItem.insert.url;
      this.editUrl = transactionConfig.chm.chemicalRegulItem.edit.url;

      this.editable = this.$route.meta.editable;

      this.$comm.getComboItems('CHM_REGUL_LAW', false).then((_result) => {
        this.regulLawCdSaveItems = _result; // 규제법규
      });
      this.$comm.getComboItems('CHM_REGUL_ORG', false).then((_result) => {
        this.regulOrgCdItems = _result; // 기관
      });
      if (this.popupParam.regulItmNo !== 0) {
        this.getDetail();
      }
    },
    getDetail() {
      this.$http.url = this.$format(this.detailUrl, this.popupParam.regulItmNo);
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.chemicalRegulItem = this.$_.clone(_result.data);
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
              regulLawCd: this.chemicalRegulItem.regulLawCd,
              regulItmNm: this.chemicalRegulItem.regulItmNm,
              regulItmNo:
                flag === 'edit' ? this.chemicalRegulItem.regulItmNo : '',
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
                      this.chemicalRegulItem.createUserId =
                        this.$store.getters.token;
                      this.chemicalRegulItem.updateUserId =
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
              'chemicalRegulItemDetail',
              this.$data,
              this.errors
            );
          }
        })
        .catch(() => {
          window.getApp.$emit('APP_VALID_ERROR', 'M0000000876');
        });
    },
    showMessage(checkList, flag) {
      var checkText = '';
      var i = 0;
      for (; i < checkList.length; i++) {
        if (this.$_.parseInt(checkList[i].cnt) > 0) {
          checkText =
            checkList[i].gubun === 'regulItmNm'
              ? 'M0000000150' // 이미 존재하는 규제항목명입니다.
              : 'M0000000151'; // 이미 존재하는 규제법규입니다.
          break;
        }
      }
      if (checkText) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
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
        message: 'M0000000006', // 저장되었습니다
        type: 'success',
      });
    },
    // 신규등록
    btnInsertClickedCallback(_result) {
      this.isInsert = false;
      this.updateMode = true;
      this.chemicalRegulItem.regulItmNo = _result.data;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // 안내
        message: 'M0000000006', // 저장되었습니다
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
    btnClosePopup() {
      // 부모창에 값 전달
      this.$emit('closePopup', { success: true });
    },
  },
};
</script>
