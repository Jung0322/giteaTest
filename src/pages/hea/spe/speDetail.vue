<template>
  <b-container fluid>
    <!-- 보호구 상세 -->
    <b-row class="mt-3" ref="detailBox">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 보호구 상세 -->
            <y-label
              label="L0000001264"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 저장 -->
              <y-btn
                v-if="this.spe.safSpeNo > 0 && editable"
                :action-url="editUrl"
                :param="spe"
                :is-submit="isEdit"
                title="L0000002474"
                color="orange"
                action-type="PUT"
                beforeSubmit="beforeEdit"
                @beforeEdit="beforeEdit"
                @btnClicked="btnEditClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <y-btn
                v-if="this.spe.safSpeNo <= 0 && editable"
                :action-url="insertUrl"
                :param="spe"
                :is-submit="isInsert"
                title="L0000002474"
                color="orange"
                action-type="POST"
                beforeSubmit="beforeInsert"
                @beforeInsert="beforeInsert"
                @btnClicked="btnInsertClickedCallback"
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
                name="plantCd"
                v-model="spe.plantCd"
                :required="true"
                v-validate="'required'"
                :state="validateState('plantCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 보호구 종류 -->
              <y-select
                :width="baseWidth"
                :editable="editable"
                :comboItems="insSpeKindCds"
                :required="true"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                type="search"
                label="L0000001270"
                name="speKindCd"
                v-model="spe.speKindCd"
                v-validate="'required'"
                :state="validateState('speKindCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 보호구명 -->
              <y-text
                :width="baseWidth"
                :editable="editable"
                :required="true"
                :maxlength="50"
                ui="bootstrap"
                type="search"
                label="L0000001275"
                name="speNm"
                v-model="spe.speNm"
                v-validate="'required'"
                :state="validateState('speNm')"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- SAP자재번호 -->
              <y-text
                :width="8"
                :editable="editable"
                :clearable="true"
                :disabled="true"
                ui="bootstrap"
                label="L0000004396"
                name="matCd"
                v-model="spe.matCd"
                :appendIcon="[
                  { icon: 'search', callbackName: 'searchChemProd' },
                ]"
                @searchChemProd="searchChmProd"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 단위 -->
              <y-select
                :width="baseWidth"
                :editable="editable"
                :required="true"
                :comboItems="insGiveUnitCds"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                type="search"
                label="L0000000870"
                name="giveUnitCd"
                v-model="spe.giveUnitCd"
                v-validate="'required'"
                :state="validateState('giveUnitCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 단가 -->
              <y-number
                :width="8"
                :editable="editable"
                :maxlength="10"
                :required="true"
                ui="bootstrap"
                label="L0000000865"
                name="unitCost"
                v-validate="'required'"
                v-model="spe.unitCost"
                :state="validateState('unitCost')"
              ></y-number>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 보호구 지급주기 -->
              <y-select
                :width="baseWidth"
                :editable="editable"
                :comboItems="giveCyclCdItems"
                :required="true"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                type="search"
                label="L0000001273"
                name="giveCyclCd"
                v-model="spe.giveCyclCd"
                v-validate="'required'"
                :state="validateState('giveCyclCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 사용여부, 사용/미사용 -->
              <y-switch
                :width="baseWidth"
                :editable="editable"
                true-value="Y"
                false-value="N"
                ui="bootstrap"
                label="L0000001439"
                name="useYn"
                selectText="L0000001440"
                unselectText="L0000001063"
                v-model="spe.useYn"
              ></y-switch>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 정렬순서 -->
              <y-number
                :width="baseWidth"
                :editable="editable"
                :maxlength="5"
                :hasSeperator="false"
                :isPositive="true"
                ui="bootstrap"
                type="search"
                label="L0000002601"
                name="sortOrder"
                v-model="spe.sortOrder"
              ></y-number>
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
  name: 'spe-datail',
  props: {
    popupParam: {
      type: Object,
      default: {
        safSpeNo: 0,
        plantCd: '',
        pageNm: '',

        noAccUseYn: false,
      },
    },
  },
  data() {
    return {
      spe: {
        safSpeNo: 0, // 보호구번호
        speKindCd: null, // 보호구종류
        speNm: '', // 보호구명
        giveUnitCd: null, // 지급단위코드
        useYn: 'Y', // 사용여부
        matCd: '', // SAP 자재번호
        sortOrder: '', // 정렬순서
        createUserId: '', // 등록자ID
        updateUserId: '', // 수정자ID
        plantCd: '', // 사업장코드
        giveCyclCd: null, // 지급주기
        unitCost: '', // 단가
      },
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '80%',
        top: '50px',
        param: {},
        closeCallback: null,
      },
      editable: false,
      baseWidth: 8,
      selSpeKindCds: [], // 보호구 종류 - 검색조건
      insSpeKindCds: [], // 보호구 종류 - 상세
      insGiveUnitCds: [], // 단위 - 상세
      comboUseYnItems: [], // 사용여부
      giveCyclCdItems: [], // 지급주기 목록
      searchUrl: '',
      insertUrl: '',
      editUrl: '',
      isInsert: false,
      isEdit: false,
      isDelete: false,

      // 첨부 파일
      attach: null,
      submitCheck: false,
      saveAttachFiles: [],
      tempDeleteFiles: [],
      attachFileGrps: [],
      cookieName: '',
      routeName: '',
    };
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {
    // cookie는 2시간
    this.$cookies.set(this.$data.cookieName, this.$data.searchParam, {
      expires: 1 / 12,
    });
  },
  methods: {
    init() {
      this.editable = this.$route.meta.editable;

      // URL 셋팅
      this.searchUrl = selectConfig.saf.spe.list.url;
      this.insertUrl = transactionConfig.saf.spe.insert.url;
      this.editUrl = transactionConfig.saf.spe.edit.url;

      this.comboUseYnItems.push({
        code: '',
        codeNm: this.$comm.getLangSpecInfoLabel('L0000002519'),
      }); // 전체
      this.comboUseYnItems.push({
        code: 'Y',
        codeNm: this.$comm.getLangSpecInfoLabel('L0000001440'),
      }); // 사용
      this.comboUseYnItems.push({
        code: 'N',
        codeNm: this.$comm.getLangSpecInfoLabel('L0000001063'),
      }); // 미사용

      this.routeName = this.$route.name;
      this.cookieName = 'SHE' + this.$store.getters.token; // cookieName 설정
      // this.spe.safSpeNo = this.popupParam.safSpeNo;

      this.getCommonCodeList('SAF_SPE_KIND'); // 보호구 종류
      this.getCommonCodeList('SAF_GIVE_UNIT'); // 단위
      this.getCommonCodeList('SAF_SPE_CHK_CYE'); // 지급주기
      if (this.popupParam.safSpeNo !== 0) {
        this.getDetail();
      }

      // 첨부파일 셋팅
      this.attach = () => import('@/pages/common/attachFile/multiFileUpload');
      this.setAttachFileGrps();
    },
    getCommonCodeList(codeGroup) {
      this.$http.url = this.$format(
        selectConfig.codeMaster.getSelect.url,
        codeGroup
      );
      this.$http.type = 'get';
      this.$http.request(
        (_result) => {
          if (codeGroup === 'SAF_SPE_KIND') {
            // 보호구 종류
            this.selSpeKindCds = this.$_.clone(_result.data);
            this.selSpeKindCds.splice(0, 0, {
              code: null,
              codeNm: this.$comm.getLangSpecInfoLabel('L0000002519'),
            }); // 전체
            this.insSpeKindCds = this.$_.clone(_result.data);
            this.insSpeKindCds.splice(0, 0, {
              code: null,
              codeNm: this.$comm.getLangSpecInfoLabel('L0000003394'), // 선택하세요
            });
          } else if (codeGroup === 'SAF_GIVE_UNIT') {
            // 단위
            this.insGiveUnitCds = this.$_.clone(_result.data);
            this.insGiveUnitCds.splice(0, 0, {
              code: null,
              codeNm: this.$comm.getLangSpecInfoLabel('L0000003394'), // 선택하세요
            });
          } else if (codeGroup === 'SAF_SPE_CHK_CYE') {
            // 지급주기
            this.giveCyclCdItems = this.$_.clone(_result.data);
            this.giveCyclCdItems.splice(0, 0, {
              code: null,
              codeNm: this.$comm.getLangSpecInfoLabel('L0000003394'), // 선택하세요
            });
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getDetail() {
      this.$http.url = this.$format(
        selectConfig.saf.spe.get.url,
        this.popupParam.safSpeNo
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.spe = this.$_.clone(_result.data);
          this.setAttachFileGrps();
          // this.editable = true;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    validateState(_ref) {
      if (
        this.veeBag[_ref] &&
        (this.veeBag[_ref].dirty || this.veeBag[_ref].validated)
      ) {
        return !this.errors.has(_ref);
      }
      return null;
    },
    btnClosePopup() {
      // 부모창에 값 전달
      this.$emit('closePopup', { success: true });
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
    beforeInsert() {
      this.$validator
        .validateAll()
        .then((_result) => {
          var speNms = this.$_.map(this.spe.data, 'speNm');

          var sortOrders = this.$_.map(this.spe.data, 'sortOrder');
          if (this.$_.indexOf(speNms, this.spe.speNm) > -1) {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395', // '안내',
              message: 'M0000000792', // 이미 같은 이름의 보호구가 존재합니다.
              type: 'warning',
            });
            return;
          } else if (this.$_.indexOf(sortOrders, this.spe.sortOrder) > -1) {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395', // '안내',
              message: 'M0000000793', // 이미 존재하는 정렬순서입니다.
              type: 'warning',
            });
            return;
          }

          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321', // '확인',
              message: 'M0000000105', // 등록하시겠습니까?
              type: 'info',
              // 확인 callback 함수
              confirmCallback: () => {
                this.spe.createUserId = this.$store.getters.token;
                this.isInsert = true;
              },
              cancelCallback: () => {
                this.isInsert = false;
              },
            });
          } else {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395', // '안내',
              message: 'M0000000005', // '필수 입력값을 입력해 주세요.',
              type: 'warning',
            });
            this.$popupRequired.check('speDetail', this.$data, this.errors);
          }
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000881' // 유효성 검사도중 에러가 발생하였습니다.
          );
        });
    },
    // 신규등록
    btnInsertClickedCallback(_result) {
      this.isInsert = false;
      if (_result.data > 0) {
        this.spe.safSpeNo = _result.data;
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000106', // 등록되었습니다.
          type: 'success',
        });
        this.saveAttach();
      } else {
        window.getApp.$emit('ALERT', {
          title: 'L0000003396', // 에러
          message: 'M0000000577', // 등록하는중 오류가 발생했습니다.
          type: 'error',
        });
      }
    },
    searchChmProd() {
      // if (!this.editable) return;
      this.popupOptions.target = () =>
        import(`${'@/pages/baseInfo/SAPMAT/SAPMAT.vue'}`);
      this.popupOptions.title = 'L0000003804'; // 자재 검색
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        popupMode: true,
      };
      this.popupOptions.width = '75%';
      this.popupOptions.top = '100px';
      this.popupOptions.closeCallback = this.closePopupSearchChemProd;
    },
    closePopupSearchChemProd(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data.data && data.data !== 'C' && data.data !== '[]') {
        this.spe.matCd = data.data.mat_code;
      }
    },
    beforeEdit() {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321', // '확인',
        message: 'M0000000011', // 저장하시겠습니까?
        type: 'info',
        confirmCallback: () => {
          this.spe.updateUserId = this.$store.getters.token;
          this.isEdit = true;
        },
        cancelCallback: () => {
          this.isEdit = false;
        },
      });
    },
    // 수정
    btnEditClickedCallback(_result) {
      this.isEdit = false;
      if (_result.data > 0) {
        // this.spe.safSpeNo = _result.data;
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000006', // 저장되었습니다.
          type: 'success',
        });
        this.saveAttach();
      } else {
        window.getApp.$emit('ALERT', {
          title: 'L0000003396', // 에러
          message: 'M0000000794', // 저장하는중 오류가 발생했습니다.
          type: 'error',
        });
      }
    },
    saveAttach() {
      // task_key 를 셋팅한다.
      this.$_.forEach(this.attachFileGrps, (item) => {
        item.taskKey = this.spe.safSpeNo;
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
    // 버튼 에러 처리
    btnClickedErrorCallback(_result) {
      this.isInsert = false;
      this.isEdit = false;
      this.isDelete = false;
      window.getApp.emit('APP_REQUEST_ERROR', _result);
    },
    setTempDeleteFiles(data) {
      var pushData = {
        fileNo: data.data.fileNo,
      };
      this.tempDeleteFiles.push(pushData);
    },
    // 첨부파일 관련 메서드
    setAttachFileGrps() {
      let taskKey = this.spe.safSpeNo ? this.spe.safSpeNo.toString() : '';
      this.attachFileGrps = [
        {
          label: 'L0000001263', // 보호구 사진
          uploadTempFiles: null,
          taskClassNm: 'SHIELD',
          taskKey: taskKey,
          drag: false,
          showFileSearch: true,
          editable: this.editable,
          createUserId: this.$store.getters.token,
        },
        {
          label: 'L0000002243', // 인증서
          uploadTempFiles: null,
          taskClassNm: 'SHIELD_CERTIFICATE',
          taskKey: taskKey,
          drag: false,
          showFileSearch: true,
          editable: this.editable,
          createUserId: this.$store.getters.token,
        },
      ];
    },
  },
};
</script>
