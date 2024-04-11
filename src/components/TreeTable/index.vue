<template>
  <el-table
    ref="datatable"
    :data="dataList"
    :row-style="showRow"
    :header-cell-class-name="headerCellClassName"
    highlight-current-row
    :cell-class-name="cellClassName"
    :default-expand-all="defaultExpandAll"
    @row-click="rowClicked"
    @row-dblclick="rowDoubleClicked"
    @expand-change="expandChange"
    :row-key="dataKey"
    class="y-tree-table-index"
    style="width: 100%; min-height: 200px"
    v-bind="$attrs"
    @selection-change="headSelectionChanged"
  >
    <el-table-column
      v-if="isHeadCheckBox"
      type="selection"
      align="center"
      width="55"
    ></el-table-column>

    <el-table-column
      v-if="columns.length === 0"
      :width="expandColumnWidth"
      header-align="center"
    >
      <template v-if="expandHeaderNm" slot="header" slot-scope="scope">{{
        expandHeaderNm
      }}</template>
      <template slot-scope="scope">
        <!-- <span v-for="space in scope.row._level" :key="space" class="ms-tree-space" /> -->
        <span @click="toggleExpanded(scope.$index)">
          <span v-if="iconShow(0, scope.row)" class="tree-ctrl">
            <!-- <f-icon 
              v-if="!scope.row._expanded" 
              icon="caret-down" />
            <f-icon v-else icon="caret-up" />-->
            <!-- 
              <i v-if="!scope.row._expanded" class="el-icon-plus"/>
              <i v-else class="el-icon-minus"/> 
            -->
          </span>
          <span v-else :class="{ element: checkableLevel }">
            <span
              v-if="!checkableLevel && !scope.row[parentKey]"
              style="padding-left: 20px"
            ></span>
            <!-- <f-icon icon="angle-right" /> -->
            <!-- <b-form-checkbox
              v-if="checkable"
              style="margin: 0px; padding-left: 30px; padding-top: 7px;"
              value="Y"
              unchecked-value="N"
              v-model="scope.row[expandColumnName]"
              @change="changeElement(value)"
            />-->
            <el-checkbox
              v-if="checkableLevel"
              true-label="Y"
              false-label="N"
              v-model="scope.row[checkName]"
              @change="changeElement(scope.row, scope.row[checkName])"
            ></el-checkbox>
          </span>
          <span v-if="expandColumnName">{{ scope.row[expandColumnName] }}</span>
          <span v-else>{{ scope.$index }}</span>
        </span>
      </template>
    </el-table-column>
    <el-table-column
      v-for="(column, index) in columns"
      v-else
      :key="column.value"
      :label="column.text"
      :width="column.width"
    >
      <template slot-scope="scope">
        <!-- Todo -->
        <!-- eslint-disable-next-line vue/no-confusing-v-for-v-if -->
        <span
          v-if="index === 0"
          v-for="space in scope.row._level"
          :key="space"
          class="ms-tree-space"
        />
        <span
          v-if="iconShow(index, scope.row)"
          class="tree-ctrl"
          @click="toggleExpanded(scope.$index)"
        >
          <!-- <f-icon v-if="!scope.row._expanded" icon="caret-down" /> -->
          <!-- <f-icon v-else icon="caret-up" /> -->
          <!-- 
            <i v-if="!scope.row._expanded" class="el-icon-plus"/>
            <i v-else class="el-icon-minus"/> 
          -->
        </span>
        <!-- {{ scope.row[column.value] }} -->
      </template>
    </el-table-column>
    <slot />
  </el-table>
</template>

