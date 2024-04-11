<!--
  목적 : 일괄 조치요청
  Detail : 개선사항 일괄 조치 요청 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 등록 -->
    <b-row>
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!--  조치요청 상세 정보 -->
            <y-label
              label="L0000002688"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 저장 -->
              <y-btn
                v-if="editable"
                :action-url="insertUrl"
                :param="saveData"
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
              <y-btn title="L0000000881" @btnClicked="closePopup('CLOSE')" />
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col
              v-if="actClassMode"
              sm="12"
              md="12"
              lg="12"
              xl="12"
              class="col-xxl-12"
            >
              <b-row>
                <b-col sm="2">
                  <!-- 진행 단계 -->
                  <y-label label="L0000002775" />
                </b-col>
                <b-col>
                  <b>
                    <font color="blue"
                      >{{ $comm.getLangSpecInfoLabel('L0000002052')
                      }}<!-- 요청등록 --></font
                    >&nbsp;&nbsp;▷&nbsp;&nbsp;{{
                      $comm.getLangSpecInfoLabel('L0000002590')
                    }}<!-- 접수 -->&nbsp;&nbsp;▷&nbsp;&nbsp;{{
                      $comm.getLangSpecInfoLabel('L0000002674')
                    }}<!-- 조치부서 조치 -->&nbsp;&nbsp;▷&nbsp;&nbsp;
                    {{ $comm.getLangSpecInfoLabel('L0000000262')
                    }}<!-- 개선완료 -->
                  </b>
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 업무구분 -->
              <y-select
                :width="8"
                :disabled="true"
                :editable="editable"
                :comboItems="comboImprClassItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="L0000001947"
                name="imprClassCd"
                v-model="imprAct.imprClassCd"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <b-row>
                <b-col sm="3">
                  <!-- 작성일/작성자 -->
                  <y-label label="L0000002353" />
                </b-col>
                <b-col sm="4">
                  <y-text
                    :width="12"
                    :editable="editable"
                    :disabled="true"
                    ui="bootstrap"
                    name="imprRqstYmd"
                    v-model="imprAct.imprRqstYmd"
                  ></y-text>
                </b-col>
                <b-col sm="5">
                  <y-text
                    :width="12"
                    :editable="editable"
                    :disabled="true"
                    ui="bootstrap"
                    name="imprRqstUserInfo"
                    v-model="imprRqstUserInfo"
                  ></y-text>
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <y-plant
                type="edit"
                :required="true"
                :editable="false"
                name="plantCd"
                label="L0000005369"
                v-model="imprAct.plantCd"
                v-validate="'required'"
                :state="validateState('plantCd')"
              />
            </b-col>
            <!-- 조치구분 -->
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-select
                :editable="editable"
                :width="8"
                :comboItems="actClassItem"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="L0000002668"
                name="actClassCd"
                v-model="imprAct.actClassCd"
                :required="true"
                v-validate="'required'"
                :state="validateState('actClassCd')"
              ></y-select>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <!-- 개선요청명 -->
              <y-text
                :width="10"
                :editable="editable"
                :maxlength="50"
                :required="true"
                ui="bootstrap"
                label="L0000005370"
                name="imprTitle"
                v-model="imprAct.imprTitle"
                v-validate="'required'"
                :state="validateState('imprTitle')"
              ></y-text>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <!-- 조치 요청내용 -->
              <y-textarea
                :width="10"
                :editable="editable"
                :maxlength="150"
                :required="true"
                label="L0000002665"
                ui="bootstrap"
                name="imprRqstContents"
                v-model="imprAct.imprRqstContents"
                v-validate="'required'"
                :state="validateState('imprRqstContents')"
              />
            </b-col>
            <b-col
              v-if="!actClassMode"
              sm="12"
              md="12"
              lg="12"
              xl="12"
              class="col-xxl-12"
            >
              <!-- 세부위치 -->
              <y-text
                :width="10"
                :maxlength="50"
                :editable="editable"
                ui="bootstrap"
                label="L0000001641"
                name="dtlLocat"
                v-model="imprAct.dtlLocat"
              ></y-text>
            </b-col>
            <b-col
              v-if="!actClassMode"
              sm="12"
              md="12"
              lg="12"
              xl="12"
              class="col-xxl-12"
            >
              <!-- 발견사항 -->
              <y-textarea
                :width="10"
                :maxlength="600"
                :editable="editable"
                label="L0000001073"
                ui="bootstrap"
                name="discoverMatter"
                v-model="imprAct.discoverMatter"
              />
            </b-col>
            <b-col
              v-if="!actClassMode"
              sm="12"
              md="12"
              lg="12"
              xl="12"
              class="col-xxl-12"
            >
              <!-- 조치결과내용 -->
              <y-textarea
                :width="10"
                :maxlength="1300"
                :editable="editable"
                label="L0000002666"
                ui="bootstrap"
                name="actResultContents"
                :required="!actClassMode"
                v-model="imprAct.actResultContents"
                v-validate="'required'"
                :state="validateState('actResultContents')"
              />
            </b-col>
            <b-col
              v-if="!actClassMode"
              sm="6"
              md="6"
              lg="6"
              xl="6"
              class="col-xxl-6"
            >
              <b-row>
                <b-col sm="8">
                  <!-- 조치부서/담당자 -->
                  <y-text
                    :width="6"
                    :editable="editable"
                    :clearable="true"
                    :disabled="true"
                    :required="!actClassMode"
                    ui="bootstrap"
                    name="actDeptNm"
                    label="L0000002675"
                    v-model="imprAct.actDeptNm"
                    v-validate="'required'"
                    :state="validateState('actDeptNm')"
                  />
                </b-col>
                <b-col sm="4">
                  <y-text
                    :width="12"
                    :editable="editable"
                    :clearable="true"
                    :disabled="true"
                    :required="!actClassMode"
                    ui="bootstrap"
                    name="actUserNm"
                    v-model="imprAct.actUserNm"
                    :appendIcon="[
                      { icon: 'search', callbackName: 'searchUser' },
                    ]"
                    @searchUser="btnSearchUserClicked"
                    v-validate="'required'"
                    :state="validateState('actUserNm')"
                  />
                </b-col>
              </b-row>
            </b-col>
            <b-col
              v-if="!actClassMode"
              sm="6"
              md="6"
              lg="6"
              xl="6"
              class="col-xxl-6"
            >
              <!-- 조치일 -->
              <y-datepicker
                :width="8"
                :editable="editable"
                :disabled="disabled"
                label="L0000002690"
                type="today"
                name="actConfirmYmd"
                default="imprAct.actConfirmYmd"
                :required="!actClassMode"
                v-model="imprAct.actConfirmYmd"
                v-validate="'required'"
                :state="validateState('actConfirmYmd')"
              ></y-datepicker>
            </b-col>
            <b-col
              v-if="popupParam.imprClassCd === 'ICL03' && actClassMode"
              sm="6"
              md="6"
              lg="6"
              xl="6"
              class="col-xxl-6"
            >
              <!-- 공정 -->
              <y-tree-process
                label="L0000000515"
                :editable="editable"
                name="processCd"
                :plantCd="imprAct.plantCd"
                :deptCd="imprAct.actDeptCd"
                v-model="imprAct.processCd"
              ></y-tree-process>
            </b-col>
            <b-col
              v-if="popupParam.imprClassCd === 'ICL03' && actClassMode"
              sm="6"
              md="6"
              lg="6"
              xl="6"
              class="col-xxl-6"
            >
              <!-- 세부위치 -->
              <y-text
                :width="8"
                :editable="editable"
                :maxlength="50"
                ui="bootstrap"
                label="L0000001641"
                name="dtlLocat"
                v-model="imprAct.dtlLocat"
              ></y-text>
            </b-col>
            <el-divider
              v-if="popupParam.imprClassCd === 'ICL02' && actClassMode"
              content-position="left"
              >{{ this.$comm.getLangSpecInfoLabel('L0000000273') }}
            </el-divider>
            <!-- 개선전 -->
            <b-col
              v-if="popupParam.imprClassCd === 'ICL02' && actClassMode"
              sm="12"
              md="12"
              lg="12"
              xl="12"
              class="col-xxl-12"
            >
              <b-row>
                <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
                  <!-- 빈도/강도/위험도 -->
                  <y-number
                    :width="6"
                    :maxlength="1"
                    :editable="editable"
                    ui="bootstrap"
                    label="L0000001380"
                    name="befFreq"
                    v-model="imprAct.befFreq"
                  ></y-number>
                </b-col>
                <b-col sm="2" md="2" lg="2" xl="2" class="col-xxl-2">
                  <y-number
                    :width="12"
                    :maxlength="1"
                    :editable="editable"
                    ui="bootstrap"
                    name="befInten"
                    v-model="imprAct.befInten"
                  ></y-number>
                </b-col>
                <b-col sm="2" md="2" lg="2" xl="2" class="col-xxl-2">
                  <y-number
                    :width="12"
                    :maxlength="2"
                    :disabled="true"
                    :editable="editable"
                    ui="bootstrap"
                    name="befDegRisk"
                    v-model="imprAct.befDegRisk"
                  ></y-number>
                </b-col>
              </b-row>
            </b-col>
          </b-row>
        </b-card>
        <b-row>
          <b-col v-show="actClassMode" sm="12" class="col-xxl-12 mt-2">
            <!-- 조치부서 목록 -->
            <y-auigrid
              ref="yAuiGrid"
              :editable="editable"
              :headers="gridOptions.header"
              :btns="gridOptions.btns"
              :height="gridOptions.height"
              :label="this.$comm.getLangSpecInfoLabel('L0000004217')"
              :useExcelExport="false"
              :showRowCheckColumn="true"
              @cellClick="cellClickHandler"
              @btnAdd="btnAdd"
              @btnDelete="btnDelete"
              @btnClickedError="btnClickedErrorCallback"
            />
          </b-col>
        </b-row>
        <b-row v-if="!actClassMode" class="mt-3">
          <b-col sm="12">
            <!-- 개선 전/후 사진 -->
            <y-label
              label="L0000000250"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
          </b-col>
        </b-row>
        <b-card v-if="!actClassMode">
          <b-row>
            <b-col sm="6">
              <y-file-upload
                ref="fileuploadBefore"
                :attach-file-grp="attachFileGrpBefore"
                :label="attachFileGrpBefore.label"
                :showUploadBtn="attachFileGrpBefore.showUploadBtn"
                :drag="!disabled"
                :showFileSearch="false"
                :editable="editable"
                :disabled="disabled"
                :multiple="true"
                :limit="5"
                :close="true"
                :onlyDownload="disabled"
                :refresh="refresh1"
                :uploadTempFiles="attachFileGrpBefore.uploadTempFiles"
                @uploadFiles="safetyPlanUploadFiles"
                @setDeleteTempFileData="setImprDeleteTempFileData"
                @setUploadFileLength="setUploadFileLength1"
                @uploadedList="uploadedList1"
              ></y-file-upload>
            </b-col>
            <b-col sm="6">
              <y-file-upload
                ref="fileuploadAfter"
                :attach-file-grp="attachFileGrpAfter"
                :label="attachFileGrpAfter.label"
                :showUploadBtn="attachFileGrpAfter.showUploadBtn"
                :drag="!disabled"
                :showFileSearch="false"
                :editable="editable"
                :disabled="disabled"
                :multiple="true"
                :limit="5"
                :close="true"
                :onlyDownload="disabled"
                :refresh="refresh2"
                :uploadTempFiles="attachFileGrpAfter.uploadTempFiles"
                @uploadFiles="safetyPlanUploadFiles"
                @setDeleteTempFileData="setImprDeleteTempFileData"
                @setUploadFileLength="setUploadFileLength2"
                @uploadedList="uploadedList2"
              ></y-file-upload>
            </b-col>
          </b-row>
        </b-card>
        <b-row v-if="!actClassMode" class="mt-3">
          <b-col sm="12">
            <!-- 첨부파일 -->
            <y-label
              label="L0000002843"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
          </b-col>
        </b-row>
        <b-card v-if="!actClassMode">
          <b-row>
            <b-col sm="12">
              <y-file-upload
                ref="fileupload"
                :attach-file-grp="attachFileGrp"
                :label="attachFileGrp.label"
                :showUploadBtn="attachFileGrp.showUploadBtn"
                :drag="!disabled"
                :showFileSearch="false"
                :editable="editable"
                :disabled="disabled"
                :multiple="true"
                :limit="5"
                :close="true"
                :onlyDownload="disabled"
                :refresh="refresh3"
                :uploadTempFiles="attachFileGrp.uploadTempFiles"
                @uploadFiles="safetyPlanUploadFiles"
                @setDeleteTempFileData="setImprDeleteTempFileData"
                @setUploadFileLength="setUploadFileLength3"
                @uploadedList="uploadedList3"
              ></y-file-upload>
            </b-col>
          </b-row>
        </b-card>
        <b-row v-if="actClassMode" class="mt-3">
          <b-col sm="12">
            <!-- 첨부파일 -->
            <y-label
              label="L0000002843"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
          </b-col>
        </b-row>
        <b-card v-if="actClassMode">
          <b-row>
            <b-col sm="12" class="px-0">
              <b-container fluid>
                <b-row class="mt-1">
                  <b-col
                    v-for="(attachFileGrp, index) in attachFileGrps"
                    :key="index"
                    :sm="12"
                    class="mb-2"
                  >
                    <y-file-upload
                      :ref="'fileupload_' + index"
                      :label="attachFileGrp.label"
                      :showUploadBtn="false"
                      :drag="attachFileGrp.drag"
                      :editable="attachFileGrp.editable"
                      :attach-file-grp="attachFileGrp"
                      :disabled="attachFileGrp.disabled"
                      :uploadTempFiles="attachFileGrp.uploadTempFiles"
                      :refresh="attachFileGrp.refresh"
                      @uploadFiles="uploadFiles"
                      @setDeleteTempFileData="setDeleteTempFileData"
                    ></y-file-upload>
                  </b-col>
                </b-row>
              </b-container>
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
import { v4 as uuidv4 } from 'uuid';
import searchIcon from '@/assets/images/info.png';
import deleteIcon from '@/assets/images/iconfinder_delete_icon.png';

