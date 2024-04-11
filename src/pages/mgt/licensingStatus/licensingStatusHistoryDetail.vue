<!--
  목적 : 경영 > 게시판 > 인허가현황 개정 상세
  작성자 : ksw
  Detail : 인허가현황 등록/수정
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row>
      <!-- 인허가현황 개정 상세 -->
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 인허가현황 개정상세 -->
            <y-label label="L0000003779" icon="user-edit" color-class="cutstom-title-color" />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 닫기 -->
              <y-btn title="L0000000881" @btnClicked="closePopup" />
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col v-if="insertMode" sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <b-row>
                <b-col sm="4">
                  <!-- 등록일/등록자 -->
                  <y-label label="L0000000974" />
                </b-col>
                <b-col sm="8">
                  <y-label
                    :label="this.now + ' / ' + this.$store.getters.name"
                    :fieldable="true"
                  />
                </b-col>
              </b-row>
            </b-col>
            <b-col v-if="updateMode" sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <b-row>
                <b-col sm="4">
                  <!-- 등록일/등록자 -->
                  <y-label label="L0000000974" />
                </b-col>
                <b-col sm="8">
                  <y-label
                    :label="referenceInfo.createDt + ' / ' + referenceInfo.createUserNm"
                    :fieldable="true"
                  />
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3"></b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-plant
                type="edit"
                :width="8"
                :disabled="true"
                name="plantCd"
                v-model="referenceInfo.plantCd"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 분류 -->
              <y-select
                :width="8"
                :disabled="true"
                :comboItems="roomTpItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="L0000001341"
                name="kindCd"
                v-model="referenceInfo.kindCd"
              ></y-select>
            </b-col>

            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <!-- 제목 -->
              <y-text
                :width="10"
                :disabled="true"
                ui="bootstrap"
                label="L0000002616"
                name="title"
                v-model="referenceInfo.title"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 관련기관 -->
              <y-text
                :width="8"
                :disabled="true"
                ui="bootstrap"
                label="L0000000567"
                name="refOffice"
                v-model="referenceInfo.refOffice"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 관련법규 -->
              <y-text
                :width="8"
                :disabled="true"
                ui="bootstrap"
                label="L0000000568"
                name="refLaw"
                v-model="referenceInfo.refLaw"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 관련근거 -->
              <y-text
                :width="8"
                :disabled="true"
                ui="bootstrap"
                label="L0000000565"
                name="refDesc"
                v-model="referenceInfo.refDesc"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 주관부서 -->
              <y-tree-dept
                type="edit"
                label="L0000002713"
                :disabled="true"
                v-model="referenceInfo.deptCd"
                :plantCd="referenceInfo.plantCd"
              />
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <!-- 개정사유 -->
              <y-textarea
                :width="10"
                :maxlength="300"
                :disabled="true"
                ui="bootstrap"
                label="L0000000294"
                name="revContents"
                v-model="referenceInfo.revContents"
              ></y-textarea>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
    <b-row class="mt-3"></b-row>
    <b-row>
      <!-- 인허가현황 등록 탭 -->
      <b-col sm="12">
        <el-tabs type="border-card" v-model="tabIndex">
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
              :referenceInfo.sync="referenceInfo"
              :submitCheck="safSubmitCheck"
              sm="12"
              :attachFileGrps="safAttachFileGrps"
              :saveAttachFiles="safSaveAttachFiles"
              @changeUploadFiles="changeUploadFiles"
              @setTempDeleteFiles="setTempDeleteFiles"
            />
          </keep-alive>
        </el-tabs>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  /** attributes: name, components, props, data **/
  name: 'reference-room-add',
  props: {
    popupParam: {
      type: Object,
      default: {
        lcnBoardNo: 0,
      },
    },
  },
  data: () => ({
    referenceInfo: {
      lcnBoardNo: 0,
      lcnBoardGrpNo: 0,
      kindCd: null,
      title: null,
      refOffice: null,
      roomTp: null,
      refDesc: null,
      refLaw: null,
      revNum: null,
      revYmd: null,
      contents: null,
      plantCd: null,
      deptCd: null,
      deptNm: null,
      revContents: null,
      useYn: null,
      delYn: null,
      createUserId: null,
      createUserNm: null,
      createDt: null,
      updateUserId: null,
      updateUserNm: null,
      updateDt: null,
    },
    editable: false,
    roomTpItems: [],
    plantItems: [], // 사업장
    tabIndex: 0,
    attachFileGrp: {
      taskClassNm: '',
      taskKey: '',
      createUserId: '',
      showUploadBtn: true,
      editable: true,
      drag: true,
      label: '',
    },

    attach: null, // 첨부파일컴포넌트
    safSubmitCheck: false,
    safSaveAttachFiles: [],
    safTempDeleteFiles: [],
    safAttachFileGrps: [],

    tabItems: [
      { title: 'L0000000810' /* 내용 */, url: './licensingStatusAddContent' },
      { title: 'L0000002843' /* 첨부파일 */, url: 'multiFileUpload' },
    ],
    component: null,
    insertUrl: '',
    updateUrl: '',
    isEdit: false,
    isRev: false,
    isSave: false,
    date: '',

    insertMode: false,
    updateMode: false,
    revMode: false,
    updtMode: false,
    now: '',
  }),
  watch: {
    tabIndex() {
      this.loadComponent();
    },
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
  },
  mounted() {
    this.init();
    this.loadComponent();
  },
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      this.editable = this.$route.meta.editable;

      this.insertUrl = transactionConfig.saf.licensingStatus.insert.url;
      this.updateUrl = transactionConfig.saf.licensingStatus.update.url;
      this.searchUrl = selectConfig.mgt.licensingStatus.get.url;
      this.deleteUrl = transactionConfig.saf.licensingStatus.delete.url;

      this.now = this.$comm.moment().format('YYYY-MM-DD');

      this.$comm.getComboItems('MGT_DOCU_KND01', true).then(_result => {
        this.roomTpItems = _result;
      });

      if (this.popupParam.lcnBoardNo === 0) {
        this.updateMode = false;
        this.insertMode = true;
      } else {
        this.getDetail();
        this.updateMode = true;
        this.insertMode = false;
      }

      this.setAttachFileGrp();
    },
    getDetail() {
      this.$http.url = this.$format(
        this.searchUrl,
        this.referenceInfo.lcnBoardNo === 0
          ? this.popupParam.lcnBoardNo.toString()
          : this.referenceInfo.lcnBoardNo.toString()
      );
      this.$http.type = 'get';
      this.$http.request(
        _result => {
          this.referenceInfo = _result.data;
        },
        _error => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            'M0000000016'
            /* 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요. */
          );
        }
      );
    },
    closePopup() {
      this.$emit('closePopup');
    },
    // 사업장
    getComboItems(codeGroupCd) {
      this.$http.url = this.$format(
        selectConfig.codeMaster.getSelect.url,
        codeGroupCd
      );
      this.$http.type = 'GET';
      this.$http.request(
        _result => {
          if (codeGroupCd === 'MGT_DOCU_KND01') {
            this.roomTpItems = this.$_.clone(_result.data);
            this.roomTpItems.splice(0, 0, { code: null, codeNm: this.$comm.getLangSpecInfoLabel('L0000003394') }); /* 선택하세요 */ 
          }
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    // 탭
    loadComponent() {
      var path = this.tabItems[this.tabIndex].url;
      if (path === 'multiFileUpload') {
        this.component = () => import('@/pages/common/attachFile/multiFileUpload');
      } else {
        this.component = () => import(`${path}`);
      }
    },
    setAttachFileGrp() {
      let taskKey =
        this.referenceInfo.lcnBoardNo === 0
          ? this.popupParam.lcnBoardNo.toString()
          : this.referenceInfo.lcnBoardNo.toString();
      this.safAttachFileGrps = [
        {
          label: 'L0000003780', /* 인허가현황 파일업로드 */
          listType: 'text',
          drag: false,
          editable: false,
          disabled: true,
          showFileSearch: false,
          limit: 10,
          multiple: true,
          uploadTempFiles: null,
          taskClassNm: 'LICENSINGSTATUS',
          taskKey: taskKey,
          taskFlag: '',
          createUserId: this.$store.getters.token,
        },
      ];
    },
    changeUploadFiles(data) {
      var index = this.$_.findIndex(this.safAttachFileGrps, {
        taskClassNm: data.taskClassNm,
      });
      if (index > -1) {
        data.index = index;
        this.safAttachFileGrps[index].uploadTempFiles = data;
        let saveIndex = this.$_.findIndex(this.safSaveAttachFiles, {
          taskClassNm: data.taskClassNm,
        });
        if (saveIndex > -1) {
          this.safSaveAttachFiles[saveIndex] = this.$_.clone(
            this.safAttachFileGrps[index]
          );
        } else {
          this.safSaveAttachFiles.push(
            this.$_.clone(this.safAttachFileGrps[index])
          );
        }
      }
    },
    setTempDeleteFiles(data) {
      var pushData = {
        fileNo: data.data.fileNo,
      };
      this.safTempDeleteFiles.push(pushData);
    },
    saveAttach() {
      // task_key 를 셋팅한다.
      this.$_.forEach(this.safAttachFileGrps, item => {
        item.taskKey = this.referenceInfo.lcnBoardNo;
      });
      if (this.safTempDeleteFiles.length > 0) {
        this.$http.url = transactionConfig.attachFile.deleteMulti.url;
        this.$http.type = 'DELETE';
        this.$http.param = {
          data: Object.values(this.$_.clone(this.safTempDeleteFiles)),
        };
        this.$http.request(_result => {
          this.safTempDeleteFiles = [];
          this.getDetail();
          if (this.safSaveAttachFiles.length > 0) {
            // 저장할 데이터가 있는 경우
            this.safSubmitCheck = !this.safSubmitCheck;
          } else {
            // 저장할 데이터가 없는 경우
            this.submitCheck = !this.submitCheck;
          }
        });
      } else {
        this.getDetail();
        if (this.safSaveAttachFiles.length > 0) {
          // 저장할 데이터가 있는 경우
          this.safSubmitCheck = !this.safSubmitCheck;
        } else {
          // 저장할 데이터가 없는 경우
          this.submitCheck = !this.submitCheck;
        }
      }
      // this.setBtnVisible(true);
    },
  },
};
</script>