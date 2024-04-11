<!--
  목적 : 컴포넌트
  Detail :
  *
  examples:
  *
  -->
<template>
  <div>
    <template v-if="isMetroUi">
      <v-combobox
        v-if="editable"
        :items="items"
        :label="label"
        :prepend-icon="icon"
        :flat="flat"
        :item-text="itemText"
        :item-value="itemValue"
        v-model="chips"
        clearable
        chips
        multiple
      >
        <template slot="selection" slot-scope="data">
          <v-chip :selected="data.selected" close @input="remove(data.item)">
            <strong>{{ data.item[itemText] }}</strong>
          </v-chip>
        </template>
      </v-combobox>
      <div v-else>
        <template slot="selection" slot-scope="data">
          <v-chip :selected="data.item.selected">
            <strong>{{ data.item[itemText] }}</strong>
          </v-chip>
        </template>
      </div>
    </template>
    <template v-else>
      <b-row :class="rowClass">
        <b-col :sm="labelWidth" v-if="label!=''">
          <y-label :name="name" :size="size" :label="label" :icon="icon" :required="required"></y-label>
        </b-col>
        <b-col v-if="editable" :sm="width">
          <!-- loading spinner -->
          <div v-if="items.length <= 0 && !needDefaultView" class="text-right mb-4">
            <div class="align-items-center text-info" role="status">
              <span>Loading...</span>
              <div class="spinner-grow spinner-grow-sm ml-auto" role="status" aria-hidden="true"></div>
            </div>
          </div>
          <!-- /loading spinner -->
          <multiselect
            v-else
            v-model="vValue"
            :placeholder="$comm.getLangSpecInfoLabel(placeholder)"
            :name="name"
            label="name"
            track-by="name"
            :options="items"
            :hide-selected="true"
            :clear-on-select="false"
            :close-on-select="false"
            :multiple="true"
            :maxHeight="maxHeight"
            :disabled="disabled"
          ></multiselect>
        </b-col>
        <b-col v-else :sm="width">
          <!-- loading spinner -->
          <div v-if="items.length <= 0 && !needDefaultView" class="text-right mb-4">
            <div class="align-items-center text-info" role="status">
              <span>Loading...</span>
              <div class="spinner-grow spinner-grow-sm ml-auto" role="status" aria-hidden="true"></div>
            </div>
          </div>
          <!-- /loading spinner -->
          <multiselect
            v-else
            v-model="vValue"
            :placeholder="$comm.getLangSpecInfoLabel(placeholder)"
            :name="name"
            label="name"
            track-by="name"
            :options="items"
            :hide-selected="true"
            :clear-on-select="false"
            :close-on-select="false"
            :multiple="true"
            :disabled="true"
            :maxHeight="maxHeight"
            class="mb-3"
          ></multiselect>
        </b-col>
      </b-row>
    </template>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect';

