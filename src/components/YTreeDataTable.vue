<!--
목적 : v-data-table을 이용한 grid 확장 컴포넌트
Detail :
 * 
examples: 
 *  
-->
<template>
  <div>
    <template v-if="isMetroUi"></template>
    <template v-else>
      <div>
        <div v-if="label" class="float-left">
          <y-label
            :label="label"
            icon="list-alt"
            color-class="cutstom-title-color"
          />
        </div>
        <div v-else class="float-left"></div>
        <div class="float-right" v-if="isShowBtn">
          <y-btn type="add" size="small" color="primary" icon="el-icon-edit" />
          <y-btn
            type="delete"
            size="small"
            color="danger"
            icon="el-icon-delete"
          />
        </div>
        <slot name="buttonGroup"></slot>
      </div>
      <slot name="header"></slot>
      <tree-table
        :data="treeItems"
        :eval-func="treeToArray"
        :eval-args="argument"
        :expand-all="expandAll"
        :check-name="checkName"
        :expand-header-nm="$comm.getLangSpecInfoLabel(expandHeaderNm)"
        :expand-column-name="expandColumnName"
        :expand-column-width="expandColumnWidth"
        :row-class-name="rowClassName"
        :height="height"
        :rows="rows"
        :checkableLevel="checkableLevel"
        header-cell-class-name="default-th"
        cell-class-name="default-td"
        :dataKey="dataKey"
        :parentKey="parentKey"
        border
        class="base-tree-table"
        :defaultExpandAll="defaultExpandAll"
        @checkChange="checkChange"
        @rowClicked="rowClicked"
        @rowDoubleClicked="rowDoubleClicked"
        @expandChange="expandChange"
        v-model="headSelectedValue"
        @headSelectionChanged="headSelectionChanged"
        :headCheckItemData="headCheckItemData"
        :headCheckKey="headCheckKey"
        :headCheckSetTime="headCheckSetTime"
        :isHeadCheckBox="isHeadCheckBox"
      >
        <el-table-column
          v-for="option in headers"
          v-if="!option.hidden"
          header-align="center"
          :key="option.name"
          :label="$comm.getLangSpecInfoLabel(option.text)"
          :align="option.hasOwnProperty('align') ? option.align : ''"
          :width="option.hasOwnProperty('width') ? option.width : null"
        >
          <template slot-scope="scope">
            <el-checkbox
              v-if="option.type === 'checkbox'"
              :true-label="trueLabel"
              :false-label="falseLabel"
              :disabled="
                option.disabledEffect
                  ? !(scope.row[option.disabledEffect] === 'Y')
                  : false
              "
              v-model="scope.row[option.name]"
              @change="
                changeCheckbox(scope.row, option, scope.row[option.name])
              "
              >{{
                initCheckedItem(scope.row, scope.row[option.name])
              }}</el-checkbox
            >
            <y-select
              v-else-if="option.type === 'select'"
              :editable="editable"
              :comboItems="option.items ? option.items : []"
              :itemText="option.itemText ? option.itemText : ''"
              :itemValue="option.itemValue ? option.itemValue : ''"
              :hasBottomMargin="false"
              rowClass
              size="sm"
              ui="bootstrap"
              v-model="scope.row[option.name]"
            />
            <div v-else-if="option.url">
              <el-button
                type="text"
                size="small"
                @click.stop="linkClicked(option, scope.row, scope.$index)"
                >{{ scope.row[option.name] }}</el-button
              >
            </div>
            <div v-else>
              <span
                :style="
                  !option.isStyle
                    ? 'overflow:hidden;text-overflow:ellipsis;white-space:nowrap;'
                    : ''
                "
                >{{ scope.row[option.name] }}</span
              >
            </div>
          </template>
        </el-table-column>
        <slot name="tag"></slot>
        <slot name="endExpand"></slot>
      </tree-table>
    </template>
  </div>
</template>

<script>
import treeTable from '@/components/TreeTable';
import treeToArray from './customEval';

