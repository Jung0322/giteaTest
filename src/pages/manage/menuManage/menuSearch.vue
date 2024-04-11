<!--
  목적 : (반드시 기입하세요) 컴포넌트
  작성자 : (이니셜로 반드시 입력하세요)
  Detail :
  *
  examples:
  *
  -->
<template>
  <div id="">
    <b-container fluid>
      <!-- 검색 -->
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
                  v-if="editable"
                  title="검색"
                  color="green"
                  @btnClicked="btnSearchClicked"
                />
              </div>
            </div>
            <b-row v-if="searchArea.show">
              <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
                <y-select
                  :width="8"
                  :comboItems="comboTaskItems"
                  itemText="codeNm"
                  itemValue="code"
                  ui="bootstrap"
                  label="업무그룹"
                  name="taskGrpCd"
                  v-model="searchParam.taskGrpCd"
                />
              </b-col>
              <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
                <y-text
                  :width="8"
                  ui="bootstrap"
                  label="메뉴명"
                  name="menuNm"
                  v-model="searchParam.menuNm"
                />
              </b-col>
              <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
                <y-text
                  label="상위메뉴"
                  ui="bootstrap"
                  placeholder="상위메뉴를 선택하세요."
                  v-model="searchParam.upMenuNm"
                  :width="8"
                  :editable="false"
                >
                  <el-popover
                    slot="customAppendIcon"
                    placement="right"
                    width="400"
                    trigger="manual"
                    v-model="searchParam.popoverVisible"
                  >
                    <y-tree
                      node-key="menuId"
                      label="menuNm"
                      :editable="false"
                      :treeData="menuTree"
                      @nodeClick="searchNodeClick"
                    />
                    <el-button
                      icon="el-icon-search"
                      circle
                      slot="reference"
                      size="mini"
                      @click="
                        searchParam.popoverVisible = !searchParam.popoverVisible
                      "
                    />
                  </el-popover>
                  <div style="text-align: right; margin: 0">
                    <el-button
                      size="mini"
                      type="text"
                      @click="searchParam.popoverVisible = false"
                      >닫기</el-button
                    >
                  </div>
                </y-text>
              </b-col>
            </b-row>
          </b-card>
        </b-col>
      </b-row>

      <!-- 검색 결과 테이블 -->
      <b-row class="mt-3">
        <b-col sm="12">
          <b-col sm="12" class="px-0">
            <div class="float-right mb-1">
              <y-btn
                :param="menusParam"
                :is-submit="isSave"
                title="추가"
                color="orange"
                @btnClicked="btnInsertClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <y-btn title="L0000000881" @btnClicked="closePopup" />
            </div>
            <y-tree-data-table
              :headers="gridOptions.header"
              :items="menuTreeDataTable"
              :height="300"
              ref="menuDataTable"
              expand-column-name="menuNm"
              data-key="menuId"
              parent-key="upMenuId"
            >
            </y-tree-data-table>
            <br />
          </b-col>
        </b-col>
      </b-row>

      <!-- <b-row>
          <b-col sm="12">
            <div class="float-right mt-3" >
              <y-btn 
                :action-url="insertUrl"
                :param="menu"
                :is-submit="isInsert"
                title="메뉴추가"
                color="orange"
                action-type="POST"
                beforeSubmit="beforeInsert"
                @beforeInsert="beforeInsert"
                @btnClicked="btnInsertClickedCallback" 
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
            </div>
          </b-col>
        </b-row> -->
    </b-container>
  </div>
</template>

<script>
import YTree from '@/components/YTree';
import arrayToTree from 'array-to-tree';
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
import YTreeDataTable from '@/components/YTreeDataTable';

