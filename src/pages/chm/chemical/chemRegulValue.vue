<!--
  목적 : 화학물질관리 > 화학물질  > 화학물질 상세 > 규제법규 및 항목 상세
  Detail : 규제법규 및 항목 상세 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 등록 -->
    <b-row ref="editBox">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 규제법규별 항목값 상세 -->
            <y-label
              label="L0000004603"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 저장 -->
              <y-btn
                v-if="editable"
                title="L0000002474"
                color="orange"
                @btnClicked="btnSave"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 닫기 -->
              <y-btn title="L0000000881" @btnClicked="closePopup('C')" />
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 규제법규 -->
              <y-select
                :width="8"
                :required="true"
                :comboItems="regulLawCdItems"
                :disabled="disabled"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="L0000000723"
                name="regulLawCdSave"
                v-model="regulItemChemVal.regulLawCd"
                v-validate="'required'"
                :state="validateState('regulLawCdSave')"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 규제항목 -->
              <y-select
                :width="8"
                :required="true"
                :disabled="disabled"
                :comboItems="regulItems"
                itemText="regulItmNm"
                itemValue="regulItmNo"
                ui="bootstrap"
                label="L0000000729"
                name="regulItmNo"
                v-model="regulItemChemVal.regulItmNo"
                v-validate="'required'"
                :state="validateState('regulItmNo')"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 기준값 -->
              <y-number
                :width="8"
                :editable="editable"
                :maxlength="20"
                :pointNumber="10"
                type="search"
                ui="bootstrap"
                name="stndVal"
                label="L0000000786"
                v-model="regulItemChemVal.stndVal"
              ></y-number>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 기준단위 -->
              <y-select
                :width="8"
                :comboItems="unitItem"
                itemText="unitNm"
                itemValue="unitNo"
                ui="bootstrap"
                label="L0000000787"
                name="unitNo"
                v-model="regulItemChemVal.unitNo"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 부등호 -->
              <y-select
                :width="8"
                :comboItems="stndSignItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="L0000001286"
                name="stndSign"
                v-model="regulItemChemVal.stndSign"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 적용시작일 -->
              <y-datepicker
                :width="8"
                :editable="editable"
                type="startDt"
                label="L0000002487"
                :default="regulItemChemVal.startDt"
                v-model="regulItemChemVal.startDt"
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
  /* attributes: name, components, props, data */
  name: 'y-chem-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        regulItmChemValNo: 0, // 화학물질 규제법규별 항목값 no
        data: null,
        regulItmNos: [],
      },
    },
  },
  data: () => ({
    regulItemChemVal: {
      regulItmChemValNo: 0, // 화학물질 규제법규별 항목값 no
      regulLawCd: null, // 규제법규
      regulLawNm: '',
      regulItmNo: null, // 규제항목
      regulItmNm: '',
      stndVal: 0, // 기준값
      unitNo: null, // 기준단위
      unitNm: '',
      stndSign: null, // 부등호
      stndSignNm: '',
      startDt: '', // 적용시작일
    },
    regulLawCdItems: [],
    stndSignItems: [],
    regulItems: [],
    unitItem: [],
    editable: false,
    disabled: false,
    searchUnitUrl: '',
    searchDetailUrl: '',
    searchRegulUrl: '',
  }),
  watch: {
    'regulItemChemVal.regulLawCd': function (newValue, oldValue) {
      this.getReguls(newValue); // 규제항목
    },
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {},
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      // Url Setting
      this.searchDetailUrl = selectConfig.chm.chemicalRegulItmChemVal.get.url;
      this.searchRegulUrl = selectConfig.chm.chemicalRegulItem.list.url;
      this.searchUnitUrl = selectConfig.chm.chemicalUnit.list.url;

      this.getComboItems('CHM_REGUL_LAW'); // 규제법규
      this.getComboItems('CHM_STND_SIGN'); // 부등호
      this.getReguls(''); // 규제항목
      this.getUnitDataList(); // 물질단위

      this.getDetail(); // 규제법규 및 항목 목록 검색
    },
    /** 규제법규 및 항목 목록 검색 **/
    getDetail() {
      if (!this.popupParam.regulItmChemValNo) {
        // 추가만 하여 키값이 없는경우 부모창에서 보낸 값들을 바인딩 한다
        if (this.popupParam.data) {
          this.regulItemChemVal = this.$_.clone(this.popupParam.data);
          this.disabled = true;
        }
        return;
      }
      this.$http.url = this.$format(
        this.searchDetailUrl,
        this.popupParam.regulItmChemValNo
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.regulItemChemVal = this.$_.clone(_result.data);
          this.disabled = true;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    // 물질단위 grid
    getUnitDataList() {
      this.$http.url = this.searchUnitUrl;
      this.$http.type = 'GET';
      this.$http.param = {
        useYn: 'Y',
      };
      this.$http.request(
        (_result) => {
          this.unitItem = _result.data;
          this.unitItem.splice(0, 0, {
            unitNo: null,
            unitNm: this.$comm.getLangSpecInfoLabel('L0000003394'),
          }); // 선택하세요
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /**
     * 공통 마스터 정보 조회 (규제법규, 부등호)
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
          if (codeGroupCd === 'CHM_REGUL_LAW') {
            this.regulLawCdItems = this.$_.clone(_result.data);
            this.regulLawCdItems.splice(0, 0, {
              code: null,
              codeNm: this.$comm.getLangSpecInfoLabel('L0000003394'), // 선택하세요
            });
          } else if (codeGroupCd === 'CHM_STND_SIGN') {
            this.stndSignItems = this.$_.clone(_result.data);
            this.stndSignItems.splice(0, 0, {
              code: null,
              codeNm: this.$comm.getLangSpecInfoLabel('L0000003394'), // 선택하세요
            });
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    // 규제항목 검색
    getReguls(regulLawCd) {
      if (!regulLawCd) return;
      this.$http.url = this.searchRegulUrl;
      this.$http.type = 'GET';
      this.$http.param = {
        useYn: 'Y',
        regulLawCd: regulLawCd,
      };
      this.$http.request(
        (_result) => {
          this.regulItems = this.$_.clone(_result.data);
          this.regulItems.splice(0, 0, {
            regulItmNo: null,
            regulItmNm: this.$comm.getLangSpecInfoLabel('L0000003394'), // '선택하세요';
          });
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    setRegulItemChemVal() {
      this.regulItemChemVal.regulLawNm =
        this.regulLawCdItems[
          this.$_.findIndex(this.regulLawCdItems, {
            code: this.regulItemChemVal.regulLawCd,
          })
        ].codeNm;
      this.regulItemChemVal.regulItmNm =
        this.regulItems[
          this.$_.findIndex(this.regulItems, {
            regulItmNo: this.regulItemChemVal.regulItmNo,
          })
        ].regulItmNm;
      this.regulItemChemVal.unitNm =
        this.unitItem[
          this.$_.findIndex(this.unitItem, {
            unitNo: this.regulItemChemVal.unitNo,
          })
        ].unitNm;
      this.regulItemChemVal.stndSignNm =
        this.stndSignItems[
          this.$_.findIndex(this.stndSignItems, {
            code: this.regulItemChemVal.stndSign,
          })
        ].codeNm;
    },
    /** 신규등록 하기전 UI단 유효성 검사 **/
    btnSave() {
      // 부모창의 규제법규 및 항목 목록에 있는 것이면 제외
      // 있다라는 것의 정의
      // > 규제항목번호 - regulItmNo
      this.$validator
        .validateAll()
        .then((result) => {
          if (result) {
            if (
              this.$_.indexOf(
                this.popupParam.regulItmNos,
                this.regulItemChemVal.regulItmNo
              ) === -1 ||
              this.disabled
            ) {
              this.setRegulItemChemVal();
              this.closePopup(this.regulItemChemVal);
            } else {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395', // 안내
                message: 'M0000001074', // 이미 해당 규제항목이 존재합니다.
                type: 'warning', // success / info / warning / error
              });
              return;
            }
          } else if (!result) {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395', // 안내
              message: 'M0000000005', // 필수 입력값을 입력해 주세요.
              type: 'warning',
            });
          }
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000881' // 유효성 검사도중 에러가 발생하였습니다.
          );
        });
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
     * 수정 버튼 안보여지도록 처리 및 isSubmit false 처리
     *  버튼 http 통신 중 error 발생 callback
     * _result : error return하는 데이터
     */
    btnClickedErrorCallback(_result) {
      this.updateMode = false;
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    /**
     *  팝업 안 보이도록 closePopup emit
     *  팝업 close
     * data : 팝업창에서 return하는 데이터
     */
    closePopup(data) {
      this.$emit('closePopup', { data });
    },
    /** end button 관련 이벤트 **/
  },
};
</script>
