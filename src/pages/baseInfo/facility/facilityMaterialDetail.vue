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
              <y-btn title="L0000002474" color="orange" @btnClicked="btnSave" />
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
              <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
                <y-plant
                  type="edit"
                  :required="true"
                  :editable="editable"
                  :disabled="disabledFacilityMasterInput"
                  name="plantCd"
                  v-model="facilityMst.plantCd"
                  v-validate="'required'"
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
    <b-row class="mt-3"></b-row>
    <b-row class="mt-3">
      <b-col sm="12">
        <b-card>
          <keep-alive>
            <facility-chem-prod
              :disabled="disabled"
              :facility-mst.sync="facilityMst"
            />
          </keep-alive>
        </b-card>
      </b-col>
    </b-row>
    <!-- 팝업 설정 -->
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
import facilityChemprod from '@/pages/common/chemProd/facilityChemprod';
export default {
  name: 'create-facility-mst',
  components: {
    'facility-chem-prod': facilityChemprod,
  },
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
      },
      editable: false,
      disabledFacilityMasterInput: false,
      disabled: false,
      disabledYy: true,
      disabledLaw: true,
      disabledSelf: true,
      lawChkCyeItems: [], // 법정점검 주기
      selfChkCyeItems: [], // 자체점검 주기
      facilityPsms: [], // PSM 설비 유형s
      folderIcon: 'chevron-up',
      show: true,
    };
  },
  watch: {
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
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.editable = false;
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {},
  methods: {
    init() {
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
      if (this.popupParam.safFacilityCd !== '') {
        this.disabled = true;
      } else {
        this.disabled = false;
      }

      // 설비 유형을 받아 오는경우 (PSM의 공정시설정보에서 상세 팝업 띄우는 경우) 설비 마스터 입력 폼은 수정 불가
      if (this.popupParam.facilityPsmCd) {
        this.disabledFacilityMasterInput = true;
        this.iconClicked();
      }
      // flag의 값이 true인 경우 설비 마스터 뿐만아니라 모든 입력이 불가
      if (this.popupParam.flag) this.disabledFacilityMasterInput = true;
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
    validateState(_ref) {
      if (
        this.veeBag[_ref] &&
        (this.veeBag[_ref].dirty || this.veeBag[_ref].validated)
      ) {
        return !this.errors.has(_ref);
      }
      return null;
    },
    /** Button Event **/
    btnSave() {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321',
        message: 'M0000000011', // 저장하시겠습니까?
        type: 'info',
        // 확인 callback 함수
        confirmCallback: () => {
          this.facilityMst.updateUserId = this.$store.getters.token;

          this.$_.forEach(this.facilityMst.tubeChemprods, (item) => {
            this.facilityMst.chemprods.push(item);
          });
          let firstData = this.$_.union(
            this.$_.map(this.facilityMst.firstChemprod, 'chemProdNo'),
            this.$_.map(this.facilityMst.firstTubeChemprod, 'chemProdNo')
          );
          let savePointData = this.$_.uniq(
            this.$_.map(this.facilityMst.chemprods, 'chemProdNo')
          );
          let intersection = this.$_.intersection(firstData, savePointData);

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
          this.$http.url = transactionConfig.saf.facilityMst.edit.url;
          this.$http.type = 'PUT';
          this.$http.param = this.facilityMst;
          this.$http.request(
            (_result) => {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395',
                message: 'M0000000006',
                type: 'success',
              });
            },
            (_error) => {
              window.getApp.$emit('APP_REQUEST_ERROR', _error);
            }
          );
        },
      });
    },
    // 팝업 닫기
    btnClosePopup() {
      // 부모창에 값 전달
      this.$emit('closePopup', { success: true });
    },
    iconClicked() {
      this.folderIcon =
        this.folderIcon === 'chevron-up' ? 'chevron-down' : 'chevron-up';
      this.show = !this.show;
    },
    /** /Button Event **/
  },
};
</script>
<style>
.folder .el-divider {
  margin: 0px !important;
}
</style>
