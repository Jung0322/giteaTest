<!--
  목적 : 경영 > 게시판 > 인허가현황 등록/수정 > 내용 탭
  작성자 : ksw
  Detail : 인허가현황 등록/수정 > 내용 등록/수정
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <!-- 내용 -->
          <y-textarea
            :width="10"
            :maxlength="300"
            ui="bootstrap"
            label="L0000000810"
            :editable="editable"
            name="contents"
            v-model="referenceInfo.contents"
          ></y-textarea>
        </b-col>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  /** attributes: name, components, props, data **/
  name: 'reference-room-add-contents',
  props: {
    editable: true,
    referenceInfo: {
      type: Object,
      default: {
        contents: '',
      },
    },
  },
  data: () => ({}),
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {},
  },
};
</script>
