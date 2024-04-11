<!--
  목적 : 질환 기준정보 - 질환
  Detail : 질환 등록/수정화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 등록 -->
    <b-row class="mt-3" ref="editBox">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 질환 상세 -->
            <y-label
              label="L0000002782"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 저장 -->
              <y-btn
                v-if="updateMode && editable"
                :action-url="editUrl"
                :param="disease"
                :is-submit="isEdit"
                title="L0000002474"
                color="orange"
                action-type="PUT"
                beforeSubmit="beforeSubmit"
                @beforeSubmit="beforeSubmit"
                @btnClicked="btnSaveClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <y-btn
                v-if="editable && !updateMode"
                :action-url="insertUrl"
                :param="disease"
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
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 질환종류명 -->
              <y-select
                :width="8"
                :comboItems="comboDisaseTypeItems"
                :required="true"
                :editable="editable"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="L0000002786"
                name="heaDiseaseClassCd"
                v-model="disease.heaDiseaseClassCd"
                v-validate="'required'"
                :state="validateState('heaDiseaseClassCd')"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 질환명 -->
              <y-text
                :width="8"
                :maxlength="30"
                :editable="editable"
                :required="true"
                ui="bootstrap"
                label="L0000002784"
                name="heaDiseaseNm"
                v-model="disease.heaDiseaseNm"
                v-validate="'required'"
                :state="validateState('heaDiseaseNm')"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 질환코드 -->
              <y-text
                :width="8"
                :disabled="true"
                :editable="editable"
                ui="bootstrap"
                label="L0000002787"
                name="heaDiseaseCd"
                v-model="disease.heaDiseaseCd"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 정렬순서 -->
              <y-number
                :width="8"
                :maxlength="5"
                :hasSeperator="false"
                :isPositive="true"
                :editable="editable"
                ui="bootstrap"
                label="L0000002601"
                name="sortOrder"
                v-model="disease.sortOrder"
              ></y-number>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <!-- 비고 -->
              <y-textarea
                :width="10"
                :maxlength="150"
                :editable="editable"
                ui="bootstrap"
                label="L0000001360"
                name="remark"
                v-model="disease.remark"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
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
                v-model="disease.useYn"
              ></y-switch>
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
  /* attributes: name, components, props, data */
  name: 'y-deisease',
  props: {
    popupParam: {
      type: Object,
      default: {
        heaDiseaseCd: '',
        pageNm: '',
        noAccUseYn: false,
      },
    },
  },
  data: () => ({
    disease: {
      heaDiseaseClassCd: null,
      heaDiseaseClassNm: '',
      heaDiseaseCd: '',
      heaDiseaseNm: '',
      remark: '',
      sortOrder: '',
      useYn: 'Y',
      updateUserId: '',
      createUserId: '',
    },
    searchParam: {
      heaDiseaseClassCd: '',
      heaDiseaseNm: '',
    },
    searchArea: {
      title: '검색박스숨기기',
      show: true,
    },
    gridOptions: {
      header: [],
      data: [],
      height: '300',
    },
    baseWidth: 9,
    editable: false,
    updateMode: false,
    isInsert: false,
    isEdit: false,
    comboDisaseTypeItems: [],
    comboDisaseTypeSelectItems: [],
    radioItems: null,
    editUrl: '',
    insertUrl: '',
    searchUrl: '',
  }),
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    // 윈도우 resize event
    // window.addEventListener('resize', this.setGridSize);
  },
  beforeDestroy() {
    // 윈도우 resize event 제거-SPA 기반이므로 제거하지 않으면 다른페이지에서 해당 이벤트가 호출됨
    // window.removeEventListener('resize', this.setGridSize);
  },

  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      setTimeout(() => {
        // Url Setting
        this.searchUrl = selectConfig.hea.disease.list.url;
        this.editUrl = transactionConfig.hea.disease.edit.url;
        this.insertUrl = transactionConfig.hea.disease.insert.url;
        // radio 버튼 셋팅
        this.radioItems = [
          { useYn: 'Y', useName: 'L0000001440' }, // 사용
          { useYn: 'N', useName: 'L0000001063' }, // 미사용
        ];
      }, 100);

      this.getComboItems('HEA_DISEASE_CLASS'); // 질환종류
      if (this.popupParam.heaDiseaseCd !== '') {
        this.getDetail();
      }
    },
    /**
     * 공통 마스터 정보 조회 (질환종류)
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
          this.comboDisaseTypeItems = this.$_.clone(_result.data);
          this.comboDisaseTypeItems.splice(0, 0, {
            code: null,
            codeNm: this.$comm.getLangSpecInfoLabel('L0000003394'), // '선택하세요',
          });
          this.comboDisaseTypeSelectItems = this.$_.clone(_result.data);
          this.comboDisaseTypeSelectItems.splice(0, 0, {
            code: '',
            codeNm: this.$comm.getLangSpecInfoLabel('L0000002519'), // '전체',
          });
          if (
            this.$_.findIndex(this.comboDisaseTypeSelectItems, {
              heaDiseaseClassCd: this.searchParam.heaDiseaseClassCd,
            }) === -1
          ) {
            this.searchParam.heaDiseaseClassCd = '';
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getDetail() {
      this.$http.url = this.$format(
        selectConfig.hea.disease.get.url,
        this.popupParam.heaDiseaseCd
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.updateMode = true;
          this.disease = this.$_.clone(_result.data);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /**
     * 질환 목록 조회
     *  수정 버튼 callback
     * _result : backend에서 return하는 데이터
     */
    btnSaveClickedCallback(_result) {
      // window.alert("수정되었습니다.");
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // '안내',
        message: 'M0000000006', // 저장되었습니다.
        type: 'success', // success / info / warning / error
      });
      this.isEdit = false;
    },
    /** 수정 하기전 UI단 유효성 검사 **/
    beforeSubmit() {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            // this.isEdit = window.confirm("수정하시겠습니까?");
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321', // '확인',
              message: 'M0000000011', // 저장하시겠습니까?
              // TODO : 필요시 추가하세요.
              type: 'info', // success / info / warning / error
              // 확인 callback 함수
              confirmCallback: () => {
                this.disease.updateUserId = this.$store.getters.token;
                this.isEdit = true;
              },
              // 취소 callback 함수
              cancelCallback: () => {
                this.isEdit = false;
              },
            });
          } else if (!_result) {
            this.$popupRequired.check('diseaseDetail', this.$data, this.errors);
          }
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000881' // 유효성 검사도중 에러가 발생하였습니다.
          );
          this.isEdit = false;
        });
    },
    /** 신규등록 하기전 UI단 유효성 검사 **/
    beforeInsert() {
      var heaDiseaseNms = this.$_.map(this.gridOptions.data, 'heaDiseaseNm');
      if (this.$_.indexOf(heaDiseaseNms, this.disease.heaDiseaseNm) > -1) {
        // window.alert("이미 같은 이름의 질환명이 존재합니다.");
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000411', // 이미 같은 이름의 질환명이 존재합니다.
          type: 'warning', // success / info / warning / error
        });
        return;
      }
      this.$validator
        .validateAll()
        .then((_result) => {
          // TODO : 전역 성공 메시지 처리
          // 이벤트는 ./event.js 파일에 선언되어 있음
          if (_result) {
            // this.isInsert = window.confirm("저장하시겠습니까?");
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321', // '확인',
              message: 'M0000000011', // 저장하시겠습니까?
              // TODO : 필요시 추가하세요.
              type: 'info', // success / info / warning / error
              // 확인 callback 함수
              confirmCallback: () => {
                this.disease.createUserId = this.$store.getters.token;
                this.isInsert = true;
              },
              // 취소 callback 함수
              cancelCallback: () => {
                this.isInsert = false;
              },
            });
          } else if (!_result) {
            this.$popupRequired.check('diseaseDetail', this.$data, this.errors);
          }
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000881' // 유효성 검사도중 에러가 발생하였습니다.
          );
          this.isInsert = false;
        });
    },
    /**
     * 질환 목록 조회 및 수정버튼 보여지도록 처리
     *  신규등록 버튼 callback
     * _result : backend에서 return하는 데이터
     */
    btnInsertClickedCallback(_result) {
      this.disease.heaDiseaseCd = _result.data;

      // window.alert("저장되었습니다.");
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // '안내',
        message: 'M0000000006', // 저장되었습니다.
        type: 'success', // success / info / warning / error
      });
      this.isInsert = false;
      this.updateMode = true;
    },
    /**
     * 수정 버튼 안보여지도록 처리 및 isSubmit false 처리
     *  버튼 http 통신 중 error 발생 callback
     * _result : error return하는 데이터
     */
    btnClickedErrorCallback(_result) {
      this.updateMode = false;
      this.isInsert = false;
      this.isEdit = false;
      this.btnClearClickedCallback();
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
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
    btnClosePopup() {
      // 부모창에 값 전달
      this.$emit('closePopup', { success: true });
    },
  },
};
</script>
