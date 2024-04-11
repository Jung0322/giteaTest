<!--
  목적 : 일정 등록/수정
  작성자 : kdh
  Detail : 일정 등록/수정
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row>
      <!-- 일정 상세 -->
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 일정 상세 -->
            <y-label
              label="L0000002273"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 저장 -->
              <y-btn
                v-if="editable && !disabled"
                :action-url="saveUrl"
                :param="mgtCalendar"
                :is-submit="isSave"
                :action-type="actionType"
                title="L0000002474"
                color="orange"
                beforeSubmit="beforeSave"
                @beforeSave="beforeSave"
                @btnClicked="btnSaveClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 삭제 -->
              <y-btn
                v-if="updateMode && editable && !disabled"
                title="L0000001495"
                color="red"
                @btnClicked="btnCalendatDelete"
              />
              <!-- 닫기 -->
              <y-btn title="L0000000881" @btnClicked="closePopup" />
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 일정유형 -->
              <y-select
                :width="8"
                :editable="editable"
                :disabled="disabled"
                :comboItems="scheduleTpItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="L0000002280"
                name="mgtCalKindCd"
                v-model="mgtCalendar.mgtCalKindCd"
                :required="true"
                v-validate="'required'"
                :state="validateState('mgtCalKindCd')"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 일정기간 -->
              <y-datepicker
                :width="8"
                label="L0000002277"
                name="periodTemp"
                :editable="editable"
                :disabled="disabled"
                :default="mgtCalendar.periodTemp"
                v-model="mgtCalendar.periodTemp"
                :type="periodType"
                :range="true"
                :required="true"
                v-validate="'required'"
                :state="validateState('periodTemp')"
              ></y-datepicker>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 사용여부, 사용/미사용 -->
              <y-switch
                :width="8"
                :editable="editable"
                :disabled="disabled"
                true-value="Y"
                false-value="N"
                ui="bootstrap"
                label="L0000001439"
                name="useYn"
                selectText="L0000001440"
                unselectText="L0000001063"
                v-model="mgtCalendar.useYn"
              ></y-switch>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <!-- 제목 -->
              <y-text
                :width="10"
                :editable="editable"
                :disabled="disabled"
                :maxlength="50"
                ui="bootstrap"
                label="L0000002616"
                name="title"
                v-model="mgtCalendar.title"
                :required="true"
                v-validate="'required'"
                :state="validateState('title')"
              ></y-text>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <!-- 일정내용 -->
              <y-textarea
                :width="10"
                :editable="editable"
                :disabled="disabled"
                :maxlength="600"
                ui="bootstrap"
                label="L0000002278"
                name="planContents"
                v-model="mgtCalendar.planContents"
              ></y-textarea>
            </b-col>
            <!-- <b-col sm="12">
              <div slot="buttonGroup" class="float-right mb-1">
                <y-btn v-if="editable && !disabled" title="L0000002892" color="orange" @btnClicked="btnAdd" />  추가 
                <y-btn v-if="editable && !disabled" title="L0000002620" color="red" @btnClicked="btnDelete" />  제외 
              </div>
               일정 참여자 목록 
              <y-data-table
                ref="dataTableIn"
                :height="gridOptions.height"
                :headers="gridOptions.header"
                :items="mgtCalendar.scehduleManagementPsns"
                :editable="editable"
                :print="true"
                v-model="selectedValue"
                label="L0000002276"
                :popMode="true"
              >
                <el-table-column
                  v-if="editable && !disabled"
                  type="selection"
                  slot="selection"
                  align="center"
                  width="55"
                ></el-table-column>
              </y-data-table>
            </b-col> -->
            <b-col sm="12" class="h100p">
              <y-auigrid
                ref="yAuiGrid"
                :name="gridOptions.name"
                :headers="gridOptions.header"
                :btns="gridOptions.btns"
                :height="gridOptions.height"
                :label="this.$comm.getLangSpecInfoLabel('L0000002276')"
                :showRowCheckColumn="true"
                :useExcelExport="false"
                :enableSorting="true"
                :showGridSetSave="true"
                :useContextMenu="true"
                :enableRightDownFocus="true"
                :softRemoveRowMode="false"
                :showGridCtrl="true"
                @btnAddUser="btnAddUser"
                @btnDeleteUser="btnDeleteUser"
              />
            </b-col>
            <!-- <el-divider content-position="left">첨부파일</el-divider> -->
            <b-col sm="12" class="mt-3">
              <div class="float-left">
                <!-- 첨부파일 -->
                <y-label
                  label="L0000002843"
                  icon="list-alt"
                  color-class="cutstom-title-color"
                />
              </div>
            </b-col>
            <b-col sm="12" class="px-0">
              <component
                :is="attach"
                v-if="attach"
                :submitCheck="submitCheck"
                :attachFileGrps="attachFileGrps"
                :saveAttachFiles="saveAttachFiles"
                @changeUploadFiles="changeUploadFiles"
                @closePopup="closePopup2"
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
  /** attributes: name, components, props, data **/
  name: 'schedule-management-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        mgtCalendarNo: 0,
      },
    },
  },
  data: () => ({
    mgtCalendar: {
      mgtCalendarNo: 0,
      // plantCd: null,
      startDt: '',
      endDt: '',
      periodTemp: [],
      mgtCalKindCd: null,
      title: '',
      planContents: '',
      useYn: 'Y',
      createUserId: '',
      updateUserId: '',
      // 일정참여자
      scehduleManagementPsns: [],
    },
    editable: true,
    updateMode: false,
    disabled: false,
    isSave: false,
    actionType: 'POST',
    searchDetailUrl: '',
    saveUrl: '',
    deleteUrl: '',
    scheduleTpItems: [], // 일정종류
    selectedValue: [],
    gridOptions: {
      name: 'scheduleManagementDetail',
      btns: [],
      header: [],
      data: [],
      height: '300',
    },
    YAuiGrid: null,
    periodType: '',
    popupOptions: {
      target: null,
      title: '',
      visible: false,
      width: '70%',
      top: '10px',
      param: {},
      closeCallback: null,
    },
    isFirst: true,
    // 첨부 파일
    attach: null,
    submitCheck: false,
    saveAttachFiles: [],
    attachFileGrps: [],
  }),
  watch: {
    'mgtCalendar.mgtCalKindCd'() {
      if (this.mgtCalendar.mgtCalKindCd === 'MCL02') {
        // 월간
        this.periodType = 'month';
      } else if (this.mgtCalendar.mgtCalKindCd === 'MCL03') {
        // 연간
        this.periodType = 'year';
      } else {
        // 일간, 주간
        this.periodType = 'date';
      }
      // 화면 첫진입 체크 / periodTemp 초기화
      if (this.isFirst) {
        this.isFirst = false;
      } else {
        this.mgtCalendar.periodTemp = [];
      }
    },
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
  },
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      this.editable = this.$route.meta.editable;

      this.searchDetailUrl = selectConfig.mgt.scheduleManagement.get.url;
      this.saveUrl = transactionConfig.mgt.scheduleManagement.insert.url;
      this.deleteUrl = transactionConfig.mgt.scheduleManagement.delete.url;

      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001630'),
          dataField: 'userNm',
          width: '33%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001287'),
          dataField: 'deptNm',
          width: '34%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002768'),
          dataField: 'positionNm',
          width: '33%',
        },
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002892'),
          color: 'orange',
          btnClicked: 'btnAddUser',
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002620'),
          color: 'red',
          btnClicked: 'btnDeleteUser',
        },
      ];
      this.attach = () => import('@/pages/common/attachFile/multiFileUpload');

      this.getComboItems('MGT_CAL_KIND'); // 일정유형(일간,주간,월간,연간)
      this.getDetail();
    },
    closePopup() {
      this.$emit('closePopup');
    },
    closePopup2() {},
    setAttachFileGrps() {
      let taskKey = this.popupParam.mgtCalendarNo
        ? this.popupParam.mgtCalendarNo.toString()
        : '';
      this.attachFileGrps = [
        {
          label: 'L0000002843' /* 첨부파일 */,
          uploadTempFiles: null,
          taskClassNm: 'MGT_SCHEDULE',
          taskKey: taskKey,
          drag: false,
          showFileSearch: !this.disabled,
          editable: this.editable,
          disabled: this.disabled,
          createUserId: this.$store.getters.token,
        },
      ];
    },
    getDetail() {
      if (!this.popupParam.mgtCalendarNo) {
        this.setAttachFileGrps(); // 첨부파일 셋팅
      } else {
        this.$http.url = this.$format(
          this.searchDetailUrl,
          this.popupParam.mgtCalendarNo
        );
        this.$http.type = 'GET';
        this.$http.request(
          (_result) => {
            this.mgtCalendar = _result.data;
            this.YAuiGrid.setGridData(this.mgtCalendar.scehduleManagementPsns);
            if (this.mgtCalendar) {
              this.updateMode = true;
              this.mgtCalendar.periodTemp = [
                this.mgtCalendar.startDt,
                this.mgtCalendar.endDt,
              ];
            }
            if (this.mgtCalendar.createUserId !== this.$store.getters.token) {
              this.disabled = true;
            }
            this.setAttachFileGrps(); // 첨부파일 셋팅
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
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
          if (codeGroupCd === 'MGT_CAL_KIND') {
            this.scheduleTpItems = this.$_.clone(_result.data);
            this.scheduleTpItems.splice(0, 0, {
              code: null,
              codeNm:
                this.$comm.getLangSpecInfoLabel('L0000003394') /* 선택하세요 */,
            });
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    beforeSave() {
      if (!this.popupParam.mgtCalendarNo) {
        this.saveUrl = transactionConfig.mgt.scheduleManagement.insert.url;
        this.actionType = 'POST';
      } else {
        this.saveUrl = transactionConfig.mgt.scheduleManagement.edit.url;
        this.actionType = 'PUT';
      }
      this.check();
    },
    check() {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321' /* 확인 */,
              message: 'M0000000011' /* 저장하시겠습니까? */,
              // TODO : 필요시 추가하세요.
              type: 'info', // success / info / warning / error
              // 확인 callback 함수
              confirmCallback: () => {
                this.mgtCalendar.createUserId = this.$store.getters.token;
                this.mgtCalendar.updateUserId = this.$store.getters.token;

                this.mgtCalendar.startDt = this.mgtCalendar.periodTemp[0];
                this.mgtCalendar.endDt = this.mgtCalendar.periodTemp[1];
                this.isSave = true;
              },
            });
          } else {
            if (!this.mgtCalendar.mgtCalKindCd) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395' /* 안내 */,
                message: 'M0000001114', // 일정유형을 선택해주세요.
                type: 'warning', // success / info / warning / error
              });
              return;
            }
            if (this.mgtCalendar.periodTemp.length === 0) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395' /* 안내 */,
                message: 'M0000001115', // 일정기간을 선택해주세요.
                type: 'warning', // success / info / warning / error
              });
              return;
            }
            if (!this.mgtCalendar.title) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395' /* 안내 */,
                message: 'M0000001106', // 제목을 입력해주세요.
                type: 'warning', // success / info / warning / error
              });
              return;
            }
            window.getApp.$emit(
              'APP_VALID_ERROR',
              'M0000000005' // '필수 입력값을 입력해 주세요.',
            );
          }
        })
        .catch(() => {
          this.isSave = false;
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000881' /* 유효성 검사도중 에러가 발생하였습니다. */
          );
        });
    },
    btnSaveClickedCallback(_result) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // '안내',
        message: 'M0000000006' /* 저장되었습니다. */,
        type: 'success', // success / info / warning / error
      });
      if (!this.popupParam.mgtCalendarNo) {
        this.popupParam.mgtCalendarNo = _result.data;
        this.mgtCalendar.mgtCalendarNo = _result.data;
        this.updateMode = true;
      }
      this.saveAttach();
      this.isSave = false;
    },
    btnCalendatDelete() {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321', // '확인',
        message: 'M0000000012' /* 삭제하시겠습니까? */,
        // TODO : 필요시 추가하세요.
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          this.$http.url = this.$format(
            this.deleteUrl,
            this.popupParam.mgtCalendarNo
          );
          this.$http.type = 'DELETE';
          this.$http.request(
            (_result) => {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395', // '안내',
                message: 'M0000000007' /* 삭제되었습니다. */,
                type: 'success', // success / info / warning / error
              });
              this.closePopup();
            },
            (_error) => {
              window.getApp.$emit('APP_REQUEST_ERROR', _error);
            }
          );
        },
      });
    },
    btnClickedErrorCallback(_result) {
      this.isSave = false;
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
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
    btnAddUser() {
      this.popupOptions.target = () =>
        import(`${'@/pages/manage/user/userSearch.vue'}`);
      this.popupOptions.title = 'L0000001466'; /* 사용자검색 */
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopupSearchUser;
      this.popupOptions.param = {
        plantCd: this.mgtCalendar.plantCd,
        plantDisabled: true,
        multiple: true,
      };
    },

    /**
     * 참조자 행 추가
     */

    closePopupSearchUser(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data.users) {
        this.$_.forEach(data.users, (user) => {
          if (
            this.$_.indexOf(
              this.$_.map(this.YAuiGrid.getGridData(), 'userId'),
              user.userId
            ) > -1
          ) {
            return;
          }
          let row = {
            userId: user.userId,
            userNm: user.userNm,
            deptNm: user.deptNm,
            dutyNm: user.dutyNm,
            positionNm: user.positionNm,
          };
          this.YAuiGrid.addRow(row, 'first');
        });
        this.mgtCalendar.scehduleManagementPsns = this.YAuiGrid.getGridData();
        // if (this.mgtCalendar.scehduleManagementPsns.length === 0) {
        //   this.mgtCalendar.scehduleManagementPsns = [];
        // }
        // if (
        //   this.$_.findIndex(this.mgtCalendar.scehduleManagementPsns, {
        //     userId: data.users.userId,
        //   }) === -1
        // ) {
        //   let row = {
        //     userId: data.users.userId,
        //     userNm: data.users.userNm,
        //     deptNm: data.users.deptNm,
        //     dutyNm: data.users.dutyNm,
        //     positionNm: data.users.positionNm,
        //   };
        //   this.YAuiGrid.addRow(row, 'last');
        //   this.mgtCalendar.scehduleManagementPsns.splice(0, 0, {
        //     userId: data.users.userId,
        //     userNm: data.users.userNm,
        //     deptNm: data.users.deptNm,
        //     dutyNm: data.users.dutyNm,
        //     positionNm: data.users.positionNm,
        //   });
        // }
      }
    },
    // 참여자 삭제
    btnDeleteUser() {
      let gridData = this.YAuiGrid.getGridData();
      const selectedRows = this.YAuiGrid.getCheckedRowItemsAll();

      if (selectedRows.length > 0) {
        this.$_.forEach(selectedRows, (item) => {
          gridData = this.$_.reject(gridData, item);
        });
        this.YAuiGrid.setGridData(gridData);
      } else {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message:
            'M0000000624' /* 제외 할 일정 참여자들을 하나 이상 선택하세요. */,
          type: 'warning',
        });
      }
      this.mgtCalendar.scehduleManagementPsns = gridData;
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
    saveAttach() {
      // task_key 를 셋팅한다.
      this.$_.forEach(this.attachFileGrps, (item) => {
        item.taskKey = this.mgtCalendar.mgtCalendarNo;
      });
      // 저장할 데이터가 있는 경우
      if (this.saveAttachFiles.length > 0) {
        this.submitCheck = !this.submitCheck;
      }
      // 저장할 데이터가 없는 경우
      else this.closePopup2();
    },
  },
};
</script>
