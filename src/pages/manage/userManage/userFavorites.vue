<!--
  목적 : (반드시 기입하세요) 컴포넌트
  작성자 : (이니셜로 반드시 입력하세요)
  Detail :
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="btnSearchClicked">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-select
            :width="8"
            :comboItems="comboTaskItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="최상위 메뉴명"
            name="taskGrpCdSearch"
            v-model="searchParam.taskGrpCd"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-text
            :width="8"
            ui="bootstrap"
            label="메뉴명"
            name="menuNmSearch"
            v-model="searchParam.menuNm"
          />
        </b-col>
      </b-row>
    </y-search-box>
    <!-- 검색 -->
    <!-- <b-row ref="searchBox">
      <b-col sm="12">
        <b-card header-class="default-card" body-class="default-body-card" class="py-0">
          <div slot="header">
            <y-label label="검색" />
            <div class="float-right">
              <y-btn :title="searchArea.title" color="green" @btnClicked="btnSearchVisibleClicked" />
              
            </div>
          </div>
          <b-row v-if="searchArea.show">
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-select
                :width="8"
                :comboItems="comboTaskItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="최상위 메뉴명"
                name="taskGrpCdSearch"
                v-model="searchParam.taskGrpCd"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-text
                :width="8"
                ui="bootstrap"
                label="메뉴명"
                name="menuNmSearch"
                v-model="searchParam.menuNm"
              />
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>-->

    <!-- 검색 결과 테이블 -->
    <b-row class="mt-3">
      <b-col sm="12" class="mt-3">
        <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
            <y-btn
              title="삭제"
              color="red"
              @btnClicked="btnDeleteClickedCallback"
            />
            <y-btn title="L0000000881" @btnClicked="btnClosePopup" />
            <y-btn title="검색" color="green" @btnClicked="btnSearchClicked" />
          </div>
          <y-data-table
            :headers="gridOptions.header"
            :items="menuTreeDataTable"
            :height="gridOptions.height"
            @tableLinkClicked="tableLinkClicked"
            v-model="seletedValues"
          >
            <el-table-column
              type="selection"
              slot="selection"
              align="center"
              width="55"
            ></el-table-column>
          </y-data-table>
        </b-col>
      </b-col>
    </b-row>

    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import YTree from '@/components/YTree';
import arrayToTree from 'array-to-tree';
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
import YTreeDataTable from '@/components/YTreeDataTable';

