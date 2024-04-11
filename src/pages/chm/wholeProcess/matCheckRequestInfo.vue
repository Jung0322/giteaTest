<!--
  목적 : 물질관리 > 전과정관리 > 물질검토 > 물질검토 상세  > 물질검토 정보
  Detail : 화학물질 등록/수정 화면
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
            <!-- 자재검토 상세 -->
            <y-label
              label="L0000005474"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 저장 -->
              <y-btn
                v-if="editable"
                :action-url="saveUrl"
                :param="matCheckRequest"
                :is-submit="isSave"
                title="L0000002474"
                color="orange"
                :action-type="actionType"
                beforeSubmit="beforeSave"
                @beforeSave="beforeSave"
                @btnClicked="btnSaveClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <b-row>
                <b-col sm="8" md="8" lg="8" xl="8" class="col-xxl-8">
                  <!--검토요청자  -->
                  <y-text
                    :width="6"
                    :editable="editable"
                    :disabled="true"
                    ui="bootstrap"
                    label="L0000000387"
                    name="deptNm"
                    v-model="matCheckRequest.deptNm"
                  ></y-text>
                </b-col>
                <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
                  <y-text
                    :width="12"
                    :editable="editable"
                    :disabled="true"
                    ui="bootstrap"
                    name="chkRqsterNm"
                    v-model="matCheckRequest.chkRqsterNm"
                  ></y-text>
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 검토요청일 -->
              <y-datepicker
                :width="8"
                :disabled="true"
                type="rqstDt"
                label="L0000000386"
                :default="matCheckRequest.rqstDt"
                v-model="matCheckRequest.rqstDt"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!--화학물질명(국문)  -->
              <y-text
                :width="8"
                :required="true"
                :editable="editable"
                :disabled="true"
                ui="bootstrap"
                label="L0000003304"
                name="chemProdNmKr"
                v-model="matCheckRequest.chemProdNmKr"
                :appendIcon="[
                  { icon: 'search', callbackName: 'searchChemprod' },
                ]"
                @searchChemprod="searchChemprod"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 화학물질명(영문) -->
              <y-text
                :width="8"
                :required="true"
                :editable="editable"
                :disabled="true"
                ui="bootstrap"
                label="L0000003305"
                name="chemProdNmEn"
                v-model="matCheckRequest.chemProdNmEn"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 공급업체국가 -->
              <y-text
                :width="8"
                :required="true"
                :editable="editable"
                :disabled="true"
                ui="bootstrap"
                label="L0000005476"
                name="originNmKr"
                v-model="matCheckRequest.originNmKr"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 공급업체 -->
              <y-text
                :width="8"
                :required="true"
                :editable="editable"
                :disabled="true"
                ui="bootstrap"
                label="L0000000496"
                name="vendorNm"
                v-model="matCheckRequest.vendorNm"
                :appendIcon="[{ icon: 'search', callbackName: 'searchVendor' }]"
                @searchVendor="searchVendor('V')"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!--제조업체국가  -->
              <y-text
                :width="8"
                :required="true"
                :editable="editable"
                :disabled="true"
                ui="bootstrap"
                label="L0000002631"
                name="makeOriginNmKr"
                v-model="matCheckRequest.makeOriginNmKr"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!--  -->
              <y-text
                :width="8"
                :required="true"
                :editable="editable"
                :disabled="true"
                ui="bootstrap"
                label="L0000002627"
                name="makecpNm"
                v-model="matCheckRequest.makecpNm"
                :appendIcon="[{ icon: 'search', callbackName: 'searchVendor' }]"
                @searchVendor="searchVendor('M')"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 요청구분 -->
              <y-radio
                :width="8"
                :editable="editable"
                :required="true"
                :comboItems="rqstTypeItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                name="rqstType"
                label="L0000002050"
                v-model="matCheckRequest.rqstType"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!--성상  -->
              <y-select
                :width="8"
                :editable="editable"
                :comboItems="propertyItems"
                :required="true"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                type="search"
                label="L0000001635"
                name="property"
                v-model="matCheckRequest.property"
                v-validate="'required'"
                :state="validateState('property')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 물질구성 -->
              <y-switch
                :width="8"
                :editable="editable"
                true-value="Y"
                false-value="N"
                ui="bootstrap"
                label="L0000001053"
                name="mixYn"
                selectText="복합"
                unselectText="단일"
                v-model="matCheckRequest.mixYn"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 사업구분 -->
              <y-select
                :width="8"
                :editable="editable"
                :comboItems="bizCatItems"
                :required="true"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                type="search"
                label="L0000001413"
                name="bizCatCd"
                v-model="matCheckRequest.bizCatCd"
                v-validate="'required'"
                :state="validateState('bizCatCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 제품구분 -->
              <y-select
                :width="8"
                :editable="editable"
                :comboItems="prodCatItems"
                :required="true"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                type="search"
                label="L0000002637"
                name="prodCatCd"
                v-model="matCheckRequest.prodCatCd"
                v-validate="'required'"
                :state="validateState('prodCatCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!--용도  -->
              <y-select
                :width="8"
                :editable="editable"
                :comboItems="usageItems"
                :required="true"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                type="search"
                label="L0000002059"
                name="usageCd"
                v-model="matCheckRequest.usageCd"
                v-validate="'required'"
                :state="validateState('usageCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!--용도(기타)  -->
              <y-text
                :width="8"
                :editable="editable"
                :maxlength="60"
                ui="bootstrap"
                label="L0000002060"
                name="usageEtc"
                v-model="matCheckRequest.usageEtc"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!--비중  -->
              <y-text
                :width="8"
                :editable="editable"
                :maxlength="3"
                ui="bootstrap"
                label="L0000001374"
                name="specificGravity"
                v-model="matCheckRequest.specificGravity"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- HS번호 -->
              <y-text
                :width="8"
                :editable="editable"
                :maxlength="30"
                ui="bootstrap"
                label="L0000000118"
                name="hsNum"
                v-model="matCheckRequest.hsNum"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!--연간예정량  -->
              <y-number
                :width="8"
                :editable="editable"
                :maxlength="10"
                :hasSeperator="false"
                :pointNumber="2"
                ui="bootstrap"
                label="L0000001981"
                name="expectAmt"
                v-model="matCheckRequest.expectAmt"
              ></y-number>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <!-- 제품분류 -->
              <y-checkbox
                :width="10"
                :editable="editable"
                :comboItems="prodClassItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                name="prodClass"
                label="L0000002640"
                v-model="matCheckRequest.prodClass"
              />
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <!-- 검토요청사항 -->
              <y-textarea
                :width="10"
                :editable="editable"
                :maxlength="300"
                ui="bootstrap"
                label="L0000000385"
                name="chkRqstDesc"
                v-model="matCheckRequest.chkRqstDesc"
              ></y-textarea>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <!-- 비고 -->
              <y-textarea
                :width="10"
                :editable="editable"
                :maxlength="300"
                ui="bootstrap"
                label="L0000001360"
                name="remark"
                v-model="matCheckRequest.remark"
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
  name: 'y-matCheckRequest-info',
  props: {
    matChkRqstNo: 0,
  },
  data: () => ({
    matCheckRequest: {
      chkRqsterId: '',
      chkRqsterNm: '',
      deptNm: '',
      rqstDt: '',
      chemProdNo: 0,
      chemProdNmKr: '',
      chemProdNmEn: '',
      originNmKr: '',
      originCd: '',
      vendorNm: '',
      vendorCd: '',
      makeOriginNmKr: '',
      makeoriginCd: '',
      makecpNm: '',
      makecpCd: '',
      rqstType: null,
      property: null,
      mixYn: 'N',
      bizCatCd: null,
      prodCatCd: null,
      usageCd: null,
      usageEtc: '',
      specificGravity: '',
      hsNum: '',
      expectAmt: 0,
      chkRqstDesc: '',
      remark: '',
      makeYn: '',
      impYn: '',
      buyYn: '',
      salesYn: '',
      usingYn: '',
      expYn: '',
      prodClass: [],
    },
    editable: false,
    updateMode: false,
    isSave: false,
    propertyItems: [],
    bizCatItems: [],
    prodClassItems: [],
    usageItems: [],
    prodCatItems: [],
    rqstTypeItems: [],
    popupOptions: {
      target: null,
      title: '',
      visible: false,
      width: '80%',
      top: '50px',
      param: {},
      closeCallback: null,
    },
    selectedValue: [],
    searchDetailUrl: '',
    saveUrl: '',
    checkUrl: '',
    actionType: 'POST',
  }),
  watch: {
    // 해당 tab 들어올 때마다 그리드 사이즈 조정
    paneName(val) {
      // this.setGridSize();
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
      this.searchDetailUrl = selectConfig.chm.matCheckRequest.get.url;
      this.checkUrl = selectConfig.chm.matCheckRequest.check.url;
      this.saveUrl = transactionConfig.chm.matCheckRequest.insert.url;

      this.prodClassItems = [
        {
          code: 'make',
          codeNm: this.$comm.getLangSpecInfoLabel('L0000002624'),
        }, // '제조'
        { code: 'imp', codeNm: this.$comm.getLangSpecInfoLabel('L0000001695') }, // '수입'
        { code: 'buy', codeNm: this.$comm.getLangSpecInfoLabel('L0000000684') }, // '구매'
        {
          code: 'using',
          codeNm: this.$comm.getLangSpecInfoLabel('L0000001440'),
        }, // '사용'
        {
          code: 'sales',
          codeNm: this.$comm.getLangSpecInfoLabel('L0000001705'),
        }, // '수출'
        { code: 'exp', codeNm: this.$comm.getLangSpecInfoLabel('L0000003034') }, // '판매'
      ];

      this.getComboItems('RSA_PROPERTIES'); // 성상
      this.getComboItems('CHM_BIZ_CAT'); // 사업구분
      this.getComboItems('CHM_PROD_CAT'); // 제품구분
      this.getComboItems('CHM_USAGE'); // 용도
      this.getComboItems('CHM_MCR_CLS'); // 진행상태

      this.getDetail(); // 물질검토 상세 검색
    },
    /**
     * 공통 마스터 정보 조회 (성상, 사업구분, 제품구분, 용도, 성분확인방법)
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
          if (codeGroupCd === 'RSA_PROPERTIES') {
            this.propertyItems = this.$_.clone(_result.data);
            this.propertyItems.splice(0, 0, {
              code: null,
              codeNm: this.$comm.getLangSpecInfoLabel('L0000003394'), // 선택하세요
            });
          } else if (codeGroupCd === 'CHM_BIZ_CAT') {
            this.bizCatItems = this.$_.clone(_result.data);
            this.bizCatItems.splice(0, 0, {
              code: null,
              codeNm: this.$comm.getLangSpecInfoLabel('L0000003394'), // 선택하세요
            });
          } else if (codeGroupCd === 'CHM_PROD_CAT') {
            this.prodCatItems = this.$_.clone(_result.data);
            this.prodCatItems.splice(0, 0, {
              code: null,
              codeNm: this.$comm.getLangSpecInfoLabel('L0000003394'), // 선택하세요
            });
          } else if (codeGroupCd === 'CHM_USAGE') {
            this.usageItems = this.$_.clone(_result.data);
            this.usageItems.splice(0, 0, {
              code: null,
              codeNm: this.$comm.getLangSpecInfoLabel('L0000003394'), // 선택하세요
            });
          } else if (codeGroupCd === 'CHM_MCR_CLS') {
            this.rqstTypeItems = this.$_.clone(_result.data);
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /** 물질검토 상세 검색 **/
    getDetail() {
      if (!this.matChkRqstNo || this.matChkRqstNo === 0) {
        this.matCheckRequest.chkRqsterId = this.$store.getters.token;
        this.matCheckRequest.chkRqsterNm = this.$store.getters.name;
        this.matCheckRequest.deptNm = this.$store.getters.deptNm;
        this.matCheckRequest.rqstDt = this.$comm.getToday();
      } else {
        this.$http.url = this.$format(this.searchDetailUrl, this.matChkRqstNo);
        this.$http.type = 'GET';
        this.$http.request(
          (_result) => {
            this.matCheckRequest = this.$_.clone(_result.data);

            this.matCheckRequest.prodClass = [];
            if (this.matCheckRequest.makeYn === 'Y') {
              this.matCheckRequest.prodClass.push('make');
            }

            if (this.matCheckRequest.impYn === 'Y') {
              this.matCheckRequest.prodClass.push('imp');
            }

            if (this.matCheckRequest.buyYn === 'Y') {
              this.matCheckRequest.prodClass.push('buy');
            }

            if (this.matCheckRequest.salesYn === 'Y') {
              this.matCheckRequest.prodClass.push('sales');
            }

            if (this.matCheckRequest.usingYn === 'Y') {
              this.matCheckRequest.prodClass.push('using');
            }

            if (this.matCheckRequest.expYn === 'Y') {
              this.matCheckRequest.prodClass.push('exp');
            }
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      }
    },
    alertMessage() {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395' /* 안내 */,
        message: 'M0000000101', // '이미 같은 이름의 화학물질이 있습니다.',
        type: 'warning',
      });
    },
    check(gubun) {
      this.$validator
        .validateAll()
        .then((result) => {
          if (result) {
            this.$http.url = this.checkUrl;
            this.$http.type = 'GET';
            this.$http.param = {
              chemProdNmKr: this.chemprod.chemProdNmKr,
              chemProdNmEn: this.chemprod.chemProdNmEn,
              chemProdNo: gubun === 'insert' ? 0 : this.chemprodNo,
            };
            this.$http.request(
              (_result) => {
                var gubunList = this.$_.map(
                  this.$_.clone(_result.data),
                  'gubun'
                );
                var cntList = this.$_.map(this.$_.clone(_result.data), 'cnt');
                var chemprodNmKrIndex = this.$_.indexOf(
                  gubunList,
                  'chem_prod_nm_kr_count'
                );
                var chemprodNmEnIndex = this.$_.indexOf(
                  gubunList,
                  'chem_prod_nm_en_count'
                );

                if (
                  cntList[chemprodNmKrIndex] > 0 ||
                  cntList[chemprodNmEnIndex] > 0
                ) {
                  this.alertMessage();
                  return;
                } else {
                  window.getApp.$emit('CONFIRM', {
                    title: 'L0000003321' /* 확인 */,
                    message:
                      gubun === 'edit'
                        ? 'M0000000060' // 수정하시겠습니까?
                        : 'M0000000105', // 등록하시겠습니까?
                    // TODO : 필요시 추가하세요.
                    type: 'info', // success / info / warning / error
                    // 확인 callback 함수
                    confirmCallback: () => {
                      this.chemprod.createUserId = this.$store.getters.token;
                      this.chemprod.updateUserId = this.$store.getters.token;
                      this.chemprod.makeYn =
                        this.$_.indexOf(this.chemprod.prodClass, 'make') !== -1
                          ? 'Y'
                          : 'N';
                      this.chemprod.impYn =
                        this.$_.indexOf(this.chemprod.prodClass, 'imp') !== -1
                          ? 'Y'
                          : 'N';
                      this.chemprod.buyYn =
                        this.$_.indexOf(this.chemprod.prodClass, 'buy') !== -1
                          ? 'Y'
                          : 'N';
                      this.chemprod.salesYn =
                        this.$_.indexOf(this.chemprod.prodClass, 'sales') !== -1
                          ? 'Y'
                          : 'N';
                      this.chemprod.usingYn =
                        this.$_.indexOf(this.chemprod.prodClass, 'using') !== -1
                          ? 'Y'
                          : 'N';
                      this.chemprod.expYn =
                        this.$_.indexOf(this.chemprod.prodClass, 'exp') !== -1
                          ? 'Y'
                          : 'N';

                      this.isSave = true;
                    },
                    // 취소 callback 함수
                    cancelCallback: () => {
                      this.isSave = false;
                    },
                  });
                }
              },
              (_error) => {
                window.getApp.$emit('APP_REQUEST_ERROR', _error);
              }
            );
          } else if (!result) {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395' /* 안내 */,
              message: 'M0000001226', // '필수입력값을 입력해주세요.',
              type: 'warning',
            });
          }
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000004' // '유효성 검사도중 에러가 발생하였습니다.'
          );
          this.isSave = false;
        });
    },
    /** 신규등록 하기전 UI단 유효성 검사 **/
    beforeSave() {
      var gubun = '';
      // 신규등록
      if (this.matChkRqstNo === 0) {
        gubun = 'insert';
        this.saveUrl = transactionConfig.chm.matCheckRequest.insert.url;
        this.actionType = 'POST';
      }
      // 수정
      else {
        gubun = 'edit';
        this.saveUrl = transactionConfig.chm.matCheckRequest.edit.url;
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
      this.chemprod.chemProdNo = _result.data;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395' /* 안내 */,
        message: 'M0000000006', // '저장되었습니다.',
        type: 'success', // success / info / warning / error
      });
      this.isSave = false;
      this.closePopup();
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
      this.popupOptions.title = 'L0000003285'; // 화학물질
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
        this.matCheckRequest.chemProdNmKr = data.data.chemProdNmKr;
        this.matCheckRequest.chemProdNmEn = data.data.chemProdNmEn;
        this.matCheckRequest.chemProdNo = data.data.chemProdNo;

        this.matCheckRequest.property = data.data.property; // 성상
        this.matCheckRequest.propertyNm = data.data.propertyNm; // 성상명
        this.matCheckRequest.usageCd = data.data.usageCd; // 주요용도
        this.matCheckRequest.usageNm = data.data.usageNm; // 주요용도명
      }
    },
    searchVendor(gubun) {
      this.popupOptions.target = () =>
        import(`${'../../vendor/baseInfo/vendorMaster.vue'}`);
      this.popupOptions.title = 'L0000001951'; // 업체
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        popupMode: true,
        gubun: gubun,
      };
      this.popupOptions.closeCallback = this.closeVendorPopup;
    },
    closeVendorPopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      if (data.data !== 'C') {
        if (data.gubun === 'V') {
          this.matCheckRequest.vendorNm = data.data.vendorNm;
          this.matCheckRequest.vendorCd = data.data.vendorCd;
          this.matCheckRequest.originNmKr = data.data.originNmKr;
          this.matCheckRequest.originCd = data.data.originCd;
        } else {
          this.matCheckRequest.makecpNm = data.data.vendorNm;
          this.matCheckRequest.makecpCd = data.data.vendorCd;
          this.matCheckRequest.makeOriginNmKr = data.data.originNmKr;
          this.matCheckRequest.makeoriginCd = data.data.originCd;
        }
      }
    },
    /** end button 관련 이벤트 **/
  },
};
</script>
