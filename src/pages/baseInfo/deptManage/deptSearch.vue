<!--
  목적 : 부서 검색
  작성자 : ksw
  Detail :
  *
  examples:
  *
  -->
<template>
  <div id>
    <b-container fluid>
      <y-search-box
        :gridOptions="gridOptions"
        @enter="getDeptTreeDatatableBases"
      >
        <b-row slot="search">
          <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
            <y-plant type="search" v-model="searchParam.plantCd" />
          </b-col>
          <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
            <!-- 부서명 -->
            <y-text
              :width="8"
              ui="bootstrap"
              label="L0000004367"
              name="menuNm"
              v-model="searchParam.deptNm"
            />
          </b-col>
          <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
            <!-- 상위부서 -->
            <y-tree-dept
              label="L0000001536"
              type="search"
              :plantCd="searchParam.plantCd"
              v-model="searchParam.pdeptCd"
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
                <y-btn title="검색" color="green" @btnClicked="getDeptTreeDatatableBases" />
              </div>
            </div>
            <b-row>
              <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
                <y-plant type="search" v-model="searchParam.plantCd" />
              </b-col>
              <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
                <y-text
                  :width="8"
                  ui="bootstrap"
                  label="부서명"
                  name="menuNm"
                  v-model="searchParam.deptNm"
                />
              </b-col>
              <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
                <y-tree-dept
                  label="상위부서"
                  type="search"
                  :plantCd="searchParam.plantCd"
                  v-model="searchParam.pdeptCd"
                />
              </b-col>
            </b-row>
          </b-card>
        </b-col>
      </b-row>-->

      <!-- 검색 결과 테이블 -->
      <b-row class="mt-3">
        <b-col sm="12">
          <b-col sm="12" class="px-0">
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 닫기 -->
              <y-btn title="L0000000881" @btnClicked="closePopup" />
            </div>
            <!-- 부서목록 -->
            <y-tree-data-table
              label="L0000001310"
              :headers="gridOptions.header"
              :items="gridOptions.data"
              :height="gridOptions.height"
              expand-column-name="deptNm"
              expand-column-width="250"
              data-key="deptCd"
              parent-key="pdeptCd"
              @rowClicked="rowClicked"
            ></y-tree-data-table>
          </b-col>
        </b-col>
      </b-row>
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
  name: 'dept-search', // 반드시 입력하세요(안 하면 warning 발생). 네이밍 룰은 현재 vue component의 파일명의 단어를 "-"로 구분(예:exam-data)하여 입력하시면 됩니다. 입력후 이 주석은 지워주세요.
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
      gridOptions: {
        header: [],
        data: [],
        height: '300',
        searchboxStatus: true, // 팝업의 검색박스는 목록의 검색박스 보이기/숨기기와 상관없이 무조건 보이도록 설정.
      },
      searchUrl: '',
      searchParam: {
        plantCd: '',
        deptNm: '',
        pdeptCd: '',
      },
      editable: false,
      component: null,
    };
  },
  /** Vue lifecycle: created, mounted, destroyed, etc **/
  beforeCreate() {},
  created() {},
  beforeMount() {
    // TODO : data를 초기화 시켜줌(검색 조건 유지가 필요할 때는 삭제할 것)
    // 이유 : vue.js는 SPA기반으로 동작하기 때문에 페이지를 이동하더라도 기존 입력된 정보가 그대로 남아 있는 문제가 있음
    Object.assign(this.$data, this.$options.data());
  },
  mounted() {
    this.init();
  },
  beforeDestory() {
    this.init();
  },
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      this.editable = this.$route.meta.editable;
      this.searchUrl = selectConfig.manage.dept.treelist.url;
      this.getDeptTreeDatatableBases();

      this.gridOptions.header = [
        {
          text: 'L0000004366',
          name: 'plantNm',
          width: '150px',
          align: 'center',
        }, // 사업장명
        {
          text: 'L0000001332',
          name: 'deptCd',
          width: '200px',
          align: 'center',
        }, // 부서코드
      ];
    },
    getDeptTreeDatatableBases() {
      this.$http.url = this.searchUrl;
      this.$http.param = this.searchParam;
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.gridOptions.data = this.convertTree(_result.data);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    btnSearchClickedCallback() {
      this.btnClearClickedCallback();
      this.getDeptTreeDatatableBases();
    },
    /**
     * 부서 트리용 기초 정보를 Tree 메뉴로 변환
     */
    convertTree(_treeBases) {
      if (!_treeBases || _treeBases.length <= 0) return null;
      var tree = arrayToTree(_treeBases, {
        parentProperty: 'pdeptCd',
        customID: 'deptCd',
      });

      return tree;
    },
    rowClicked(data) {
      this.$emit('closePopup', { success: true, dept: data });
    },
    closePopup() {
      // 부모창에 값 전달
      this.$emit('closePopup', { success: true });
    },
    /** /기타 function **/
  },
};
</script>
