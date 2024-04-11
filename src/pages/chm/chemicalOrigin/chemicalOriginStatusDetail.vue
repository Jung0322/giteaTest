<!--
  목적 : 화학물질관리 > 인허가 현황 > 인허가현황 등록/수정
  Detail :  인허가 현황을 등록/수정/상세조회한다.
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row ref="editBox">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 인허가신고 상세 -->
            <y-label
              label="L0000002250"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 개정 -->
              <y-btn
                v-if="showRevisionAndUpdateButton && updateMode"
                title="L0000000291"
                :showLoading="false"
                color="blue"
                @btnClicked="revPopup"
              />
              <!-- 개정완료 -->
              <y-btn
                v-if="isRevisionButtonClicked"
                :action-url="saveUrl"
                :param="permitProdHist"
                :is-submit="isRev"
                title="L0000003777"
                color="blue"
                action-type="POST"
                beforeSubmit="beforeSave"
                @beforeSave="beforeSave"
                @btnClicked="btnRevSaveClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 저장 -->
              <y-btn
                v-if="
                  this.permitProdHist.permitProdHisNo === 0 &&
                  !isRevisionButtonClicked
                "
                :action-url="saveUrl"
                :param="permitProdHist"
                :is-submit="isSave"
                :title="'L0000002474'"
                color="orange"
                :action-type="actionType"
                beforeSubmit="beforeSave"
                @beforeSave="beforeSave"
                @btnClicked="btnSaveClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 수정 -->
              <y-btn
                v-if="
                  this.updateMode &&
                  !isUpdateButtonClicked &&
                  !isRevisionButtonClicked
                "
                :title="'L0000001696'"
                color="orange"
                :showLoading="false"
                @btnClicked="btnEditClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 저장 -->
              <y-btn
                v-if="isUpdateButtonClicked"
                :title="'L0000002474'"
                color="orange"
                :action-url="saveUrl"
                :param="permitProdHist"
                :is-submit="isSave"
                :action-type="actionType"
                beforeSubmit="beforeSave"
                @beforeSave="beforeSave"
                @btnClicked="btnSaveClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 취소 -->
              <y-btn
                v-if="isRevisionButtonClicked || isUpdateButtonClicked"
                title="L0000002920"
                @btnClicked="btnCancelClickedCallback"
              />
              <!-- 삭제 -->
              <y-btn
                v-if="
                  updateMode &&
                  !isRevisionButtonClicked &&
                  !isUpdateButtonClicked
                "
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
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <y-plant
                type="edit"
                filter="chm"
                :required="true"
                :editable="isEnable"
                name="plantCd"
                v-model="permitProdHist.plantCd"
                v-validate="'required'"
                :state="validateState('plantCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 인허가종류 -->
              <y-select
                :width="8"
                :editable="isEnable"
                :comboItems="permitClsItems"
                :required="true"
                :disabled="disabled"
                itemText="permitClsNm"
                itemValue="permitClsNo"
                ui="bootstrap"
                type="search"
                label="L0000002256"
                name="permitClsNo"
                v-model="permitProdHist.permitClsNo"
                v-validate="'required'"
                :state="validateState('permitClsNo')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 신고일 -->
              <y-datepicker
                :width="8"
                :required="true"
                type="permitDt"
                label="L0000001785"
                :editable="isEnable"
                :default="permitProdHist.permitDt"
                v-model="permitProdHist.permitDt"
                v-validate="'required'"
                :state="validateState('permitDt')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 신고기관 -->
              <y-text
                :width="8"
                :editable="isEnable"
                :maxlength="15"
                ui="bootstrap"
                label="L0000001783"
                name="permitOrg"
                v-model="permitProdHist.permitOrg"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 신고번호 -->
              <y-text
                :width="8"
                :editable="isEnable"
                :maxlength="15"
                ui="bootstrap"
                label="L0000001784"
                name="permitNum"
                v-model="permitProdHist.permitNum"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 사용부서 -->
              <y-tree-dept
                type="edit"
                :disabled="false"
                label="L0000001452"
                :editable="isEnable"
                :plantCd="permitProdHist.plantCd"
                v-model="permitProdHist.useDeptCd"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 저장시설 -->
              <y-text
                :width="8"
                :editable="isEnable"
                :maxlength="30"
                ui="bootstrap"
                label="L0000002478"
                name="storFac"
                v-model="permitProdHist.storFac"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 신고자 -->
              <y-text
                :width="8"
                :editable="isEnable"
                :maxlength="15"
                ui="bootstrap"
                label="L0000001786"
                name="storFac"
                v-model="permitProdHist.permitEmpNm"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 사용여부 -->
              <y-switch
                :width="8"
                :editable="isEnable"
                true-value="Y"
                false-value="N"
                ui="bootstrap"
                label="L0000001439"
                name="radioValue"
                selectText="L0000001440"
                unselectText="L0000001063"
                v-model="permitProdHist.useYn"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 개정번호 -->
              <y-number
                :width="8"
                :editable="isRevisionButtonClicked"
                :disabled="!isRevisionButtonClicked"
                ui="bootstrap"
                label="L0000000293"
                name="revNum"
                :hasSeperator="false"
                :maxlength="5"
                v-model="permitProdHist.revNum"
                :required="this.isRevisionButtonClicked"
                v-validate="this.isRevisionButtonClicked ? 'required' : ''"
              ></y-number>
            </b-col>
            <b-col
              v-if="popupParam.permitProdHisNo > 0"
              sm="12"
              md="12"
              lg="12"
              xl="12"
              class="col-xxl-6"
            >
              <!-- 개정사유 -->
              <y-textarea
                :width="10"
                :maxlength="300"
                :editable="isRevisionButtonClicked"
                :disabled="!isRevisionButtonClicked"
                ui="bootstrap"
                label="L0000000294"
                name="revContents"
                :required="this.isRevisionButtonClicked"
                v-model="permitProdHist.revContents"
                v-validate="this.isRevisionButtonClicked ? 'required' : ''"
              ></y-textarea>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-8">
              <!-- 비고 -->
              <y-textarea
                :width="10"
                :editable="isEnable"
                :disabled="disabled"
                :maxlength="300"
                ui="bootstrap"
                label="L0000001360"
                name="remarks"
                v-model="permitProdHist.permitDesc"
              ></y-textarea>
            </b-col>
            <!-- <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12 mb-2">
              <div slot="buttonGroup" class="float-right mb-1">
                 추가 
                <y-btn
                  v-if="
                    (!permitProdHist.permitProdHisNo &&
                      !disabled &&
                      editable) ||
                    isRevisionButtonClicked ||
                    isUpdateButtonClicked
                  "
                  title="L0000002892"
                  color="orange"
                  @btnClicked="openPopup"
                  @btnClickedErrorCallback="btnClickedErrorCallback"
                />
                 제외 
                <y-btn
                  v-if="
                    (!permitProdHist.permitProdHisNo &&
                      gridOptions.pdata.length > 0 &&
                      !disabled &&
                      editable) ||
                    (isRevisionButtonClicked && gridOptions.pdata.length > 0) ||
                    (isUpdateButtonClicked && gridOptions.pdata.length > 0)
                  "
                  color="red"
                  title="L0000002620"
                  @btnClicked="btnpDeleteClickedCallback"
                  @btnClickedErrorCallback="btnClickedErrorCallback"
                />
              </div>
               화학자재 목록 
              <y-data-table
                label="L0000003311"
                ref="dataTable"
                :height="gridOptions.pheight"
                :headers="gridOptions.pheader"
                :items="gridOptions.pdata"
                v-model="pselectValue"
                :popMode="true"
              >
                <el-table-column
                  v-if="!disabled && editable"
                  type="selection"
                  slot="selection"
                  align="center"
                  width="55"
                ></el-table-column>
              </y-data-table>
              
            </b-col> -->
            <!--            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">-->
            <!--              <component-->
            <!--                :is="attach"-->
            <!--                v-if="attach"-->
            <!--                :submitCheck="submitCheck"-->
            <!--                :attachFileGrps="attachFileGrps"-->
            <!--                :saveAttachFiles="saveAttachFiles"-->
            <!--                :sm="'12'"-->
            <!--                @changeUploadFiles="changeUploadFiles"-->
            <!--                @setTempDeleteFiles="setTempDeleteFiles"-->
            <!--                @closePopup="closePopup"-->
            <!--                @setUploadedList="setUploadedList"-->
            <!--              />-->
            <!--            </b-col>-->
            <b-col sm="12" class="h100p">
              <y-auigrid
                ref="yAuiGrid"
                :name="gridOptions.name"
                :headers="gridOptions.pheader"
                :btns="gridOptions.btns"
                :height="gridOptions.pheight"
                :label="this.$comm.getLangSpecInfoLabel('L0000003311')"
                :useExcelExport="false"
                :showRowCheckColumn="true"
                :showGridSetSave="true"
                :useContextMenu="true"
                :enableRightDownFocus="true"
                :showGridCtrl="true"
                @openPopup="openPopup"
                @btnDelRowClicked="btnDelRowClicked"
                @cellEditEnd="cellEditEndHandler"
              />
            </b-col>
          </b-row>
          <b-row>
            <!-- 인허가현황 등록 탭 -->
            <b-col sm="12">
              <el-tabs
                type="border-card"
                v-model="tabIndex"
                @tab-click="tabClick"
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
                    ref="childTab"
                    :submitCheck="submitCheck"
                    :count="count"
                    sm="12"
                    :attachFileGrps.sync="attachFileGrps"
                    :saveAttachFiles.sync="saveAttachFiles"
                    @changeUploadFiles="changeUploadFiles"
                    @setTempDeleteFiles="setTempDeleteFiles"
                    @setUploadedList="setUploadedList"
                  />
                </keep-alive>
                <!-- @permitProdHisRevs="latestRevNum" -->
              </el-tabs>
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
  name: 'y-chemoriginstatus-detail',
  components: {},
  props: {
    popupParam: {
      type: Object,
      default: {
        permitProdHisNo: 0,
      },
    },
  },
  data: function () {
    return {
      permitProdHist: {
        permitProdHisNo: 0,
        permitProdHisGrpNo: 0,
        permitClsNo: null,
        chemProdNo: 0,
        chemProdNmKr: '',
        plantCd: '',
        permitDt: '',
        permitOrg: '',
        permitNum: '',
        useDeptCd: '',
        storFac: '',
        permitEmpId: '',
        permitEmpNm: '',
        permitDesc: '',
        fileNm: '',
        fileNo: null,
        useYn: 'Y',
        chmPermitRefProd: [],
        revNum: null,
        revYmd: null,
        revContents: null,
      },
      gridOptions: {
        name: 'chemicalOriginStatusDetail',
        btns: [],
        pheader: [],
        pdata: [],
        pheight: '300',
      },
      YAuiGrid: null,
      pselectValue: [],

      saveData: {
        permitProdHisNo: 0,
        createUserId: '',
        updateUserId: '',
      },
      isRevisionButtonClicked: false,
      isUpdateButtonClicked: false,
      isRev: false,
      changeChemPermit: false,
      editable: false,
      updateMode: false,
      disabled: false,
      isSave: false,
      permitClsItems: [], // 인허가종류목록
      userItems: [], // 신고자목록
      uploadFile: {
        data: [],
      },
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '80%',
        top: '50px',
        param: {},
        closeCallback: null,
      },
      count: 0,
      selectedValue: [],
      searchDetailUrl: '',
      saveUrl: '',
      checkUrl: '',
      actionType: 'POST',
      component: null,
      tabIndex: 0,
      paneName: '',
      tabItems: [
        {
          title: 'L0000004233',
          url: './chemicalOriginStatusRevHistory',
        } /* 인허가이력 */,
        { title: 'L0000002843', url: 'multiFileUpload' } /* 첨부파일 */,
      ],

      permitClsUrl: '',
      permitClsParam: {},

      // 첨부 파일
      attach: null,
      submitCheck: false,
      saveAttachFiles: [],
      tempDeleteFiles: [],
      attachFileGrps: [],
      permitProdHisNo: 0,
      latestRevNum: 0,
    };
  },
  computed: {
    isEnable() {
      if (!this.editable) return false;
      return (
        !this.updateMode ||
        this.isRevisionButtonClicked ||
        this.isUpdateButtonClicked
      );
    },
    showRevisionAndUpdateButton() {
      return (
        this.editable &&
        !this.isRevisionButtonClicked &&
        !this.isUpdateButtonClicked
      );
    },
  },
  watch: {
    tabIndex() {
      this.$nextTick(function () {
        this.loadComponent();
      });
    },
    'gridOptions.pdata': {
      handler: function (newValue, oldValue) {
        this.permitProdHist.chmPermitRefProd = [];
        this.$_.forEach(this.gridOptions.pdata, (item) => {
          this.permitProdHist.chmPermitRefProd.push(item);
        });
      },
      deep: true,
    },
    'permitProdHist.plantCd': {
      handler: function (newValue, oldValue) {
        if (this.permitProdHist.plantCd) {
          this.getPermitCls();
        } else {
          this.permitProdHist.permitClsNo = null;
          this.permitClsItems = [
            {
              permitClsNo: null,
              permitClsNm: this.$comm.getLangSpecInfoLabel('L0000003394'),
            },
          ];
        }
      },
      deep: true,
    },
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
    this.editable = this.$route.meta.editable;
    this.setAttachFileGrps();
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.searchDetailUrl = selectConfig.chm.chemPermitProdHis.get.url;
      this.checkUrl = selectConfig.chm.chemPermitProdHis.check.url;
      this.saveUrl = transactionConfig.chm.chemPermitProdHis.insert.url;
      this.permitClsUrl = selectConfig.chm.chemicalPermitCls.list.url;
      this.deleteUrl = transactionConfig.chm.chemPermitProdHis.deleteLatest.url;
      this.permitClsParam = {
        useYn: 'Y',
        plantCd: this.permitProdHist.plantCd,
      };
      this.gridOptions.pheader = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003317'),
          dataField: 'chemProdNmKr',
          width: '50%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003316'),
          dataField: 'chemProdNmEn',
          width: '50%',
        },
      ];

      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002892'),
          color: 'orange',
          btnClicked: 'openPopup',
          visible: false,
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002620'),
          color: 'red',
          btnClicked: 'btnDelRowClicked',
          visible: false,
        },
      ];

      // this.getUserItems(); // 신고자
      if (this.popupParam.permitProdHisNo === 0) {
        this.updateMode = false;
        // this.insertMode = true;
      } else {
        this.getDetail();
        this.updateMode = true;
        // this.insertMode = false;
      }

      this.attach = () => import('@/pages/common/attachFile/multiFileUpload');
      this.setAttachFileGrps(); // 첨부파일 셋팅
    },
    btnEditClickedCallback() {
      this.isUpdateButtonClicked = true;
      if (
        (!this.permitProdHist.permitProdHisNo && !this.disabled) ||
        this.isRevisionButtonClicked ||
        this.isUpdateButtonClicked
      ) {
        this.gridOptions.btns[0].visible = true;
        this.gridOptions.btns[1].visible = true;
      }
      this.setAttachFileGrps();
    },
    btnCancelClickedCallback() {
      this.isRevisionButtonClicked = false;
      this.isUpdateButtonClicked = false;
      this.gridOptions.btns[0].visible = false;
      this.gridOptions.btns[1].visible = false;
      this.setAttachFileGrps(); // 첨부파일 셋팅
    },
    getLatestRevNum(revisions) {
      this.latestRevNum = revisions[0].revNum;
    },
    tabClick(tab) {},
    btnDeleteClickedCallback(_result) {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321' /* 확인 */,
        message: 'M0000000012' /* 삭제하시겠습니까? */,
        type: 'info',
        // 확인 callback 함수
        confirmCallback: () => {
          this.$http.url = this.$format(
            this.deleteUrl,
            this.permitProdHist.permitProdHisNo
          );
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
    /** 물질검토 상세 검색 **/
    getDetail(_permitProdHisNo) {
      if (
        !this.popupParam.permitProdHisNo ||
        this.popupParam.permitProdHisNo === 0
      ) {
        this.getPermitCls(); // 인허가종류
        this.permitProdHist.permitDt = this.$comm.getToday();
      } else {
        this.$http.url = this.$format(
          this.searchDetailUrl,
          _permitProdHisNo ? _permitProdHisNo : this.popupParam.permitProdHisNo
        );
        this.$http.type = 'GET';
        this.$http.request(
          (_result) => {
            this.permitProdHist = this.$_.clone(_result.data);
            this.permitProdHisNo = this.permitProdHist.permitProdHisNo;
            this.$refs.childTab.permitProdHisNo =
              this.permitProdHist.permitProdHisNo;
            this.$nextTick(function () {
              this.loadComponent();
            });
            if (
              this.permitProdHist.chmPermitRefProd &&
              this.permitProdHist.chmPermitRefProd.length > 0
            ) {
              this.gridOptions.pdata = this.$_.clone(
                this.permitProdHist.chmPermitRefProd
              );
              this.YAuiGrid.setGridData(this.gridOptions.pdata);
            }
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      }
    },
    setAttachFileGrps() {
      let taskKey = this.popupParam.permitProdHisNo
        ? this.popupParam.permitProdHisNo
        : '';
      this.attachFileGrps = [
        {
          label: 'L0000002843', // 첨부파일
          uploadTempFiles: null,
          taskClassNm: 'PERMIT_PROD',
          limit: 20,
          multiple: true,
          taskKey: taskKey,
          drag: !this.disabled,
          loadOtherFileGrps: null,
          editable:
            this.isRevisionButtonClicked ||
            this.isUpdateButtonClicked ||
            this.popupParam.permitProdHisNo === 0,
          disabled: this.disabled,
          createUserId: this.$store.getters.token,
        },
      ];
    },
    btnRevSaveClickedCallback(_result) {
      this.permitProdHist.permitProdHisNo = _result.data.permitProdHisNo;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395' /* 안내 */,
        message: 'M0000000631' /* 개정되었습니다. */,
        type: 'success', // success / info / warning / error
      });
      this.getDetail(_result.data.permitProdHisNo);
      this.saveAttach();

      this.isRev = false;
      this.updateMode = true;
      // this.insertMode = false;
      this.isUpdateButtonClicked = false;
      this.isRevisionButtonClicked = false;
      this.setAttachFileGrps();

      this.count++;
      //  this.closePopup();
    },
    check(gubun) {
      this.$validator
        .validateAll()
        .then((result) => {
          if (result) {
            if (
              this.isRevisionButtonClicked &&
              Number(this.permitProdHist.revNum) <= Number(this.latestRevNum)
            ) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395',
                message: 'M0000001075', // 개정번호는 이전 개정번호보다 커야합니다.
                type: 'warning',
              });
              return;
            }
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321',
              message: this.isRevisionButtonClicked
                ? 'M0000000166'
                : this.updateMode
                ? 'M0000000060'
                : 'M0000000011',
              // 개정하시겠습니까? : 수정하시겠습니까? : 저장하시겠습니까?
              type: 'info', // success / info / warning / error
              // 확인 callback 함수
              confirmCallback: () => {
                this.permitProdHist.createUserId = this.$store.getters.token;
                this.permitProdHist.updateUserId = this.$store.getters.token;
                this.saveData.permitProdHisNo =
                  this.permitProdHist.permitProdHisNo;
                this.saveData.createUserId = this.permitProdHist.createUserId;
                this.isSave = this.isRevisionButtonClicked ? false : true;
                this.isRev = this.isRevisionButtonClicked ? true : false;
              },
              // 취소 callback 함수
              cancelCallback: () => {
                this.isSave = false;
              },
            });
          } else if (!result) {
            this.$popupRequired.check(
              'chemicalOriginStatusDetail',
              this.$data,
              this.errors
            );
          }
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000876'
            // '유효성 검사도중 에러가 발생하였습니다.'
          );
          this.isSave = false;
        });
    },
    /** 신규등록 하기전 UI단 유효성 검사 **/
    beforeSave() {
      var gubun = '';
      // 신규등록
      if (
        this.popupParam.permitProdHisNo === 0 ||
        this.isRevisionButtonClicked
      ) {
        gubun = 'insert';
        this.saveUrl = transactionConfig.chm.chemPermitProdHis.insert.url;
        this.actionType = 'POST';
      }
      // 수정
      else {
        gubun = 'edit';
        this.saveUrl = transactionConfig.chm.chemPermitProdHis.edit.url;
        this.actionType = 'PUT';
      }

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
      this.permitProdHist.permitProdHisNo = _result.data.permitProdHisNo;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395',
        message: 'M0000000006', // 저장되었습니다.
        type: 'success', // success / info / warning / error
      });
      this.isSave = false;
      this.saveAttach();
      this.btnCancelClickedCallback();
    },
    saveAttach(_result) {
      this.$_.forEach(this.attachFileGrps, (item) => {
        item.taskKey = this.permitProdHist.permitProdHisNo;
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
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    closePopup(data) {
      this.$emit('closePopup', {});
    },
    searchChemprod() {
      this.popupOptions.target = () => import(`${'../chemprod/chemprod.vue'}`);
      this.popupOptions.title = 'L0000003309'; // 화학자재
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
        this.permitProdHist.chemProdNmKr = data.data.chemProdNmKr;
        this.permitProdHist.chemProdNo = data.data.chemProdNo;
        this.changeChemPermit = true;
      }
    },
    revPopup() {
      this.isRev = false;
      this.isRevisionButtonClicked = true;
      this.isUpdateButtonClicked = false;
      let taskKey = this.popupParam.permitProdHisNo
        ? this.popupParam.permitProdHisNo
        : '';
      if (
        (!this.permitProdHist.permitProdHisNo && !this.disabled) ||
        this.isRevisionButtonClicked ||
        this.isUpdateButtonClicked
      ) {
        this.gridOptions.btns[0].visible = true;
        this.gridOptions.btns[1].visible = true;
      }
      this.attachFileGrps = [
        {
          label: 'L0000003780' /* 인허가현황 파일업로드 */,
          listType: 'text',
          // drag: false,
          editable: this.editable,
          disabled: !this.editable,
          // showFileSearch: this.editable,
          limit: 20,
          multiple: true,
          uploadTempFiles: null,
          taskClassNm: 'PERMIT_PROD',
          taskKey: taskKey,
          taskFlag: '',
          createUserId: this.$store.getters.token,
        },
      ];
    },
    loadComponent() {
      var path = this.tabItems[this.tabIndex].url;

      if (path === 'multiFileUpload') {
        this.component = () =>
          import('@/pages/common/attachFile/multiFileUpload');
      } else if (path === './chemicalOriginStatusRevHistory') {
        this.component = () =>
          import('@/pages/chm/chemicalOrigin/chemicalOriginStatusRevHistory');
      } else {
        this.component = () => import(`${path}`);
      }
    },
    uploadFiles(data) {
      this.uploadFile.data = data;
    },
    setchangeChemPermit() {
      this.changeChemPermit = false;
    },
    getPermitCls() {
      this.$http.url = selectConfig.chm.chemicalPermitCls.listsimple.url;
      this.$http.type = 'get';
      this.$http.param = {
        useYn: 'Y',
        plantCd: this.permitProdHist.plantCd,
      };
      this.$http.request(
        (_result) => {
          this.permitClsItems = this.$_.clone(_result.data);
          this.permitClsItems.splice(0, 0, {
            permitClsNo: null,
            permitClsNm: this.$comm.getLangSpecInfoLabel('L0000003394'),
          });
          if (
            this.$_.findIndex(this.permitClsItems, {
              permitClsNo: this.permitProdHist.permitClsNo,
            }) === -1
          ) {
            this.permitProdHist.permitClsNo = null;
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getUserItems() {
      this.$http.url = selectConfig.manage.user.list.url;
      this.$http.type = 'get';
      this.$http.param = {
        useYn: 'Y',
        plantCd: this.permitProdHist.plantCd,
      };
      this.$http.request(
        (_result) => {
          this.userItems = this.$_.clone(_result.data);
          this.userItems.splice(0, 0, {
            userId: '',
            userNm: this.$comm.getLangSpecInfoLabel('L0000002519'),
          });
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    changeUploadFiles(data) {
      // 첨부된 파일이 변경되었을때
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
    setUploadedList(data) {
      if (data.taskClassNm === 'PERMIT_PROD') {
        this.uploadedMsdsList = [];
        this.$_.forEach(data.data, (_item) => {
          this.uploadedMsdsList.push({
            fileNo: _item.fileNo,
          });
        });
      }
    },
    cellEditEndHandler() {
      // this.$_.forEach(this.YAuiGrid.getGridData(), (item) => {
      //   this.permitProdHist.chmPermitRefProd.push(item);
      // });
      this.permitProdHist.chmPermitRefProd = this.YAuiGrid.getGridData();
    },
    openPopup() {
      this.popupOptions.target = () =>
        import(`${'../../chm/chemprod/chemprod.vue'}`);
      this.popupOptions.title = 'L0000003309'; // 화학자재
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        popupMode: true,
        multiple: true,
        plantCd: this.permitProdHist.plantCd,
      };
      this.popupOptions.width = '75%';
      this.popupOptions.top = '100px';
      this.popupOptions.closeCallback = this.closePopupSearchChemProd;
    },
    closePopupSearchChemProd(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data.data !== 'C') {
        this.$_.forEach(this.YAuiGrid.getGridData(), (item) => {
          data.data = this.$_.clone(
            this.$_.reject(data.data, { chemProdNo: item.chemProdNo })
          );
        });
        this.$_.forEach(data.data, (item) => {
          // const row = {
          //   chemProdNmKr: item.chemProdNmKr,
          //   chemProdNmEn: item.chemProdNmEn,
          //   chemProdNo: item.chemProdNo,
          // };
          // this.YAuiGrid.addRow(row, 'last');
          this.gridOptions.pdata.splice(0, 0, {
            chemProdNmKr: item.chemProdNmKr,
            chemProdNmEn: item.chemProdNmEn,
            chemProdNo: item.chemProdNo,
          });
        });
        this.YAuiGrid.setGridData(this.gridOptions.pdata);
        this.cellEditEndHandler();
      }
    },
    btnDelRowClicked() {
      let checkingData = this.YAuiGrid.getCheckedRowItemsAll();
      if (checkingData.length <= 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000000169',
          // 화학자재 목록에서 한개이상 선택하세요.
          type: 'warning', // success / info / warning / error
        });
        return;
      }

      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321',
        message: 'M0000000093', // 제외하시겠습니까?
        // TODO : 필요시 추가하세요.
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          // let delRow=[];
          // this.$_.forEach(checkingData, (item) => {
          //   delRow = this.$_.reject(this.YAuiGrid.getGridData(), {
          //     chemProdNo: item.chemProdNo,
          //   });
          // });
          let gridData = this.YAuiGrid.getGridData();
          this.$_.forEach(checkingData, (item) => {
            gridData = this.$_.reject(gridData, item);
          });

          this.YAuiGrid.setGridData(gridData);
          this.cellEditEndHandler();
          window.getApp.$emit('ALERT', {
            title: 'L0000003395', // 안내
            message: 'M0000000686',
            // 제외되었습니다.
            type: 'success', // success / info / warning / error
          });
        },
        // 취소 callback 함수
        cancelCallback: () => {},
      });
    },
    btnpDeleteClickedCallback(_result) {
      if (this.pselectValue.length <= 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000000169',
          // 화학자재 목록에서 한개이상 선택하세요.
          type: 'warning', // success / info / warning / error
        });
        return;
      } else {
        window.getApp.$emit('CONFIRM', {
          title: 'L0000003321',
          message: 'M0000000093', // 제외하시겠습니까?
          // TODO : 필요시 추가하세요.
          type: 'info', // success / info / warning / error
          // 확인 callback 함수
          confirmCallback: () => {
            this.$_.forEach(this.pselectValue, (item) => {
              this.gridOptions.pdata = this.$_.reject(this.gridOptions.pdata, {
                chemProdNo: item.chemProdNo,
              });
            });

            window.getApp.$emit('ALERT', {
              title: 'L0000003395', // 안내
              message: 'M0000000686',
              // 제외되었습니다.
              type: 'success', // success / info / warning / error
            });
          },
          // 취소 callback 함수
          cancelCallback: () => {},
        });
      }
    },
  },
};
</script>
