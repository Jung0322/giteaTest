<!--
  목적 : (반드시 기입하세요) 컴포넌트
  작성자 : (이니셜로 반드시 입력하세요)
  Detail :
  *
  examples:
  *
  -->
<template>
  <div id>
    <b-container fluid>
      <y-search-box :gridOptions="gridOptions" @enter="btnSearchClicked">
        <b-row slot="search">
          <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
            <!-- 사용자그룹명 -->
            <y-text
              :width="8"
              ui="bootstrap"
              label="L0000001470"
              name="keyword"
              v-model="searchParam.keyword"
            />
          </b-col>
          <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
            <!-- 사용여부 -->
            <y-select
              :width="8"
              :comboItems="comboUseYnItems"
              itemText="codeNm"
              itemValue="code"
              ui="bootstrap"
              type="search"
              label="L0000001439"
              name="useYn"
              v-model="searchParam.useYn"
            ></y-select>
          </b-col>
        </b-row>
      </y-search-box>
      <!-- 검색 -->
      <b-row class="grid-height grid-box">
        <b-col sm="12" class="h100p">
          <y-auigrid
            ref="yAuiGrid"
            :name="gridOptions.name"
            :headers="gridOptions.header"
            :btns="gridOptions.btns"
            :height="gridOptions.height"
            :label="this.$comm.getLangSpecInfoLabel('L0000001469')"
            :useExcelExport="false"
            :enableSorting="true"
            :showGridSetSave="true"
            @selectedRow="selectedRow"
            @btnSearchClickedCallback="btnSearchClickedCallback"
          />
        </b-col>
      </b-row>

      <b-row class="mt-3" ref="detailBox">
        <b-col sm="12">
          <b-row>
            <b-col sm="12">
              <!-- 사용자그룹 관리 -->
              <y-label
                label="L0000001468"
                icon="user-edit"
                color-class="cutstom-title-color"
              />
            </b-col>
          </b-row>
          <b-card>
            <b-row>
              <!-- 권한 정보 영역 -->
              <b-col sm="12">
                <b-row>
                  <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
                    <b-row>
                      <b-col sm="4">
                        <!-- 사용자그룹 ID -->
                        <y-label label="L0000001467"></y-label>
                      </b-col>
                      <b-col sm="8">
                        <y-label
                          :label="String(authGrp.authGrpNo)"
                          :fieldable="true"
                        />
                      </b-col>
                    </b-row>
                  </b-col>
                  <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
                    <!-- 사용자그룹명 -->
                    <y-text
                      :width="8"
                      :required="true"
                      ui="bootstrap"
                      :maxlength="30"
                      label="L0000001470"
                      name="authGrpNm"
                      v-model="authGrp.authGrpNm"
                      v-validate="'required'"
                      :state="validateState('authGrpNm')"
                    ></y-text>
                  </b-col>
                  <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
                    <!-- 사용여부 -->
                    <y-switch
                      :width="8"
                      true-value="Y"
                      false-value="N"
                      ui="bootstrap"
                      label="L0000001439"
                      name="useYn"
                      selectText="L0000001440"
                      unselectText="L0000001063"
                      v-model="authGrp.useYn"
                    ></y-switch>
                  </b-col>
                  <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
                    <!-- 비고 -->
                    <y-textarea
                      :width="10"
                      :maxlength="150"
                      ui="bootstrap"
                      label="L0000001360"
                      name="remarks"
                      v-model="authGrp.remarks"
                    ></y-textarea>
                  </b-col>
                </b-row>
              </b-col>
              <!-- /권한 정보 영역 -->
            </b-row>
            <b-row>
              <b-col sm="12">
                <div class="float-right mt-3">
                  <!-- 초기화 -->
                  <y-btn
                    title="L0000002859"
                    @btnClicked="btnClearClickedCallback"
                  />
                  <!-- 신규등록 -->
                  <y-btn
                    :action-url="insertUrl"
                    :param="authGrp"
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
                    v-if="selectedAuthGrpNm !== ''"
                    :action-url="editUrl"
                    :param="authGrp"
                    :is-submit="isEdit"
                    title="L0000002474"
                    color="orange"
                    action-type="PUT"
                    beforeSubmit="beforeEdit"
                    @beforeEdit="beforeEdit"
                    @btnClicked="btnEditClickedCallback"
                    @btnClickedErrorCallback="btnClickedErrorCallback"
                  />
                </div>
              </b-col>
            </b-row>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';

