<!--
  목적 : 공정시설정보 - 배관 및 개스킷(입력 popup)
  작성자 : kdh
  Detail :
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row>
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 배관 및 개스킷 상세 -->
            <y-label
              label="L0000001133"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <y-plant
                type="edit"
                :required="true"
                :disabled="updateMode || editCheck || search"
                :editable="editable"
                name="plantCd"
                v-model="tabParam.plantCd"
                v-validate="'required'"
                :state="validateState('plantCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 공정 -->
              <y-tree-process
                :required="true"
                :editable="editable"
                :disabled="updateMode || editCheck || search"
                label="L0000000515"
                name="processCd"
                type="edit"
                :showDataMapping="true"
                :plantCd="tabParam.plantCd"
                v-model="tabParam.processCd"
                v-validate="'required'"
                :state="validateState('processCd')"
              ></y-tree-process>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 분류코드 -->
              <y-text
                :width="8"
                :disabled="updateMode || editCheck || search"
                :editable="editable"
                :maxlength="15"
                :required="true"
                ui="bootstrap"
                type="search"
                label="L0000001342"
                name="pipeCd"
                v-model="tabParam.pipeCd"
                v-validate="'required'"
                :state="validateState('pipeCd')"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 유체의 명칭 또는 구분 -->
              <y-text
                :width="8"
                :disabled="search"
                :editable="editable"
                :maxlength="15"
                :required="true"
                ui="bootstrap"
                type="search"
                label="L0000004305"
                name="pipeNm"
                v-model="tabParam.pipeNm"
                v-validate="'required'"
                :state="validateState('pipeNm')"
              ></y-text>
            </b-col>

            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 설계압력(Mpa) -->
              <y-text
                :width="8"
                :disabled="search"
                :editable="editable"
                :maxlength="60"
                ui="bootstrap"
                type="search"
                label="L0000001574"
                name="planPress"
                v-model="tabParam.planPress"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 설계온도(℃) -->
              <y-text
                :width="8"
                :disabled="search"
                :editable="editable"
                :maxlength="60"
                ui="bootstrap"
                type="search"
                label="L0000001575"
                name="planTemp"
                v-model="tabParam.planTemp"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 배관재질 -->
              <y-text
                :width="8"
                :disabled="search"
                :editable="editable"
                :maxlength="60"
                ui="bootstrap"
                type="search"
                label="L0000001134"
                name="pipeMat"
                v-model="tabParam.pipeMat"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 개스킷 재질 및 형태 -->
              <y-text
                :width="8"
                :disabled="search"
                :editable="editable"
                :maxlength="60"
                ui="bootstrap"
                type="search"
                label="L0000000288"
                name="gasketMat"
                v-model="tabParam.gasketMat"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 비파괴검사율 -->
              <y-text
                :width="8"
                :disabled="search"
                :editable="editable"
                :maxlength="60"
                ui="bootstrap"
                type="search"
                label="L0000001376"
                name="nondestructPer"
                v-model="tabParam.nondestructPer"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 후열처리여부 -->
              <y-switch
                :width="8"
                :disabled="search"
                :editable="editable"
                true-value="Y"
                false-value="N"
                ui="bootstrap"
                label="L0000003369"
                name="aftHeatTreatYn"
                selectText="YES"
                unselectText="NO"
                v-model="tabParam.aftHeatTreatYn"
              ></y-switch>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 비고 -->
              <y-textarea
                :width="8"
                :disabled="search"
                :editable="editable"
                :maxlength="150"
                ui="bootstrap"
                type="search"
                label="L0000001360"
                name="nondestructMethod"
                v-model="tabParam.nondestructMethod"
              ></y-textarea>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 변경발의번호 -->
              <y-text
                :width="8"
                :disabled="search"
                :editable="editable"
                ui="bootstrap"
                type="search"
                label="L0000004754"
                name="chngNum"
                v-model="tabParam.chngNum"
              ></y-text>
            </b-col>
          </b-row>

          <div class="float-right mt-3">
            <y-btn
              v-if="updateMode && editable && !search"
              title="초기화"
              @btnClicked="btnClearClickedCallback"
            />
            <!-- 신규등록 -->
            <y-btn
              v-if="!updateMode && editable && !search"
              :action-url="insertUrl"
              :param="tabParam"
              :is-submit="isInsert"
              title="L0000001789"
              color="orange"
              action-type="POST"
              beforeSubmit="beforeInsert"
              @beforeInsert="beforeInsert"
              @btnClicked="btnInsertClickedCallback"
              @btnClickedErrorCallback="btnClickedErrorCallback"
            />
            <!-- 저장 -->
            <y-btn
              v-if="updateMode && editable && !search"
              :action-url="editUrl"
              :param="tabParam"
              :is-submit="isEdit"
              title="L0000002474"
              color="orange"
              action-type="POST"
              beforeSubmit="beforeSubmit"
              @beforeSubmit="beforeSubmit"
              @btnClicked="btnSaveClickedCallback"
              @btnClickedErrorCallback="btnClickedErrorCallback"
            />
          </div>
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
  name: 'pipe-popup',
  props: {
    editCheck: false,
    search: false,
    tabParam: {
      type: Object,
      default: () => ({
        pipeNo: 0,
        pipeCd: '',
        pipeNm: '',
        planPress: '',
        planTemp: '',
        pipeMat: '',
        gasketMat: '',
        nondestructMethod: '',
        nondestructPer: '',
        aftHeatTreatYn: 'N',
        plantCd: null,
        processCd: null,

        chngNum: '',
        chngNo: 0,
        createUserId: '',
        updateUserId: '',
      }),
    },
  },
  data() {
    return {
      // pipe: {
      //   pipeNo: 0,
      //   pipeCd: '',
      //   pipeNm: '',
      //   planPress: '',
      //   planTemp: '',
      //   pipeMat: '',
      //   gasketMat: '',
      //   nondestructMethod: '',
      //   nondestructPer: '',
      //   aftHeatTreatYn: 'N',
      //   plantCd: null,
      //   processCd: null,

      //   // chemprods: [],
      // },
      editable: false,
      isInsert: false,
      isEdit: false,
      searchDetailUrl: '',
      insertUrl: '',
      editUrl: '',
      updateMode: false,
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        param: {},
        width: '80%',
        top: '10px',
        closeCallback: null,
      },
    };
  },
  watch: {
    'tabParam.pipeNo': function (newValue, oldValue) {
      if (newValue !== 0) this.updateMode = true;
      else this.updateMode = false;
    },
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {},
  beforeDestroy() {},
  methods: {
    init() {
      // URL 셋팅
      this.searchDetailUrl = selectConfig.psm.processFacility.pipe.get.url;
      this.insertUrl = transactionConfig.psm.processFacility.pipe.insert.url;
      this.editUrl = transactionConfig.psm.processFacility.pipe.insert.url;

      this.editable = this.$route.meta.editable;

      // if (this.tabParam.pipeCd !== '' && this.tabParam.pipeCd !== null)
      // {
      //   this.pipe.plantCd = this.tabParam.plantCd;
      //   this.pipe.processCd = this.tabParam.processCd;
      //   this.pipe.pipeCd = this.tabParam.pipeCd;
      // }

      // this.getList();
    },
    beforeInsert() {
      this.$validator
        .validateAll()
        .then((_result) => {
          // TODO : 전역 성공 메시지 처리
          // 이벤트는 ./event.js 파일에 선언되어 있음
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: '확인',
              message: '등록하시겠습니까?',
              type: 'info',
              // 확인 callback 함수
              confirmCallback: () => {
                this.tabParam.pipeNo = 0;
                this.isInsert = true;
                this.tabParam.createUserId = this.$store.getters.token;
              },
              // 취소 callback 함수
              cancelCallback: () => {
                this.isInsert = false;
              },
            });
          } else if (!_result) {
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
            'M0000000881' // 유효성 검사도중 에러가 발생하였습니다.
          );
          this.isInsert = false;
        });
    },
    beforeSubmit() {
      this.$validator
        .validateAll()
        .then((_result) => {
          // TODO : 전역 성공 메시지 처리
          // 이벤트는 ./event.js 파일에 선언되어 있음
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321', // '확인',
              message: 'M0000000060', // 수정하시겠습니까?
              type: 'info',
              // 확인 callback 함수
              confirmCallback: () => {
                this.tabParam.updateUserId = this.$store.getters.token;
                this.isEdit = true;
              },
              // 취소 callback 함수
              cancelCallback: () => {
                this.isEdit = false;
              },
            });
          } else if (!_result) {
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
            'M0000000881' // 유효성 검사도중 에러가 발생하였습니다.
          );
          this.isEdit = false;
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
    // 신규등록
    btnInsertClickedCallback(_result) {
      this.tabParam.pipeNo = _result.data;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // '안내',
        message: 'M0000000106', // 등록되었습니다.
        type: 'success',
      });
      this.isInsert = false;
      this.updateMode = true;
      this.$emit('getList', {});
    },
    btnSaveClickedCallback(_result) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // '안내',
        message: 'M0000000836', // 수정되었습니다.
        type: 'success',
      });
      this.isEdit = false;
      this.$emit('getList', {});
    },
    // 버튼 에러 처리
    btnClickedErrorCallback(_result) {
      this.isInsert = false;
      window.getApp.emit('APP_REQUEST_ERROR', _result);
    },
    /**
     * 데이터 및 이벤트 초기화, 수정버튼 안보여지도록 처리
     *  초기화 버튼 callback
     */
    btnClearClickedCallback() {
      this.updateMode = false;
      // Object.assign(this.tabParam, this.$options.data().tabParam);
      this.$emit('reset', {});
      // 기간 Setting
      // this.setDefaultDate();
      this.$validator.reset();
    },
    /**
     *  팝업 안 보이도록 closePopup emit
     *  팝업 close
     * data : 팝업창에서 return하는 데이터
     */
    closePopup(data) {
      this.$emit('closePopup', {});
    },

    searchMoc() {
      this.popupOptions.param = {
        plantCd: this.tabParam.plantCd,
        chngRefWorkCd: 'CGRW1',
      };
      this.popupOptions.target = () =>
        import(`${'@/pages/saf/change/changePop.vue'}`);
      this.popupOptions.title = 'L0000001221'; // 변경관리
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      this.popupOptions.closeCallback = this.closeMocPopup;
    },
    closeMocPopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data !== 'CLOSE') {
        this.tabParam.chngNum = data.chngNum;
        this.tabParam.safChngNo = data.safChngNo;
      }
    },
    removeMoc() {
      this.tabParam.chngNum = '';
      this.tabParam.safChngNo = 0;
    },
  },
};
</script>
<style>
#pipeDetailTable .cell span {
  white-space: pre-line;
}
</style>