export default {
  /* attributes: name, components, props, data, computed */
  name: 'y-tree-data-table',
  components: {
    'tree-table': treeTable,
  },
  props: {
    ui: {
      type: String,
      default: 'bootstrap',
    },
    // datatable 헤더
    headers: {
      type: Array,
      default: [],
    },
    // datatable 부모 원본 데이터
    items: {
      type: Array,
      default: [],
    },
    allItems: {
      type: Array,
    },
    // grid 수정 여부
    editable: {
      type: Boolean,
      default: true,
    },
    // row 선택용 checkbox 표시 여부
    checkable: {
      type: Boolean,
      default: false,
    },
    // 화면 렌더링시 자식 노드를 모두 펼칠 것인지 여부
    expandAll: {
      type: Boolean,
      default: false,
    },
    expandHeaderNm: {
      type: String,
      default: '',
    },
    // 확장 컬럼명 : 없으면 index
    expandColumnName: {
      type: String,
      default: null,
    },
    // 확장 컬럼명 : 없으면 index
    checkName: {
      type: String,
      default: null,
    },
    // 확장 컬럼 크기
    expandColumnWidth: {
      type: [Number, String],
      default: '200px',
    },
    // 체크박스의 true 값
    trueValue: {
      type: [String, Boolean, Number],
      default: 'Y',
    },
    checkBoxTrueKey: {
      type: String,
      default: null,
    },
    checkBoxFalseKey: {
      type: String,
      default: null,
    },
    dataKey: {
      type: String,
      default: '',
    },
    parentKey: {
      type: String,
      default: '',
    },
    isShowBtn: {
      type: Boolean,
      default: false,
    },
    // 테이블 라벨
    label: {
      type: String,
    },
    // 그리드 높이
    height: {
      type: [String, Number],
      default: '200',
    },
    // 표시 되는 행 개수
    rows: {
      type: Number,
      default: 10,
    },
    checkableLevel: {
      type: Boolean,
      default: false,
    },
    defaultExpandAll: {
      type: Boolean,
      default: false,
    },
    rowClassName: {
      type: Function,
      default: function ({ row, rowIndex }) {
        var returnText = '';
        if (rowIndex % 2 === 1) {
          returnText = 'odd-row';
        } else if (rowIndex % 2 === 0) {
          returnText = 'even-row';
        }
        return returnText;
      },
    },
    headCheckItemData: {
      // 그리드에 체크박스 적용하기 위한 데이터
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
      treeToArray: treeToArray,
      checkedItems: [],
      argument: [null, null, 'timeLine'],
      headSelectedValue: [], // 체크된 값
      treeItems: [],
    };
  },
  computed: {
    isMetroUi() {
      return this.ui === 'metroUi';
    },
    trueLabel() {
      var value = 'Y';
      if (typeof this.trueValue === 'number') value = 1;
      else if (typeof this.trueValue === 'boolean') value = true;
      else if (this.checkBoxTrueKey) value = this.checkBoxTrueKey;
      return value;
    },
    falseLabel() {
      var value = 'N';
      if (typeof this.trueValue === 'number') value = 0;
      else if (typeof this.trueValue === 'boolean') value = false;
      else if (this.checkBoxFalseKey) value = this.checkBoxFalseKey;
      return value;
    },
  },
  watch: {
    items() {
      this.checkedItems = [];
      this.treeItems = this.items;
      if (!this.items) this.treeItems = [];
    },
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
  },
  mounted() {},
  beforeDestroy() {},
  /* methods */
  methods: {
    /**
     * 부모의 체크박스 변경시 자식 노드도 같이 변경
     * _row : 이벤트가 발생된 row 데이터
     * _option : header 옵션
     * _isChecked : 체크 여부
     */
    changeCheckbox(_row, _option, _checkedValue, childCheck) {
      var columnName = _option.name;
      // 체크 박스 선택 여부
      var isChecked = this.trueValue === _checkedValue;
      if (childCheck === null || childCheck === undefined || childCheck) {
        if (this.$_.isArray(_row)) {
          // 체크가 된 메뉴의 하위 메뉴정보가 들어온다
          this.$_.forEach(_row, (_item) => {
            _item[columnName] = _checkedValue;
            // 체크 했으면 중복된 값 확인 후 추가
            if (isChecked && !this.isDuplicatedItem(this.checkedItems, _item)) {
              this.checkedItems.push(_item);
            }
            // 체크를 해제 했으면 체크된 항목에서 제거
            else if (!isChecked) {
              this.$_.remove(this.checkedItems, (__item) => {
                return __item[this.dataKey] === _item[this.dataKey];
              });
            }
            if (
              _option.hasOwnProperty('relateColumn') &&
              _checkedValue === _option.relateValue
            ) {
              _item[_option.relateColumn] = _checkedValue;
            }
            if (_item.hasOwnProperty('children')) {
              this.changeCheckbox(_item.children, _option, _checkedValue, true);
            }
          });
        } else {
          // 체크가 된 메뉴의 정보가 들어온다.
          // 체크가 된 메뉴의 부모 메뉴를 check해야 함
          _row[columnName] = _checkedValue;
          // 체크 했으면 중복된 값 확인 후 추가
          if (isChecked && !this.isDuplicatedItem(this.checkedItems, _row)) {
            this.checkedItems.push(_row);
          }
          // 체크를 해제 했으면 체크된 항목에서 제거
          else if (!isChecked) {
            this.$_.remove(this.checkedItems, (__item) => {
              return __item[this.dataKey] === _row[this.dataKey];
            });
          }
          if (
            _option.hasOwnProperty('relateColumn') &&
            _checkedValue === _option.relateValue
          ) {
            _row[_option.relateColumn] = _checkedValue;
          }
          if (_row.hasOwnProperty('children')) {
            this.changeCheckbox(_row.children, _option, _checkedValue, true);
          }

          // 현재 item에 넣고 있는 값의 정보랑 다름
          // let parentRowIndex = this.$_.findIndex(this.allItems, {
          //   menuId: _row.upMenuId,
          // });
          // if (parentRowIndex > -1) {
          //   let parentRow = this.allItems[parentRowIndex];
          //   this.changeCheckbox(parentRow, _option, _checkedValue, false);
          // }
        }
      } else {
        _row[columnName] = _checkedValue;
        // 체크 했으면 중복된 값 확인 후 추가
        if (isChecked && !this.isDuplicatedItem(this.checkedItems, _row)) {
          this.checkedItems.push(_row);
        }
        // 체크를 해제 했으면 체크된 항목에서 제거
        else if (!isChecked) {
          this.$_.remove(this.checkedItems, (__item) => {
            return __item[this.dataKey] === _row[this.dataKey];
          });
        }
        if (_option.hasOwnProperty('relateColumn')) {
          _row[_option.relateColumn] = _checkedValue;
        }
        let parentRowIndex = this.$_.findIndex(this.allItems, {
          menuId: _row.upMenuId,
        });
        if (parentRowIndex > -1) {
          let parentRow = this.allItems[parentRowIndex];
          this.changeCheckbox(parentRow, _option, _checkedValue, false);
        }
      }
    },
    headSelectionChanged(val) {
      this.$emit('headSelectionChanged', this.headSelectedValue);
    },
    /**
     * 선택된 값을 가져오면서, 하위 노드가 선택되면 상위 노드도 검색해서 가져온다.
     */
    getCheckedItems() {
      var checktedItems = this.$_.clone(this.checkedItems);
      var items = [];

      this.$_.forEach(checktedItems, (_item) => {
        if (_item.hasOwnProperty('parent')) {
          this.getParentItem(checktedItems, _item.parent);
        }
        if (_item.hasOwnProperty('children')) _item.children = null;
        delete _item.parent;
        delete _item.children;
      });
      return checktedItems;
    },
    /**
     * 현재 노드의 부모노드 검색
     */
    getParentItem(_checkedItems, _parent) {
      if (!this.isDuplicatedItem(_checkedItems, _parent)) {
        _checkedItems.unshift(_parent);
      }
      if (_parent.hasOwnProperty('parent')) {
        this.getParentItem(_checkedItems, _parent.parent);
      }
    },
    /**
     * 중복 노드 확인
     */
    isDuplicatedItem(_items, _addItem) {
      var hasItem = false;
      this.$_.forEach(_items, (_item) => {
        if (_item[this.dataKey] === _addItem[this.dataKey]) hasItem = true;
      });
      return hasItem;
    },
    initCheckedItem(_item, _checkedValue) {
      // 체크 박스 선택 여부
      var isChecked = this.trueValue === _checkedValue;
      if (!isChecked || this.isDuplicatedItem(this.checkedItems, _item)) return;
      this.checkedItems.push(_item);
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 === 1) {
        return 'odd-row';
      } else if (rowIndex % 2 === 0) {
        return 'even-row';
      }
      return '';
    },
    rowClicked(row) {
      this.$emit('rowClicked', row);
    },
    rowDoubleClicked(row) {
      this.$emit('rowDoubleClicked', row);
    },
    checkChange(data) {
      this.$emit('checkChange', data);
    },
    /**
     * 링크 정보를 클릭했을 때
     */
    linkClicked(_header, _row, _index) {
      this.$emit('tableLinkClicked', _header, _row, _index);
      // TODO : 페이지 이동은 준비중
    },
    expandChange(row, expandedRows) {
      this.$emit('expandChange', row, expandedRows);
    },
  },
};
</script>
