<!--
  목적 : 안전 - 변경관리 상세 - 변경관리위원회
  Detail : 변경관리위원회 등록/수정 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row>
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <!-- 변경관리위원회 참석자 목록 -->
          <y-auigrid
            ref="yAuiGrid"
            :name="gridOptions.name"
            :headers="gridOptions.header"
            :btns="gridOptions.btns"
            :height="gridOptions.height"
            :label="this.$comm.getLangSpecInfoLabel('L0000003600')"
            :useExcelExport="true"
            :showGridSetSave="false"
            :useContextMenu="true"
            :enableRightDownFocus="true"
            :showGridCtrl="true"
            :editable="editable && !allDisabled"
            :showRowCheckColumn="true"
            :showRowAllCheckBox="true"
            @btnAdd="btnAdd"
            @btnDelete="btnDelete"
            @btnClickedErrorCallback="btnClickedErrorCallback"
            @cellEditEnd="cellEditEndHandler"            
          />
        </b-col>
      </b-col>
    </b-row>
    <!-- 등록 -->
    <b-row ref="editBox" class="mt-3">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 변경관리 위원회 상세 -->
            <y-label label="L0000003601" icon="user-edit" color-class="cutstom-title-color" />
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 위원회 개최일 -->
              <y-datepicker
                :width="8"
                :editable="editable && change.commiYn === 'Y'"
                :disabled="allDisabled"
                label="L0000003624"
                name="commiDt"
                :required="true"
                v-model="changeCommi.commiDt"
                v-validate="'required'"
                :state="validateState('commiDt')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <b-row>
                <b-col sm="4">
                  <!-- 등록자 -->
                  <y-label label="L0000000976" />
                </b-col>
                <b-col sm="8">
                  <y-label
                    :label="changeCommi.deptNm + ' / ' + changeCommi.createUserNm"
                    :fieldable="true"
                  />
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <!-- 위원회 협의내용 -->
              <y-textarea
                :width="10"
                :maxlength="600"
                :editable="editable && change.commiYn === 'Y'"
                :disabled="allDisabled"
                ui="bootstrap"
                label="L0000003623"
                name="commiContents"
                v-model="changeCommi.commiContents"
              ></y-textarea>
            </b-col>
            <!-- 첨부파일 -->
            <el-divider content-position="left">{{$comm.getLangSpecInfoLabel('L0000002843')}}</el-divider>
            <b-col sm="12" class="mb-2">
              <y-file-upload
                v-if="attachFileGrp"
                :ref="'fileupload'"
                label=""
                :showUploadBtn="false"
                :drag="attachFileGrp.drag"
                :editable="attachFileGrp.editable && change.commiYn === 'Y'"
                :multiple="attachFileGrp.multiple"
                :attach-file-grp="attachFileGrp"
                :close="true"
                :limit="attachFileGrp.limit"
                :disabled="attachFileGrp.disabled"
                :listType="attachFileGrp.listType"
                :showFileSearch="attachFileGrp.showFileSearch"
                :onlyDownload="attachFileGrp.onlyDownload"
                :uploadTempFiles="attachFileGrp.uploadTempFiles"
                @uploadFiles="uploadFiles"
                @setDeleteTempFileData="setDeleteTempFileData"
              ></y-file-upload>
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
  name: 'y-change-commi',
  props: {
    allDisabled: false,
    tabIndex: {
      type: String,
      default: '',
    },
    change: {
      type: Object,
      default: {
        safChngNo: 0, // key
        chngStepCd: '',
        commiYn: 'N',
        safChngCommiNo: 0,
      },
    },
    commi: {
      type: Object,
      default: {
        submitCheckCommi: false,
      },
    },
  },
  data: () => ({
    changeCommi: {
      safChngCommiNo: 0, // key
      safChngNo: 0,
      commiDt: '',
      deptNm: '',
      commiContents: '',
      createUserId: '',
      createUserNm: '',
      createDt: '',
      updateUserId: '',

      changeCommiPsns: [],
    },
    YAuiGrid: null,
    gridOptions: {
      name: 'changechangeCommi',
      header: [],
      data: [],
      height: '300',
    },
    selectedValue: [],
    popupOptions: {
      target: null,
      title: '',
      visible: false,
      param: {},
      width: '90%',
      top: '10px',
      closeCallback: null,
    },
    attach: null,
    attachFileGrp: null,
    saveAttachFiles: [],
    tempDeleteFiles: [],

    editable: false,
    searchDetailUrl: '',
    searchChangNumUrl: '',
  }),
  watch: {
    tabIndex: {
      handler: function(val, oldVal) {
        this.getDetail();
      },
      deep: true,
    },
    'change.safChngNo': {
      handler: function(val, oldVal) {
        this.getDetail();
      },
    },
    changeCommi: {
      handler: function(val, oldVal) {
        this.$emit('setChangeCommi', this.changeCommi);
      },
      deep: true,
    },
    'gridOptions.data': {
      handler: function(val, oldVal) {
        this.changeCommi.changeCommiPsns = this.gridOptions.data;
      },
      deep: true,
    },
    // 첨부하기 위해 올린 파일이 있을 경우 파일저장
    'commi.submitCheckCommi': {
      handler: function(val, oldVal) {
        // true
        if (val) {
          let taskKey = this.change.safChngCommiNo
            ? this.change.safChngCommiNo.toString()
            : '';
          this.attachFileGrp.taskKey = taskKey;
          if (
            this.saveAttachFiles &&
            this.saveAttachFiles.data &&
            this.saveAttachFiles.data.length
          ) {
            this.$refs['fileupload'].submitUpload();
            // this.$_.forEach(this.saveAttachFiles, (item) => {
            //   if (item.data) {
            //   }
            // });
          }
          if (this.tempDeleteFiles && this.tempDeleteFiles.length > 0) {
            this.$http.url = transactionConfig.attachFile.deleteMulti.url;
            this.$http.type = 'DELETE';
            this.$http.param = {
              data: Object.values(this.$_.clone(this.tempDeleteFiles)),
            };
            this.$http.request(_result => {
              this.tempDeleteFiles = [];
              this.$emit('refCommiComplete');
            });
          }
        }
      },
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
    this.setGridBtns();
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;

      this.searchDetailUrl = selectConfig.saf.changeCommi.get.url;
      this.getDetail();

      this.attach = () => import('@/pages/common/attachFile/multiFileUpload');

      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001287'), // 부서
          dataField: 'deptNm',
          width: '130px',
          style: 'center-align',
          editable: false,
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002768'), // 직급
          dataField: 'positionNm',
          width: '130px',
          style: 'center-align',
          editable: false,    
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001630'), // 성명
          dataField: 'userNm',
          width: '130px',
          style: 'center-align',
          editable: false,
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000889'), // 담당
          dataField: 'mgrDesc',
          width: '130px',
          style: 'center-align',
          editRenderer: {
            type: "InputEditRenderer",
            showEditorBtnOver: true, // 마우스 오버 시 에디터버턴 보이기
          }
        },
      ];
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
    /** 변경관리위원회 상세 검색 **/
    getDetail() {
      if (!this.change.safChngNo || this.change.safChngNo === 0) {
        this.changeCommi.deptNm = this.$store.getters.deptNm;
        this.changeCommi.createUserNm = this.$store.getters.name;
        this.changeCommi.createUserId = this.$store.getters.token;
        this.setAttachFileGrps(); // 첨부파일 셋팅
      } else {
        this.$http.url = this.$format(
          this.searchDetailUrl,
          this.change.safChngNo
        );
        this.$http.type = 'GET';
        this.$http.request(
          _result => {
            this.$_.extend(this.changeCommi, _result.data);
            if (!this.changeCommi.changeCommiPsns) {
              this.gridOptions.data = [];
            } else {
              this.gridOptions.data = this.$_.clone(
                this.changeCommi.changeCommiPsns
              );
            }
            if (!this.changeCommi.createUserId) {
              this.changeCommi.deptNm = this.$store.getters.deptNm;
              this.changeCommi.createUserNm = this.$store.getters.name;
              this.changeCommi.createUserId = this.$store.getters.token;
            }
            this.setAttachFileGrps(); // 첨부파일 셋팅
            this.YAuiGrid.setGridData(this.gridOptions.data);
            this.YAuiGrid.changeColumnLayout(this.gridOptions.header);
            this.setNewGridBtnArr();
          },
          _error => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      }
    },
    setAttachFileGrps() {
      let taskKey = this.changeCommi.safChngCommiNo
        ? this.changeCommi.safChngCommiNo.toString()
        : '';
      this.attachFileGrp = {
        drag: !this.allDisabled,
        editable: this.editable,
        disabled: this.allDisabled,
        onlyDownload: this.allDisabled,
        limit: 10,
        multiple: true,
        uploadTempFiles: {
          data: [],
        },
        taskClassNm: 'CHANGE_COMMI',
        taskKey: taskKey,
        taskFlag: '',
        createUserId: this.$store.getters.token,
      };
    },
    /** button 관련 이벤트 **/
    /**
     * 수정 버튼 안보여지도록 처리
     *  버튼 http 통신 중 error 발생 callback
     * _result : error return하는 데이터
     */
    btnClickedErrorCallback(_result) {
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    /**
     * 점검팀원 행 추가
     */
    btnAdd() {
      this.popupOptions.target = () =>
        import(`${'@/pages/manage/user/userSearch.vue'}`);
      this.popupOptions.param = {
        multiple: true,
      };
      this.popupOptions.title = 'L0000001466'; // 사용자검색
      this.popupOptions.visible = true;
      this.popupOptions.width = '60%';
      this.popupOptions.top = '10px';
      this.popupOptions.closeCallback = this.closePopupSearchUser;
    },
    closePopupSearchUser(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data.users) {
        this.$_.forEach(data.users, user => {
          if (
            this.$_.findIndex(this.gridOptions.data, {
              userId: user.userId,
            }) === -1
          ) {
            this.gridOptions.data.splice(0, 0, {
              userId: user.userId,
              userNm: user.userNm,
              deptCd: user.deptCd,
              deptNm: user.deptNm,
              positionCd: user.positionCd,
              positionNm: user.positionNm,
              mgrDesc: '',
            });

          }
        });
        this.YAuiGrid.setGridData(this.gridOptions.data);
        this.setNewGridBtnArr();
      }
    },
    /**
     * 변경관리위원회 참석자 행 삭제
     */
    btnDelete() {
      this.$_.forEach(this.YAuiGrid.getCheckedRowItems(), item => {
        this.gridOptions.data.splice(
          this.$_.indexOf(
            this.$_.map(this.gridOptions.data, 'userId'),
            item.item.userId
          ),
          1
        );
      });
      this.YAuiGrid.setGridData(this.gridOptions.data);
      this.setNewGridBtnArr();
    },
    /**
     *  팝업 안 보이도록 closePopup emit
     *  팝업 close
     * data : 팝업창에서 return하는 데이터
     */
    closePopup(data) {
      this.$emit('closePopup', {});
    },
    uploadFiles(data, taskClassNm) {
      var index = this.$_.findIndex(this.saveAttachFiles, {
        taskClassNm: taskClassNm,
      });

      this.attachFileGrp.uploadTempFiles.data = data;
      this.saveAttachFiles.data = data;

      this.$emit('refCommi');
    },
    setDeleteTempFileData(data) {
      var pushData = {
        fileNo: data.fileNo,
      };
      this.tempDeleteFiles.push(pushData);
      this.$emit('refCommi');
    },
    setGridBtns() {
      this.gridOptions.btns = [
        { 
          title: this.$comm.getLangSpecInfoLabel('L0000002892'), 
          color: 'orange',
          btnClicked: 'btnAdd',
          btnClickedErrorCallback: 'btnClickedErrorCallback',
          visible: !this.allDisabled && this.editable && this.change.commiYn === 'Y',
        },  // 행 추가
        { 
          title: this.$comm.getLangSpecInfoLabel('L0000001495'), 
          color: 'red', 
          btnClicked: 'btnDelete',
          btnClickedErrorCallback: 'btnClickedErrorCallback',
          visible: this.YAuiGrid.getRowCount() > 0 && !this.allDisabled && this.editable && this.change.commiYn === 'Y',
        },  //  행 삭제
      ];

      this.YAuiGrid.setBtnArr(this.gridOptions.btns);
    },
    // YAuiGrid 버튼 다시 생성
    setNewGridBtnArr() {
      this.gridOptions.btns[1].visible = this.YAuiGrid.getRowCount() > 0 && !this.allDisabled && this.editable && this.change.commiYn === 'Y';
      this.YAuiGrid.setNewBtnArr(this.gridOptions.btns);
    },
    cellEditEndHandler (event) {
      if (event.dataField === 'mgrDesc') {
        this.gridOptions.data[event.rowIndex].mgrDesc = event.value;
      }
    }
    /** end button 관련 이벤트 **/
  },
};
</script>