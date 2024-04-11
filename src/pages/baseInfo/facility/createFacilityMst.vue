<!--
  목적 : 설비관리 > 유형별 설비관리 > 신규등록/수정 팝업
  작성자 : kga
  Detail :
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
            <!-- 설비마스터 상세 -->
            <y-label
              label="L0000001595"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 저장 -->
              <y-btn
                v-if="editable && !disabledFacilityMasterInput"
                :action-url="insertUrl"
                :param="facilityMst"
                :is-submit="isInsert"
                title="L0000002474"
                color="orange"
                :action-type="actionType"
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
        <el-collapse-transition>
          <b-card v-show="show">
            <b-row>
              <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
                <b-row>
                  <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
                    <!-- 등록일 -->
                    <y-label label="L0000000973" />
                  </b-col>
                  <b-col sm="8" md="8" lg="8" xl="8" class="col-xxl-8">
                    <y-label :label="facilityMst.createDt" :fieldable="true" />
                  </b-col>
                </b-row>
              </b-col>
              <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
                <b-row>
                  <!-- 최종수정일 -->
                  <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
                    <y-label label="L0000002888" />
                  </b-col>
                  <b-col sm="8" md="8" lg="8" xl="8" class="col-xxl-8">
                    <y-label
                      :label="
                        facilityMst.updateDt
                          ? facilityMst.updateDt
                          : facilityMst.createDt
                      "
                      :fieldable="true"
                    />
                  </b-col>
                </b-row>
              </b-col>
              <b-col sm="0" md="0" lg="0" xl="0" class="col-xxl-4"></b-col>
              <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
                <y-plant
                  type="edit"
                  :required="true"
                  :editable="editable"
                  :disabled="disabledFacilityMasterInput"
                  name="plantCd"
                  v-model="facilityMst.plantCd"
                  v-validate="'required'"
                  :state="validateState('plantCd')"
                />
              </b-col>
              <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
                <!-- 관리부서 -->
                <y-tree-dept
                  :editable="editable"
                  :required="true"
                  :disabled="disabledFacilityMasterInput"
                  :plantCd="facilityMst.plantCd"
                  label="L0000000591"
                  v-model="facilityMst.deptCd"
                  name="deptCd"
                  v-validate="'required'"
                  :state="validateState('deptCd')"
                />
              </b-col>
              <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
                <y-tree-process
                  :plantCd="facilityMst.plantCd"
                  :deptCd="facilityMst.deptCd"
                  :required="true"
                  :editable="editable"
                  :disabled="disabledFacilityMasterInput"
                  name="processCd"
                  v-model="facilityMst.processCd"
                  v-validate="'required'"
                  :state="validateState('processCd')"
                />
              </b-col>
              <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
                <!-- 설비유형 -->
                <y-tree-facility-type
                  :editable="editable"
                  :disabled="disabledFacilityMasterInput"
                  :required="true"
                  label="L0000001597"
                  name="safFacilityTypeCd"
                  v-validate="'required'"
                  v-model="facilityMst.safFacilityTypeCd"
                  :state="validateState('safFacilityTypeCd')"
                />
              </b-col>
              <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
                <!-- 설비코드 -->
                <y-text
                  :width="8"
                  :editable="editable"
                  :disabled="disabled ? disabled : disabledFacilityMasterInput"
                  :required="true"
                  ui="bootstrap"
                  type="search"
                  label="L0000001618"
                  name="safFacilityCd"
                  v-model="facilityMst.safFacilityCd"
                  v-validate="'required'"
                  :state="validateState('safFacilityCd')"
                ></y-text>
              </b-col>
              <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
                <!-- 설비명 -->
                <y-text
                  :width="8"
                  :editable="editable"
                  :required="true"
                  :disabled="disabledFacilityMasterInput"
                  :maxlength="50"
                  ui="bootstrap"
                  type="search"
                  label="L0000001596"
                  name="facilityNm"
                  v-model="facilityMst.facilityNm"
                  v-validate="'required'"
                  :state="validateState('facilityNm')"
                ></y-text>
              </b-col>
              <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
                <!-- 설치위치 -->
                <y-text
                  :width="8"
                  :editable="editable"
                  :disabled="disabledFacilityMasterInput"
                  :maxlength="50"
                  ui="bootstrap"
                  type="search"
                  label="L0000001626"
                  name="installLocate"
                  v-model="facilityMst.installLocate"
                ></y-text>
              </b-col>
              <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
                <!-- 설치일자 -->
                <y-datepicker
                  :width="8"
                  :editable="editable"
                  :disabled="disabledFacilityMasterInput"
                  label="L0000001627"
                  name="installYmd"
                  :default="facilityMst.installYmd"
                  v-model="facilityMst.installYmd"
                ></y-datepicker>
              </b-col>
              <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
                <!-- 설치업체 -->
                <y-text
                  :width="8"
                  :editable="editable"
                  :disabled="disabledFacilityMasterInput"
                  :maxlength="50"
                  ui="bootstrap"
                  type="search"
                  label="L0000001625"
                  name="installConn"
                  v-model="facilityMst.installConn"
                ></y-text>
              </b-col>
              <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
                <b-row>
                  <b-col sm="8" md="8" lg="8" xl="8" class="col-xxl-8">
                    <!-- 용량/단위 -->
                    <y-number
                      :width="6"
                      :editable="editable"
                      :disabled="disabledFacilityMasterInput"
                      :maxlength="10"
                      :hasSeperator="false"
                      ui="bootstrap"
                      label="L0000002064"
                      name="vol"
                      v-model="facilityMst.vol"
                    />
                  </b-col>
                  <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
                    <!-- volUnit -->
                    <y-text
                      :width="12"
                      :editable="editable"
                      :disabled="disabledFacilityMasterInput"
                      :maxlength="10"
                      ui="bootstrap"
                      name="volUnit"
                      v-model="facilityMst.volUnit"
                    ></y-text>
                  </b-col>
                </b-row>
              </b-col>
              <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
                <!-- 안전관리자 -->
                <y-text
                  :width="8"
                  :editable="editable"
                  :clearable="true"
                  :disabled="true"
                  ui="bootstrap"
                  type="search"
                  label="L0000001846"
                  name="safMgrPsn"
                  v-model="facilityMst.safMgrPsn"
                  :appendIcon="[{ icon: 'search', callbackName: 'searchUser' }]"
                  @searchUser="btnSearchUserClicked"
                ></y-text>
              </b-col>
              <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4"></b-col>
              <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
                <!-- 법정점검 대상여부 -->
                <y-switch
                  :width="8"
                  :editable="editable"
                  :disabled="disabledFacilityMasterInput"
                  true-value="Y"
                  false-value="N"
                  ui="bootstrap"
                  label="L0000001215"
                  name="lawChkYn"
                  selectText="L0000003788"
                  unselectText="L0000003789"
                  v-model="facilityMst.lawChkYn"
                ></y-switch>
              </b-col>
              <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
                <!-- 법정점검 주기 -->
                <y-select
                  v-if="!disabledLaw"
                  :width="8"
                  :editable="editable"
                  :disabled="disabledFacilityMasterInput"
                  :comboItems="lawChkCyeItems"
                  itemText="codeNm"
                  itemValue="code"
                  ui="bootstrap"
                  label="L0000001216"
                  name="lawChkCyeCd"
                  v-model="facilityMst.lawChkCyeCd"
                ></y-select>
                <y-text
                  v-if="disabledLaw"
                  :width="8"
                  :editable="editable"
                  :disabled="true"
                  ui="bootstrap"
                  label="L0000001216"
                ></y-text>
              </b-col>
              <b-col sm="0" md="0" lg="0" xl="0" class="col-xxl-4"></b-col>
              <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
                <!-- 자체점검 대상여부 -->
                <y-switch
                  :width="8"
                  :editable="editable"
                  :disabled="disabledFacilityMasterInput"
                  true-value="Y"
                  false-value="N"
                  ui="bootstrap"
                  label="L0000002338"
                  name="selfChkYn"
                  selectText="L0000003788"
                  unselectText="L0000003789"
                  v-model="facilityMst.selfChkYn"
                ></y-switch>
              </b-col>
              <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
                <!-- 자체점검 주기 -->
                <y-select
                  v-if="!disabledSelf"
                  :width="8"
                  :editable="editable"
                  :disabled="disabledFacilityMasterInput"
                  :comboItems="selfChkCyeItems"
                  itemText="codeNm"
                  itemValue="code"
                  ui="bootstrap"
                  label="L0000002342"
                  name="selfChkCyeCd"
                  v-model="facilityMst.selfChkCyeCd"
                ></y-select>
                <y-text
                  v-if="disabledSelf"
                  :width="8"
                  :editable="editable"
                  :disabled="true"
                  ui="bootstrap"
                  label="L0000002342"
                ></y-text>
              </b-col>
              <b-col sm="0" md="0" lg="0" xl="0" class="col-xxl-4"></b-col>
              <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
                <!-- 안전검사 대상여부 -->
                <y-switch
                  :width="8"
                  :editable="editable"
                  :disabled="disabledFacilityMasterInput"
                  true-value="Y"
                  false-value="N"
                  ui="bootstrap"
                  label="L0000001843"
                  name="safChkYn"
                  selectText="L0000003788"
                  unselectText="L0000003789"
                  v-model="facilityMst.safChkYn"
                ></y-switch>
              </b-col>
              <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
                <!-- 안전검사 주기 -->
                <y-select
                  v-if="facilityMst.safChkYn === 'Y'"
                  :width="8"
                  :editable="editable"
                  :disabled="disabledFacilityMasterInput"
                  :comboItems="selfChkCyeItems"
                  itemText="codeNm"
                  itemValue="code"
                  ui="bootstrap"
                  label="L0000001844"
                  name="safChkCyeCd"
                  v-model="facilityMst.safChkCyeCd"
                ></y-select>
                <y-text
                  v-else
                  :width="8"
                  :editable="editable"
                  :disabled="true"
                  ui="bootstrap"
                  label="L0000001844"
                ></y-text>
              </b-col>
              <b-col sm="0" md="0" lg="0" xl="0" class="col-xxl-4"></b-col>
              <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
                <!-- 안전인증 대상여부 -->
                <y-switch
                  :width="8"
                  :editable="editable"
                  :disabled="disabledFacilityMasterInput"
                  true-value="Y"
                  false-value="N"
                  ui="bootstrap"
                  label="L0000001869"
                  name="safLsnYn"
                  selectText="L0000003788"
                  unselectText="L0000003789"
                  v-model="facilityMst.safLsnYn"
                ></y-switch>
              </b-col>
              <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
                <b-row>
                  <b-col sm="8" md="8" lg="8" xl="8" class="col-xxl-8">
                    <!-- 폐기여부/폐기년도 -->
                    <!-- 폐기, 미폐기 -->
                    <y-switch
                      :width="6"
                      :editable="editable"
                      :disabled="disabledFacilityMasterInput"
                      true-value="Y"
                      false-value="N"
                      ui="bootstrap"
                      label="L0000003126"
                      name="disuseYn"
                      selectText="L0000003101"
                      unselectText="L0000001064"
                      v-model="facilityMst.disuseYn"
                    ></y-switch>
                  </b-col>
                  <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
                    <y-datepicker
                      v-if="!disabledYy"
                      :width="12"
                      :editable="editable"
                      :disabled="disabledYy"
                      type="year"
                      name="disuseYy"
                      :default="facilityMst.disuseYy"
                      v-model="facilityMst.disuseYy"
                    ></y-datepicker>
                    <y-datepicker
                      v-else
                      :width="12"
                      :editable="editable"
                      :disabled="true"
                      type="year"
                      name="disuseYy"
                      :default="facilityMst.disuseYy"
                      v-model="facilityMst.disuseYy"
                    ></y-datepicker>
                  </b-col>
                </b-row>
              </b-col>
              <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-8">
                <b-row>
                  <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
                    <!-- 검사합격번호 -->
                    <y-text
                      :width="8"
                      :editable="editable"
                      :disabled="disabledFacilityMasterInput"
                      :maxlength="15"
                      ui="bootstrap"
                      type="search"
                      label="L0000000318"
                      name="chkPassNum"
                      v-model="facilityMst.chkPassNum"
                    ></y-text>
                  </b-col>
                  <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
                    <!-- 합격일자 -->
                    <y-datepicker
                      :width="8"
                      :editable="editable"
                      :disabled="disabledFacilityMasterInput"
                      label="L0000003179"
                      name="chkPassDt"
                      :default="facilityMst.chkPassDt"
                      v-model="facilityMst.chkPassDt"
                    ></y-datepicker>
                  </b-col>
                </b-row>
              </b-col>
              <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-8">
                <b-row>
                  <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
                    <!-- PSM 대상분류 -->
                    <y-select
                      :width="8"
                      :editable="editable"
                      :comboItems="facilityPsms"
                      :disabled="disabledFacilityMasterInput"
                      itemText="codeNm"
                      itemValue="code"
                      ui="bootstrap"
                      name="facilityPsmCd"
                      label="L0000000151"
                      v-model="facilityMst.facilityPsmCd"
                    ></y-select>
                  </b-col>
                  <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
                    <!-- *PSM 관리대상 설비 -->
                    <y-label label="L0000000008" :fieldable="true" />
                  </b-col>
                </b-row>
              </b-col>
              <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-8">
                <!-- 비고 -->
                <y-textarea
                  :width="10"
                  :editable="editable"
                  :disabled="disabledFacilityMasterInput"
                  ui="bootstrap"
                  label="L0000001360"
                  name="remark"
                  v-model="facilityMst.remark"
                ></y-textarea>
              </b-col>
            </b-row>
          </b-card>
        </el-collapse-transition>
        <div class="folder">
          <el-divider>
            <!-- chevron-up -->
            <f-icon
              :icon="folderIcon"
              :style="{ cursor: 'pointer' }"
              class="mt-1 ml-1"
              @click.stop="iconClicked"
            />
          </el-divider>
        </div>
      </b-col>
    </b-row>

    <!-- 탭 -->
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
      </el-tab-pane>
      <keep-alive>
        <component
          :is="component"
          v-if="component"
          :disabled="disabled"
          :facilityMst.sync="facilityMst"
          :tubeEquipmentNo="1"
          :equipmentNo="0"
          :flag="popupParam.flag"
          sm="12"
          :submitObject="submitObject"
          :attachFileGrps="attachFileGrps"
          :saveAttachFiles="saveAttachFiles"
          @changeUploadFiles="changeUploadFiles"
          @setTempDeleteFiles="setTempDeleteFiles"
          @closePopup="btnClosePopup"
        />
      </keep-alive>
    </el-tabs>
    <!-- 팝업 설정 -->
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  name: 'create-facility-mst',
  props: {
    popupParam: {
      type: Object,
      default: {
        safFacilityCd: '',
        facilityPsmCd: '',
        title: '',
        flag: false,
      },
    },
  },
  data() {
    return {
      tabItems: [
        // { title: '화학물질', url: 'facilityChemprod' },
        { title: 'L0000001586', url: './facilityTypeItemResult' }, // 설비 세부항목
        { title: 'L0000002843', url: 'fileUploadPage' }, // 첨부파일
      ],
      component: null,
      tabIndex: 0,
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '90%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      facilityMst: {
        safFacilityTypeCd: null,
        plantCd: null,
        processCd: null,
        deptCd: null,
        safFacilityCd: '',
        facilityNm: '',
        installLocate: '',
        installYmd: '',
        installConn: '',

        vol: '',
        volUnit: '',
        safMgrPsn: '',
        disuseYn: 'N',
        disuseYy: '',
        lawChkYn: 'N',
        selfChkYn: 'N',
        lawChkCyeCd: '',
        selfChkCyeCd: '',
        remark: '',
        facilityTypeItemVals: [],
        createUserId: '',
        createDt: '',
        updateDt: '',
        updateUserId: '',
        tubeChemprods: [],
        tubeCheck: false,
        facilityPsmCd: 'FPSM0', // default : 해당없음
        safLsnYn: 'N',
        safLsnCyeCd: '',
        chkPassNum: '',
        chkPassDt: '',

        safChkYn: 'N',
        safChkCyeCd: '',
        firstChemprod: [],
        firstTubeChemprod: [],
        changeChemProds: [],

        chngNum: '', // 변경발의번호
        safChngNo: 0,
      },
      submitCheck: false, // 첨부파일의 변경여부를 판단하여 처리
      saveAttachFiles: [],
      tempDeleteFiles: [],
      attachFileGrps: [],
      submitObject: {
        submitCheck: false,
      },
      editable: false,
      actionType: 'POST',
      disabledFacilityMasterInput: false,
      disabled: false,
      disabledYy: true,
      disabledLaw: true,
      disabledSelf: true,
      lawChkCyeItems: [], // 법정점검 주기
      selfChkCyeItems: [], // 자체점검 주기
      facilityPsms: [], // PSM 설비 유형s
      insertUrl: '',
      countUrl: '',
      isInsert: false,
      folderIcon: 'chevron-up',
      show: true,
    };
  },
  watch: {
    tabIndex() {
      this.loadComponent();
    },
    'facilityMst.disuseYn': {
      handler: function (val, oldVal) {
        if (val === 'Y') {
          this.disabledYy = false;
        } else {
          this.disabledYy = true;
        }
      },
    },
    'facilityMst.lawChkYn': {
      handler: function (val, oldVal) {
        if (val === 'Y') {
          this.disabledLaw = false;
        } else {
          this.disabledLaw = true;
        }
      },
    },
    'facilityMst.selfChkYn': {
      handler: function (val, oldVal) {
        if (val === 'Y') {
          this.disabledSelf = false;
        } else {
          this.disabledSelf = true;
        }
      },
    },
    'facilityMst.safFacilityTypeCd': {
      handler: function (val, oldVal) {
        this.setTabItems();
      },
    },
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.editable = this.$route.meta.editable;
  },
  mounted() {
    this.init();
    this.loadComponent();
  },
  beforeDestroy() {},
  methods: {
    init() {
      // URL 셋팅
      this.insertUrl = transactionConfig.saf.facilityMst.insert.url;
      this.countUrl = selectConfig.saf.facilityMst.count.url;

      if (this.popupParam.safFacilityCd !== '') {
        this.disabled = true;
      } else {
        this.disabled = false;
      }

      this.attachFileGrpSetting(); // 첨부파일 설정
      this.$comm.getComboItems('SAF_FACILITY_PSM', false).then((_result) => {
        this.facilityPsms = _result;
      });
      this.$comm.getComboItems('SAF_LAW_CHK_CYE', false).then((_result) => {
        this.lawChkCyeItems = _result; // 법정점검 주기
      });
      this.$comm.getComboItems('SAF_SELF_CHK_CYE', false).then((_result) => {
        this.selfChkCyeItems = _result; // 자체점검 주기
      });
      this.getFacilityMst(); // 유형별 설비 상세

      // 설비 유형을 받아 오는경우 (PSM의 공정시설정보에서 상세 팝업 띄우는 경우) 설비 마스터 입력 폼은 수정 불가
      if (this.popupParam.facilityPsmCd) {
        this.disabledFacilityMasterInput = true;
        // this.iconClicked();
      }
      // flag의 값이 true인 경우 설비 마스터 뿐만아니라 모든 입력이 불가
      if (this.popupParam.flag) this.disabledFacilityMasterInput = true;
    },
    setTabItems() {
      var i = 0;
      if (this.tabItems.length > 3) {
        for (; i < this.tabItems.length; i++) {
          this.tabItems.splice(i, 1);
        }
      }
      if (this.popupParam.safFacilityCd && this.popupParam.facilityPsmCd) {
        this.tabItems.splice(
          this.$_.indexOf(this.$_.map(this.tabItems, 'title'), 'L0000003285'), // 화학물질
          1
        );
        this.tabItems.splice(
          this.$_.indexOf(this.$_.map(this.tabItems, 'title'), 'L0000003790'), // 설비항목
          1
        );
        // 동력기계
        if (this.facilityMst.facilityPsmCd === 'FPSM1') {
          this.tabItems.splice(0, 0, {
            title: 'L0000000965', // 동력기계항목
            url: 'powerMachineTab',
          });
        }
        // 장치 및 설비
        else if (this.facilityMst.facilityPsmCd === 'FPSM2') {
          this.tabItems.splice(0, 0, {
            title: 'L0000002456', // 장치 및 설비 항목
            url: 'equipmentTab',
          });
        }
        // 열교환기
        else if (this.facilityMst.facilityPsmCd === 'FPSM3') {
          this.tabItems.splice(0, 0, {
            title: 'L0000002006', // 열교환기 동체 항목
            url: 'heatExchangeShellTab',
          });
          this.tabItems.splice(1, 0, {
            title: 'L0000002009',
            // 열교환기 튜브 항목
            url: 'heatExchangeTubeTab',
          });
        } else if (this.facilityMst.facilityPsmCd === 'FPSM5') {
          this.tabItems.splice(0, 0, {
            title: 'L0000001858',
            // 안전밸브 및 파열판 항목
            url: 'safetyValveTab',
          });
        }
      }

      this.loadComponent();
    },
    // 첨부파일 설정
    attachFileGrpSetting() {
      let taskKey = this.popupParam.safFacilityCd
        ? this.popupParam.safFacilityCd.toString()
        : '';
      this.attachFileGrps = [
        {
          label: 'L0000002843', // 첨부파일
          uploadTempFiles: null,
          taskClassNm: 'FACILITY_MASTER',
          taskKey: taskKey,
          showFileSearch: false,
          editable: this.editable,
          createUserId: this.$store.getters.token,
        },
      ];
    },
    // 유형별 설비 상세
    getFacilityMst() {
      if (!this.popupParam.safFacilityCd) {
        this.facilityMst.createDt = this.$comm.getToday();
        this.facilityMst.plantCd = this.$store.getters.plantCd;
        return;
      }
      this.$http.url = selectConfig.saf.facilityMst.get.url;
      this.$http.param = {
        safFacilityCd: this.popupParam.safFacilityCd,
      };
      this.$http.type = 'get';
      this.$http.request(
        (_result) => {
          this.facilityMst = _result.data;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    // 탭
    loadComponent() {
      var path = this.tabItems[this.tabIndex].url;
      // ;
      console.log('확인: ', this.tabItems[this.tabIndex].url);
      if (path === 'fileUploadPage') {
        this.component = () =>
          import('@/pages/common/attachFile/multiFileUpload');
      } else if (path === 'facilityTubeChemprod') {
        this.component = () =>
          import('@/pages/common/chemProd/facilityTubeChemprod');
      } else if (path === 'powerMachineTab') {
        this.component = () =>
          import('@/pages/processSafetyData/processFacility/powerMachineTab');
      } else if (path === 'equipmentTab') {
        this.component = () =>
          import('@/pages/processSafetyData/processFacility/equipmentTab');
      } else if (path === 'heatExchangeShellTab') {
        this.component = () =>
          import(
            '@/pages/processSafetyData/processFacility/heatExchangeShellTab'
          );
      } else if (path === 'heatExchangeTubeTab') {
        this.component = () =>
          import(
            '@/pages/processSafetyData/processFacility/heatExchangeTubeTab'
          );
      } else if (path === 'safetyValveTab') {
        this.component = () =>
          import('@/pages/processSafetyData/processFacility/safetyValveTab');
      } else {
        this.component = () => import(`${path}`);
      }
    },
    beforeInsert() {
      var countFacilityMst = 0;
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            this.$http.url = this.countUrl;
            this.$http.param = {
              safFacilityCd: this.facilityMst.safFacilityCd,
            };
            this.$http.type = 'GET';
            this.$http.request(
              (_result) => {
                countFacilityMst = _result.data;
                if (countFacilityMst > 0 && this.disabled === false) {
                  window.getApp.$emit('ALERT', {
                    title: 'L0000003395',
                    message: 'M0000000118',
                    // 이미 존재하는 설비코드입니다.
                    type: 'warning',
                  });
                  return;
                } else {
                  window.getApp.$emit('CONFIRM', {
                    title: 'L0000003321',
                    message: 'M0000000011', // 저장하시겠습니까?
                    type: 'info',
                    // 확인 callback 함수
                    confirmCallback: () => {
                      this.facilityMst.createUserId = this.$store.getters.token;
                      this.facilityMst.updateUserId = this.$store.getters.token;

                      // this.facilityHeatExchangeSell.chemprods = [];
                      this.$_.forEach(
                        this.facilityMst.tubeChemprods,
                        (item) => {
                          // item.equipmentNo = 0;
                          this.facilityMst.chemprods.push(item);
                        }
                      );
                      let firstData = this.$_.union(
                        this.$_.map(
                          this.facilityMst.firstChemprod,
                          'chemProdNo'
                        ),
                        this.$_.map(
                          this.facilityMst.firstTubeChemprod,
                          'chemProdNo'
                        )
                      );
                      // firstData = this.$_.map(firstData, 'chemProdNo');
                      let savePointData = this.$_.uniq(
                        this.$_.map(this.facilityMst.chemprods, 'chemProdNo')
                      );
                      let intersection = this.$_.intersection(
                        firstData,
                        savePointData
                      );

                      this.facilityMst.changeChemProds = this.$_.union(
                        firstData,
                        savePointData
                      );

                      this.$_.forEach(intersection, (item) => {
                        this.facilityMst.changeChemProds = this.$_.without(
                          this.facilityMst.changeChemProds,
                          item
                        );
                      });
                      if (this.disabled) {
                        if (this.disabledYy) {
                          this.facilityMst.disuseYy = null;
                        }
                        if (this.disabledLaw) {
                          this.facilityMst.lawChkCyeCd = null;
                        }
                        if (this.disabledSelf) {
                          this.facilityMst.selfChkCyeCd = null;
                        }
                        if (this.facilityMst.safLsnYn !== 'Y') {
                          this.facilityMst.safLsnCyeCd = null;
                        }
                        if (this.facilityMst.safChkYn !== 'Y') {
                          this.facilityMst.safChkCyeCd = null;
                        }
                        this.actionType = 'PUT';
                        this.insertUrl =
                          transactionConfig.saf.facilityMst.edit.url;
                      } else {
                        this.actionType = 'POST';
                        this.insertUrl =
                          transactionConfig.saf.facilityMst.insert.url;
                      }
                      this.isInsert = true;
                    },
                    cancelCallback: () => {
                      this.isInsert = false;
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
              'createFacilityMst',
              this.$data,
              this.errors
            );
          }
        })
        .catch(() => {
          window.getApp.$emit('APP_VALID_ERROR', 'M0000000876');
        });
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
    // updateFlag () {
    //   if (this.tabItems.length === 2) this.tabItems.splice(1, 0, { title: '화학물질', url: 'facilityChemprod' });
    // },
    /** Button Event **/
    // 팝업 닫기
    btnClosePopup() {
      // 부모창에 값 전달
      this.$emit('closePopup', { success: true });
    },
    // 사용자 검색
    btnSearchUserClicked(_item) {
      if (this.disabledFacilityMasterInput) return;
      this.popupOptions.target = () =>
        import(`${'../../manage/user/userSearch.vue'}`);
      this.popupOptions.param = {
        plantCd: this.facilityMst.plantCd,
        deptCd: this.facilityMst.deptCd,
      };
      this.popupOptions.title = 'L0000001466'; // 사용자검색
      this.popupOptions.visible = true;
      this.popupOptions.width = '60%';
      this.popupOptions.top = '100px';
      this.popupOptions.closeCallback = this.closePopupSearchUser;
    },
    // 사용자 검색 팝업 닫기
    closePopupSearchUser(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data.user) {
        this.facilityMst.safMgrPsn = data.user.userNm;
      }
    },
    // 신규등록
    btnInsertClickedCallback(_result) {
      if (!_result.data) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000000119', // 저장실패되었습니다
          type: 'warning',
        });
      } else {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000000006', // 저장되었습니다
          type: 'success',
        });
        this.facilityMst.safFacilityCd = _result.data;
        this.saveAttach();
      }
      this.isInsert = false;
    },
    // 버튼 에러 처리
    btnClickedErrorCallback(_result) {
      this.isInsert = false;
      window.getApp.emit('APP_REQUEST_ERROR', _result);
    },
    iconClicked() {
      this.folderIcon =
        this.folderIcon === 'chevron-up' ? 'chevron-down' : 'chevron-up';
      this.show = !this.show;
    },
    changeUploadFiles(data) {
      var index = this.$_.findIndex(this.attachFileGrps, {
        taskClassNm: data.taskClassNm,
      });
      if (index > -1) {
        data.index = index;
        this.attachFileGrps[index].uploadTempFiles = data;
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
    saveAttach() {
      // task_key 를 셋팅한다.
      this.$_.forEach(this.attachFileGrps, (item) => {
        item.taskKey = this.facilityMst.safFacilityCd;
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
              this.submitObject.submitCheck = !this.submitObject.submitCheck;
            }
            // 저장할 데이터가 없는 경우
            else this.btnClosePopup();
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      } else {
        // 저장할 데이터가 있는 경우
        if (this.saveAttachFiles.length > 0) {
          this.submitObject.submitCheck = !this.submitObject.submitCheck;
        }
        // 저장할 데이터가 없는 경우
        else this.btnClosePopup();
      }
    },
    searchMoc() {
      this.popupOptions.param = {
        plantCd: this.riskAssessPlan.plantCd,
        chngRefWorkCd: 'CGRW2',
      };
      this.popupOptions.target = () =>
        import(`${'@/pages/saf/change/changePop.vue'}`);
      this.popupOptions.title = 'L0000001221'; // 변경관리
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      this.popupOptions.closeCallback = this.closeMocPopup;
    },
    closeMocPopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data !== 'CLOSE') {
        this.riskAssessPlan.chngNum = data.chngNum;
        this.riskAssessPlan.safChngNo = data.safChngNo;
      }
    },
    removeMoc() {
      this.riskAssessPlan.chngNum = '';
      this.riskAssessPlan.safChngNo = 0;
    },
    /** /Button Event **/
  },
};
</script>
<style>
.folder .el-divider {
  margin: 0px !important;
  /* background-color: floralwhite !important; */
}
</style>
