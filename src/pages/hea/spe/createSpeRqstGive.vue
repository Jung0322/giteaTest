<!--
  목적 : 안전보호구 > 보호구 신청 > 지급등록/수정 팝업
  작성자 : kga
  Detail :
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row>
      <!-- 보호구 지급 등록 -->
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 보호구 지급 -->
            <y-label
              label="L0000003999"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 지급완료 -->
              <y-btn
                v-if="
                  editable &&
                  this.speRqst.speStepCd !== 'SPES4' &&
                  this.updateMode
                "
                :action-url="completeUrl"
                :param="speRqst"
                :is-submit="isFinish"
                title="L0000004000"
                color="black"
                action-type="PUT"
                beforeSubmit="beforeFinish"
                @beforeFinish="beforeFinish"
                @btnClicked="btnFinishClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 저장 -->
              <y-btn
                v-if="
                  editable &&
                  this.speRqst.speStepCd !== 'SPES4' &&
                  this.insertMode
                "
                :action-url="insertUrl"
                :param="speRqst"
                :is-submit="isInsert"
                title="L0000002474"
                color="orange"
                action-type="POST"
                beforeSubmit="beforeInsert"
                @beforeInsert="beforeInsert"
                @btnClicked="btnInsertClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <y-btn
                v-if="
                  editable &&
                  this.speRqst.speStepCd !== 'SPES4' &&
                  this.updateMode
                "
                :action-url="editUrl"
                :param="speRqst"
                :is-submit="isEdit"
                title="L0000002474"
                color="orange"
                action-type="PUT"
                beforeSubmit="beforeInsert"
                @beforeInsert="beforeInsert"
                @btnClicked="btnEditClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 삭제 -->
              <y-btn
                v-if="editable && this.speRqst.speStepCd !== 'SPES4'"
                title="L0000001495"
                color="red"
                @btnClicked="btnDeleteClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 닫기 -->
              <y-btn title="L0000000881" @btnClicked="btnClosePopup" />
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-plant
                type="edit"
                :editable="editable"
                :disabled="true"
                name="plantCd"
                v-model="speRqst.plantCd"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 지급일 -->
              <y-datepicker
                :width="baseWidth"
                :disabled="true"
                default="today"
                label="L0000002751"
                name="giveYmd"
                :clearable="true"
                v-model="speRqst.giveYmd"
              ></y-datepicker>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 지급구분 -->
              <y-text
                :width="baseWidth"
                :editable="editable"
                :disabled="true"
                ui="bootstrap"
                label="L0000002746"
                name="rqstYnNm"
                v-model="rqstYnNm"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 신청부서 -->
              <y-text
                :width="baseWidth"
                :disabled="true"
                ui="bootstrap"
                label="L0000001798"
                name="rqstDeptNm"
                v-model="speRqst.rqstDeptNm"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 신청자 -->
              <y-text
                :width="baseWidth"
                :disabled="true"
                ui="bootstrap"
                label="L0000001803"
                name="rqstUserNm"
                v-model="speRqst.rqstUserNm"
              ></y-text>
            </b-col>
            <!-- <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
               보호구 신청 목록 
              <y-data-table
                label="L0000001266"
                ref="dataTable"
                :height="gridOptions.height"
                :headers="gridOptions.header"
                :items="gridOptions.data"
                :useRownum="false"
                @selectedRow="selectedRow"
                :popMode="true"
                :editable="editable"
              ></y-data-table>
            </b-col> -->
            <b-col sm="12" class="h100p">
              <!-- 보호구 신청 목록 -->
              <y-auigrid
                ref="yAuiGrid"
                :editable="true"
                :name="gridOptions.name"
                :headers="gridOptions.header"
                :btns="gridOptions.btns"
                :height="gridOptions.height"
                :label="this.$comm.getLangSpecInfoLabel('L0000001266')"
                :useExcelExport="false"
                :enableCellMerge="true"
                :enableSorting="true"
                :showGridSetSave="true"
                :useContextMenu="true"
                :enableRightDownFocus="true"
                :showGridCtrl="true"
                @selectedRow="selectedRow"
              />
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
            />

            <el-divider content-position="left">{{
              $comm.getLangSpecInfoLabel('L0000004002')
            }}</el-divider>
            <b-col sm="12" class="h100p">
              <!-- 보호구 지급 내용 목록 -->
              <y-auigrid
                ref="yAuiGrid3"
                :editable="true"
                :name="gridOptions3.name"
                :headers="gridOptions3.header"
                :btns="gridOptions3.btns"
                :height="gridOptions3.height"
                :label="this.$comm.getLangSpecInfoLabel('L0000001271')"
                :useExcelExport="false"
                :enableCellMerge="true"
                :enableSorting="true"
                :showGridSetSave="true"
                :useContextMenu="true"
                :enableRightDownFocus="true"
                :showGridCtrl="true"
                :showRowCheckColumn="true"
                @addGiveListClicked="addGiveListClicked"
                @deleteGiveListClicked="deleteGiveListClicked"
              />
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
  name: 'create-spe-rqst',
  props: {
    popupParam: {
      type: Object,
      default: {
        safSpeRqstGiveNo: 0, // 보호구신청및지급번호
      },
    },
  },
  data() {
    return {
      gridOptions: {
        name: 'createSpeRqstGive1',
        header: [],
        btns: [],
        data: [],
        height: '300',
      },
      gridOptions2: {
        name: 'createSpeRqstGive2',
        header: [],
        btns: [],
        data: [],
        height: '300',
      },
      gridOptions3: {
        name: 'createSpeRqstGive2',
        header: [],
        btns: [],
        data: [],
        height: '300',
      },
      YAuiGrid: null,
      YAuiGrid2: null,
      YAuiGrid3: null,
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '60%',
        top: '10px',
        param: {},
        customCallBack: null,
        closeCallback: null,
      },
      speRqst: {
        safSpeRqstGiveNo: 0, // 보호구신청및지급번호
        giveYmd: null, // 지급일
        rqstDeptCd: '',
        rqstDeptNm: '',
        rqstUserNm: '',
        rqstRemark: '',
        speKindCd: null, // 보호구종류
        speRqDtlList: [], // 신청목록
        speGiDtlList: [], // 지급목록
        createUserId: '',
        updateUserId: '',
        plantCd: '',
      },
      rqstYnNm: '신청지급',
      speKindNm: '', // 지급보호구 종류명
      speKindCd: '', // 지급보호구 종류코드
      safSpeNo: null, // 지급보호구
      speList: [{ speNm: '선택하세요', safSpeNo: null }], // 지급보호구 목록
      unitCost: '', // 단가
      unit: '', // 단위
      baseWidth: 8,
      editable: false,
      searchUrl: '',
      insertUrl: '',
      editUrl: '',
      completeUrl: '',
      isInsert: false,
      isEdit: false,
      isFinish: false,
      insertMode: false,
      updateMode: false,
      selectedValue: [],
      selectedValue2: [],
      giveCyclCdItems: [],

      // 첨부 파일
      attach: null,
      submitCheck: false,
      saveAttachFiles: [],
      tempDeleteFiles: [],
      attachFileGrps: [],
    };
  },
  watch: {
    speKindCd: function (newVal, oldVal) {
      this.getSpeList();
    },
    safSpeNo: function (newVal, oldVal) {
      if (this.safSpeNo) {
        let spe = this.$_.find(this.speList, { safSpeNo: this.safSpeNo });
        this.unit = spe.giveUnitNm;
        this.unitCost = spe.unitCost;
        if (spe.safSpeNo) {
          this.unitCost = ''; // 단가
          this.getSafSpeData(spe.safSpeNo);
        } else {
          this.unitCost = ''; // 단가
        }
      }
      this.gridOptions2.data = [];
    },
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.getCommonCodeList('SAF_SPE_CHK_CYE'); // 보호구 지급주기
    this.init();
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.YAuiGrid3 = this.$refs.yAuiGrid3;
  },
  beforeDestroy() {},
  /** methods **/
  methods: {
    init() {
      // this.editable = this.$route.meta.editable;
      let userAuthGrps = this.$store.getters.userAuthGrps;
      this.$_.forEach(userAuthGrps, (item) => {
        if (
          (item.authGrpNo === '1036' && item.settingYn === 'Y') ||
          (item.authGrpNo === '1090' && item.settingYn === 'Y') ||
          (item.authGrpNo === '1095' && item.settingYn === 'Y')
        ) {
          this.editable = true;
        }
      });

      // URL 셋팅
      this.searchUrl = selectConfig.saf.speRqstDtl.list.url;
      this.insertUrl = transactionConfig.saf.speGive.insert.url;
      this.editUrl = transactionConfig.saf.speGive.edit.url;
      this.completeUrl = transactionConfig.saf.speGive.complete.url;

      this.speRqst.safSpeRqstGiveNo = this.popupParam.safSpeRqstGiveNo;
      this.getSpeRqst();

      // 보호구 신청 그리드 헤더
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001277'),
          dataField: 'speKindNm',
          width: '20%',
          editable: false,
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001801'),
          dataField: 'rqstNum',
          width: '20%',
          style: 'right-align',
          editable: false,
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001800'),
          dataField: 'rqstSpeRemark',
          width: '30%',
          editable: false,
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002749'),
          dataField: 'giveSpeRemark',
          width: '30%',
          editRenderer: {
            type: 'InputEditRenderer',
            maxlength: 100,
          },
        },
      ];

      // 보호구 지급 추가 그리드 헤더
      this.gridOptions2.header = [
        {
          text: 'L0000004367',
          name: 'deptNm',
          width: '100px',
          align: 'center',
        }, // 부서명
        {
          text: 'L0000001412',
          name: 'userId',
          width: '100px',
          align: 'center',
        }, // 사번
        {
          text: 'L0000001630',
          name: 'userNm',
          width: '100px',
          align: 'center',
        }, // 성명
        {
          text: 'L0000002750', // 지급수량
          name: 'giveNum',
          width: '100px',
          type: 'number',
          hasSeperator: true,
          maxlength: 6,
        },
        {
          text: 'L0000004007', // 지급주기
          name: 'giveCyclCd',
          width: '100px',
          align: 'center',
          type: 'select',
          items: this.giveCyclCdItems,
          itemText: 'codeNm',
          itemValue: 'code',
        },
      ];

      // 보호구 지급 그리드 헤더
      this.gridOptions3.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001277'),
          dataField: 'speKindNm',
          width: '15%',
          editable: false,
        }, // 보호구종류
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001275'),
          dataField: 'speNm',
          width: '15%',
          editable: false,
        }, // 보호구명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002750'),
          dataField: 'giveNum',
          width: '15%',
          editable: false,
          style: 'right-align',
        }, // 지급수량
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000870'),
          dataField: 'giveUnitNm',
          width: '15%',
          editable: false,
        }, // 단위
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000865'),
          dataField: 'unitCost',
          width: '10%',
          editable: false,
          style: 'right-align',
        }, // 단가
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001681'),
          dataField: 'userNm',
          width: '15%',
          editable: false,
        }, // 수령인
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004007'),
          dataField: 'giveCyclNm',
          width: '15%',
          editable: false,
        }, // 지급주기
      ];
      this.gridOptions3.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000004004'),
          color: 'blue',
          btnClicked: 'addGiveListClicked',
          visible: true,
        }, // 지급내용 추가
        {
          title: this.$comm.getLangSpecInfoLabel('L0000004005'),
          color: 'red',
          btnClicked: 'deleteGiveListClicked',
          visible: true,
        }, // 지급내용 삭제
      ];
      // 첨부파일 셋팅
      this.attach = () => import('@/pages/common/attachFile/multiFileUpload');
      this.setAttachFileGrps();
    },
    // 보호구 신청 상세
    getSpeRqst() {
      if (!this.speRqst.safSpeRqstGiveNo) return;
      this.$http.url = this.$format(
        selectConfig.saf.speRqst.get.url,
        this.speRqst.safSpeRqstGiveNo
      );
      this.$http.type = 'get';
      this.$http.request(
        (_result) => {
          this.speRqst = this.$_.clone(_result.data);
          this.gridOptions.data = this.$_.clone(_result.data.speRqDtlList);
          this.YAuiGrid.setGridData(this.$_.clone(_result.data.speRqDtlList));
          this.gridOptions3.data = this.$_.clone(_result.data.speGiDtlList);
          this.YAuiGrid3.setGridData(this.$_.clone(_result.data.speGiDtlList));
          this.speKindCd = this.gridOptions.data[0].speKindCd;
          this.speKindNm = this.gridOptions.data[0].speKindNm;

          if (this.editable && this.speRqst.speStepCd !== 'SPES4') {
            this.gridOptions3.btns[0].visible = true;
            this.gridOptions3.btns[1].visible = true;
          } else {
            this.gridOptions3.btns[0].visible = false;
            this.gridOptions3.btns[1].visible = false;
          }
          if (!this.speRqst.giveYmd) {
            this.speRqst.giveYmd = this.$comm.getToday();
          }
          if (this.gridOptions3.data.length > 0) {
            this.insertMode = false;
            this.updateMode = true;
          } else {
            this.insertMode = true;
            this.updateMode = false;
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    beforeInsert() {
      if (this.YAuiGrid.getGridData().length <= 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000790', // 신청 보호구를 추가해주세요.
          type: 'warning',
        });
        return;
      }

      let msg = 'M0000000011'; // 저장하시겠습니까?

      if (this.gridOptions2.data.length > 0) {
        msg = 'M0000001044'; // 보호구 지급내용에 추가되지 않은 수령인 목록은 초기화됩니다. 저장하시겠습니까?
      }

      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321', // '확인',
              message: msg,
              type: 'info',
              // 확인 callback 함수
              confirmCallback: () => {
                this.speRqst.speRqDtlList = this.YAuiGrid.getGridData();
                this.speRqst.speGiDtlList = this.YAuiGrid3.getGridData();
                this.speRqst.rqstUpdateUserId = this.$store.getters.token;
                if (this.insertMode) {
                  this.speRqst.giveCreateUserId = this.$store.getters.token;
                  this.isInsert = true;
                } else {
                  this.speRqst.giveUpdateUserId = this.$store.getters.token;
                  this.isEdit = true;
                }
              },
              cancelCallback: () => {
                this.isInsert = false;
                this.isEdit = false;
              },
            });
          } else {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395', // '안내',
              message: 'M0000000005', // '필수 입력값을 입력해 주세요.',
              type: 'warning',
            });
          }
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000881' // 유효성 검사도중 에러가 발생하였습니다.
          );
        });
    },
    beforeFinish() {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321', // '확인',
        message: 'M0000000838', // 완료하시겠습니까?
        type: 'info',
        // 확인 callback 함수
        confirmCallback: () => {
          this.speRqst.rqstUpdateUserId = this.$store.getters.token;
          this.speRqst.giveUpdateUserId = this.$store.getters.token;
          this.speRqst.speRqDtlList = this.gridOptions.data;
          this.speRqst.speGiDtlList = this.gridOptions3.data;
          this.isFinish = true;
        },
        cancelCallback: () => {
          this.isFinish = false;
        },
      });
    },
    /** Button Event **/
    // 팝업 닫기
    btnClosePopup() {
      // 부모창에 값 전달
      this.$emit('closePopup', { success: true });
    },
    // 초기화
    btnClearClickedCallback() {
      Object.assign(this.$data.speRqst, this.$options.data().speRqst);
      this.$validator.reset();
      window.getApp.$emit(
        'APP_REQUEST_SUCCESS',
        'M0000000777' // 초기화 버튼이 클릭 되었습니다.
      );
    },
    // 저장
    btnInsertClickedCallback(_result) {
      if (_result.data === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003396', // 에러
          message: 'M0000000779', // 저장하는 중 오류가 발생했습니다.
          type: 'error',
        });
      } else {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000006', // 저장되었습니다.
          type: 'success',
        });
        this.speRqst.safSpeRqstGiveNo = this.$_.clone(_result.data);
        this.getSpeRqst();
      }
      this.isInsert = false;
      this.gridOptions2.data = [];
    },
    // 수정
    btnEditClickedCallback(_result) {
      if (_result.data === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003396', // 에러
          message: 'M0000000780', // 수정하는 중 오류가 발생했습니다.
          type: 'error',
        });
      } else {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000836', // 수정되었습니다.
          type: 'success',
        });
        this.getSpeRqst();
      }
      this.isEdit = false;
      this.gridOptions2.data = [];
    },
    // 완료
    btnFinishClickedCallback(_result) {
      if (_result.data === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003396', // 에러
          message: 'M0000000457', // 완료 처리하는 중 오류가 발생했습니다.
          type: 'error',
        });
      } else {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000078', // 완료되었습니다.
          type: 'success',
        });
        this.getSpeRqst();
      }
      this.isFinish = false;
    },
    // 버튼 에러 처리
    btnClickedErrorCallback(_result) {
      this.isEdit = false;
      this.isFinish = false;
      window.getApp.emit('APP_REQUEST_ERROR', _result);
    },
    selectedRow(data) {
      this.speKindNm = data.speKindNm;
      this.speKindCd = data.speKindCd;
    },
    closePopup() {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
    },
    // 수령인 검색
    btnSearchUserClicked() {
      this.popupOptions.target = () =>
        import(`${'@/pages/manage/user/userSearch.vue'}`);
      this.popupOptions.title = 'L0000001466'; // 사용자검색
      this.popupOptions.visible = true;
      this.popupOptions.width = '60%';
      this.popupOptions.top = '100px';
      this.popupOptions.param = {
        plantCd: this.speRqst.plantCd,
        multiple: true,
      };
      this.popupOptions.closeCallback = this.closePopupSearchUser;
    },
    // 수령인 검색 팝업 닫기
    closePopupSearchUser(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data.users) {
        this.$_.forEach(data.users, (item) => {
          if (!this.$_.find(this.gridOptions2.data, { userId: item.userId })) {
            let addItem = {
              deptNm: item.deptNm,
              userId: item.userId,
              userNm: item.userNm,
              giveNum: 0,
              giveCyclCd: 'SPC00',
            };
            this.gridOptions2.data.push(addItem);
          }
        });
      }
    },
    // 수령인 삭제
    deleteUserList() {
      if (this.selectedValue.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000911', // 삭제 할 데이터를 선택하세요.
          type: 'warning',
        });
        return;
      } else {
        this.$_.forEach(this.selectedValue, (item) => {
          this.gridOptions2.data = this.$_.clone(
            this.$_.reject(this.gridOptions2.data, item)
          );
        });
      }
    },
    // 보호구 목록 조회
    getSpeList() {
      if (this.speKindCd) {
        this.speList = [];
        this.$http.url = selectConfig.saf.spe.list.url;
        this.$http.type = 'GET';
        this.$http.param = {
          plantCd: this.speRqst.plantCd,
          speKindCd: this.speKindCd,
          useYn: 'Y',
        };
        this.$http.request(
          (_result) => {
            this.speList = this.$_.clone(_result.data);
            this.speList.splice(0, 0, {
              safSpeNo: null,
              speNm: this.$comm.getLangSpecInfoLabel('L0000003394'),
            }); // 선택하세요
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      } else {
        this.speList = [
          {
            safSpeNo: null,
            speNm: this.$comm.getLangSpecInfoLabel('L0000003394'),
          },
        ]; // 선택하세요
      }
    },
    // 보호구 data조회
    getSafSpeData(safSpeNo) {
      this.$http.url = selectConfig.saf.speRqst.getPayList.url;
      this.$http.type = 'GET';
      this.$http.param = {
        safSpeNo: this.safSpeNo,
      };
      this.$http.request(
        (_result) => {
          this.unitCost = this.$_.clone(_result.data.unitCost); // 단가
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    addGiveListClicked() {
      this.popupOptions.target = () => import(`${'./addSpeRqstGive.vue'}`);
      this.popupOptions.title = '보호구 지급내용 추가';
      this.popupOptions.visible = true;
      this.popupOptions.width = '70%';
      this.popupOptions.top = '10px';
      this.popupOptions.param = {
        speRqst: this.speRqst,
        speList: this.speList,
        speKindNm: this.speKindNm,
        speKindCd: this.speKindCd,
        giveCyclCdItems: this.giveCyclCdItems,
      };
      this.popupOptions.closeCallback = this.closePopup;
      this.popupOptions.customCallBack = this.gridOptionAdd;
    },
    gridOptionAdd(data) {
      data.gridOptions3.map((item) => this.YAuiGrid3.addRow(item, 'last'));
    },

    deleteGiveListClicked() {
      let checkingData = this.YAuiGrid3.getCheckedRowItemsAll();

      if (checkingData.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000911', // 삭제 할 데이터를 선택하세요.
          type: 'warning',
        });
        return;
      }
      let gridData = this.YAuiGrid3.getGridData();
      this.$_.forEach(checkingData, (item) => {
        gridData = this.$_.reject(gridData, item);
      });

      this.YAuiGrid3.setGridData(gridData);
    },

    getCommonCodeList(codeGroup) {
      this.$http.url = this.$format(
        selectConfig.codeMaster.getSelect.url,
        codeGroup
      );
      this.$http.type = 'get';
      this.$http.request(
        (_result) => {
          if (codeGroup === 'SAF_SPE_CHK_CYE') {
            // 지급주기
            this.giveCyclCdItems = this.$_.clone(_result.data);

            this.gridOptions2.header = [
              {
                text: 'L0000004367', // 부서명
                name: 'deptNm',
                width: '100px',
                align: 'center',
              },
              {
                text: 'L0000001412',
                name: 'userId',
                width: '100px',
                align: 'center',
              }, // 사번
              {
                text: 'L0000001630',
                name: 'userNm',
                width: '100px',
                align: 'center',
              }, // 성명
              {
                text: 'L0000002750', // 지급수량
                name: 'giveNum',
                width: '100px',
                type: 'number',
                hasSeperator: true,
                maxlength: 6,
              },
              {
                text: 'L0000004007', // 지급주기
                name: 'giveCyclCd',
                width: '100px',
                align: 'center',
                type: 'select',
                items: this.giveCyclCdItems,
                itemText: 'codeNm',
                itemValue: 'code',
              },
            ];
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    // 삭제
    btnDeleteClickedCallback(_result) {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321', // '확인',
        message: 'M0000000012', // 삭제하시겠습니까?
        type: 'info',
        // 확인 callback 함수
        confirmCallback: () => {
          this.$http.url = this.$format(
            transactionConfig.saf.speRqst.delete.url,
            this.speRqst.safSpeRqstGiveNo
          );
          this.$http.type = 'DELETE';
          this.$http.request(
            (_result) => {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395', // '안내',
                message: 'M0000000007', // 삭제되었습니다.
                type: 'success',
              });
              this.btnClosePopup();
            },
            (_error) => {
              window.getApp.$emit('APP_REQUEST_ERROR', _error);
            }
          );
        },
        // 취소 callback 함수
        cancelCallback: () => {},
      });
    },
    // 첨부파일 관련 메서드
    setAttachFileGrps() {
      let taskKey = this.speRqst.safSpeRqstGiveNo
        ? this.speRqst.safSpeRqstGiveNo.toString()
        : '';
      this.attachFileGrps = [
        {
          label: 'L0000001272', // 보호구 지급관련 첨부파일
          drag: false,
          showFileSearch: false,
          editable: false,
          disabled: true,
          limit: 3,
          multiple: true,
          onlyDownload: true,
          uploadTempFiles: null,
          taskClassNm: 'SHIELD_RQST',
          taskKey: taskKey,
          taskFlag: '',
          createUserId: this.$store.getters.token,
        },
      ];
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
      this.$_.forEach(this.attachFileGrps, (item) => {
        item.taskKey = this.speRqst.safSpeRqstGiveNo;
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
            this.submitCheck = !this.submitCheck;
          }
        });
      } else {
        // 저장할 데이터가 있는 경우
        if (this.saveAttachFiles.length > 0) {
          this.submitCheck = !this.submitCheck;
        }
      }
    },
    /** /Button Event **/
    selectedCheck() {
      return this.editable && this.speRqst.speStepCd !== 'SPES4';
    },
  },
};
</script>
