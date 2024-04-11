<!--
  목적 : 태그
  작성자 : kdh
  Detail :
  *
  examples:
  *
  -->
<template>
  <b-row>
    <b-col :sm="labelWidth" v-if="label != ''">
      <y-label
        :name="name"
        :size="size"
        :label="label"
        :icon="icon"
        :required="required"
      ></y-label>
    </b-col>
    <b-col :sm="width">
      <el-tag
        :key="tag.code + '_' + index"
        v-for="(tag, index) in vValue"
        :closable="!disabled && editable"
        :disable-transitions="false"
        :state="state"
        :name="name"
        :size="size"
        :type="isNoBadge && tag.isSelect ? '' : 'info'"
        style="margin-left: 5px;"
        :class="tagClass"
        @click="handleClickTag(tag, index)"
        @close="handleClose(tag)"
        >
          {{ tag.name ? tag.name : '&emsp;&emsp;&emsp;'}}
          <b-badge v-if="showClickTag && tag.isSelect" variant="dark">Select</b-badge>
        </el-tag
      >
      <el-button
        v-if="!disabled && editable"
        class="button-new-tag"
        size="mini"
        @click="showInput"
        >+ {{ newLabelText }}</el-button
      >
    </b-col>
  </b-row>
</template>

<script>
export default {
  name: 'y-tag-structure',
  props: {
    // TODO : 부모의 v-model의 값을 받아오는 속성
    value: {
      type: Array,
      default: null,
    },
    type: {
      type: String,
      default: 'edit',
    },
    editable: {
      type: Boolean,
      default: true,
    },
    // 필수 입력 여부
    required: {
      type: Boolean,
      default: false,
    },
    // 라벨 텍스트
    label: {
      type: String,
      default: '',
    },
    newLabelText: {
      type: String,
      default: 'New tag',
    },
    size: {
      type: String,
      default: 'mini',
    },
    icon: {
      type: String,
      default: '',
    },
    // 사용 여부
    disabled: {
      type: Boolean,
      default: false,
    },
    // 사용 여부
    width: {
      type: Number,
      default: 8,
    },
    // veeValidate 유효성 검사
    state: {
      type: Boolean,
      default: null,
    },
    name: {
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
    controleClose: {
      type: Boolean,
      default: false,
    },
    isVerticalSub: {
      type: Boolean,
      default: false,
    },
    isClick: {
      type: Boolean,
      default: false,
    },
    showClickTag: {
      type: Boolean,
      default: false,
    },
    customClickTag: {
      type: Number,
      default: -1,
    },
    refresh: {
      type: Boolean,
      default: false,
    },
    isNoBadge: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      vValue: [],
      defaulData: [],
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
    validState() {
      return this.state === null ? null : this.state;
    },
    tagClass() {
      let returnText = this.isClick ? 'click-tag' : '';
      returnText = this.isVerticalSub ? returnText + ' vertical-sub-tag' : returnText;
      return returnText;
    },
  },
  watch: {
    // TODO : 부모의 v-model 변경을 감시(예를 들면, db로부터 데이터를 조회 한 후 값을 바인딩 할 경우)
    value: {
      handler: function(newValue, oldValue) {
        this.makeSelectOptions();
        this.defaulData = this.value;
      },
      deep: true,
    },
    customClickTag() {
      if (this.customClickTag > -1 && this.vValue && this.vValue.length > 0 && this.vValue[this.customClickTag]) {
        this.handleClickTag(this.vValue[this.customClickTag], this.customClickTag)
      }
    },
    refresh() {
      if (this.vValue && this.vValue.length > 0) {
        let refreshIndex = 0;
        if (this.customClickTag > -1 && this.vValue[this.customClickTag]) {
          refreshIndex = this.customClickTag;
        }
        this.handleClickTag(this.vValue[refreshIndex], refreshIndex)
      }
    },
  },
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.makeSelectOptions();
  },
  mounted() {},
  beforeDestory() {},
  methods: {
    makeSelectOptions() {
      var options = [];
      if (!this.value || this.value.length === 0) {
        this.vValue = options;
        return options;
      }
      this.$_.forEach(this.value, (_item) => {
        options.push({
          name: _item[this.itemText],
          code: _item[this.itemValue],
        });
      });
      this.vValue = options;
    },
    handleClose(tag) {
      if (!this.controleClose) {
        this.vValue.splice(
          this.$_.findIndex(this.vValue, { code: tag.code }),
          1
        );
        let tempData = this.$_.clone(this.defaulData);
        let index = 0;
        this.$_.forEach(tempData, (item) => {
          if (item[this.itemValue] === tag.code) {
            this.defaulData.splice(index, 1);
            return false;
          }
          index++;
        });
        this.$emit('input', this.defaulData);
      } else {
        this.$emit('closeTag', tag);
      }
    },
    showInput() {
      this.$emit('customNewTag');
    },
    handleClickTag(tag, index) {
      if (!tag) return;
      this.$_.forEach(this.vValue, item => {
        item.isSelect = false;
      })
      tag.isSelect = true;
      this.$forceUpdate();
      this.$emit('handleClickTag', { tag: tag, index: index });
    }
  },
};
</script>
<style>
.button-new-tag {
  /* margin-left: 10px; */
  height: 32px;
  line-height: 30px;
  padding-top: 0 !important;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  /* margin-left: 10px; */
  vertical-align: bottom;
}
.click-tag {
  cursor: pointer;
}
.vertical-sub-tag {
  vertical-align: sub;
}
</style>
