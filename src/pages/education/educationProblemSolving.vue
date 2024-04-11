<!--
  목적 : 교육 목록
  작성자 : kkc
  Detail : 교육 목록 조회
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="getList">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="4" xl="4" class="col-xxl-3">
          <y-plant
            type="search"
            name="plantCd"
            :disAuthPage="true"
            v-model="searchParam.plantCd"
            @datachange="
              (val) => {
                (searchParam.plantCd = val), getEduCourseItems();
              }
            "
          ></y-plant>
        </b-col>
        <b-col sm="6" md="6" lg="4" xl="4" class="col-xxl-3">
          <!-- 교육기간 -->
          <y-datepicker
            :width="8"
            :range="true"
            label="L0000000641"
            name="period"
            default="searchParam.duration"
            v-model="searchParam.duration"
          ></y-datepicker>
        </b-col>

        <b-col sm="6" md="6" lg="4" xl="4" class="col-xxl-3">
          <!-- 교육대분류 -->
          <y-select
            :width="8"
            :comboItems="eduAttCdSearchItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000000644"
            name="eduAttCd"
            v-model="searchParam.eduAttCd"
          ></y-select>
        </b-col>
        <b-col sm="6" md="6" lg="4" xl="4" class="col-xxl-3">
          <!-- 교육분류 -->
          <y-select
            :width="8"
            :comboItems="eduClassCdSearchItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000000659"
            name="eduClassCd"
            v-model="searchParam.eduClassCd"
          ></y-select>
        </b-col>
        <b-col sm="6" md="6" lg="4" xl="4" class="col-xxl-3">
          <!-- 교육과정 -->
          <y-select
            :width="8"
            :comboItems="eduCourseSearchItems"
            itemText="eduCourseNm"
            itemValue="safEduCourseNo"
            ui="bootstrap"
            type="edit"
            label="L0000000633"
            name="safEduCourseNo"
            v-model="searchParam.safEduCourseNo"
          ></y-select>
        </b-col>
        <b-col sm="6" md="6" lg="4" xl="4" class="col-xxl-3">
          <!-- 교육구분 -->
          <y-select
            :width="8"
            :comboItems="eduTypeCdSearchItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000000639"
            name="eduTypeCd"
            v-model="searchParam.eduTypeCd"
          ></y-select>
        </b-col>
        <b-col sm="6" md="6" lg="4" xl="4" class="col-xxl-3">
          <!-- 진행상태 -->
          <y-select
            :width="8"
            :comboItems="processStepNmSearchItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            name="processStepNm"
            label="L0000002779"
            v-model="searchParam.processStepNm"
          ></y-select>
        </b-col>
        <b-col sm="6" md="6" lg="4" xl="4" class="col-xxl-3">
          <!-- 교육명 -->
          <y-text
            :width="8"
            ui="bootstrap"
            type="search"
            label="L0000000653"
            name="eduNm"
            v-model="searchParam.eduNm"
          ></y-text>
        </b-col>
        <!-- 대상자 -->
        <b-col sm="6" md="6" lg="4" xl="4" class="col-xxl-3">
          <y-text
            :width="8"
            :disabled="disabled"
            :editable="editable"
            label="L0000004488"
            name="userNm"
            v-model="searchParam.userNm"
            :appendIcon="[
              { icon: 'times', callbackName: 'clear' },
              { icon: 'search', callbackName: 'searchUser' },
            ]"
            @searchUser="btnSearchUserClicked"
            @clear="clear"
          />
        </b-col>
      </b-row>
    </y-search-box>

    <!-- 교육 목록 결과 목록 grid -->
    <!-- <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
            <y-btn title="L0000000327" color="green" @btnClicked="getList" />
          </div>
           교육 목록 현황 
          <y-data-table
            label="L0000000613"
            :print="true"
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :use-paging="true"
            @tableLinkClicked="tableLinkClicked"
          ></y-data-table>
        </b-col>
      </b-col>
    </b-row> -->
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000001462')"
          :useExcelExport="false"
          :enableSorting="true"
          :showGridSetSave="true"
          @getList="getList"
          @cellClick="cellClickHandler"
        />
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
export default {
  /** attributes: name, components, props, data **/
  name: 'education-list',
  props: {},
  data() {
    return {
      searchParam: {
        duration: [],
        eduAttCd: null,
        safEduCourseNo: 0,
        eduTypeCd: null,
        eduClassCd: null,
        eduNm: '',
        processStepNm: '',
        userId: '',
        userNm: '',
      },
      gridOptions: {
        header: [],
        data: [],
        btns: [],
        height: '415',
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
      eduAttCdSearchItems: [],
      eduCourseSearchItems: [],
      eduTypeCdSearchItems: [],
      eduClassCdSearchItems: [],
      processStepNmSearchItems: [],
      searchUrl: '',
      checkUrl: '',
      disabled: false,
      eduEvalPntSec: '',
      YAuiGrid: null,
    };
  },
  watch: {
    'searchParam.eduAttCd': function (newValue, oldValue) {
      this.getEduCourseItems();
    },
    'searchParam.eduClassCd': function (newValue, oldValue) {
      this.getEduCourseItems();
    },
    // 'searchParam.processStepNm': function(newValue, oldValue) {
    //   this.getEduCourseItems();
    // },
  },
  /** Vue lifecycle: created, mounted, destroyed, etc **/
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.searchParam.duration.push(
      this.$comm.getCalculatedDate(
        this.$comm.getToday(),
        '-1m',
        'YYYY-MM-DD',
        'YYYY-MM-DD'
      )
    );
    this.searchParam.duration.push(
      this.$comm.getCalculatedDate(
        this.$comm.getToday(),
        '1m',
        'YYYY-MM-DD',
        'YYYY-MM-DD'
      )
    );
    this.init();
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
  },
  beforeDestroy() {},
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      this.checkUrl = selectConfig.saf.education.eduStatus.checkUrl.url;
      // 그리드 헤더 설정
      this.processStepNmSearchItems = [
        { code: '', codeNm: this.$comm.getLangSpecInfoLabel('L0000002519') }, // 전체
        { code: 'Y', codeNm: this.$comm.getLangSpecInfoLabel('L0000004684') }, // 제출완료
        { code: 'N', codeNm: this.$comm.getLangSpecInfoLabel('L0000004685') }, // 제출전
      ];
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plantNm',
          width: '120px',
        } /* 사업장 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000653'),
          dataField: 'eduNm',
          width: '220px',
          style: 'grid-link-cell',
        }, // 교육명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004488'),
          dataField: 'subJectNm',
          width: '140px',
        } /* 대상자 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004486'),
          dataField: 'eduEvalPnt',
          width: '100px',
        } /* 1차평가점수 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004487'),
          dataField: 'eduEvalPntSec',
          width: '100px',
        } /* 2차평가점수 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002779'),
          dataField: 'processStepYn',
          width: '120px',
        } /* 진행상태 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000644'),
          dataField: 'eduAttNm',
          width: '100px',
        } /* 교육대분류 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000659'),
          dataField: 'eduClassNm',
          width: '80px',
        } /* 교육분류 */,

        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000633'),
          dataField: 'eduCourseNm',
          width: '150px',
        } /* 교육과정 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000641'),
          dataField: 'eduYmd',
          width: '210px',
        } /* 교육기간 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000672'),
          dataField: 'eduPlace',
          width: '150px',
        } /* 교육장소 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000890'),
          dataField: 'deptNm',
          width: '150px',
        } /* 담당부서 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000892'),
          dataField: 'userNm',
          width: '120px',
        } /* 담당자 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002355'),
          dataField: 'writerUserNm',
          width: '140px',
        } /* 작성자 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002352'),
          dataField: 'writerDt',
          width: '120px',
        } /* 작성일 */,
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'getList',
        },
      ];
      if (
        !this.$store.getters.deptAuthGrp ||
        (this.$store.getters.deptAuthGrp &&
          this.$store.getters.deptAuthGrp.deptAccessYn === 'N')
      ) {
        this.searchParam.userNm = this.$store.getters.name;
        this.searchParam.userId = this.$store.getters.token;
        this.editable = false;
      }
      this.disabled = true;

      this.searchUrl = selectConfig.saf.education.eduProblems.list.url;

      this.getEduCourseItems();

      this.$comm.getComboItems('SAF_EDU_ATT', true).then((_result) => {
        this.eduAttCdSearchItems = _result;
      });
      this.$comm.getComboItems('SAF_EDU_TYPE', true).then((_result) => {
        this.eduTypeCdSearchItems = _result;
      });
      this.$comm.getComboItems('SAF_EDU_COURSE', true).then((_result) => {
        this.eduClassCdSearchItems = _result;
      });
      // 진행상태
      // this.$comm.getComboItems('SAF_EDU_STEP', true).then(_result => {
      //   this.processStepNmSearchItems = _result;
      // });

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }

      this.getList();
    },
    getList() {
      if (
        this.searchParam.userNm === '' ||
        this.searchParam.userNm === null ||
        this.searchParam.userNm === undefined
      ) {
        this.searchParam.userId = null;
      }
      var i = 0;
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;

      this.$http.request(
        (_result) => {
          let gridData = this.$_.clone(_result.data);

          this.$comm.pushCookie(this.searchParam);
          if (gridData.length > 0) {
            for (i = 0; i < gridData.length; i++) {
              if (gridData[i].processStepCnt > 0) {
                gridData[i].processStepYn =
                  this.$comm.getLangSpecInfoLabel('L0000004684'); // 제출완료
              } else {
                gridData[i].processStepYn =
                  this.$comm.getLangSpecInfoLabel('L0000004685'); // 제출전
              }
            }
          }
          this.YAuiGrid.setGridData(gridData);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getEduCourseItems() {
      this.$http.url = selectConfig.saf.education.eduCourse.list.url;
      this.$http.type = 'GET';
      this.$http.param = {
        useYn: 'Y',
        eduAttCd: this.searchParam.eduAttCd,
        eduTypeCd: this.searchParam.eduClassCd,
        plantCd: this.searchParam.plantCd,
      };
      this.$http.request(
        (_result) => {
          this.eduCourseSearchItems = this.$_.clone(_result.data);
          this.eduCourseSearchItems.splice(0, 0, {
            safEduCourseNo: 0,
            eduCourseNm:
              this.$comm.getLangSpecInfoLabel('L0000002519') /* 전체 */,
          });
          if (
            this.searchParam.safEduCourseNo &&
            this.$_.indexOf(
              this.$_.map(this.eduCourseSearchItems, 'safEduCourseNo'),
              this.searchParam.safEduCourseNo
            ) === -1
          ) {
            this.searchParam.safEduCourseNo = 0;
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },

    cellClickHandler(data) {
      console.log('2222', data);
      this.showCheckResultPopup(data);
    },
    showCheckResultPopup(data) {
      this.$http.url = this.checkUrl;
      this.$http.type = 'GET';
      this.$http.param = {
        userId: data.item.subJectId,
        safEduMstNo: data.item.safEduMstNo,
        eduEvalPntSec: data.item.eduEvalPntSec,
      };
      this.$http.request(
        (_result) => {
          if (
            !this.$store.getters.deptAuthGrp ||
            (this.$store.getters.deptAuthGrp &&
              this.$store.getters.deptAuthGrp.deptAccessYn === 'N')
          ) {
            if (_result.data > 0) {
              this.popupOptions.target = () =>
                import(`${'./educationProblemSolvingDetail.vue'}`);
              this.popupOptions.title = 'L0000000616'; // 교육 문제 상세
              this.popupOptions.visible = true;
              this.popupOptions.width = '50%';
              // this.popupOptions.top = '10px';
              this.popupOptions.param = {
                safEduMstNo: data.item.safEduMstNo,
                eduEvalPntSec: data.item.eduEvalPntSec,
                userId: data.item.subJectId,
              };
              this.popupOptions.closeCallback = this.closePopup;
            } else {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395', // 안내
                message: 'M0000001154', // 교육문제풀이 대상자가 아닙니다. 교육과정을 확인하세요.
                type: 'warning', // success / info / warning / error
              });
            }
          } else {
            this.popupOptions.target = () =>
              import(`${'./educationProblemSolvingDetail.vue'}`);
            this.popupOptions.title = 'L0000000616';
            this.popupOptions.visible = true;
            this.popupOptions.width = '50%';
            // this.popupOptions.top = '10px';
            this.popupOptions.param = {
              safEduMstNo: data.item.safEduMstNo,
              eduEvalPntSec: data.item.eduEvalPntSec,
              userId: data.item.subJectId,
            };
            this.popupOptions.closeCallback = this.closePopup;
          }
        },
        (_error) => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            'M0000000016' // 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
          );
        }
      );
    },
    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getList();
    },
    btnSearchUserClicked(_item) {
      if (this.disabledFacilityMasterInput) return;
      this.popupOptions.target = () =>
        import(`${'../manage/user/userSearch.vue'}`);
      this.popupOptions.param = {
        plantCd: '',
        deptCd: '',
        // plantCd: this.facilityMst.plantCd,
        // deptCd: this.facilityMst.deptCd,
      };
      this.popupOptions.title = 'L0000001466'; // 사용자검색
      this.popupOptions.visible = true;
      this.popupOptions.width = '60%';
      this.popupOptions.top = '100px';
      this.popupOptions.closeCallback = this.closePopupSearchUser;
    },
    closePopupSearchUser(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data.user) {
        this.searchParam.userNm = data.user.userNm;
        this.searchParam.userId = data.user.userId;
      }
    },
    clear() {
      this.searchParam.userNm = null;
      this.searchParam.userId = null;
    },
  },
};
</script>
