<!--
  목적 : (반드시 기입하세요) 컴포넌트
  작성자 : (이니셜로 반드시 입력하세요)
  Detail :
  *
  examples:
  *
  -->
<template>
  <div>
    <template v-if="isMetroUi">
      <div>MetroUI용 컴포넌트는 준비중입니다.</div>
    </template>
    <template v-else>
      <b-row  :class="rowClass">
        <b-col :sm="labelWidth">
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
          v-if="editable && !disabled"
          :sm="width"
        >
          <!-- 좌측 선택 영역 -->
          <b-card class="main-card border">
            <b-row align-h="center" align-v="center">
              <b-col sm="12">
                <b-card-group deck>
                  <b-card 
                    no-body
                    class="card">
                    <div slot="header" class="title-height">
                      <b-row>
                        <b-col sm="1" md="1" lg="1" xl="1" class="col-xxl-1">
                          <b-form-checkbox 
                            v-model="allLeftSelected"
                            :indeterminate="indeterminateLeft"
                            aria-describedby="flavours"
                            aria-controls="flavours"
                            @change="toggleLeftAll"
                          >
                          <!-- <y-label label="전체선택"></y-label> -->
                          </b-form-checkbox>
                        </b-col>
                        <b-col sm="10" md="10" lg="10" xl="10" class="col-xxl-10">
                          <y-text
                            :ui="ui" 
                            placeholder="검색어를 입력하세요."
                            v-model="filterText"
                          >
                          </y-text>
                        </b-col>
                      </b-row>
                    </div>
                    <div class="card-text overflow pl-2" :style="'height:' + height">
                        <y-loader
                          :is-loading="filteredOptions.length <= 0  && !needDefaultView"
                        />
                        <b-form-checkbox-group
                          stacked
                          :item-text="itemText"
                          :item-value="itemValue"
                          :size="size"
                          v-model="selectedLeftValues"
                          :options="filteredOptions" />
                    </div>
                  </b-card>
                  <!-- /좌측 선택 영역 -->

                  <!-- 가운데 버튼 영역 -->
                  <div>
                    <b-row align-v="center" style="height: 100%;">
                        <b-col>
                          <b-row class="mb-2">
                            <b-col>
                              <b-button 
                                size="sm"
                                @click.stop="moveRight"
                              >
                                <f-icon icon="angle-right" />
                              </b-button>
                            </b-col>
                          </b-row>
                          <b-row>
                            <b-col>
                            <b-button 
                              size="sm"
                              @click.stop="moveLeft"
                              >
                              <f-icon icon="angle-left" />
                            </b-button>
                            </b-col>
                          </b-row>
                        </b-col>
                    </b-row>
                  </div>
                  <!-- /가운데 버튼 영역 -->

                  <!-- 우측 선택된 영역 -->
                  <b-card 
                    no-body
                    class="card">
                    <div slot="header" class="title-height">
                      <b-row>
                        <b-col sm="1" md="1" lg="1" xl="1" class="col-xxl-1">
                          <b-form-checkbox 
                            v-model="allRightSelected"
                            :indeterminate="indeterminateRight"
                            aria-describedby="flavours"
                            aria-controls="flavours"
                            @change="toggleRightAll"
                          >
                          <!-- <y-label label="전체선택"></y-label> -->
                          </b-form-checkbox>
                        </b-col>
                        <b-col sm="10" md="10" lg="10" xl="10" class="col-xxl-10">
                          <small>{{selectedTitle}}</small>
                        </b-col>
                      </b-row>
                    </div>
                    <div class="card-text overflow pl-2" :style="'height:' + height">
                      <b-form-checkbox-group 
                        stacked
                        :size="size"
                        :item-text="itemText"
                        :item-value="itemValue"
                        v-model="selectedRightValues" 
                        :options="selectedOptions"
                        />
                      </div>
                  </b-card>
                  <!-- /우측 선택된 영역 -->
                </b-card-group>
              </b-col>
            </b-row>
          </b-card>
        </b-col>
        <b-col v-else>
          <b-card 
            no-body
            class="card">
            <div slot="header" class="title-height">
              <b-row>
                <b-col sm="10" md="10" lg="10" xl="10" class="col-xxl-10">
                  <small>{{selectedTitle}}</small>
                </b-col>
              </b-row>
            </div>
            <div class="card-text overflow pl-2" :style="'height:' + height">
              <b-form-checkbox-group 
                stacked
                :size="size"
                :item-text="itemText"
                :item-value="itemValue"
                v-model="selectedRightValues" 
                :disabled="true"
                :options="selectedOptions"
                />
              </div>
          </b-card>
        </b-col>
      </b-row>
    </template>
  </div>
