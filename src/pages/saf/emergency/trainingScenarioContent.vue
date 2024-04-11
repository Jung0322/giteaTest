<!--
  목적 : 안전운전계획 > 비상사태 대비대응 > 훈련시나리오 내용 탭
  작성자 : LHJ
  Detail : 안전운전계획 > 비상사태 대비대응 > 훈련시나리오 내용 탭
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row>
      <b-col>
        <b-row>
          <b-col sm="12">
            <!-- 내용 -->
            <y-textarea
              label="L0000000810"
              ui="bootstrap"
              :maxlength="600"
              :rows="6"
              :editable="editable"
              v-model="trainingScenario.contents"
            ></y-textarea>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  name: 'training-sinario-content',
  props: {
    // 부모로부터 받은 param data
    trainingScenario: {
      trainSceNo: 0, // 훈련시나리오번호
      trainSceGrpNo: 0, // 훈련시나리오그룹번호
      plantCd: '', // 사업장코드
      deptCd: '', // 부서코드
      trainSceTypeCd: '', // C분류코드
      sceNum: '', // 문서번호
      title: '', // 제목
      revNum: '', // 재개정번호
      contents: '', // 내용
      revContents: '', // 개정내용
      useYn: '', // 사용여부
      delYn: '', // 삭제여부
      createUserId: '', // 등록일_제개정일
      createDt: '', // 등록자ID
      updateUserId: '', // 최종수정일
      updateDt: '', // 최종수정자ID
    },
    parentEditable: true,
  },
  data() {
    return {
      editable: true,
    };
  },
  watch: {
    parentEditable() {
      this.editable = this.parentEditable;
    },
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mouted() {},
  methods: {
    init() {
      console.log('editable', this.editable);
      console.log('parentEditable', this.parentEditable);
      this.editable = this.$route.meta.editable;
    },
  },
};
</script>

<style></style>
