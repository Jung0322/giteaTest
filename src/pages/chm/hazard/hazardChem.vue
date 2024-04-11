<!--
  목적 : 물질관리 > 화학물질 > MSDS > MSDS 요약내용
  작성자 : kdh
  Detail : MSDS 요약내용 조회 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions">
      <b-row slot="search">
        <b-col sm="9">
          <b-row>
            <b-col sm="12">
              <!--유해화학물질 취급시설 자체점검대장  -->
              <y-label
                label="L0000005437"
                icon="user-edit"
                color-class="cutstom-title-color"
              />
            </b-col>
          </b-row>
          <b-card ref="fCard">
            <b-row>
              <b-col sm="12" md="6" lg="6" xl="6" class="col-xxl-6">
                <!-- 연 월 일 -->
                <y-datepicker
                  :width="8"
                  name="col1"
                  label="L0000005438"
                  :default="data.col1"
                  v-model="data.col1"
                />
              </b-col>
              <b-col sm="12" md="6" lg="6" xl="6" class="col-xxl-6">
                <!-- 점검시간 -->
                <y-datepicker
                  :width="8"
                  type="time"
                  :range="true"
                  name="col2"
                  label="L0000005439"
                  :default="data.col2"
                  v-model="data.col2"
                />
              </b-col>
              <b-col sm="12" md="6" lg="6" xl="6" class="col-xxl-6">
                <!-- 소속 -->
                <y-tree-dept label="L0000001662" v-model="data.col3" />
              </b-col>
              <b-col sm="12" md="6" lg="6" xl="6" class="col-xxl-6">
                <!-- 성명 -->
                <y-text
                  :width="8"
                  :disabled="true"
                  ui="bootstrap"
                  label="L0000001630"
                  name="col4"
                  v-model="data.col4"
                  :appendIcon="[{ icon: 'search', callbackName: 'searchUser' }]"
                  @searchUser="btnSearchUserClicked"
                ></y-text>
              </b-col>
              <!-- <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <b-row>
                <b-col sm="4">
                  <y-label label="서명" />
                </b-col>
                <b-col sm="8">
                  <el-image
                    :ref="'image' + index"
                    style="width: 70px; height: 70px"
                    :src="getSrc(data.col5)"
                    fit="contain"
                  ></el-image>
                </b-col>
              </b-row>
              </b-col>-->
            </b-row>
          </b-card>
        </b-col>

        <b-col sm="3">
          <b-row>
            <b-col sm="9">
              <!-- 서명 -->
              <y-label
                label="L0000001547"
                icon="user-edit"
                color-class="cutstom-title-color"
              />
            </b-col>
          </b-row>
          <b-card
            ref="hazardChemSignCard"
            class="hazardChemSignCard"
            style="cursor: pointer"
            @click="sign"
          >
            <b-row>
              <b-col sm="12">
                <b-img
                  :ref="'image'"
                  :src="data.col5"
                  :height="minHeight"
                  :blank="data.col5 ? false : true"
                  style="width: 100%"
                ></b-img>
                <!-- <el-image
                :ref="'image'"
                :src="data.col5"
                fit="contain"
                v-bind:style="ss"
              >
                <div slot="error" class="image-slot">
                </div>
                </el-image>-->
              </b-col>
            </b-row>
          </b-card>
        </b-col>
        <!-- <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
        <div class="float-left mt-2">
          <el-tag size="medium" type="info">
            <i class="el-icon-info"></i> 화학물질 선택시, 일반정보와 물질정보가 보이게 됩니다.
          </el-tag>
        </div>
        <div class="float-right mt-2">
          <y-btn :title="folderTitle" @btnClicked="folder" />
        </div>
        </b-col>-->
      </b-row>
    </y-search-box>

    <!-- <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
           점검 목록 
          <y-data-table
            label="L0000005440"
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
          ></y-data-table>
        </b-col>
      </b-col>
    </b-row> -->
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :editable="true"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000005440')"
          :useExcelExport="false"
          :enableCellMerge="true"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          :rowHeight="50"
        />
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
export default {
  name: 'hazard-chem',
  props: {},
  data() {
    return {
      data: {
        col1: '',
        col2: '',
        col3: '',
        col4: '',
        col5: '',
      },
      gridOptions: {
        name: 'hazardChem11',
        header: [],
        data: [],
        height: 'auto',
      },
      YAuiGrid: null,
      checkbox: [],
      editable: false,
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '50%',
        top: '0px',
        param: {},
        closeCallback: null,
      },
      minHeight: '80px',
    };
  },
  computed: {
    setStyle() {
      return (
        'width: 100%; height: 100%; min-height: ' +
        this.minHeight +
        '; max-height: ' +
        this.minHeight +
        ';'
      );
    },
  },
  watch: {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
    window.addEventListener('resize', this.resizeGrid);
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    window.addEventListener('resize', this.setGridSize);
    this.resizeGrid();
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.setGridSize);
  },
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      this.checkbox = [
        { code: '1', codeNm: this.$comm.getLangSpecInfoLabel('L0000005441') }, // 문제 없음
        { code: '2', codeNm: this.$comm.getLangSpecInfoLabel('L0000005442') }, // 자체점검시 조치완료
        { code: '3', codeNm: this.$comm.getLangSpecInfoLabel('L0000005443') }, // 정밀 재점검 필요
      ];
      // 구성성분 grid 헤더 설정
      this.setGridHeader().then(() => {
        this.getDataList();
      });

      this.setGridSize();
    },
    setGridHeader() {
      let myThis = this;
      return new Promise((resolve) => {
        this.gridOptions.header = [
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000002584'),
            dataField: 'col1',
            width: '40%',
            style: 'left-align',
            editable: false,
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000002584'),
            dataField: 'col2',
            width: '40%',
            style: 'left-align',
            editable: false,
            renderer: {
              type: 'TemplateRenderer',
            },
            labelFunction: (
              rowIndex,
              columnIndex,
              values,
              headerText,
              item
            ) => {
              // HTML 템플릿 작성
              const selectedList = document.querySelectorAll(
                'input[name="' + item.codeNm + '_hazardChem"]:checked'
              );
              if (selectedList.length > 0) {
                values = Array.from(selectedList).map((items) => items.value);
                item.regulItmNos = values;
              } else {
                item.regulItmNos = [];
              }
              var template = '<div class="my_div">';
              template += '<span class="my_div_chk_span">';
              myThis.checkbox.forEach((row, idx) => {
                let checkedTag = '';
                let disabledTab = '';
                // if ((!this.disabled && this.editable) === false) disabledTab = " disabled ";
                // if (myThis.myCheckingData.includes(row.regulItmNo)) checkedTag = " checked='checked'";
                const id =
                  item.codeNm +
                  '_' +
                  row.code +
                  '_hazardChem' +
                  columnIndex +
                  rowIndex;
                template +=
                  " <div class='custom-control custom-control-inline custom-checkbox b-custom-control-sm'> ";
                template +=
                  " <input type='checkbox' class='custom-control-input' id='" +
                  id +
                  "' name='" +
                  item.codeNm +
                  "_hazardChem1' value='" +
                  row.code +
                  "'" +
                  checkedTag +
                  disabledTab +
                  '>';
                template +=
                  "<label for='" +
                  id +
                  "' class='custom-control-label'>" +
                  row.codeNm +
                  ' </label>';
                template += ' </input>';
                template += ' </div> ';
              });
              return template;
            },
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000001360'),
            dataField: 'col3',
            width: '20%',
          },
        ];
        resolve();
      });
    },
    // 구성성분 grid
    getDataList() {
      this.gridOptions.data = [
        {
          col1: '유해화학물질의 이승배관 · 접합부 및 밸브 등 관련 설비의 부식 등으로 인한 유출 · 누출 여부',
          col2: null,
          col3: '',
        },
        {
          col1: '고체 상태 유해화학물질의 용기를 밀폐한 상태로 보관하고 있는지 여부',
          col2: [],
          col3: '',
        },
        {
          col1: '액체 · 기체 상태의 유해화학물질을 완전히 밀폐한 상태로 보관하고 있는지 여부',
          col2: [],
          col3: '',
        },
        {
          col1: '유해화학물질의 보관용기가 파손 또는 부식되거나 균열이 발생하였는지 여부',
          col2: [],
          col3: '',
        },
        {
          col1: '탱크트리, 트레일러 등 유해화학물질 운방장비의 부식 · 손상 · 노후화 여부',
          col2: [],
          col3: '',
        },
        {
          col1: '물 반응성 물질이나 인화성 고체의 물 접촉으로 인한 화재 · 폭발 가능성이 있는지 여부',
          col2: [],
          col3: '',
        },
        {
          col1: '인화성 액체의 증기 또는 인화성 가스가 공기중에 존재하여 화재 · 폭발 가능성이 이는지 여부',
          col2: [],
          col3: '',
        },
        {
          col1: '자연발화의 위험이 있는 물질이 취급시설 및 장비주변에 존재함에 따라 화재 · 폭발 가능성이 있는지 여부',
          col2: [],
          col3: '',
        },
        {
          col1: '누출감지장치, 안전밸브, 경보기 및 온도 · 압렵계기가 정상적으로 작동하는지 여부',
          col2: [],
          col3: '',
        },
        {
          col1: '법 제14조제2항에 따라 환경부장관이 고시한 개인보호장구가 본래의 성능을 유지하는지 여부',
          col2: [],
          col3: '',
        },
        {
          col1: '유해화학물질 저장 · 보관설비의 부식 · 손상 · 균열 등으로 인한 유출 · 누출이 있는지 여부',
          col2: [],
          col3: '',
        },
      ];
      this.YAuiGrid.setGridData(this.$_.clone(this.gridOptions.data));
    },
    resizeGrid() {
      let _height = window.innerHeight - 365;
      if (window.innerHeight < 500) {
        _height = 250;
      }

      this.YAuiGrid.resize(null, _height);
    },
    btnSearchUserClicked(_item) {
      this.popupOptions.target = () =>
        import(`${'../../manage/user/userSearch.vue'}`);
      this.popupOptions.title = 'L0000001466'; // 사용자 검색
      this.popupOptions.param = {
        deptCd: this.data.col3,
      };
      this.popupOptions.visible = true;
      this.popupOptions.width = '60%';
      this.popupOptions.top = '100px';
      this.popupOptions.closeCallback = this.closePopupSearchUser;
    },
    closePopupSearchUser(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      if (data.user) {
        this.data.col4 = data.user.userNm;
      }
    },
    getSrc(fileNm) {
      return '/src/assets/images/sign.png';
    },
    sign() {
      this.popupOptions.target = () => import(`${'./sign.vue'}`);
      this.popupOptions.title = 'L0000001547'; // 서명
      this.popupOptions.visible = true;
      this.popupOptions.param = {};
      this.popupOptions.closeCallback = this.closePopup;
    },
    closePopup(result) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      if (result) {
        this.data.col5 = result;
      }
    },
    // 그리드 리사이징
    setGridSize() {
      var defaultHeight = 250;
      window.getApp.$emit('LOADING_SHOW');
      setTimeout(() => {
        this.minHeight = this.$refs.fCard.clientHeight;
        window.getApp.$emit('LOADING_HIDE');
      }, 600);
    },
    /** /Button Event **/
  },
};
</script>
<style scoped>
.hazardChemSignCard:hover {
  background-color: #b3d8ff;
}
.hazardChemSignCard .card-body {
  padding: 0px !important;
}
</style>
