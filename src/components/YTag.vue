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
    <b-col :sm="labelWidth" v-if="label!=''">
      <y-label :name="name" :size="size" :label="label" :icon="icon" :required="required"></y-label>
    </b-col>
    <b-col v-if="editable" :sm="width">
      <el-tag
        :key="tag"
        v-for="tag in vValue"
        :closable="!disabled && editable"
        :disable-transitions="false"
        :state="state"
        :name="name"
        style="margin-left:5px;"
        @close="handleClose(tag)"
      >{{tag}}</el-tag>
      <el-input
        class="input-new-tag"
        v-if="tagInputVisible"
        v-model="tagInput"
        ref="saveTagInput"
        size="mini"
        @keyup.enter.native="handleInputConfirm"
        @blur="handleInputConfirm"
      ></el-input>
      <el-button
        v-else-if="!tagInputVisible && !onlyText && !disabled && editable"
        class="button-new-tag"
        size="small"
        @click="showInput"
      >+ {{newLabelText}}</el-button>
    </b-col>
  </b-row>
</template>

<script>
import selectConfig from '@/js/selectConfig';
export default {
  name: 'y-tag',
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
      default: 'sm',
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
    onlyText: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      tagInputVisible: false,
      tagInput: '',
      vValue: [],
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
  },
  watch: {
    // TODO : 부모의 v-model 변경을 감시(예를 들면, db로부터 데이터를 조회 한 후 값을 바인딩 할 경우)
    value: {
      handler: function(newValue, oldValue) {
        this.vValue = this.value;
      },
      deep: true,
    },
    // onlyText () {
    //   if (this.onlyText) {
    //     this.tagInputVisible = false;
    //   }
    // },
    // state () {
    //   if (this.state) {
    //     this.$nextTick(() => {
    //       $(this.$refs.input.$el).removeClass('is-valid').addClass('valid');
    //     });
    //   } else {
    //     this.$nextTick(() => {
    //       $(this.$refs.input.$el).removeClass('is-invalid').addClass('invalid');
    //     });
    //   }
    // }
  },
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
  },
  mounted() {
    this.init();
  },
  beforeDestory() {
  },
  methods: {
    init() {
      this.vValue = this.value;
    },
    handleClose(tag) {
      this.vValue.splice(this.vValue.indexOf(tag), 1);
    },
    showInput() {
      this.tagInputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm() {
      let inputValue = this.tagInput;
      if (inputValue) {
        if (this.$_.indexOf(this.vValue, inputValue) !== -1) {
          window.getApp.$emit('ALERT', {
            title: '안내',
            message: '이미존재하는항목입니다.',
            type: 'warning',
          });
          return;
        }
        this.vValue.push(inputValue);
        this.$emit('input', this.vValue);
      }
      this.tagInputVisible = false;
      this.tagInput = '';
    },
  },
};
</script>
<style>
.el-tag + .el-tag {
  /* margin-left: 10px; */
}
.button-new-tag {
  /* margin-left: 10px; */
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  /* margin-left: 10px; */
  vertical-align: bottom;
}
</style>
