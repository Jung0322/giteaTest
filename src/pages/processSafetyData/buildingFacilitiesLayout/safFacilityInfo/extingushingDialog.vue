<!--
  목적 : 소화설비 설치계획 상세 목록
  Detail : 소화설비 설치계획 상세 화면
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
            <!-- 소화설비 설치계획 상세정보 -->
            <y-label
              label="L0000001675"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 저장 -->
              <y-btn
                v-if="insertCheck && editable && !popupParam.search"
                :action-url="insertUrl"
                :param="extingushing"
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
                :param="extingushing"
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
                :width="baseWidth"
                type="edit"
                :required="true"
                :disabled="popupParam.search"
                :editable="editable"
                name="plantCd"
                v-model="extingushing.plantCd"
                v-validate="'required'"
                :state="validateState('plantCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 설치지역 -->
              <y-text
                :width="baseWidth"
                :disabled="popupParam.search"
                :editable="editable"
                :maxlength="15"
                :required="true"
                ui="bootstrap"
                label="L0000001628"
                name="location"
                v-model="extingushing.location"
                v-validate="'required'"
                :state="validateState('location')"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 소화기 -->
              <y-text
                :width="baseWidth"
                :disabled="popupParam.search"
                :editable="editable"
                :maxlength="15"
                ui="bootstrap"
                label="L0000001666"
                name="extinguisher"
                v-model="extingushing.extinguisher"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 자동확산소화기 -->
              <y-text
                :width="baseWidth"
                :disabled="popupParam.search"
                :editable="editable"
                :maxlength="15"
                ui="bootstrap"
                label="L0000002311"
                name="spreadExtinguisher"
                v-model="extingushing.spreadExtinguisher"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 자동소화장치 -->
              <y-text
                :width="baseWidth"
                :disabled="popupParam.search"
                :editable="editable"
                :maxlength="15"
                ui="bootstrap"
                label="L0000002307"
                name="autoExtinguisher"
                v-model="extingushing.autoExtinguisher"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 옥내소화전 -->
              <y-text
                :width="baseWidth"
                :disabled="popupParam.search"
                :editable="editable"
                :maxlength="15"
                ui="bootstrap"
                label="L0000002026"
                name="indoorExtinguisher"
                v-model="extingushing.indoorExtinguisher"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 스프링쿨러 -->
              <y-text
                :width="baseWidth"
                :disabled="popupParam.search"
                :editable="editable"
                :maxlength="15"
                ui="bootstrap"
                label="L0000001724"
                name="sprinkler"
                v-model="extingushing.sprinkler"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 물분무소화설비 -->
              <y-text
                :width="baseWidth"
                :disabled="popupParam.search"
                :editable="editable"
                :maxlength="15"
                ui="bootstrap"
                label="L0000001051"
                name="waterSpray"
                v-model="extingushing.waterSpray"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 포소화설비 -->
              <y-text
                :width="baseWidth"
                :disabled="popupParam.search"
                :editable="editable"
                :maxlength="15"
                ui="bootstrap"
                label="L0000003140"
                name="foamExtinguisher"
                v-model="extingushing.foamExtinguisher"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- Co2소화설비 -->
              <y-text
                :width="baseWidth"
                :disabled="popupParam.search"
                :editable="editable"
                :maxlength="15"
                ui="bootstrap"
                label="L0000000106"
                name="co2Extinguisher"
                v-model="extingushing.co2Extinguisher"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 할로겐화합물소화설비 -->
              <y-text
                :width="baseWidth"
                :disabled="popupParam.search"
                :editable="editable"
                :maxlength="15"
                ui="bootstrap"
                label="L0000003171"
                name="halogenExtinguisher"
                v-model="extingushing.halogenExtinguisher"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 청정소화약제소화설비 -->
              <y-text
                :width="baseWidth"
                :disabled="popupParam.search"
                :editable="editable"
                :maxlength="15"
                ui="bootstrap"
                label="L0000002853"
                name="cleanExtinguisher"
                v-model="extingushing.cleanExtinguisher"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 옥외소화전 -->
              <y-text
                :width="baseWidth"
                :disabled="popupParam.search"
                :editable="editable"
                :maxlength="15"
                ui="bootstrap"
                label="L0000002027"
                name="outdoorExtinguisher"
                v-model="extingushing.outdoorExtinguisher"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 변경발의번호 -->
              <y-text
                :width="baseWidth"
                :disabled="popupParam.search"
                :editable="editable"
                ui="bootstrap"
                label="L0000004754"
                name="chngNum"
                v-model="extingushing.chngNum"
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
        extingushingNo: 0,
        search: false,
      },
    },
  },
  data() {
    return {
      extingushing: {
        extingushingNo: 0,
        plantCd: null,
        location: '',
        extinguisher: '0',
        spreadExtinguisher: '0',
        autoExtinguisher: '0',
        indoorExtinguisher: '0',
        sprinkler: '0',
        waterSpray: '0',
        foamExtinguisher: '0',
        co2Extinguisher: '0',
        halogenExtinguisher: '0',
        cleanExtinguisher: '0',
        outdoorExtinguisher: '0',
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
      baseWidth: 8,
      editable: false,
      deleteValue: null,
    };
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
      this.searchUrl =
        selectConfig.psm.buildingFacilitiesLayout.extingushing.get.url;
      this.insertUrl =
        transactionConfig.psm.buildingFacilitiesLayout.extingushing.insert.url;
      this.editUrl =
        transactionConfig.psm.buildingFacilitiesLayout.extingushing.edit.url;
      this.deleteUrl =
        transactionConfig.psm.buildingFacilitiesLayout.extingushing.delete.url;

      if (this.popupParam.extingushingNo > 0) {
        this.insertCheck = false;
        this.getList();
      }
    },
    getList() {
      this.$http.url = this.$format(
        this.searchUrl,
        this.popupParam.extingushingNo
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.extingushing = this.$_.clone(_result.data);
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
          this.extingushing.createrId = this.$store.getters.token;
          this.checkValidationInsert();
        },
      });
    },
    beforeEdit() {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321' /* 확인 */,
        message: 'M0000000060', // 수정하시겠습니까?
        type: 'info',
        confirmCallback: () => {
          this.extingushing.updaterId = this.$store.getters.token;
          this.checkValidationEdit();
        },
      });
    },
    beforeDelete() {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321' /* 확인 */,
        message: 'M0000000012', // 삭제하시겠습니까?
        // TODO : 필요시 추가하세요.
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          this.deleteValue = {
            data: this.extingushing,
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
        title: 'L0000003395', // 안내
        message: 'M0000000007', // 삭제되었습니다.
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
              'extingushingDialog',
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
              'extingushingDialog',
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
        title: 'L0000003395', // 안내
        message: 'M0000000006', // 저장되었습니다.
        type: 'success', // success / info / warning / error
      });

      this.closePopup();
    },
    btnEditClickedCallback(_result) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // 안내
        message: 'M0000000836', // 수정되었습니다.
        type: 'success', // success / info / warning / error
      });

      this.closePopup();
    },
    btnClickedErrorCallback(_result) {
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    searchMoc() {
      this.popupOptions.param = {
        plantCd: this.extingushing.plantCd,
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
        this.extingushing.chngNum = data.chngNum;
        this.extingushing.safChngNo = data.safChngNo;
      }
    },
    removeMoc() {
      this.extingushing.chngNum = '';
      this.extingushing.safChngNo = 0;
    },
    /**
     * 사용자의 입력을 받는다.
     */
  },
};
</script>

<style></style>
