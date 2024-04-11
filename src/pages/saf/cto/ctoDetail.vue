<!--
  목적 : 안전 > 안전관찰(BBS) > 안전관찰 상세팝업
  Detail : 안전관찰 등록/수정 화면
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
            <!-- 등록자 정보 -->
            <y-label
              label="L0000000977"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 완료 -->
              <y-btn
                v-if="!disabled && deleteable && editable"
                :action-url="saveUrl"
                :param="cto"
                :is-submit="isComplete"
                title="L0000002039"
                color="black"
                action-type="PUT"
                beforeSubmit="beforeComplete"
                @beforeComplete="beforeComplete"
                @btnClicked="btnCompleteClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 저장 -->
              <y-btn
                v-if="!disabled && editable"
                :action-url="saveUrl"
                :param="cto"
                :is-submit="isSave"
                title="L0000002474"
                color="orange"
                :action-type="actionType"
                beforeSubmit="beforeEdit"
                @beforeEdit="beforeEdit"
                @btnClicked="btnSaveClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 삭제 -->
              <y-btn
                v-if="!disabled && deleteable && editable"
                color="red"
                title="L0000001495"
                @btnClicked="btnDeleteClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 닫기 -->
              <y-btn title="L0000000881" @btnClicked="closePopup" />
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
              <y-label label="L0000004274" /><!--  등록일 :  -->
              <y-label :label="cto.createDt" :fieldable="true" />
            </b-col>
            <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
              <y-label label="L0000004275" /><!--  등록부서 :  -->
              <y-label :label="cto.createDeptNm" :fieldable="true" />
            </b-col>
            <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
              <y-label label="L0000004276" /><!--  등록자 :  -->
              <y-label :label="cto.createUserNm" :fieldable="true" />
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
    <b-row class="mt-3">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 안전관찰 상세 -->
            <y-label
              label="L0000001850"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-plant
                type="edit"
                :required="true"
                :editable="editable"
                :disabled="disabled"
                name="plantCd"
                v-model="cto.plantCd"
                v-validate="'required'"
                :state="validateState('plantCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 관찰일자 -->
              <y-datepicker
                :width="8"
                :required="true"
                :disabled="disabled"
                :editable="editable"
                label="L0000000599"
                name="ctoDt"
                v-model="cto.ctoDt"
                v-validate="'required'"
                :state="validateState('ctoDt')"
              ></y-datepicker>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 소요시간 -->
              <y-number
                :width="8"
                :editable="editable"
                :disabled="disabled"
                :maxlength="5"
                :required="true"
                ui="bootstrap"
                label="L0000001665"
                name="ctoTm"
                v-model="cto.ctoTm"
                v-validate="'required'"
                :state="validateState('ctoTm')"
                appendText="분"
              ></y-number>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 관찰자 -->
              <y-text
                :width="8"
                :disabled="true"
                :editable="editable"
                :required="true"
                ui="bootstrap"
                label="L0000000600"
                name="userNm"
                v-model="cto.userNm"
                v-validate="'required'"
                :state="validateState('userNm')"
                :appendIcon="[{ icon: 'search', callbackName: 'searchUser' }]"
                @searchUser="btnSearchUserClicked"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 관찰인원 -->
              <y-number
                :width="8"
                :editable="editable"
                :disabled="disabled"
                :maxlength="5"
                :required="true"
                ui="bootstrap"
                label="L0000000598"
                name="manCnt"
                v-model="cto.manCnt"
                v-validate="'required'"
                :state="validateState('manCnt')"
                appendText="명"
              ></y-number>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <b-row>
                <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
                  <!-- 관찰작업 -->
                  <y-text
                    :width="8"
                    :disabled="true"
                    :editable="editable"
                    :required="true"
                    ui="bootstrap"
                    label="L0000000602"
                    name="deptNm"
                    v-model="cto.deptNm"
                    v-validate="'required'"
                    :state="validateState('deptNm')"
                  ></y-text>
                </b-col>
                <b-col sm="3" md="3" lg="3" xl="3" class="col-xxl-3">
                  <y-text
                    :width="12"
                    :disabled="true"
                    :editable="editable"
                    ui="bootstrap"
                    name="processNm"
                    v-model="cto.processNm"
                    v-validate="'required'"
                    :state="validateState('processNm')"
                  ></y-text>
                </b-col>
                <b-col sm="3" md="3" lg="3" xl="3" class="col-xxl-3">
                  <y-text
                    :width="12"
                    :disabled="true"
                    :editable="editable"
                    ui="bootstrap"
                    name="jobNm"
                    v-model="cto.jobNm"
                    v-validate="'required'"
                    :state="validateState('jobNm')"
                    :appendIcon="[
                      { icon: 'search', callbackName: 'searchJob' },
                    ]"
                    @searchJob="btnSearchJobClicked"
                  ></y-text>
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 작업구역 -->
              <y-text
                :width="8"
                :disabled="disabled"
                :editable="editable"
                :required="true"
                ui="bootstrap"
                label="L0000002372"
                name="workArea"
                v-model="cto.workArea"
                v-validate="'required'"
                :state="validateState('workArea')"
              ></y-text>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <!--  -->
              <y-auigrid
                ref="yAuiGrid"
                :editable="!disabled && editable"
                :name="gridOptions.name"
                :headers="gridOptions.header"
                :btns="gridOptions.btns"
                :height="gridOptions.height"
                :label="this.$comm.getLangSpecInfoLabel('L0000003221')"
                :useExcelExport="false"
                :showRowCheckColumn="true"
                @btnAdd="btnAdd"
                @btnRemove="btnRemove"
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
          {{ item.title }}
        </span>
      </el-tab-pane>
      <keep-alive>
        <component
          :is="component"
          v-if="component"
          sm="12"
          :disabled="disabled"
          :cto.sync="cto"
          :attItem.sync="attItem"
          :tabParam.sync="tabParam"
          :submitObject.sync="submitObject"
          :attachFileGrps.sync="attachFileGrps"
          :saveAttachFiles.sync="saveAttachFiles"
          @changeUploadFiles="changeUploadFiles"
          @setTempDeleteFiles="setTempDeleteFiles"
          @closePopup="closePopup2"
        />
      </keep-alive>
    </el-tabs>
    <b-row>
      <b-col sm="12">
        <div class="float-right mt-2">
          <!-- 완료 -->
          <!-- <y-btn
            v-if="!disabled && deleteable && editable"
            title="L0000002039"
            color="black"
            @btnClicked="beforeComplete"
            @btnClickedErrorCallback="btnClickedErrorCallback"
          /> -->
          <!-- 저장 -->
          <!-- <y-btn
            v-if="!disabled && editable"
            title="L0000002474"
            color="orange"
            @btnClicked="beforeEdit"
            @btnClickedErrorCallback="btnClickedErrorCallback"
          /> -->
          <!-- 삭제 -->
          <!-- <y-btn
            v-if="!disabled && deleteable && editable"
            color="red"
            title="L0000001495"
            @btnClicked="btnDeleteClickedCallback"
            @btnClickedErrorCallback="btnClickedErrorCallback"
          /> -->
          <!-- 닫기 -->
          <!-- <y-btn title="L0000000881" size="mini" @btnClicked="closePopup" /> -->
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
  name: 'y-cto-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        safCtoNo: 0, // 번호
        stepCd: '', // 진행상태
        createUserId: '',
      },
    },
  },
  data: () => ({
    // TODO : 현재까지 파악된 바로는 tab은 같은 폴더 또는 하위 폴더의 컴포넌트만 접근이 가능한 것으로 파악됨
    //                즉, 반드시 메인페이지 역할을 하는 vue와 동일 폴더나 하위 폴더에 tabItem 역할을 하는 vue 파일을 위치 시킬 것
    tabItems: [
      { title: '체크리스트', url: './ctoCheckList' }, // L0000002855
      { title: '총평/근본원인', url: './ctoGeneralCommentRootCause' }, // L0000002873
      { title: '개선사항', url: 'imprActTab' }, //  L0000000259
      { title: '첨부파일', url: 'multiFileUpload' }, //  L0000002843
    ],
    component: null,
    tabIndex: 0,
    cto: {
      safCtoNo: 0,
      plantCd: '',
      stepCd: '',
      stepNm: '',
      ctoDt: '',
      ctoTm: '',
      userId: '',
      manCnt: '',
      jobId: '',
      jobNm: '',
      deptCd: '',
      deptNm: '',
      processCd: '',
      processNm: '',
      workArea: '',
      mainAct: '',
      content: '',
      createDeptNm: '',
      createDt: '',
      createUserId: '',
      createUserNm: '',
      updateUserId: '',
      ctoActs: [],
      ctoCheckResults: [],
      ctoActCauses: [],
    },
    attItem: [],
    popupOptions: {
      target: null,
      title: '',
      visible: false,
      width: '80%',
      top: '50px',
      param: {},
      closeCallback: null,
    },
    YAuiGrid: null,
    gridOptions: {
      name: 'safCtoCtoDetail',
      header: [],
      data: [],
      height: '300',
    },
    // 개선조치를 위한 변수
    tabParam: {
      imprClassCd: '',
      refTableId: 0,
      editable: true,
      message: 'M0000000722', // 개선사항 입력은 안전관찰을 등록후 입력 가능합니다.
      detailCheck: false,
    },
    submitObject: {
      submitCheck: false,
    },
    attachFileGrps: [],
    saveAttachFiles: [],
    tempDeleteFiles: [],
    disabled: false,
    // saveBtnTitile: '수정',
    insertable: false,
    editable: true,
    updateMode: false,
    deleteable: false,
    isSave: false,
    isComplete: false,
    searchDetailUrl: '',
    deleteUrl: '',
    saveUrl: '',
    actionType: 'POST',
    id: 0,
  }),
  watch: {
    tabIndex: function(newValue, oldValue) {
      this.loadComponent();
    },
    // 'gridOptions.data': {
    //   handler: function(newValue, oldValue) {
    //     this.cto.ctoActs = [];
    //     this.$_.forEach(this.gridOptions.data, gridData => {
    //       this.cto.ctoActs.splice(0, 0, {
    //         mainAct: gridData.mainAct,
    //         remarks: gridData.remarks,
    //         selCd: gridData.selCd,
    //       });
    //     });
    //   },
    //   deep: true,
    // },
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

    this.getDetail();
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;

      // Url Setting
      this.searchDetailUrl = selectConfig.saf.cto.get.url;
      this.saveUrl = transactionConfig.saf.cto.insert.url;
      this.deleteUrl = transactionConfig.saf.cto.delete.url;

      this.cto.ctoDt = this.$comm.getToday();
      this.disabled = this.popupParam.stepCd === 'STEP2' ? true : false;

      this.setAttachFileGrps();
      // 양호불량여부
      this.getComboItems('SAF_SEL_VAL1').then((result) => {
        this.gridOptions.header = [
          { 
            headerText: this.$comm.getLangSpecInfoLabel('L0000004277'), 
            dataField: 'mainAct', 
            width: '37%',
            style: 'left-align',
            editRenderer: {
              type: 'InputEditRenderer', 
            }, 
          }, // 핵심행동 
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000004278'), 
            dataField: "selCd",
            width: '25%',
            editable: !this.disabled && this.editable,
            renderer: {
              type: "TemplateRenderer"
            }, 
            // dataField 로 정의된 필드 값이 HTML 이라면 labelFunction 으로 처리할 필요 없음.
            labelFunction: function (rowIndex, columnIndex, value, headerText, item) { 
              const name = "selCd_" + (item.safCtoActNo || ("id_" + item.id));
              
              const obj = document.querySelector('input[name="' + name + '"]:checked');
              if ((obj || null) !== null) {
                if (value !== obj.value) {
                  item.selCd = obj.value;
                  value = obj.value;
                }
              } else if (value === "") {
                const [firstObj] = result;
                item.selCd = firstObj.code;
                value = firstObj.code;
              }

              let template = '<div> ';
              result.forEach(row => {
                let checkedTag = '';
                let disabledTab = '';
                if (value === row.code) checkedTag = " checked='checked'";
                if ((!this.disabled && this.editable) === false) disabledTab = " disabled ";

                const id = name + "_" + row.code;
                template += " <input type='radio' id='" + id + "' name='" + name + "' value='" + row.code + "'" + checkedTag + disabledTab + ">";
                template += "<label for='" + id + "' class='grid-input-radio'>" + row.codeNm + " </label>";
                template += " </>";
              });
              template += ' </div>';
              return template;
            }
          }, // 양호/불량
          { 
            headerText: this.$comm.getLangSpecInfoLabel('L0000001360'), 
            dataField: 'remarks', 
            width: '38%',
            style: 'left-align',
            editRenderer: {
              type: 'InputEditRenderer', 
            }, 
          }, // 비고 
        ];
      }); 

      this.gridOptions.btns = [
        { 
          title: this.$comm.getLangSpecInfoLabel('L0000002892'), 
          color: 'orange', 
          btnClicked: 'btnAdd',
          visible: !this.disabled && this.editable,
        },  //  추가
        { 
          title: this.$comm.getLangSpecInfoLabel('L0000002615'), 
          color: 'red', 
          btnClicked: 'btnRemove',
          visible: !this.disabled && this.editable,
        },  //  제거
      ];
    },
    loadComponent() {
      var path = this.tabItems[this.tabIndex].url;

      if (path === 'multiFileUpload') {
        this.component = () =>
          import('@/pages/common/attachFile/multiFileUpload');
      } else if (path === 'imprActTab') {
        this.component = () => import('@/pages/impr/imprActTab');
      } else this.component = () => import(`${path}`);
    },
    setAttachFileGrps() {
      let taskKey = this.popupParam.safCtoNo
        ? this.popupParam.safCtoNo.toString()
        : '';
      this.attachFileGrps = [
        {
          label: 'L0000003030', // 파일업로드
          uploadTempFiles: null,
          taskClassNm: 'CTO',
          taskKey: taskKey,
          drag: false,
          showFileSearch: !this.disabled,
          editable: this.editable,
          disabled: this.disabled,
          onlyDownload: this.disabled,
          createUserId: this.$store.getters.token,
        },
      ];
    },
    /**
     * 공통 마스터 정보 조회
     * codeGroupCd : 마스터 테이블 codeGroupCd 정보
     */
    getComboItems(codeGroupCd) {
      return new Promise(resolve => {
        this.$http.url = this.$format(
          selectConfig.codeMaster.getSelect.url,
          codeGroupCd
        );
        this.$http.type = 'GET';
        this.$http.request(
          _result => {
            resolve(_result.data);
          },
          _error => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      });
    },
    getDetail() {
      if (!this.popupParam.safCtoNo || this.popupParam.safCtoNo === 0) {
        // this.saveBtnTitile = '신규등록';
        this.cto.createDeptNm = this.$store.getters.deptNm;
        this.cto.createDt = this.$comm.getToday();
        this.cto.createUserNm = this.$store.getters.name;

        this.cto.userId = this.$store.getters.token;
        this.cto.userNm = this.$store.getters.name;

        // 개선관리
        this.tabParam.imprClassCd = 'ICL06';
        this.tabParam.refTableId = 0;
        this.tabParam.editable = false;
        this.tabParam.detailCheck = this.disabled;
        return;
      }
      this.$http.url = this.$format(
        this.searchDetailUrl,
        this.popupParam.safCtoNo
      );
      this.$http.type = 'GET';
      this.$http.request(
        _result => {
          this.$_.extend(this.cto, _result.data);
          // this.gridOptions.data = this.$_.clone(this.cto.ctoActs);

          this.YAuiGrid.setGridData(this.cto.ctoActs);
          
          // 개선조치를 위한 변수 Setting
          this.tabParam.imprClassCd = 'ICL06';
          this.tabParam.refTableId = this.popupParam.safCtoNo;
          this.tabParam.editable = !this.disabled;
          this.tabParam.detailCheck = this.disabled;
          this.deleteable = true;
          this.updateMode = true;
          if (this.popupParam.stepCd === 'STEP2' ||
            (this.$store.getters.deptAuthGrp.plantAccessYn === 'N' && this.cto.createUserId !== this.$store.getters.token)) {
            this.disabled = true;
          }
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    saveCheckResult(completeable, alertTitle) {
      this.$validator
        .validateAll()
        .then(_result => {
          // TODO : 전역 성공 메시지 처리
          // 이벤트는 ./event.js 파일에 선언되어 있음
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321', // '확인',
              message: alertTitle + this.$comm.getLangSpecInfoLabel('L0000004842'), // 하시겠습니까?
              // TODO : 필요시 추가하세요.
              type: 'info', // success / info / warning / error
              // 확인 callback 함수
              confirmCallback: () => {
                this.cto.createUserId = this.$store.getters.token;
                this.cto.updateUserId = this.$store.getters.token;
                this.cto.ctoActCauses = [];
                this.$_.forEach(this.attItem, att => {
                  this.$_.forEach(att.itmCd, itm => {
                    this.cto.ctoActCauses.splice(0, 0, {
                      attCd: att.code,
                      itmCd: itm.code,
                    });
                  });
                });
                if (completeable > 0) {
                  this.cto.stepCd = 'STEP2';
                  this.isComplete = true;
                } else {
                  this.isSave = true;
                }
              },
              // 취소 callback 함수
              cancelCallback: () => {
                this.isSave = false;
                this.isComplete = false;
              },
            });
          } else if (!_result) {
            if (!this.cto.plantCd) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395', /* 안내 */
                message: 'M0000000863', // 사업장을 선택해주세요.
                type: 'warning', // success / info / warning / error
              });
              return false;
            }
            if (!this.cto.ctoDt) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395', /* 안내 */
                message: 'M0000001141', // 관찰일자를 선택해주세요.
                type: 'warning', // success / info / warning / error
              });
              return false;
            }
            if (!this.cto.ctoTm) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395', /* 안내 */
                message: 'M0000001142', // 소요시간을 입력해주세요.
                type: 'warning', // success / info / warning / error
              });
              return false;
            }
            if (!this.cto.userNm) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395', /* 안내 */
                message: 'M0000001143', // 관찰자를 선택해주세요.
                type: 'warning', // success / info / warning / error
              });
              return false;
            }
            if (!this.cto.manCnt) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395', /* 안내 */
                message: 'M0000001144', // 관찰인원을 입력해주세요.
                type: 'warning', // success / info / warning / error
              });
              return false;
            }
            if (!this.cto.deptNm) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395', /* 안내 */
                message: 'M0000001145', // 관찰작업을 선택해주세요.
                type: 'warning', // success / info / warning / error
              });
              return false;
            }
            if (!this.cto.workArea) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395', /* 안내 */
                message: 'M0000001146', // 작업구역을 입력해주세요.
                type: 'warning', // success / info / warning / error
              });
              return false;
            }
            window.getApp.$emit('ALERT', {
              title: 'L0000003395', // '안내',
              message: 'M0000000005', // '필수 입력값을 입력해 주세요.',
              type: 'warning', // success / info / warning / error
            });
          }
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000881', // 유효성 검사도중 에러가 발생하였습니다.
          );
          this.isSave = false;
          this.isComplete = false;
        });
    },
    /** 수정 하기전 UI단 유효성 검사 **/
    beforeEdit() {
      const gridData = this.YAuiGrid.getGridData();
      if (gridData.length > 0) {
        this.cto.ctoActs = gridData.map(rows => {
          return {
            mainAct: rows.mainAct,
            remarks: rows.remarks,
            selCd: rows.selCd
          };
        });
      } else this.cto.ctoActs = [];

      if (this.popupParam.safCtoNo === 0 || !this.popupParam.safCtoNo) {
        this.saveUrl = transactionConfig.saf.cto.insert.url;
        this.actionType = 'POST';
      } else {
        this.saveUrl = transactionConfig.saf.cto.edit.url;
        this.actionType = 'PUT';
      }
      this.saveCheckResult(0, this.$comm.getLangSpecInfoLabel('L0000002474')); // 저장
    },
    beforeComplete() {
      this.saveUrl = transactionConfig.saf.cto.edit.url;
      this.saveCheckResult(1, this.$comm.getLangSpecInfoLabel('L0000002039')); // 완료
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
    /**
     *  팝업 안 보이도록 closePopup emit
     *  팝업 close
     * data : 팝업창에서 return하는 데이터
     */
    closePopup(data) {
      this.$emit('closePopup', {});
    },
    closePopup2() {},
    /**
     * 수정 버튼 안보여지도록 처리
     *  버튼 http 통신 중 error 발생 callback
     * _result : error return하는 데이터
     */
    btnClickedErrorCallback(_result) {
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    /** button 관련 이벤트 **/
    /**
     *  수정 버튼 callback
     * _result : backend에서 return하는 데이터
     */
    btnSaveClickedCallback(_result) {
      if (!this.popupParam.safCtoNo || this.popupParam.safCtoNo === 0) {
        this.popupParam.safCtoNo = _result.data;
        this.cto.safCtoNo = _result.data;
      }
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // '안내',
        message: 'M0000000006', // 저장되었습니다.
        type: 'success', // success / info / warning / error
      });
      this.isSave = false;

      this.cto.stepCd = 'STEP1';

      this.tabParam.refTableId = this.popupParam.safCtoNo;
      this.tabParam.editable = true;
      this.tabParam.detailCheck = false;
      this.deleteable = true;
      this.updateMode = true;
      this.saveAttach();
    },
    btnCompleteClickedCallback(_result) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // '안내',
        message: 'M0000000078', // 완료되었습니다.
        type: 'success', // success / info / warning / error
      });
      this.isComplete = false;
      this.disabled = true;
      this.tabParam.editable = false;
      this.tabParam.detailCheck = true;
      this.setAttachFileGrps();
      this.saveAttach();
    },
    /**
     * 안전점검결과 삭제
     *  삭제 버튼 callback
     * _result : backend에서 return하는 데이터
     */
    btnDeleteClickedCallback(_result) {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321', // '확인',
        message: 'M0000000012', // 삭제하시겠습니까?
        // TODO : 필요시 추가하세요.
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          this.$http.url = this.$format(this.deleteUrl, this.cto.safCtoNo);
          this.$http.type = 'DELETE';
          this.$http.request(
            _result => {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395', // '안내',
                message: 'M0000000007', // 삭제되었습니다.
                type: 'success', // success / info / warning / error
              });
              this.closePopup(null);
            },
            _error => {
              window.getApp.$emit('APP_REQUEST_ERROR', _error);
            }
          );
        },
        // 취소 callback 함수
        cancelCallback: () => {},
      });
    },
    btnSearchUserClicked(_item) {
      if (!this.editable || this.disabled) return;

      this.popupOptions.target = () =>
        import(`${'../../manage/user/userSearch.vue'}`);
      this.popupOptions.param = {
        plantCd: this.cto.plantCd,
      };
      this.popupOptions.title = 'L0000001466'; // 사용자검색
      this.popupOptions.visible = true;
      this.popupOptions.width = '60%';
      this.popupOptions.top = '100px';
      this.popupOptions.closeCallback = this.closePopupSearchUser;
    },
    closePopupSearchUser(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data.user) {
        this.cto.userId = data.user.userId;
        this.cto.userNm = data.user.userNm;
      }
      this.$forceUpdate();
    },
    btnSearchJobClicked() {
      if (!this.editable || this.disabled) return;

      this.popupOptions.target = () =>
        import(`${'../../rsa/baseInfo/job.vue'}`);
      this.popupOptions.param = {
        popupMode: true,
      };
      this.popupOptions.title = 'L0000002365'; // 작업검색
      this.popupOptions.visible = true;
      this.popupOptions.width = '60%';
      this.popupOptions.top = '100px';
      this.popupOptions.closeCallback = this.closePopupSearchJob;
    },
    closePopupSearchJob(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      if (data && data.jobId) {
        this.cto.deptNm = data.deptNm;
        this.cto.deptCd = data.deptCd;
        this.cto.processCd = data.processCd;
        this.cto.processNm = data.processNm;
        this.cto.jobNm = data.jobNm;
        this.cto.jobId = data.jobId;
      }
    },
    btnAdd() {
      const addData = {
        id: this.id,
        mainAct: '',
        selCd: '',
        remarks: '',
      };
      this.id++;

      this.YAuiGrid.addRow(addData, 'last');
    },
    btnRemove() {
      if (this.YAuiGrid.getCheckedRowItems().length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000723', // 삭제할 핵심행동을 선택하세요.
          type: 'warning', // success / info / warning / error
        });
      } else {
        let gridData = this.YAuiGrid.getGridData();
        const selectedRows = this.YAuiGrid.getCheckedRowItemsAll();
        this.$_.forEach(selectedRows, item => {
          gridData = this.$_.reject(gridData, item);
        });

        this.YAuiGrid.setGridData(gridData);
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
    saveAttach() {
      // task_key 를 셋팅한다.
      this.$_.forEach(this.attachFileGrps, item => {
        item.taskKey = this.popupParam.safCtoNo;
      });

      if (this.tempDeleteFiles.length > 0) {
        this.$http.url = transactionConfig.attachFile.deleteMulti.url;
        this.$http.type = 'DELETE';
        this.$http.param = {
          data: Object.values(this.$_.clone(this.tempDeleteFiles)),
        };
        this.$http.request(
          _result => {
            this.tempDeleteFiles = [];
            // 저장할 데이터가 있는 경우
            if (this.saveAttachFiles.length > 0) {
              this.submitObject.submitCheck = !this.submitObject.submitCheck;
            }
            // 저장할 데이터가 없는 경우
            // else this.closePopup();
          },
          _error => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      } else {
        // 저장할 데이터가 있는 경우
        if (this.saveAttachFiles.length > 0) {
          this.submitObject.submitCheck = !this.submitObject.submitCheck;
        }
        // 저장할 데이터가 없는 경우
        // else this.closePopup();
      }
    },
    /** end button 관련 이벤트 **/
  },
};
</script>
