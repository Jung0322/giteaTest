<!--
  목적 : 안전 > 아차사고 > 상세화면
  Detail : 아차사고 등록 수정 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row>
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 아차사고 상세 -->
            <y-label
              label="L0000001834"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- <y-btn
                v-if="updateMode && editable && !popupParam.apprFlag && !apprMode"
                color="black"
                title="결재요청"
                @btnClicked="openAppr"
              />-->
              <!-- 완료 -->
              <y-btn
                v-if="editCompletable && editable"
                :action-url="editCompleUrl"
                :param="nearmiss"
                :is-submit="isComple"
                title="L0000002039"
                color="black"
                action-type="PUT"
                beforeSubmit="beforeEditComple"
                @beforeEditComple="beforeEditComple"
                @btnClicked="btnEditCompleClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 저장 -->
              <y-btn
                v-if="insertable && editable"
                :action-url="insertUrl"
                :param="nearmiss"
                :is-submit="isInsert"
                title="L0000002474"
                color="orange"
                action-type="POST"
                beforeSubmit="beforeInsert"
                @beforeInsert="beforeInsert"
                @btnClicked="btnInsertClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 저장 -->
              <y-btn
                v-if="updateMode && editable"
                :action-url="editUrl"
                :param="nearmiss"
                :is-submit="isEdit"
                title="L0000002474"
                color="orange"
                action-type="PUT"
                beforeSubmit="beforeEdit"
                @beforeEdit="beforeEdit"
                @btnClicked="btnEditClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 삭제 -->
              <y-btn
                v-if="updateMode && editable && !popupParam.apprFlag"
                :action-url="deleteUrl"
                :param="deleteValue"
                :is-submit="isDelete"
                title="L0000001495"
                color="red"
                action-type="DELETE"
                beforeSubmit="beforeDelete"
                @beforeDelete="beforeDelete"
                @btnClicked="btnDeleteClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 닫기 -->
              <y-btn
                v-if="!popupParam.apprFlag"
                title="L0000000881"
                @btnClicked="btnClosePopup"
              />
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-plant
                type="edit"
                :editable="editable"
                :disabled="!plantDisabled"
                name="plantCd"
                v-model="nearmiss.plantCd"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 사고명 -->
              <y-text
                :width="8"
                :disabled="true"
                :editable="editable"
                ui="bootstrap"
                label="L0000001390"
                name="nearmissTitle"
                v-model="nearmiss.nearmissTitle"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 발행번호 -->
              <y-text
                :width="8"
                :disabled="true"
                :editable="editable"
                ui="bootstrap"
                label="L0000001103"
                name="nearmissNum"
                v-model="nearmiss.nearmissNum"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <b-row>
                <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
                  <!-- 보고자 -->
                  <y-label label="L0000001246" />
                </b-col>
                <b-col sm="8" md="8" lg="8" xl="8" class="col-xxl-8">
                  <y-label
                    :label="
                      nearmiss.rptDeptNm +
                      ' / ' +
                      nearmiss.rptUserId +
                      ' / ' +
                      nearmiss.showUserNm
                    "
                    :fieldable="true"
                  />
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <b-row>
                <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
                  <!-- 보고일시 -->
                  <y-label label="L0000001245" />
                </b-col>
                <b-col sm="8" md="8" lg="8" xl="8" class="col-xxl-8">
                  <y-label :label="nearmiss.showDt" :fieldable="true" />
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 사고자구분 -->
              <y-select
                :width="8"
                :comboItems="comboNearmissDivisionsItems"
                :needDefaultView="true"
                :disabled="disabled"
                :required="true"
                :editable="editable"
                v-model="nearmiss.nearKindCd"
                type="edit"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="L0000001403"
                name="nearKindCd"
                v-validate="'required'"
                :state="validateState('nearKindCd')"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 사고종류 -->
              <y-multi-select
                :width="8"
                :required="true"
                :editable="editable"
                :disabled="disabled"
                :comboItems="comboOccTypeItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                name="tempOccTypeCd"
                label="L0000001406"
                v-model="tempOccTypeCd"
                v-validate="'required'"
                :state="validateState('tempOccTypeCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 발생일시 -->
              <y-datepicker
                :width="8"
                :required="true"
                :disabled="disabled"
                :editable="editable"
                label="L0000001079"
                type="datetime"
                :minuteStep="1"
                name="nearmissDateTime"
                v-model="nearmiss.nearmissDateTime"
                v-validate="'required'"
                :state="validateState('nearmissDateTime')"
                :clearable="true"
              ></y-datepicker>
            </b-col>
            <b-col
              v-if="isEtc"
              sm="12"
              md="12"
              lg="12"
              xl="12"
              class="col-xxl-12"
            >
              <!-- 사고종류 기타 -->
              <y-text
                :width="10"
                :maxlength="50"
                :editable="editable"
                :disabled="disabled"
                ui="bootstrap"
                label="L0000003654"
                name="nearmissTypeEtc"
                v-model="nearmiss.nearmissTypeEtc"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 발생부서 -->
              <y-tree-dept
                :required="true"
                :disabled="disabled"
                :editable="editable"
                :plantCd="nearmiss.plantCd"
                label="L0000001076"
                v-model="nearmiss.deptCd"
                v-validate="'required'"
                :state="validateState('deptCd')"
                @setDeptNm="setDeptNm"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 발생장소 -->
              <y-text
                :width="8"
                :maxlength="30"
                :disabled="disabled"
                :editable="editable"
                :required="true"
                label="L0000001081"
                ui="bootstrap"
                name="area"
                v-model="nearmiss.area"
                v-validate="'required'"
                :state="validateState('area')"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 공정상태 -->
              <y-select
                :width="8"
                :editable="editable"
                :disabled="disabled"
                :required="true"
                :comboItems="comboProcessStatusCdItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                name="prcsStateCd"
                label="L0000000536"
                v-model="nearmiss.prcsStateCd"
                v-validate="'required'"
                :state="validateState('prcsStateCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 날씨 -->
              <y-select
                :width="8"
                :comboItems="comboWeatherItems"
                :disabled="disabled"
                :editable="editable"
                :required="true"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                name="wethCd"
                label="L0000000803"
                v-model="nearmiss.wethCd"
                v-validate="'required'"
                :state="validateState('wethCd')"
              ></y-select>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <b-row>
                <b-col sm="2" md="2" lg="2" xl="2" class="col-xxl-2">
                  <!-- 사고개요 -->
                  <!-- '항목사용' -->
                  <y-label
                    label="L0000001384"
                    :required="true"
                    :editable="editable"
                    :isCheck="true"
                    :comboItems="contentItems"
                    @checkBoxChange="checkBoxChange"
                  />
                </b-col>
                <b-col sm="10" md="10" lg="10" xl="10" class="col-xxl-10">
                  <y-textarea
                    :width="12"
                    :editable="editable"
                    :maxlength="150"
                    :disabled="disabled"
                    :rows="7"
                    ui="bootstrap"
                    name="contents"
                    v-model="nearmiss.contents"
                    v-validate="'required'"
                    :state="validateState('contents')"
                  ></y-textarea>
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <!-- 조치사항 -->
              <y-text
                :width="10"
                :maxlength="30"
                :disabled="disabled"
                :editable="editable"
                label="L0000002679"
                ui="bootstrap"
                name="bgnMeas"
                v-model="nearmiss.bgnMeas"
              ></y-text>
            </b-col>
            <!-- 발생형태 -->
            <el-divider content-position="left">{{
              this.$comm.getLangSpecInfoLabel('L0000001082')
            }}</el-divider>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 대분류 -->
              <y-select
                :width="8"
                :comboItems="comboFormOcuurMainCategoryItems"
                :disabled="disabled"
                :editable="editable"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                name="occPtnClsCd"
                label="L0000000912"
                v-model="nearmiss.occPtnClsCd"
                :required="true"
                v-validate="'required'"
                :state="validateState('occPtnClsCd')"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 중분류 -->
              <y-select
                :width="8"
                :comboItems="comboFormOcuurCategoryItems"
                :disabled="disabled"
                :editable="editable"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="L0000002729"
                name="occPtnMClsCd"
                v-model="nearmiss.occPtnMClsCd"
                :required="true"
                v-validate="'required'"
                :state="validateState('occPtnMClsCd')"
              ></y-select>
            </b-col>
            <!-- 사고원인 -->
            <el-divider content-position="left">{{
              this.$comm.getLangSpecInfoLabel('L0000001397')
            }}</el-divider>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 직접원인 -->
              <y-select
                :width="8"
                :comboItems="comboAccidentImmCauseItems"
                :disabled="disabled"
                :editable="editable"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                name="immCauseCd"
                label="L0000002771"
                v-model="nearmiss.immCauseCd"
                :required="true"
                v-validate="'required'"
                :state="validateState('immCauseCd')"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 간접원인 -->
              <y-select
                :width="8"
                :comboItems="comboAccidentIndCauseItems"
                :disabled="disabled"
                :editable="editable"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                name="indCauseCd"
                label="L0000000220"
                v-model="nearmiss.indCauseCd"
                :required="true"
                v-validate="'required'"
                :state="validateState('indCauseCd')"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 기인물 -->
              <y-select
                :width="8"
                :comboItems="comboOriginMatCdItems"
                :disabled="disabled"
                :editable="editable"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                name="originMatCd"
                label="L0000000781"
                v-model="nearmiss.originMatCd"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 가해물 -->
              <y-select
                :width="8"
                :comboItems="comboAssMatCdItems"
                :disabled="disabled"
                :editable="editable"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                name="assMatCd"
                label="L0000000219"
                v-model="nearmiss.assMatCd"
                :required="true"
                v-validate="'required'"
                :state="validateState('assMatCd')"
              ></y-select>
            </b-col>
          </b-row>
          <b-row>
            <b-col sm="12" v-show="nearmiss.nearKindCd === 'ACKD1'">
              <y-auigrid
                ref="yAuiGrid"
                :headers="gridOptions.header"
                :btns="gridOptions.btns"
                :items="nearmiss.nearmissVictimList"
                :height="gridOptions.height"
                :label="this.$comm.getLangSpecInfoLabel('L0000001402')"
                :useExcelExport="false"
                :showRowCheckColumn="!disabled && editable"
                :showItemCount="false"
                @btnSearchUser="btnSearchUserClicked"
                @btnDeleteUser="btnDeleteUserClicked"
                @btnClickedError="btnClickedErrorCallback"
                @cellEditEnd="cellEditEndHandler"
              />
            </b-col>

            <b-col sm="12" v-show="nearmiss.nearKindCd === 'ACKD2' || nearmiss.nearKindCd === 'ACKD3'">
              <y-auigrid
                ref="yAuiGrid2"
                :editable="!disabled && editable"
                :headers="gridOptions2.header"
                :btns="gridOptions2.btns"
                :items="nearmiss.nearmissVictimList"
                :height="gridOptions.height"
                :label="this.$comm.getLangSpecInfoLabel('L0000001402')"
                :useExcelExport="false"
                :showRowCheckColumn="!disabled && editable"
                :showItemCount="false"
                @btnAddUser="btnAddUserClicked"
                @btnDeleteVendor="btnDeleteVendorClicked"
                @btnClickedError="btnClickedErrorCallback"
                @cellEditEnd="cellEditEndHandler"
              />
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
    <b-row class="mt-3"></b-row>
    <el-tabs type="border-card" v-model="tabIndex">
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
        <keep-alive>
          <component
            :is="component"
            v-if="component && i === 0"
            :nearmiss="nearmiss"
            :tabParam.sync="tabParam"
            :submitObject="submitObject"
            :attachFileGrps="attachFileGrps"
            :saveAttachFiles="saveAttachFiles"
            :isUpdatePictureExplain="isUpdatePictureExplain"
            @changeUploadFiles="changeUploadFiles"
            @setTempDeleteFiles="setTempDeleteFiles"
            @updatedPictureExplain="updatedPictureExplain"
          />
          <component
            :is="component"
            v-if="component && i > 0"
            :nearmiss="nearmiss"
            :tabParam.sync="tabParam"
            :submitObject2="submitObject2"
            :attachFileGrps2="attachFileGrps2"
            :saveAttachFiles2="saveAttachFiles2"
            @changeUploadFiles2="changeUploadFiles2"
            @setTempDeleteFiles2="setTempDeleteFiles2"
            @closePopup="btnClosePopup2"
            @updatedPictureExplain="updatedPictureExplain"
          />

          <!-- <component
            :is="component"
            v-if="component"
            :nearmiss="nearmiss"
            :tabParam.sync="tabParam"
            :submitObject="submitObject"
            :attachFileGrps="attachFileGrps"
            :saveAttachFiles="saveAttachFiles"
            @changeUploadFiles="changeUploadFiles"
            @setTempDeleteFiles="setTempDeleteFiles"
            :submitObject2="submitObject2"
            :attachFileGrps2="attachFileGrps2"
            :saveAttachFiles2="saveAttachFiles2"
            :isUpdatePictureExplain="isUpdatePictureExplain"
            @changeUploadFiles2="changeUploadFiles2"
            @setTempDeleteFiles2="setTempDeleteFiles2"
            @closePopup="btnClosePopup2"
            @updatedPictureExplain="updatedPictureExplain"
          />-->
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
/* eslint-disable */
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
import moment from 'moment';
export default {
  /* attributes: name, components, props, data */
  name: 'y-nearmiss-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        safNearmissNo: 0, // 아차사고 번호
        bizApprStepCd: '', // 결재진행상태
        processStepCd: '', // 진행단계
        apprFlag: false, // 결재여부
      },
    },
  },
  data: () => ({
    // TODO : 현재까지 파악된 바로는 tab은 같은 폴더 또는 하위 폴더의 컴포넌트만 접근이 가능한 것으로 파악됨
    //        즉, 반드시 메인페이지 역할을 하는 vue와 동일 폴더나 하위 폴더에 tabItem 역할을 하는 vue 파일을 위치 시킬 것
    tabItems: [
      { title: 'L0000000572', url: 'multiFileUpload' }, // 관련사진
      { title: 'L0000000259', url: 'imprActTab' }, // 개선사항
      { title: 'L0000002843', url: 'fileUploadPage' }, // 첨부파일
    ],
    popupOptions: {
      target: null,
      title: '',
      visible: false,
      width: '90%',
      top: '10px',
      param: {},
      closeCallback: null,
    },
    // 개선조치를 위한 변수
    tabParam: {
      imprClassCd: 'ICL02',
      refTableId: 0,
      editable: true,
      message: 'M0000000687', // 개선사항 입력은 아차사고 등록후 진행단계가 작성중일때만 입력 가능합니다.
      detailCheck: false,
    },
    component: null,
    tabIndex: 0,

    insertable: false,
    editable: false,
    updateMode: false,
    editCompletable: false,
    plantDisabled: true,
    disabled: false,
    isInsert: false,
    isEdit: false,
    isComple: false,
    isDelete: false,
    nearmiss: {
      safNearmissNo: 0, // 아차사고 번호
      plantCd: '', // 사업장
      plantNm: '',
      nearmissTitle: '', // 아차사고명
      nearmissNum: '', // 발행번호
      rptDeptCd: '', // 보고자부서
      rptDeptNm: '', // 보고자부서명
      showUserNm: '', // 보고자명
      rptUserId: '', // 보고자ID
      showDt: '', // 보고일시
      nearKindCd: null, // 사고구분
      nearmissOcctypeList: [], // 사고종류목록
      nearmissTypeEtc: '', // 사고종류기타
      nearmissDateTime: null,
      nearmissYmd: '', // 발생일
      nearmissHour: '00', // 발생시간
      nearmissMinute: '00', // 발생분
      deptCd: null, // 부서코드
      deptNm: '',
      area: '', // 발생장소
      prcsStateCd: null, // 공정상태
      wethCd: null, // 날씨
      contents: '', // 사고개요
      bgnMeas: '', // 조치사항
      occPtnClsCd: null, // 발생형태 대분류코드
      occPtnMClsCd: null, // 발생형태 중분류코드
      immCauseCd: null, // 직접원인코드
      indCauseCd: null, // 간접원인코드
      originMatCd: null, // 기인물
      assMatCd: null, // 가해물
      processStepCd: '', // 진행단계
      createUserId: '', // 등록자
      updateUserId: '', // 수정자
      nearmissVictimList: [], // 사고자 목록
      nearmissor: '', // 사고자
    },
    tempOccTypeCd: [], // 사고종류 임시
    attachFileGrp: {
      taskClassNm: '',
      taskKey: '',
      createUserId: '',
      showUploadBtn: false,
      editable: true,
      multiple: true,
      drag: true,
      label: '',
      submitCheck: false,
      message: '',
      limit: 5,
      onlyDownload: false,
      provDirectlyReason: null,
      provIndirectReason: null,
    },
    YAuiGrid: null,
    gridOptions: {
      header: [],
      height: '200',
    },
    YAuiGrid2: null,
    gridOptions2: {
      header: [],
      height: '200',
    },
    selectedValue2: [],
    comboNearmissDivisionsItems: [], // 사고구분
    comboOccTypeItems: [], // 사고종류
    comboProcessStatusCdItems: [], // 공정상태
    comboWeatherItems: [], // 날씨
    comboFormOcuurMainCategoryItems: [], // 대분류
    comboFormOcuurCategoryItems: [], // 중분류
    comboAccidentImmCauseItems: [], // 사고직업원인
    comboAccidentIndCauseItems: [], // 사고간접원인
    comboOriginMatCdItems: [], // 기인물
    comboAssMatCdItems: [], // 가해물
    contentItems: [],

    plantItems: [], // 사업장
    comboProvDirectlyReasonItems: [],
    isEtc: false, // 사고종류기타

    submitObject: {
      submitCheck: false,
    },
    saveAttachFiles: [],
    tempDeleteFiles: [],
    attachFileGrps: [],

    submitObject2: {
      submitCheck2: false,
    },
    saveAttachFiles2: [],
    tempDeleteFiles2: [],
    attachFileGrps2: [],

    insertUrl: '',
    editUrl: '',
    editCompleUrl: '',
    deleteUrl: '',
    deleteValue: null,
    accidentHourMinute: '', // 발생시분
    isEtcOccTypeEtc: false,
    isEtcCauTypeEtc: false,
    vendorTempId: 0,
    apprMode: false,
    plantList: [],
    // 사진 설명 수정 처리 여부
    isUpdatePictureExplain: false,
  }),
  watch: {
    tabIndex: function (newValue, oldValue) {
      this.loadComponent();
    },
    tempOccTypeCd: function (newValue, oldValue) {
      if (!newValue) return;
      if (
        newValue.length > 0 &&
        this.$_.indexOf(this.$_.map(newValue, 'code'), 'OCC10') !== -1
      ) {
        this.isEtc = true;
      } else this.isEtc = false;
    },
    'nearmiss.deptCd': function (newValue, oldValue) {
      this.setNearmissTitle();
    },
    'nearmiss.area': function (newValue, oldValue) {
      this.setNearmissTitle();
    },
    'nearmiss.occPtnClsCd': function (newValue, oldValue) {
      this.$comm.getComboItems(newValue, false).then((_result) => {
        this.comboFormOcuurCategoryItems = _result;
      });
      this.setNearmissTitle();
    },
    'nearmiss.processStepCd': function () {
      this.setEditTable();
      this.setAttachFileGrps();
      this.setAttachFile();
      this.loadComponent();
    },
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
     this.init();
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.YAuiGrid2 = this.$refs.yAuiGrid2;

    this.mountInit();
  },
  created() {
    // console.log('Start create');
  },
  //* methods */
  methods: {
    init() {
      this.setEditTable();

      this.comboFormOcuurCategoryItems = [
        { code: null, codeNm: this.$comm.getLangSpecInfoLabel('L0000003394') }, // '선택하세요';
      ];
      this.comboProvDirectlyReasonItems = [
        { code: null, codeNm: this.$comm.getLangSpecInfoLabel('L0000003394') }, // '선택하세요';
      ];
      this.contentItems = [
        { code: 'Y', codeNm: this.$comm.getLangSpecInfoLabel('L0000003209') },
      ];

      // 사고구분
      this.$comm.getComboItems('SAF_ACCIDENT_KIND', false).then((_result) => {
        this.comboNearmissDivisionsItems = _result;
      });
      // 사고종류
      this.$comm.getComboItems('SAF_OCC_TYPE').then((_result) => {
        this.comboOccTypeItems = _result;
      });
      // 공정상태
      this.$comm.getComboItems('SAF_PRCS_STATE', false).then((_result) => {
        this.comboProcessStatusCdItems = _result;
      });
      // 날씨
      this.$comm.getComboItems('SAF_WEATHER', false).then((_result) => {
        this.comboWeatherItems = _result;
      });
      // 대분류
      this.$comm
        .getComboItems('SAF_ACCIDENT_OCC_PTN_CLS', false)
        .then((_result) => {
          this.comboFormOcuurMainCategoryItems = _result;
        });
      // 사고직접원인
      this.$comm
        .getComboItems('SAF_ACCIDENT_IMM_CAUSE', false)
        .then((_result) => {
          this.comboAccidentImmCauseItems = _result;
        });
      // 사고간접원인
      this.$comm
        .getComboItems('SAF_ACCIDENT_IND_CAUSE', false)
        .then((_result) => {
          this.comboAccidentIndCauseItems = _result;
        });
      // 기인물
      this.$comm
        .getComboItems('SAF_ACCIDENT_ORGIN_MAT', false)
        .then((_result) => {
          this.comboOriginMatCdItems = _result;
        });
      // 가해물
      this.$comm
        .getComboItems('SAF_ACCIDENT_ASS_MAT', false)
        .then((_result) => {
          this.comboAssMatCdItems = _result;
        });
      // 사업장
      this.$comm.getComboItems('COM_PLANT_CD', false).then((_result) => {
        this.plantList = _result;
      });

      // Url Setting
      this.insertUrl = transactionConfig.saf.nearmiss.insert.url;
      this.editUrl = transactionConfig.saf.nearmiss.edit.url;
      this.editCompleUrl = transactionConfig.saf.nearmiss.editComple.url;
      this.deleteUrl = transactionConfig.saf.nearmiss.delete.url;

      this.gridInit();
    },
    mountInit() {
      if (this.popupParam.safNearmissNo > 0) {
        this.plantDisabled = false;
        this.nearmiss.safNearmissNo = this.popupParam.safNearmissNo;
        this.nearmiss.processStepCd = this.popupParam.processStepCd;
        let callBackFunctions = [this.setAttachFileGrps, this.setAttachFile];
        this.getData(callBackFunctions);
        // this.setAttachFileGrps();
        // this.setAttachFile();
        // this.setDetailData();
      } else {
        this.insertable = true;
        this.updateMode = false;
        this.nearmiss.nearmissYmd = this.$comm.getToday();
        this.nearmiss.nearmissHour = '00';
        this.nearmiss.nearmissMinute = '00';
        this.tabParam.editable = false;
        this.nearmiss.plantCd = this.$store.getters.plantCd;
        this.nearmiss.plantNm = this.$store.getters.plantNm;
        this.setDetailData();
        this.setAttachFileGrps();
        this.setAttachFile();
      }
    },
    setEditTable() {
      this.editable = this.$route.meta.editable;
    },
    setAttachFileGrps() {
      this.setEditTable();
      let taskKey = this.nearmiss.safNearmissNo
        ? this.nearmiss.safNearmissNo.toString()
        : '';
      this.attachFileGrps = [
        {
          label: 'L0000002525', // 전체배경[* 사진만 첨부]
          uploadTempFiles: null,
          taskClassNm: 'NERMISS_ALL',
          taskKey: taskKey,
          drag: !this.disabled,
          editable:
            this.nearmiss.processStepCd == 'NEMS2' ? false : this.editable,
          disabled:
            this.nearmiss.processStepCd == 'NEMS2' ? true : !this.editable,
          onlyDownload: this.disabled,
          createUserId: this.$store.getters.token,
        },
        {
          label: 'L0000000739', // 근거리범위 [* 사진만 첨부]
          uploadTempFiles: null,
          taskClassNm: 'NERMISS_NEAR',
          taskKey: taskKey,
          drag: !this.disabled,
          editable:
            this.nearmiss.processStepCd == 'NEMS2' ? false : this.editable,
          disabled:
            this.nearmiss.processStepCd == 'NEMS2' ? true : !this.editable,
          onlyDownload: this.disabled,
          createUserId: this.$store.getters.token,
        },
        {
          label: 'L0000002716', // 주변작업환경[* 사진만 첨부]
          uploadTempFiles: null,
          taskClassNm: 'NERMISS_WORK',
          taskKey: taskKey,
          drag: !this.disabled,
          editable:
            this.nearmiss.processStepCd == 'NEMS2' ? false : this.editable,
          disabled:
            this.nearmiss.processStepCd == 'NEMS2' ? true : !this.editable,
          onlyDownload: this.disabled,
          createUserId: this.$store.getters.token,
        },
      ];
    },
    setAttachFile() {
      this.setEditTable();
      let taskKey = this.nearmiss.safNearmissNo
        ? this.nearmiss.safNearmissNo.toString()
        : '';
      this.attachFileGrps2 = [
        {
          label: 'L0000003030', // 파일업로드
          uploadTempFiles: null,
          taskClassNm: 'NEARMISS',
          taskKey: taskKey,
          drag: !this.disabled,
          editable:
            this.nearmiss.processStepCd == 'NEMS2' ? false : this.editable,
          disabled:
            this.nearmiss.processStepCd == 'NEMS2' ? true : !this.editable,
          onlyDownload: this.disabled,
          createUserId: this.$store.getters.token,
        },
      ];
    },
    changeUploadFilesT(data) {
      this.uploadFiles = data;
    },
    loadComponent() {
      var path = this.tabItems[this.tabIndex].url;
      this.tabParam.refTableId = this.nearmiss.safNearmissNo;
      this.tabParam.detailCheck = this.disabled;
      this.tabParam.editable = !this.disabled;

      if (path === 'multiFileUpload') {
        this.component = () =>
          import('@/pages/common/attachFile/multiFileUpload');
      } else if (path === 'fileUploadPage') {
        this.component = () => import('./multiFileUpload2');
      } else if (path === 'imprActTab') {
        this.component = () => import('@/pages/impr/imprActTab');
      } else {
        this.component = () => import(`${path}`);
      }
    },
    /* 데이터 조회 */
    getData(_callbackFunctions) {
      this.$http.url = this.$format(
        selectConfig.saf.nearmiss.get.url,
        this.nearmiss.safNearmissNo
      );
      this.$http.type = 'get';
      this.$http.request(
        (result) => {
          if (result.data !== '') {
            // 사고자 정보가 존재하는 경우
            // 사고자 정보가 사용자정보에 있지 않은 데이터의 경우에 제외를 할 수 있도록 key가 될 수 있는 id 값을 넣어줘야 함
            if (
              result.data.nearmissVictimList &&
              result.data.nearmissVictimList.length > 0
            ) {
              this.$_.forEach(result.data.nearmissVictimList, (item) => {
                item.id = this.vendorTempId;
                this.vendorTempId++;
              });
            }
            this.nearmiss = this.$_.clone(result.data);
            this.nearmiss.nearmissOcctypeList = [];

            this.nearmiss.nearmissDateTime = this.nearmiss.nearmissYmd + ' ' + this.nearmiss.nearmissHour + ':' + this.nearmiss.nearmissMinute;

            if (_callbackFunctions && _callbackFunctions.length) {
              this.$_.forEach(_callbackFunctions, (_item) => {
                if (typeof _item === 'function') {
                  _item.call();
                }
              });
            }
          }

          // 발생유형 처리
          this.tempOccTypeCd = [];
          result.data.nearmissOcctypeList.forEach((item) => {
            this.tempOccTypeCd.push({
              code: item.occTypeCd,
              name: item.occTypeNm,
            });
          });

          // 데이터 조회후 진핸단계에 따른 버튼, 셀렉트 박스 disable 처리
          if (this.nearmiss.processStepCd === 'NEMS1') {
            this.insertable = false;
            this.updateMode = true;
            this.editCompletable = true;
          } else if (this.nearmiss.processStepCd === 'NEMS2') {
            this.insertable = false;
            this.updateMode = false;
            this.editCompletable = false;
            this.disabled = true;
            this.tabParam.editable = false;
          } else {
            this.insertable = true;
            this.updateMode = false;
          }

          this.gridOptions.btns = [
            {
              title: this.$comm.getLangSpecInfoLabel('L0000002892'),
              color: 'orange',
              btnClicked: 'btnSearchUser',
              btnClickedError: 'btnClickedError',
              visible: !this.disabled && this.editable,
            }, //추가
            {
              title: this.$comm.getLangSpecInfoLabel('L0000002620'),
              color: 'red',
              btnClicked: 'btnDeleteUser',
              btnClickedError: 'btnClickedError',
              visible: !this.disabled && this.editable,
            }, //제외
          ];
          this.YAuiGrid.setNewBtnArr(this.gridOptions.btns);
          this.gridOptions2.btns = [
            {
              title: this.$comm.getLangSpecInfoLabel('L0000002892'),
              color: 'orange',
              btnClicked: 'btnAddUser',
              btnClickedError: 'btnClickedError',
              visible: !this.disabled && this.editable,
            }, //추가
            {
              title: this.$comm.getLangSpecInfoLabel('L0000002620'),
              color: 'red',
              btnClicked: 'btnDeleteVendor',
              btnClickedError: 'btnClickedError',
              visible: !this.disabled && this.editable,
            }, //제외
          ];
          this.YAuiGrid2.setNewBtnArr(this.gridOptions2.btns);


          if (this.nearmiss.nearKindCd === 'ACKD1') {
            this.YAuiGrid.setGridData(this.nearmiss.nearmissVictimList);
            this.YAuiGrid.resize(null, this.gridOptions.height);
          } else if (this.nearmiss.nearKindCd === 'ACKD2' || this.nearmiss.nearKindCd === 'ACKD3') {
            this.YAuiGrid2.setGridData(this.nearmiss.nearmissVictimList);
            this.YAuiGrid2.resize(null, this.gridOptions.height);
          }

          // if (this.nearmiss.bizApprStepCd) {
          //   this.apprMode = true;
          //   if (this.nearmiss.bizApprStepCd === 'BAPSD') {
          //     // 반려일땐 수정, 삭제 가능
          //     this.updateMode = true;
          //     this.disabled = false;
          //     // if (this.nearmiss.createUserId !== this.$store.getters.token) {
          //     //   this.editable = false;
          //     // }
          //   } else {
          //     if (
          //       this.nearmiss.bizApprStepCd === 'BAPSA' &&
          //       this.popupParam.apprFlag
          //     ) {
          //       // 결재중이며 결재자 처리 시 수정가능
          //       this.updateMode = true;
          //       this.disabled = false;
          //     } else {
          //       this.updateMode = false;
          //       this.disabled = true;
          //     }
          //   }
          // } else {
          // if (this.nearmiss.createUserId !== this.$store.getters.token) {
          //   this.editable = false;
          //   this.disabled = true;
          // }
          // }
          // this.setAttachFileGrps();
          // this.setAttachFile();
          // this.setDetailData();
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /** 사고자 그리드 초기화 */
    gridInit() {
      // 임직원
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001662'),
          dataField: 'victimDeptNm',
          width: '17%',
        }, // 소속
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001630'),
          dataField: 'victimNm',
          width: '17%',
        }, // 성명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001412'),
          dataField: 'victimUserId',
          width: '17%',
        }, // 사번
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002768'),
          dataField: 'victimDutyNm',
          width: '17%',
        }, // 직급
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001545'),
          dataField: 'victimBirthday',
          width: '16%',
        }, // 생년월일
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000802'),
          dataField: 'victimYears',
          width: '16%',
        }, // 나이
      ];
      
      // 협력,외주사,방문객,직원가족 등
      this.gridOptions2.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001662'),
          dataField: 'victimDeptNm',
          width: '20%',
          editRenderer: {
            type: 'InputEditRenderer',
          },
        }, // 소속
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001630'),
          dataField: 'victimNm',
          width: '20%',
          editRenderer: {
            type: 'InputEditRenderer',
          },
        }, // 성명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002768'),
          dataField: 'victimDutyNm',
          width: '20%',
          editRenderer: {
            type: 'InputEditRenderer',
          },
        }, // 직급
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001545'),
          dataField: 'victimBirthday',
          width: '20%',
          editRenderer: {
            type: 'InputEditRenderer',
          },
        }, // 생년월일
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000802'),
          dataField: 'victimYears',
          width: '20%',
          editRenderer: {
            type: 'InputEditRenderer',
          },
        }, // 나이
      ];
    },
    // 현재 사용자
    setDetailData() {
      if (this.nearmiss.safNearmissNo === 0) {
        this.nearmiss.rptDeptNm = this.$store.getters.deptNm;
        this.nearmiss.rptDeptCd = this.$store.getters.deptCd;
        this.nearmiss.showUserNm = this.$store.getters.name;
        this.nearmiss.rptUserId = this.$store.getters.token;
        this.nearmiss.showDt = this.$comm.getTodayDateTime();
      }
    },
    setNearmissTitle() {
      var plantSize = this.$_.size(this.plantList);
      var comboFormOcuurMainCategorySize = this.$_.size(
        this.comboFormOcuurMainCategoryItems
      );
      if (
        this.nearmiss.safNearmissNo === 0 &&
        plantSize !== 0 &&
        comboFormOcuurMainCategorySize !== 0
      ) {
        this.nearmiss.nearmissTitle =
          this.plantList[
            this.$_.findIndex(this.plantList, { code: this.nearmiss.plantCd })
          ].codeNm +
          ' ' +
          (this.nearmiss.deptNm ? this.nearmiss.deptNm + ' ' : '') +
          (this.nearmiss.area ? this.nearmiss.area + ' ' : '') +
          (this.nearmiss.occPtnClsCd
            ? this.comboFormOcuurMainCategoryItems[
                this.$_.findIndex(this.comboFormOcuurMainCategoryItems, {
                  code: this.nearmiss.occPtnClsCd,
                })
              ].codeNm + ' '
            : '') +
          this.$comm.getLangSpecInfoLabel('L0000001832'); // 아차사고
      }
    },
    /**
     * 수정 버튼 안보여지도록 처리
     *  버튼 http 통신 중 error 발생 callback
     * _result : error return하는 데이터
     */
    btnClickedErrorCallback(_result) {
      this.isInsert = false;
      this.isEdit = false;
      this.isComple = false;
      this.isDelete = false;

      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },

    /** end button 관련 이벤트 **/
    // 신규등록
    btnInsertClickedCallback(_result) {
      this.isInsert = false;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // 안내
        message: 'M0000000006', // 저장되었습니다
        type: 'success',
      });

      // if (_result.data > 0) {
      //   this.nearmiss.safNearmissNo = this.$_.clone(_result.data);
      //   this.attachFileGrp.taskKey = this.$_.clone(_result.data);
      //   this.attachFileGrp.submitCheck = true;
      //   this.attachFileGrp.multiple = true;
      // }
      // this.nearmiss.safNearmissNo = this.$_.clone(_result.data);
      this.nearmiss.safNearmissNo = this.$_.clone(_result.data);
      this.saveAttach(this.nearmiss.safNearmissNo.toString());
      this.saveAttach2(this.nearmiss.safNearmissNo.toString());
      this.insertable = false;
      this.updateMode = true;
      this.editCompletable = true;
      this.disabled = false;
      this.tabParam.refTableId = this.nearmiss.safNearmissNo;
      this.tabParam.detailCheck = this.disabled;
      this.tabParam.editable = true;
      this.plantDisabled = false;
      this.getData();
    },
    // 첨부파일 저장
    saveAttach(rsltNo) {
      // task_key 를 셋팅한다.
      this.$_.forEach(this.attachFileGrps, (item) => {
        item.taskKey = rsltNo;
      });

      if (this.tempDeleteFiles.length > 0) {
        this.$http.url = transactionConfig.attachFile.deleteMulti.url;
        this.$http.type = 'DELETE';
        this.$http.param = {
          data: Object.values(this.$_.clone(this.tempDeleteFiles)),
        };
        this.$http.request((_result) => {
          this.tempDeleteFiles = [];
          // 저장할 데이터가 있는 경우
          if (this.saveAttachFiles.length > 0) {
            this.submitObject.submitCheck = !this.submitObject.submitCheck;
          }
          // 저장할 데이터가 없는 경우
          // else this.closePopup();
        });
      } else {
        // 저장할 데이터가 있는 경우
        if (this.saveAttachFiles.length > 0) {
          this.submitObject.submitCheck = !this.submitObject.submitCheck;
        }
        // 저장할 데이터가 없는 경우
        // else this.closePopup();
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
    // 수정
    btnEditClickedCallback(_result) {
      this.isEdit = false;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // 안내
        message: 'M0000000006', // 저장되었습니다.
        type: 'success',
      });
      // this.btnClosePopup();
      this.saveAttach(this.nearmiss.safNearmissNo.toString());
      this.saveAttach2(this.nearmiss.safNearmissNo.toString());
      this.insertable = false;
      this.updateMode = true;
      this.editCompletable = true;
      this.disabled = false;
      this.plantDisabled = false;
    },
    // 삭제
    btnDeleteClickedCallback(_result) {
      this.isDelete = false;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // 안내
        message: 'M0000000007', // 삭제되었습니다.
        type: 'success',
      });
      this.btnClosePopup();
    },
    // 완료
    btnEditCompleClickedCallback(_result) {
      this.isComple = false;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // 안내
        message: 'M0000000078', // 완료되었습니다.
        type: 'success',
      });
      this.insertable = false;
      this.updateMode = false;
      this.editCompletable = false;
      this.disabled = true;
      this.isUpdatePictureExplain = false;
      // this.btnClosePopup();
      this.getData();
    },

    /** 완료 하기전 UI단 유효성 검사 **/
    beforeEditComple() {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321', // 확인
        message: 'M0000000838', // 완료하시겠습니까?
        // TODO : 필요시 추가하세요.
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          this.nearmiss.updateUserId = this.$store.getters.token;
          this.checkValidationComple();
        },
      });
    },
    /** 수정 하기전 UI단 유효성 검사 **/
    beforeEdit() {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321', // 확인
        message: 'M0000000011', // 저장하시겠습니까?
        // TODO : 필요시 추가하세요.
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          if (this.nearmiss.nearmissDateTime) {
            this.nearmiss.nearmissYmd =
              this.nearmiss.nearmissDateTime.substring(0, 10);
            this.nearmiss.nearmissHour =
              this.nearmiss.nearmissDateTime.substring(11, 13);
            this.nearmiss.nearmissMinute =
              this.nearmiss.nearmissDateTime.substring(14, 16);
          }
          this.nearmiss.updateUserId = this.$store.getters.token;
          this.nearmiss.nearmissOcctypeList = [];
          this.tempOccTypeCd.forEach((item) => {
            let occTypeCd = { occTypeCd: item.code };
            this.nearmiss.nearmissOcctypeList.push(occTypeCd);
          });
          this.checkValidationSave();
        },
      });
    },
    beforeInsert() {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321', // 확인
        message: 'M0000000011', // 저장하시겠습니까?
        // TODO : 필요시 추가하세요.
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          this.nearmiss.createUserId = this.$store.getters.token;
          this.nearmiss.plantCd = this.$store.getters.plantCd;
          this.nearmiss.nearmissOcctypeList = [];
          this.tempOccTypeCd.forEach((item) => {
            let occTypeCd = { occTypeCd: item.code };
            this.nearmiss.nearmissOcctypeList.push(occTypeCd);
          });
          this.checkValidationInsert();
        },
      });
    },
    beforeDelete() {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321', // 확인
        message: 'M0000000012', // 삭제하시겠습니까?
        // TODO : 필요시 추가하세요.
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          this.deleteValue = {
            data: this.nearmiss.safNearmissNo,
          };
          this.isDelete = true;
        },
      });
    },
    /**
     * 수정전 유효성 검사
     */
    checkValidationSave() {
      this.$validator
        .validateAll()
        .then((_result) => {
          this.isEdit = _result;
          // TODO : 전역 성공 메시지 처리
          // 이벤트는 ./event.js 파일에 선언되어 있음
          if (!this.isEdit) {
            this.$popupRequired.check(
              'nearmissDetail',
              this.$data,
              this.errors
            );
          }
          this.isUpdatePictureExplain = _result;
        })
        .catch(() => {
          this.isEdit = false;
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000876' // 유효성 검사도중 에러가 발생하였습니다.
          );
        });
    },
    /**
     * 완료전 유효성 검사
     */
    checkValidationComple() {
      this.$validator
        .validateAll()
        .then((_result) => {
          this.isComple = _result;
          // TODO : 전역 성공 메시지 처리
          // 이벤트는 ./event.js 파일에 선언되어 있음
          if (!_result) {
            this.$popupRequired.check(
              'nearmissDetail',
              this.$data,
              this.errors
            );
          }
          this.isUpdatePictureExplain = _result;
        })
        .catch(() => {
          this.isComple = false;
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000876' // 유효성 검사도중 에러가 발생하였습니다.
          );
        });
    },
    checkValidationInsert() {
      this.$validator
        .validateAll()
        .then((_result) => {
          this.isInsert = _result;
          // TODO : 전역 성공 메시지 처리
          // 이벤트는 ./event.js 파일에 선언되어 있음
          if (!this.isInsert) {
            this.$popupRequired.check(
              'nearmissDetail',
              this.$data,
              this.errors
            );
          }
          this.isUpdatePictureExplain = _result;
        })
        .catch(() => {
          this.isInsert = false;
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000876' // 유효성 검사도중 에러가 발생하였습니다.
          );
        });
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
    // 팝업창 닫기
    btnClosePopup(data) {
      // 부모창에 값 전달
      this.$emit('closePopup', { success: true });
    },
    // 팝업창 닫기
    btnClosePopup2(data) {},
    checkBoxChange(val) {
      if (val.length > 0) {
        this.nearmiss.contents =
          '- ' +
          this.$comm.getLangSpecInfoLabel('L0000000852') +
          ' : \n' + // 누가
          '- ' +
          this.$comm.getLangSpecInfoLabel('L0000000853') +
          ' : \n' + // 누구에게
          '- ' +
          this.$comm.getLangSpecInfoLabel('L0000001933') +
          ' : \n' + // 언제
          '- ' +
          this.$comm.getLangSpecInfoLabel('L0000001931') +
          ' : \n' + // 어디서
          '- ' +
          this.$comm.getLangSpecInfoLabel('L0000001035') +
          ' : \n' + // 무엇을
          '- ' +
          this.$comm.getLangSpecInfoLabel('L0000001932') +
          ' : \n' + // 어떻게
          '- ' +
          this.$comm.getLangSpecInfoLabel('L0000002046'); // 왜
      } else {
        if (this.nearmiss.safNearmissNo <= 0) {
          this.nearmiss.contents = '';
        }
      }
    },
    btnSearchUserClicked(_item) {
      this.popupOptions.param = {
        multiple: true,
      };
      this.popupOptions.target = () =>
        import(`${'@/pages/manage/user/userSearch.vue'}`);
      this.popupOptions.title = 'L0000001466'; // 사용자검색
      this.popupOptions.visible = true;
      this.popupOptions.width = '60%';
      this.popupOptions.top = '100px';
      this.popupOptions.closeCallback = this.closePopupSearchUser;
    },
    closePopupSearchUser(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      if (data.users) {
        let pushData = [];
        this.$_.forEach(data.users, (item) => {
          if (
            this.$_.findIndex(this.nearmiss.nearmissVictimList, {
              victimUserId: item.userId,
            }) === -1
          ) {
            let nearmissVictim = {
              victimDeptCd: item.deptCd,
              victimDeptNm: item.deptNm,
              victimNm: item.userNm,
              victimUserId: item.userId,
              victimDutyNm: item.positionNm,
              victimBirthday: item.birthYmd,
              victimYears: '',
            };
            // 나이 계산
            let birthDay = moment(item.birthYmd, 'YYYY-MM-DD');
            let ages = moment().diff(birthDay.format('YYYY-MM-DD'), 'years');
            nearmissVictim.victimYears = ages;
            pushData.push(nearmissVictim);
            this.nearmiss.nearmissVictimList.push(nearmissVictim);
          }
        });
      } else {
        let item = data.user;
        if (
          this.$_.findIndex(this.nearmiss.nearmissVictimList, {
            victimUserId: item.userId,
          }) === -1
        ) {
          let nearmissVictim = {
            victimDeptCd: item.deptCd,
            victimDeptNm: item.deptNm,
            victimNm: item.userNm,
            victimUserId: item.userId,
            victimDutyNm: item.positionNm,
            victimBirthday: item.birthYmd,
            victimYears: '',
          };
          // 나이 계산
          let birthDay = moment(item.birthYmd, 'YYYY-MM-DD');
          let ages = moment().diff(birthDay.format('YYYY-MM-DD'), 'years');
          nearmissVictim.victimYears = ages;
          this.nearmiss.nearmissVictimList.push(nearmissVictim);
        }
      }
    },
    btnDeleteUserClicked() {
      const selectedRows = this.YAuiGrid.getCheckedRowItemsAll();
      if (selectedRows.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000000688', // 제외할 사고자를 선택하세요.
          type: 'warning', // success / info / warning / error
        });
      } else {
        this.$_.forEach(selectedRows, (item) => {
          this.nearmiss.nearmissVictimList = this.$_.reject(
            this.nearmiss.nearmissVictimList,
            { victimUserId: item.victimUserId }
          );
        });
      }
    },
    btnDeleteVendorClicked() {
      if (!this.selectedValue2 || this.selectedValue2.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000000688', // 제외할 사고자를 선택하세요.
          type: 'warning', // success / info / warning / error
        });
      } else {
        this.$_.forEach(this.selectedValue2, (item) => {
          this.nearmiss.nearmissVictimList = this.$_.reject(
            this.nearmiss.nearmissVictimList,
            { id: item.id }
          );
        });
      }
    },
    setDeptNm(deptNm) {
      this.nearmiss.deptNm = deptNm;
    },
    // 사고자 추가(수기입력)
    btnAddUserClicked() {
      let nearmissVictim = {
        victimDeptCd: '',
        victimDeptNm: '',
        victimNm: '',
        victimUserId: '',
        victimDutyNm: '',
        victimBirthday: '',
        victimYears: '',
        id: this.vendorTempId,
      };
      this.nearmiss.nearmissVictimList.push(nearmissVictim);
      this.vendorTempId++;
    },
    openAppr() {
      // 결재팝업 호출
      this.popupOptions.target = () =>
        import(`${'@/pages/manage/appr/comApprRequest.vue'}`);
      this.popupOptions.title = 'L0000003418'; // 결재요청
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closeApprPop;
      this.popupOptions.width = '80%';
      this.popupOptions.param = {
        apprBizCd: 'SA-NR-01',
        apprParams: {
          safNearmissNo: this.nearmiss.safNearmissNo,
        },
      };
    },
    closeApprPop(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data.resultFlag) {
        this.apprMode = true;
        this.insertable = false;
        this.updateMode = false;
        this.disabled = true;
        this.setAttachFileGrps();
        this.setAttachFile();
      }
    },

    // 첨부파일 저장
    saveAttach2(rsltNo) {
      // task_key 를 셋팅한다.
      this.$_.forEach(this.attachFileGrps2, (item) => {
        item.taskKey = rsltNo;
      });

      if (this.tempDeleteFiles2.length > 0) {
        this.$http.url = transactionConfig.attachFile.deleteMulti.url;
        this.$http.type = 'DELETE';
        this.$http.param = {
          data: Object.values(this.$_.clone(this.tempDeleteFiles2)),
        };
        this.$http.request((_result) => {
          this.tempDeleteFiles2 = [];
          // 저장할 데이터가 있는 경우
          if (this.saveAttachFiles2.length > 0) {
            this.submitObject2.submitCheck2 = !this.submitObject2.submitCheck2;
          }
          // 저장할 데이터가 없는 경우
          // else this.closePopup();
        });
      } else {
        // 저장할 데이터가 있는 경우
        if (this.saveAttachFiles2.length > 0) {
          this.submitObject2.submitCheck2 = !this.submitObject2.submitCheck2;
        }
        // 저장할 데이터가 없는 경우
        // else this.closePopup();
      }
    },
    changeUploadFiles2(data) {
      var index = this.$_.findIndex(this.attachFileGrps2, {
        taskClassNm: data.taskClassNm,
      });
      if (index > -1) {
        data.index = index;
        this.attachFileGrps2[index].uploadTempFiles = data;

        // 업로드 하기 위해 올라온 파일들을 저장하는 부분
        // 기존에 들어가 있는 경우에는 덮어쓰고 아닌 경우에는 신규로 넣는다.
        let saveIndex = this.$_.findIndex(this.saveAttachFiles2, {
          taskClassNm: data.taskClassNm,
        });
        if (saveIndex > -1) {
          this.saveAttachFiles2[saveIndex] = this.$_.clone(
            this.attachFileGrps2[index]
          );
        } else {
          this.saveAttachFiles2.push(
            this.$_.clone(this.attachFileGrps2[index])
          );
        }
      }
    },
    setTempDeleteFiles2(data) {
      var pushData = {
        fileNo: data.data.fileNo,
      };
      this.tempDeleteFiles2.push(pushData);
    },
    updatedPictureExplain() {
      this.isUpdatePictureExplain = false;
    },
    cellEditEndHandler(event) {
      this.nearmiss.nearmissVictimList[event.rowIndex][event.dataField] = event.value;
    },
  },
};
</script>
<style>
.cascaderPanelClass {
  height: 100px;
}
</style>
