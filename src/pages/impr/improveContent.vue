<!--
  목적 : 개선내용
  Detail : 개선사항 상세내용 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 등록 -->
    <b-row>
      <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
        <!-- 조치일 -->
        <y-datepicker
          :width="6"
          :editable="editable"
          :disabled="disabled"
          label="L0000002690"
          type="today"
          name="actConfirmYmd"
          v-model="imprAct.actConfirmYmd"
        ></y-datepicker>
      </b-col>
      <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
       
        <y-textarea
          :width="9"
          :editable="editable"
          :maxlength="150"
          :disabled="disabled"
          :required="!disabled"
          label="L0000002666"
          ui="bootstrap"
          name="actResultContents"
          v-model="imprAct.actResultContents"
        />
      </b-col>
      <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
         <!-- 요청부서 조치결과검토 -->
        <y-textarea
          :width="9"
          :editable="editable"
          :maxlength="150"
          :disabled="disabled"
          label="L0000002054"
          ui="bootstrap"
          name="actResultReview"
          v-model="imprAct.actResultReview"
        />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  /* attributes: name, components, props, data */
  name: 'improve-content',
  props: {
    disabled: false,
    imprAct: {
      type: Object,
      default: {
        actConfirmYmd: '',
        actResultContents: '',
        actResultReview: '',
      },
    },
  },
  data() {
    return {
      editable: true,
    };
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  updated() {},
  mounted() {},
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
    },
  },
};
</script>