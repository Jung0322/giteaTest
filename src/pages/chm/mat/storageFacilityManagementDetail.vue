<!--
  목적 : 화학물질관리 > 저장설비 등록/수정
  Detail :  저장설비를 등록/수정/상세조회한다. 
  
  2019.08.07(수) kdh 
   > 설비가 아닌 시설로 취급함으로 인해 화면 수정
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
            <!-- 저장/보관 위치 상세 -->
            <y-label label="L0000002476" icon="user-edit" color-class="cutstom-title-color" />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 저장 -->
              <y-btn
                v-if="editable"
                :action-url="saveUrl"
                :param="storageFacilityManagement"
                :is-submit="isSave"
                title="L0000002474"
                color="orange"
                :action-type="actionType"
                beforeSubmit="beforeSave"
                @beforeSave="beforeSave"
                @btnClicked="btnSaveClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 닫기 -->
              <y-btn title="L0000000881" @btnClicked="closePopup" />
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 대표사업장 -->
              <y-plant
                :required="true"
                :editable="editable"
                :disabled="true"
                type="edit"
                filter="chm"
                label="L0000000940"
                name="plantCd"
                v-model="storageFacilityManagement.plantCd"
                v-validate="'required'"
                :state="validateState('plantCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 저장위치코드(SAP) -->
              <y-text
                :width="8"
                :required="true"
                :disabled="true"
                :editable="editable"
                ui="bootstrap"
                label="L0000002481"
                name="matStrgCd"
                v-model="storageFacilityManagement.matStrgCd"
                v-validate="'required'"
                :state="validateState('matStrgCd')"
                :appendIcon="!updateMode ? [{ 'icon': 'search', callbackName: 'searchMatStrg' }] : null"
                @searchMatStrg="searchMatStrg"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 저장위치명 -->
              <y-text
                :width="8"
                :required="true"
                :disabled="true"
                :editable="editable"
                ui="bootstrap"
                label="L0000002479"
                name="matStrgNm"
                v-model="storageFacilityManagement.matStrgNm"
                v-validate="'required'"
                :state="validateState('matStrgNm')"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 시설유형 -->
              <y-select
                :width="8"
                :required="true"
                :editable="editable"
                :disabled="disabled"
                :comboItems="chmFacilityTypeItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="L0000001747"
                name="matStrgType"
                v-model="storageFacilityManagement.matStrgType"
                v-validate="'required'"
                :state="validateState('matStrgType')"
              />
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-8">
              <!-- 설치위치 -->
              <y-text
                :width="10"
                :editable="editable"
                :disabled="disabled"
                :maxlength="30"
                ui="bootstrap"
                label="L0000001626"
                name="location"
                v-model="storageFacilityManagement.location"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 관리부서 -->
              <y-tree-dept
                :editable="editable"
                :disabled="disabled"
                label="L0000000591"
                name="deptCd"
                :plantCd="storageFacilityManagement.plantCd"
                v-model="storageFacilityManagement.deptCd"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 폐기여부 -->
              <y-switch
                :width="8"
                :editable="editable"
                :disabled="disabled"
                true-value="Y"
                false-value="N"
                ui="bootstrap"
                label="L0000003125"
                name="useYn"
                select-text="L0000001064"
                unselect-text="L0000003101"
                v-model="storageFacilityManagement.useYn"
              />
              <!-- L0000001064: 미폐기 -->
              <!-- L0000003101: 폐기 -->
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-8">
              <!-- 비고 -->
              <y-textarea
                :width="10"
                :editable="editable"
                :disabled="disabled"
                :maxlength="150"
                ui="bootstrap"
                label="L0000001360"
                name="remarks"
                v-model="storageFacilityManagement.remarks"
              ></y-textarea>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>

    <el-tabs type="border-card" v-model="tabIndex" @tab-click="tabClick" class="mt-3">
      <el-tab-pane v-for="(item, i) in tabItems" :key="i" stretch class="default-tab-pane">
        <span slot="label">
          <i class="el-icon-date"></i>
          {{ $comm.getLangSpecInfoLabel(item.title) }}
        </span>
      </el-tab-pane>
      <keep-alive>
        <component
          :is="component"
          v-if="component"
          :storageFacilityManagement="storageFacilityManagement"
          :tabDisabled="popupParam.disabled"
          sm="12"
          :submitObject="submitObject"
          :attachFileGrps="attachFileGrps"
          :saveAttachFiles="saveAttachFiles"
          @changeUploadFiles="changeUploadFiles"
          @setTempDeleteFiles="setTempDeleteFiles"
          @closePopup="closePopup2"
        />
      </keep-alive>
    </el-tabs>

    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  /* attributes: name, components, props, data */
  name: 'storage-facility-management-detail',
  components: {},
  props: {
    popupParam: {
      type: Object,
      default() {
        return {
          matStrgCd: '',
          plantCd: '',
          facilityCd: '',
          disabled: false,
        }
      },
    },
  },
  // TODO: 화살표 함수(=>)는 data에 사용하지 말 것
  //    data: () => { return { a: this.myProp }}) 화살표 함수가 부모 컨텍스트를 바인딩하기 때문에 this는 예상과 달리 Vue 인스턴스가 아니며, this.myProp는 정의되지 않습니다.
  //    참고url: https://kr.vuejs.org/v2/api/index.html#data
  data: function() {
    return {
      storageFacilityManagement: {
        matStrgCd: '',
        matStrgNm: '',
        plantCd: null,
        plantNm: '',
        matStrgType: null,
        deptCd: '',
        location: '',
        remarks: '',
        allPermitAmt: '',
        useYn: 'Y',
        storageFacilityManagementDgrPerms: [],
      },
      // 첨부파일
      saveAttachFiles: [],
      tempDeleteFiles: [],
      attachFileGrps: [],
      submitObject: {
        submitCheck: false,
      },
      editable: false,
      disabled: false,
      isSave: false,
      chmFacilityTypeItems: [],
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '80%',
        top: '50px',
        param: {},
        closeCallback: null,
      },
      searchDetailUrl: '',
      searchCheckUrl: '',
      saveUrl: '',
      actionType: 'POST',
      component: null,
      tabItems: [
        { title: 'L0000002462', url: './chmFacilityMatAdd' }, // 재고현황
        { title: 'L0000002843', url: 'multiFileUpload' }, // 첨부파일
      ],
      tabIndex: 0,
      paneName: '',
      updateMode: false,
    };
  },
  watch: {
    tabIndex: function(newValue, oldValue) {
      this.loadComponent();
    },
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
  },
  mounted() {
    this.loadComponent();
    this.init();
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable && !this.popupParam.disabled;
      // Url Setting
      this.searchDetailUrl = selectConfig.chm.mat.storageFacilityManagement.get.url;
      this.searchCheckUrl = selectConfig.chm.mat.storageFacilityManagement.check.url;
      this.saveUrl = transactionConfig.chm.mat.storageFacilityManagement.insert.url;

      if (this.popupParam.facilityCd) this.popupParam.matStrgCd = this.popupParam.facilityCd;
      
      // 시설유형
      this.$comm.getComboItems('CHM_FACIL_TYPE', false).then(_result => {
        this.chmFacilityTypeItems = _result;
      });
      this.attachFileGrpSetting(); // 첨부파일 설정
      this.getDetail();
    },
    getDetail() {
      if (!this.popupParam.matStrgCd && !this.popupParam.plantCd) {
        return;
      } else {
        this.$http.url = this.$format(
          this.searchDetailUrl,
          this.popupParam.plantCd,
          this.popupParam.matStrgCd
        );
        this.$http.type = 'GET';
        this.$http.request(
          _result => {
            this.storageFacilityManagement = this.$_.clone(_result.data);
            this.updateMode = true;
          },
          _error => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      }
    },
    // 첨부파일 설정
    attachFileGrpSetting() {
      let taskKey =
        this.popupParam.matStrgCd && this.popupParam.plantCd
          ? this.popupParam.matStrgCd.toString() +
            this.popupParam.plantCd.toString()
          : '';
      this.attachFileGrps = [
        {
          label: 'L0000002843', // '첨부파일',
          uploadTempFiles: null,
          taskClassNm: 'CHM_MAT_FACILITY_',
          taskKey: taskKey,
          editable: this.editable,
          createUserId: this.$store.getters.token,
        },
      ];
    },
    check(gubun) {
      this.$http.url = this.searchCheckUrl;
      this.$http.type = 'GET';
      this.$http.param = {
        matStrgCd: this.storageFacilityManagement.matStrgCd,
        plantCd: this.storageFacilityManagement.plantCd,
      };
      this.$http.request(
        _result => {
          if (gubun === 'insert' && this.$_.parseInt(_result.data.cnt) > 0) {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395', // '안내',
              message: 'M0000000184', // '입력하신 사업장에 따른 저장위치의 재고량은 이미 등록되어있습니다.',
              type: 'warning',
            });
          } else if (
            gubun === 'edit' &&
            this.$_.parseInt(_result.data.cnt) > 1
          ) {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395', // '안내',
              message: 'M0000000184', // '입력하신 사업장에 따른 저장위치의 재고량은 이미 등록되어있습니다.',
              type: 'warning',
            });
          } else {
            this.$validator
              .validateAll()
              .then(result => {
                if (result) {
                  window.getApp.$emit('CONFIRM', {
                    title: 'L0000003321', // '확인',
                    message: 'M0000000011', // 저장하시겠습니까?
                    // TODO : 필요시 추가하세요.
                    type: 'info', // success / info / warning / error
                    // 확인 callback 함수
                    confirmCallback: () => {
                      this.storageFacilityManagement.createUserId = this.$store.getters.token;
                      this.storageFacilityManagement.updateUserId = this.$store.getters.token;

                      if (!this.storageFacilityManagement.allPermitAmt) {
                        this.storageFacilityManagement.allPermitAmt = 0;
                      }

                      this.isSave = true;
                    },
                    // 취소 callback 함수
                    cancelCallback: () => {
                      this.isSave = false;
                    },
                  });
                } else if (!result) {
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
                  'M0000000004', // '유효성 검사 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.'
                );
                this.isSave = false;
              });
          }
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /** 신규등록 하기전 UI단 유효성 검사 **/
    beforeSave() {
      var gubun = '';
      // 신규등록
      if (!this.popupParam.matStrgCd) {
        gubun = 'insert';
        this.saveUrl =
          transactionConfig.chm.mat.storageFacilityManagement.insert.url;
        this.actionType = 'POST';
      }
      // 수정
      else {
        gubun = 'edit';
        this.saveUrl =
          transactionConfig.chm.mat.storageFacilityManagement.edit.url;
        this.actionType = 'PUT';
      }

      this.check(gubun);
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
    /** button 관련 이벤트 **/
    /**
     * 대상부서 목록 조회 및 수정버튼 보여지도록 처리
     *  신규등록 버튼 callback
     * _result : backend에서 return하는 데이터
     */
    btnSaveClickedCallback(_result) {
      this.popupParam.matStrgCd = _result.data;
      this.popupParam.plantCd = this.$_.clone(
        this.storageFacilityManagement.plantCd
      );
      this.storageFacilityManagement.matStrgCd = _result.data;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // '안내',
        message: 'M0000000006', // '저장되었습니다.',
        type: 'success', // success / info / warning / error
      });
      this.updateMode = true;
      this.isSave = false;
      this.saveAttach();
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
      this.$_.forEach(this.attachFileGrps, item => {
        item.taskKey = this.popupParam.matStrgCd + this.popupParam.plantCd;
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
    /**
     * 수정 버튼 안보여지도록 처리 및 isSubmit false 처리
     *  버튼 http 통신 중 error 발생 callback
     * _result : error return하는 데이터
     */
    btnClickedErrorCallback(_result) {
      this.isSave = false;
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    /**
     *  팝업 안 보이도록 closePopup emit
     *  팝업 close
     * data : 팝업창에서 return하는 데이터
     */
    closePopup(data) {
      this.$emit('closePopup', {});
    },
    closePopup2(data) {},
    /** end button 관련 이벤트 **/
    loadComponent() {
      var path = this.tabItems[this.tabIndex].url;
      if (path === 'multiFileUpload') {
        this.component = () =>
          import('@/pages/common/attachFile/multiFileUpload');
      } else this.component = () => import(`${path}`);
    },
    /**
     * 자식 페이지에 넘길 paneName 정보 업데이트
     * tab 클릭시 마다
     * tab : 클릭한 tab 정보
     */
    tabClick(tab) {
      var nowDate = new Date();
      this.paneName = tab.paneName + nowDate.getMilliseconds();
    },
    searchMatStrg() {
      this.popupOptions.target = () => import(`${'./sapMatStrg.vue'}`);
      this.popupOptions.title = 'L0000003843'; // '저장위치(SAP)';
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      this.popupOptions.param = {};
      this.popupOptions.closeCallback = this.closeMatStrgPopup;
    },
    closeMatStrgPopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      if (data !== 'CLOSE') {
        this.storageFacilityManagement.matStrgCd = data.matStrgCd;
        this.storageFacilityManagement.matStrgNm = data.matStrgNm;
        this.storageFacilityManagement.plantCd = data.plantCd;
        this.storageFacilityManagement.plantNm = data.plantNm;
      }
    },
  },
};
</script>