export default {
  /** attributes: name, components, props, data **/
  name: 'menu-search', // 반드시 입력하세요(안 하면 warning 발생). 네이밍 룰은 현재 vue component의 파일명의 단어를 "-"로 구분(예:exam-data)하여 입력하시면 됩니다. 입력후 이 주석은 지워주세요.
  components: {
    'y-tree': YTree,
    YTreeDataTable,
  },
  props: {
    // 팝업 컴포넌트 일 경우 팝업 정보가 변경
    // isPopupOpen: {
    //   type: Boolean,
    //   default: false
    // },
  },
  // TODO: 화살표 함수(=>)는 data에 사용하지 말 것
  //    data: () => { return { a: this.myProp }}) 화살표 함수가 부모 컨텍스트를 바인딩하기 때문에 this는 예상과 달리 Vue 인스턴스가 아니기 때문에 this.myProp는 undefined로 나옵니다.
  //    참고url: https://kr.vuejs.org/v2/api/index.html#data
  data() {
    return {
      menuTreeDataTable: [],
      menuTree: [],
      menu: {
        menuId: '',
        taskGrpCd: null,
        upMenuId: '',
        upMenuNm: '',
        menuLvl: null,
        frontEndUrl: '',
        sortOrder: null,
        useYn: 'Y',
      },
      searchArea: {
        title: '검색박스숨기기',
        show: true,
      },
      gridOptions: {
        header: [],
        data: [],
        height: '300',
      },
      searchUrl: '',
      searchParam: {
        popoverVisible: false,
      },
      menusParam: {}, // 권한 그룹별 메뉴 model
      comboTaskItems: [],
      isInsert: false,
      insertUrl: '',
      isEdit: false,
      editUrl: '',
      editable: true,
      upMenuLvl: null,
      isSave: false,
    };
  },
  // watch: {
  //   isPopupOpen () {
  //     // 팝업이 활성화 되면 값 초기화
  //     if (this.isPopupOpen) {
  //       Object.assign(this.$data, this.$options.data());
  //       this.init();
  //     }
  //   }
  // },
  /** Vue lifecycle: created, mounted, destroyed, etc **/
  beforeCreate() {},
  created() {},
  beforeMount() {
    // TODO : data를 초기화 시켜줌(검색 조건 유지가 필요할 때는 삭제할 것)
    // 이유 : vue.js는 SPA기반으로 동작하기 때문에 페이지를 이동하더라도 기존 입력된 정보가 그대로 남아 있는 문제가 있음
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {},
  beforeDestory() {
    this.init();
  },
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      this.searchUrl = selectConfig.menuTreeBases.list.url;
      this.getComboItems('TASK_GRP');
      this.getMenuTreeDatatableBases();
      this.getMenuTreeBases();
      this.setGridSize();

      this.gridOptions.header = [
        { text: '메뉴명', name: 'menuNm', width: '210px' },
        { text: '메뉴코드', name: 'menuId', width: '100px', align: 'center' },
        {
          text: '접근권한',
          name: 'accessYn',
          width: '120px',
          align: 'center',
          type: 'checkbox',
          relateColumn: 'writeYn',
        },
        {
          text: '쓰기권한',
          name: 'writeYn',
          width: '100px',
          align: 'center',
          type: 'checkbox',
        },
      ];
    },
    setGridSize() {
      window.getApp.$emit('LOADING_SHOW');
      setTimeout(() => {
        this.height =
          window.innerHeight - this.$refs.searchBox.clientHeight - 250;
        window.getApp.$emit('LOADING_HIDE');
      }, 600);
    },
    /** /초기화 관련 함수 **/

    /**
     *  Call API service
     */
    /**
     * 메뉴 tree 기초 정보 조회
     */
    getMenuTreeBases() {
      this.$http.url = selectConfig.menuTreeBases.list.url;
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.menuTree = this.convertTree(_result.data);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getMenuTreeDatatableBases() {
      this.$http.url = this.searchUrl;
      this.$http.param = this.searchParam;
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.menuTreeDataTable = this.convertTree(_result.data);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /** /Call API service **/

    /** validation checking(필요없으면 지워주세요) **/
    checkValidation(_type) {
      var type = null;
      if (_type === 'insert') type = this.isInsert;

      this.$validator
        .validateAll()
        .then((_result) => {
          this.isInsert = _result;
          // TODO : 전역 성공 메시지 처리
          // 이벤트는 ./event.js 파일에 선언되어 있음
          if (!this.isInsert) {
            window.getApp.emit(
              'APP_VALID_ERROR',
              '유효성 검사도중 에러가 발생하였습니다.'
            );
          }
            
        })
        .catch(() => {
          this.isInsert = false;
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
    /** /validation checking **/

    /** Component Events, Callbacks (버튼 제외) **/
    /**
     * 등록전 유효성 검사
     */
    beforeInsert() {
      // this.checkValidation('insert');
      var checkedMenus = this.$refs.menuDataTable.getCheckedItems();
      this.isInsert = checkedMenus.length > 0;
    },
    getData() {
      var checkedMenus = this.$refs.menuDataTable.getCheckedItems();
      return checkedMenus;
    },
    /** /Component, Callbacks (버튼 제외) **/

    /** Button Event **/
    closePopup(data) {
      this.$emit('closePopup', { data: data });
    },
    // 초기화
    /**
     * 저장 버튼 처리용 샘플함수
     */
    btnInsertClickedCallback(data) {
      this.menusParam = this.$refs.menuDataTable.getCheckedItems();
      this.isSave = this.menusParam.length > 0;
      this.closePopup(this.menusParam);
      // this.isInsert = false;  // 반드시 isSubmit을 false로 초기화 하세요. 그렇지 않으면 버튼을 다시 클릭해도 동작하지 않습니다.

      // window.getApp.$emit('APP_REQUEST_SUCCESS', "정상적으로 저장되었습니다.");
      // this.getMenuTreeDatatableBases();
    },
    /**
     * 버튼 에러 처리용 공통함수
     */
    btnSearchClicked() {
      this.getMenuTreeDatatableBases();
    },
    btnSearchVisibleClicked() {
      this.searchArea.show = !this.searchArea.show;
      if (this.searchArea.show) this.searchArea.title = '검색박스숨기기';
      else this.searchArea.title = '검색박스보이기';

      window.getApp.$emit('LOADING_PASS_COUNT', 1);
      this.setGridSize();
    },
    btnClickedErrorCallback(_result) {
      this.isInsert = false; // 반드시 isSubmit을 false로 초기화 하세요. 그렇지 않으면 버튼을 다시 클릭해도 동작하지 않습니다.
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    removeParentNode() {
      this.menu.upMenuNm = null;
      this.menu.upMenuId = null;
      this.upMenuLvl = null;
    },
    searchNodeClick(_node) {
      this.searchParam.upMenuNm = _node.menuNm;
      this.searchParam.upMenuId = _node.menuId;
      this.searchParam.popoverVisible = false;
    },
    removeSearchNode() {},
    /** /Button Event **/

    /** 기타 function **/
    /**
     * 메뉴 트리용 기초 정보를 Tree 메뉴로 변환
     */
    convertTree(_treeBases) {
      if (!_treeBases || _treeBases.length <= 0) return null;
      var tree = arrayToTree(_treeBases, {
        parentProperty: 'upMenuId',
        customID: 'menuId',
      });

      return tree;
    },
    /**
     * 공통 마스터 정보 조회
     */
    getComboItems(codeGroupCd) {
      this.$http.url = this.$format(
        selectConfig.codeMaster.getSelect.url,
        codeGroupCd
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.comboTaskItems = _result.data;
          this.comboTaskItems.unshift({ code: null, codeNm: '선택하세요' });
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /**
     * treenode 클릭
     */
    nodeClick(_node) {
      this.menu.upMenuNm = _node.menuNm;
      this.menu.upMenuId = _node.menuId;
      this.menu.taskGrpCd = _node.taskGrpCd;
      this.menu.frontEndUrl = _node.frontEndUrl;
      this.upMenuLvl = _node.menuLvl;
      this.menu.menuLvl = this.upMenuLvl ? Number(this.upMenuLvl) + 1 : null;
      this.menu.sortOrder = _node.hasOwnProperty('children')
        ? _node.children.length + 1
        : 1;
    },
    selectedRow() {},
    /** /기타 function **/
  },
};
</script>
