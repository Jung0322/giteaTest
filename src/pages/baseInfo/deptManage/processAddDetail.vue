<!--
  목적 : 작업공정관리
  작성자 : khk
  Detail : 작업공정 상세 및 등록/수정
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row v-if="!popupParam.popupMode" class="mt-3" ref="inputBox">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 공정 상세 -->
            <y-label
              label="L0000000525"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 저장 -->
              <y-btn
                v-if="editable && updateMode"
                :action-url="editUrl"
                :param="process"
                :is-submit="isEdit"
                title="L0000002474"
                color="orange"
                action-type="put"
                beforeSubmit="beforeUpdateSubmit"
                @beforeUpdateSubmit="beforeUpdateSubmit"
                @btnClicked="btnUpdateClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 저장 -->
              <y-btn
                v-if="!updateMode && editable"
                :action-url="insertUrl"
                :param="process"
                :is-submit="isInsert"
                title="L0000002474"
                color="orange"
                action-type="post"
                beforeSubmit="beforeCreateSubmit"
                @beforeCreateSubmit="beforeCreateSubmit"
                @btnClicked="btnCreateClickedCallback"
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
              <!-- 공정코드 -->
              <y-text
                :width="8"
                :editable="editable"
                :disabled="updateMode"
                :maxlength="15"
                :required="true"
                ui="bootstrap"
                label="L0000000549"
                name="processCd"
                v-model="process.processCd"
                v-validate="'required'"
                :state="validateState('processCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 공정 -->
              <y-text
                :width="8"
                :editable="editable"
                :maxlength="30"
                :required="true"
                ui="bootstrap"
                label="L0000000515"
                name="processNm"
                v-model="process.processNm"
                v-validate="'required'"
                :state="validateState('processNm')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 사용여부 -->
              <y-switch
                :width="8"
                :editable="editable"
                true-value="Y"
                false-value="N"
                ui="bootstrap"
                label="L0000001439"
                name="useYn"
                selectText="L0000001440"
                unselectText="L0000001063"
                v-model="process.useYn"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 정렬순서 -->
              <y-number
                :width="8"
                :editable="editable"
                :maxlength="5"
                :hasSeperator="false"
                :isPositive="true"
                ui="bootstrap"
                label="L0000002601"
                name="sortOrder"
                v-model="process.sortOrder"
              />
            </b-col>
            <b-col
              v-show="updateMode"
              sm="6"
              md="6"
              lg="6"
              xl="6"
              class="col-xxl-3"
            >
              <!-- 사업장 -->
              <y-tag
                :width="8"
                :disabled="true"
                new-label-text
                label="L0000001415"
                v-model="process.plants"
                name="plants"
              />
            </b-col>
            <b-col
              v-show="updateMode"
              sm="6"
              md="6"
              lg="6"
              xl="6"
              class="col-xxl-3"
            >
              <!-- 부서 -->
              <y-tag
                :width="8"
                :disabled="true"
                new-label-text
                label="L0000001287"
                v-model="process.depts"
                name="depts"
              />
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  /** attributes: name, components, props, data **/
  name: 'process-detail', // 반드시 입력하세요(안 하면 warning 발생). 네이밍 룰은 현재 vue component의 파일명의 단어를 "-"로 구분(예:exam-data)하여 입력하시면 됩니다. 입력후 이 주석은 지워주세요.
  props: {
    popupParam: {
      type: Object,
      default: {
        processCd: '',
        plantCd: '',
      },
    },
  },
  data() {
    return {
      process: {
        processCd: '',
        processNm: null,
        sortOrder: null,
        useYn: 'Y',
        plants: [],
        depts: [],
        createUserId: '',
        createUserNm: '',
        createDt: '',
        updateUserId: '',
        updateUserNm: '',
        updateDt: '',
      },
      searchParam: {
        plantCd: '',
        deptCd: '',
        processNm: '', // 공정명
      },

      selectedProcess: [],
      editable: false,
      updateMode: false,
      isInsert: false,
      isEdit: false,
      selectRow: null,
      gridData: [],
      gridHeaderOptions: [],
      gridHeight: '420',
      insertUrl: '',
      editUrl: '',
      searchUrl: '',
      detailUrl: '',
      disabledPlant: false,
      disabledDept: false,
    };
  },
  /** Vue lifecycle: created, mounted, destroyed, etc **/
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.editable = this.$route.meta.editable;
  },
  mounted() {
    this.init();
  },
  beforeDestory() {},
  /** methods **/
  methods: {
    init() {
      this.insertUrl = transactionConfig.manage.process.insert.url;
      this.editUrl = transactionConfig.manage.process.edit.url;
      this.searchUrl = selectConfig.manage.process.list.url;
      this.detailUrl = selectConfig.manage.process.get.url;
      this.checkUrl = selectConfig.manage.process.check.url;

      setTimeout(() => {
        if (this.popupParam.plantCd) {
          this.searchParam.plantCd = this.popupParam.plantCd;
          this.disabledPlant = true;
        } else {
          this.searchParam.plantCd = this.$store.getters.plantCd;
        }
        if (this.popupParam.deptCd) {
          this.searchParam.deptCd = this.popupParam.deptCd;
          this.disabledDept = true;
        }
      }, 300);
      if (this.popupParam.processCd !== '') {
        this.getDetail();
      }
    },
    getDetail() {
      this.$http.url = this.detailUrl;
      this.$http.type = 'get';
      this.$http.param = {
        processCd: this.popupParam.processCd,
      };
      this.$http.request(
        (_result) => {
          this.updateMode = true;
          this.process = _result.data;
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
    beforeCreateSubmit() {
      this.beforeSaveCheck('insert');
    },
    beforeUpdateSubmit() {
      this.beforeSaveCheck('edit');
    },
    /** /Call API service **/
    /** validation checking(필요없으면 지워주세요) **/
    beforeSaveCheck(flag) {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            this.$http.url = this.checkUrl;
            this.$http.param = {
              processCd: this.process.processCd,
              processNm: this.process.processNm,
            };
            this.$http.type = 'GET';

            this.$http.request(
              (_result) => {
                let resultData = true;
                this.$_.forEach(_result.data, (item) => {
                  if (
                    item.gubun === 'processCd' &&
                    flag === 'insert' &&
                    this.$_.parseInt(item.cnt) > 0
                  ) {
                    window.getApp.$emit('ALERT', {
                      title: 'L0000003395',
                      message: 'M0000000112', // 이미 존재하는 공정코드입니다.
                      type: 'warning', // success / info / warning / error
                    });
                    resultData = false;
                    return false;
                  }
                  if (item.gubun === 'processNm') {
                    if (this.$_.parseInt(item.cnt) > 0) {
                      window.getApp.$emit('ALERT', {
                        title: 'L0000003395',
                        message: 'M0000000113', // 이미 존재하는 공정명입니다.
                        type: 'warning', // success / info / warning / error
                      });
                      resultData = false;
                      return false;
                    }
                  }
                });
                if (!resultData) return;
                else {
                  window.getApp.$emit('CONFIRM', {
                    title: 'L0000003321',
                    message:
                      flag === 'edit'
                        ? 'M0000000011' // 저장하시겠습니까?
                        : 'M0000000011', // 등록하시겠습니까?
                    // TODO : 필요시 추가하세요.
                    type: 'info', // success / info / warning / error
                    // 확인 callback 함수
                    confirmCallback: () => {
                      this.process.createUserId = this.$store.getters.token;
                      this.process.updateUserId = this.$store.getters.token;
                      if (flag === 'edit') this.isEdit = true;
                      else this.isInsert = true;
                    },
                  });
                }
              },
              (_error) => {
                window.getApp.$emit('APP_REQUEST_ERROR', _error);
              }
            );
          } else {
            this.$popupRequired.check(
              'processAddDetail',
              this.$data,
              this.errors
            );
          }
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000876' // 유효성 검사도중 에러가 발생하였습니다.
          );
          this.isEdit = false;
          this.isInsert = false;
        });
    },
    btnCreateClickedCallback(_result) {
      this.process.processCd = _result.data;
      this.isInsert = false;
      this.updateMode = true;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395',
        message: 'M0000000006', // 저장되었습니다.
        type: 'success',
      });
    },
    btnUpdateClickedCallback(_result) {
      this.isEdit = false;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395',
        message: 'M0000000836', // 수정되었습니다
        type: 'success',
      });
    },
    /**
     * 버튼 에러 처리용 공통함수
     */
    btnClickedErrorCallback(_result) {
      this.isInsert = false;
      this.isEdit = false;
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    btnClosePopup() {
      // 부모창에 값 전달
      this.$emit('closePopup', { success: true });
    },
  },
};
</script>
