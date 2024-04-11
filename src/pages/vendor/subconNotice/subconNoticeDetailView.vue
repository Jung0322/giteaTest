<!--
  목적 : 협력업체 > 협력업체 게시판 > 협력업체 게시물 등록
  작성자 : kyk
  Detail : 협력업체 게시물 등록
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
            <!-- 협력업체 게시물 상세 -->
            <y-label
              label="L0000003248" 
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <template v-if="editable">
                <!-- 저장 -->
                <y-btn
                  v-if="updateMode === 'save'"
                  :action-url="saveUrl"
                  :param="subconNotice"
                  :is-submit="isInsert"
                  title="L0000002474"
                  color="orange"
                  :action-type="actionType"
                  beforeSubmit="beforeSave"
                  @beforeSave="beforeSave"
                  @btnClicked="btnSaveClickedCallback"
                  @btnClickedErrorCallback="btnClickedErrorCallback"
                />
                <!-- 저장 -->
                <y-btn
                  v-if="updateMode === 'modify'"
                  :action-url="saveUrl"
                  :param="subconNotice"
                  :is-submit="isEdit"
                  title="L0000002474"
                  color="orange"
                  :action-type="actionType"
                  beforeSubmit="beforeSave"
                  @beforeSave="beforeSave"
                  @btnClicked="btnSaveClickedCallback"
                  @btnClickedErrorCallback="btnClickedErrorCallback"
                />
                <!-- 수정 -->
                <y-btn
                  v-if="updateMode === 'modifiable'"
                  title="L0000001696"
                  color="orange"
                  @btnClicked="btnModifyClicked"
                />
                <!-- 삭제 -->
                <y-btn
                  v-if="updateMode === 'modifiable' || updateMode === 'modify'"
                  title="L0000001495"
                  color="red"
                  @btnClicked="btnDeleteClickedCallback"
                  @btnClickedErrorCallback="btnClickedErrorCallback"
                />
              </template>
              <!-- 닫기 -->
              <y-btn title="L0000000881" @btnClicked="closePopup" />
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 등록자 -->
              <y-text
                :width="8"
                :editable="false"
                :maxlength="100"
                ui="bootstrap"
                label="L0000000976"
                name="createUserNm"
                v-model="subconNotice.createUserNm"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 등록일 -->
              <y-text
                :width="8"
                :editable="false"
                :maxlength="100"
                ui="bootstrap"
                label="L0000000973"
                name="noticeTitle"
                v-model="subconNotice.createDt"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 등록사업장 -->
              <y-text
                :width="8"
                :editable="false"
                :disabled="true"
                ui="bootstrap"
                label="L0000000972"
                name="plantNm"
                v-model="subconNotice.plantNm"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 분류 -->
              <y-select
                :width="8"
                :comboItems="kindCdItems"
                :required="true"
                :editable="updateMode === 'modify' || updateMode === 'save'"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                name="kindCd"
                label="L0000001341"
                v-model="subconNotice.kindCd"
                v-validate="'required'"
                :state="validateState('kindCd')"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 업체조회범위 -->
              <y-select
                :width="8"
                :comboItems="vendorRgeCdItems"
                :required="true"
                :editable="updateMode === 'modify' || updateMode === 'save'"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                name="vendorRgeCd"
                label="L0000001963"
                v-model="subconNotice.vendorRgeCd"
                v-validate="'required'"
                :state="validateState('vendorRgeCd')"
              ></y-select>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <!-- 업체유형범위 -->
              <y-checkbox
                v-if="subconNotice.vendorRgeCd === 'CVR02'"
                :width="10"
                :required="true"
                :comboItems="vendorAttCdCheckItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="L0000004505"
                name="vendorAttCds"
                v-model="subconNotice.vendorAttCds"
                 v-validate="subconNotice.vendorRgeCd === 'CVR01' ? '' : 'required'"
                :state="validateState('vendorAttCds')"
              ></y-checkbox>
            </b-col>
            <b-col
              sm="12"
              md="12"
              lg="12"
              xl="12"
              class="col-xxl-8 mb-3"
              v-if="editable && subconNotice.vendorRgeCd === 'CVR03'"
            >
              <b-col sm="12" class="px-0">
                <div slot="buttonGroup" class="float-right mb-1">
                  <y-btn v-show="updateMode === 'modify' || updateMode === 'save'" title="추가" color="blue" @btnClicked="openVendor" />
                </div>
                <!-- 협력업체 목록 -->
                <y-data-table
                  label="L0000003251" 
                  ref="dataTable"
                  :height="gridOptions.height"
                  :headers="gridOptions.header"
                  :items="gridOptions.data"
                  :minHeight="gridOptions.minHeight"
                  :use-paging="false"
                ></y-data-table>
              </b-col>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <!-- 제목 -->
              <y-text
                :width="10"
                :editable="updateMode === 'modify' || updateMode === 'save'"
                :maxlength="100"
                :required="true"
                ui="bootstrap"
                label="L0000002616"
                name="title"
                v-model="subconNotice.title"
                v-validate="'required'"
                :state="validateState('title')"
              />
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <vue-editor
                v-if="updateMode === 'modify' || updateMode === 'save'"
                v-model="subconNotice.contents"
              ></vue-editor>
              <b-card v-else>
                <div
                  class="editor-content"
                  :style="{
                    minHeight: '500px',
                    width: '100%',
                    overflow: 'auto',
                  }"
                  v-html="subconNotice.contents"
                />
              </b-card>
            </b-col>
            <!-- 첨부파일 -->
            <el-divider content-position="left">{{ this.$comm.getLangSpecInfoLabel('L0000002843') }}</el-divider> 
            <component
              :is="attach"
              v-if="attach"
              :submitCheck="submitCheck"
              :attachFileGrps="attachFileGrps"
              :saveAttachFiles="saveAttachFiles"
              @changeUploadFiles="changeUploadFiles"
              @setTempDeleteFiles="setTempDeleteFiles"
            />
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
import { VueEditor } from 'vue2-editor';
export default {
  /* attributes: name, components, props, data */
  name: 'y-chem-reagent-permit-detail',
  components: { VueEditor },
  props: {
    popupParam: {
      type: Object,
      default: {
        boardNo: 0,
      },
    },
  },
  // TODO: 화살표 함수(=>)는 data에 사용하지 말 것
  //    data: () => { return { a: this.myProp }}) 화살표 함수가 부모 컨텍스트를 바인딩하기 때문에 this는 예상과 달리 Vue 인스턴스가 아니며, this.myProp는 정의되지 않습니다.
  //    참고url: https://kr.vuejs.org/v2/api/index.html#data
  data: function () {
    return {
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '80%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      gridOptions: {
        header: [],
        data: [],
        height: '200',
        minHeight: '150',
      },
      subconNotice: {
        boardNo: 0,
        plantCd: '',
        plantNm: '',
        kindCd: null,
        kindNm: '',
        vendorAttCds: [],
        title: '',
        contents: '',
        createUserId: '',
        createUserNm: '',
        createDt: '',
        updateUserId: '',
        updateUserNm: '',
        updateDt: '',
        vendorRgeCd: null, // 업체조회범위
        vendorBoardVendorAttList: [], // 조회 업체유형 목록
        vendorBoardVendorList: [], // 조회 업체 목록
      },
      kindCdItems: [],
      vendorAttCdCheckItems: [],
      vendorRgeCdItems: [],
      editable: false,
      updateMode: 'none',
      disabled: false,
      isInsert: false,
      isEdit: false,
      searchDetailUrl: '',
      saveUrl: '',
      insertUrl: '',
      editUrl: '',
      deleteUrl: '',
      actionType: 'POST',

      // 첨부 파일
      attach: null,
      submitCheck: false,
      saveAttachFiles: [],
      tempDeleteFiles: [],
      attachFileGrps: [],
    };
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      // this.updateMode = this.popupParam.updateMode;
      this.editable = this.$route.meta.editable;
      // Url Setting
      this.searchDetailUrl = selectConfig.vendor.subconNotice.get.url;
      this.insertUrl = transactionConfig.vendor.subconNotice.insert.url;
      this.editUrl = transactionConfig.vendor.subconNotice.edit.url;
      this.deleteUrl = transactionConfig.vendor.subconNotice.delete.url;

      this.gridOptions.header = [
        { text: 'L0000001415', name: 'plantNms', width: '150px', align: 'center' }, /* 사업장 */
        { text: 'L0000001957', name: 'vendorNm', width: '130px', align: 'center' }, /* 업체명 */
        {
          text: 'L0000001959', /* 업체분류 */
          name: 'vendorTypeNm',
          width: '130px',
          align: 'center',
        },
        {
          text: 'L0000001961', /* 업체유형 */
          name: 'vendorAttNm',
          width: '130px',
          align: 'center',
        },
      ];

      // 게시물분류
      this.$comm.getComboItems('COM_VEN_BOARD_ATT', false).then(_result => {
        this.kindCdItems = _result;
      });
      // 업체유형
      this.$comm.getComboItems('COM_VENDOR_ATT', false).then(_result => {
        this.vendorAttCdCheckItems = _result;
      });
      // 업체조회범위
      this.$comm.getComboItems('COM_VENDOR_RGE', false).then(_result => {
        this.vendorRgeCdItems = _result;
      });

      if (this.popupParam.boardNo > 0) {
        this.getDetail(); // 협력업체 게시물 상세 조회
      } else {
        // 신규 등록
        this.subconNotice.plantCd = this.$store.getters.plantCd;
        this.subconNotice.plantNm = this.$store.getters.plantNm;
        this.subconNotice.createUserNm = this.$store.getters.name;
        this.subconNotice.createDt = this.$comm.getToday();
        this.updateMode = 'save';
      }

      // 첨부파일 셋팅
      this.attach = () => import('@/pages/common/attachFile/multiFileUpload');
      this.setAttachFileGrps();
    },

    getDetail() {
      this.$http.url = this.$format(
        this.searchDetailUrl,
        this.popupParam.boardNo
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.subconNotice = this.$_.clone(_result.data);
          this.gridOptions.data = this.$_.clone(
            _result.data.vendorBoardVendorList
          );

          this.subconNotice.vendorAttCds = [];
          this.$_.forEach(_result.data.vendorBoardVendorAttList, (item) => {
            this.subconNotice.vendorAttCds.push(item.vendorAttCd);
          });

          // 수정모드 확인
          if (this.subconNotice.createUserId === this.$store.getters.token || this.$store.getters.token === 'manager') {
            this.updateMode = 'modifiable';
          } else {
            this.updateMode = 'none';
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /** 신규등록 하기전 UI단 유효성 검사 **/
    beforeSave() {
      var gubun = '';

      if (this.popupParam.boardNo === 0) {
        // 신규등록
        gubun = 'insert';
        this.saveUrl = this.insertUrl;
        this.actionType = 'POST';
      } else {
        // 수정
        gubun = 'edit';
        this.saveUrl = this.editUrl;
        this.actionType = 'PUT';
      }

      this.checkValidator(gubun);
    },
    /** validator 검사 **/
    checkValidator(flag) {
      if (this.subconNotice.vendorRgeCd === 'CVR02') {
        // 조회 업체유형 처리
        if (this.subconNotice.vendorAttCds.length <= 0) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395', /* 안내 */
            message: 'M0000000830', /* 업체유형범위를 선택해주세요. */
            type: 'warning',
          });
          return;
        } else {
          this.subconNotice.vendorBoardVendorAttList = [];
          this.$_.forEach(this.subconNotice.vendorAttCds, (item) => {
            this.subconNotice.vendorBoardVendorAttList.push({
              vendorAttCd: item,
            });
          });
        }
      } else if (this.subconNotice.vendorRgeCd === 'CVR03') {
        // 조회 업체 처리
        if (this.gridOptions.data.length <= 0) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395', /* 안내 */
            message: 'M0000000831', /* 조회 업체를 추가해주세요. */
            type: 'warning',
          });
          return;
        } else {
          this.subconNotice.vendorBoardVendorList = this.$_.clone(
            this.gridOptions.data
          );
        }
      }

      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321', /* 확인 */
              message:
                flag === 'edit' ? 'M0000000011' : 'M0000000105', /* 저장하시겠습니까? : 등록하시겠습니까? */
              type: 'info',
              // 확인 callback 함수
              confirmCallback: () => {
                this.subconNotice.createUserId = this.$store.getters.token;
                this.subconNotice.updateUserId = this.$store.getters.token;
                this.subconNotice.useYn = 'Y';
                if (flag === 'edit') this.isEdit = true;
                else this.isInsert = true;
              },
              cancelCallback: () => {
                if (flag === 'edit') this.isEdit = false;
                else this.isInsert = false;
              },
            });
          } else {
            this.$popupRequired.check('subconNoticeDetailView', this.$data, this.errors);
          }
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000876' /* 유효성 검사도중 에러가 발생하였습니다. */
          );
          this.isInsert = false;
          this.isEdit = false;
        });
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
    btnSaveClickedCallback(_result) {
      this.isInsert = false;
      this.isEdit = false;
      this.updateMode = 'modifiable';
      this.setAttachFileGrps();
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', /* 안내 */
        message: 'M0000000006', /* 저장되었습니다. */
        type: 'success', // success / info / warning / error
      });
      this.subconNotice.boardNo = _result.data;
      this.popupParam.boardNo = _result.data;
      this.saveAttach();
    },
    btnClickedErrorCallback(_result) {
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    btnModifyClicked() {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321', /* 확인 */
        message: 'M0000000060', /* 수정하시겠습니까? */
        type: 'info',
        confirmCallback: () => {
          this.updateMode = 'modify';
          this.setAttachFileGrps();
        },
      });
    },
    btnDeleteClickedCallback(_result) {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321', /* 확인 */
        message: 'M0000000012', /* 삭제하시겠습니까? */
        type: 'info',
        confirmCallback: () => {
          this.$http.url = this.$format(
            this.deleteUrl,
            this.subconNotice.boardNo
          );
          this.$http.type = 'DELETE';
          this.$http.request(
            (_result) => {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395', /* 안내 */
                message: 'M0000000007', /* 삭제되었습니다. */
                type: 'success', // success / info / warning / error
              });
              this.closePopup(null);
            },
            (_error) => {
              window.getApp.$emit('APP_REQUEST_ERROR', _error);
            }
          );
        },
      });
    },
    openVendor() {
      this.popupOptions.target = () =>
        import(`${'@/pages/vendor/baseInfo/vendorMaster.vue'}`);
      this.popupOptions.title = 'L0000001951'; /* 업체 */
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      this.popupOptions.param = {
        popupMode: true,
        multiSelect: true,
        plantCd: this.subconNotice.plantCd,
      };
      this.popupOptions.closeCallback = this.closeVendorPopup;
    },
    closeVendorPopup(_result) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.gridOptions.data = this.$_.clone(_result.data);
    },
    // 첨부파일 관련 메서드
    setAttachFileGrps() {
      let taskKey = this.popupParam.boardNo
        ? this.popupParam.boardNo.toString()
        : '';
      this.attachFileGrps = [
        {
          label: 'L0000002843', /* 첨부파일 */
          uploadTempFiles: null,
          taskClassNm: 'SUBCON_NOTICE',
          taskKey: taskKey,
          showFileSearch: false,
          disabled: !(
            this.updateMode === 'modify' || this.updateMode === 'save'
          ),
          editable: this.updateMode === 'modify' || this.updateMode === 'save',
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
        item.taskKey = this.subconNotice.boardNo;
      });
      // 저장할 데이터가 있는 경우
      if (this.saveAttachFiles.length > 0) {
        this.submitCheck = !this.submitCheck;
      } else {
        // this.closePopup(null);
      }
    },
  },
};
</script>