</template>

<script>
export default {
  /** attributes: name, components, props, data **/
  name: 'y-shuttlebox',
  $_veeValidate: {
    name () {
      return this.name;
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
    // 선택된 항목에 표시될 라벨
    subLabel: {
      type: String,
      default: '선택된 항목'
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
      type: Array,
      default: null
    },
    size: {
      type: String,
      default: 'sm'
    },
    // 컴포넌트의 너비(1~12)
    width: {
      type: Number,
      default: 12
    },
    // 부모로 부터 받아온 좌측 항목값
    items: {
      type: Array,
      default: null
    },
    // shuttle box 높이
    height: {
      type: String,
      default: '100px'
    },
    // b-row에 추가할 클래스
    rowClass: {
      type: String,
      default: 'mb-2'
    },
    // ITEM이 존재하지 않아도 화면에 표시해야 할 경우 true
    needDefaultView: {
      type: Boolean,
      default: false
    },
    // 여러 항목 중 화면에 text로 보여지는 정보를 가진 attribute 명(option 생성시 사용됨)
    itemText: {
      type: String,
      required: true
    },
    // 여러 항목 중 실제 값을 가져야 하는 attribute 명(option 생성시 사용됨)
    itemValue: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      default: ''
    },
    // 필수 입력 여부
    required: {
      type: Boolean,
      default: false
    },
    // indeterminateLeft: {
    //   type: Boolean,
    //   default: false
    // },
    // indeterminateRight: {
    //   type: Boolean,
    //   default: false
    // }
  },
  // TODO: 화살표 함수(=>)는 data에 사용하지 말 것
  //    data: () => { return { a: this.myProp }}) 화살표 함수가 부모 컨텍스트를 바인딩하기 때문에 this는 예상과 달리 Vue 인스턴스가 아니기 때문에 this.myProp는 undefined로 나옵니다.
  //    참고url: https://kr.vuejs.org/v2/api/index.html#data
  data () {
    return {      
      discoverItems: [], // 원본 항목을 value, text
      selectedLeftValues: [], // 좌측의 기준 항목에서 체크된 item
      selectedRightValues: [], // 우측의 체크박스로 선택된 항목이며, 삭제 전용이기 때문에 부모에게 전달하는 정보와 상관 없음

      filteredOptionsOrg: [], // 좌측의 기준 항목 원본(부모 items의 원본)
      filteredOptions: [],  // 좌측의 기준 항목에서 text filtering 된 배열로써 화면에 표시되는 항목      
      selectedOptions: [],  // 우측에 표시되는 선택된 항목이며, 이 항목의 value값의 배열이 부모에게 전달됨      
      filterText: '',
      allLeftSelected: false, // 좌측 전체 선택 여부
      allRightSelected: false, // 우측 전체 선택 여부
      indeterminateLeft: false,
      indeterminateRight: false,
    };
  },
  watch: {
    // TODO : 부모의 v-model 변경을 감시(예를 들면, db로부터 데이터를 조회 한 후 값을 바인딩 할 경우)
    value () {      
      // TODO : 선택된 항목이 있으면 skip
      // 예) 좌측Options인 filteredOptions에 없는 항목이 있지만, 선택 항목으로 나와야 할 경우

      // 선택값이 변경되면 기존에 체크된값을 초기화 함
      this.selectedRightValues = [];
      this.selectedOptions = this.getItemsOfKey(this.discoverItems, this.value);
      this.filteredOptionsOrg =  this.getItemsOfWithout(this.discoverItems, this.selectedOptions);
      this.filteredOptions = this.$_.clone(this.filteredOptionsOrg);
    },
    items () {
      // 원본 items 를 options 에 맞도록 변경
      this.discoverItems = this.makeSelectOptions(this.items);      
      this.selectedOptions = this.getItemsOfKey(this.discoverItems, this.value);

      // 새로 바인딩 되면서 기존에 체크된값을 초기화 함
      this.selectedLeftValues = [];
      this.filteredOptionsOrg =  this.getItemsOfWithout(this.discoverItems, this.selectedOptions);
      this.filteredOptions = this.$_.clone(this.filteredOptionsOrg);
    },
    /**
     * Text Search
     */
    filterText () {
      if (!this.filterText) return this.init();
      this.filteredOptions = this.$_.filter(this.filteredOptionsOrg, (_item) => {
        return _item.text.toLowerCase().indexOf(this.filterText.toLowerCase()) >= 0;
      });
    },
    /**
     * 선택된 값이 바뀔때 마다 부모의 v-model에 값을 전달
     */
    selectedOptions () {
      if (!this.selectedOptions || !this.selectedOptions.length) return;
      var selectedValues = this.$_.map(this.selectedOptions, 'value');
      if (this.$_.isEqual(this.value, selectedValues)) return;
      this.$emit('input', selectedValues);
    },
    /**
     * 좌측 리스트에 체크 될 때마다 전체 선택 체크박스 모습 바뀌도록 한다
     */
    selectedLeftValues (newVal, oldVal) {
      if (newVal.length === 0) {
        this.indeterminateLeft = false;
        this.allLeftSelected = false;
      } else if (newVal.length === this.filteredOptions.length) {
        this.indeterminateLeft = false;
        this.allLeftSelected = true;
      } else {
        this.indeterminateLeft = true; 
        this.allLeftSelected = false;
      }
    },
    /**
     * 우측 리스트에 체크 될 때마다 전체 선택 체크박스 모습 바뀌도록 한다
     */
    selectedRightValues (newVal, oldVal) {
      if (newVal.length === 0) {
        this.indeterminateRight = false;
        this.allRightSelected = false;
      } else if (newVal.length === this.selectedOptions.length) {
        this.indeterminateRight = false;
        this.allRightSelected = true;
      } else {
        this.indeterminateRight = true;
        this.allRightSelected = false;
      }
    },
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
      var selectedTexts = this.$_.map(this.selectedOptions, 'text');
      var text = selectedTexts.length ? selectedTexts.join(', ') : '';
      return text;
    },
    selectedTitle () {
      var subLabel = ' (' + this.selectedOptions.length + '개)';
      return this.subLabel + subLabel;
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
      this.discoverItems = this.makeSelectOptions(this.items);
      this.selectedOptions = this.getItemsOfKey(this.discoverItems, this.value);
      
      this.filteredOptionsOrg =  this.getItemsOfWithout(this.discoverItems, this.selectedOptions);
      this.filteredOptions = this.$_.clone(this.discoverItems);

    },
    /** /초기화 관련 함수 **/
    
    /** Call API service
    * Naming Rule: get, post, put 등의 RESTFul verb를 접두사로 사용하고 그 뒤에 관련 모델명을 Camel case로 추가하세요.
    * Naming Rule: get의 경우 복수의 데이터조회(리스트 데이터 등)시에는 복수를 나타내는 접미사 "s"를 붙여주세요.
    * ex) getExamData () {}
    * ex) getExamDatas () {}
    */   
    /** /Call API service **/

    /** Event, CallBack **/
    /**
     * > 버튼 클릭시, 선택된 항목으로 추가
     */
    moveRight () {
      if (!this.selectedLeftValues || this.selectedLeftValues.length <=0) return;
      // 1. 왼쪽 항목중 선택된 항목만 가져옴
      var filtered = this.getItemsOfKey(this.filteredOptionsOrg, this.selectedLeftValues);
      // 2. 추가된 아이템 중 기존 항목이 있는지 체크
      var filteredDuplicatedArray = this.$comm.removeDuplicatedArray(this.selectedOptions, filtered);     
      // 3. 선택된 항목중에서 기존에 선택된 항목을 제외한 항목을 가져와서 기존 항목과 합침
      if (filteredDuplicatedArray.length > 0) this.selectedOptions = this.$_.concat(this.selectedOptions, filteredDuplicatedArray);
      this.indeterminateLeft = false;
      this.allLeftSelected = false;
      this.selectedLeftValues = [];
    },
    /**
     * < 버튼 클릭시, 선택된 항목에서 제거
     */
    moveLeft () {
      if (!this.selectedRightValues || this.selectedRightValues.length <=0) return;
      // 1. 오른쪽 항목 중 선택된 항목만 가져옴
      var checked = this.getItemsOfKey(this.selectedOptions, this.selectedRightValues);
      // 2. 오른쪽 항목 중 선택된거 제거
      this.selectedOptions = this.getItemsOfWithout(this.selectedOptions, checked);
      // 3. 왼쪽 항목에 추가
      this.filteredOptionsOrg =  this.getItemsOfWithout(this.discoverItems, this.selectedOptions);
      this.filteredOptions = this.$_.clone(this.filteredOptionsOrg);

      // 4. 선택값이 하나도 없을경우 부모에게 전달
      if (this.selectedOptions.length === 0) {
        this.$emit('input', this.selectedOptions);
      }

      this.indeterminateRight = false;
      this.allRightSelected = false;
      this.selectedRightValues = [];
    },
    /** /Event, CallBack **/
    
    /** 기타 function **/
    /**
     * items 항목 중 values 에 있는 항목 반환
     */
    getItesmOfInclude (_items, _values) {
      var options = [];
      if (!_items && !_items.length) return options;
      this.$_.forEach(_values, (_value) => {
        if (this.$_.indexOf(_items, _value) > -1) {
          options.push(_value);
        }
      });
      return options;
    },

    /**
     * items 항목 중 values 에 있는 항목을 제외 후 반환
     */
    getItemsOfWithout (_items, _values) {
      var options = [];
      if (!_items && !_items.length) return options;
      this.$_.forEach(_items, (_item) => {
        if (this.$_.indexOf(_values, _item) < 0) {
          options.push(_item);
        }
      });
      return options;
    },

    /**
     * options 항목 중 array 에 해당하는 options 항목 반환
     */
    getItemsOfKey (_items, _keyArray) {
      var options = [];
      if (!_items && !_items.length) return options;
      this.$_.forEach(_items, (_item) => {
        if (this.$_.indexOf(_keyArray, _item.value) > -1) {
          options.push(_item);
        }
      });
      return options;
    },

    /**
     * text, value 를 사용하는 options 항목으로 변경
     */
    makeSelectOptions (_items) {
      var options = [];
      if (!_items && !_items.length) return options;
      this.$_.forEach(_items, (_item) => {
        options.push({
          'text': _item[this.itemText],
          'value': _item[this.itemValue]
        });
      });
      return options;
    },

    toggleLeftAll (checked) {
      this.selectedLeftValues = checked ? this.$_.map(this.filteredOptions.slice(), 'value') : [];
    },
    toggleRightAll (checked) { 
      this.selectedRightValues = checked ? this.$_.map(this.selectedOptions.slice(), 'value') : [];
    }
    /** /기타 function **/
  }
};
</script>

<style scoped>
  .card {
    width: 45%;
  }
  .border {
    border: 1px dotted #0000ff;
  }
  .main-card {
    width: 100%;
  }
  .title-height {
    height: 30px;
  }
  .overflow {
    overflow-y: auto;
  }

</style>