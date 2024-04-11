<!--
  목적 : 안전운전절차서
  Detail : 안전운전절차서 화면
  *
  examples:
  *
  -->
<template>
  <saf-attach-file
    :attachFileGrp.sync="attachFileGrp"
  />
</template>

<script>
import SafAttachFile from '@/pages/common/attachFile/safAttachFile';
export default {
  /* attributes: name, components, props, data */
  name: 'operation-procedure',
  components: {
    SafAttachFile
  },
  props: {},
  data() {
    return {
      attachFileGrp: {
        taskClassNm: 'OPERATION_PROCEDURE',
        taskKey: '',
        docuKindCd: 'OPPRC',
        taskFlag: 'SAF',
        refTableId: '',
        prcsEditable: true,
        label: '안전운전절차서',
      },
    };
  },
  watch: {
    tabIndex() {
      this.loadComponent();
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
    },
  },
};
</script>