export default {
  /** attributes: name, components, props, data **/
  name: 'auth-grp',
  components: {},
  props: {
    paneName: {
      type: String,
      default: '',
    },
  },
  // TODO: 화살표 함수(=>)는 data에 사용하지 말 것
  //    data: () => { return { a: this.myProp }}) 화살표 함수가 부모 컨텍스트를 바인딩하기 때문에 this는 예상과 달리 Vue 인스턴스가 아니기 때문에 this.myProp는 undefined로 나옵니다.
  //    참고url: https://kr.vuejs.org/v2/api/index.html#data
  data() {
    return {
      authGrp: {
        authGrpNo: null,
        authGrpNm: null,
        remarks: null,
        useYn: 'Y',
        createUserId: null,
        updateUserId: null,
      },
      gridOptions: {
        name: 'authGrp',
        header: [],
        data: [],
        btns: [],
        height: '400',
      },
      searchUrl: '',
      searchParam: {
        keyword: '',
        useYn: '',
      },
      selectedAuthGrpNm: '',
      comboUseYnItems: [], // 사용여부
      isInsert: false,
      countUrl: '',
      insertUrl: '',
      isEdit: false,
      editUrl: '',
      upMenuLvl: null, // 버튼을 submit 할 것인지 판단하는 변수로써 버튼의 개수만큼 필요합니다.
      YAuiGrid: null,
    };
  },
  watch: {
    // 해당 tab 들어올 때마다 그리드 사이즈 조정
    paneName() {
      this.getAuthGrps();
    },
  },
  /** Vue lifecycle: created, mounted, destroyed, etc **/
  beforeCreate() {},
  created() {},
  beforeMount() {
    // TODO : data를 초기화 시켜줌(검색 조건 유지가 필요할 때는 삭제할 것)
    // 이유 : vue.js는 SPA기반으로 동작하기 때문에 페이지를 이동하더라도 기존 입력된 정보가 그대로 남아 있는 문제가 있음
    Object.assign(this.$data, this.$options.data());
    this.init();
    window.addEventListener('resize', this.resizeGrid);
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.resizeGrid();
    this.getAuthGrps();
  },
  beforeDestroy() {},
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }

      this.insertUrl = transactionConfig.authGrp.insert.url;
      this.searchUrl = selectConfig.authGrp.list.url;
      this.countUrl = selectConfig.authGrp.count.url;

      this.getAuthGrps();

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

      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001471'), // 사용자그룹번호
          dataField: 'authGrpNo',
          width: '25%',
          style: 'right-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001470'),
          dataField: 'authGrpNm',
          width: '25%',
        }, // 사용자그룹명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001439'),
          dataField: 'useYnNm',
          width: '825%0',
          style: 'center-align',
        }, // 사용여부
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001360'),
          dataField: 'remarks',
          width: '25%',
        }, // 비고
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'btnSearchClickedCallback',
        },
      ];
    },
    getAuthGrps() {
      this.$http.url = this.searchUrl;
      this.$http.param = this.searchParam;
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          // this.gridOptions.data = _result.data;
          this.YAuiGrid.setGridData(this.$_.clone(_result.data));
          this.$comm.pushCookie(this.searchParam);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /** Button Event **/
    // 검색
    btnSearchClickedCallback(result) {
      this.getAuthGrps();
    },
    checkValidation(flag) {
      var countAuthGrp = 0;

      this.$http.url = this.countUrl;
      this.$http.param = this.authGrp;
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          countAuthGrp = _result.data;

          if (
            countAuthGrp > 0 &&
            (flag === 'insert' ||
              (this.selectedAuthGrpNm !== this.authGrp.authGrpNm &&
                flag === 'edit'))
          ) {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395', // 안내
              message: 'M0000000527', // 이미 존재하는 사용자그룹입니다.
              type: 'warning',
            });
            return;
          }

          this.$validator
            .validateAll()
            .then((_result) => {
              if (_result) {
                window.getApp.$emit('CONFIRM', {
                  title: 'L0000003321', // 확인
                  message:
                    flag === 'insert'
                      ? 'M0000000105' // 등록하시겠습니까?
                      : 'M0000000011', // 저장하시겠습니까?
                  type: 'info',
                  // 확인 callback 함수
                  confirmCallback: () => {
                    if (flag === 'insert') {
                      this.authGrp.authGrpNo = null;
                      this.authGrp.createUserId = this.$store.getters.token;
                      this.isInsert = true;
                    } else {
                      this.authGrp.updateUserId = this.$store.getters.token;
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
                  title: 'L0000003395', // 안내
                  message: 'M0000000005', // 필수입력값을 입력해주세요
                  type: 'warning',
                });
              }
            })
            .catch(() => {
              if (flag === 'insert') this.isInsert = false;
              else this.isEdit = false;
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
    beforeInsert() {
      this.checkValidation('insert');
    },
    btnSearchClicked() {
      this.getAuthGrps();
    },
    // 초기화
    btnClearClickedCallback() {
      Object.assign(this.$data.authGrp, this.$options.data().authGrp);
      this.$validator.reset();
    },
    /**
     * 저장 버튼 처리용 샘플함수
     */
    btnInsertClickedCallback(_result) {
      this.isInsert = false; // 반드시 isSubmit을 false로 초기화 하세요. 그렇지 않으면 버튼을 다시 클릭해도 동작하지 않습니다.
      this.authGrp.authGrpNo = _result.data;
      this.selectedAuthGrpNm = this.authGrp.authGrpNm;
      window.getApp.$emit('APP_REQUEST_SUCCESS', 'M0000001038'); // 정상적으로 저장되었습니다
      this.getAuthGrps();
    },
    /**
     * 버튼 에러 처리용 공통함수
     */
    btnClickedErrorCallback(_result) {
      this.isInsert = false;
      this.isEdit = false;
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    btnEditClickedCallback() {
      this.isEdit = false;
      window.getApp.$emit('APP_REQUEST_SUCCESS', 'M0000001038'); // 정상적으로 저장되었습니다
      this.getAuthGrps();
    },
    beforeEdit() {
      if (!this.authGrp.authGrpNo) {
        window.getApp.$emit(
          'APP_VALID_ERROR',
          'M0000001064' // 수정할 권한을 먼저 선택해주세요
        );
        return;
      }
      this.editUrl = this.$format(
        transactionConfig.authGrp.edit.url,
        this.authGrp.authGrpNo
      );
      this.checkValidation('edit');
      this.isEdit = this.isEdit && this.authGrp.authGrpNo ? true : false;
    },
    selectedRow(_row) {
      this.authGrp = this.$_.clone(_row);
      this.selectedAuthGrpNm = this.$_.clone(_row.authGrpNm);
    },
    resizeGrid() {
      let _height = window.innerHeight - 335;
      if (window.innerHeight < 500) {
        _height = 250;
      }

      this.YAuiGrid.resize(null, _height);
    },
  },
};
</script>
