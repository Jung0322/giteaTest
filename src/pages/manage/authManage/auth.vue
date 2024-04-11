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
      <b-row>
        <!-- TODO : 아래에 본문을 넣으세요 -->
        <b-col sm="12">
          <el-tabs type="border-card" v-model="tabIndex" @tab-click="tabClick">
            <el-tab-pane v-for="(item, i) in tabItems" :key="i">
              <span slot="label" class="tabsLabel">{{ item.title }}</span>
            </el-tab-pane>
            <keep-alive>
              <component
                :is="component"
                v-if="component"
                :paneName="paneName"
                :tabIndex="tabIndex"
              />
            </keep-alive>
          </el-tabs>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {
  /** attributes: name, components, props, data **/
  name: '', // 반드시 입력하세요(안 하면 warning 발생). 네이밍 룰은 현재 vue component의 파일명의 단어를 "-"로 구분(예:exam-data)하여 입력하시면 됩니다. 입력후 이 주석은 지워주세요.
  props: {},
  // TODO: 화살표 함수(=>)는 data에 사용하지 말 것
  //    data: () => { return { a: this.myProp }}) 화살표 함수가 부모 컨텍스트를 바인딩하기 때문에 this는 예상과 달리 Vue 인스턴스가 아니기 때문에 this.myProp는 undefined로 나옵니다.
  //    참고url: https://kr.vuejs.org/v2/api/index.html#data
  data() {
    return {
      steps: [],
      active: 0,
      component: null,
      paneName: '',
      tabIndex: 0,
      tabItems: [],
    };
  },
  watch: {
    tabIndex() {
      this.loadComponent();
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
  mounted() {
    this.loadComponent();
  },
  beforeDestory() {
    this.init();
  },
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      this.tabItems = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000718'), // 권한그룹설정
          url: './authGrp',
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000004527'), // 그룹별 부서 및 사용자 설정
          url: './userAuthMenu',
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001473'), // 사용자별 권한그룹 설정
          url: './authUser',
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001315'), // 부서별 권한그룹 설정
          url: './authDept',
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000004528'), // 사용자그룹별 메뉴설정
          url: './authGrpMenu',
        }
      ]
    },
    loadComponent() {
      var path = this.tabItems[this.$_.parseInt(this.tabIndex)].url;
      this.component = () => import(`${path}`);
    },
    tabClick(tab) {
      var nowDate = new Date();
      this.paneName = tab.paneName + nowDate.valueOf().toString();
      this.loadComponent();
    },
  },
};
</script>
