<!--
  목적 : 검색조건 컴포넌트
  작성자 : kdh
  Detail :
  *
  examples:
  *
  -->
<template>
  <!-- 검색 -->
  <div
    id="divSearch"
    v-on:mouseover="onMouseOver"
    v-on:mouseout="onMouseOut"
    v-on:keyup.enter="onEnterKey"
  >
    <b-row v-show="searchboxStatus" ref="searchBox">
      <b-col sm="12">
        <b-card header-class="default-card" body-class="default-body-card" class="py-0">
          <!-- <div slot="header">
            <y-label label="검색" />
            <div class="float-right">
              <y-btn 
                title="검색"
                color="green"
                @btnClicked="btnClicked"
              ></y-btn>
            </div>
          </div> -->
          <div>
            <b-row>
              <template v-for="(item, idx) in vOptions">
                <b-col :key="idx" sm="6" md="6" lg="6" :xl="item.xl ? item.xl.toString() : '3'" class="col-xxl-3">
                  <y-text
                    v-if="item.type === 'text'"
                    :label="item.label"
                    :width="item.width ? item.width : 8"
                    v-model="item.value"
                  />
                  <y-number
                    v-else-if="item.type === 'number'"
                    :key="idx"
                    :label="item.label"
                    :width="item.width ? item.width : 8"
                    :pointNumber="item.pointNumber ? item.pointNumber : 0"
                    :hasSeperator="item.hasSeperator ? item.hasSeperator : false"
                    :showMaxLength="false"
                    v-model="item.value"
                  />
                  <y-datepicker
                    v-else-if="item.type === 'datepicker'"
                    :key="idx"
                    :label="item.label"
                    :width="item.width ? item.width : 8"
                    :range="item.range ? item.range : false"
                    :default="item.default ? item.default === 'input' ? '' : item.default : 'today'"
                    :start="item.start ? item.start : ''"
                    :end="item.end ? item.end : ''"
                    v-model="item.value"
                    />
                  <y-plant
                    v-else-if="item.type === 'plant'"
                    :key="idx"
                    type="search"
                    v-model="item.value"
                  />
                  <y-tree-dept
                    v-else-if="item.type === 'dept'"
                    :key="idx"
                    :plant-cd="item.plantCd"
                    :dept-sub-yn="item.deptSubYn"
                    v-model="item.value"
                  />
                  <y-switch 
                    v-else-if="item.type === 'switch'"
                    :key="idx"
                    :label="item.label"
                    :width="item.width ? item.width : 8"
                    :true-value="item.trueValue ? item.trueValue : 'Y'"
                    :false-value="item.falseValue ? item.falseValue : 'N'"
                    :select-text="item.selectText ? item.selectText : ''"
                    :unselect-text="item.unselectText ? item.unselectText : ''"
                  />
                  <y-select
                    v-else-if="item.type === 'select'"
                    :key="idx"
                    :label="item.label"
                    :width="item.width ? item.width : 8"
                    :comboItems="item.items ? item.items : []"
                    :itemText="item.itemText ? item.itemText : ''"
                    :itemValue="item.itemValue ? item.itemValue : ''"
                    :textable="item.textable"
                    v-model="item.value"
                  />
                  <y-radio
                    v-else-if="item.type === 'radio'"
                    :key="idx"
                    :label="item.label"
                    :width="item.width ? item.width : 8"
                    :comboItems="item.items ? item.items : []"
                    :itemText="item.itemText ? item.itemText : ''"
                    :itemValue="item.itemValue ? item.itemValue : ''"
                    :textable="item.textable"
                    v-model="item.value"
                  />
                  <y-checkbox
                    v-else-if="item.type === 'checkbox'"
                    :key="idx"
                    :label="item.label"
                    :width="item.width ? item.width : 8"
                    :comboItems="item.items ? item.items : []"
                    :itemText="item.itemText ? item.itemText : ''"
                    :itemValue="item.itemValue ? item.itemValue : ''"
                    :textable="item.textable"
                    v-model="item.value"
                  />
                </b-col>
              </template>
            </b-row>
          </div>

          <!-- 추가 검색 또는 사용자 정의 검색 slot -->
          <slot name="search"></slot>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  name: 'y-search-box',
  props: {
    //선언되어 있어 수정 용이
    gridOptions: {
      type: Object,
      default: function() {
        return {
          height: 300,
        };
      },
    },
    options: {
      type: Array,
      default: () => {
        return [];
      }
    },
    isResizeGrid: {
      type: Boolean,
      default: function() {
        return true;
      },
    },
    resize: {
      type: Boolean,
      default: function() {
        return false;
      },
    },
    enter: {
      type: Boolean,
      default: true,
    },
    remainSearchOption: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      isMouseOver: false,
      OriginalGridHeight: '',
      vOptions: []
    };
  },
  computed: {
    searchboxStatus() {
      this.setGridSize();

      // gridOptions.searchboxStatus 의 값이 true 이면 전역변수를 사용하지 않고 무조건 보이도록 설정
      return this.gridOptions.searchboxStatus === true
        ? true
        : this.$store.state.app.appmain.opened;
    },
  }, //그리드 사이즈 재설정 안해도 되면 빼도됨
  watch: {
    resize() {
      this.setGridSize();
    },
    options() {
      if (!this.options || this.options.length <= 0) return;
      this.vOptions = this.options;
    }
  },
  beforeCreate() {},
  created() {},
  beforeMount() {
    if (!this.remainSearchOption) Object.assign(this.$data, this.$options.data());
    // 윈도우 resize event
    window.addEventListener('resize', this.setGridSize);

    if (this.enter) {
      window.addEventListener('keyup', this.onEnter);
    }

    this.OriginalGridHeight = this.gridOptions.height;
    this.init();
  },
  mounted() {},
  beforeDestory() {
    // 윈도우 resize event 제거-SPA 기반이므로 제거하지 않으면 다른페이지에서 해당 이벤트가 호출됨
    window.removeEventListener('resize', this.setGridSize);
    if (this.enter) window.removeEventListener('keyup', this.onEnter);
  },
  methods: {
    init() {
      if (this.isResizeGrid) {
        this.setGridSize();
      }
      this.vOptions = this.options;
    },
    onEnterKey() {
      this.$emit('enter');
    },
    onEnter(event) {
      if (event.which === 13 && this.isMouseOver && this.enter) {
        this.$emit('enter');
      }
    },
    onMouseOver() {
      this.isMouseOver = true;
    },
    onMouseOut() {
      this.isMouseOver = false;
    },
    /**
     * 그리드 리사이징
     */
    setGridSize() {
      window.getApp.$emit('LOADING_SHOW');
      setTimeout(() => {
        if (this.OriginalGridHeight === 'auto') {
          this.gridOptions.height =
            window.innerHeight -
            (this.$refs.searchBox === undefined ? 0 : this.$refs.searchBox.clientHeight) - 230;
        }
        window.getApp.$emit('LOADING_HIDE');
      }, 600);
    },
    btnClicked() {
      let searchParam = {};
      this.$_.forEach(this.vOptions, _item => {
        searchParam[_item.id] = _item.value;
      });
      this.$emit('onSearch', searchParam);
    }
  },
};
</script>