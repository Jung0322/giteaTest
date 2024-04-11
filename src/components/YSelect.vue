<!--
목적 : select 기반 select 컴포넌트(Not Autocomplete)
Detail :
  comboConfig.js 정보를 참고하여 컴포넌트 렌더링시 select 데이터 조회 해서 option 추가
 * 
examples: 
 *  
-->
<template>
  <div>
    <b-row :class="rowClass">
      <b-col :sm="labelWidth" v-if="label">
        <y-label
          :name="name"
          :size="size"
          :label="label"
          :icon="icon"
          :required="required"
          :warning="warning"
        ></y-label>
      </b-col>
      <b-col v-if="editable" :sm="width">
        <!-- loading spinner -->
        <div
          v-if="items.length <= 0 && !needDefaultView"
          class="text-right mb-4"
        >
          <div class="align-items-center text-info" role="status">
            <span>Loading...</span>
            <div
              class="spinner-grow spinner-grow-sm ml-auto"
              role="status"
              aria-hidden="true"
            ></div>
          </div>
        </div>
        <div v-else>
          <div v-if="!textable">
            <!-- /loading spinner -->
            <b-form-select
              v-model="vValue"
              :options="items"
              :item-text="itemText"
              :item-value="itemValue"
              :placeholder="placeholder"
              :state="state"
              :size="size"
              :disabled="disabled"
              @input="input"
              @change="
                (val) => {
                  searchchange(val);
                }
              "
            />
          </div>
          <div v-else>{{ text }}</div>
        </div>
      </b-col>
      <b-col v-else :sm="width">
        <!-- loading spinner -->
        <div
          v-if="items.length <= 0 && !needDefaultView"
          class="text-right mb-4"
        >
          <div class="align-items-center text-info" role="status">
            <span>Loading...</span>
            <div
              class="spinner-grow spinner-grow-sm ml-auto"
              role="status"
              aria-hidden="true"
            ></div>
          </div>
        </div>
        <!-- /loading spinner -->
        <b-form-select
          v-else
          v-model="vValue"
          :options="items"
          :item-text="itemText"
          :item-value="itemValue"
          :placeholder="placeholder"
          :size="size"
          :disabled="true"
          @input="input"
          @change="
            (val) => {
              searchchange(val);
            }
          "
        />
      </b-col>
    </b-row>
  </div>
</template>

