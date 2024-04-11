<!--
  목적 : 부서 정보 multi 선택
  작성자 : kdh
  Detail :
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row style="height: 60%">
      <b-col sm="12">
        <div slot="buttonGroup" class="float-right mb-1">
          <!-- 전체선택 -->
          <y-btn
            title="L0000002526"
            color="green"
            @btnClicked="setCheckedAll"
          />
          <!-- 저장 -->
          <y-btn
            v-if="editable"
            title="L0000002474"
            color="orange"
            @btnClicked="select"
          />
          <!-- 닫기 -->
          <y-btn title="L0000000881" @btnClicked="closePopup" />
        </div>
      </b-col>
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <!-- <el-input placeholder="부서명을 입력하세요" v-model="filterText"></el-input> -->
          <el-tree
            class="filter-tree auth-multi"
            :data="data"
            show-checkbox
            default-expand-all
            :check-strictly="popupParam.checkStrictly"
            :filter-node-method="filterNode"
            node-key="id"
            ref="tree"
            @check="check"
          ></el-tree>
        </b-col>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
import arrayToTree from 'array-to-tree';
export default {
  /** attributes: name, components, props, data **/
  name: 'auth-multi-select', // 반드시 입력하세요(안 하면 warning 발생). 네이밍 룰은 현재 vue component의 파일명의 단어를 "-"로 구분(예:exam-data)하여 입력하시면 됩니다. 입력후 이 주석은 지워주세요.
  props: {
    popupParam: {
      type: Object,
      default: {
        checkStrictly: false,
      },
    },
  },
  // TODO: 화살표 함수(=>)는 data에 사용하지 말 것
  //    data: () => { return { a: this.myProp }}) 화살표 함수가 부모 컨텍스트를 바인딩하기 때문에 this는 예상과 달리 Vue 인스턴스가 아니기 때문에 this.myProp는 undefined로 나옵니다.
  //    참고url: https://kr.vuejs.org/v2/api/index.html#data
  data() {
    return {
      filterText: '',
      editable: false,
      searchUrl: '',
      data: [],
      checkedData: [],
      isChecked: false,
      totalData: [],
    };
  },
  watch: {
    // filterText(val) {
    //   this.$refs.tree.filter(val);
    // },
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
  beforeDestory() {
    this.init();
  },
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      this.editable = this.$route.meta.editable;

      this.searchUrl = selectConfig.authGrp.list.url;

      this.getDeptTreeDatatableBases();
    },
    getDeptTreeDatatableBases() {
      this.$http.url = this.searchUrl;
      this.$http.param = {
        searchFlag: 'all',
        useYn: 'Y',
      };
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.data = _result.data;
          this.totalData = _result.data;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    closePopup(data) {
      if (!data) {
        data = 'CLOSE';
      }
      // 부모창에 값 전달
      this.$emit('closePopup', data);
    },
    btnClickedErrorCallback(_result) {
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    /** /기타 function **/
    filterNode(value, data) {
      if (!value) return true;

      return data.label.indexOf(value) !== -1;
    },
    select() {
      if (!this.checkedData || this.checkedData.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000001066', // 저장할 권한을 선택하세요
          type: 'warning',
        });
      } else {
        this.closePopup(this.checkedData);
      }
    },
    check(a, b) {
      this.checkedData = [];
      this.$_.forEach(this.$refs.tree.getCheckedNodes(), (item) => {
        this.checkedData.splice(0, 0, item);
      });
    },
    setCheckedAll() {
      // 전체선택이 되어 있다면 전체선택을 해제 - true, 전체선택이 해제되어 있다면 전체선택 - false
      let rootNodes = !this.isChecked ? this.totalData : [];

      this.$refs.tree.setCheckedNodes(rootNodes);

      this.isChecked = !this.isChecked;
      this.checkedData.push(this.$refs.tree.getCheckedNodes());
    },
  },
};
</script>
<style scoped>
.auth-multi {
  height: 500px;
  overflow-y: scroll;
}
</style>
