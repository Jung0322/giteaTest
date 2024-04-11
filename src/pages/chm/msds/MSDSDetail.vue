<!--
  목적 : 화학물질관리 > MSDS > MSDS 상세
  Detail :  MSDS에 대한 상세정보를 보여준다.
  *
  화학물질의 MSDS파일을 불러온 후, 해당 파일을 삭제하지 않는 이상 저장해 주어야 하는데, 이를 체크하는 방법

  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row>
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- MSDS -->
            <y-label
              label="L0000000127"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 경고표지출력 -->
              <y-btn
                v-if="revDisabled && editable && popupParam.msdsRqstNo"
                title="L0000000457"
                @btnClicked="btnPrint"
              />
              <!-- <y-btn
                v-if="revDisabled && editable"
                :param="msds"
                title="경고표지출력"
                color="orange"
                :action-type="actionType"
                @btnClicked="beforeWarnPrint"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />-->
              <!-- <y-btn
                v-if="revDisabled && editable"
                :param="msds"
                title="공정관리요령출력"
                color="orange"
                :action-type="actionType"
                @btnClicked="beforeMngPrint"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />-->
              <!-- 저장 -->
              <y-btn
                v-if="revDisabled && editable && !showRevisionAndUpdateButton"
                :action-url="saveUrl"
                :param="msds"
                :is-submit="isSave"
                title="L0000002474"
                color="orange"
                :action-type="actionType"
                beforeSubmit="beforeSave"
                @beforeSave="beforeSave"
                @btnClicked="btnSaveClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 개정 -->
              <y-btn
                v-if="!revDisabled && editable && !updateMode"
                :action-url="renewUrl"
                :param="msds"
                :is-submit="isRenew"
                title="L0000003777"
                color="blue"
                action-type="POST"
                beforeSubmit="beforeRenew"
                @beforeRenew="beforeRenew"
                @btnClicked="btnRenewClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 개정 -->
              <y-btn
                v-if="
                  popupParam.msdsRqstNo > 0 &&
                  revDisabled &&
                  editable &&
                  !updateMode
                "
                title="L0000000291"
                color="blue"
                @btnClicked="renewalMode"
              />
              <!-- 수정 -->
              <y-btn
                v-if="showRevisionAndUpdateButton && revDisabled"
                title="L0000001696"
                color="orange"
                @btnClicked="updatePopup"
              />
              <!-- 취소 -->
              <y-btn
                v-if="(!revDisabled || updateMode) && editable"
                title="L0000002920"
                @btnClicked="cancel"
              />
              <!--  삭제 -->
              <y-btn
                v-if="isRevisionButtonClicked"
                title="L0000001495"
                color="red"
                @btnClicked="btnDeleteClickedCallback"
              />
              <!-- 닫기 -->
              <y-btn title="L0000000881" @btnClicked="closePopup" />
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col
              sm="12"
              md="12"
              lg="12"
              xl="12"
              class="col-xxl-12 mb-3"
              v-if="editable"
            >
              <el-tag size="medium" type="info">
                <!-- 화학물질 선택시, 선택된 MSDS파일이 없는 경우, 화학물질의 MSDS파일이 자동으로 첨부됩니다. -->
                <i class="el-icon-info"></i>
                {{ this.$comm.getLangSpecInfoLabel('L0000003291') }}
              </el-tag>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 화학자재명(국문) -->
              <y-text
                :width="8"
                :required="true"
                :editable="isEnable"
                :disabled="true"
                ui="bootstrap"
                label="L0000003318"
                name="chemProdNmKr"
                v-model="msds.chemProdNmKr"
                :appendIcon="[
                  { icon: 'search', callbackName: 'searchChemprod' },
                ]"
                @searchChemprod="searchChemprod"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 화학자재명(영문) -->
              <y-text
                :width="8"
                :required="true"
                :editable="isEnable"
                :disabled="true"
                ui="bootstrap"
                label="L0000003319"
                name="chemProdNmEn"
                v-model="msds.chemProdNmEn"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- SAP 자재번호 -->
              <y-text
                :width="8"
                :editable="editable"
                :disabled="true"
                ui="bootstrap"
                label="L0000003824"
                name="sapMatCd"
                v-model="msds.sapMatCd"
              ></y-text>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-8">
              <b-row>
                <b-col sm="8" md="8" lg="8" xl="8" class="col-xxl-8">
                  <!-- 납품업체/코드 -->
                  <y-text
                    :width="9"
                    :required="true"
                    :editable="isEnable"
                    :disabled="true"
                    :clearable="true"
                    ui="bootstrap"
                    label="L0000000806"
                    name="vendorNm"
                    v-model="msds.vendorNm"
                    :appendIcon="[
                      { icon: 'search', callbackName: 'searchVendor' },
                    ]"
                    @searchVendor="searchVendor('V')"
                    v-validate="'required'"
                    :state="validateState('vendorNm')"
                  ></y-text>
                </b-col>
                <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
                  <y-text
                    :width="12"
                    :editable="editable"
                    :disabled="true"
                    :clearable="true"
                    ui="bootstrap"
                    name="vendorCd"
                    v-model="msds.vendorCd"
                    v-validate="'required'"
                    :state="validateState('vendorCd')"
                  ></y-text>
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-8">
              <b-row>
                <b-col sm="8" md="8" lg="8" xl="8" class="col-xxl-8">
                  <!-- 제조업체/코드 -->
                  <y-text
                    :width="9"
                    :required="true"
                    :editable="isEnable"
                    :disabled="true"
                    :clearable="true"
                    ui="bootstrap"
                    label="L0000002630"
                    name="makecpNm"
                    v-model="msds.makecpNm"
                    :appendIcon="[
                      { icon: 'search', callbackName: 'searchVendor' },
                    ]"
                    @searchVendor="searchVendor('M')"
                    v-validate="'required'"
                    :state="validateState('makecpNm')"
                  ></y-text>
                </b-col>
                <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
                  <y-text
                    :width="12"
                    :editable="editable"
                    :disabled="true"
                    :clearable="true"
                    ui="bootstrap"
                    name="makecpCd"
                    v-model="msds.makecpCd"
                    v-validate="'required'"
                    :state="validateState('makecpCd')"
                  ></y-text>
                </b-col>
              </b-row>
            </b-col>
            <!-- 2022-04-01 추가 -->
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- MSDS번호 -->
              <y-text
                :width="8"
                :editable="isEnable"
                :disabled="disabled"
                :maxlength="30"
                ui="bootstrap"
                label="L0000004599"
                name="msdsNum"
                v-model="msds.msdsNum"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 비공개승인번호 -->
              <y-text
                :width="8"
                :editable="isEnable"
                :disabled="disabled"
                :maxlength="30"
                ui="bootstrap"
                label="L0000004600"
                name="secretNum"
                v-model="msds.secretNum"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!--비공개승인일  -->
              <y-datepicker
                :width="8"
                :editable="isEnable"
                :disabled="disabled"
                ui="bootstrap"
                label="L0000004601"
                name="secretApproval"
                v-model="msds.secretApproval"
              ></y-datepicker>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!--  비공개만료일-->
              <y-datepicker
                :width="8"
                :editable="isEnable"
                :disabled="disabled"
                ui="bootstrap"
                label="L0000004602"
                name="secretExpiration"
                v-model="msds.secretExpiration"
              ></y-datepicker>
            </b-col>
            <!-- ㅡㅡㅡㅡㅡㅡㅡㅡ -->

            <!-- <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <y-select
                :width="8"
                :editable="editable"
                :comboItems="vendorItems"
                :required="true"
                itemText="vendorNm"
                itemValue="vendorCd"
                ui="bootstrap"
                label="공급업체"
                name="vendorCd"
                v-model="msds.vendorCd"
                v-validate="'required'"
                :state="validateState('vendorCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <y-select
                :width="8"
                :editable="editable"
                :comboItems="vendorItems"
                :required="true"
                itemText="vendorNm"
                itemValue="vendorCd"
                ui="bootstrap"
                label="제조업체"
                name="makecpCd"
                v-model="msds.makecpCd"
                v-validate="'required'"
                :state="validateState('makecpCd')"
              />
            </b-col>-->
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <y-plant
                type="edit"
                filter="chm"
                :required="true"
                :editable="isEnable"
                name="plantCd"
                v-model="msds.plantCd"
                v-validate="'required'"
                :state="validateState('plantCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- MSDS작성일자 -->
              <y-datepicker
                :width="8"
                :required="true"
                :editable="isEnable"
                type="writeDt"
                label="L0000000133"
                :default="msds.writeDt"
                v-model="msds.writeDt"
                v-validate="'required'"
                :state="validateState('writeDt')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 제개정구분 -->
              <y-text
                :width="8"
                :required="true"
                :editable="isEnable"
                :disabled="true"
                ui="bootstrap"
                label="L0000002614"
                name="revType"
                v-model="msds.revTypeNm"
                v-validate="'required'"
                :state="validateState('revType')"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 개정번호 -->
              <y-number
                :width="8"
                :editable="isEnable && revNumMode"
                :maxlength="3"
                :disabled="revDisabled"
                :hasSeperator="false"
                :pointNumber="2"
                ui="bootstrap"
                label="L0000000293"
                name="revNum"
                v-model="msds.revNum"
              ></y-number>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 등록자 -->
              <y-text
                :width="8"
                :editable="editable"
                :disabled="true"
                ui="bootstrap"
                label="L0000000976"
                name="createUserNm"
                v-model="msds.createUserNm"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 등록일 -->
              <y-datepicker
                :width="8"
                :editable="editable"
                :disabled="true"
                type="createDt"
                label="L0000000973"
                :default="msds.createDt"
                v-model="msds.createDt"
              />
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-8">
              <!-- 비고 -->
              <y-text
                :width="10"
                :editable="isEnable"
                ui="bootstrap"
                label="L0000001360"
                name="remarks"
                v-model="msds.remarks"
              ></y-text>
            </b-col>
            <!-- 첨부파일 -->
            <el-divider content-position="left">{{
              $comm.getLangSpecInfoLabel('L0000002843')
            }}</el-divider>
            <component
              :is="attach"
              v-if="attach"
              :submitCheck="submitCheck"
              :attachFileGrps="attachFileGrps"
              :saveAttachFiles="saveAttachFiles"
              @changeUploadFiles="changeUploadFiles"
              @setTempDeleteFiles="setTempDeleteFiles"
              @closePopup="closePopup"
              @setUploadedList="setUploadedList"
              @setClearOtherFileList="setClearOtherFileList"
            />
          </b-row>
        </b-card>
      </b-col>
    </b-row>
    <el-tabs
      type="border-card"
      v-model="tabIndex"
      @tab-click="tabClick"
      class="mt-3"
    >
      <el-tab-pane
        v-for="(item, i) in tabItems"
        :key="i"
        stretch
        class="default-tab-pane"
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
            :paneName="paneName"
            :msdsRqstNo="popupParam.msdsRqstNo"
            :msds="msds"
            @closePopup="closePopup"
          />
        </keep-alive>

    </el-tabs>
    <b-row class="mt-1">
      <b-col>
        <div slot="buttonGroup" class="float-right mb-1">
          <!-- <y-btn title="L0000000881" @btnClicked="closePopup" /> -->
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
  name: 'msds-detail',
  components: {},
  props: {
    popupParam: {
      type: Object,
      default: {
        msdsRqstNo: 0,
      },
    },
  },
  // TODO: 화살표 함수(=>)는 data에 사용하지 말 것
  //    data: () => { return { a: this.myProp }}) 화살표 함수가 부모 컨텍스트를 바인딩하기 때문에 this는 예상과 달리 Vue 인스턴스가 아니며, this.myProp는 정의되지 않습니다.
  //    참고url: https://kr.vuejs.org/v2/api/index.html#data
  data: function () {
    return {
      msds: {
        msdsRqstNo: 0,
        msdsGrpNo: 0,
        chemProdNo: 0,
        chemProdNmKr: '',
        chemProdNmEn: '',
        vendorCd: null,
        vendorNm: '',
        makecpCd: null,
        makecpNm: '',
        revType: 'N',
        revTypeNm: '',
        newYn: 'Y',
        revNum: 1,
        createUserNm: '',
        createDt: '',
        createUserId: '',
        updateUserId: '',
        property: '',
        propertyNm: '',
        moleWeight: '',
        boilpoint: '',
        meltingPnt: '',
        flashingPnt: '',
        usageCd: '',
        usageNm: '',
        specificGravity: '', // 비중
        sapMatCd: '', // SAP 자재번호
        msdsPicGraphs: [],
        autoInsYn: '',
        autoInsYnNm: '',
        hazDangerDesc: '',
        preventActDesc: '', // 예방조치문구추가
        signalDesc: '', // 신호어추가
        fstAidEyeDesc: '',
        fstAidSkinDesc: '',
        fstAidBreathDesc: '',
        fstAidEatDesc: '',
        strgMthdDesc: '',
        evasCondDesc: '',
        evasMatDesc: '',
        leakHandleDesc: '',
        explHandleDesc: '',
        fireHandleDesc: '',
        lawExpoStndDesc: '',
        lawSphkPerDesc: '',
        lawWkenMeasDesc: '',
        lawIndSafDesc: '',
        lawChemMgrDesc: '',
        lawDngrMgrDesc: '',
        handleCareDesc: '',
        safetyEquipDesc: '', // 적절한 보호구 추가
        chemProdMsdsYn: '', // 저장시 화학물질가 변경되어, 화학물질의 MSDS파일이 자동 첨부하는 경우
        chemProdMsdsFiles: [], // 저장시 화학물질가 변경되어, 화학물질의 MSDS파일이 자동 첨부하는 경우에 첨부된 msds파일번호

        // 2022-04-01 추가
        msdsNum: '',
        secretNum: '',
        secretApproval: '',
        secretExpiration: '',
        // ㅡㅡㅡㅡㅡㅡㅡㅡ
      },
      tempRevNum: 1,
      tempRevType: '',
      vendorItems: [],
      revTypeItems: [],
      editable: false,
      actionType: 'POST',
      disabled: false,
      revDisabled: true,
      revMode: false,
      isSave: false,
      isRenew: false,
      searchDetailUrl: '',
      searchVendorUrl: '',
      msdsReportUrl: '',
      saveUrl: '',
      renewUrl: '',
      checkUrl: '',
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '80%',
        top: '50px',
        param: {},
        closeCallback: null,
      },
      // TODO : 현재까지 파악된 바로는 tab은 같은 폴더 또는 하위 폴더의 컴포넌트만 접근이 가능한 것으로 파악됨
      //                즉, 반드시 메인페이지 역할을 하는 vue와 동일 폴더나 하위 폴더에 tabItem 역할을 하는 vue 파일을 위치 시킬 것
      tabItems: [
        // { title: '첨부파일', url: 'MSDSFileUpload' },
        { title: 'L0000000131', url: './MSDSSummery' }, // 'MSDS요약내용',
      ],
      component: null,
      tabIndex: 0,
      paneName: '',

      // 첨부 파일
      attach: null,
      submitCheck: false,
      saveAttachFiles: [],
      tempDeleteFiles: [],
      attachFileGrps: [],
      uploadedMsdsList: [], // 업로드된 msds
      plantItems: [],
      reportType: '',
      isOtherFile: false, // 저장시 화학물질로부터 선택된 MSDS파일이 있는지 여부
      isEnable: false,
      showRevisionAndUpdateButton: false,
      updateMode: false,
      revNumMode: false,
      deleteUrl: '',
      isRevisionButtonClicked: false,
    };
  },
  watch: {
    tabIndex() {
      this.loadComponent();
    },
    'msds.revType': function (newValue, oldValue) {
      if (newValue) {
        this.msds.revTypeNm =
          this.revTypeItems[
            this.$_.findIndex(this.revTypeItems, { code: newValue })
          ].codeNm;
      }
    },
    // 'msds.vendorCd': function(newValue, oldValue) {
    //   this.msds.vendorNm = this.vendorItems[
    //     this.$_.findIndex(this.vendorItems, { vendorCd: newValue })
    //   ].vendorNm;
    // },
    // 'msds.makecpCd': function(newValue, oldValue) {
    //   this.msds.makecpNm = this.vendorItems[
    //     this.$_.findIndex(this.vendorItems, { vendorCd: newValue })
    //   ].vendorNm;
    // },
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
      this.searchDetailUrl = selectConfig.chm.MSDS.get.url;
      this.searchVendorUrl = selectConfig.chm.chemicalVendorMaster.list.url;
      this.checkUrl = selectConfig.chm.MSDS.check.url;
      this.saveUrl = transactionConfig.chm.MSDS.insert.url;
      this.renewUrl = transactionConfig.chm.MSDS.insert.url;
      this.msdsReportUrl = selectConfig.chm.MSDS.report.url;
      this.deleteUrl = selectConfig.chm.MSDS.delete.url;
      this.revTypeItems = [
        { code: 'N', codeNm: this.$comm.getLangSpecInfoLabel('L0000003825') }, // '제정'
        { code: 'U', codeNm: this.$comm.getLangSpecInfoLabel('L0000000291') }, // '개정'
      ];

      // this.getVendorList();
      this.initData();
    },
    initData() {
      // 신규로 들어온 경우
      if (this.popupParam.msdsRqstNo === 0) {
        this.isEnable = true;
        this.msds.createUserNm = this.$store.getters.name;
        this.msds.createDt = this.$comm.getToday();
        this.msds.revTypeNm =
          this.revTypeItems[
            this.$_.findIndex(this.revTypeItems, { code: this.msds.revType })
          ].codeNm;

        let index = this.$_.findIndex(this.tabItems, { title: 'L0000000295' }); // '개정이력'
        if (index > 0) this.tabItems.splice(index, 1);
      }
      // 상세로 들어온 경우
      else {
        this.isRevisionButtonClicked = true;
        this.showRevisionAndUpdateButton = true;
        this.getDetail();
        this.tabItems.splice(1, 0, {
          title: 'L0000000295',
          url: './MSDSHistory',
        }); // '개정이력'
      }

      this.attach = () => import('@/pages/common/attachFile/multiFileUpload');
      this.setAttachFileGrps(); // 첨부파일 셋팅
    },
    loadComponent() {
      var path = this.tabItems[this.$_.parseInt(this.tabIndex)].url;
      this.component = () => import(`${path}`);
      // if (path === 'MSDSFileUpload') this.component = () => import('@/pages/common/attachFile/multiFileUpload');
      // else this.component = () => import(`${path}`);
    },
    /**
     * 자식 페이지에 넘길 paneName 정보 업데이트
     * tab 클릭시 마다
     * tab : 클릭한 tab 정보
     */
    tabClick(tab) {
      var nowDate = new Date();
      this.paneName = tab.paneName + nowDate.getMilliseconds();
    },
    setAttachFileGrps() {
      // 첨부파일 설정
      let taskKey = this.popupParam.msdsRqstNo
        ? this.popupParam.msdsRqstNo.toString()
        : '';
      this.attachFileGrps = [
        {
          label: 'L0000000127', // 'MSDS',
          uploadTempFiles: null,
          taskClassNm: 'MSDS',
          taskKey: taskKey,
          drag: false,
          isOtherFile: true,
          loadOtherFileGrps: null,
          showFileSearch: this.editable,
          editable: this.isEnable,
          disabled: !this.editable,
          createUserId: this.$store.getters.token,
        },
        {
          label: 'L0000000132', // 'MSDS요약파일',
          uploadTempFiles: null,
          taskClassNm: 'MSDS_SUMMARY',
          taskKey: taskKey,
          drag: false,
          isOtherFile: false,
          loadOtherFileGrps: null,
          showFileSearch: this.editable,
          editable: this.isEnable,
          disabled: !this.editable,
          createUserId: this.$store.getters.token,
        },
      ];
    },
    getDetail() {
      if (this.popupParam.msdsRqstNo === 0) return;
      this.$http.url = this.$format(
        this.searchDetailUrl,
        this.popupParam.msdsRqstNo
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.msds = this.$_.clone(_result.data);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    // 업체 grid
    getVendorList() {
      this.$http.url = this.searchVendorUrl;
      this.$http.type = 'GET';
      this.$http.param = {
        useYn: 'Y',
        vendorTypeCd: 'CVET3',
      };
      this.$http.request(
        (_result) => {
          this.vendorItems = this.$_.clone(_result.data);
          this.vendorItems.splice(0, 0, {
            vendorCd: null,
            vendorNm:
              this.$comm.getLangSpecInfoLabel('L0000003394') /* 선택하세요 */,
          });
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
          this.initData();
        }
      );
    },
    updatePopup() {
      this.isRevisionButtonClicked = false;
      this.showRevisionAndUpdateButton = false;
      this.updateMode = true;
      this.isEnable = true;
      this.revNumMode = false;
      // MSDS 파일을 다시 올려야 함으로 file 리스트를 없앤다
      let taskKey = '';
      this.attachFileGrps = [
        {
          label: 'L0000000127', // 'MSDS',
          listType: 'text',
          drag: false,
          showFileSearch: !this.disabled,
          editable: this.editable,
          disabled: this.disabled,
          limit: 3,
          multiple: true,
          uploadTempFiles: null,
          loadOtherFileGrps: null, // msds불러오기 한 파일 정보
          taskClassNm: 'MSDS',
          taskKey: taskKey,
          taskFlag: '',
          createUserId: this.$store.getters.token,
          isOtherFile: true,
        },
        {
          label: 'L0000000132', // 'MSDS요약파일',
          listType: 'text',
          drag: false,
          showFileSearch: !this.disabled,
          editable: this.editable,
          disabled: this.disabled,
          limit: 5,
          multiple: true,
          uploadTempFiles: null,
          loadOtherFileGrps: null,
          taskClassNm: 'MSDS_SUMMARY',
          taskKey: taskKey,
          taskFlag: '',
          createUserId: this.$store.getters.token,
          isOtherFile: false,
        },
      ];
    },
    check(gubun) {
      this.$validator
        .validateAll()
        .then((result) => {
          if (result) {
            this.$http.url = this.checkUrl;
            this.$http.type = 'GET';
            this.$http.param = {
              makecpCd: this.msds.makecpCd,
              vendorCd: this.msds.vendorCd,
              chemProdNmKr: this.msds.chemProdNmKr,
              chemProdNmEn: this.msds.chemProdNmEn,
              msdsRqstNo: gubun === 'insert' ? 0 : this.popupParam.msdsRqstNo,
              revNum: gubun !== 'renew' ? '' : this.msds.revNum,
              msdsGrpNo: gubun !== 'renew' ? 0 : this.msds.msdsGrpNo,
            };
            this.$http.request(
              (_result) => {
                var cntList = this.$_.map(this.$_.clone(_result.data), 'cnt');

                // if (cntList[0] > 0) {
                //   window.getApp.$emit('ALERT', {
                //     title: 'L0000003395', // '안내',
                //     message: 'M0000000164', // '이미 해당 MSDS가 있습니다.',
                //     type: 'warning',
                //   });
                //   return;
                // }
                if (cntList[1] > 0 && gubun === 'renew') {
                  window.getApp.$emit('ALERT', {
                    title: 'L0000003395', // '안내',
                    message: 'M0000000165', // '이미 해당 개정번호가 있습니다.',
                    type: 'warning',
                  });
                  return;
                } else {
                  window.getApp.$emit('CONFIRM', {
                    title: 'L0000003321', // '확인',
                    message:
                      gubun === 'renew'
                        ? 'M0000000166' // '개정하시겠습니까?'
                        : 'M0000000011', // '저장하시겠습니까?',
                    // TODO : 필요시 추가하세요.
                    type: 'info', // success / info / warning / error
                    // 확인 callback 함수
                    confirmCallback: () => {
                      this.msds.createUserId = this.$store.getters.token;
                      this.msds.updateUserId = this.$store.getters.token;

                      // MSDS의 불러오기 한 파일이 있는지 여부 검사
                      this.msds.chemProdMsdsFiles = [];
                      this.$_.forEach(this.attachFileGrps, (item) => {
                        if (
                          item.taskClassNm === 'MSDS' &&
                          item.loadOtherFileGrps
                        ) {
                          this.msds.chemProdMsdsYn = 'Y';
                          this.$_.forEach(item.loadOtherFileGrps, (subitem) => {
                            this.msds.chemProdMsdsFiles.push(subitem.fileNo);
                          });
                        }
                      });
                      if (gubun === 'renew') this.isRenew = true;
                      else this.isSave = true;
                    },
                    // 취소 callback 함수
                    cancelCallback: () => {
                      if (gubun === 'renew') this.isRenew = false;
                      else this.isSave = false;
                    },
                  });
                }
              },
              (_error) => {
                window.getApp.$emit('APP_REQUEST_ERROR', _error);
              }
            );
          } else if (!result) {
            this.$popupRequired.check('MSDSDetail', this.$data, this.errors);
          }
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000004' // '유효성 검사 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.'
          );
          if (gubun === 'renew') this.isRenew = false;
          else this.isSave = false;
        });
    },
    btnPrint() {
      let thisVue = this;
      let _comm = this.$comm;
      this.$http.url = this.$format(
        this.msdsReportUrl,
        this.popupParam.msdsRqstNo
      ); // BASE64를 UTF-8인코딩한 바이트로 다운받음 (그렇지 않으면 FRONT에서 JSON이 깨짐)
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          let fileOrgNm = 'MSDSWarnSign.pdf';
          var url = window.URL || window.webkitURL;
          let link = document.createElement('a');
          var blob = thisVue.$comm.base64ToBlob(_result.data);
          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob, fileOrgNm);
          } else {
            let link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = fileOrgNm;
            link.click();
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    beforeWarnPrint() {
      // 경고표지출력
      this.$http.url = this.$format(
        this.msdsReportUrl,
        this.popupParam.msdsRqstNo
      );
      this.$http.type = 'GET';
      this.$http.param = { reportType: 'warnsign' };
      this.$http.request(
        (_result) => {
          var blob = new Blob([_result.data], { type: 'application/pdf' });
          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob, 'MSDSWarnSign.pdf');
          } else {
            let link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = 'MSDSWarnSign.pdf';
            link.click();
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    closeMsdsPrintPopup() {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
    },
    /** 신규등록 하기전 UI단 유효성 검사 **/
    beforeSave() {
      var gubun = '';
      // 신규등록
      if (this.popupParam.msdsRqstNo === 0) {
        gubun = 'insert';
        this.saveUrl = transactionConfig.chm.MSDS.insert.url;
        this.actionType = 'POST';
      }
      // 수정
      else {
        gubun = 'edit';
        this.saveUrl = transactionConfig.chm.MSDS.edit.url;
        this.actionType = 'PUT';
      }

      this.check(gubun);
    },
    beforeRenew() {
      if (this.tempRevNum === this.msds.revNum) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000167', // '개정번호가 바뀌지 않았습니다.',
          type: 'warning',
        });
        return;
      }
      this.check('renew');
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
    closePopup(data) {
      this.$emit('closePopup', {});
    },
    searchChemprod() {
      this.popupOptions.target = () => import(`${'../chemprod/chemprod.vue'}`);
      this.popupOptions.title = 'L0000003309'; // '화학자재';
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        chemprod: this.msds,
        popupMode: true,
      };
      this.popupOptions.closeCallback = this.closeChemprodPopup;
    },
    closeChemprodPopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      if (data.data !== 'C') {
        this.msds.chemProdNmKr = data.data.chemProdNmKr; // 화학물질국문명
        this.msds.chemProdNmEn = this.$comm.isStringEmpty(
          data.data.chemProdNmEn
        )
          ? data.data.chemProdNmKr
          : data.data.chemProdNmEn; // 화학물질영문명
        this.msds.chemProdNo = data.data.chemProdNo; // 화학물질번호
        this.msds.sapMatCd = data.data.sapMatCd; // SAP 자재번호

        this.msds.makecpCd = data.data.makerCd; // 제조업체 코드
        this.msds.makecpNm = data.data.makerNm; // 제조업체명
        this.msds.vendorCd = data.data.vendorCd; // 납품업체코드
        this.msds.vendorNm = data.data.vendorNm; // 납품업체명

        this.msds.property = data.data.property; // 성상
        this.msds.propertyNm = data.data.propertyNm; // 성상명
        this.msds.moleWeight = data.data.moleWeight; // 분자량
        this.msds.boilpoint = data.data.boilpoint; // 끓는점
        this.msds.meltingPnt = data.data.meltingPnt; // 녹는점
        this.msds.flashingPnt = data.data.flashingPnt; // 인화점
        this.msds.usageCd = data.data.usageCd; // 주요용도
        this.msds.usageNm = data.data.usageNm; // 주요용도명

        let isMsdsFind = this.uploadedMsdsList.length > 0 ? true : false;
        this.$_.forEach(this.saveAttachFiles, (item) => {
          if (item.taskClassNm === 'MSDS') {
            isMsdsFind = true;
          }
        });
        if (!isMsdsFind) {
          this.getChemProdMSDSFile();
        }
      }
    },
    getChemProdMSDSFile() {
      this.$http.url = selectConfig.attachFile.list.url;
      this.$http.type = 'GET';
      this.$http.param = {
        taskClassNm: 'CHEMPROD_MSDS',
        taskKey: this.msds.chemProdNo.toString(),
      };
      this.attachFileGrps.loadOtherFileGrps = [];
      this.$http.request((_result) => {
        if (_result.data && _result.data.length > 0) {
          // 업로드 파일 정보를 전달.
          this.$_.forEach(this.attachFileGrps, (item) => {
            if (item.taskClassNm === 'MSDS') {
              item.loadOtherFileGrps = this.$_.clone(_result.data);
            }
          });
        }
      });
    },
    btnSaveClickedCallback(_result) {
      this.showRevisionAndUpdateButton = true;
      this.popupParam.msdsRqstNo = _result.data.msdsRqstNo;
      this.msds = _result.data;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // '안내',
        message: 'M0000000006', // '저장되었습니다.',
        type: 'success', // success / info / warning / error
      });
      this.isSave = false;
      // 불러오기한 파일이 있는 경우 해당 정보를 지운다.
      this.setClearMsdsFileList();
      this.saveAttach();
      // this.closePopup();
      this.editable = true;
      this.updateMode = false;
      this.isEnable = false;
      this.revDisabled = true;
    },
    btnRenewClickedCallback(_result) {
      this.isRevisionButtonClicked = false;
      this.popupParam.msdsRqstNo = _result.data.msdsRqstNo;
      this.msds = _result.data;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // '안내',
        message: 'M0000000631', // '개정되었습니다.',
        type: 'success', // success / info / warning / error
      });
      this.isRenew = false;
      // 불러오기한 파일이 있는 경우 해당 정보를 지운다.
      this.setClearMsdsFileList();
      this.saveAttach();
      this.showRevisionAndUpdateButton = true;
      this.isEnable = false;
      this.revDisabled = true;
    },
    saveAttach() {
      // task_key 를 셋팅한다.
      this.$_.forEach(this.attachFileGrps, (item) => {
        item.taskKey = this.msds.msdsRqstNo;
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
      }
    },
    btnClickedErrorCallback(_result) {
      this.isSave = false;
      // 불러오기한 파일이 있는 경우 해당 정보를 지운다.
      this.setClearMsdsFileList();
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    renewalMode() {
      // 제개정구분이 개정이 되며 개정번호를 수정할 수 있게 된다.
      this.showRevisionAndUpdateButton = false;
      this.isRevisionButtonClicked = false;
      this.revNumMode = true;
      this.isEnable = true;
      this.chemProdMsdsYn = '';
      this.revDisabled = false;
      this.tempRevType = this.$_.clone(this.msds.revType);
      this.tempRevNum = this.$_.clone(this.msds.revNum);
      this.msds.revType = 'U';

      // MSDS 파일을 다시 올려야 함으로 file 리스트를 없앤다
      let taskKey = '';
      this.attachFileGrps = [
        {
          label: 'L0000000127', // 'MSDS',
          listType: 'text',
          drag: false,
          showFileSearch: !this.disabled,
          editable: this.editable,
          disabled: this.disabled,
          limit: 3,
          multiple: true,
          uploadTempFiles: null,
          loadOtherFileGrps: null, // msds불러오기 한 파일 정보
          taskClassNm: 'MSDS',
          taskKey: taskKey,
          taskFlag: '',
          createUserId: this.$store.getters.token,
          isOtherFile: true,
        },
        {
          label: 'L0000000132', // 'MSDS요약파일',
          listType: 'text',
          drag: false,
          showFileSearch: !this.disabled,
          editable: this.editable,
          disabled: this.disabled,
          limit: 5,
          multiple: true,
          uploadTempFiles: null,
          loadOtherFileGrps: null,
          taskClassNm: 'MSDS_SUMMARY',
          taskKey: taskKey,
          taskFlag: '',
          createUserId: this.$store.getters.token,
          isOtherFile: false,
        },
      ];
    },
    // 개정 취소 버튼
    cancel() {
      this.isRevisionButtonClicked = true;
      this.showRevisionAndUpdateButton = true;
      this.isEnable = false;
      this.revDisabled = true;
      this.updateMode = false;
      this.msds.revNum = this.$_.clone(this.tempRevNum);
      this.msds.revType = this.$_.clone(this.tempRevType);

      this.setAttachFileGrps();
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
    setUploadedList(data) {
      if (data.taskClassNm === 'MSDS') {
        this.uploadedMsdsList = [];
        this.$_.forEach(data.data, (_item) => {
          this.uploadedMsdsList.push({
            fileNo: _item.fileNo,
          });
        });
      }
    },
    setClearOtherFileList(data) {
      if (data.taskClassNm === 'MSDS') {
        if (data.length > 0) {
          this.msds.chemProdMsdsYn = 'Y';
          this.uploadedMsdsList = data.data;
          this.$_.forEach(this.attachFileGrps, (item) => {
            if (item.taskClassNm === 'MSDS') {
              item.loadOtherFileGrps = data.data;
            }
          });
        } else {
          this.setClearMsdsFileList();
        }
      }
    },
    setClearMsdsFileList() {
      this.msds.chemProdMsdsYn = '';
      this.uploadedMsdsList = [];
      this.$_.forEach(this.attachFileGrps, (item) => {
        if (item.taskClassNm === 'MSDS') {
          item.loadOtherFileGrps = null;
        }
      });
    },
    btnDeleteClickedCallback(_result) {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321' /* 확인 */,
        message: 'M0000000012' /* 삭제하시겠습니까? */,
        type: 'info',
        // 확인 callback 함수
        confirmCallback: () => {
          this.$http.url = this.$format(this.deleteUrl, this.msds.msdsRqstNo);
          this.$http.type = 'DELETE';
          this.$http.request(
            (_result) => {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395' /* 안내 */,
                message: 'M0000000007' /* 삭제되었습니다 */,
                type: 'success',
              });
              this.closePopup();
            },
            (_error) => {
              window.getApp.$emit(
                'APP_REQUEST_ERROR',
                'M0000000016'
                /* 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요. */
              );
            }
          );
        },
        // 취소 callback 함수
        cancelCallback: () => {},
      });
    },
    searchVendor(gubun) {
      this.popupOptions.target = () =>
        import(`${'../../vendor/baseInfo/vendorMaster.vue'}`);
      this.popupOptions.title = 'L0000001951'; // '업체';
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        popupMode: true,
        vendorTypeCd: 'CVET3',
        gubun: gubun,
      };
      this.popupOptions.closeCallback = this.closeVendorPopup;
    },
    closeVendorPopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data.data !== 'C') {
        if (data.gubun === 'V') {
          this.msds.vendorNm = data.data.vendorNm;
          this.msds.vendorCd = data.data.vendorCd;
        } else {
          this.msds.makecpNm = data.data.vendorNm;
          this.msds.makecpCd = data.data.vendorCd;
        }
      }
    },
  },
};
</script>