export default {
  /* attributes: name, components, props, data */
  name: 'action-request',
  props: {
    popupParam: {
      type: Object,
      default: {
        plantCd: null,
        safImprActNo: 0,
        refTableId: 0,
        imprClassCd: null,
        taskClassNm: '',
        imprRqstContents: '',
        title: '',
        actClassCd: 'ACL01',
      },
    },
  },
  data() {
    return {
      editable: true,
      imprAct: {
        safImprActNo: '',
        plantCd: '',
        imprClassCd: '',
        actClassCd: '',
        imprRqstYmd: '',
        imprTitle: '',
        imprRqstDeptCd: '',
        imprRqstDeptNm: '',
        imprRqstUserId: '',
        imprRqstUserNm: '',
        imprRqstContents: '',
        discoverMatter: '',
        imprStepCd: '',
        refTable: '',
        refTableId: '',
        actSchYmd: '',
        actConfirmYmd: '',
        actUserId: '',
        actUserNm: '',
        actDeptCd: '',
        actDeptNm: '',
        actResultContents: '',
        actResultReview: '',
        createUserId: '',
        createDt: '',
        updateUserId: '',
        updateDt: '',
        befFreq: 0,
        befInten: 0,
        befDegRisk: 0,
        dtlLocat: '',
        processCd: '',
      },
      attachFileGrp: {
        taskClassNm: 'ACCTION',
        taskKey: '',
        createUserId: '',
        showUploadBtn: false,
        drag: true,
        uploadCheck: false,
        label: 'L0000003030' /* 파일업로드 */,
        uploadTempFiles: null,
      },
      attachFileGrpBefore: {
        taskClassNm: 'ACCTION_BEFORE',
        taskKey: '',
        createUserId: '',
        showUploadBtn: false,
        uploadCheck: false,
        drag: true,
        label: 'L0000000274' /* 개선전 사진 */,
        uploadTempFiles: null,
      },
      attachFileGrpAfter: {
        taskClassNm: 'ACCTION_AFTER',
        drag: true,
        taskKey: '',
        createUserId: '',
        showUploadBtn: false,
        uploadCheck: false,
        label: 'L0000000285' /* 개선후 사진 */,
        uploadTempFiles: null,
      },
      YAuiGrid: null,
      gridOptions: {
        height: '300',
        data: [],
        header: [],
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
      insertUrl: '',
      isInsert: false,
      imprRqstUserInfo: '',
      immediateBeforeImage: '',
      immediateAfterImage: '',
      comboImprClassItems: [],
      deleteValue: null,
      submitCheck: false,
      attachFileGrps: [],
      tempDeleteFiles: [],
      deleteTempFiles: [],
      actClassItem: [],
      actClassMode: false,
      disabled: false,
      countIndex1: 0,
      countIndex2: 0,
      countIndex3: 0,
      refresh1: false,
      refresh2: false,
      refresh3: false,
      actionType: 'POST',
      inserResult: null,
      saveData: null,
    };
  },
  watch: {
    'imprAct.befFreq'() {
      if (!this.imprAct.befFreq) {
        // this.imprAct.befFreq = 0;
        // this.imprAct.befDegRisk = 0;
      } else {
        this.imprAct.befDegRisk = this.imprAct.befFreq * this.imprAct.befInten;
      }
    },
    'imprAct.befInten'() {
      if (!this.imprAct.befInten) {
        // this.imprAct.befInten = 0;
        // this.imprAct.befDegRisk = 0;
      } else {
        this.imprAct.befDegRisk = this.imprAct.befFreq * this.imprAct.befInten;
      }
    },
    'imprAct.actClassCd'() {
      // this.$validator.reset();

      this.$validator.pause();
      this.$nextTick(() => {
        this.$validator.resume();
      });

      if (this.imprAct.actClassCd === 'ACL01') {
        this.actClassMode = false;
      } else if (this.imprAct.actClassCd === 'ACL02') {
        this.actClassMode = true;
        this.YAuiGrid.resize(null, this.gridOptions.height);
      }
      this.setDetailData(this.actClassMode);
    },
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      this.insertUrl = transactionConfig.saf.imprAct.insertAll.url;

      this.imprAct.imprClassCd = this.popupParam.imprClassCd;
      this.imprAct.imprRqstContents = this.popupParam.imprRqstContents;
      this.imprAct.imprTitle = this.popupParam.title;
      this.imprAct.actClassCd = this.popupParam.actClassCd;
      // 구분코드
      this.$comm.getComboItems('SAF_ACT_CLASS', false).then((_result) => {
        this.actClassItem = _result;
      });
      this.getComboItems('SAF_IMPR_CLASS'); // 개선분류코드
      if (this.popupParam.plantCd) {
        this.$nextTick(() => {
          this.imprAct.plantCd = this.popupParam.plantCd;
        });
      }

      this.gridOptions.header = [
        {
          headerText: 'safImprActNo',
          dataField: 'safImprActNo',
          visible: false,
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002673'),
          dataField: 'actDeptCd',
          width: '40%',
          editable: false,
          labelFunction: function (
            rowIndex,
            columnIndex,
            value,
            headerText,
            item,
            dataField,
            cItem
          ) {
            return item.actDeptNm || '';
          },
          renderer: {
            type: 'IconRenderer',
            iconPosition: 'aisleRight',
            iconWidth: 20,
            iconHeight: 20,
            iconFunction: (rowIndex, columnIndex, value, item) => {
              if (this.editable) {
                if ((value || null) !== null && value !== '') {
                  return deleteIcon;
                } else {
                  return searchIcon;
                }
              }
            },
          },
        } /* 조치부서 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002670'),
          dataField: 'actLimitYmd',
          width: '60%',
          editRenderer: {
            type: 'CalendarRenderer',
            onlyCalendar: true,
            defaultFormat: 'yyyy-mm-dd',
            editable: this.editable,
          },
        } /* 조치기한 */,
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002892'),
          color: 'orange',
          btnClicked: 'btnAdd',
          btnClickedError: 'btnClickedError',
          visible: this.editable,
        }, // 추가
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001495'),
          color: 'red',
          btnClicked: 'btnDelete',
          btnClickedError: 'btnClickedError',
          visible: this.editable,
        }, //  삭제
      ];
    },
    setAttachFileGrps(data, flag) {
      /**
       * 조치부서 추가 후 해당 조치부서에 대한 첨부파일이 없을 경우 첨부파일 컴포넌트 추가
       * 조치부서 삭제 후 해당 조치부서에 대한 첨부파일이 있을 경우 컴포넌트 제거
       * 조치부서 변경 후 첨부파일 컴포넌트의 개수가 조치부서 개수와 맞지 않을 경우 조치부서로 지정되지 않은 첨부파일 컴포넌트 제거
       */
      let taskKey = '';

      let idx = this.attachFileGrps.findIndex((attach) => {
        return attach.attachGrpId === 'ACCTION_' + data.uuid;
      });

      if (idx <= -1) {
        this.attachFileGrps.push({
          label: !data.actDeptNm
            ? 'L0000002843' // 첨부파일
            : data.actDeptNm +
              '_' +
              this.$comm.getLangSpecInfoLabel('L0000002843'), // 부서명_첨부파일,
          drag: this.editable,
          showFileSearch: true,
          editable: this.editable,
          disabled: !this.editable,
          limit: 5,
          multiple: true,
          uploadTempFiles: null,
          taskClassNm: 'ACCTION',
          taskKey: taskKey,
          createUserId: this.$store.getters.token,
          attachGrpId: 'ACCTION_' + data.uuid,
          refresh: false,
        });
      } else {
        if (flag === 'add') {
          this.attachFileGrps[idx].label = !data.actDeptNm
            ? 'L0000002843' // 첨부파일
            : data.actDeptNm +
              '_' +
              this.$comm.getLangSpecInfoLabel('L0000002843'); // 부서명_첨부파일
        } else {
          let tmp = this.attachFileGrps[idx + 1];

          let attachFileId = tmp ? this.$_.cloneDeep(tmp.attachFileId) : '';

          this.attachFileGrps.splice(idx, 1);

          if (attachFileId) {
            this.attachFileGrps[idx].attachFileId = attachFileId;
            this.attachFileGrps[idx].refresh =
              !this.attachFileGrps[idx].refresh;
          }
        }
      }
    },
    getComboItems(codeGroupCd) {
      this.$http.url = this.$format(
        selectConfig.codeMaster.getSelect.url,
        codeGroupCd
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          _result.data.splice(0, 0, {
            code: null,
            codeNm: this.$comm.getLangSpecInfoLabel('L0000003394'),
          }); /* 선택하세요 */
          this.comboImprClassItems = this.$_.clone(_result.data);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    setDetailData(data) {
      if (this.popupParam.flag === 'DETAIL') {
        this.disabled = true;
      } else {
        this.disabled = false;
      }
      if (!data) {
        this.imprAct.actClassCd = 'ACL01';
        this.setAttachFile();
      } else {
        this.imprAct.actClassCd = 'ACL02';
      }
      this.imprAct.plantCd = !this.popupParam.plantCd
        ? this.$store.getters.plantCd
        : this.popupParam.plantCd;
      this.imprAct.imprRqstUserId = this.$store.getters.token;
      this.imprAct.imprRqstUserNm = this.$store.getters.name;
      this.imprAct.imprRqstDeptCd = this.$store.getters.deptCd;
      this.imprAct.imprRqstDeptNm = this.$store.getters.deptNm;

      this.imprAct.imprRqstYmd = this.$comm.getToday();

      this.imprAct.imprStepCd = !this.popupParam.imprStepCd
        ? 'IMST1'
        : this.popupParam.imprStepCd;
      this.imprAct.refTableId = this.popupParam.refTableId;
      this.imprRqstUserInfo =
        this.imprAct.imprRqstDeptNm + ' ' + this.imprAct.imprRqstUserNm;

      this.imprAct.imprTitle = '';
      this.imprAct.imprRqstContents = '';
      this.imprAct.dtlLocat = '';
      this.imprAct.discoverMatter = '';
      this.imprAct.actResultContents = '';
      this.imprAct.actUserId = '';
      this.imprAct.actUserNm = '';
      this.imprAct.actDeptCd = '';
      this.imprAct.actDeptNm = '';
      if (this.imprAct.actClassCd === 'ACL01') {
        this.imprAct.actConfirmYmd = this.$comm
          .moment(this.$comm.getToday())
          .format('YYYY-MM-DD');

        this.imprAct.actUserId = this.$store.getters.token;
        this.imprAct.actUserNm = this.$store.getters.name;
        this.imprAct.actDeptCd = this.$store.getters.deptCd;
        this.imprAct.actDeptNm = this.$store.getters.deptNm;
      } else {
        this.imprAct.actConfirmYmd = '';
      }
    },
    closePopup(data) {
      this.$emit('closePopup', data);
    },
    setAttachFile() {
      let taskKey = this.popupParam.safImprActNo
        ? String(this.popupParam.safImprActNo)
        : '';
      this.attachFileGrp.taskKey = taskKey;
      this.attachFileGrp.createUserId = this.$store.getters.token;

      this.attachFileGrpBefore.taskKey = taskKey;
      this.attachFileGrpBefore.createUserId = this.$store.getters.token;

      this.attachFileGrpAfter.taskKey = taskKey;
      this.attachFileGrpAfter.createUserId = this.$store.getters.token;
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
    beforeInsert() {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            if (this.actClassMode) {
              if (!this.imprValidCheck('empty')) {
                window.getApp.$emit('ALERT', {
                  title: 'L0000003395',
                  message: 'M0000001012', // 조치부서를 1개 이상 추가해주세요.
                  type: 'warining',
                });
                return;
              }

              if (!this.imprValidCheck('dept')) {
                window.getApp.$emit('ALERT', {
                  title: 'L0000003395',
                  message: 'M0000001010', // 조치부서를 지정해주세요.
                  type: 'warining',
                });
                return;
              }

              if (!this.imprValidCheck('limit')) {
                window.getApp.$emit('ALERT', {
                  title: 'L0000003395',
                  message: 'M0000001011', // 조치기한을 지정해주세요.
                  type: 'warining',
                });
                return;
              }
            } else {
              if (this.imprAct.safImprActNo) {
                this.actionType = 'PUT';
              } else {
                this.actionType = 'POST';
              }
              this.insertUrl = transactionConfig.saf.imprAct.insert.url;

              this.imprAct.createUserId = this.$store.getters.token;
              this.imprAct.imprStepCd = 'IMST1';
              this.saveData = this.imprAct;
            }

            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321' /* 확인 */,
              message: 'M0000000011' /* 저장하시겠습니까? */,
              type: 'info', // success / info / warning / error
              // 확인 callback 함수
              confirmCallback: () => {
                if (this.actClassMode) {
                  const gridData = this.YAuiGrid.getGridData();
                  gridData.forEach((data) => {
                    this.imprAct.actDeptCd = data.actDeptCd;
                    this.imprAct.actDeptNm = data.actDeptNm;
                    this.imprAct.safImprActNo = data.safImprActNo;
                    this.$_.extend(data, this.imprAct);
                    data.createUserId = this.$store.getters.token;
                    data.imprStepCd = 'IMST1';
                  });

                  if (this.inserResult) {
                    this.actionType = 'PUT';
                  } else {
                    this.actionType = 'POST';
                  }

                  this.saveData = gridData;
                }

                this.isInsert = true;
              },
              cancelCallback: () => {},
            });
          } else {
            window.getApp.$emit(
              'APP_VALID_ERROR',
              'M0000000005' /*  필수 입력값을 입력해 주세요. */
            );
          }
        })
        .catch(() => {
          this.isInsert = false;
        });
    },
    btnInsertClickedCallback(_result) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395' /* 안내 */,
        message: 'M0000000006' /* 저장되었습니다. */,
        type: 'success', // success / info / warning / error
      });
      if (this.actClassMode) {
        this.inserResult = this.$_.clone(_result.data);
        if (this.actionType === 'POST') {
          this.inserResult.forEach((impr, index) => {
            let idx = this.attachFileGrps.findIndex((attachGrp) => {
              return attachGrp.attachGrpId === 'ACCTION_' + impr.uuid;
            });

            if (idx > -1) {
              this.attachFileGrps[idx].taskKey = impr.safImprActNo;
            }
            this.YAuiGrid.setCellValue(
              index,
              'safImprActNo',
              impr.safImprActNo
            );
          });

          this.$_.forEach(this.attachFileGrps, (attach, index) => {
            if (attach.uploadTempFiles && attach.uploadTempFiles.data) {
              this.saveAttach(attach.uploadTempFiles.data, index);
            }
          });
        }
      } else {
        this.attachFileGrpBefore.taskKey = _result.data;
        this.attachFileGrpAfter.taskKey = _result.data;
        this.attachFileGrp.taskKey = _result.data;
        this.imprAct.safImprActNo = _result.data;
        this.saveImprAttach();
      }
      this.saveData = null;
      this.isInsert = false;
    },
    imprValidCheck(flag) {
      let isValid = true;
      const gridData = this.YAuiGrid.getGridData();
      gridData.forEach((data) => {
        if (
          (!data.actDeptCd && flag === 'dept') ||
          (!data.actLimitYmd && flag === 'limit')
        ) {
          isValid = false;
        }
      });

      if (gridData.length <= 0 && flag === 'empty') {
        isValid = false;
      }

      return isValid;
    },
    cellClickHandler(event) {
      if (event.dataField === 'actDeptCd') {
        const value = event.item.actDeptCd || '';
        if (value !== '') {
          this.YAuiGrid.setCellValue(event.rowIndex, 'actDeptCd', '');
          this.YAuiGrid.setCellValue(event.rowIndex, 'actDeptNm', '');
        } else {
          this.popupOptions.target = () =>
            import(`${'@/pages/baseInfo/deptManage/deptSearchPopup.vue'}`);
          this.popupOptions.param = {
            plantCd: this.imprAct.plantCd,
          };
          this.popupOptions.rowIndex = event.rowIndex;
          this.popupOptions.title = 'L0000004627'; // 부서 검색
          this.popupOptions.visible = true;
          this.popupOptions.width = '35%';
          this.popupOptions.top = '100px';
          this.popupOptions.closeCallback = this.closePopupSearchDept;
        }
      }
    },
    closePopupSearchDept(data) {
      const rowIndex = this.popupOptions.rowIndex || 0;
      if (data.dept) {
        const deptCd = data.dept.deptCd;
        const deptNm = data.dept.deptNm;

        this.YAuiGrid.setCellValue(rowIndex, 'actDeptCd', deptCd);
        this.YAuiGrid.setCellValue(rowIndex, 'actDeptNm', deptNm);

        const row = this.YAuiGrid.getItemByRowIndex(rowIndex);
        this.setAttachFileGrps(row, 'add');
      }
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
    },
    btnAdd() {
      const addData = {
        actLimitYmd: this.$comm.getToday(),
        actDeptCd: null,
        actDeptNm: '',
        uuid: uuidv4(),
      };
      // this.gridOptions.data.push(addData);
      this.YAuiGrid.addRow(addData, 'last');
    },
    btnDelete() {
      if (this.YAuiGrid.getCheckedRowItems().length > 0) {
        const selectedRow = this.YAuiGrid.getCheckedRowItemsAll();
        let gridData = this.YAuiGrid.getGridData();

        this.$_.forEach(selectedRow, (item) => {
          gridData = this.$_.reject(gridData, item);

          this.setAttachFileGrps(item, 'delete');
        });

        this.YAuiGrid.setGridData(gridData);
      }
    },
    btnClickedErrorCallback(_result) {
      this.isInsert = false;
      this.saveData = null;

      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    uploadFiles(data, taskClassNm, fileGrp) {
      var index = this.$_.findIndex(this.attachFileGrps, {
        taskClassNm: taskClassNm,
        attachGrpId: fileGrp.attachGrpId,
      });
      if (index > -1) {
        data.index = index;
        this.attachFileGrps[index].uploadTempFiles = {
          data: data,
          taskClassNm: taskClassNm,
          attachGrpId: fileGrp.attachGrpId,
        };
      }
    },
    setImprDeleteTempFileData(data) {
      var pushData = {
        fileNo: data.fileNo,
      };
      this.tempDeleteFiles.push(pushData);
      // this.$emit('refWorkAttach');
    },
    setDeleteTempFileData(data) {
      var pushData = {
        fileNo: data.fileNo,
      };
      this.deleteTempFiles.push(pushData);
    },
    saveAttach(data, idx) {
      if (data && data.length) {
        this.$refs['fileupload_' + idx][0].submitUpload();
      }
    },
    saveImprAttach() {
      this.$refs['fileuploadBefore'].submitUpload();
      this.$refs['fileuploadAfter'].submitUpload();
      this.$refs['fileupload'].submitUpload();
      // task_key 를 셋팅한다.
      if (this.tempDeleteFiles && this.tempDeleteFiles.length > 0) {
        this.$http.url = transactionConfig.attachFile.deleteMulti.url;
        this.$http.type = 'DELETE';
        this.$http.param = {
          data: Object.values(this.$_.clone(this.tempDeleteFiles)),
        };
        this.$http.request(
          (_result) => {
            this.tempDeleteFiles = [];
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      }
    },
    btnSearchUserClicked(_item) {
      if (!this.editable || this.disabled) return;
      this.popupOptions.target = () =>
        import(`${'../manage/user/userSearch.vue'}`);
      this.popupOptions.param = {
        plantCd: this.imprAct.plantCd, // 선택한 사업장의 정보가 따라서 조회되도록 설정
      };
      this.popupOptions.title = 'L0000001466'; /* 사용자검색 */
      this.popupOptions.visible = true;
      this.popupOptions.width = '60%';
      this.popupOptions.top = '100px';
      this.popupOptions.closeCallback = this.closePopupSearchUser;
    },
    closePopupSearchUser(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      if (data.user) {
        this.imprAct.actUserId = data.user.userId;
        this.imprAct.actUserNm = data.user.userNm;
        this.imprAct.actDeptCd = data.user.deptCd;
        this.imprAct.actDeptNm = data.user.deptNm;
      }
    },
    safetyPlanUploadFiles(data, taskClassNm, attachFileGrp) {
      let inputData = {
        data: data,
      };

      if (this.attachFileGrpBefore.taskClassNm === taskClassNm) {
        this.attachFileGrpBefore.uploadTempFiles = inputData;
      } else if (this.attachFileGrpAfter.taskClassNm === taskClassNm) {
        this.attachFileGrpAfter.uploadTempFiles = inputData;
      } else if (this.attachFileGrp.taskClassNm === taskClassNm) {
        this.attachFileGrp.uploadTempFiles = inputData;
      }
    },
    setUploadFileLength1(data) {
      this.countIndex1 = data;
    },
    setUploadFileLength2(data) {
      this.countIndex2 = data;
    },
    setUploadFileLength3(data) {
      this.countIndex3 = data;
    },
    uploadedList1(data) {
      if (data && data.length > 0) {
        if (data.length < this.countIndex1 && this.countIndex1 !== 0) {
          this.refresh1 = !this.refresh1;
        } else {
          this.countIndex1 = 0;
        }
      }
    },
    uploadedList2(data) {
      if (data && data.length > 0) {
        if (data.length < this.countIndex2 && this.countIndex2 !== 0) {
          this.refresh2 = !this.refresh2;
        } else {
          this.countIndex2 = 0;
        }
      }
    },
    uploadedList3(data) {
      if (data && data.length > 0) {
        if (data.length < this.countIndex3 && this.countIndex3 !== 0) {
          this.refresh3 = !this.refresh3;
        } else {
          this.countIndex3 = 0;
        }
      }
    },
  },
};
</script>
