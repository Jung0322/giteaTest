<!--
  목적 : 경영 > 게시판 > 자료실 등록/수정
  작성자 : ksw
  Detail : 자료실 등록/수정
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row>
      <!-- 자료실 등록/수정 -->
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 자료실 등록/수정 -->
            <y-label label="L0000002312" icon="user-edit" color-class="cutstom-title-color" />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 저장 -->
              <y-btn
                v-if="this.popupParam.insertMode || this.popupParam.mode === 'create'"
                :action-url="insertUrl"
                :param="referenceInfo"
                :is-submit="isEdit"
                title="L0000002474"
                color="orange"
                action-type="POST"
                beforeSubmit="beforeEdit"
                @beforeEdit="beforeEdit"
                @btnClicked="btnSaveClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 저장 -->
              <y-btn
                v-if="this.popupParam.updateMode"
                :action-url="updateUrl"
                :param="referenceInfo"
                :is-submit="isEdit"
                title="L0000002474"
                color="orange"
                action-type="PUT"
                beforeSubmit="beforeEdit"
                @beforeEdit="beforeEdit"
                @btnClicked="btnModifyClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
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
              <!-- 분류 -->
              <y-select
                :width="8"
                :editable="editable"
                :comboItems="roomTpItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="L0000001341"
                name="roomTp"
                v-model="referenceInfo.kindCd"
                :required="true"
                v-validate="'required'"
                :state="validateState('kindCd')"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 개정번호 -->
              <y-number
                :width="8"
                :editable="editable"
                ui="bootstrap"
                label="L0000000293"
                name="revNum"                
                :hasSeperator="false"
                :maxlength="5"
                v-model="referenceInfo.revNum"
                :required="true"
                v-validate="'required'"
              ></y-number>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <!-- 제목 -->
              <y-text
                :width="10"
                :editable="editable"
                ui="bootstrap"
                label="L0000002616"
                name="title"
                :maxlength="100"
                v-model="referenceInfo.title"
                :required="true"
                v-validate="'required'"
              ></y-text>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-8">
              <!-- 사업장 범위 -->
              <y-checkbox
                :width="10"
                :editable="editable"
                :comboItems="plantTypeItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                name="plantType"
                label="L0000001418"
                v-model="referenceInfo.plantType"
                :required="true"
                v-validate="'required'"
                :state="validateState('plantType')"
              />
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
    <b-row class="mt-3"></b-row>
    <b-row>
      <!-- 자료실 등록 탭 -->
      <b-col sm="12">
        <el-tabs type="border-card" v-model="tabIndex">
          <el-tab-pane v-for="(item, i) in tabItems" :key="i" stretch class="default-tab-pane">
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
              :attachFileGrp.sync="attachFileGrp"
              sm="12"
              :submitObject="submitObject"
              :attachFileGrps.sync="attachFileGrps"
              :saveAttachFiles.sync="saveAttachFiles"
              @changeUploadFiles="changeUploadFiles"
              @setTempDeleteFiles="setTempDeleteFiles"
              @closePopup="fileSaveAfterFunc"
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
        dataBoardNo: '',
        dataBoardGrpNo: '',
        insertMode: false,
        updateMode: false,
        revisionMode: false,
      },
    },
  },
  data: () => ({
    referenceInfo: {
      dataBoardNo: '',
      dataBoardGrpNo: '',
      plantNm: '',
      deptNm: '',
      kindCd: '',
      plantCd: '',
      content: '',
      createUserNm: '',
      createUserId: '',
      createDt: '',
      roomTp: '',
      revNum: '',
      title: '',
      deptCd: '',
      plantCdArr: [],
      plantType: [],
    },
    editable: true,
    roomTpItems: [],
    plantTypeItems: [],
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
    tabItems: [
      { title: '내용', url: './referenceRoomAddContentD' }, // L0000000810
      { title: '개정이력', url: './referenceRoomAddHistory' }, // L0000000295 
      { title: '첨부파일', url: 'multiFileUpload' }, // L0000002843
    ],
    component: null,
    insertUrl: '',
    updateUrl: '',
    insertPlantsUrl: '',
    isEdit: false,
    submitObject: {
      submitCheck: false,
    },
    attachFileGrps: [],
    saveAttachFiles: [],
    tempDeleteFiles: [],
  }),
  watch: {
    tabIndex() {
      this.loadComponent();
    },
    'referenceInfo.plantType'() {
      let index = this.$_.indexOf(
        this.referenceInfo.plantType,
        this.$store.getters.plantCd
      );
      if (index === -1) {
        this.referenceInfo.plantType.push(this.$store.getters.plantCd);
      }
    },    
    'referenceInfo.revNum'(val, event) {      
      if (val.includes('.')) {                
        this.referenceInfo.revNum = val.slice(0, -1)
      } else if (val.includes('-')) {        
        this.referenceInfo.revNum = val.slice(1)
      }
      // const reg = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|a-z|]/;
      // const reg = /[ \{\}\[\]\/?.,;:|\)*~`!^\-_+┼<>@\#$%&\ '\"\\(\=]/gi;

      // // 한글, 영문 체크
      // if (reg.exec(val) !== null) this.number = val.replace(/^[1-9]\d*$/g, '');

      // // .... 만 입력하게 될 경우 체크
      // if (isNaN(parseFloat(val))) this.number = '';
      // console.log('thisNumber', this.number)
      // return this.number      
    }
  },
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
  },
  mounted() {
    this.init();
    this.loadComponent();
  },
  beforeDestroy() {},
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      this.editable = this.$route.meta.editable;

      this.insertUrl = transactionConfig.saf.referenceRoom.insert.url;
      this.updateUrl = transactionConfig.saf.referenceRoom.update.url;
      this.deleteUrl = transactionConfig.saf.referenceRoom.delete.url;

      this.insertPlantsUrl =
        transactionConfig.saf.referenceRoom.insertPlants.url;

      this.attachFileGrp.taskClassNm = 'reference_add';
      this.attachFileGrp.taskKey = this.popupParam.dataBoardNo;
      this.attachFileGrp.createUserId = this.$store.getters.token;
      this.attachFileGrp.showUploadBtn = true;
      this.attachFileGrp.drag = true;
      this.attachFileGrp.label = 'L0000003030'; // 파일업로드

      this.referenceInfo.plantNm = this.$store.getters.plantNm;
      this.referenceInfo.deptNm = this.$store.getters.deptNm;
      this.referenceInfo.deptCd = this.$store.getters.deptCd;
      this.referenceInfo.plantCd = this.$store.getters.plantCd;
      this.referenceInfo.kindCd = this.referenceInfo.roomTp;
      this.referenceInfo.createUserNm = this.$store.getters.name;
      this.referenceInfo.createUserId = this.$store.getters.token;
      this.referenceInfo.createDt = this.$comm
        .moment(this.$comm.getToday())
        .format('YYYY-MM-DD');

      // 분류
      this.roomTpItems = [{ code: '', codeNm: this.$comm.getLangSpecInfoLabel('L0000003394') }]; // 선택하세요

      if (this.popupParam.updateMode || this.popupParam.revisionMode) {
        this.searchUrl = selectConfig.mgt.referenceRoom.get.url;
        this.getDetail(this.popupParam.dataBoardNo);
      }

      if (this.popupParam.revisionMode) {
        this.referenceInfo.dataBoardGrpNo = this.popupParam.dataBoardGrpNo;
      }

      this.getComboItems('COM_PLANT_CD'); // 사업장
      this.getComboItems('MGT_DOCU_KND01');

      if (this.popupParam.insertMode) {
        this.referenceInfo.plantType = [this.$store.getters.plantCd];
        this.setAttachFileGrps(); // 첨부파일 셋팅
      }
    },
    closePopup() {
      this.$emit('closePopup');
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
              message: alertTitle, // 하시겠습니까?
              // TODO : 필요시 추가하세요.
              type: 'info', // success / info / warning / error
              // 확인 callback 함수
              confirmCallback: () => {
                this.isEdit = true;
              },
              // 취소 callback 함수
              cancelCallback: () => {
                this.isEidt = false;
              },
            });
          } else if (!_result) {
            console.log(this.referenceInfo.plantType);
            if (!this.referenceInfo.kindCd) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395', /* 안내 */
                message: 'M0000001105', // 분류를 선택해주세요.
                type: 'warning', // success / info / warning / error
              });
              return;
            }
            if (!this.referenceInfo.revNum) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395', /* 안내 */
                message: 'M0000001103', // 개정번호를 입력해주세요.
                type: 'warning', // success / info / warning / error
              });
              return;
            }
            if (!this.referenceInfo.title) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395', /* 안내 */
                message: 'M0000001106', // 제목을 입력해주세요.
                type: 'warning', // success / info / warning / error
              });
              return;
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
        });
    },    
    beforeEdit() {
      this.saveCheckResult(0, this.$comm.getLangSpecInfoMessage('M0000000011')); // 저장하시겠습니까?
    },

    btnSaveClickedCallback(_result) {
      this.referenceInfo.dataBoardNo = this.$_.clone(_result.data);
      this.popupParam.dataBoardNo = this.$_.clone(_result.data);
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // '안내',
        message: 'M0000000006', // 저장되었습니다.
        type: 'success', // success / info / warning / error
      });
      this.isEdit = false;
      this.saveAttach();
      this.popupParam.insertMode = false;
      this.popupParam.updateMode = true;
      this.popupParam.revisionMode = false;
      // this.getDetail(this.referenceInfo.dataBoardNo);
      // this.closePopup();
    },
    btnModifyClickedCallback(_result) {
      this.insertPlants();
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // '안내',
        message: 'M0000000836', // 수정되었습니다.',
        type: 'success', // success / info / warning / error
      });

      this.isEdit = false;
      this.saveAttach();
      // this.closePopup();
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

    btnDeleteClickedCallback(_result) {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321', // '확인',
        message: 'M0000000608', // 자료실 정보를 삭제하시겠습니까?
        type: 'info',
        // 확인 callback 함수
        confirmCallback: () => {
          this.$http.url = this.$format(
            this.deleteUrl,
            this.referenceInfo.dataBoardNo,
            this.referenceInfo.dataBoardGrpNo
          );
          this.$http.type = 'DELETE';
          this.$http.request(
            _result => {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395', // '안내',
                message: 'M0000001025', // 정상적으로 삭제되었습니다.',
                type: 'success',
              });
              this.closePopup();
            },
            _error => {
              window.getApp.$emit(
                'APP_REQUEST_ERROR',
                'M0000000016', // 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
              );
            }
          );
        },
        // 취소 callback 함수
        cancelCallback: () => {},
      });
    },

    btnClickedErrorCallback(_result) {
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
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
          if (codeGroupCd === 'COM_PLANT_CD') {
            this.plantTypeItems = this.$_.clone(_result.data);
            // 공통사업장 제거
            let _idx = 0;
            let _delIndx = -1;
            this.$_.forEach(this.plantTypeItems, item => {
              if (item.code === '0000') {
                _delIndx = _idx;
              }
              _idx += 1;
            });

            if (_delIndx > -1) this.plantTypeItems.splice(_delIndx, 1);
          } else if (codeGroupCd === 'MGT_DOCU_KND01') {
            this.roomTpItems = this.$_.clone(_result.data);
            this.roomTpItems.splice(0, 0, { code: '', codeNm: this.$comm.getLangSpecInfoLabel('L0000003394') }); // 선택하세요
          }
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getDetail(dataBoardNo) {
      this.$http.url = this.$format(this.searchUrl, dataBoardNo);
      this.$http.type = 'get';
      this.$http.request(
        _result => {
          if (this.popupParam.updateMode || this.popupParam.revisionMode) {
            // this.setData(_result);
            this.referenceInfo = _result.data;
            if (_result.data.plantType.length <= 0) {
              this.referenceInfo.plantType = [this.$store.getters.plantCd];
            }
            this.setAttachFileGrps(); // 첨부파일 셋팅
          }
        },
        _error => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            'M0000000016', // 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
          );
        }
      );
    },
    deletePlants() {
      this.$http.url = this.$format(
        this.deletePlantsUrl,
        this.referenceInfo.dataBoardNo
      );
      this.$http.type = 'delete';
      this.$http.request(
        _result => {},
        _error => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            'M0000000016', // 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
          );
        }
      );
    },
    insertPlants() {
      this.$http.url = this.insertPlantsUrl;
      this.$http.type = 'post';
      this.$http.param = this.referenceInfo;
      this.$http.request(
        _result => {},
        _error => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            'M0000000016', // 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
          );
        }
      );
    },
    setData(_result) {
      this.referenceInfo = _result.data;
      this.referenceInfo.roomTp = _result.data.kindCd;

      this.$_.forEach(_result.data.plantCdArr, item => {
        this.referenceInfo.plantCdArr.push({
          name: item.plantNm,
          code: item.plantCd,
        });
      });
    },
    // 탭
    loadComponent() {
      // var path = this.tabItems[this.tabIndex].url;
      var path = this.tabItems[this.$_.parseInt(this.tabIndex)].url;
      if (path === 'multiFileUpload') {
        this.component = () =>
          import('@/pages/common/attachFile/multiFileUpload');
      } else {
        this.component = () => import(`${path}`);
      }
    },

    setAttachFileGrps() {
      let taskKey = this.popupParam.dataBoardNo
        ? this.popupParam.dataBoardNo.toString()
        : '';
      this.attachFileGrps = [
        {
          label: 'L0000002843', // 첨부파일
          uploadTempFiles: null,
          taskClassNm: 'reference_add',
          taskKey: taskKey,
          drag: this.editable,
          editable: this.editable,
          createUserId: this.$store.getters.token,
        },
      ];
    },
    setSafInfoAttachFileGrps(disabled) {
      let taskKey = this.popupParam.dataBoardNo
        ? this.popupParam.dataBoardNo.toString()
        : '';
      this.attachFileGrps = [];
    },
    fileSaveAfterFunc() {},
    saveAttach() {
      // task_key 를 셋팅한다.
      this.$_.forEach(this.attachFileGrps, item => {
        item.taskKey = this.referenceInfo.dataBoardNo;
      });

      if (this.tempDeleteFiles.length > 0) {
        this.$http.url = transactionConfig.attachFile.deleteMulti.url;
        this.$http.type = 'DELETE';
        this.$http.param = {
          data: Object.values(this.$_.clone(this.tempDeleteFiles)),
        };
        this.$http.request(_result => {
          this.tempDeleteFiles = [];
          // 저장할 데이터가 있는 경우
          if (this.saveAttachFiles.length > 0) {
            this.submitObject.submitCheck = !this.submitObject.submitCheck;
          }
        });
      } else {
        // 저장할 데이터가 있는 경우
        if (this.saveAttachFiles.length > 0) {
          this.submitObject.submitCheck = !this.submitObject.submitCheck;
        }
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
  },
};
</script>