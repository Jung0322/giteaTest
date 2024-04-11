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
            <y-label
              label="L0000001223"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <el-tag
                v-if="
                  !change.mocLvlCd &&
                  popupParam.chngStepCd &&
                  popupParam.chngStepCd !== 'CGSP1'
                "
                size="medium"
                type="danger"
              >
                <i class="el-icon-warning"></i>
                <!-- 등급(검토)를 입력하세요. -->
                {{ $comm.getLangSpecInfoLabel('L0000000969') }}
              </el-tag>
              <!-- 완료 -->
              <y-btn
                v-if="completeCheck"
                :action-url="compUrl"
                :param="change"
                :is-submit="isComp"
                title="L0000002039"
                color="black"
                action-type="PUT"
                beforeSubmit="beforeComp"
                @beforeComp="beforeComp"
                @btnClicked="btnCompClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 결재요청 -->
              <y-btn
                v-if="apprCheck"
                title="L0000003418"
                color="black"
                @btnClicked="btnAppr"
              />
              <!-- 저장 -->
              <y-btn
                v-if="!allDisabled && editable"
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
              <!-- 삭제 -->
              <y-btn
                v-if="
                  editable && deleteable && change.bizApprStepCd !== 'BAPSD'
                "
                title="L0000001495"
                color="red"
                @btnClicked="beforeDelete"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 닫기 -->
              <y-btn title="L0000000881" @btnClicked="closePopup" />
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
              v-if="
                (popupParam.chngStepCd && popupParam.chngStepCd !== 'CGSP1') ||
                change.bizApprStepCd === 'BAPSA'
              "
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
                :warning="
                  popupParam.chngStepCd && popupParam.chngStepCd === 'CGSP1'
                    ? true
                    : false
                "
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
                :disabled="disabled2"
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
          {{ $comm.getLangSpecInfoLabel(item.title) }}
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
  name: 'y-change-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        safChngNo: 0, // key
        chngStepCd: '',
        isSearch: false,
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
      changeOperations: [],
      chngEffectCds: [], // 입력 기대효과
      changeEffects: [], // 기대효과
      changeCommi: null, // 변경관리위원회
      changeCheckItemResults: [], // 관련업무내역
      changeRefWorks: [], // 관련업무진행사항
      changeElectLaws: [], // 인허가검토
    },
    tabItems: [
      { title: 'L0000004251', url: './changeVerdictReview' }, // 판정 체크리스트
      { title: 'L0000002051', url: './changeRequestContents' }, // 요청내용
      { title: 'L0000000573', url: './changeCheckItemResult' }, // 관련업무
      // { title: '인허가검토', url: './changeElectConfirm' }, // 인허가검토
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
    deleteValue: [],
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
    isComp: false,
    tabIndexParam: '',
    component: null,
    tabIndex: 0,
    actionType: 'POST',
    searchDetailUrl: '',
    searchDefaultUrl: '',
    searchChangNumUrl: '',
    checkUrl: '',
    saveUrl: '',
    deleteUrl: '',
    confirmUrl: '',
    compUrl: '',
    checkItemResult: '',
  }),
  computed: {
    deleteable() {
      return (
        (this.change.chngStepCd
          ? this.change.chngStepCd
          : this.popupParam.chngStepCd) === 'CGSP1' &&
        !(this.change.bizApprStepCd === 'BAPSA' || this.popupParam.isSearch) &&
        !this.allDisabled
      );
    },
    apprCheck() {
      return (
        this.editable &&
        !this.allDisabled &&
        this.popupParam.safChngNo > 0 &&
        this.change.bizApprStepCd !== 'BAPSD' &&
        this.change.chngStepCd !== 'CGSP3'
      );
    },
    completeCheck() {
      return this.change.chngStepCd === 'CGSP3' && !this.popupParam.isSearch;
    },
  },
  watch: {
    tabIndex: function (newValue, oldValue) {
      this.loadComponent();
    },
    isAttachRefWorkComplete: function (newValue, oldValue) {
      if (this.isAttachCommi) {
        this.commi.submitCheckCommi = false;
        this.commi.submitCheckCommi = true;
      }
      // 첨부파일 저장할 데이터가 있는 경우
      else if (this.saveAttachFiles.length > 0) {
        this.submitObject.submitCheck = true;
      }
    },
    isAttachCommiComplete: function (newValue, oldValue) {
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
      this.searchDefaultUrl = selectConfig.saf.change.default.url;
      this.searchChangNumUrl = selectConfig.saf.change.changNum.url;
      this.saveUrl = transactionConfig.saf.change.insert.url;
      this.deleteUrl = transactionConfig.saf.change.delete.url;
      this.confirmUrl = transactionConfig.saf.change.edit.url;
      this.compUrl = transactionConfig.saf.change.complete.url;

      this.getDetail(); // 변경관리 상세 조회

      // 변경구분
      this.$comm.getComboItems('SAF_CHNG_ATT', false).then((_result) => {
        this.chngAttCdItems = _result;
      });
      // 등급(작성, 검토)
      this.$comm.getComboItems('SAF_MOC_LVL', false).then((_result) => {
        this.lvlWriteCdItems = _result;
        this.lvlConfirmCdItems = _result;
      });

      // this.buttonController();
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
      } else this.component = () => import(`${path}`);
    },
    /** 변경관리 상세 검색 **/
    getDetail() {
      if (!this.popupParam.safChngNo || this.popupParam.safChngNo === 0) {
        this.change.rqstDt = this.$comm.getToday();
        this.change.rqstDeptNm = this.$store.getters.deptNm;
        this.change.rqstUserNm = this.$store.getters.name;
        this.change.rqstDeptCd = this.$store.getters.deptCd;
        this.change.rqstUserId = this.$store.getters.token;
        this.getDefault();
        this.setStepByStep('');
        this.setAttachFileGrps(); // 첨부파일 셋팅
        return;
      } else {
        this.$http.url = this.$format(
          this.searchDetailUrl,
          this.popupParam.safChngNo
        );
        this.$http.type = 'GET';
        this.$http.request(
          (_result) => {
            this.$_.extend(this.change, _result.data);
            this.$_.forEach(this.change.changeEffects, (item) => {
              this.change.chngEffectCds.push(item.chngEffectCd);
            });

            this.change.changeCheckItemResults =
              this.change.changeCheckItemResults.filter(
                (item) => item.useYn === 'Y'
              );

            this.tabParam.refTableId = this.popupParam.safChngNo;

            this.setStepByStep(this.change.bizApprStepCd);
            this.setAttachFileGrps(); // 첨부파일 셋팅
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      }
    },
    getDefault() {
      this.$http.url = this.searchDefaultUrl;
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.$_.extend(
            this.change.changeElectLaws,
            _result.data.changeElectLaws
          );
        },
        (_error) => {
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
    setStepByStep(bizApprStepCd) {
      this.tabItems = [
        { title: 'L0000004251', url: './changeVerdictReview' }, // 판정 체크리스트
        { title: 'L0000002051', url: './changeRequestContents' }, // 요청내용
        { title: 'L0000000573', url: './changeCheckItemResult' }, // 관련업무
        // { title: '인허가검토', url: './changeElectConfirm' }, // 인허가검토
        { title: 'L0000002843', url: 'multiFileUpload' }, // 첨부파일
      ];
      switch (this.change.chngStepCd ? this.change.chngStepCd : this.popupParam.chngStepCd
      ) {
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
            { title: 'L0000004251', url: './changeVerdictReview' }, // 판정 체크리스트
            { title: 'L0000002051', url: './changeRequestContents' }, // 요청내용
            { title: 'L0000000573', url: './changeCheckItemResult' }, // 관련업무
            // { title: '인허가검토', url: './changeElectConfirm' }, // 인허가검토
            { title: 'L0000003599', url: './changeCommi' }, // 변경관리위원회
            { title: 'L0000002843', url: 'multiFileUpload' }, // 첨부파일
          ];
          this.tabIndex = '3';
          break;
        // 기술진행
        case 'CGSP2':
          this.disabled = true;
          this.disabled2 = true;
          this.tabItems = [
            { title: 'L0000004251', url: './changeVerdictReview' }, // 판정 체크리스트
            { title: 'L0000002051', url: './changeRequestContents' }, // 요청내용
            { title: 'L0000000573', url: './changeCheckItemResult' }, // 관련업무
            // { title: '인허가검토', url: './changeElectConfirm' }, // 인허가검토
            { title: 'L0000003599', url: './changeCommi' }, // 변경관리위원회
            { title: 'L0000002843', url: 'multiFileUpload' }, // 첨부파일
          ];
          if (this.change.commiYn === 'N') this.tabItems.splice(3, 1);
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
            { title: 'L0000004251', url: './changeVerdictReview' }, // 판정 체크리스트
            { title: 'L0000002051', url: './changeRequestContents' }, // 요청내용
            { title: 'L0000000573', url: './changeCheckItemResult' }, // 관련업무
            // { title: '인허가검토', url: './changeElectConfirm' }, // 인허가검토
            { title: 'L0000003599', url: './changeCommi' }, // 변경관리위원회
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
            { title: 'L0000004251', url: './changeVerdictReview' }, // 판정 체크리스트
            { title: 'L0000002051', url: './changeRequestContents' }, // 요청내용
            { title: 'L0000000573', url: './changeCheckItemResult' }, // 관련업무
            // { title: '인허가검토', url: './changeElectConfirm' }, // 인허가검토
            { title: 'L0000003599', url: './changeCommi' }, // 변경관리위원회
            { title: 'L0000000253', url: 'imprActTab' }, // 개선관리
            { title: 'L0000002843', url: 'multiFileUpload' }, // 첨부파일
          ];
          this.tabIndex = '0';
          break;
        default:
        // code block
      }
      if (bizApprStepCd === 'BAPSA' || this.popupParam.isSearch) {
        this.disabled = true;
        this.disabled2 = true;
        this.allDisabled = true;
        this.tabParam.editable = false;
        this.tabParam.detailCheck = true;
      }
    },
    checkValidator() {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (this.change.commiYn === 'Y'
            && this.change.changeCommi
            && this.change.changeCommi.changeCommiPsns.length
            && !this.change.changeCommi.commiDt) {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395',
              message: 'M0000001152', //  변경관리위원회 개최일을 선택해주세요.
              type: 'warning',
            });
            return false;
          }

          let noMgrNm = false
          let noMgrDeptNm = false
          let noEndSchDt = false
          let noContents = false
          let noEndDt = false
          let noChkNm = false

          this.$_.forEach(this.change.changeCheckItemResults, (item) => {
            if (item.chngRsltYn === 'Y' && !item.endSchDt) {
              noEndSchDt = true
            }
          })
          if (noEndSchDt) {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395',
              message: '관련업무의 실행예정일을 선택해주세요.',
              type: 'warning',
            });
            return false;
          }

          this.$_.forEach(this.change.changeCheckItemResults, (item) => {
            if (item.chngRsltYn === 'Y' && !item.mgrDeptNm) {
              noMgrDeptNm = true
            }
          })
          if (noMgrDeptNm) {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395',
              message: '관련업무의 담당부서를 선택해주세요.',
              type: 'warning',
            });
            return false;
          }

          if (this.change.chngStepCd === 'CGSP2') {
            this.$_.forEach(this.change.changeCheckItemResults, (item) => {
              if (item.chngRsltYn === 'Y' && !item.mgrNm) {
                noMgrNm = true
              }
            })
          }
          if (noMgrNm) {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395',
              message: '관련업무의 담당자를 선택해주세요.',
              type: 'warning',
            });
            return false;
          }

          if (this.change.chngStepCd === 'CGSP2') {
            this.$_.forEach(this.change.changeCheckItemResults, (item) => {
              if (item.chngRsltYn === 'Y' && !item.contents) {
                noContents = true
              }
            })
          }
          if (noContents) {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395',
              message: '관련업무의 실행확인을 입력해주세요.',
              type: 'warning',
            });
            return false;
          }

          if (this.change.chngStepCd === 'CGSP2') {
            this.$_.forEach(this.change.changeCheckItemResults, (item) => {
              if (item.chngRsltYn === 'Y' && !item.endDt) {
                noEndDt = true
              }
            })
          }
          if (noEndDt) {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395',
              message: '관련업무의 완료일을 선택해주세요.',
              type: 'warning',
            });
            return false;
          }

          if (this.change.chngStepCd === 'CGSP2') {
            this.$_.forEach(this.change.changeCheckItemResults, (item) => {
              if (item.chngRsltYn === 'Y' && !item.chkNm) {
                noChkNm = true
              }
            })
          }
          if (noChkNm) {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395',
              message: '관련업무의 확인자를 선택해주세요.',
              type: 'warning',
            });
            return false;
          }

          if (_result && this.change.chngContents !== '') {
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
            this.$popupRequired.check('changeDetail', this.$data, this.errors);
          }
        })
        .catch((e) => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000004' // 유효성 검사도중 에러가 발생하였습니다.
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
    beforeDelete() {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321', // 확인
        message: 'M0000000012', // 삭제하시겠습니까?
        type: 'info',
        // 확인 callback 함수
        confirmCallback: () => {
          this.$http.url = this.$format(
            this.deleteUrl,
            this.popupParam.safChngNo
          );
          this.$http.type = 'DELETE';
          this.$http.request(
            (_result) => {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395', // 안내
                message: 'M0000000007', // 삭제되었습니다.
                type: 'success', // success / info / warning / error
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
    beforeComp() {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321', // 확인
        message: 'M0000000838', // 완료하시겠습니까?
        type: 'info',
        // 확인 callback 함수
        confirmCallback: () => {
          this.change.updateUserId = this.$store.getters.token;

          this.isComp = true;
        },
        cancelCallback: () => {
          this.isComp = false;
        },
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
      this.isComp = false;
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
    btnCompClickedCallback(_result) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // 안내
        message: 'M0000000078', // 완료되었습니다.
        type: 'success', // success / info / warning / error
      });
      this.isComp = false;

      this.saveAttach();
      this.getDetail();
    },
    saveAttach() {
      // task_key 를 셋팅한다.
      this.$_.forEach(this.attachFileGrps, (item) => {
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
    btnAppr() {
      this.$validator
        .validateAll()
        // eslint-disable-next-line complexity
        .then((_result) => {
          // TODO : 전역 성공 메시지 처리
          // 이벤트는 ./event.js 파일에 선언되어 있음
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321', // 확인
              message: 'M0000000767', // 결재요청 하기전 입력된 값을 저장합니다. 진행하시겠습니까?
              // TODO : 필요시 추가하세요.
              type: 'info', // success / info / warning / error
              // 확인 callback 함수
              confirmCallback: () => {
                this.change.createUserId = this.$store.getters.token;
                this.change.updateUserId = this.$store.getters.token;

                this.$http.url = transactionConfig.saf.change.edit.url;
                this.$http.type = 'PUT';
                this.$http.param = this.change;
                this.$http.request(
                  (_result) => {
                    let apprBizCd = '';

                    if (this.popupParam.chngStepCd === 'CGSP1') {
                      if (this.change.commiYn === 'Y') {
                        apprBizCd = 'SA-CH-01';
                      } else {
                        apprBizCd = 'SA-CH-0A';
                      }
                    } else if (this.popupParam.chngStepCd === 'CGSPA') {
                      apprBizCd = 'SA-CH-02';
                    } else {
                      apprBizCd = 'SA-CH-03';
                    }
                    this.popupOptions.target = () =>
                      import(`${'@/pages/manage/appr/comApprRequest.vue'}`);
                    this.popupOptions.title = 'L0000003418'; // 결재요청
                    this.popupOptions.visible = true;
                    this.popupOptions.closeCallback = this.closeApprPop;
                    this.popupOptions.width = '80%';
                    this.popupOptions.param = {
                      apprBizCd: apprBizCd,
                      apprParams: {
                        safChngNo: this.popupParam.safChngNo,
                      },
                    };
                  },
                  (_error) => {
                    window.getApp.$emit('APP_REQUEST_ERROR', _error);
                  }
                );
              },
              // 취소 callback 함수
              cancelCallback: () => {},
            });
          } else if (!_result) {
            this.$popupRequired.check('changeDetail', this.$data, this.errors);
          }
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000876' // 유효성 검사도중 에러가 발생하였습니다.
          );
        });
    },
    closeApprPop(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getDetail();
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
              (_result) => {},
              (_error) => {
                window.getApp.$emit('APP_REQUEST_ERROR', _error);
              }
            );
            // this.$refs['fileupload_' + item.chngRefWorkCd][0].deleteFiles('CHANGE_REF_WORK_' + item.chngRefWorkCd, item.chngRefWorkCd + this.change.safChngNo.toString());
          }
        } else {
          this.change.changeCheckItemResults.forEach((item) => {
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
                (_result) => {},
                (_error) => {
                  window.getApp.$emit('APP_REQUEST_ERROR', _error);
                }
              );
              // this.$refs['fileupload_' + item.chngRefWorkCd][0].deleteFiles('CHANGE_REF_WORK_' + item.chngRefWorkCd, item.chngRefWorkCd + this.change.safChngNo.toString());
            }
          });
        }
      }
    },
  },
};
</script>