export default {
  /* attributes: name, components, props, data */
  name: 'y-multi-select',
  components: {
    Multiselect,
  },
  props: {
    ui: {
      type: String,
      default: 'metroUi',
    },
    // TODO : 부모의 v-model의 값을 받아오는 속성
    value: {
      type: Array,
      default: null,
    },
    name: {
      type: String,
    },
    // 부모로 부터 select option을 받아올 경우
    comboItems: {
      type: Array,
      default: [],
    },
    editable: {
      type: Boolean,
      default: true,
    },
    label: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
    },
    flat: {
      type: Boolean,
      default: true,
    },
    type: {
      // select 종류: edit, search 두 가지가 있음, (등록화면은 '선택하세요'로 조회화면은 '전체로 표시)
      type: String,
      default: '',
    },
    itemText: {
      type: String,
      required: true,
    },
    itemValue: {
      type: String,
      required: true,
    },
    // veeValidate 유효성 검사
    state: {
      type: Boolean,
      default: null,
    },
    // 컴포넌트의 너비(1~12)
    width: {
      type: Number,
      default: 12,
    },
    size: {
      type: String,
      default: 'sm',
    },
    // b-row에 추가할 클래스
    rowClass: {
      type: String,
      default: 'mb-2',
    },
    // ITEM이 존재하지 않아도 화면에 표시해야 할 경우 true
    needDefaultView: {
      type: Boolean,
      default: false,
    },
    maxHeight: {
      type: Number,
      default: 300,
    },
    // 필수 입력 여부
    required: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  // TODO: 화살표 함수(=>)는 data에 사용하지 말 것
  //    data: () => { return { a: this.myProp }}) 화살표 함수가 부모 컨텍스트를 바인딩하기 때문에 this는 예상과 달리 Vue 인스턴스가 아니며, this.myProp는 정의되지 않습니다.
  //    참고url: https://kr.vuejs.org/v2/api/index.html#data
  data() {
    return {
      items: [],
      vValue: [],
    };
  },
  computed: {
    isMetroUi() {
      return this.ui === 'metroUi';
    },
    labelWidth() {
      var width = 12 - this.width;
      return width <= 0 ? 12 : width;
    },
    // select box에서 선택되어진 text 값
    text() {
      var text = '';
      // if (!this.value) return text;
      return text;
    },
    placeholder () {
      if (this.type === 'edit') return 'L0000003394'; // '선택하세요'
      else if (this.type === 'seach') return 'L0000002519'; // '전체'
    }
  },
  watch: {
    // TODO : 부모의 v-model 변경을 감시(예를 들면, db로부터 데이터를 조회 한 후 값을 바인딩 할 경우)
    value() {
      this.vValue = this.value;
    },
    // 부모로 부터 값을 비동기로 가져올 경우 처리
    comboItems() {
      this.makeSelectOptions();
    },
    // TODO : 부모로 부터 값을 받아오는 경우, 상황에 따라 value 속성 값이 먼저 들어오고 comboItems의 값이 늦게 들어올 수 있으므로,
    // 실제 항목인 items가 변경되면 vValue값을 value값으로 재 설정 해줌
    items() {
      this.vValue = this.value;
    },
    vValue() {
      this.$emit('input', this.vValue);
    },
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {
    // itemSearchKey정보를 통해 backend에서 직접 조회할 경우
    this.makeSelectOptions();
  },
  mounted() {},
  beforeDestroy() {},
  destroyed() {},
  updated() {},
  //* methods */
  methods: {
    // TODO : 부모에게 변경여부 전달
    input() {
      // var selectedValues = this.$_.map(this.vValue, 'code');
      // this.$emit('input', selectedValues);
      this.$emit('input', this.vValue);
    },
    remove(item) {
      // window.alert(item);
    },
    /**
     * 모델 items 에서 itemText와 itemValue prop를 이용해서, bootstrap select에 적합한 option을 생성
     */
    makeSelectOptions() {
      var options = [];
      if (!this.comboItems && !this.comboItems.length) return options;
      let tempComboITems = [];
      // 쓰기권환이 있으며 활성화 상태인 경우
      if (this.editable && !this.disabled) {
        // 사용여부가 Y인 것만 리스트에 표현한다.
        // default : 사용여부 상관없이 전체
        tempComboITems = this.$_.reject(this.comboItems, { useYn: 'N' });
      } else {
        tempComboITems = this.comboItems;
      }

      this.$_.forEach(tempComboITems, (_item) => {
        options.push({
          name: _item[this.itemText],
          code: _item[this.itemValue],
        });
      });
      this.items = options;
    },
    clearAll() {
      this.vValue = [];
    },
  },
};
</script>

<!-- New step! Add Multiselect CSS. Can be added as a static asset or inside a component. -->
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style slot-scope="">
.multiselect__input{
  font-size: 0.8125rem !important;
}
.multiselect__option {
  font-size: 0.8125rem !important;
}
.multiselect--disabled {
  background-color: #ffffff;
}
</style>
