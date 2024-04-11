<!--
  목적 : 안전 > 기준정보 > 인적피해
  작성자 : kdh
  Detail : 인적피해 관리
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row ref="searchBox">
      <b-col sm="12">
        <b-card
          header-class="default-card"
          body-class="default-body-card"
          class="py-0"
        >
          <div slot="header">
            <y-label label="검색" />
            <div class="float-right">
              <y-btn
                :title="searchArea.title"
                color="green"
                @btnClicked="btnSearchVisibleClicked"
              />
              <y-btn
                title="검색"
                color="green"
                @btnClicked="btnSearchClicked"
              />
            </div>
          </div>
          <b-row v-if="searchArea.show">
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-select
                :width="8"
                :comboItems="searchCodeDomainCdItems"
                itemText="codeDomainNm"
                itemValue="codeDomainCd"
                ui="bootstrap"
                name="codeDomainCd"
                label="코드도메인"
                v-model="searchParam.codeDomainCd"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-select
                :width="8"
                :comboItems="searchCodeGroupCdItems"
                itemText="codeGroupNm"
                itemValue="codeGroupCd"
                ui="bootstrap"
                name="codeGroupCd"
                label="코드그룹"
                v-model="searchParam.codeGroupCd"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-text
                :width="8"
                ui="bootstrap"
                label="코드명"
                name="codeNm"
                v-model="searchParam.codeNm"
              />
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>

    <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <y-data-table
            ref="dataTable"
            label="코드마스터 목록"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :use-paging="true"
            @selectedRow="getDetail"
          />
        </b-col>
      </b-col>
    </b-row>

    <b-row class="mt-3">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <y-label
              label="코드마스터 등록"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-select
                :width="8"
                :editable="editable"
                :required="true"
                :disabled="!createMode"
                :comboItems="detailCodeGroupCdItems"
                itemText="codeGroupNm"
                itemValue="codeGroupCd"
                ui="bootstrap"
                name="codeGroupCd"
                label="코드그룹"
                v-model="codeMaster.codeGroupCd"
                v-validate="'required'"
                :state="validateState('codeGroupCd')"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-text
                :width="8"
                :editable="editable"
                :required="true"
                :maxlength="codeGroup.codeLength"
                :disabled="!createMode"
                ui="bootstrap"
                label="코드"
                name="code"
                v-model="codeMaster.code"
                v-validate="'required'"
                :state="validateState('code')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-text
                :width="8"
                :editable="editable"
                :required="true"
                :maxlength="30"
                ui="bootstrap"
                label="코드명"
                name="codeNm"
                v-model="codeMaster.codeNm"
                v-validate="'required'"
                :state="validateState('codeNm')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-text
                :width="8"
                :editable="editable"
                :maxlength="15"
                ui="bootstrap"
                label="약어"
                name="codeAbbr"
                v-model="codeMaster.codeAbbr"
              />
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
                v-model="codeMaster.useYn"
              />
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <y-textarea
                :width="10"
                :editable="editable"
                :maxlength="200"
                ui="bootstrap"
                label="비고"
                name="remarks"
                v-model="codeMaster.remarks"
                :rows="2"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-text
                :width="8"
                :editable="editable"
                :maxlength="30"
                ui="bootstrap"
                label="추가속성1"
                name="attr1"
                v-model="codeMaster.attr1"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-text
                :width="8"
                :editable="editable"
                :maxlength="30"
                ui="bootstrap"
                label="추가속성2"
                name="attr2"
                v-model="codeMaster.attr2"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-text
                :width="8"
                :editable="editable"
                :maxlength="30"
                ui="bootstrap"
                label="추가속성3"
                name="attr3"
                v-model="codeMaster.attr3"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-number
                :width="8"
                :editable="editable"
                :maxlength="5"
                :hasSeperator="false"
                ui="bootstrap"
                label="정렬순서"
                name="sortOrder"
                v-model="codeMaster.sortOrder"
              />
            </b-col>
          </b-row>
          <div class="float-right mt-3">
            <y-btn
              v-if="editable"
              title="초기화"
              @btnClicked="btnClearClickedCallback"
            />
            <y-btn
              v-if="editable && createMode"
              :action-url="insertUrl"
              :param="codeMaster"
              :is-submit="isCreateSubmit"
              title="신규등록"
              color="orange"
              action-type="post"
              beforeSubmit="beforeCreateSubmit"
              @beforeCreateSubmit="beforeCreateSubmit"
              @btnClicked="btnCreateClickedCallback"
              @btnClickedErrorCallback="btnClickedErrorCallback"
            />
            <y-btn
              v-if="editable && !createMode && updateMode"
              :action-url="editUrl"
              :param="codeMaster"
              :is-submit="isUpdateSubmit"
              title="수정"
              color="orange"
              action-type="put"
              beforeSubmit="beforeUpdateSubmit"
              @beforeUpdateSubmit="beforeUpdateSubmit"
              @btnClicked="btnUpdateClickedCallback"
              @btnClickedErrorCallback="btnClickedErrorCallback"
            />
          </div>
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
  name: 'y-code-master',
  props: {},
  data() {
    return {
      codeMaster: {
        codeDomainCd: 'SAF',
        codeDomainNm: '',
        codeGroupCd: null,
        codeGroupNm: '',
        code: '',
        codeNm: '',
        remarks: '',
        sortOrder: null,
        useYn: 'Y',
        attr1: '',
        attr2: '',
        attr3: '',
        createUserId: '',
        createUserNm: '',
        createDt: '',
        updateUserId: '',
        updateUserNm: '',
        updateDt: '',
      },
      codeGroup: {
        codeGroupCd: '',
        codeLength: 5,
      },
      searchParam: {
        codeDomainCd: '',
        codeGroupCd: '',
        codeNm: '',
        // forSystemYn: 'Y',
      },
      searchArea: {
        title: '검색박스숨기기',
        show: true,
      },
      gridOptions: {
        header: [],
        data: [],
        height: '250',
      },
      editable: false,
      createMode: true,
      updateMode: false,
      isCreateSubmit: false,
      isUpdateSubmit: false,

      totalCodeList: [],
      searchCodeGroupCdItems: [],
      detailCodeGroupCdItems: [],
      searchCodeDomainCdItems: [],

      insertUrl: '',
      editUrl: '',
      searchUrl: '',
      detailUrl: '',
    };
  },
  watch: {
    'searchParam.codeDomainCd': function (newValue, oldValue) {
      this.getCodeGroupCdItems();
    },
  },
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    window.addEventListener('resize', this.setGridSize);
  },
  beforeDestory() {
    window.removeEventListener('resize', this.setGridSize);
  },
  methods: {
    init() {
      // 선택항목 설정
      // setTimeout(() => {
      //   this.getCodeGroupCdItems();
      // }, 200);

      // 그리드 헤더 설정
      this.gridOptions.header = [
        { text: '코드도메인', name: 'codeDomainNm', width: '150px' },
        { text: '코드그룹', name: 'codeGroupNm', width: '200px' },
        { text: '코드', name: 'code', width: '100px', align: 'center' },
        { text: '코드명', name: 'codeNm', width: '250px' },
        { text: '비고', name: 'codeNm', width: '250px' },
        { text: '사용여부', name: 'useYnNm', width: '100px', align: 'center' },
        {
          text: '정렬순서',
          name: 'sortOrder',
          width: '100px',
          align: 'center',
        },
        { text: '등록일', name: 'createDt', width: '110px', align: 'center' },
        {
          text: '등록자',
          name: 'createUserNm',
          width: '100px',
          align: 'center',
        },
        { text: '수정일', name: 'updateDt', width: '110px', align: 'center' },
        {
          text: '수정자',
          name: 'updateUserNm',
          width: '100px',
          align: 'center',
        },
      ];

      this.insertUrl = transactionConfig.manage.codeMaster.insert.url;
      this.editUrl = transactionConfig.manage.codeMaster.edit.url;
      this.searchUrl = selectConfig.codeMaster.allList.url;
      this.detailUrl = selectConfig.codeMaster.get.url;

      this.editable = this.$route.meta.editable;

      this.getCodeDomainCdItems();
      this.getCodeGroupCdItems();
      this.getTotalCodeList();
      this.getList();
      this.setGridSize();
    },
    getCodeDomainCdItems() {
      this.$http.url = selectConfig.codeDomain.list.url;
      this.$http.type = 'get';
      this.$http.request(
        (_result) => {
          var searchItems = this.$_.clone(_result.data);
          searchItems.splice(0, 0, {
            codeDomainCd: null,
            codeDomainNm: '전체',
          });

          this.searchCodeDomainCdItems = searchItems;
        },
        (_error) => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            '작업 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.'
          );
        }
      );
    },
    getTotalCodeList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'get';
      this.$http.request(
        (_result) => {
          this.totalCodeList = _result.data;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'get';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          this.gridOptions.data = _result.data;
        },
        (_error) => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            '작업 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.'
          );
        }
      );
    },
    getDetail(data) {
      this.$http.url = this.$format(
        this.detailUrl,
        data.codeGroupCd,
        data.code
      );
      this.$http.type = 'get';
      this.$http.request(
        (_result) => {
          this.createMode = false;
          this.updateMode = true;
          this.codeMaster = _result.data;
        },
        (_error) => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            '작업 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.'
          );
        }
      );
    },

    getCodeGroupCdItems() {
      this.$http.url = selectConfig.codeGroup.list.url;
      this.$http.type = 'get';
      this.$http.param = {
        codeDomainCd: this.searchParam.codeDomainCd,
      };
      this.$http.request(
        (_result) => {
          var searchItems = this.$_.clone(_result.data);
          var detailItems = this.$_.clone(_result.data);
          searchItems.splice(0, 0, { codeGroupCd: null, codeGroupNm: '전체' });
          this.searchCodeGroupCdItems = searchItems;

          if (
            this.searchParam.codeGroupCd &&
            this.$_.indexOf(
              this.$_.map(this.searchCodeGroupCdItems, 'codeGroupCd'),
              this.searchParam.codeGroupCd
            ) === -1
          ) {
            this.searchParam.codeGroupCd = null;
          }

          if (!this.searchParam.codeDomainCd) {
            detailItems.splice(0, 0, {
              codeGroupCd: null,
              codeGroupNm: '선택하세요',
            });
            this.detailCodeGroupCdItems = detailItems;
          }
        },
        (_error) => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            '작업 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.'
          );
        }
      );
    },

    setGridSize() {
      window.getApp.$emit('LOADING_SHOW');
      setTimeout(() => {
        this.gridOptions.height =
          window.innerHeight - this.$refs.searchBox.clientHeight - 500;
        window.getApp.$emit('LOADING_HIDE');
      }, 600);
    },

    beforeCreateSubmit() {
      var test = {
        codeGroupCd: this.codeMaster.codeGroupCd,
        code: this.codeMaster.code,
      };
      if (this.$_.find(this.totalCodeList, test) != null) {
        window.getApp.$emit('ALERT', {
          title: '안내',
          message: '이미 같은 이름의 코드가 존재합니다.',
          type: 'warning',
        });
        return;
      }

      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: '확인',
              message: '코드마스터 정보를 저장 하시겠습니까?',
              type: 'info',
              confirmCallback: () => {
                this.codeMaster.createUserId = this.$store.getters.token;
                this.isCreateSubmit = true;
              },
            });
          }
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            '유효성 검사 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.'
          );
        });
    },
    beforeUpdateSubmit() {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: '확인',
              message: '코드마스터 정보를 수정하시겠습니까?',
              type: 'info',
              confirmCallback: () => {
                this.codeMaster.updateUserId = this.$store.getters.token;
                this.isUpdateSubmit = true;
              },
            });
          }
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            '유효성 검사 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.'
          );
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

    btnSearchClicked() {
      this.getList();
    },
    btnSearchVisibleClicked() {
      this.searchArea.show = !this.searchArea.show;
      if (this.searchArea.show) this.searchArea.title = '검색박스숨기기';
      else this.searchArea.title = '검색박스보이기';

      window.getApp.$emit('LOADING_PASS_COUNT', 1);
      this.setGridSize();
    },
    btnClearClickedCallback(_result) {
      this.createMode = true;
      this.updateMode = false;
      this.codeMaster.codeDomainCd = '';
      this.codeMaster.codeDomainNm = '';
      this.codeMaster.codeGroupCd = '';
      this.codeMaster.codeGroupNm = '';
      this.codeMaster.code = '';
      this.codeMaster.codeNm = '';
      this.codeMaster.remarks = '';
      this.codeMaster.sortOrder = null;
      this.codeMaster.useYn = 'Y';
      this.codeMaster.attr1 = '';
      this.codeMaster.attr2 = '';
      this.codeMaster.attr3 = '';
      this.codeMaster.createUserId = '';
      this.codeMaster.createUserNm = '';
      this.codeMaster.createDt = '';
      this.codeMaster.updateUserId = '';
      this.codeMaster.updateUserNm = '';
      this.codeMaster.updateDt = '';
    },
    btnCreateClickedCallback(_result) {
      this.isCreateSubmit = false;
      this.createMode = false;
      this.updateMode = true;
      this.getTotalCodeList();
      this.getList();
      window.getApp.$emit('ALERT', {
        title: '안내',
        message: '코드마스터 정보를 정상적으로 저장하였습니다.',
        type: 'success',
      });
    },
    btnUpdateClickedCallback(_result) {
      this.isUpdateSubmit = false;
      this.getTotalCodeList();
      this.getList();
      window.getApp.$emit('ALERT', {
        title: '안내',
        message: '코드마스터 정보를 정상적으로 수정하였습니다.',
        type: 'success',
      });
    },
    btnClickedErrorCallback(_result) {
      this.isCreateSubmit = false;
      this.isUpdateSubmit = false;
      window.getApp.$emit(
        'APP_REQUEST_ERROR',
        '작업 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.'
      );
    },
  },
};
</script>
