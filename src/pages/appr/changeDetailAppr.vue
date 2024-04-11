<!--
  목적 : 안전 - 변경관리 상세 (요청, 기술검토, 변경진행)
  Detail : 변경관리 등록/수정 화면
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
            <!-- 변경관리 상세 -->
            <y-label label="L0000001223" icon="user-edit" color-class="cutstom-title-color" />
            <div slot="buttonGroup" class="float-right mb-1">
              <el-tag
                v-if="!change.mocLvlCd && !popupParam.apprFlag"
                size="medium"
                type="danger"
              >
                <i class="el-icon-warning"></i>
                <!-- 등급(검토)를 입력하세요. -->
                {{$comm.getLangSpecInfoLabel('L0000000969')}}
              </el-tag>
              <!-- 저장 -->
              <y-btn
                v-if="!allDisabled && editable && !popupParam.apprFlag"
                :action-url="saveUrl"
                :param="change"
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
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 문서번호 -->
              <y-text
                :width="8"
                :disabled="true"
                :editable="editable"
                ui="bootstrap"
                label="L0000001042"
                name="chngNum"
                v-model="change.chngNum"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-plant
                type="edit"
                :required="true"
                :disabled="disabled"
                :editable="editable"
                name="plantCd"
                v-model="change.plantCd"
                v-validate="'required'"
                :state="validateState('plantCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <b-row>
                <b-col sm="4">
                  <!-- 요청부서 -->
                  <y-label label="L0000002053" />
                </b-col>
                <b-col sm="8">
                  <y-label :label="change.rqstDeptNm" :fieldable="true" />
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <b-row>
                <b-col sm="4">
                  <!-- 요청자 -->
                  <y-label label="L0000002057" />
                </b-col>
                <b-col sm="8">
                  <y-label :label="change.rqstUserNm" :fieldable="true" />
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <b-row>
                <b-col sm="4">
                  <!-- 요청일 -->
                  <y-label label="L0000002055" />
                </b-col>
                <b-col sm="8">
                  <y-label :label="change.rqstDt" :fieldable="true" />
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 변경구분 -->
              <y-select
                :width="8"
                :comboItems="chngAttCdItems"
                :required="true"
                :editable="editable"
                :disabled="disabled"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                name="chngAttCd"
                label="L0000001226"
                v-model="change.chngAttCd"
                v-validate="'required'"
                :state="validateState('chngAttCd')"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 등급(작성) -->
              <y-select
                :width="8"
                :comboItems="lvlWriteCdItems"
                :required="true"
                :editable="editable"
                :disabled="disabled"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                name="prevMocLvlCd"
                label="L0000000970"
                v-model="change.prevMocLvlCd"
                v-validate="'required'"
                :state="validateState('prevMocLvlCd')"
              ></y-select>
            </b-col>
            <b-col
              sm="6"
              md="6"
              lg="6"
              xl="6"
              class="col-xxl-3"
            >
              <!-- 등급(검토) -->
              <y-select
                :width="8"
                :comboItems="lvlConfirmCdItems"
                :editable="editable"
                :disabled="disabled2"
                :warning="(change.chngStepCd==='CGSP1') ? true : false"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                name="mocLvlCd"
                label="L0000000968"
                v-model="change.mocLvlCd"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 위원회개최여부 -->
              <y-switch
                :width="8"
                :editable="editable"
                :disabled="disabled"
                true-value="Y"
                false-value="N"
                ui="bootstrap"
                label="L0000003930"
                name="commiYn"
                selectText="L0000003931"
                unselectText="L0000003932"
                v-model="change.commiYn"
                >
              </y-switch>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <!-- 제목 -->
              <y-text
                :width="10"
                :maxlength="60"
                :required="true"
                :editable="editable"
                :disabled="disabled"
                ui="bootstrap"
                label="L0000002616"
                name="bizNm"
                v-model="change.bizNm"
                v-validate="'required'"
                :state="validateState('bizNm')"
              ></y-text>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
    <b-row class="mt-3"></b-row>
    <el-tabs type="border-card" v-model="tabIndex" @tab-click="tabClick">
      <el-tab-pane
        v-for="(item, i) in tabItems"
        :key="i"
        stretch
        class="default-tab-pane"
        :name="i.toString()"
      >
        <span slot="label">
          <i class="el-icon-date"></i>
          {{$comm.getLangSpecInfoLabel(item.title)}}
        </span>
      </el-tab-pane>
      <keep-alive>
        <component
          :is="component"
          v-if="component"
          :tabIndex.sync="tabIndexParam"
          :tabParam="tabParam"
          :checkItemResult="checkItemResult"
          :disabled="disabled"
          :allDisabled="allDisabled"
          :safChngNo="change.safChngNo"
          :change.sync="change"
          :commi.sync="commi"
          @refCommi="refCommi"
          @refCommiComplete="refCommiComplete"
          @setChangeCommi="setChangeCommi"
          :refWork.sync="refWork"
          @refWorkAttach="refWorkAttach"
          @refWorkAttachComplete="refWorkAttachComplete"
          sm="12"
          :submitObject.sync="submitObject"
          :attachFileGrps.sync="attachFileGrps"
          :saveAttachFiles.sync="saveAttachFiles"
          @changeUploadFiles="changeUploadFiles"
          @changeItemResult="changeItemResult"
        />
      </keep-alive>
    </el-tabs>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  /* attributes: name, components, props, data */
  name: 'y-change-detail-appr',
  props: {
    popupParam: {
      type: Object,
      default: {
        safChngNo: 0, // key
        chngStepCd: '',
        // apprCheck: true,
        // apprCheckMessage: '',
      },
    },
  },
  data: () => ({
    change: {
      safChngNo: 0, // key
      chngStepCd: '',
      chngNum: '', // 문서번호
      plantCd: '', // 사업장
      rqstDeptNm: '', // 요청부서
      rqstUserNm: '', // 요청자
      rqstDeptCd: '', // 요청부서코드
      rqstUserId: '', // 요청자ID
      rqstDt: '', // 요청일
      bizNm: '', // 제목
      chngAttCd: null, // 변경구분
      commiYn: 'N',
      prevMocLvlCd: null, // 등급(작성)
      mocLvlCd: null, // 등급(검토)
      chngContents: '', // 내용
      chngRefLaw: '', // 관련근거법령
      chkOpinion: '', // 팀장의견
      isComplete: 'N',
      createUserId: '',
      createUserNm: '',
      createDt: '',
      updateUserId: '',
      safChngCommiNo: 0,
      changeTypes: [], // 관리구분내역
      chngEffectCds: [], // 입력 기대효과
      changeEffects: [], // 기대효과
      changeCommi: null, // 변경관리위원회
      changeCheckItemResults: [], // 관련업무내역
      changeRefWorks: [], // 관련업무진행사항
      changeElectLaws: [], // 인허가검토
    },
    tabItems: [
      { title: '판정 체크리스트', url: 'changeVerdictReview' }, // 판정 체크리스트
      { title: 'L0000002051', url: 'changeRequestContents' }, // 요청내용
      { title: 'L0000000573', url: 'changeCheckItemResult' }, // 관련업무
      // { title: '인허가검토', url: 'changeElectConfirm' }, // 인허가검토
      { title: 'L0000002843', url: 'multiFileUpload' }, // 첨부파일
    ],
    // 개선조치를 위한 변수
    tabParam: {
      imprClassCd: 'ICL15',
      refTableId: 0,
      editable: true,
      detailCheck: false,
    },
    popupOptions: {
      target: null,
      title: '',
      visible: false,
      param: {},
      width: '90%',
      top: '10px',
      closeCallback: null,
    },
    chngAttCdItems: [], // 변경종류
    lvlWriteCdItems: [], // 등급(작성)
    lvlConfirmCdItems: [], // 등급(검토)

    submitObject: {
      submitCheck: false,
    },
    // object로 해서 속성값을 바꾸지 않으면 해당 탭이 아닌경우 watch에 걸리지 않음으로 인해 이와 같이 설정
    commi: {
      submitCheckCommi: false,
    },
    refWork: {
      submitCheckSafWork: false,
    },
    attachFileGrps: [],
    saveAttachFiles: [],
    tempDeleteFiles: [],

    isAttachCommi: false,
    isAttachCommiComplete: false,

    isAttachRefWork: false,
    isAttachRefWorkComplete: false,

    editable: false,
    disabled: false,
    disabled2: false,
    allDisabled: false,
    isSave: false,
    isConfirm: false,
    tabIndexParam: '',
    component: null,
    tabIndex: 0,
    actionType: 'POST',
    searchDetailUrl: '',
    searchChangNumUrl: '',
    checkUrl: '',
    saveUrl: '',
    deleteUrl: '',
    confirmUrl: '',
    changeClsItems: [],
    checkItemResult: '',
  }),
  computed: {
  },
  watch: {
    tabIndex: function(newValue, oldValue) {
      this.loadComponent();
    },
    isAttachRefWorkComplete: function(newValue, oldValue) {
      if (this.isAttachCommi) {
        this.commi.submitCheckCommi = false;
        this.commi.submitCheckCommi = true;
      }
      // 첨부파일 저장할 데이터가 있는 경우
      else if (this.saveAttachFiles.length > 0) {
        this.submitObject.submitCheck = true;
      }
    },
    isAttachCommiComplete: function(newValue, oldValue) {
      if (this.saveAttachFiles.length > 0) {
        this.submitObject.submitCheck = true;
      }
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

      this.searchDetailUrl = selectConfig.saf.change.get.url;
      this.searchChangNumUrl = selectConfig.saf.change.changNum.url;
      this.saveUrl = transactionConfig.saf.change.insert.url;
      this.deleteUrl = transactionConfig.saf.change.delete.url;
      this.confirmUrl = transactionConfig.saf.change.edit.url;

      this.getDetail(); // 변경관리 상세 조회

      // 변경구분
      this.$comm.getComboItems('SAF_CHNG_ATT', false).then(_result => {
        this.chngAttCdItems = _result;
      });
      // 등급(작성, 검토)
      this.$comm.getComboItems('SAF_MOC_LVL', false).then(_result => {
        this.lvlWriteCdItems = _result;
        this.lvlConfirmCdItems = _result;
      });
    },
    /**
     * 자식 페이지에 넘길 paneName 정보 업데이트
     * tab 클릭시 마다
     * tab : 클릭한 tab 정보
     */
    tabClick(tab) {
      var nowDate = new Date();
      this.tabIndexParam = nowDate.valueOf().toString();
    },
    loadComponent() {
      var path = this.tabItems[this.$_.parseInt(this.tabIndex)].url;
      if (path === 'multiFileUpload') {
        this.component = () =>
          import('@/pages/common/attachFile/multiFileUpload');
      } else if (path === 'imprActTab') {
        this.component = () => import('@/pages/impr/imprActTab');
      } else {
        this.component = () => import(`@/pages/saf/change/${path}`);
      }
    },
    /** 변경관리 상세 검색 **/
    getDetail() {
      if (!this.popupParam.safChngNo || this.popupParam.safChngNo === 0) {
        this.change.rqstDt = this.$comm.getToday();
        this.change.rqstDeptNm = this.$store.getters.deptNm;
        this.change.rqstUserNm = this.$store.getters.name;
        this.change.rqstDeptCd = this.$store.getters.deptCd;
        this.change.rqstUserId = this.$store.getters.token;
        this.setStepByStep('');
        this.setAttachFileGrps(); // 첨부파일 셋팅
        return;
      }
      this.$http.url = this.$format(
        this.searchDetailUrl,
        this.popupParam.safChngNo
      );
      this.$http.type = 'GET';
      this.$http.request(
        _result => {
          this.$_.extend(this.change, _result.data);
          this.$_.forEach(this.change.changeEffects, item => {
            this.change.chngEffectCds.push(item.chngEffectCd);
          });

          // if (this.change.mocLvlCd) {
          //   this.popupParam.apprCheck = true
          //   this.popupParam.apprCheckMessage = ''
          // } else {
          //   this.popupParam.apprCheck = false
          //   this.popupParam.apprCheckMessage = 'M0000000929'
          // }

          this.tabParam.refTableId = this.popupParam.safChngNo;


          this.setStepByStep();
          this.setAttachFileGrps(); // 첨부파일 셋팅
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    setAttachFileGrps() {
      let taskKey = this.popupParam.safChngNo
        ? this.popupParam.safChngNo.toString()
        : '';
      this.attachFileGrps = [
        {
          label: 'L0000003030', // 파일업로드
          uploadTempFiles: null,
          taskClassNm: 'CHANGE',
          taskKey: taskKey,
          drag: !this.allDisabled,
          editable: this.editable,
          disabled: this.allDisabled,
          onlyDownload: this.allDisabled,
          multiple: !this.allDisabled,
          createUserId: this.$store.getters.token,
        },
      ];
    },
    setStepByStep() {
      this.tabItems = [
        { title: '판정 체크리스트', url: 'changeVerdictReview' }, // 판정 체크리스트
        { title: 'L0000002051', url: 'changeRequestContents' }, // 요청내용
        { title: 'L0000000573', url: 'changeCheckItemResult' }, // 관련업무
        // { title: '인허가검토', url: 'changeElectConfirm' }, // 인허가검토
        { title: 'L0000002843', url: 'multiFileUpload' }, // 첨부파일
      ];
      switch (this.change.chngStepCd ? this.change.chngStepCd : this.popupParam.chngStepCd) {
        // 변경요청
        case '':
          break;
        case 'CGSP1':
          break;
        // 기술검토
        case 'CGSPA':
          this.disabled = true;
          this.disabled2 = true;
          this.tabItems = [
            { title: '판정 체크리스트', url: 'changeVerdictReview' }, // 판정 체크리스트
            { title: 'L0000002051', url: 'changeRequestContents' }, // 요청내용
            { title: 'L0000000573', url: 'changeCheckItemResult' }, // 관련업무
            // { title: '인허가검토', url: 'changeElectConfirm' }, // 인허가검토
            { title: 'L0000003599', url: 'changeCommi' }, // 변경관리위원회
            { title: 'L0000002843', url: 'multiFileUpload' }, // 첨부파일
          ];
          this.tabIndex = '4';
          break;
        // 기술진행
        case 'CGSP2':
          this.disabled = true;
          this.disabled2 = true;
          this.tabItems = [
            { title: '판정 체크리스트', url: 'changeVerdictReview' }, // 판정 체크리스트
            { title: 'L0000002051', url: 'changeRequestContents' }, // 요청내용
            { title: 'L0000000573', url: 'changeCheckItemResult' }, // 관련업무
            // { title: '인허가검토', url: 'changeElectConfirm' }, // 인허가검토
            { title: 'L0000003599', url: 'changeCommi' }, // 변경관리위원회
            { title: 'L0000002843', url: 'multiFileUpload' }, // 첨부파일
          ];
          this.tabIndex = '2';
          break;
        // 사후관리
        case 'CGSP3':
          this.tabParam.editable = true;
          this.tabParam.detailCheck = false;
          this.disabled = true;
          this.disabled2 = true;
          this.allDisabled = true;
          this.tabItems = [
            { title: '판정 체크리스트', url: 'changeVerdictReview' }, // 판정 체크리스트
            { title: 'L0000002051', url: 'changeRequestContents' }, // 요청내용
            { title: 'L0000000573', url: 'changeCheckItemResult' }, // 관련업무
            // { title: '인허가검토', url: 'changeElectConfirm' }, // 인허가검토
            { title: 'L0000003599', url: 'changeCommi' }, // 변경관리위원회
            { title: 'L0000000253', url: 'imprActTab' }, // 개선관리
            { title: 'L0000002843', url: 'multiFileUpload' }, // 첨부파일
          ];
          this.tabIndex = '5';
          break;
        // 변경완료
        case 'CGSP4':
          this.tabParam.editable = false;
          this.tabParam.detailCheck = true;
          this.disabled = true;
          this.disabled2 = true;
          this.allDisabled = true;
          this.tabItems = [
            { title: '판정 체크리스트', url: 'changeVerdictReview' }, // 판정 체크리스트
            { title: 'L0000002051', url: 'changeRequestContents' }, // 요청내용
            { title: 'L0000003599', url: 'changeCommi' }, // 변경관리위원회
            { title: 'L0000000573', url: 'changeCheckItemResult' }, // 관련업무
            { title: 'L0000002776', url: 'changeRefWork' }, // 진행관리
            { title: 'L0000000253', url: 'imprActTab' }, // 개선관리
            { title: 'L0000002843', url: 'multiFileUpload' }, // 첨부파일
          ];
          this.tabIndex = '0';
          break;
        default:
        // code block
      }
    },
    checkValidator() {
      this.$validator
        .validateAll()
        .then(_result => {
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321', // 확인
              message: 'M0000000011', // 저장하시겠습니까?
              type: 'info',
              // 확인 callback 함수
              confirmCallback: () => {
                this.change.createUserId = this.$store.getters.token;
                this.change.updateUserId = this.$store.getters.token;

                this.isSave = true;
              },
              cancelCallback: () => {
                this.isSave = false;
              },
            });
          } else {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395', // 안내
              message: 'M0000000005', // 필수입력값을 입력해주세요.
              type: 'warning',
            });
          }
        })
        .catch(e => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000876' // 유효성 검사도중 에러가 발생하였습니다.
          );
        });
    },
    /** 신규등록 하기전 UI단 유효성 검사 **/
    beforeSave() {
      if (this.popupParam.safChngNo === 0) {
        this.actionType = 'POST';
        this.saveUrl = transactionConfig.saf.change.insert.url;
      } else {
        this.actionType = 'PUT';
        this.saveUrl = transactionConfig.saf.change.edit.url;
      }
      this.checkValidator();
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
    setChangeCommi(data) {
      this.change.changeCommi = data;
    },
    /** button 관련 이벤트 **/
    /**
     * 수정 버튼 안보여지도록 처리
     *  버튼 http 통신 중 error 발생 callback
     * _result : error return하는 데이터
     */
    btnClickedErrorCallback(_result) {
      this.isSave = false;
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    /**
     *  신규등록 버튼 callback
     * _result : backend에서 return하는 데이터
     */
    btnSaveClickedCallback(_result) {
      if (!this.popupParam.safChngNo) {
        this.popupParam.safChngNo = this.$_.clone(_result.data.safChngNo);
      }
      this.change.safChngCommiNo = this.$_.clone(_result.data.safChngCommiNo);
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // 안내
        message: 'M0000000006', // 저장되었습니다.
        type: 'success', // success / info / warning / error
      });
      this.isSave = false;

      this.saveAttach();
      this.getDetail();
    },
    apprSave() {
      return new Promise(_resolve => {
        this.$validator
          .validateAll()
          .then(_result => {
            if (_result) {
              this.change.createUserId = this.$store.getters.token;
              this.change.updateUserId = this.$store.getters.token;

              this.$http.url = this.saveUrl;
              this.$http.type = 'PUT';
              this.$http.param = this.change;
              this.$http.request(_result => {
                if (!this.popupParam.safChngNo) {
                  this.popupParam.safChngNo = this.$_.clone(_result.data.safChngNo);
                }
                this.change.safChngCommiNo = this.$_.clone(_result.data.safChngCommiNo);

                this.saveAttach();
                this.getDetail();

                _resolve(true);
              }, _error => {
                _resolve(true);
              })

            } else {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395', // 안내
                message: 'M0000000005', // 필수입력값을 입력해주세요.
                type: 'warning',
              });
              _resolve(false);
            }
          })
          .catch(e => {
            window.getApp.$emit(
              'APP_VALID_ERROR',
              'M0000000876' // 유효성 검사도중 에러가 발생하였습니다.
            );
            _resolve(false);
          });
      })
    },
    saveAttach() {
      // task_key 를 셋팅한다.
      this.$_.forEach(this.attachFileGrps, item => {
        item.taskKey = this.popupParam.safChngNo;
      });

      // 순서는 진행관리, 변경관리위원회, 첨부파일 순으로 확인한다.
      // 진행관리와 변경관리위원회의 경우에는 첨부가 다 완료가 되었을시 속성으로 받아 체크하여 다음 작업(변경관리위원회 혹은 첨부파일)을 진행
      // 탭이 안 열린 상태가 있을수 있기때문에 속성으로 주고 받은 데이터값이 true인지 확인하여 체크한다.

      // 진행관리에 첨부할 파일이 있는 경우
      if (this.isAttachRefWork) {
        this.refWork.submitCheckSafWork = false;
        this.refWork.submitCheckSafWork = true;
      }
      // 변경관리 위원회에 첨부할 파일이 있는 경우
      else if (this.isAttachCommi) {
        this.commi.submitCheckCommi = false;
        this.commi.submitCheckCommi = true;
      }
      // 첨부파일 저장할 데이터가 있는 경우
      else if (this.saveAttachFiles.length > 0) {
        this.submitObject.submitCheck = true;
      }
    },
    changeUploadFiles(data) {
      var index = this.$_.findIndex(this.attachFileGrps, {
        taskClassNm: data.taskClassNm,
      });
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
    refCommi() {
      this.isAttachCommi = true;
    },
    refCommiComplete() {
      this.isAttachCommiComplete = true;
    },
    refWorkAttach() {
      this.isAttachRefWork = true;
    },
    refWorkAttachComplete() {
      this.isAttachRefWorkComplete = true;
    },
    changeItemResult(index) {
      this.checkItemResult = new Date().toString();

      if (this.change.changeCheckItemResults) {
        if (this.change.changeCheckItemResults[index]) {
          let item = this.change.changeCheckItemResults[index];
          if (item.chngRsltYn !== 'Y') {
            /**
             * 들어간 데이터를 초기화 시킨다
             */
            this.$http.url = this.$format(
              transactionConfig.attachFile.deleteAllDocu.url,
              'CHANGE_REF_WORK_' + item.chngRefWorkCd,
              item.chngRefWorkCd + this.change.safChngNo.toString()
            );
            this.$http.type = 'DELETE';
            this.$http.request(
              _result => {
              },
              _error => {
                window.getApp.$emit('APP_REQUEST_ERROR', _error);
              }
            );
            // this.$refs['fileupload_' + item.chngRefWorkCd][0].deleteFiles('CHANGE_REF_WORK_' + item.chngRefWorkCd, item.chngRefWorkCd + this.change.safChngNo.toString());
          }
        } else {
          this.change.changeCheckItemResults.forEach(item => {
            if (item.chngRsltYn !== 'Y') {
              /**
               * 들어간 데이터를 초기화 시킨다
               */
              this.$http.url = this.$format(
                transactionConfig.attachFile.deleteAllDocu.url,
                'CHANGE_REF_WORK_' + item.chngRefWorkCd,
                item.chngRefWorkCd + this.change.safChngNo.toString()
              );
              this.$http.type = 'DELETE';
              this.$http.request(
                _result => {
                },
                _error => {
                  window.getApp.$emit('APP_REQUEST_ERROR', _error);
                }
              );
              // this.$refs['fileupload_' + item.chngRefWorkCd][0].deleteFiles('CHANGE_REF_WORK_' + item.chngRefWorkCd, item.chngRefWorkCd + this.change.safChngNo.toString());
            }
          });
        }
      }
    }
    /** end button 관련 이벤트 **/
  },
};
</script>
