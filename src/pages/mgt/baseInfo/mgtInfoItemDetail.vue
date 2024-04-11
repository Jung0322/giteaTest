<template>
  <b-container fluid>
    <b-col sm="12">
      <b-row>
        <b-col sm="12">
          <y-label
            label="경영정보항목 상세"
            icon="user-edit"
            color-class="cutstom-title-color"
          />
          <div slot="buttonGroup" class="float-right mb-1">
            <y-btn
              v-if="editable && updateMode"
              :action-url="editUrl"
              :param="management"
              :is-submit="isEdit"
              title="저장"
              color="orange"
              action-type="PUT"
              beforeSubmit="beforeEdit"
              @beforeEdit="beforeEdit"
              @btnClicked="btnEditClickedCallback"
              @btnClickedErrorCallback="btnClickedErrorCallback"
            />
            <y-btn
              v-if="editable && !updateMode"
              title="저장"
              :action-url="insertUrl"
              :param="management"
              :is-submit="isInsert"
              color="orange"
              action-type="POST"
              beforeSubmit="beforeInsert"
              @beforeInsert="beforeInsert"
              @btnClicked="btnInsertClickedCallback"
              @btnClickedErrorCallback="btnClickedErrorCallback"
            />
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
              :required="true"
              name="plantCd"
              v-model="management.plantCd"
              v-validate="'required'"
              :state="validateState('plantCd')"
            />
          </b-col>
          <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
            <y-select
              :width="8"
              :required="true"
              :comboItems="comboMgtInfoItems"
              itemText="mgInfoItmNm"
              itemValue="mgtMgInfoItmNo"
              ui="bootstrap"
              label="항목"
              name="mgtMgInfoItmNo"
              v-model="management.mgtMgInfoItmNo"
              v-validate="'required'"
              :state="validateState('mgtMgInfoItmNo')"
            ></y-select>
          </b-col>
          <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
            <y-text
              :width="8"
              :editable="editable"
              :required="true"
              :maxlength="30"
              ui="bootstrap"
              label="부서구분명"
              name="deptAttNm"
              v-model="management.deptAttNm"
              v-validate="'required'"
              :state="validateState('deptAttNm')"
            ></y-text>
          </b-col>
          <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
            <y-switch
              :width="8"
              :editable="editable"
              true-value="Y"
              false-value="N"
              ui="bootstrap"
              label="사용여부"
              name="useYn"
              selectText="사용"
              unselectText="미사용"
              v-model="management.useYn"
            />
          </b-col>
          <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
            <y-number
              :width="8"
              :editable="editable"
              :maxlength="5"
              :hasSeperator="false"
              ui="bootstrap"
              name="sortOrder"
              label="정렬순서"
              v-model="management.sortOrder"
            ></y-number>
          </b-col>
        </b-row>
      </b-card>
    </b-col>
  </b-container>
