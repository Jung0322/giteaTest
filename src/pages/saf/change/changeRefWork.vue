<!--
  목적 : 안전 - 변경관리 상세 - 진행관리
  Detail : 진행관리 등록/수정 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 등록 -->
    <b-row
      v-for="(changeRefWork, index) in changeRefWorksInfo"
      :key="index"
      class="mb-3"
    >
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <y-label
              :label="
                changeRefWork.codeNm +
                ' ' +
                $comm.getLangSpecInfoLabel('L0000001526')
              "
              icon="user-edit"
              color-class="cutstom-title-color"
            />
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="12" class="mb-2">
              <y-file-upload
                :ref="'fileupload_' + changeRefWork.code"
                :label="changeRefWork.attachFileGrp.label"
                :showUploadBtn="false"
                :drag="changeRefWork.attachFileGrp.drag"
                :editable="
                  changeRefWork.attachFileGrp.editable &&
                  editRegWorks[changeRefWork.code]
                "
                :multiple="changeRefWork.attachFileGrp.multiple"
                :attach-file-grp="changeRefWork.attachFileGrp"
                :close="true"
                :limit="changeRefWork.attachFileGrp.limit"
                :disabled="allDisabled"
                :listType="changeRefWork.attachFileGrp.listType"
                :showFileSearch="!allDisabled"
                :onlyDownload="allDisabled"
                :uploadTempFiles="changeRefWork.attachFileGrp.uploadTempFiles"
                @closePopup="closeAttachPopup"
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
  name: 'change-ref-work',
  props: {
    safChngNo: 0, // key
    allDisabled: false,
    refWork: {
      type: Object,
      default: {
        submitCheckSafWork: false,
      },
    },
    change: {
      type: Object,
      default: function () {
        return {
          safChngNo: 0,
          changeRefWorks: [],
          changeCheckItemResults: [],
          plantCd: '',
        };
      },
    },
    checkItemResult: {
      type: String,
      default: function () {
        return '';
      },
    },
    changeIndex: {
      type: Number,
      default: function () {
        return 0;
      },
    },
  },
  data: () => ({
    changeRefWorksInfo: [],
    attach: null,
    submitCheck: false,
    attachFileGrps: [],
    saveAttachFiles: [],
    tempDeleteFiles: [],
    popupOptions: {
      target: null,
      title: '',
      visible: false,
      param: {},
      width: '80%',
      top: '10px',
      closeCallback: null,
    },
    index: '',
    chngRefWorkCd: '',
    editable: false,
    searchUrl: '',
    editRegWorks: {},
  }),
  watch: {
    checkItemResult: {
      handler: function (val, oldVal) {
        this.setRegEdit();
      },
      deep: true,
    },
    'change.changeRefWorks': {
      handler: function (val, oldVal) {
        if (!this.changeRefWorksInfo || this.changeRefWorksInfo.length <= 0) {
          this.getComboItems(); // 진행사항
        }
      },
      deep: true,
    },
    // 첨부하기 위해 올린 파일이 있을 경우 파일저장
    'refWork.submitCheckSafWork': {
      handler: function (val, oldVal) {
        // true
        if (val) {
          this.$_.forEach(this.saveAttachFiles, (item) => {
            if (item.data && item.data.length > 0) {
              // 우선 맨 처음거를 업로드한다.
              // 그런후 맨 처음거가 success를 타고 넘어온다면 다음거를 실행
              this.$refs['fileupload' + item.data.index][0].submitUpload();
            }
          });

          if (this.tempDeleteFiles && this.tempDeleteFiles.length > 0) {
            this.$http.url = transactionConfig.attachFile.deleteMulti.url;
            this.$http.type = 'DELETE';
            this.$http.param = {
              data: Object.values(this.$_.clone(this.tempDeleteFiles)),
            };
            this.$http.request(
              (_result) => {
                this.tempDeleteFiles = [];
                this.$emit('refWorkAttachComplete');
              },
              (_error) => {
                window.getApp.$emit('APP_REQUEST_ERROR', _error);
              }
            );
          } else {
            this.$emit('refWorkAttachComplete');
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
  mounted() {},
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;

      this.searchUrl = selectConfig.saf.changeRefWork.list.url;
      // this.attach = () => import('@/pages/common/attachFile/multiFileUpload');
      this.getComboItems(); // 진행사항
    },
    /**
     * 공통 마스터 정보 조회 (변경구분, 등급(작성), 등급(검토))
     * codeGroupCd : 마스터 테이블 codeGroupCd 정보
     */
    getComboItems(codeGroupCd) {
      this.$comm.getComboItems('SAF_CHNG_REF_WORK').then((_result) => {
        if (_result && _result.length > 0) {
          if (!this.editRegWorks) {
            this.editRegWorks = {};
          }
          let isHas =
            this.change.changeCheckItemResults &&
            this.change.changeCheckItemResults.length > 0;
          _result = _result.filter((code) => code.useYn === 'Y');
          this.$_.forEach(_result, (item) => {
            let chk = false;
            if (isHas) {
              let findData = this.$_.find(this.change.changeCheckItemResults, {
                chngRefWorkCd: item.code,
              });
              chk = findData && findData.chngRsltYn === 'Y';
            }
            this.editRegWorks[item.code] = chk;
          });
          this.setRegEdit();
        }
        this.changeRefWorksInfo = _result;
        if (!this.change.changeRefWorks) {
          this.change.changeRefWorks = [];
        }

        this.setAttachFileGrps(); // 첨부파일 셋팅
      });
    },
    setAttachFileGrps() {
      this.$_.forEach(this.changeRefWorksInfo, (item) => {
        this.saveAttachFiles.push({
          taskClassNm: 'CHANGE_REF_WORK_' + item.code,
          data: null,
        });
        let taskKey = this.change.safChngNo
          ? item.code + this.change.safChngNo.toString()
          : '';
        item.attachFileGrp = {
          label: '',
          listType: 'text',
          drag: false,
          editable: this.editable,
          limit: 10,
          multiple: false,
          uploadTempFiles: null,
          taskClassNm: 'CHANGE_REF_WORK_' + item.code,
          taskKey: taskKey,
          taskFlag: '',
          createUserId: this.$store.getters.token,
        };
      });
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
      data.index = index;
      this.changeRefWorksInfo[index].attachFileGrp.uploadTempFiles =
        data && data.length > 0 ? data[0] : null;
      this.saveAttachFiles[index].data = data;

      this.$emit('refWorkAttach');
    },
    setDeleteTempFileData(data) {
      var pushData = {
        fileNo: data.fileNo,
      };
      this.tempDeleteFiles.push(pushData);
      this.$emit('refWorkAttach');
    },
    /**
     *  팝업 안 보이도록 closePopup emit
     *  팝업 close
     * data : 팝업창에서 return하는 데이터
     */
    closeAttachPopup(data) {
      // // 저장이 잘 이루어지게 되면 이곳을 타게 된다.
      // //  처음 할 것은 맨처음 데이터를 지운다.
      // this.saveAttachFiles.splice(0, 1);
      // // 저장할 것이 남았는지 확인한다.
      // if (this.saveAttachFiles.length > 0) {
      //   this.$refs['fileupload' + this.saveAttachFiles[0].uploadTempFiles.index][0].submitUpload();
      // } else {
      //   // 저장할 데이터가 없으면 창을 닫는다.
      //   this.$emit('closePopup');
      // }
    },
    setRegEdit() {
      if (this.changeIndex > -1) {
        if (
          this.change.changeCheckItemResults &&
          this.change.changeCheckItemResults[this.changeIndex]
        ) {
          let item = this.change.changeCheckItemResults[this.changeIndex];
          let tempEditable = this.$_.clone(
            this.editRegWorks[item.chngRefWorkCd]
          );
          this.editRegWorks[item.chngRefWorkCd] = item.chngRsltYn === 'Y';

          if (
            !this.editRegWorks[item.chngRefWorkCd] &&
            tempEditable !== this.editRegWorks[item.chngRefWorkCd]
          ) {
            /**
             * 들어간 데이터를 초기화 시킨다
             */
            // this.changeRefWorksInfo.forEach(item2 => {
            //   if (item2.code === item.chngRefWorkCd && item2.gridView) {
            //     item2.gridOptionsData = [];
            //   }
            // });
            this.change.changeRefWorks = this.$_.reject(
              this.change.changeRefWorks,
              { chngRefWorkCd: item.chngRefWorkCd }
            );

            if (this.$refs['fileupload_' + item.chngRefWorkCd]) {
              this.$refs[
                'fileupload_' + item.chngRefWorkCd
              ][0].getUploadedFileList();
            }
            // this.$refs['fileupload_' + item.chngRefWorkCd][0].deleteFiles('CHANGE_REF_WORK_' + item.chngRefWorkCd, item.chngRefWorkCd + this.change.safChngNo.toString());
          }
        }
      } else {
        this.change.changeCheckItemResults.forEach((item) => {
          let tempEditable = this.$_.clone(
            this.editRegWorks[item.chngRefWorkCd]
          );
          this.editRegWorks[item.chngRefWorkCd] = item.chngRsltYn === 'Y';

          if (
            !this.editRegWorks[item.chngRefWorkCd] &&
            tempEditable !== this.editRegWorks[item.chngRefWorkCd]
          ) {
            /**
             * 들어간 데이터를 초기화 시킨다
             */
            // this.changeRefWorksInfo.forEach(item2 => {
            //   if (item2.code === item.chngRefWorkCd && item2.gridView) {
            //     item2.gridOptionsData = [];
            //   }
            // });
            this.change.changeRefWorks = this.$_.reject(
              this.change.changeRefWorks,
              { chngRefWorkCd: item.chngRefWorkCd }
            );

            if (this.$refs['fileupload_' + item.chngRefWorkCd]) {
              this.$refs[
                'fileupload_' + item.chngRefWorkCd
              ][0].getUploadedFileList();
            }
            // this.$refs['fileupload_' + item.chngRefWorkCd][0].deleteFiles('CHANGE_REF_WORK_' + item.chngRefWorkCd, item.chngRefWorkCd + this.change.safChngNo.toString());
          }
        });
      }

      this.$emit('proceeding');
      this.$forceUpdate();
    },
    /** end button 관련 이벤트 **/
  },
};
</script>