<script>
import comboConfig from '@/js/comboConfig';
import comm from '@/js/common.js';
export default {
  /* attributes: name, components, props, data */
  name: 'y-select',
  $_veeValidate: {
    name() {
      return this.name;
    },
    value() {
      return this.vValue;
    },
  },
  props: {
    ui: {
      type: String,
      default: 'metroUi',
    },
    // selectConfig.js에 있는 select 검색용 키
    itemSearchKey: {
      type: String,
      default: '',
    },
    name: {
      type: String,
    },
    label: {
      // 부모로 부터 받아온 라벨 정보
      type: String,
      default: '',
    },
    // TODO : 부모로 부터 에러 메시지를 받아옴
    errorMsg: {
      type: String,
      required: false,
    },
    // 쓰기 권한 여부
    editable: {
      type: Boolean,
      default: true,
    },
    // TODO : 부모의 v-model의 값을 받아오는 속성
    value: {
      type: [Number, String],
      default: null,
    },
    // 중복 방지를 위해 선택된 값을 숨겨야 할 경우(멀티select)
    hideSelected: {
      type: Boolean,
      default: false,
    },
    // 선택 후 초기화 시켜야 할 경우
    isClearText: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
    },
    type: {
      // select 종류: edit, search 두 가지가 있음, (등록화면은 '선택하세요'로 조회화면은 '전체로 표시)
      type: String,
      default: '',
    },
    // 컴포넌트의 너비(1~12)
    width: {
      type: Number,
      default: 12,
    },
    codeGroupCd: {
      type: String,
      default: null,
    },
    firstTitle: {
      type: String,
      default: null,
    },
    // 부모로 부터 select option을 받아올 경우
    comboItems: {
      type: Array,
      default: () => [],
    },
    // comboItems의 여러 항목 중 화면에 text로 보여지는 정보를 가진 attribute 명(option 생성시 사용됨)
    itemText: {
      type: String,
      required: true,
    },
    // comboItems의 여러 항목 중 실제 값을 가져야 하는 attribute 명(option 생성시 사용됨)
    itemValue: {
      type: String,
      required: true,
    },
    // veeValidate 유효성 검사
    state: {
      type: Boolean,
      default: null,
    },
    disabled: {
      type: Boolean,
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

    // b-col에 추가할 클래스
    // colClass: {
    //   type: String,
    //   default: ''
    // },
    // ITEM이 존재하지 않아도 화면에 표시해야 할 경우 true
    needDefaultView: {
      type: Boolean,
      default: true,
    },
    icon: {
      type: String,
      default: '',
    },
    // 필수 입력 여부
    required: {
      type: Boolean,
      default: false,
    },
    textable: {
      type: Boolean,
      default: false,
    },
    warning: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      items: [],
      item: {},
      itemSubValue: null,
      vValue: null,
      orgItems: [],
      keyOfValue: '',
    };
  },
  computed: {
    // 현재 컨트롤에 에러가 존재하는지 여부
    error() {
      return this.errorMsg && this.errorMsg.length > 0;
    },
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
      if (!this.value) return text;
      var selectedItem = this.getSelectItem(this.value);
      if (selectedItem) text = selectedItem.text;
      return text;
    },
    placeholder() {
      if (this.type === 'edit') return '선택하세요';
      else if (this.type === 'search') return '전체';
    },
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
  },
  /* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {
    // itemSearchKey정보를 통해 backend에서 직접 조회할 경우
    if (this.itemSearchKey) this.getSelectItems();
    else if (this.comboItems && this.comboItems.length > 0) {
      this.makeSelectOptions();
    }
    if (this.codeGroupCd) this.getCodeGroupCombo(this.codeGroupCd);
  },
  mounted() {},
  beforeDestroy() {},
  destroyed() {},
  beforeUpdate() {},
  updated() {},
  /* methods */
  methods: {
    getSelectItems() {
      if (!this.itemSearchKey) {
        this.items = this.comboItems;
        return;
      }

      // this.item = comboConfig[this.itemSearchKey];
      // this.$ajax.url = this.item.url;
      // this.$ajax.param = null;
      // let self = this;
      // this.$ajax.requestGet((_result) => {
      //   self.items = typeof _result.content !== 'undefined' ? _result.content : _result
      //   if (self.items.length > 0) {
      //     var item = {}
      //     item[this.item.itemName] = this.type === 'search' ? this.$t('message.all') :  this.$t('message.select')
      //     item[this.item.itemKey] = null
      //     self.items.unshift(item)
      //   }
      //   if (!this.editable) this.getSelectedText();
      // }, (_error) => {
      // })
    },
    input() {
      // TODO : 부모에게 변경여부 전달
      this.$emit('input', this.vValue);
      // 선택후 텍스트 값 초기화
      if (this.isClearText) {
        this.$nextTick(() => {
          this.vValue = null;
        });
      }
      // select text 전달
      this.$nextTick(() => {
        this.$emit('text', this.text);
      });
    },
    getSelectItem(_pk) {
      if (!_pk) return null;

      var self = this;
      var filter = this.$_.filter(this.items, (_item) => {
        return String(_item.value) === String(_pk);
      });

      if (filter.length > 0) return filter[0];
      return null;
      // var pk = _pk;
      // pk = _pk ? _pk : this.vValue;
      // if (!pk) return null;
      // var filter = this.items.filter((_item) => {
      //   return _item[this.item.itemKey] === pk;
      // });

      // if (filter.length <= 0) return null;
      // var value = {
      //   item: filter[0],
      //   itemInfo: {
      //     key: this.itemText,
      //     value: this.itemValue
      //   }
      // };
      // return value;
    },
    getItems() {
      return this.items;
    },
    // To delete
    // getSelectedText () {
    //   var filter = null;
    //   if (!this.value) this.text = null;
    //   else {
    //     filter = this.items.filter((_item) => {
    //       return _item[this.item.itemKey] === this.value;
    //     });
    //     if (filter.length > 0) this.text = filter[0][this.item.itemName];
    //     else this.text = null;
    //   }
    // },
    /**
     * 모델 items 에서 itemText와 itemValue prop를 이용해서, bootstrap select에 적합한 option을 생성
     */
    getCodeGroupCombo(codeGroupCd) {
      if (codeGroupCd) {
        let options = [];
        let tempComboITems = [];
        const sucess = (_result) => {
          tempComboITems = _result.data;
          if (this.firstTitle) {
            options.push({
              text: this.$comm.getLangSpecInfoLabel(this.firstTitle),
              value: null,
            });
          }

          this.$_.forEach(tempComboITems, (_item) => {
            options.push({
              text: _item[this.itemText],
              value: _item[this.itemValue],
            });
          });

          this.items = options;
        };
        this.$comm.reqHttp(
          'GET',
          this.$format('/api/manage/codemaster/getselect/{0}', codeGroupCd),
          {},
          sucess
        );
      }
    },

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
          text: _item[this.itemText],
          value: _item[this.itemValue],
        });
      });

      this.items = options;
    },
    searchchange(data) {
      // 데이터가 변경되는 경우 처리 해당 속성이 설정되어 있으면 조회처리하도록 수정
      this.$emit('datachange', data);
    },
  },
};
</script>

<style>
::-webkit-input-placeholder {
  font-style: italic;
  font-size: 1rem;
}
:-moz-placeholder {
  font-style: italic;
  font-size: 1rem;
}
::-moz-placeholder {
  font-style: italic;
  font-size: 1rem;
}
:-ms-input-placeholder {
  font-style: italic;
  font-size: 1rem;
}
</style>
