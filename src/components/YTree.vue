<!--
  목적 : (반드시 기입하세요) 컴포넌트
  작성자 : (이니셜로 반드시 입력하세요)
  Detail :
  *
  examples:
  *
  -->
<template>
  <div class="custom-tree-container">
    <div class="block default-height"> 
      <y-text 
        :width="10"
        placeholder="L0000000334"
        v-if="useSearch"
        v-model="keyword"
      >
      </y-text>
      <p v-if="title">{{$comm.getLangSpecInfoLabel(title)}}</p>
      <el-tree
        ref="tree"
        :data="treeNodes"
        :node-key="itemValue"
        :label="itemText"
        :default-expand-all="defaultExpandAll"
        draggable
        highlight-current
        :allow-drop="allowDrop"
        :allow-drag="allowDrag"
        :expand-on-click-node="false"
        :filter-node-method="filterNode"
        :default-expanded-keys="currentKey"
        @node-drag-start="handleDragStart"
        @node-drag-enter="handleDragEnter"
        @node-drag-leave="handleDragLeave"
        @node-drag-over="handleDragOver"
        @node-drag-end="handleDragEnd"
        @node-drop="handleDrop"
        @node-click="nodeClick"
        >
        <span 
          class="custom-tree-node" 
          slot-scope="{ node, data }">
          <span>{{ data[label] }}</span>
          <span v-if="editable">
            <i class="el-icon-plus primary" @click="() => append(data)" />
            <i class="el-icon-delete warning" @click="() => remove(node, data)" />
          </span>
        </span>
      </el-tree>
    </div>
  </div>
</template>

<script>
let id = 1000;

export default {
  /** attributes: name, components, props, data **/
  name: 'y-tree',  // 반드시 입력하세요(안 하면 warning 발생). 네이밍 룰은 현재 vue component의 파일명의 단어를 "-"로 구분(예:exam-data)하여 입력하시면 됩니다. 입력후 이 주석은 지워주세요.
  $_veeValidate: {
    name () {
      return this.name;
    },
    value () {
      return this.vValue;
    }
  },
  props: {
    ui: {
      type: String,
      default: 'bootstrap',
    },
    name: {
      type: String
    },
    label: {  // 부모로 부터 받아온 라벨 정보
      type: String,
      default: ''
    },
    // 쓰기 권한 여부
    editable: {
      type: Boolean,
      default: true
    },
    // 컴포넌트의 너비(1~12)
    width: {
      type: Number,
      default: 12
    },
    // TODO : Tree 정보
    treeData: {
      type: Array,
      default: null
    },
    size: {
      type: String,
      default: 'sm'
    },
    itemValue: {
      type: String,
      default: 'id'
    },
    itemText: {
      type: String,
      default: 'label'
    },
    title: {
      type: String,
      default: ''
    },
    defaultExpandAll: {
      type: Boolean,
      default: false
    },
    useSearch: {
      type: Boolean,
      default: true
    },
    value: {
      type: [String, Number],
      default: null
    },
    activated: {
      type: Boolean,
      default: null
    }
  },
  // TODO: 화살표 함수(=>)는 data에 사용하지 말 것
  //    data: () => { return { a: this.myProp }}) 화살표 함수가 부모 컨텍스트를 바인딩하기 때문에 this는 예상과 달리 Vue 인스턴스가 아니기 때문에 this.myProp는 undefined로 나옵니다.
  //    참고url: https://kr.vuejs.org/v2/api/index.html#data
  data () {
    return {
      keyword: null,
      treeNodes: [],
      currentKey: []
    }
  },
  computed: {
    // 현재 컨트롤에 에러가 존재하는지 여부
    error () {
      return this.errorMsg && this.errorMsg.length > 0;
    },
    isMetroUi () {
      return this.ui === 'metroUi';
    },
    labelWidth () {
      var width = 12 - this.width;
      return width <= 0 ? 12 : width;
    },
    // select box에서 선택되어진 text 값
    text () {
      var text = '';
      return text;
    }
  },
  watch: {
    // TODO : 부모의 v-model 변경을 감시(예를 들면, db로부터 데이터를 조회 한 후 값을 바인딩 할 경우)
    treeData () {
      this.treeNodes = this.treeData;
    },
    keyword (_val, _oldVal) {
      if (_val === _oldVal) return;
      this.$refs.tree.filter(_val);
    },
    activated (_val) {
      if (!_val || !this.value) {
        this.currentKey = [];
        return;
      }
      this.$refs.tree.setCurrentKey(this.value);
      this.currentKey.push(this.value);
    }
  },
  /** Vue lifecycle: created, mounted, destroyed, etc **/
  beforeCreate () {
  },
  created () {
  },
  beforeMount () {
    // TODO : data를 초기화 시켜줌(검색 조건 유지가 필요할 때는 삭제할 것)
    // 이유 : vue.js는 SPA기반으로 동작하기 때문에 페이지를 이동하더라도 기존 입력된 정보가 그대로 남아 있는 문제가 있음
    this.init();
  },
  mounted () {
  },
  beforeDestory () {
    this.init();
  },
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init () {
      this.treeNodes = this.treeData;
    },
    /** /초기화 관련 함수 **/
    
    /** Call API service
    * Naming Rule: get, post, put 등의 RESTFul verb를 접두사로 사용하고 그 뒤에 관련 모델명을 Camel case로 추가하세요.
    * Naming Rule: get의 경우 복수의 데이터조회(리스트 데이터 등)시에는 복수를 나타내는 접미사 "s"를 붙여주세요.
    * ex) getExamData () {}
    * ex) getExamDatas () {}
    */   
    /** /Call API service **/
    
   
    /** 기타 function **/
    append (data) {
      const newChild = { id: id++, label: 'testtest', children: [] };
      if (!data.children) {
        this.$set(data, 'children', []);
      }
      data.children.push(newChild);
    },

    remove (node, data) {
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex(d => d.id === data.id);
      children.splice(index, 1);
    },

    // TODO : 참고
    // renderContent (h, { node, data, store }) {
    //   return (
    //     <span class="custom-tree-node">
    //       <span>{node.label}</span>
    //       <span>
    //         <el-button size="mini" type="text" on-click={ () => this.append(data) }>Append</el-button>
    //         <el-button size="mini" type="text" on-click={ () => this.remove(node, data) }>Delete</el-button>
    //       </span>
    //     </span>);
    // },

    handleDragStart(node, ev) {
    },
    handleDragEnter(draggingNode, dropNode, ev) {
    },
    handleDragLeave(draggingNode, dropNode, ev) {
    },
    handleDragOver(draggingNode, dropNode, ev) {
    },
    handleDragEnd(draggingNode, dropNode, dropType, ev) {
    },
    handleDrop(draggingNode, dropNode, dropType, ev) {
    },
    allowDrop(draggingNode, dropNode, type) {
      if (dropNode.data.label === 'Level two 3-1') {
        return type !== 'inner';
      } else {
        return true;
      }
    },
    allowDrag(draggingNode) {
      return draggingNode.data.label.indexOf('Level three 3-1-1') === -1;
    },
    nodeClick(_node) {
      this.$emit('nodeClick', _node);
    },
    filterNode (_value, _data) {
      if (!_value || !_data) return true;
      return _data[this.itemText].indexOf(_value) !== -1;
    },
    /** /기타 function **/
  }
};
</script>

<style>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }

  .primary {
    color: #B0B8FF
  }

  .warning {
    color: #EBB563
  }

  .default-height {
    max-height: 300px;
    overflow-y: auto;
    overflow-x: hidden;
  }
</style>