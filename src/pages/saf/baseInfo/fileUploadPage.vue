<!--
  목적 : 작업허가서 항목 관리
  Detail : 작업허가서 항목 등록/수정화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 등록 -->
    <b-row class="mt-1">
      <b-col sm="6">
        <b-col sm="12" class="px-0">
          <y-file-upload
            @fileUploadComplete="fileUploadComplete"
          >
          </y-file-upload>
        </b-col>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  /* attributes: name, components, props, data */
  name: 'fileUploadPage',
  props: {
  },
  data: () => ({
  }),
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate () {
  },
  created () {
  },
  beforeMount () {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  updated () {
  },
  mounted () {
  },
  beforeDestroy () {
  },
  //* methods */
  methods: {
    init () {
    },
    getList () {
    },
    fileUploadComplete () {
    },
    btnSearchClickedCallback (_result) {
    },
    btnClickedErrorCallback (_result) {
    }
  }
};
</script>

<style>

</style>