</template>
<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  name: 'mgt-info-item-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        mgtMgInfoDeptAttNo: 0,
        plantCd: '',
        infoItmAttCd: '', // 분류
        pageNm: '',

        noAccUseYn: false,
      },
    },
  },
  data() {
    return {
      management: {
        mgtMgInfoDeptAttNo: 0, // 부서구분번호
        mgtMgInfoItmNo: null, // 경영정보항목번호
        plantCd: '', // 사업장코드
        deptAttNm: '', // 부서구분명
        useYn: 'Y', // 사용여부
        sortOrder: 0, // 정렬순서
        createUserId: '', // 등록자
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
      searchParam: {
        plantCd: '',
        infoItmAttCd: '', // 분류
      },
      editable: false,
      updateMode: false,
      searchUrl: '',
      detailUrl: '',
      checkUrl: '',
      insertUrl: '',
      editUrl: '',
      isInsert: false,
      isEdit: false,
      comboMgtInfoItems: [], // 항목
      cookieName: '',
      routeName: '',
    };
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    window.addEventListener('resize', this.setGridSize);
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.setGridSize);
    // cookie는 2시간
    this.$cookies.set(this.$data.cookieName, this.$data.searchParam, {
      expires: 1 / 12,
    });
  },
  /** methods **/
  methods: {
    init() {
      this.comboUrl = selectConfig.mgt.mgtInfoItem.comboList.url;
      this.detailUrl = selectConfig.mgt.mgtInfoItem.get.url;
      this.insertUrl = transactionConfig.mgt.mgtInfoItem.insert.url;
      this.editUrl = transactionConfig.mgt.mgtInfoItem.edit.url;
      this.checkUrl = selectConfig.mgt.mgtInfoItem.checkMgtInfoItem.url;

      this.editable = this.$route.meta.editable;

      this.routeName = this.$route.name;
      this.cookieName = 'SHE' + this.$store.getters.token; // cookieName 설정

      this.getComboList();
      this.management.mgtMgInfoDeptAttNo = this.popupParam.mgtMgInfoDeptAttNo;
      if (this.popupParam.mgtMgInfoDeptAttNo !== 0) {
        this.getDetail();
      } else {
        this.updateMode = false;
      }
    },
    getDetail() {
      this.$http.url = this.$format(
        this.detailUrl,
        this.management.mgtMgInfoDeptAttNo
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.management = this.$_.clone(_result.data);
          this.updateMode = true;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getComboList() {
      this.$http.url = this.comboUrl;
      this.$http.type = 'GET';
      this.$http.param = this.popupParam;

      this.$http.request(
        (_result) => {
          this.comboMgtInfoItems = this.$_.clone(_result.data);
          this.comboMgtInfoItems.splice(0, 0, {
            mgtMgInfoItmNo: null,
            mgInfoItmNm: '선택하세요',
          });
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
    beforeEdit() {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: '확인',
              message: '저장하시겠습니까?',
              type: 'info',
              confirmCallback: () => {
                this.management.updateUserId = this.$store.getters.token;
                this.isEdit = true;
              },
              cancelCallback: () => {
                this.isEdit = false;
              },
            });
          } else {
            window.getApp.$emit('ALERT', {
              title: '안내',
              message: '필수입력값을 입력해주세요.',
              type: 'warning',
            });
          }
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            '유효성 검사도중 에러가 발생하였습니다.'
          );
        });
    },
    beforeInsert() {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: '확인',
              message: '등록하시겠습니까?',
              type: 'info',
              // 확인 callback 함수
              confirmCallback: () => {
                this.$http.url = this.checkUrl;
                this.$http.type = 'GET';
                this.$http.param = this.management;
                this.$http.request(
                  (_result) => {
                    if (_result.data <= 0) {
                      this.management.createUserId = this.$store.getters.token;
                      this.isInsert = true;
                    } else {
                      window.getApp.$emit('ALERT', {
                        title: '안내',
                        message: '이미 등록된 경영정보 부서구분입니다.',
                        type: 'warning',
                      });
                    }
                  },
                  (_error) => {
                    window.getApp.$emit('APP_REQUEST_ERROR', _error);
                  }
                );
              },
              cancelCallback: () => {
                this.isInsert = false;
              },
            });
          } else {
            window.getApp.$emit('ALERT', {
              title: '안내',
              message: '필수입력값을 입력해주세요.',
              type: 'warning',
            });
          }
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            '유효성 검사도중 에러가 발생하였습니다.'
          );
        });
    },
    setGridSize() {
      var defaultHeight = 300;
      window.getApp.$emit('LOADING_SHOW');
      setTimeout(() => {
        var calculatedHeight =
          window.innerHeight - this.$refs.searchBox.clientHeight - 280;

        window.getApp.$emit('LOADING_HIDE');
      }, 600);
    },
    // 수정
    btnEditClickedCallback(_result) {
      this.isEdit = false;
      if (_result.data > 0) {
        window.getApp.$emit('ALERT', {
          title: '안내',
          message: '저장되었습니다.',
          type: 'success',
        });
        this.getList();
      } else {
        window.getApp.$emit('ALERT', {
          title: '안내',
          message: '저장하는 중 오류가 발생했습니다. 잠시후 다시 이용해주세요.',
          type: 'warning',
        });
      }
    },
    // 신규등록
    btnInsertClickedCallback(_result) {
      this.isInsert = false;
      if (_result.data > 0) {
        this.updateMode = true;
        this.management.mgtMgInfoDeptAttNo = _result.data;
        window.getApp.$emit('ALERT', {
          title: '안내',
          message: '등록되었습니다.',
          type: 'success',
        });
      } else {
        window.getApp.$emit('ALERT', {
          title: '안내',
          message: '저장하는 중 오류가 발생했습니다. 잠시후 다시 이용해주세요.',
          type: 'warning',
        });
      }
    },
    // 버튼 에러 처리
    btnClickedErrorCallback(_result) {
      this.isInsert = false;
      this.isEdit = false;
      this.updateMode = false;
      window.getApp.emit('APP_REQUEST_ERROR', _result);
    },
    // 팝업 닫기
    btnClosePopup() {
      // 부모창에 값 전달
      this.$emit('closePopup', { success: true });
    },
  },
};
</script>
