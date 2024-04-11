<!--
  목적 : 교육계획 등록-> 교육자료탭
  Detail : 교육자료 검색 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row>
      <!-- 교육 자료 상세 -->
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 저장 -->
              <y-btn
                :param="eduMaster"
                title="L0000002474"
                color="orange"
                action-type="POST"
                @btnClicked="btnInsertClickedCallback"
              />
              <!-- 닫기 -->
              <y-btn title="L0000000881" @btnClicked="closePopup2" />
            </div>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <y-data-table
            ref="answerTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :useRownum="false"
            v-model="gridOptions.selectedItems"
            @tableLinkClicked="tableLinkClicked"
          >
            <el-table-column type="selection" slot="selection" align="center" width="55"></el-table-column>
          </y-data-table>
        </b-col>
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  /* attributes: name, components, props, data */
  name: 'edu-plan-exam-add',
  props: {
    popupParam: {
      type: Object,
      default: {
        safEduCourseNo: 0,
      },
    },
  },
  data: () => ({
    eduMaster: {
      // examNm: '',
    },

    gridOptions: {
      header: [],
      data: [],
      height: '150',
      selectedItems: [],
    },
    popupOptions: {
      target: null,
      title: '',
      visible: false,
      width: '80%',
      top: '10px',
      param: {},
      closeCallback: null,
    },
    editable: true,
  }),
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  update() {},
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

      this.gridOptions.header = [
        {
          text: 'L0000002616', /* 제목 */
          name: 'title',
          width: '200px',
          align: 'center',
          url: 'true',
        },
      ];
      // this.gridOptions.data = [{ rightAnswer: '', orderNo: 1, answer: '' }];

      this.getList();
    },

    tableLinkClicked(header, data) {
      if (data === null) return;
      this.popupOptions.target = () =>
        import(`${'./educationMaterialDetailPopup.vue'}`);
      this.popupOptions.title = 'L0000000621'; /* 교육자료 상세 */
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      this.popupOptions.top = '10px';
      this.popupOptions.param = data;
      this.popupOptions.closeCallback = this.closePopup;
    },

    // 검색
    btnSearchClickedCallback() {
      this.getList();
    },
    // 저장
    btnInsertClickedCallback() {
      this.closePopup2(this.gridOptions.selectedItems);
    },
    // 닫기
    closePopup2(data) {
      this.$emit('closePopup', data);
    },
    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
    },

    getList() {
      this.$http.url = this.$format(
        selectConfig.saf.education.eduMaster.getProblems.url,
        this.popupParam.safEduCourseNo,
        0
      );
      this.$http.type = 'GET';
      this.$http.param = [];
      this.$http.request(
        _result => {
          this.gridOptions.data = this.$_.clone(_result.data);

          if (_result.data[0] !== undefined) {
            this.$_.forEach(_result.data[0].checkData, _item => {
              this.checkData.push({ eduMatNo: Number(_item) });
            });
          } else {
            this.checkData = [];
          }
        },
        _error => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            'M0000000016' /* 작업 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요. */
          );
        }
      );

      // this.gridOptions.data = [
      //   {
      //     eduAttNm: '안전',
      //     eduCourseNm: '정기안전보건교육',
      //     materialNm: '보건 교육자료',
      //     createUserNm: '관리자',
      //     createDt: '2019-08-01',
      //   },
      // ];
    },
  },
};
</script>