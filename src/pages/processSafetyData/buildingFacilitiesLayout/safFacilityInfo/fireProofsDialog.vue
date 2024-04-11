<!--
  목적 : 내화구조명세 상세 목록
  Detail : 내화구조명세 상세 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 검색 -->
    <b-row ref="searchBox">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 내화구조명세 상세정보 -->
            <y-label
              label="L0000004037"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 저장 -->
              <y-btn
                v-if="insertCheck && editable && !popupParam.search"
                :action-url="insertUrl"
                :param="fireProofs"
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
                v-if="!insertCheck && editable && !popupParam.search"
                :action-url="editUrl"
                :param="fireProofs"
                :is-submit="isEdit"
                title="L0000002474"
                color="orange"
                action-type="PUT"
                beforeSubmit="beforeEdit"
                @beforeEdit="beforeEdit"
                @btnClicked="btnEditClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 삭제 -->
              <y-btn
                v-if="!insertCheck && editable && !popupParam.search"
                :action-url="deleteUrl"
                :param="deleteValue"
                :is-submit="isDelete"
                title="L0000001495"
                color="red"
                action-type="DELETE"
                beforeSubmit="beforeDelete"
                @beforeDelete="beforeDelete"
                @btnClicked="btnDeleteClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 닫기 -->
              <y-btn title="L0000000881" @btnClicked="closePopup" />
            </div>
          </b-col>
        </b-row>
        <b-card
          header-class="default-card"
          body-class="default-body-card"
          class="py-0"
        >
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <y-plant
                :width="6"
                type="edit"
                :required="true"
                :disabled="popupParam.search"
                :editable="editable"
                name="plantCd"
                v-model="fireProofs.plantCd"
                v-validate="'required'"
                :state="validateState('plantCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 구분 -->
              <y-text
                :width="8"
                :disabled="popupParam.search"
                :editable="editable"
                :maxlength="30"
                :required="true"
                ui="bootstrap"
                label="L0000000686"
                name="category"
                v-model="fireProofs.category"
                v-validate="'required'"
                :state="validateState('category')"
              ></y-text>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <!-- 내화구조설비 및 지역 -->
              <y-text
                :width="baseWidth"
                :editable="editable"
                :disabled="popupParam.search"
                :maxlength="200"
                :required="true"
                ui="bootstrap"
                label="L0000000827"
                name="fireProofsNm"
                v-model="fireProofs.fireProofsNm"
                v-validate="'required'"
                :state="validateState('fireProofsNm')"
              ></y-text>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <!-- 내화부위 -->
              <y-text
                :width="baseWidth"
                :editable="editable"
                :disabled="popupParam.search"
                :maxlength="200"
                :required="true"
                ui="bootstrap"
                label="L0000000826"
                name="fireProofPart"
                v-model="fireProofs.fireProofPart"
                v-validate="'required'"
                :state="validateState('fireProofPart')"
              ></y-text>
            </b-col>
            <!-- 적용높이 -->
            <!-- <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <y-text
                :width="baseWidth"
                :editable="editable"
                :disabled="popupParam.search"
                :maxlength="200"
                :required="true"
                ui="bootstrap"
                label="L0000002484"
                name="height"
                v-model="fireProofs.height"
                v-validate="'required'"
                :state="validateState('height')"
              ></y-text>
            </b-col> -->
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <!-- 내화시험기준 및 시간 -->
              <y-text
                :width="baseWidth"
                :editable="editable"
                :disabled="popupParam.search"
                :maxlength="200"
                :required="true"
                ui="bootstrap"
                label="L0000004028"
                name="testStnd"
                v-model="fireProofs.testStnd"
                v-validate="'required'"
                :state="validateState('testStnd')"
              ></y-text>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <!-- 비고 -->
              <y-text
                :width="baseWidth"
                :editable="editable"
                :disabled="popupParam.search"
                :maxlength="500"
                ui="bootstrap"
                label="L0000001360"
                name="remark"
                v-model="fireProofs.remark"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 변경발의번호 -->
              <y-text
                :width="6"
                :disabled="popupParam.search"
                :editable="editable"
                ui="bootstrap"
                label="L0000004754"
                name="chngNum"
                v-model="fireProofs.chngNum"
              ></y-text>
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
  name: 'opr-cond-dialog',
  props: {
    popupParam: {
      type: Object,
      default: {
        fireProofsNo: 0,
        search: false,
      },
    },
  },
  data() {
    return {
      fireProofs: {
        fireProofsNo: 0,
        plantCd: null,
        category: '',
        fireProofsNum: '',
        fireProofsNm: '',
        fireProofPart: '',
        height: '',
        testStnd: '',
        remark: '',
        revNum: '',
        revContents: '',
        createrId: '',
        createDt: '',
        updaterId: '',
        updateDt: '',
        chngNum: '', // 변경발의번호
        safChngNo: 0,
      },
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        param: {},
        width: '80%',
        top: '10px',
        closeCallback: null,
      },
      searchUrl: '',
      insertUrl: '',
      editUrl: '',
      deleteUrl: '',
      isInsert: false,
      isEdit: false,
      isDelete: false,
      insertCheck: true,
      baseWidth: 9,
      editable: false,
      deleteValue: null,
    };
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.editable = this.$route.meta.editable;
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.searchUrl =
        selectConfig.psm.buildingFacilitiesLayout.fireProofs.get.url;
      this.insertUrl =
        transactionConfig.psm.buildingFacilitiesLayout.fireProofs.insert.url;
      this.editUrl =
        transactionConfig.psm.buildingFacilitiesLayout.fireProofs.edit.url;
      this.deleteUrl =
        transactionConfig.psm.buildingFacilitiesLayout.fireProofs.delete.url;

      if (this.popupParam.fireProofsNo > 0) {
        this.insertCheck = false;
        this.getList();
      }
    },
    getList() {
      this.$http.url = this.$format(
        this.searchUrl,
        this.popupParam.fireProofsNo
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.fireProofs = this.$_.clone(_result.data);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    closePopup() {
      this.$emit('closePopup', {});
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
    beforeInsert() {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321' /* 확인 */,
        message: 'M0000000011' /* 저장하시겠습니까? */,
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          this.fireProofs.createrId = this.$store.getters.token;
          this.checkValidationInsert();
        },
      });
    },
    beforeEdit() {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321' /* 확인 */,
        message: 'M0000000011' /* 저장하시겠습니까? */,
        type: 'info',
        confirmCallback: () => {
          this.fireProofs.updaterId = this.$store.getters.token;
          this.checkValidationEdit();
        },
      });
    },
    beforeDelete() {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321' /* 확인 */,
        message: 'M0000000012' /* 삭제하시겠습니까? */,
        // TODO : 필요시 추가하세요.
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          this.deleteValue = {
            data: this.fireProofs,
          };

          this.isDelete = true;
        },
        // 취소 callback 함수
        cancelCallback: () => {
          this.isDelete = false;
        },
      });
    },
    btnDeleteClickedCallback(_result) {
      // window.alert("삭제되었습니다.");
      window.getApp.$emit('ALERT', {
        title: 'L0000003395' /* 안내 */,
        message: 'M0000000007' /* 삭제되었습니다. */,
        type: 'success', // success / info / warning / error
      });

      this.closePopup();
    },
    checkValidationInsert() {
      this.$validator
        .validateAll()
        .then((_result) => {
          this.isInsert = _result;
          // TODO : 전역 성공 메시지 처리
          // 이벤트는 ./event.js 파일에 선언되어 있음
          if (!this.isInsert) {
            this.$popupRequired.check(
              'fireProofsDialog',
              this.$data,
              this.errors
            );
          }
        })
        .catch(() => {
          this.isInsert = false;
        });
    },
    checkValidationEdit() {
      this.$validator
        .validateAll()
        .then((_result) => {
          this.isEdit = _result;
          // TODO : 전역 성공 메시지 처리
          // 이벤트는 ./event.js 파일에 선언되어 있음
          if (!this.isEdit) {
            this.$popupRequired.check(
              'fireProofsDialog',
              this.$data,
              this.errors
            );
          }
        })
        .catch(() => {
          this.isEdit = false;
        });
    },
    btnInsertClickedCallback(_result) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395' /* 안내 */,
        message: 'M0000000006' /* 저장되었습니다. */,
        type: 'success', // success / info / warning / error
      });

      this.closePopup();
    },
    btnEditClickedCallback(_result) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395' /* 안내 */,
        message: 'M0000000836' /* 수정되었습니다. */,
        type: 'success', // success / info / warning / error
      });

      this.closePopup();
    },
    btnClickedErrorCallback(_result) {
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    searchMoc() {
      this.popupOptions.param = {
        plantCd: this.fireProofs.plantCd,
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
        this.fireProofs.chngNum = data.chngNum;
        this.fireProofs.safChngNo = data.safChngNo;
      }
    },
    removeMoc() {
      this.fireProofs.chngNum = '';
      this.fireProofs.safChngNo = 0;
    },
    /**
     * 사용자의 입력을 받는다.
     */
  },
};
</script>

<style></style>
