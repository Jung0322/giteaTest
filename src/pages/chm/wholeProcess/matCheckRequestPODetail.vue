<!--
  목적 : 물질관리 > 전과정관리 > 물질검토 > 물질검토 상세
  Detail :  물질검토에 대한 상세정보를 보여준다.
  *
  신규등록인 경우 자재번호의 자재는 sap의 자재 선택가능.<style scoped>
  검토요청이 들어온 건에 대해서는 자재번호의 선택은 불가능. 
  </style>
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row ref="editBox">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <y-label
              label="자재검토"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <y-btn
                :action-url="saveUrl"
                :param="matCheckRequest"
                :is-submit="isSave"
                title="저장"
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
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <y-datepicker
                :width="8"
                :disabled="true"
                type="rqstDt"
                label="검토요청일"
                :default="matCheckRequest.rqstDt"
                v-model="matCheckRequest.rqstDt"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <y-text
                :width="8"
                :required="true"
                ui="bootstrap"
                label="자재번호"
                name="sapMatCd"
                v-model="matCheckRequest.sapMatCd"
                v-validate="'required'"
                :state="validateState('sapMatCd')"
              ></y-text>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <b-row>
                <b-col sm="8" md="8" lg="8" xl="8" class="col-xxl-8">
                  <y-text
                    :width="9"
                    :disabled="true"
                    ui="bootstrap"
                    label="납품업체/국가"
                    name="vendorNm"
                    v-model="matCheckRequest.vendorNm"
                  ></y-text>
                </b-col>
                <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
                  <y-text
                    :width="12"
                    :required="true"
                    :disabled="true"
                    ui="bootstrap"
                    name="originNmKr"
                    v-model="matCheckRequest.originNmKr"
                  ></y-text>
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <y-text
                :width="8"
                ui="bootstrap"
                label="화학물질명(국문)"
                name="chemProdNmKr"
                v-model="matCheckRequest.chemProdNmKr"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <y-text
                :width="8"
                :maxlength="30"
                ui="bootstrap"
                label="HS번호"
                name="hsNum"
                v-model="matCheckRequest.hsNum"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <y-text
                :width="8"
                :disabled="true"
                ui="bootstrap"
                label="위험물질"
                name="chemprodRegulItmNm"
                v-model="matCheckRequest.chemprodRegulItmNm"
                :appendIcon="[
                  { icon: 'search', callbackName: 'searchMatStrg' },
                ]"
                @searchMatStrg="searchMatStrg"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <y-select
                :width="8"
                :comboItems="propertyItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                type="search"
                label="성상"
                name="property"
                v-model="matCheckRequest.property"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <y-text
                :width="8"
                :maxlength="3"
                ui="bootstrap"
                label="비중"
                name="specificGravity"
                v-model="matCheckRequest.specificGravity"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <y-switch
                :width="8"
                true-value="Y"
                false-value="N"
                ui="bootstrap"
                label="물질구성"
                name="mixYn"
                selectText="복합"
                unselectText="단일"
                v-model="matCheckRequest.mixYn"
              />
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <y-textarea
                :width="10"
                :maxlength="300"
                ui="bootstrap"
                label="검토요청사항"
                name="chkRqstDesc"
                v-model="matCheckRequest.chkRqstDesc"
              ></y-textarea>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <y-textarea
                :width="10"
                :maxlength="300"
                ui="bootstrap"
                label="비고"
                name="etcDesc"
                v-model="matCheckRequest.etcDesc"
              ></y-textarea>
            </b-col>
            <el-divider content-position="left">첨부파일</el-divider>
            <component
              :is="attach"
              v-if="attach"
              :submitCheck="submitCheck"
              :attachFileGrps="attachFileGrps"
              :saveAttachFiles="saveAttachFiles"
              @changeUploadFiles="changeUploadFiles"
              @setTempDeleteFiles="setTempDeleteFiles"
              @setUploadedList="setUploadedList"
              @closePopup="closePopup"
            />
          </b-row>
        </b-card>
      </b-col>
    </b-row>
    <b-row class="mt-1">
      <b-col>
        <div slot="buttonGroup" class="float-right mb-1">
          <y-btn
            title="저장"
            color="orange"
            @btnClicked="beforeSave"
            @btnClickedErrorCallback="btnClickedErrorCallback"
          />
        </div>
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
  name: 'y-matCheckRequest-po-detail',
  components: {},
  props: {},
  // TODO: 화살표 함수(=>)는 data에 사용하지 말 것
  //    data: () => { return { a: this.myProp }}) 화살표 함수가 부모 컨텍스트를 바인딩하기 때문에 this는 예상과 달리 Vue 인스턴스가 아니며, this.myProp는 정의되지 않습니다.
  //    참고url: https://kr.vuejs.org/v2/api/index.html#data
  data: function () {
    return {
      matCheckRequest: {
        matChkRqstNo: 0,
        chkRqstState: '',
        chkRqsterId: '',
        chkRqsterNm: '',
        deptNm: '',
        rqstDt: '',
        sapMatCd: '', // SAP 자재코드
        sapIfCd: '', // 구매검토요청시 I/F키코드
        chemProdNo: 0, // 안씀 (sapMatCd로 변경)
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
        etcDesc: '',
        makeYn: '',
        impYn: '',
        buyYn: '',
        salesYn: '',
        usingYn: '',
        expYn: '',
        stckArea: '', // 보관장소
        airPolYn: '', // 대기오염물질
        wtrPolYn: '', // 수질오염물질
        licensingYn: '', // 인허가대상물질여부
        dgrYn: '', // 위험물질여무
        chemprodRegulItmNo: 0,
        chemprodRegulItmNm: '',
        chkResult: '', // 안전/보건 검토결과
        chkResultYn: '', // 안전/보건 검토결과 적합여부
        chkResultFinYn: '', // 안전/보건 검토결과 완료여부
        chkResultFinUserId: '', // 안전/보건 검토결과 완료처리자 아이디
        chkResultFinUserNm: '', // 안전/보건 검토결과 완료처리자
        chkResultFinDt: '', // 안전/보건 검토결과 완료처리일
        chkResultEnv: '', // 환경 검토결과
        chkResultEnvYn: '', // 환경 검토결과 적합여부
        chkResultEnvFinYn: '', // 환경 검토결과 완료여부
        chkResultEnvFinUserId: '', // 환경 검토결과 완료처리자 아이디
        chkResultEnvFinUserNm: '', // 환경 검토결과 완료처리자
        chkResultEnvFinDt: '', // 환경 검토결과 완료처리일
        chkResultHea: '', // 안씀.
        prodClass: [], // 제품분류
        pols: [], // 대기/수질여부
        matCheckRequestCompoRegul: null,
        plantCd: '',
        chkDt: null,
        reviewerId: '',
        matRqAttCd: 'VEN',
      },
      saveData: {
        matChkRqstNo: 0,
        matCheckRequestCompos: [],
        regulItmMatVals: [],
        createUserId: '',
        updateUserId: '',
      },
      changeChemProd: false,
      editable: false,
      disabled: false,
      isSave: false,
      isAppr: false,
      isReject: false,
      propertyItems: [],
      bizCatItems: [],
      prodClassItems: [],
      polItems: [], // 대기/수질여부
      usageItems: [],
      prodCatItems: [],
      rqstTypeItems: [],
      chemprodRegulItems: [],
      apprBtnTitle: '자재검토요청',
      selectedValue: [],
      searchDetailUrl: '',
      searchRegulUrl: '',
      saveUrl: '',
      checkUrl: '',
      actionType: 'POST',
      // TODO : 현재까지 파악된 바로는 tab은 같은 폴더 또는 하위 폴더의 컴포넌트만 접근이 가능한 것으로 파악됨
      //                즉, 반드시 메인페이지 역할을 하는 vue와 동일 폴더나 하위 폴더에 tabItem 역할을 하는 vue 파일을 위치 시킬 것
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '80%',
        top: '50px',
        param: {},
        closeCallback: null,
      },
      attach: null,
      submitCheck: false,
      saveAttachFiles: [],
      tempDeleteFiles: [],
      attachFileGrps: [],
      uploadedMsdsList: [], // 업로드된 msds
      uploadedIngredientList: [], // 업로드된 성분내역서
      paneName: '',
      loading: {
        loadingInstance: null,
        passCount: 0,
      },
    };
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {
    window.getApp = this;
  },
  beforeMount() {
    this.$on('LOADING_PASS_COUNT', this.setLoadingPassCount);
    this.$on('LOADING_SHOW', this.loadingShow);
    this.$on('LOADING_HIDE', this.loadingHide);
    this.$on('CONFIRM', this.confirm);
    this.$on('ALERT', this.alert);
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
      this.searchRegulUrl = selectConfig.chm.chemicalRegulItem.list.url;

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

      this.polItems = [
        { code: 'air', codeNm: this.$comm.getLangSpecInfoLabel('L0000000910') }, // 대기오염물질
        { code: 'wtr', codeNm: this.$comm.getLangSpecInfoLabel('L0000001703') }, // 수질오염물질
      ];

      this.getChemprodRegulItems(); // 위험물질
      this.getComboItems('RSA_PROPERTIES'); // 성상
      this.getComboItems('CHM_BIZ_CAT'); // 사업구분
      this.getComboItems('CHM_PROD_CAT'); // 제품구분
      this.getComboItems('CHM_USAGE'); // 용도
      this.getComboItems('CHM_MCR_CLS'); // 진행상태

      this.attach = () => import('@/pages/common/attachFile/multiFileUpload');

      this.setAttachFileGrps(); // 첨부파일 셋팅

      this.getDetail(); // 물질검토 상세 검색
    },
    setLoadingPassCount(_count) {
      this.loading.passCount = _count;
    },
    loadingShow(_option) {
      if (this.loading.passCount === 0) {
        this.loading.loadingInstance = this.$loading({
          lock: true,
          text: 'L0000005478', // 'Loading...',
          background: 'rgba(0, 0, 0, 0.7)',
        });
      } else this.loading.passCount--;
    },
    loadingHide(_result) {
      this.$nextTick(() => {
        this.loading.loadingInstance.close();
      });
    },
    requestSuccess(_message) {
      if (!_message) return;
      this.alert({
        title: 'L0000003395' /* 안내 */,
        message: _message,
        type: 'success',
      });
    },
    requestError(_message) {
      if (!_message) return;
      this.alert({
        title: 'L0000003396', // '에러',
        message: _message,
        type: 'error',
      });
    },
    confirm(_option) {
      var type = '';
      if (_option.hasOwnProperty('type')) type = _option.type;
      this.$confirm(_option.message, _option.title, {
        confirmButtonText: 'L0000003321', // '확인',
        cancelButtonText: 'L0000002920', // '취소',
        type: type,
      })
        .then(
          typeof _option.confirmCallback === 'function'
            ? _option.confirmCallback
            : null
        )
        .catch(
          typeof _option.cancelCallback === 'function'
            ? _option.cancelCallback
            : null
        );
    },
    /**
     * window.alert 대체 함수
     */
    alert(_option) {
      var type = '';
      if (_option.hasOwnProperty('type')) type = _option.type;
      this.$alert(_option.message, _option.title, {
        confirmButtonText: 'L0000003321', // '확인',
        type: type,
        callback:
          typeof _option.callback === 'function'
            ? _option.callback
            : this.dummyCallback,
      });
    },
    getChemprodRegulItems() {
      this.$http.url = this.searchRegulUrl;
      this.$http.type = 'GET';
      this.$http.param = {
        regulLawCd: 'RL004',
        useYn: 'Y',
      };
      this.$http.request(
        (_result) => {
          _result.data.splice(0, 0, {
            regulItmNo: 0,
            regulItmNm: this.$comm.getLangSpecInfoLabel('L0000003394'), // 선택하세요
          });
          this.chemprodRegulItems = _result.data;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
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
      this.matCheckRequest.rqstDt = this.$comm.getToday();
    },
    setAttachFileGrps() {
      let taskKey = '';
      this.attachFileGrps = [
        {
          label: '<span class="text-danger">MSDS(필수)</span>',
          listType: 'text',
          drag: false,
          // showFileSearch: !this.editable,
          showFileSearch: !this.disabled,
          editable: this.editable && !this.disabled,
          disabled: this.disabled,
          limit: 1,
          multiple: false,
          uploadTempFiles: null,
          taskClassNm: 'MAT_MSDS',
          taskKey: taskKey,
          taskFlag: '',
          createUserId: this.$store.getters.token,
        },
        {
          label: 'L0000003293', // '화학물질 성분내역서',
          listType: 'text',
          drag: false,
          showFileSearch: !this.disabled,
          editable: this.editable && !this.disabled,
          disabled: this.disabled,
          limit: 1,
          multiple: false,
          uploadTempFiles: null,
          taskClassNm: 'CHEM_INGREDIENT_STATEMENT',
          taskKey: taskKey,
          taskFlag: '',
          createUserId: this.$store.getters.token,
        },
        {
          label: 'L0000003294', // '화학물질 확인내역서',
          listType: 'text',
          drag: false,
          showFileSearch: !this.disabled,
          editable: this.editable && !this.disabled,
          disabled: this.disabled,
          limit: 1,
          multiple: false,
          uploadTempFiles: null,
          taskClassNm: 'CHEM_CONFIRMATION_STATEMENT',
          taskKey: taskKey,
          taskFlag: '',
          createUserId: this.$store.getters.token,
        },
        {
          label: 'L0000001636', // '성적서',
          listType: 'text',
          drag: false,
          showFileSearch: !this.disabled,
          editable: this.editable && !this.disabled,
          disabled: this.disabled,
          limit: 1,
          multiple: false,
          uploadTempFiles: null,
          taskClassNm: 'MAT_REPORTS',
          taskKey: taskKey,
          taskFlag: '',
          createUserId: this.$store.getters.token,
        },
        {
          label: 'L0000000794', // '기타',
          listType: 'text',
          drag: false,
          showFileSearch: !this.disabled,
          editable: this.editable && !this.disabled,
          disabled: this.disabled,
          limit: 3,
          multiple: true,
          uploadTempFiles: null,
          taskClassNm: 'MAT_ETC',
          taskKey: taskKey,
          taskFlag: '',
          createUserId: this.$store.getters.token,
        },
      ];
    },
    alertMessage() {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395' /* 안내 */,
        message: 'L0000005479', // '이미 같은 이름의 화학물질이 있습니다.',
        type: 'warning',
      });
    },
    check(gubun) {
      this.$validator
        .validateAll()
        .then((result) => {
          if (result) {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321', // '확인',
              message:
                gubun === 'appr'
                  ? this.apprBtnTitle + 'L0000004842' // 하시겠습니까?
                  : 'M0000000011', // 저장하시겠습니까?
              // TODO : 필요시 추가하세요.
              type: 'info', // success / info / warning / error
              // 확인 callback 함수
              confirmCallback: () => {
                this.matCheckRequest.createUserId = this.$store.getters.token;
                this.matCheckRequest.updateUserId = this.$store.getters.token;
                this.matCheckRequest.makeYn =
                  this.$_.indexOf(this.matCheckRequest.prodClass, 'make') !== -1
                    ? 'Y'
                    : 'N';
                this.matCheckRequest.impYn =
                  this.$_.indexOf(this.matCheckRequest.prodClass, 'imp') !== -1
                    ? 'Y'
                    : 'N';
                this.matCheckRequest.buyYn =
                  this.$_.indexOf(this.matCheckRequest.prodClass, 'buy') !== -1
                    ? 'Y'
                    : 'N';
                this.matCheckRequest.salesYn =
                  this.$_.indexOf(this.matCheckRequest.prodClass, 'sales') !==
                  -1
                    ? 'Y'
                    : 'N';
                this.matCheckRequest.usingYn =
                  this.$_.indexOf(this.matCheckRequest.prodClass, 'using') !==
                  -1
                    ? 'Y'
                    : 'N';
                this.matCheckRequest.expYn =
                  this.$_.indexOf(this.matCheckRequest.prodClass, 'exp') !== -1
                    ? 'Y'
                    : 'N';

                this.matCheckRequest.airPolYn =
                  this.$_.indexOf(this.matCheckRequest.pols, 'air') !== -1
                    ? 'Y'
                    : 'N';

                this.matCheckRequest.wtrPolYn =
                  this.$_.indexOf(this.matCheckRequest.pols, 'wtr') !== -1
                    ? 'Y'
                    : 'N';

                this.saveData.matChkRqstNo = this.matCheckRequest.matChkRqstNo;
                this.saveData.createUserId = this.matCheckRequest.createUserId;
                this.matCheckRequest.matCheckRequestCompoRegul = this.$_.clone(
                  this.saveData
                );

                this.matCheckRequest.chkRqstState =
                  this.popupParam.chkRqstState;
                this.isSave = true;
              },
              // 취소 callback 함수
              cancelCallback: () => {
                this.isSave = false;
                this.isAppr = false;
              },
            });
          } else if (!result) {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395', // 안내
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
          this.isAppr = false;
        });
    },
    /** 신규등록 하기전 UI단 유효성 검사 **/
    beforeSave() {
      // MSDS 첨부 필수
      var itm = null;
      var isMsdsFind = false;
      isMsdsFind = this.uploadedMsdsList.length > 0 ? true : false;
      this.$_.forEach(this.saveAttachFiles, (item) => {
        if (item.taskClassNm === 'MAT_MSDS') {
          isMsdsFind = true;
        }
      });

      if (!isMsdsFind) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'M0000000197', // 'MSDS 파일을 첨부해주세요.',
          type: 'warning',
        });
        return;
      }

      // 구성성분 대표값이 100%가 되지 않은 경우 성분내역서 첨부 필수
      var limitRepvalSum = 0;
      var isIngredientFind = false;

      this.$_.forEach(this.saveData.matCheckRequestCompos, (item) => {
        limitRepvalSum +=
          item.limitRepval === '' ? 0 : Number(item.limitRepval, 10);
      });
      if (limitRepvalSum === 99.99999999999999) {
        limitRepvalSum = 100;
      }
      if (
        this.saveData.matCheckRequestCompos.length > 0 &&
        limitRepvalSum !== 100
      ) {
        isIngredientFind =
          this.uploadedIngredientList.length > 0 ? true : false;
        this.$_.forEach(this.saveAttachFiles, (item) => {
          if (item.taskClassNm === 'CHEM_INGREDIENT_STATEMENT') {
            isIngredientFind = true;
          }
        });
        if (!isIngredientFind) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395' /* 안내 */,
            message: 'M0000000198', // '성분 대표값의 합이 100%가 아닌 경우, 성분내역서를 첨부하셔야 합니다.',
            type: 'warning',
          });
          return;
        }
      }

      var gubun = '';
      // 신규등록
      gubun = 'insert';
      this.saveUrl = transactionConfig.chm.matCheckRequest.insert.url;
      this.actionType = 'POST';

      this.check(gubun);
    },
    validateState(ref) {
      if (
        this.veeBag[ref] &&
        (this.veeBag[ref].dirty || this.veeBag[ref].validated)
      ) {
        return !this.errors.has(ref);
      }
      return null;
    },
    btnSaveClickedCallback(_result) {
      alert('저장되었습니다.');
      this.saveAttach();
    },
    saveAttach() {
      // task_key 를 셋팅한다.
      this.$_.forEach(this.attachFileGrps, (item) => {
        item.taskKey = this.matCheckRequest.matChkRqstNo;
      });

      if (this.tempDeleteFiles.length > 0) {
        this.$http.url = transactionConfig.attachFile.deleteMulti.url;
        this.$http.type = 'DELETE';
        this.$http.param = {
          data: Object.values(this.$_.clone(this.tempDeleteFiles)),
        };
        this.$http.request(
          (_result) => {
            this.tempDeleteFiles = [];
            // 저장할 데이터가 있는 경우
            if (this.saveAttachFiles.length > 0) {
              this.submitCheck = !this.submitCheck;
            }
            // 저장할 데이터가 없는 경우
            else {
              // this.closePopup();
            }
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      } else {
        // 저장할 데이터가 있는 경우
        if (this.saveAttachFiles.length > 0) {
          this.submitCheck = !this.submitCheck;
        }
        // 저장할 데이터가 없는 경우
        else {
          // this.closePopup();
        }
      }
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
    closePopup2() {},
    /** end button 관련 이벤트 **/
    changeUploadFiles(data) {
      var index = this.$_.findIndex(this.attachFileGrps, {
        taskClassNm: data.taskClassNm,
      });
      // 인덱스를 재배치해야 함. 저장오류발생.
      if (index > -1) {
        data.index = index;
        this.attachFileGrps[index].uploadTempFiles = data;

        // 업로드 하기 위해 올라온 파일들을 저장하는 부분
        // 기존에 들어가 있는 경우에는 덮어쓰고 아닌 경우에는 신규로 넣는다.
        let saveIndex = this.$_.findIndex(this.saveAttachFiles, {
          taskClassNm: data.taskClassNm,
        });
        if (saveIndex > -1) {
          this.saveAttachFiles[saveIndex] = this.$_.clone(
            this.attachFileGrps[index]
          );
        } else {
          this.saveAttachFiles.push(this.$_.clone(this.attachFileGrps[index]));
        }
      }
    },
    setTempDeleteFiles(data) {
      var pushData = {
        fileNo: data.data.fileNo,
      };
      this.tempDeleteFiles.push(pushData);
    },
    setUploadedList(data) {
      if (data.taskClassNm === 'MAT_MSDS') {
        this.uploadedMsdsList = [];
        this.$_.forEach(data.data, (_item) => {
          this.uploadedMsdsList.push({
            fileNo: _item.fileNo,
          });
        });
      } else if (data.taskClassNm === 'CHEM_INGREDIENT_STATEMENT') {
        this.uploadedIngredientList = [];
        this.$_.forEach(data.data, (_item) => {
          this.uploadedIngredientList.push({
            fileNo: _item.fileNo,
          });
        });
      }
    },
    setChangeChemProd() {
      this.changeChemProd = false;
    },
    searchMatStrg() {
      this.popupOptions.target = () => import(`${'../mat/chmDgrAttAmt.vue'}`);
      this.popupOptions.title = 'L0000003808'; // 위험물허가량
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        single: true,
      };
      this.popupOptions.closeCallback = this.closeChemPopup;
    },
    closeChemPopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      if (data !== 'CLOSE') {
        this.matCheckRequest.chemprodRegulItmNo = data.chmDgrAttAmtNo;
        this.matCheckRequest.chemprodRegulItmNm = data.dgrNm;
      }
    },
  },
};
</script>
