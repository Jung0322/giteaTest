<template>
  <b-container fluid>
    <!-- 시설유형별 점검항목 상세 -->
    <b-row class="mt-3" ref="editBox">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 시설유형별 점검항목 상세 -->
            <y-label
              label="L0000004300"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 저장 -->
              <y-btn
                v-if="editable"
                :action-url="saveUrl"
                :param="facilityTypeCkItem"
                :is-submit="isSave"
                title="L0000002474"
                color="orange"
                :action-type="actionType"
                beforeSubmit="beforeSave"
                @beforeSave="beforeSave"
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
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-plant
                type="edit"
                :editable="editable"
                :required="true"
                name="plantCd"
                v-model="facilityTypeCkItem.plantCd"
                v-validate="'required'"
                :state="validateState('plantCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 시설유형 -->
              <y-select
                :width="8"
                :editable="editable"
                :required="true"
                :comboItems="comboFacilityTypeItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="L0000001747"
                name="facilityTypeCd"
                v-model="facilityTypeCkItem.facilityTypeCd"
                v-validate="'required'"
                :state="validateState('facilityTypeCd')"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 시설점검종류 -->
              <y-select
                :width="8"
                :editable="editable"
                :required="true"
                :comboItems="comboCheckTypeItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="L0000001765"
                name="facilityCheckCd"
                v-model="facilityTypeCkItem.facilityCheckCd"
                v-validate="'required'"
                :state="validateState('facilityCheckCd')"
              ></y-select>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <!-- 점검항목 -->
              <y-text
                :width="10"
                :editable="editable"
                :maxlength="100"
                :required="true"
                ui="bootstrap"
                label="L0000002584"
                name="facilityCheckItemNm"
                v-model="facilityTypeCkItem.facilityCheckItemNm"
                v-validate="'required'"
                :state="validateState('facilityCheckItemNm')"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 사용여부, 사용/미사용 -->
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
                v-model="facilityTypeCkItem.useYn"
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
                :required="true"
                ui="bootstrap"
                name="sortOrder"
                label="L0000002601"
                v-model="facilityTypeCkItem.sortOrder"
                v-validate="'required'"
                :state="validateState('sortOrder')"
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
  name: 'y-facility-inspection-type-check-item-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        facilityCheckItemNo: 0,
      },
    },
  },
  data() {
    return {
      facilityTypeCkItem: {
        facilityCheckItemNo: 0, // 시설유형별점검항목No
        facilityCheckItemNm: '', // 시설유형별점검항목명
        plantCd: '', // 사업장코드
        facilityTypeCd: '', // 시설유형코드
        facilityCheckCd: '', // 시설점검종류코드
        useYn: 'Y', // 사용여부
        sortOrder: '', // 정렬순서
        createUserId: '', // 생성자아아디
        updateUserId: '', // 수정자아이디
      },
      gridOptions: {
        header: [],
        data: [],
        height: 300,
      },
      actionType: 'POST',
      editable: false,
      updateMode: false,
      searchUrl: '',
      detailUrl: '',
      checkUrl: '',
      saveUrl: '',
      insertUrl: '',
      editUrl: '',
      isSave: false,
      isInsert: false,
      isEdit: false,
      searchFacilityTypeItems: [], // 시설유형
      searchCheckTypeItems: [], // 점검종류
      comboFacilityTypeItems: [], // 시설유형
      comboCheckTypeItems: [], // 점검종류
    };
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {},
  /** methods **/
  methods: {
    init() {
      // URL 셋팅
      this.searchUrl = selectConfig.saf.facilityInsTypeCkItem.list.url;
      this.detailUrl = selectConfig.saf.facilityInsTypeCkItem.get.url;
      this.checkUrl = selectConfig.saf.facilityInsTypeCkItem.check.url;
      this.insertUrl = transactionConfig.saf.facilityInsTypeCkItem.insert.url;
      this.editUrl = transactionConfig.saf.facilityInsTypeCkItem.edit.url;

      this.editable = this.$route.meta.editable;
      // this.editable = true;

      this.getComboItems('SAF_FACILITY_CHECK'); // 점검종류
      this.getComboFacilityTypeItems(); // 시설유형

      if (this.popupParam.facilityCheckItemNo) {
        this.getDetail();
      }
    },
    getDetail() {
      this.$http.url = this.$format(
        this.detailUrl,
        this.popupParam.facilityCheckItemNo
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.facilityTypeCkItem = this.$_.clone(_result.data);
          this.updateMode = true;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /**
     * 공통 마스터 정보 조회 (점검종류)
     * codeGroupCd : 마스터 테이블 codeGroupCd 정보
     */
    getComboItems(codeGroupCd) {
      this.$http.url = this.$format(
        selectConfig.codeMaster.getSelect.url,
        codeGroupCd
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          if (codeGroupCd === 'SAF_FACILITY_CHECK') {
            this.searchCheckTypeItems = this.$_.clone(_result.data);
            this.searchCheckTypeItems.splice(0, 0, {
              code: '',
              codeNm: this.$comm.getLangSpecInfoLabel('L0000002519'), // 전체
            });
            this.comboCheckTypeItems = this.$_.clone(_result.data);
            this.comboCheckTypeItems.splice(0, 0, {
              code: '',
              codeNm: this.$comm.getLangSpecInfoLabel('L0000003394'), // 선택하세요
            });
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /**
     * 시설유형 조회
     */
    getComboFacilityTypeItems() {
      this.$http.url =
        selectConfig.saf.facilityInspection.facilityType.list.url;
      this.$http.type = 'GET';
      this.$http.param = {
        useYn: 'Y',
      };
      this.$http.request(
        (_result) => {
          this.searchFacilityTypeItems = this.$_.clone(_result.data);
          this.searchFacilityTypeItems.splice(0, 0, {
            code: '',
            codeNm: this.$comm.getLangSpecInfoLabel('L0000002519'), // 전체
          });
          this.comboFacilityTypeItems = this.$_.clone(_result.data);
          this.comboFacilityTypeItems.splice(0, 0, {
            code: '',
            codeNm: this.$comm.getLangSpecInfoLabel('L0000003394'), // 선택하세요
          });
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
    /** 신규등록 하기전 UI단 유효성 검사 **/
    beforeSave() {
      var gubun = '';

      // 신규등록
      if (!this.updateMode) {
        gubun = 'insert';
        this.saveUrl = this.insertUrl;
        this.actionType = 'POST';
      }
      // 수정
      else {
        gubun = 'edit';
        this.saveUrl = this.editUrl;
        this.actionType = 'PUT';
      }

      this.checkValidator(gubun);
    },
    checkValidator(flag) {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            this.$http.url = this.checkUrl;
            this.$http.type = 'GET';
            this.$http.param = {
              facilityCheckItemNo:
                flag === 'edit'
                  ? this.facilityTypeCkItem.facilityCheckItemNo
                  : 0,
              facilityCheckItemNm: this.facilityTypeCkItem.facilityCheckItemNm,
              facilityTypeCd: this.facilityTypeCkItem.facilityTypeCd,
            };
            this.$http.request(
              (_result) => {
                var returnVal = this.showMessage(_result.data, flag);

                if (returnVal) {
                  window.getApp.$emit('CONFIRM', {
                    title: 'L0000003321', // '확인',
                    message:
                      flag === 'edit'
                        ? 'M0000000011' // 저장하시겠습니까?
                        : 'M0000000105', // 등록하시겠습니까?
                    type: 'info',
                    // 확인 callback 함수
                    confirmCallback: () => {
                      if (flag === 'edit') {
                        this.facilityTypeCkItem.updateUserId =
                          this.$store.getters.token;
                        this.isEdit = true;
                      } else {
                        this.facilityTypeCkItem.createUserId =
                          this.$store.getters.token;
                        this.isInsert = true;
                      }
                      this.isSave = true;
                    },
                    cancelCallback: () => {
                      if (flag === 'edit') {
                        this.isEdit = false;
                      } else {
                        this.isInsert = false;
                      }
                      this.isSave = false;
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
              'facilityTypeCheckItemDetail',
              this.$data,
              this.errors
            );
          }
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000881' // 유효성 검사도중 에러가 발생하였습니다.
          );
        });
    },
    showMessage(checkList, flag) {
      var checkText = '';
      var i = 0;
      for (; i < checkList.length; i++) {
        if (this.$_.parseInt(checkList[i].cnt) > 0) {
          checkText = 'M0000000699'; // 이미 존재하는 점검항목명입니다.
          break;
        }
      }
      if (checkText) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: checkText,
          type: 'warning',
        });
        return false;
      } else {
        return true;
      }
    },
    btnSaveClickedCallback(_result) {
      // _result.data가 저장여부 1/0을 반환하고 있음.
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // '안내',
        message: 'M0000000006', // 저장되었습니다.
        type: 'success', // success / info / warning / error
      });
      this.facilityTypeCkItem.facilityCheckItemNo = this.$_.clone(_result.data);
      this.isSave = false;
      this.isInsert = false;
      this.updateMode = true;
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
