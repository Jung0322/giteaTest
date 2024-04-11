<!--
  목적 : 건강관리실 - 관리대상 유소견자 지정(팝업)
  Detail :
  examples:
  -->
<template>
  <b-container fluid>
    <!-- 검색 -->
    <b-row ref="searchBox">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 결재요청 -->
              <y-btn
                v-if="!popupParam.apprFlag && Approvable && editable"
                title="L0000003418"
                color="black"
                beforeSubmit="beforeAppr"
                @beforeAppr="beforeAppr"
                @btnClicked="btnAppr"
              />
              <!-- 저장 -->
              <y-btn
                v-if="insertMode && editable && !popupParam.apprFlag"
                :action-url="requestUrl"
                :param="suspectUser"
                :is-submit="isInsertSubmit"
                title="L0000002474"
                color="orange"
                :action-type="'POST'"
                beforeSubmit="beforeInsert"
                @beforeInsert="beforeInsert"
                @btnClicked="btnSaveClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 저장 -->
              <y-btn
                v-if="updateMode && editable && !popupParam.apprStepCd"
                :action-url="updateUrl"
                :param="suspectUser"
                :is-submit="isUpdateSubmit"
                title="L0000002474"
                color="orange"
                :action-type="'PUT'"
                beforeSubmit="beforeUpdate"
                @beforeUpdate="beforeUpdate"
                @btnClicked="btnUpdateClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <y-btn
                v-if="!popupParam.apprFlag"
                title="L0000000881"
                @btnClicked="closePopup"
              />
              <!-- 닫기 -->
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
              <y-plant
                type="edit"
                :editable="editable"
                name="plantCd"
                v-model="suspectUser.plantCd"
              />
            </b-col>
            <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
              <!-- 등록일 -->
              <y-datepicker
                :width="8"
                :range="false"
                :disabled="true"
                :default="'today'"
                label="L0000000973"
                name="rqstDt"
                v-model="suspectUser.rqstDt"
              ></y-datepicker>
            </b-col>
            <b-col>
              <div class="float-right mb-1"></div>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
    <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div class="float-right mb-1">
            <!-- 지정자 추가 -->
            <y-btn
              v-if="editable"
              title="L0000002766"
              color="blue"
              @btnClicked="btnSearchActUserClicked"
            />
            <y-btn
              v-if="editable"
              title="L0000001495"
              color="red"
              @btnClicked="btnActDelete"
            /><!-- 삭제 -->
          </div>
          <!-- 관리대상 지정 목록 -->
          <y-data-table
            ref="dataTable"
            :editable="editable"
            :height="actGridOptions.height"
            :headers="actGridOptions.header"
            :items="actGridOptions.data"
            :useRownum="false"
            v-model="selectedActValue"
            label="L0000000583"
          >
            <el-table-column
              type="selection"
              slot="selection"
              align="center"
              width="55"
            ></el-table-column>
          </y-data-table>
        </b-col>
      </b-col>
    </b-row>
    <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
            <!-- 해제자 추가 -->
            <y-btn
              v-if="editable"
              title="L0000003220"
              color="blue"
              @btnClicked="btnSearchRelUserClicked"
            />
            <y-btn
              v-if="editable"
              title="L0000001495"
              color="red"
              @btnClicked="btnRelDelete"
            /><!-- 삭제 -->
          </div>
          <!-- 관리대상 해제 목록 -->
          <y-data-table
            ref="dataTable"
            :editable="editable"
            :height="relGridOptions.height"
            :headers="relGridOptions.header"
            :items="relGridOptions.data"
            :useRownum="false"
            v-model="selectedRelValue"
            label="L0000000586"
          >
            <el-table-column
              type="selection"
              slot="selection"
              align="center"
              width="55"
            ></el-table-column>
          </y-data-table>
        </b-col>
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  /** attributes: name, components, props, data **/
  name: 'suspect-user-popup',
  props: {
    popupParam: {
      type: Object,
      default: {
        suspectReqNo: 0,
        apprFlag: false,
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
      actGridOptions: {
        header: [],
        data: [],
        height: '300',
      },
      relGridOptions: {
        header: [],
        data: [],
        height: '300',
      },
      suspectUser: {
        suspectReqNo: 0,
        plantCd: '',
        rqstDt: '',
        bizApprStepCd: '',
        actUserItems: [],
        relUserItems: [],
        createUserId: '',
        updateUserId: '',
      },
      editable: true,
      Approvable: false,
      isInsertSubmit: false,
      isDeleteSubmit: false,
      isUpdateSubmit: false,
      isSubmit: '',
      isApproval: false,
      searchUrl: '',
      insertUrl: '',
      deleteUrl: '',
      requestUrl: '',
      updateUrl: '',
      insertMode: false,
      updateMode: false,
      gridData: [],
      gridHeaderOptions: [],
      selectedValue: [],
      selectedActValue: [],
      selectedRelValue: [],
      insertValue: null,
      deleteValue: null,
      actDeleteValue: null,
      relDeleteValue: null,
    };
  },
  /** Vue lifecycle: created, mounted, destroyed, etc **/
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {},
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      this.editable = this.$route.meta.editable;
      // 관리대상 지정 목록
      this.actGridOptions.header = [
        {
          text: 'L0000001415',
          name: 'plantNm',
          width: '120px',
          align: 'center',
        }, // 사업장
        {
          text: 'L0000001287',
          name: 'deptNm',
          width: '120px',
          align: 'center',
        }, // 부서
        {
          text: 'L0000001412',
          name: 'userId',
          width: '120px',
          align: 'center',
        }, // 사번
        {
          text: 'L0000001630',
          name: 'userNm',
          width: '120px',
          align: 'center',
        }, // 성명
        {
          text: 'L0000003035', // 판정
          name: 'heaDiagnoseCd',
          width: '100px',
          align: 'center',
        },
        {
          text: 'L0000002780', // 질환
          name: 'heaDiseaseNms',
          width: '100px',
          align: 'center',
        },
        {
          text: 'L0000001360', // 비고
          name: 'remark',
          width: '200px',
          align: 'center',
          type: 'text',
          maxlength: 150,
        },
      ];

      // 관리대상 해제 목록
      this.relGridOptions.header = [
        {
          text: 'L0000001415',
          name: 'plantNm',
          width: '120px',
          align: 'center',
        }, // 사업장
        {
          text: 'L0000001287',
          name: 'deptNm',
          width: '120px',
          align: 'center',
        }, // 부서
        {
          text: 'L0000001412',
          name: 'userId',
          width: '120px',
          align: 'center',
        }, // 사번
        {
          text: 'L0000001630',
          name: 'userNm',
          width: '120px',
          align: 'center',
        }, // 성명
        {
          text: 'L0000000588', // 관리대상지정일
          name: 'beManagedYmd',
          width: '100px',
          align: 'center',
        },
        {
          text: 'L0000001360', // 비고
          name: 'notRemark',
          width: '200px',
          align: 'center',
          type: 'text',
          maxlength: 150,
        },
      ];
      this.searchUrl = this.$format(
        selectConfig.hea.suspectUser.list.get.url,
        this.popupParam.suspectReqNo
      );
      this.insertUrl = transactionConfig.hea.suspectUser.insert.url;
      this.requestUrl = transactionConfig.hea.suspectUser.request.url;
      this.updateUrl = transactionConfig.hea.suspectUser.update.url;

      this.suspectUser.suspectReqNo = this.popupParam.suspectReqNo;
      if (this.suspectUser.suspectReqNo > 0) {
        this.insertMode = false;
        this.updateMode = true;
        this.getDataList();
      } else {
        this.insertMode = true;
        this.updateMode = false;
        this.suspectUser.plantCd = this.$store.getters.plantCd;
        this.suspectUser.rqstDt = this.$comm.getToday();
      }
      // this.setGridSize();
    },
    /** /초기화 관련 함수 **/
    getDataList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.suspectUser;
      this.$http.request(
        (_result) => {
          this.suspectUser = _result.data;
          this.actGridOptions.data = _result.data.actUserItems;
          this.relGridOptions.data = _result.data.relUserItems;
          this.Approvable = true;

          if (this.suspectUser.bizApprStepCd === 'BAPSD') {
            // 반려일때 수정가능
            this.editable = true;
          } else {
            if (
              this.suspectUser.bizApprStepCd === 'BAPSA' &&
              this.popupParam.apprFlag
            ) {
              // 결재중이며 결재자 처리 시 수정가능
              this.editable = true;
            } else if (
              !this.suspectUser.bizApprStepCd &&
              !this.popupParam.apprFlag
            ) {
              this.editable = true;
            } else if (
              !this.suspectUser.bizApprStepCd &&
              this.popupParam.apprFlag
            ) {
              this.editable = true;
            } else {
              this.editable = false;
            }
          }
        },
        (_error) => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            'M0000000016' // 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
          );
        }
      );
    },
    beforeInsert() {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321', // '확인',
        message: 'M0000000011', // 저장하시겠습니까?
        type: 'info',
        // 확인 callback 함수
        confirmCallback: () => {
          this.suspectUser.actUserItems = this.actGridOptions.data;
          this.suspectUser.relUserItems = this.relGridOptions.data;
          this.suspectUser.createUserId = this.$store.getters.token;
          this.isInsertSubmit = true;
        },
        cancelCallback: () => {},
      });
    },
    beforeDelete() {
      if (this.selectedValue.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000449', // 유소견자 건강상담 항목을 선택해주세요.
          type: 'warning',
        });
        return;
      }

      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321', // '확인',
        message: 'M0000000451', // 유소견자를 해제하시겠습니까?
        type: 'info',
        // 확인 callback 함수
        confirmCallback: () => {
          var rowVal = [];
          this.$_.forEach(this.selectedValue, (row) => {
            row.createUserId = this.$store.getters.token;
            rowVal.push(row);
          });
          this.deleteValue = {
            data: Object.values(this.$_.clone(this.selectedValue)),
          };
          this.isDeleteSubmit = true;
        },
      });
    },
    beforeUpdate() {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321', // '확인',
        message: 'M0000000011', // 저장하시겠습니까?
        type: 'info',
        // 확인 callback 함수
        confirmCallback: () => {
          this.suspectUser.actUserItems = this.actGridOptions.data;
          this.suspectUser.relUserItems = this.relGridOptions.data;
          this.suspectUser.updateUserId = this.$store.getters.token;
          this.isUpdateSubmit = true;
        },
        cancelCallback: () => {},
      });
    },
    closePopup() {
      // 부모창에 값 전달
      this.$emit('closePopup', { success: true });
    },
    /** Button Event **/
    btnSaveClickedCallback(_result) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // '안내',
        message: 'M0000000006', // 저장되었습니다.
        type: 'success',
      });

      this.suspectUser.suspectReqNo = _result.data;
      this.searchUrl = this.$format(
        selectConfig.hea.suspectUser.list.get.url,
        _result.data
      );
      this.getDataList();
      this.isInsertSubmit = false;
      this.insertMode = false;
      this.updateMode = true;
    },
    btnUpdateClickedCallback(_result) {
      if (this.isApproval) {
        this.btnAppr();
        this.isApproval = false;
      } else {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000006', // 저장되었습니다.
          type: 'success',
        });
        this.getDataList();
      }
      this.isUpdateSubmit = false;
      this.insertMode = false;
      this.updateMode = true;
    },
    btnClickedErrorCallback(_result) {
      this.isInsertSubmit = false;
      this.isDeleteSubmit = false;
      this.isUpdateSubmit = false;
      this.isApproval = false;

      window.getApp.$emit(
        'APP_REQUEST_ERROR',
        'M0000000016' // 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
      );
    },
    btnSearchActUserClicked(_item) {
      this.popupOptions.target = () => import(`${'./suspectAppointPopup.vue'}`);
      this.popupOptions.title = 'L0000004330'; // 유소견자 지정 대상자 검색
      this.popupOptions.visible = true;
      this.popupOptions.width = '60%';
      this.popupOptions.top = '100px';
      this.popupOptions.closeCallback = this.closePopupActUser;
    },
    btnSearchRelUserClicked(_item) {
      this.popupOptions.target = () => import(`${'./suspectReleasePopup.vue'}`);
      this.popupOptions.title = 'L0000004331'; // 유소견자 해제 대상자 검색
      this.popupOptions.visible = true;
      this.popupOptions.width = '60%';
      this.popupOptions.top = '100px';
      this.popupOptions.closeCallback = this.closePopupRelUser;
    },
    closePopupActUser(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data.users) {
        data.users.forEach((selItem) => {
          let checkIndex = this.actGridOptions.data.findIndex(
            (actItem, idx) => {
              return actItem.userId === selItem.userId;
            }
          );
          if (checkIndex < 0) this.actGridOptions.data.push(selItem);
        });
      }
    },
    closePopupRelUser(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data.users) {
        data.users.forEach((selItem) => {
          let checkIndex = this.relGridOptions.data.findIndex(
            (relItem, idx) => {
              return relItem.userId === selItem.userId;
            }
          );
          if (checkIndex < 0) this.relGridOptions.data.push(selItem);
        });
      }
    },
    // 지정자 삭제
    btnActDelete() {
      let selectedKeyArr = this.selectedActValue.map((v) => {
        return v.userId;
      });
      let actKeyArr = this.actGridOptions.data.map((v) => {
        return v.userId;
      });

      for (let keyIdx in selectedKeyArr) {
        let idx = actKeyArr.indexOf(selectedKeyArr[keyIdx]);
        if (idx > -1) {
          actKeyArr.splice(idx, 1);
          this.actGridOptions.data.splice(idx, 1);
        }
      }
    },
    // 해제자 삭제
    btnRelDelete() {
      let selectedKeyArr = this.selectedRelValue.map((v) => {
        return v.userId;
      });
      let relKeyArr = this.relGridOptions.data.map((v) => {
        return v.userId;
      });

      for (let keyIdx in selectedKeyArr) {
        let idx = relKeyArr.indexOf(selectedKeyArr[keyIdx]);
        if (idx > -1) {
          relKeyArr.splice(idx, 1);
          this.relGridOptions.data.splice(idx, 1);
        }
      }
    },
    beforeAppr() {
      if (
        this.actGridOptions.data.length <= 0 &&
        this.relGridOptions.data.length <= 0
      ) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000452', // 관리대상 지정 또는 해제 목록에 관리대상을 추가하세요.
          type: 'warning',
        });
        return;
      }
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321', // '확인',
        message: 'M0000000250', // 결재요청 하기 전 입력된 값을 저장합니다. 진행하시겠습니까?
        type: 'info',
        // 확인 callback 함수
        confirmCallback: () => {
          this.suspectUser.actUserItems = this.actGridOptions.data;
          this.suspectUser.relUserItems = this.relGridOptions.data;
          this.suspectUser.updateUserId = this.$store.getters.token;
          this.isUpdateSubmit = true;
          this.isApproval = true;
        },
        cancelCallback: () => {},
      });
    },
    // 결재요청
    btnAppr() {
      this.popupOptions.target = () =>
        import(`${'@/pages/manage/appr/comApprRequest.vue'}`);
      this.popupOptions.title = 'L0000003418'; // 결재요청
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closeApprPop;
      this.popupOptions.width = '80%';
      this.popupOptions.top = '10px';
      this.popupOptions.param = {
        apprBizCd: 'HE-PS-01',
        apprParams: {
          suspectReqNo: this.suspectUser.suspectReqNo,
        },
      };
    },
    closeApprPop(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getDataList();
    },
    /** /Button Event **/
  },
};
</script>
