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
            <!-- 자료실 개정상세 -->
            <y-label
              label="L0000004258"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 닫기 -->
              <y-btn title="L0000000881" @btnClicked="closePopup" />
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 사업장 -->
              <y-text
                :width="8"
                :editable="editable"
                :disabled="true"
                ui="bootstrap"
                label="L0000001415"
                name="plantNm"
                v-model="referenceInfo.plantNm"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 등록일 -->
              <y-text
                :width="8"
                :editable="editable"
                :disabled="true"
                ui="bootstrap"
                label="L0000000973"
                name="createDt"
                v-model="referenceInfo.createDt"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 등록부서 -->
              <y-text
                :width="8"
                :editable="editable"
                :disabled="true"
                ui="bootstrap"
                label="L0000000971"
                name="deptNm"
                v-model="referenceInfo.deptNm"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 등록자 -->
              <y-text
                :width="8"
                :editable="editable"
                :disabled="true"
                ui="bootstrap"
                label="L0000000976"
                name="createUserNm"
                v-model="referenceInfo.createUserNm"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 분류 -->
              <y-select
                :width="8"
                :editable="false"
                :disabled="true"
                :comboItems="roomTpItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="L0000001341"
                name="kindCd"
                v-model="referenceInfo.kindCd"
                :required="true"
                v-validate="'required'"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 개정번호 -->
              <y-text
                :width="8"
                :editable="false"
                :disabled="true"
                ui="bootstrap"
                label="L0000000293"
                name="revNum"
                v-model="referenceInfo.revNum"
              ></y-text>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <!-- 제목 -->
              <y-text
                :width="10"
                :editable="false"
                :disabled="true"
                ui="bootstrap"
                label="L0000002616"
                name="title"
                v-model="referenceInfo.title"
              ></y-text>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-8">
              <!-- 사업장 범위 -->
              <y-checkbox
                :width="10"
                :editable="false"
                :disabled="true"
                :comboItems="plantTypeItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                name="plantType"
                label="L0000001418"
                v-model="referenceInfo.plantType"
              />
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
  data() {
    return {
      referenceInfo: {
        lcnBoardNo: 0,
        lcnBoardGrpNo: 0,
        kindCd: null,
        title: null,
        roomTp: null,
        revNum: null,
        revYmd: null,
        contents: null,
        plantCd: null,
        deptCd: null,
        deptNm: null,
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

      tabItems: [],
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
      plantTypeItems: [],
    };
  },
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
      this.tabItems = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000810') /* 내용 */,
          url: './referenceRoomAddContentA',
        }, //
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002843') /* 첨부파일 */,
          url: 'multiFileUpload',
        }, //
      ];
      this.editable = this.$route.meta.editable;

      this.insertUrl = transactionConfig.saf.referenceRoom.insert.url;
      this.updateUrl = transactionConfig.saf.referenceRoom.update.url;
      this.searchUrl = selectConfig.mgt.referenceRoom.get.url;
      this.deleteUrl = transactionConfig.saf.referenceRoom.delete.url;

      this.now = this.$comm.moment().format('YYYY-MM-DD');

      this.$comm.getComboItems('MGT_DOCU_KND01', true).then((_result) => {
        this.roomTpItems = _result;
      });

      this.referenceInfo.plantType = [this.$store.getters.plantCd];

      if (this.popupParam.lcnBoardNo === 0) {
        this.updateMode = false;
        this.insertMode = true;
      } else {
        this.getDetail();
        this.updateMode = true;
        this.insertMode = false;
      }

      this.setAttachFileGrp();
      this.getComboItems('COM_PLANT_CD'); // 사업장
      this.getComboItems('MGT_DOCU_KND01'); // 분류
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
        (_result) => {
          this.referenceInfo = _result.data;
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

    // 사업장
    getComboItems(codeGroupCd) {
      this.$http.url = this.$format(
        selectConfig.codeMaster.getSelect.url,
        codeGroupCd
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          if (codeGroupCd === 'COM_PLANT_CD') {
            this.plantTypeItems = this.$_.clone(_result.data);
            // 공통사업장 제거
            let _idx = 0;
            let _delIndx = -1;
            this.$_.forEach(this.plantTypeItems, (item) => {
              if (item.code === '0000') {
                _delIndx = _idx;
              }
              _idx += 1;
            });

            if (_delIndx > -1) this.plantTypeItems.splice(_delIndx, 1);
          } else if (codeGroupCd === 'MGT_DOCU_KND01') {
            this.roomTpItems = this.$_.clone(_result.data);
            this.roomTpItems.splice(0, 0, {
              code: '',
              codeNm: this.$comm.getLangSpecInfoLabel('L0000003394'),
            }); // 선택하세요
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    closePopup() {
      this.$emit('closePopup');
    },
    // 탭
    loadComponent() {
      var path = this.tabItems[this.tabIndex].url;
      if (path === 'multiFileUpload') {
        this.component = () =>
          import('@/pages/common/attachFile/multiFileUpload');
      } else {
        this.component = () => import('./referenceRoomAddContentA');
      }
    },
    setAttachFileGrp() {
      let taskKey =
        this.referenceInfo.lcnBoardNo === 0
          ? this.popupParam.lcnBoardNo.toString()
          : this.referenceInfo.lcnBoardNo.toString();
      this.safAttachFileGrps = [
        {
          label: 'L0000003780' /* 인허가현황 파일업로드 */,
          listType: 'text',
          drag: false,
          editable: false,
          disabled: true,
          showFileSearch: false,
          limit: 10,
          multiple: true,
          uploadTempFiles: null,
          taskClassNm: 'reference_add',
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
    },
    saveAttach() {
      // task_key 를 셋팅한다.
      this.$_.forEach(this.safAttachFileGrps, (item) => {
        item.taskKey = this.referenceInfo.lcnBoardNo;
      });
      if (this.safTempDeleteFiles.length > 0) {
        this.$http.url = transactionConfig.attachFile.deleteMulti.url;
        this.$http.type = 'DELETE';
        this.$http.param = {
          data: Object.values(this.$_.clone(this.safTempDeleteFiles)),
        };
        this.$http.request((_result) => {
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
