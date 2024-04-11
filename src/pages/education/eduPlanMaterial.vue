<!--
  목적 : 교육계획 등록-> 교육자료탭
  Detail : 교육자료 등록화면
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
            <!-- 교육자료 추가 -->
            <y-btn
              v-if="this.eduMaster.safEduMstNo !== 0 && !authDuringAppr && tabEditable && !search"
              title="L0000000671"
              color="orange"
              @btnClicked="btnAddClicked()"
            />
            <!-- 행 삭제 -->
            <y-btn
              v-if="this.eduMaster.safEduMstNo !== 0 && !authDuringAppr && tabEditable && !search"
              title="L0000003223"
              color="orange"
              @btnClicked="deleteRow()"
            />
          </div>
          <!-- 교육 자료 목록 -->
          <y-data-table
            label="L0000000620"
            :print="true"
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :messageCheck="this.eduMaster.safEduMstNo === 0"
            :message="gridMessage"
            :useRownum="false"
            v-model="gridOptions.selectedValue"
            :checkItemData="checkData"
            checkKey="eduMatNo"
            @tableLinkClicked="tableLinkClicked"
            :popMode="true"
          >
            <el-table-column
              v-if="!authDuringAppr && tabEditable && !search"
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
  name: 'edu-plan-exam',
  props: {
    authDuringAppr: false,
    search: false,
    tabEditable: false,
    eduMaster: {
      safEduMstNo: 0,
      eduAttCd: null,
      safEduCourseNo: 0,
      eduTypeCd: null,
      deptCd: null,
      eduNm: '',
      duration: [],
      eduGrpNo: 0,
      eduTime: 0,
      eduSYmd: '',
      eduEYmd: '',
      eduPlace: '',
      eduTeacher: '',
      eduContent: '',
      processStepCd: '',
      eduUserId: [],
      eduDeptCd: [],
      eduGroupCds: [],
      questionLsts: [],
      dataLsts: [],
    },
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
    materialList: [],
    gridMessage: 'M0000000279', /* 교육계획 등록 후 교육자료 추가 및 삭제가 가능합니다. */
  }),
  watch: {
    'eduMaster.safEduCourseNo': function(newValue, oldValue) {
      if (newValue != null) {
        this.getList();
      } else {
        this.gridOptions.data = [];
      }
    },
    'gridOptions.selectedValue': {
      handler: function(newValue, oldValue) {
        var dataLsts = [];

        this.gridOptions.selectedValue.forEach(element => {
          dataLsts.push(element.eduMatNo);
        });

        this.eduMaster.dataLsts = dataLsts;
      },
      deep: true,
    },
  },
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
      this.gridOptions.header = [
        {
          text: 'L0000002616', /* 제목 */
          name: 'title',
          width: '100px',
          align: 'left',
          url: 'true',
        },
      ];

      this.getList();
    },

    getList() {
      // alert(this.eduMaster.safEduMstNo);
      if (this.eduMaster.safEduCourseNo === null) {
        return;
      }
      this.$http.url = this.$format(
        selectConfig.saf.education.eduMaster.getProblems.url,
        this.eduMaster.safEduCourseNo,
        this.eduMaster.safEduMstNo
      );
      this.$http.type = 'GET';
      this.$http.param = [];
      this.$http.request(
        _result => {
          this.gridOptions.data = this.$_.clone(_result.data);
        },
        _error => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            'M0000000016' /* 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요. */
          );
        }
      );
    },

    saveRow() {
      let saveData = this.gridOptions.data;

      this.$http.url = this.$format(
        '/api/saf/education/eduplanmat/{0}',
        this.eduMaster.safEduMstNo
      );
      this.$http.type = 'POST';
      this.$http.param = saveData;
      this.$http.request(
        _result => {
          this.getList();
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    // 행 삭제
    deleteRow() {
      let deleteFlag = false;

      if (this.gridOptions.selectedValue.length > 0) {
        deleteFlag = true;
      }
      this.$_.forEach(this.gridOptions.selectedValue, item => {
        this.gridOptions.data = this.$_.reject(this.gridOptions.data, item);
      });

      this.saveRow();

      if (deleteFlag === true) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', /* 안내 */
          message: 'M0000000007', /* 정상적으로 삭제되었습니다. */
          type: 'success',
        });
      }
    },
    // 교육자료 링크
    tableLinkClicked(header, data) {
      if (data === null) return;
      if (this.eduMaster.safEduMstNo === 0) {
        this.popupOptions.target = () =>
          import(`${'./educationMaterialDetailPopup.vue'}`);
        this.popupOptions.title = 'L0000000621'; /* 교육자료 상세 */
        this.popupOptions.visible = true;
        this.popupOptions.width = '80%';
        this.popupOptions.top = '10px';
        this.popupOptions.param = data;
        this.popupOptions.closeCallback = this.closePopup;
      } else {
        this.popupOptions.target = () =>
          import(`${'./educationRegMaterialDetailPopup.vue'}`);
        this.popupOptions.title = 'L0000000621'; /* 교육자료 상세 */
        this.popupOptions.visible = true;
        this.popupOptions.width = '80%';
        this.popupOptions.top = '10px';
        this.popupOptions.param = data;
        this.popupOptions.closeCallback = this.closePopup;
      }
    },
    // 추가
    btnAddClicked() {
      this.popupOptions.target = () => import(`${'./eduPlanMaterialAdd.vue'}`);
      this.popupOptions.title = 'L0000000622'; /* 교육 자료 추가 */
      this.popupOptions.visible = true;
      this.popupOptions.width = '40%';
      this.popupOptions.top = '10px';
      this.popupOptions.param = {
        safEduCourseNo: this.eduMaster.safEduCourseNo,
      };
      this.popupOptions.closeCallback = this.closePopup2;
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
      // this.saveRow();
    },
  },
};
</script>