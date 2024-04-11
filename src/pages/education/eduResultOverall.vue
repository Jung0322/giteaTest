<!--
  목적 :교육결과 등록/수정 팝업 > 결과/총평 탭
  작성자 : kkc
  Detail : 교육결과 등록/수정 팝업 > 결과/총평 탭
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 검색 -->
    <b-row>
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 내용 -->
            <y-label label="L0000000810" icon="user-edit" color-class="cutstom-title-color" />
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <!-- 교육결과 요약 -->
              <y-textarea
                :width="10"
                :editable="editable"
                :disabled="viewMode || authDuringAppr || search"
                :maxlength="600"
                ui="bootstrap"
                label="L0000000627"
                name="eduResultSummary"
                v-model="eduMaster.eduResultSummary"
                :required="true"
              />
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <!-- 교육 총평 -->
              <y-textarea
                :width="10"
                :editable="editable"
                :disabled="viewMode || authDuringAppr || search"
                :maxlength="600"
                ui="bootstrap"
                label="L0000000623"
                name="eduEvalOpin"
                v-model="eduMaster.eduEvalOpin"
                :required="true"
              />
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  /* attributes: name, components, props, data */
  name: 'she-docu-detail-contents',
  props: {
    viewMode: false,
    authDuringAppr: false,
    search: false,
    eduMaster: {
      safEduMstNo: 0,
      eduAttCd: null,
      safEduCourseNo: null,
      eduTypeCd: null,
      deptCd: null,
      eduNm: '',
      duration: [],
      eduTime: 0,
      eduSYmd: '',
      eduEYmd: '',
      eduPlace: '',
      eduTeacher: '',
      eduContent: '',
      processStepCd: '',
      eduResultSummary: '',
      eduEvalOpin: '',
      personList: [],
    },
    parentEditable: null,
  },
  data() {
    return {
      editable: true,
    };
  },
  watch: {
    parentEditable: {
      handler: function(newValue, oldValue) {
        if (this.editable) {
          this.editable = this.parentEditable;
        }
      },
    },
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {},
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      if (this.editable) {
        this.editable = this.parentEditable;
      }
    },
  },
};
</script>