<!--
  목적 : 컴포넌트
  Detail :
  *
  examples:
  *
  -->
<template>
  <div>
    <b-row :class="rowClass">
      <!-- 라벨 영역 -->
      <b-col :sm="labelWidth" v-if="label" align-v="center">
        <y-label
          :name="name"
          :size="size"
          :label="label"
          :icon="icon"
          :required="required"
        >
        </y-label>
      </b-col>
      <b-col 
        v-if="editable"
        :sm="width">
        <!-- loading spinner -->
        <div 
          v-if="items.length <= 0"
          class="text-right mb-4">
          <div class="align-items-center text-info" role="status">
            <span>Loading...</span>
            <div class="spinner-grow spinner-grow-sm ml-auto" role="status" aria-hidden="true"></div>
          </div>
        </div>
        <!-- /loading spinner -->
        <b-form-group>
          <b-form-radio-group 
            :id="name" 
            v-model="vValue" 
            :options="items"
            :name="name"
            :size="size"
            :state="state"
            :disabled="disabled"
            @input="input">
          </b-form-radio-group>
        </b-form-group>
      </b-col>
      <b-col v-else>
        <!-- loading spinner -->
        <div 
          v-if="items.length <= 0"
          class="text-right mb-4">
          <div class="align-items-center text-info" role="status">
            <span>Loading...</span>
            <div class="spinner-grow spinner-grow-sm ml-auto" role="status" aria-hidden="true"></div>
          </div>
        </div>
        <!-- /loading spinner -->
        <b-form-group
          :class="{ 'margin-zero': margin }"
        >
          <b-form-radio-group 
            :id="name" 
            v-model="vValue" 
            :options="items"
            :name="name"
            :size="size"
            :state="state"
            :disabled="true"
            @input="input">
          </b-form-radio-group>
        </b-form-group>
      </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  /* attributes: name, components, props, data */
  name: 'y-radio',
  props: {
    ui: {
      type: String,
      default: 'metroUi',
    },
    name: {
      type: String
    },
    label: {  // 부모로 부터 받아온 라벨 정보
      type: String,
      default: ''
    },
    // TODO : 부모로 부터 에러 메시지를 받아옴
    errorMsg: {
      type: String,
      required: false
    },
    // 쓰기 권한 여부
    editable: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    // TODO : 부모의 v-model의 값을 받아오는 속성
    value: {
      type: [Number, String],
      default: null
    },
    // 중복 방지를 위해 선택된 값을 숨겨야 할 경우
    hideSelected: {
      type: Boolean,
      default: false
    },
    color: {
      type: String
    },
    type: { // select 종류: edit, search 두 가지가 있음, (등록화면은 '선택하세요'로 조회화면은 '전체로 표시)
      type: String,
      default: 'edit'
    },
    // 컴포넌트의 너비(1~12)
    width: {
      type: Number,
      default: 12
    },
    itemText: {
      type: String,
      default: 'text'
    },
    itemValue: {
      type: String,
      default: 'value'
    },
    // 부모로 부터 radio 항목들을 받아올 경우
    comboItems: {
      type: Array,
      default: () => []
    },
    codeGroupCd: {
      type: String,
      default: null,
    },
    // veeValidate 유효성 검사
    state: {
      type: Boolean,
      default: null
    },
    size: {
      type: String,
      default: 'sm'
    },
    // b-row에 추가할 클래스
    rowClass: {
      type: String,
      default: 'mb-2'
    },
    icon: {
      type: String,
      default: ''
    },
    // 필수 입력 여부
    required: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    vValue: null,
    items: [],
  }),
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
      if (!this.value) return text;
      var selectedItem = this.getSelectItem(this.vValue);  
      if (selectedItem) text = selectedItem.text;
      return text;
    },
    margin() {
      // rowClass가 없을 경우에는 margin-zero
      return !this.rowClass ? true : false;
    }
  },
  watch: {
    // todo : 부모의 v-model 변경을 감시(예를 들면, db로부터 데이터를 조회 한 후 값을 바인딩 할 경우)
    value () {
      this.vValue = this.value;
    },
    // 부모로 부터 값을 비동기로 가져올 경우 처리
    comboItems () {
      this.makeSelectOptions();
    },
    // TODO : 부모로 부터 값을 받아오는 경우, 상황에 따라 value 속성 값이 먼저 들어오고 comboItems의 값이 늦게 들어올 수 있으므로,
    // 실제 항목인 items가 변경되면 vValue값을 value값으로 재 설정 해줌
    items () {
      this.vValue = this.value;
    }
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate () {
  },
  created () {
  },
  beforeMount () {
    // itemSearchKey정보를 통해 backend에서 직접 조회할 경우
    if (this.itemSearchKey) this.getSelectItems();
    else if (this.comboItems && this.comboItems.length > 0) {
      this.makeSelectOptions();
    }
    if (this.codeGroupCd) this.getCodeGroupCombo(this.codeGroupCd);
  },
  mounted () {
  },
  beforeDestroy () {
  },
  destroyed () {
  },
  updated () {
  },
  //* methods */
  methods: {
    /** Call API service **/
    getSelectItems () {
      if (!this.itemSearchKey) {
        this.items = this.comboItems;
        return;
      }
    },
    /** /Call API service **/

    /** Events, Callbacks (버튼 제외) **/
    input () {
      // TODO : 부모에게 변경여부 전달
      this.$emit('input', this.vValue);
    },
    /** /Events, Callbacks (버튼 제외) **/

    /** 기타 Logic **/
    getSelectItem (_pk) {
      if (!_pk) return null;

      var self = this;
      var filter = this.$_.filter(this.items, (_item) => {
        return _item.value === _pk;
      });

      if (filter.length > 0) return filter[0];
      return null;
    },

    getCodeGroupCombo(codeGroupCd) {
      if (codeGroupCd) {
        let options = []
        let tempComboITems = [];
        const sucess = (_result) => {
          tempComboITems = _result.data;

          this.$_.forEach(tempComboITems, (_item) => {
              options.push({
                text: _item[this.itemText],
                value: _item[this.itemValue],
              });
            });

            this.items = options;
          }
        this.$comm.reqHttp("GET", this.$format('/api/manage/codemaster/getselect/{0}', codeGroupCd), {}, sucess);
      }
    },
    /**
     * 모델 items 에서 itemText와 itemValue prop를 이용해서, bootstrap select에 적합한 option을 생성
     */
    makeSelectOptions () {
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
          value: _item[this.itemValue]
        });
      });
      this.items = options;
    }
  }
  /** /기타 Logic **/
};
</script>
<style>
label {
  padding: 0;
}
</style>