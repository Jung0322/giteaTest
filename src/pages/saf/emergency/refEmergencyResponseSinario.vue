<!--
  목적 : 훈련시나리오 등록-> 관련 비상대응시나리오 탭
  작성자 : LHJ
  Detail : 훈련시나리오 등록-> 관련 비상대응시나리오 탭
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row>
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1"></div>
          <div slot="buttonGroup" class="float-right mb-1">
            <y-btn
              v-if="editable"
              title="추가"
              color="orange"
              @btnClicked="btnAddClicked()"
            />
            <y-btn
              v-if="editable"
              title="삭제"
              color="red"
              @btnClicked="deleteRow()"
            />
          </div>
          <y-data-table
            label="관련 비상대응시나리오 목록"
            :print="true"
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :editable="editable"
            :useRownum="false"
            v-model="gridOptions.selectedValue"
            :checkItemData="checkData"
            @tableLinkClicked="tableLinkClicked"
            :popMode="true"
          >
            <el-table-column
              v-if="editable"
              type="selection"
              slot="selection"
              align="center"
              width="55"
            ></el-table-column>
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
  name: 'ref-emergency-response-sinario',
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

  data: () => ({
    gridOptions: {
      header: [],
      data: [],
      height: '300',
      selectedValue: [],
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
    checkData: [],
  }),
  watch: {},
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
      this.editable = this.parentEditable;
      this.gridOptions.header = [
        {
          text: '제목',
          name: 'title',
          width: '100px',
          align: 'left',
          url: 'true',
        },
      ];

      this.getList();
    },

    getList() {
      //   this.$http.url = this.$format(
      //   );
      //   this.$http.type = 'GET';
      //   this.$http.param = [];
      //   this.$http.request(
      //     (_result) => {
      //       this.gridOptions.data = this.$_.clone(_result.data);
      //     },
      //     (_error) => {
      //       window.getApp.$emit(
      //         'APP_REQUEST_ERROR',
      //         '작업 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.'
      //       );
      //     }
      //   );
    },
    // 행 삭제
    deleteRow() {
      if (this.gridOptions.selectedValue && this.gridOptions.selectedValue.length > 0) {
        this.$_.forEach(this.gridOptions.selectedValue, item => {
          this.gridOptions.data = this.$_.reject(this.gridOptions.data, item);
        });
      } else {
        window.getApp.$emit('ALERT', {
          title: '안내',
          message: '한 개 이상 선택하세요.',
          type: 'warnning',
        });
      }
    },
    // 관련 비상대응시나리오 링크
    tableLinkClicked(header, data) {
      if (data === null) return;
    },
    // 추가
    btnAddClicked() {
      //   this.popupOptions.target = () => import(`${'./'}`);
      //   this.popupOptions.title = '관련 비상대응시나리오 추가';
      //   this.popupOptions.visible = true;
      //   this.popupOptions.width = '40%';
      //   this.popupOptions.top = '10px';
      //   this.popupOptions.param = {};
      //   this.popupOptions.closeCallback = this.closePopup2;
    },

    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
    },

    closePopup2(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      for (let i = 0; i < data.length; i++) {
        let same = false;
        for (let j = 0; j < this.gridOptions.data.length; j++) {
          if (data[i].eduMatNo === this.gridOptions.data[j].eduMatNo) {
            same = true;
            break;
          }
        }
        if (same === false) {
          this.gridOptions.data.splice(0, 0, data[i]);
        }
      }
      this.saveRow();
    },
  },
};
</script>