export default {
  /** attributes: name, components, props, data **/
  name: 'menu-manage', // 반드시 입력하세요(안 하면 warning 발생). 네이밍 룰은 현재 vue component의 파일명의 단어를 "-"로 구분(예:exam-data)하여 입력하시면 됩니다. 입력후 이 주석은 지워주세요.
  components: {
    'y-tree': YTree,
    YTreeDataTable,
  },
  props: {},
  // TODO: 화살표 함수(=>)는 data에 사용하지 말 것
  //    data: () => { return { a: this.myProp }}) 화살표 함수가 부모 컨텍스트를 바인딩하기 때문에 this는 예상과 달리 Vue 인스턴스가 아니기 때문에 this.myProp는 undefined로 나옵니다.
  //    참고url: https://kr.vuejs.org/v2/api/index.html#data
  data() {
    return {
      menuTree: [],
      menuTreeDataTable: [],
      defaultExpandAll: [],
      menu: {
        menuId: '',
        menuNm: '',
        taskGrpCd: null,
        upMenuId: '',
        upMenuNm: '',
        menuLvl: null,
        frontEndUrl: '',
        color: '',
        icon: '',
        sortOrder: null,
        useYn: 'Y',
        popoverVisible: false,
        changeUpMenu: false,
        createUserId: '',
        updateUserId: '',
        expendAllYn: 'Y',
      },
      isGreatMenu: true,
      setUpMenu: '',
      collectMenuLevel: 0,
      collectTaskGrpCd: '',
      checkChild: {
        upMenuId: '',
        hasChild: false,
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
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '90%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      searchUrl: '',
      searchParam: {
        popoverVisible: false,
        taskGrpCd: '',
        menuNm: '',
        upMenuNm: '',
        upMenuId: '',
        userId: '',
      },
      comboTaskItems: [],
      isInsert: false,
      insertUrl: '',
      isEdit: false,
      editUrl: '',
      editable: false,
      updateMode: false,
      searchAuthUrl: '',
      upMenuLvl: null, // 버튼을 submit 할 것인지 판단하는 변수로써 버튼의 개수만큼 필요합니다.
      expendAllYn: 'Y',
      expandAll: false,
      seletedValues: [],
    };
  },
  watch: {
    'menu.menuLvl'() {
      // 메뉴 레벨은 빈칸일 수 없음(default 1)
      if (!this.menu.menuLvl) this.menu.menuLvl = 1;
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
  },
  mounted() {},
  beforeDestroy() {},
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      // 검색 url
      this.searchUrl = selectConfig.manage.user.favorites.url;

      this.editable = this.$route.meta.editable;

      this.searchParam.userId = this.$store.getters.token;
      this.getComboItems('TASK_GRP');
      this.getMenuTreeDatatableBases();
      this.getMenuTreeBases();
      // this.setGridSize();

      this.gridOptions.header = [
        { text: '메뉴명', name: 'menuNm', width: '160px', url: 'true' },
        { text: '메뉴코드', name: 'menuId', width: '100px', align: 'center' },
        { text: '메뉴레벨', name: 'menuLvl', width: '100px', align: 'center' },
        {
          text: '정렬순서',
          name: 'sortOrder',
          width: '100px',
          align: 'center',
        },
        { text: 'FrontEnd Url', name: 'frontEndUrl', width: '250px' },
        { text: '읽기권한', name: 'readAuth', width: '160px' },
        { text: '쓰기권한', name: 'writeAuth', width: '160px' },
        { text: '사용여부', name: 'useYnNm', width: '100px' },
      ];
    },
    /** /초기화 관련 함수 **/

    /**
     *  Call API service
     */
    /**
     * 메뉴 tree 기초 정보 조회
     */
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
    /**
     * 메뉴 tree 기초 정보 조회
     */
    getMenuTreeBases() {
      this.$http.url = selectConfig.menuTreeBases.list.url;
      this.$http.param = null;
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
    /** /Call API service **/

    /** Component Events, Callbacks (버튼 제외) **/
    /**
     * 등록전 유효성 검사
     */
    beforeInsert() {
      this.checkValidation('insert');
    },

    /** /Component, Callbacks (버튼 제외) **/

    /** Button Event **/
    /**
     * 검색 버튼 클릭
     */
    btnSearchClicked() {
      this.getMenuTreeDatatableBases();
    },
    // btnSearchVisibleClicked() {
    //   this.searchArea.show = !this.searchArea.show;
    //   if (this.searchArea.show) this.searchArea.title = '검색박스숨기기';
    //   else this.searchArea.title = '검색박스보이기';

    //   window.getApp.$emit('LOADING_PASS_COUNT', 1);
    // },
    /**
     * 버튼 에러 처리용 공통함수
     */
    btnClickedErrorCallback(_result) {
      this.updateMode = false;
      this.isInsert = false; // 반드시 isSubmit을 false로 초기화 하세요. 그렇지 않으면 버튼을 다시 클릭해도 동작하지 않습니다.
      this.isEdit = false;
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    removeParentNode() {
      this.menu.upMenuNm = null;
      this.menu.upMenuId = null;
      this.upMenuLvl = null;
      this.setUpMenu = '';
    },
    searchNodeClick(_node) {
      this.searchParam.upMenuNm = _node.menuNm;
      this.searchParam.upMenuId = _node.menuId;
      this.searchParam.popoverVisible = false;
    },
    removeSearchNode() {
      this.searchParam.upMenuNm = null;
      this.searchParam.upMenuId = null;
    },
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
          this.comboTaskItems.unshift({ code: null, codeNm: '전체' });
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },

    /**
     * 해당페이지로 이동
     */
    tableLinkClicked(header, data) {
      this.$emit('closePopup', data);
    },
    /**
     * 삭제
     */
    btnDeleteClickedCallback() {
      this.seletedValues.forEach((item) => {
        item.userId = this.$store.getters.token;
      });
      this.$http.url = transactionConfig.user.favoritesDelete.url;
      this.$http.param = this.seletedValues;
      this.$http.type = 'PUT';
      this.$http.request(
        (_result) => {
          this.getMenuTreeDatatableBases();
          window.getApp.$emit('ALERT', {
            title: '안내',
            message: '삭제되었습니다.',
            type: 'success',
          });
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    btnClosePopup() {
      this.$emit('closePopup');
    },
    closePopupUsage(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getMenuTreeDatatableBases();
    },
    /** /기타 function **/
  },
};
</script>
<style scoped>
#menuQ {
  padding: 0px;
  font-size: 25px !important;
  border: 0px !important;
  vertical-align: sub;
}
/* #menuQ .el-icon-question {
  height: 26px !important;
} */
</style>
