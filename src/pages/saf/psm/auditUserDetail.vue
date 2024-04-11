<template>
  <b-container fluid>
    <b-row ref="detailBox">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- PSM 감사원 상세 -->
            <y-label label="L0000000146" icon="user-edit" color-class="cutstom-title-color" />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 저장 -->
              <y-btn
                v-if="editable"
                :action-url="saveUrl"
                :param="auditUser"
                :is-submit="isSave"
                title="L0000002474"
                color="orange"
                :action-type="actionType"
                beforeSubmit="beforeSave"
                @beforeSave="beforeSave"
                @btnClicked="btnSaveClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- <y-btn
                v-if="editable && popupParam.auditUserNo > 0"
                :action-url="deleteUrl"
                :param="deleteValue"
                :is-submit="isDelete"
                title="삭제"
                color="red"
                action-type="DELETE"
                beforeSubmit="beforeDelete"
                @beforeDelete="beforeDelete"
                @btnClicked="btnDeleteClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              /> -->
              <!-- 닫기 -->
              <y-btn title="L0000000881" @btnClicked="btnClosePopup" />
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-3">
              <b-row>
                <b-col sm="6">
                  <y-plant
                    type="edit"
                    :required="true"
                    :editable="editable"
                    name="plantCd"
                    v-model="auditUser.plantCd"
                    v-validate="'required'"
                    :state="validateState('plantCd')"
                  />
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 년도 -->
              <y-datepicker
                :width="8"
                :required="true"
                :editable="editable"
                type="year"
                label="L0000000829"
                name="year"
                :default="auditUser.year"
                v-model="auditUser.year"
                v-validate="'required'"
                :state="validateState('year')"
              ></y-datepicker>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 구분 -->
              <y-select
                :width="8"
                :required="true"
                :editable="editable"
                :comboItems="typeItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="L0000000686"
                name="auditTypeCd"
                v-model="auditUser.auditTypeCd"
                v-validate="'required'"
                :state="validateState('auditTypeCd')"
              ></y-select>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-3">
              <b-row>
                <b-col sm="4">
                  <!-- 부서/감사원 -->
                  <y-text
                    :width="6"
                    :editable="editable"
                    :required="true"
                    :clearable="true"
                    :disabled="true"
                    ui="bootstrap"
                    name="actDeptNm"
                    label="L0000001301"
                    v-model="auditUser.deptNm"
                    v-validate="'required'"
                  />
                </b-col>
                <b-col sm="4">
                  <y-text
                    :width="6"
                    :editable="editable"
                    :clearable="true"
                    :disabled="true"
                    ui="bootstrap"
                    name="userNm"
                    v-model="auditUser.userNm"
                    :appendIcon="[{ 'icon': 'search', callbackName: 'searchUser' }]"
                    @searchUser="btnSearchUserClicked"
                    v-validate="'required'"
                  />
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 전공 -->
              <y-text
                :width="8"
                :maxlength="30"
                :editable="editable"
                ui="bootstrap"
                label="L0000002491"
                name="majorDesc"
                v-model="auditUser.majorDesc"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 경력 -->
              <y-text
                :width="8"
                :editable="editable"
                ui="bootstrap"
                label="L0000000458"
                name="careerDesc"
                v-model="auditUser.careerDesc"
              ></y-text>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <!-- 교육이수현황 -->
              <y-text
                :width="10"
                :maxlength="150"
                :editable="editable"
                ui="bootstrap"
                label="L0000000665"
                name="eduDesc"
                v-model="auditUser.eduDesc"
              ></y-text>
            </b-col>
            <!-- 자격증보유현황 -->
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <y-text
                :width="10"
                :maxlength="150"
                :editable="editable"
                ui="bootstrap"
                label="L0000002304"
                name="certiDesc"
                v-model="auditUser.certiDesc"
              ></y-text>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <!-- 비고 -->
              <y-textarea
                :width="10"
                :maxlength="200"
                :editable="editable"
                ui="bootstrap"
                label="L0000001360"
                name="remark"
                v-model="auditUser.remark"
              ></y-textarea>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 사용여부, 사용/미사용 -->
              <y-switch
                :width="8"
                :editable="editable"
                true-value="Y"
                false-value="N"
                ui="bootstrap"
                label="L0000001439"
                name="radioValue"
                selectText="L0000001440"
                unselectText="L0000001063"
                v-model="auditUser.useYn"
              ></y-switch>
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
  name: 'audit-user-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        auditUserNo: 0,
      },
    },
  },
  data() {
    return {
      auditUser: {
        auditUserNo: 0, // 감사원번호
        year: '', // 연도
        userId: '', // 감사원id
        userNm: '', // 감사원명
        plantCd: '', // 사업장코드
        deptNm: null, // 부서명
        majorDesc: null, // 전공내역
        careerDesc: null, // 경력사항
        eduDesc: null, // 교육이수현황
        certiDesc: null, // 자격증내역
        remark: null, // 비고
        useYn: 'Y', // 사용여부
      },
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '90%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      typeItems: [],
      editable: false,
      searchDetailUrl: '',
      saveUrl: '',
      isSave: false,
      actionType: 'POST',
      deleteUrl: '',
      isDelete: false,
      deleteValue: null,
    };
  },
  watch: {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {},
  /** methods **/
  methods: {
    init() {
      // URL 셋팅
      this.searchDetailUrl = selectConfig.saf.auditUser.get.url;
      this.saveUrl = transactionConfig.saf.auditUser.insert.url;
      this.deleteUrl = transactionConfig.saf.auditUser.delete.url;
      this.checkUrl = selectConfig.saf.auditUser.checkUrl.url;
      this.editable = this.$route.meta.editable;

      this.$comm.getComboItems('AUDIT_TYPE_CD', false).then(_result => {
        this.typeItems = _result;
      });
      this.getDetail();
    },
    getDetail() {
      if (!this.popupParam.auditUserNo) {
        return;
      }
      this.$http.url = this.$format(
        this.searchDetailUrl,
        this.popupParam.auditUserNo
      );
      this.$http.type = 'GET';
      this.$http.request((_result) => {
        this.auditUser = this.$_.clone(_result.data);
      });
    },
    validateState(_ref) {
      if (!_ref) return;
      if (
        this.veeBag[_ref] &&
        (this.veeBag[_ref].dirty || this.veeBag[_ref].validated)
      ) {
        return !this.errors.has(_ref);
      }
      return null;
    },
    beforeSave() {
      if (this.popupParam.auditUserNo) {
        this.saveUrl = transactionConfig.saf.auditUser.edit.url;
        this.actionType = 'PUT';
        this.checkValidator('edit');
      } else {
        this.saveUrl = transactionConfig.saf.auditUser.insert.url;
        this.actionType = 'POST';
        this.checkValidator('insert');
      }
    },
    checkValidator(flag) {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321', /* 확인 */
              message: 'M0000000011', /* 저장하시겠습니까? */
              // TODO : 필요시 추가하세요.
              type: 'info', // success / info / warning / error
              // 확인 callback 함수
              confirmCallback: () => {
                this.auditUser.createUserId = this.$store.getters.token;
                this.auditUser.updateUserId = this.$store.getters.token;
                this.isSave = true;
              },
            });
          } else {
            this.$popupRequired.check('auditUserDetail', this.$data, this.errors);
          }
        })
        .catch(() => {
          this.isSave = false;
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000876' /* 유효성 검사도중 에러가 발생하였습니다. */
          );
        });
    },
    btnSaveClickedCallback(_result) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', /* 안내 */
        message: 'M0000000006', /* 저장되었습니다. */
        type: 'success',
      });
      if (!this.popupParam.auditUserNo) {
        this.popupParam.auditUserNo = _result.data;
      }
      this.isSave = false;
      this.getDetail();
    },
    // 버튼 에러 처리
    btnClickedErrorCallback(_result) {
      this.isSave = false;
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    // 팝업 닫기
    btnClosePopup() {
      // 부모창에 값 전달
      this.$emit('closePopup', { success: true });
    },
    btnSearchUserClicked(_item) {
      if (!this.editable) return;
      this.popupOptions.target = () =>
        import(`${'@/pages/manage/user/userSearch.vue'}`);
      this.popupOptions.param = {
        plantCd: this.auditUser.plantCd, // 선택한 사업장의 정보가 따라서 조회되도록 설정
      };
      this.popupOptions.title = 'L0000003791'; /* 감사원검색 */
      this.popupOptions.visible = true;
      this.popupOptions.width = '60%';
      this.popupOptions.top = '100px';
      this.popupOptions.closeCallback = this.closePopupSearchUser;
    },
    closePopupSearchUser(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      if (data.user) {
        this.auditUser.userId = data.user.userId;
        this.auditUser.userNm = data.user.userNm;
        this.auditUser.deptCd = data.user.deptCd;
        this.auditUser.deptNm = data.user.deptNm;
      }
    },
    // getComboItems(codeGroupCd) {
    //   this.$http.url = this.$format(
    //     selectConfig.codeMaster.getSelect.url,
    //     codeGroupCd
    //   );
    //   this.$http.type = 'GET';
    //   this.$http.request(
    //     (_result) => {
    //       if (codeGroupCd === 'AUDIT_TYPE_CD') {
    //         this.typeItems = this.$_.clone(_result.data);
    //         this.typeItems.splice(0, 0, {
    //           code: null,
    //           codeNm: '전체',
    //         });
    //       }
    //     },
    //     (_error) => {
    //       window.getApp.$emit('APP_REQUEST_ERROR', _error);
    //     }
    //   );
    // },
    // beforeDelete() {
    //   this.$http.url = this.$format(this.checkUrl, this.popupParam.auditUserNo);
    //   this.$http.type = 'get';
    //   this.$http.request((_result) => {
    //     if (_result.data > 0) {
    //       window.getApp.$emit('ALERT', {
    //         title: '안내',
    //         message: 'PSM자체감사 계획 및 결과에서 사용하고 있습니다',
    //         type: 'warning',
    //       });
    //       return;
    //     } else {
    //       window.getApp.$emit('CONFIRM', {
    //         title: '확인',
    //         message: '삭제하시겠습니까?',
    //         type: 'info',
    //         confirmCallback: () => {
    //           let auditUsers = [];
    //           auditUsers.push(this.auditUser);
    //           this.deleteValue = {
    //             data: Object.values(this.$_.clone(auditUsers)),
    //           };
    //           this.isDelete = true;
    //         },
    //       });
    //     }
    //   });
    // },
    // btnDeleteClickedCallback(_result) {
    //   this.isDelete = false;
    //   window.getApp.$emit('ALERT', {
    //     title: '안내',
    //     message: '삭제되었습니다.',
    //     type: 'success',
    //   });
    //   this.btnClosePopup();
    // },
  },
};
</script>