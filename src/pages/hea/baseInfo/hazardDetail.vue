<template>
  <b-container fluid>
    <!-- 유해인자 상세 -->
    <b-row class="mt-3" ref="detailBox">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 유해인자 상세 -->
            <y-label
              label="L0000002192"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 저장 -->
              <y-btn
                v-if="editable && !updateMode"
                :action-url="insertUrl"
                :param="hazard"
                :is-submit="isInsert"
                title="L0000002474"
                color="orange"
                action-type="POST"
                beforeSubmit="beforeInsert"
                @beforeInsert="beforeInsert"
                @btnClicked="btnInsertClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 저장 -->
              <y-btn
                v-if="editable && updateMode"
                :action-url="editUrl"
                :param="hazard"
                :is-submit="isEdit"
                title="L0000002474"
                color="orange"
                action-type="PUT"
                beforeSubmit="beforeEdit"
                @beforeEdit="beforeEdit"
                @btnClicked="btnEditClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <y-btn title="L0000000881" @btnClicked="btnClosePopup" />
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 유해인자 대분류 -->
              <y-select
                :width="8"
                :comboItems="hazardClsInsItems"
                :required="true"
                :editable="editable"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                type="edit"
                name="hazardClsCd"
                label="L0000002189"
                v-model="hazard.hazardClsCd"
                v-validate="'required'"
                :state="validateState('hazardClsCd')"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 유해인자 분류 -->
              <y-select
                :width="8"
                :comboItems="hazardGradInsItems"
                :required="true"
                :editable="editable"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                type="edit"
                name="hazardGradCd"
                label="L0000002191"
                v-model="hazard.hazardGradCd"
                v-validate="'required'"
                :state="validateState('hazardGradCd')"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- :maxlength="5" -->
              <!-- 유해인자 코드 -->
              <y-text
                :width="8"
                :editable="editable"
                :disabled="true"
                ui="bootstrap"
                label="L0000002195"
                name="hazardCd"
                v-model="hazard.hazardCd"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 유해인자명(한글) -->
              <y-text
                :width="8"
                :editable="editable"
                :maxlength="30"
                :required="true"
                ui="bootstrap"
                label="L0000002197"
                name="hazardNmKo"
                v-model="hazard.hazardNmKo"
                v-validate="'required'"
                :state="validateState('hazardNmKo')"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 유해인자명(영문) -->
              <y-text
                :width="8"
                :editable="editable"
                :maxlength="30"
                ui="bootstrap"
                label="L0000002196"
                name="hazardNmEn"
                v-model="hazard.hazardNmEn"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 특수검진 여부, 관련/미관련 -->
              <y-switch
                :width="baseWidth"
                :editable="editable"
                true-value="Y"
                false-value="N"
                ui="bootstrap"
                label="L0000003018"
                name="specialYn"
                selectText="L0000003788"
                unselectText="L0000003789"
                v-model="hazard.specialYn"
              ></y-switch>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 작업환경 여부, 관련/미관련 -->
              <y-switch
                :width="baseWidth"
                :editable="editable"
                true-value="Y"
                false-value="N"
                ui="bootstrap"
                label="L0000002437"
                name="workEnvYn"
                selectText="L0000003788"
                unselectText="L0000003789"
                v-model="hazard.workEnvYn"
              ></y-switch>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
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
                v-model="hazard.useYn"
              ></y-switch>
            </b-col>
            <!-- <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <y-tree-process
                :disabled="hazard.hazardClsCd === 'P'? false : true"
                type="search"
                v-model="hazard.processCd"
              />
            </b-col>-->
            <!-- <b-col
              v-if="hazard.hazardClsCd === 'P'"
              sm="6"
              md="6"
              lg="6"
              xl="6"
              class="col-xxl-6 mb-3"
            >
              <div class="float-right mb-1">
                <y-btn title="추가" color="orange" @btnClicked="openPopup" />
                <y-btn title="삭제" color="red" @btnClicked="deleteProcess" />
              </div>
              <y-data-table
                ref="dataTable"
                label="공정 목록"
                :headers="gridProcessOptions.header"
                :items="gridProcessOptions.data"
                :height="gridProcessOptions.height"
                minHeight="200px"
                v-model="selectProcess"
              >
                <el-table-column type="selection" slot="selection" align="center" width="55"></el-table-column>
              </y-data-table>
            </b-col> -->
          </b-row>
          <!-- <div class="float-right">
            <y-btn v-if="editable" title="초기화" @btnClicked="btnClearClickedCallback" />
            <y-btn
              v-if="editable"
              :action-url="insertUrl"
              :param="hazard"
              :is-submit="isInsert"
              title="신규등록"
              color="orange"
              action-type="POST"
              beforeSubmit="beforeInsert"
              @beforeInsert="beforeInsert"
              @btnClicked="btnInsertClickedCallback"
              @btnClickedErrorCallback="btnClickedErrorCallback"
            />
            <y-btn
              v-if="editable&&updateMode"
              :action-url="editUrl"
              :param="hazard"
              :is-submit="isEdit"
              title="저장"
              color="orange"
              action-type="PUT"
              beforeSubmit="beforeEdit"
              @beforeEdit="beforeEdit"
              @btnClicked="btnEditClickedCallback"
              @btnClickedErrorCallback="btnClickedErrorCallback"
            />
          </div>-->
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
  name: 'hazard-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        hazardCd: null,
        pageNm: '',
        noAccUseYn: false,
      },
    },
  },
  data() {
    return {
      hazard: {
        hazardCd: null,
        hazardClsCd: null,
        hazardGradCd: null,
        hazardNmKo: '',
        hazardNmEn: '',
        specialYn: 'N',
        workEnvYn: 'N',
        useYn: 'Y',
        processCd: '',
        createUserId: '',
        updateUserId: '',
        hazardProcessList: [],
      },
      searchArea: {
        title: '검색박스숨기기', // 검색박스숨기기
        show: true,
      },
      searchParam: {
        hazardClsCd: '',
        hazardGradCd: '',
        hazardNmKo: null,
        specialYn: '',
        workEnvYn: '',
      },
      gridOptions: {
        header: [],
        data: [],
        height: '210',
      },
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '60%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      baseWidth: 8,
      editable: false,
      updateMode: false,
      searchUrl: '',
      searchCountUrl: '',
      insertUrl: '',
      editUrl: '',
      hazardClsSelItems: [],
      hazardClsInsItems: [],
      hazardGradSelItems: [],
      hazardGradInsItems: [],
      comboSpecialYnItems: [],
      comboWorkEnvYnItems: [],
      processItems: [],
      isInsert: false,
      isEdit: false,
      gridProcessOptions: {
        header: [],
        data: [],
        height: '200',
      },
      selectProcess: [],
    };
  },
  // watch: {
  //   'hazard.hazardClsCd'() {
  //     if(this.hazard.hazardClsCd === 'P') {
  //       this.
  //     }
  //   },
  // },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {},
  methods: {
    init() {
      // URL 셋팅
      this.searchUrl = selectConfig.hea.hazard.list.url;
      this.searchCountUrl = selectConfig.hea.hazard.count.url;
      this.insertUrl = transactionConfig.hea.hazard.insert.url;
      this.editUrl = transactionConfig.hea.hazard.edit.url;

      this.editable = this.$route.meta.editable;

      setTimeout(() => {
        this.comboSpecialYnItems.push({
          code: '',
          codeNm: this.$comm.getLangSpecInfoLabel('L0000002519'),
        }); // 전체
        this.comboSpecialYnItems.push({
          code: 'Y',
          codeNm: this.$comm.getLangSpecInfoLabel('L0000003788'),
        }); // 관련
        this.comboSpecialYnItems.push({
          code: 'N',
          codeNm: this.$comm.getLangSpecInfoLabel('L0000003789'),
        }); // 미관련

        this.comboWorkEnvYnItems.push({
          code: '',
          codeNm: this.$comm.getLangSpecInfoLabel('L0000002519'),
        }); // 전체
        this.comboWorkEnvYnItems.push({
          code: 'Y',
          codeNm: this.$comm.getLangSpecInfoLabel('L0000003788'),
        }); // 관련
        this.comboWorkEnvYnItems.push({
          code: 'N',
          codeNm: this.$comm.getLangSpecInfoLabel('L0000003789'),
        }); // 미관련

        // 유해인자 대분류
        this.getComboItems('WORK_AREA_GRADE');
        // 유해인자 분류
        this.getComboItems('HEA_HAZARD_CLASS');
      }, 200);
      if (this.popupParam.hazardCd !== null) {
        this.getDetail();
      }
      this.gridProcessOptions.header = [
        {
          text: 'L0000004368', // 공정명
          name: 'processNm',
          width: '200px',
          align: 'center',
        },
      ];
    },
    // 유해인자 분류
    getComboItems(comCode) {
      this.$http.url = this.$format(
        selectConfig.codeMaster.getSelect.url,
        comCode
      );
      this.$http.type = 'get';
      this.$http.request(
        (_result) => {
          if (comCode === 'HEA_HAZARD_CLASS') {
            this.hazardGradSelItems = this.$_.clone(_result.data);
            this.hazardGradSelItems.splice(0, 0, {
              code: '',
              codeNm: this.$comm.getLangSpecInfoLabel('L0000002519'),
            }); // 전체
            this.hazardGradInsItems = this.$_.clone(_result.data);
            this.hazardGradInsItems.splice(0, 0, {
              code: null,
              codeNm: this.$comm.getLangSpecInfoLabel('L0000003394'), // 선택하세요
            });
          } else if (comCode === 'WORK_AREA_GRADE') {
            this.hazardClsSelItems = this.$_.clone(_result.data);
            this.hazardClsSelItems.splice(0, 0, {
              code: '',
              codeNm: this.$comm.getLangSpecInfoLabel('L0000002519'),
            }); // 전체
            this.hazardClsInsItems = this.$_.clone(_result.data);
            this.hazardClsInsItems.splice(0, 0, {
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
    /** validation checking **/
    beforeInsert() {
      this.checkDuplicate('insert');
    },
    beforeEdit() {
      this.checkDuplicate('edit');
    },
    checkDuplicate(flag) {
      this.$http.url = this.searchCountUrl;
      this.$http.type = 'GET';
      this.$http.param = {
        hazardNmKo: this.hazard.hazardNmKo,
        hazardCd: flag === 'insert' ? '' : this.hazard.hazardCd,
      };

      this.$http.request(
        (_result) => {
          var gubunList = this.$_.map(this.$_.clone(_result.data), 'gubun');
          var cntList = this.$_.map(this.$_.clone(_result.data), 'cnt');

          var hazardNmKoIndex = this.$_.indexOf(
            gubunList,
            'hazard_nm_ko_count'
          );

          if (cntList[hazardNmKoIndex] === 0) {
            this.$validator
              .validateAll()
              .then((_result) => {
                if (_result) {
                  window.getApp.$emit('CONFIRM', {
                    title: 'L0000003321', // '확인',
                    message:
                      flag === 'insert'
                        ? 'M0000000105' // 등록하시겠습니까?
                        : 'M0000000011', // 저장하시겠습니까?
                    type: 'info',
                    // 확인 callback 함수
                    confirmCallback: () => {
                      this.hazard.hazardProcessList =
                        this.gridProcessOptions.data;
                      if (flag === 'insert') {
                        this.hazard.createUserId = this.$store.getters.token;
                        this.isInsert = true;
                      } else {
                        this.hazard.updateUserId = this.$store.getters.token;
                        this.isEdit = true;
                      }
                    },
                    cancelCallback: () => {
                      this.isInsert = false;
                      this.isEdit = false;
                    },
                  });
                } else if (!_result) {
                  window.getApp.$emit('ALERT', {
                    title: 'L0000003395', // '안내',
                    message: 'M0000000005', // '필수 입력값을 입력해 주세요.',
                    type: 'warning',
                  });
                  this.$popupRequired.check(
                    'hazardDetail',
                    this.$data,
                    this.errors
                  );
                }
              })
              .catch(() => {
                window.getApp.$emit(
                  'APP_VALID_ERROR',
                  'M0000000881' // 유효성 검사도중 에러가 발생하였습니다.
                );
                this.isInsert = false;
                this.isEdit = false;
              });
          } else {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395', // '안내',
              message: 'M0000000415', // 동일한 이름에 유해인자가 존재합니다.
              type: 'warning',
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
        selectConfig.hea.hazard.get.url,
        this.popupParam.hazardCd
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.updateMode = true;
          this.hazard = this.$_.clone(_result.data);
          this.gridProcessOptions.data = this.$_.clone(
            this.hazard.hazardProcessList
          );
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    // 수정
    btnEditClickedCallback(_result) {
      this.isEdit = false;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // '안내',
        message: 'M0000000006', // 저장되었습니다.
        type: 'success',
      });
    },
    // 신규등록
    btnInsertClickedCallback(_result) {
      this.hazard.hazardCd = _result.data;

      this.updateMode = true;
      this.isInsert = false;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // '안내',
        message: 'M0000000006', // 저장되었습니다.
        type: 'success',
      });
    },
    openPopup() {
      this.popupOptions.param = {
        selectProcess: [],
        isSelectMode: true,
        // plantCd: this.dept.plantCd,
      };
      this.popupOptions.target = () =>
        import(`${'@/pages/baseInfo/deptManage/processDialog.vue'}`);
      this.popupOptions.title = 'L0000000537'; // 공정선택
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup2;
    },
    closePopup2(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      if (data === 'CLOSE') return;

      this.$_.forEach(data.process, (item) => {
        if (
          this.$_.findIndex(this.gridProcessOptions.data, {
            processCd: item.processCd,
          }) === -1
        ) {
          this.gridProcessOptions.data.push({
            processCd: item.processCd,
            processNm: item.processNm,
          });
        }
      });
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
    deleteProcess() {
      this.$_.forEach(this.selectProcess, (item) => {
        this.gridProcessOptions.data = this.$_.reject(
          this.gridProcessOptions.data,
          { processCd: item.processCd }
        );
      });
    },
    // 버튼 에러 처리
    btnClickedErrorCallback(_result) {
      this.isInsert = false;
      this.isEdit = false;
      window.getApp.emit('APP_REQUEST_ERROR', _result);
    },
    btnClosePopup() {
      // 부모창에 값 전달
      this.$emit('closePopup', { success: true });
    },
  },
};
</script>