<script>
/* eslint-disable */
/**
  Auth: Lei.j1ang
  Created: 2018/1/19-13:59
*/
import treeToArray from './eval';
export default {
  name: 'TreeTable',
  props: {
    /* eslint-disable */
    data: {
      type: [Array, Object],
      required: true,
    },
    columns: {
      type: Array,
      default: () => [],
    },
    evalFunc: Function,
    evalArgs: Array,
    expandAll: {
      type: Boolean,
      default: false,
    },
    expandColumnName: {
      type: String,
      default: null,
    },
    // 확장 컬럼명 : 없으면 index
    checkName: {
      type: String,
      default: null,
    },
    headerCellClassName: {
      type: String,
    },
    cellClassName: {
      type: String,
    },
    // 확장 컬럼 크기
    expandColumnWidth: {
      type: [Number, String],
      default: '200px',
    },
    checkableLevel: {
      type: Boolean,
      default: false,
    },
    dataKey: {
      type: String,
      default: '',
    },
    parentKey: {
      type: String,
      default: '',
    },
    defaultExpandAll: {
      type: Boolean,
      default: false,
    },
    expandHeaderNm: {
      type: String,
      default: '',
    },
    headCheckItemData: {
      type: Array,
    },
    headCheckKey: {
      type: String,
      default: '',
    },
    headCheckSetTime: {
      type: Number,
      default: 100,
    },
    isHeadCheckBox: {
      // 칼럼 맨 앞 체크박스 여부
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      headMultipleSelection: [],
    };
  },
  watch: {
    headCheckItemData() {
      if (this.headCheckItemData && this.dataList) {
        let totalList = [];
        let checkArr = this.$_.clone(this.dataList);
        while (checkArr && checkArr.length) {
          let items = checkArr.splice(0, checkArr.length);
          totalList = totalList.concat(items);
          this.$_.forEach(items, (item) => {
            if (item.children && item.children.length) {
              checkArr = checkArr.concat(item.children);
            }
          });
        }

        totalList.forEach((row) => {
          this.headCheckItemData.forEach((selectRow) => {
            if (row[this.headCheckKey] === selectRow[this.headCheckKey]) {
              if (row[this.headCheckKey] !== '0') {
                if (this.headCheckSetTime) {
                  setTimeout(() => {
                    this.$refs.datatable.toggleRowSelection(row);
                  }, this.headCheckSetTime);
                } else {
                  this.$refs.datatable.toggleRowSelection(row);
                }
              }
            }
          });
        });
      }
    },
  },
  computed: {
    // 서식이 지정된 데이터 테이블 소스
    dataList() {
      let tmp;
      if (!Array.isArray(this.data)) {
        tmp = [this.data];
      } else {
        tmp = this.data;
      }
      const func = this.evalFunc || treeToArray;
      const args = this.evalArgs
        ? Array.concat([tmp, this.expandAll], this.evalArgs)
        : [tmp, this.expandAll];
      return tmp; // func.apply(null, args)
    },
  },
  beforeMount() {
    // Object.assign(this.$data, this.$options.data());
  },
  mounted() {
    // Selection - 초기 데이터가 셋팅 되어 있는 상황에서 화면 띄워줄시 체크 박스 셋팅
    if (this.headCheckItemData && this.dataList) {
      let totalList = [];
      let checkArr = this.$_.clone(this.dataList);
      while (checkArr && checkArr.length) {
        let items = checkArr.splice(0, checkArr.length);
        totalList = totalList.concat(items);
        this.$_.forEach(items, (item) => {
          if (item.children && item.children.length) {
            checkArr = checkArr.concat(item.children);
          }
        });
      }

      totalList.forEach((row) => {
        this.headCheckItemData.forEach((selectRow) => {
          if (row[this.headCheckKey] === selectRow[this.headCheckKey]) {
            if (row[this.headCheckKey] !== '0') {
              if (this.headCheckSetTime) {
                setTimeout(() => {
                  this.$refs.datatable.toggleRowSelection(row);
                }, this.headCheckSetTime);
              } else {
                this.$refs.datatable.toggleRowSelection(row);
              }
            }
          }
        });
      });
    }
  },
  methods: {
    showRow: function (row) {
      const show = row.row.parent
        ? row.row.parent._expanded && row.row.parent._show
        : true;
      row.row._show = show;
      return show
        ? 'animation:treeTableShow 1s;-webkit-animation:treeTableShow 1s;'
        : 'display:none;';
    },
    // 자식 노드 표시
    toggleExpanded: function (trIndex) {
      const record = this.dataList[trIndex];
      if (record) record._expanded = !record._expanded;
    },
    // 아이콘 표시
    iconShow(index, record) {
      return index === 0 && record.children && record.children.length > 0;
    },
    rowClicked(row, event, column) {
      this.$emit('rowClicked', row);
    },
    rowDoubleClicked(row, event, column) {
      this.$emit('rowDoubleClicked', row);
    },
    changeElement(row, val) {
      this.$emit('checkChange', { row: row, val: val });
    },
    expandChange(row, expandedRows) {
      this.$emit('expandChange', row, expandedRows);
    },
    headSelectionChanged(val) {
      this.headMultipleSelection = val;
      this.$emit('input', this.headMultipleSelection);
      this.$emit('headSelectionChanged', this.headMultipleSelection);
    },
  },
};
</script>
<style rel="stylesheet/css">
@keyframes treeTableShow {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@-webkit-keyframes treeTableShow {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>

<style lang="scss" rel="stylesheet/scss" scoped>
$color-blue: #2196f3;
$space-width: 18px;
.ms-tree-space {
  position: relative;
  top: 1px;
  display: inline-block;
  font-style: normal;
  font-weight: 400;
  line-height: 1;
  width: $space-width;
  height: 14px;
  &::before {
    content: '';
  }
}
.processContainer {
  width: 100%;
  height: 100%;
}
table td {
  line-height: 26px;
}

.tree-ctrl {
  position: relative;
  cursor: pointer;
  color: $color-blue;
  margin-right: -8px;

  // margin-left: -$space-width;
}
.element {
  position: relative;
  margin-left: -$space-width;
}

// .cell .el-table__expand-icon {
//   display: none;
// }
</style>
<style lang="sass">
.y-tree-table-index
  .el-table__placeholder
    width: 16px !important;
</style>
