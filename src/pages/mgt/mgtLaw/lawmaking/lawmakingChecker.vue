<!--
  목적 : 입법예고법규 조회
  Detail :
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="getDataList">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 공고일자 -->
          <y-datepicker
            :width="8"
            :range="true"
            label="L0000000487"
            name="period"
            v-model="searchParam.period"
          ></y-datepicker>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 입법예고명 -->
          <y-text
            :width="8"
            ui="bootstrap"
            label="L0000002291"
            name="isNm"
            v-model="searchParam.isNm"
          ></y-text>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 작성자 -->
          <y-text
            :width="8"
            :disabled="true"
            ui="bootstrap"
            label="L0000002355"
            name="createUserNm"
            v-model="searchParam.createUserNm"
            :appendIcon="[
              { icon: 'times', callbackName: 'clear' },
              { icon: 'search', callbackName: 'searchUser' },
            ]"
            @searchUser="btnSearchUserClicked"
            @clear="clear"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 진행상태 -->
          <y-select
            :width="8"
            :comboItems="checkStepItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            name="useYn"
            label="L0000002779"
            v-model="searchParam.checkStepCd"
          ></y-select>
        </b-col>
      </b-row>
    </y-search-box>

    <!-- 검색 결과 테이블 -->
    <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
            <!-- 검색 -->
            <y-btn
              title="L0000000327"
              color="green"
              @btnClicked="getDataList"
            />
          </div>
          <!-- 입법예고법규 검토 목록 -->
          <y-data-table
            label="L0000002292"
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :use-paging="true"
            @tableLinkClicked="tableLinkClicked"
          >
            <el-table-column slot="expand" align="center" width="70">
              <template slot-scope="scope">
                <el-button
                  icon="el-icon-search"
                  circle
                  slot="reference"
                  size="mini"
                  @click.stop="linkClicked(scope.row, scope.$index)"
                />
              </template>
            </el-table-column>
          </y-data-table>
        </b-col>
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
export default {
  /** attributes: name, components, props, data **/
  name: 'lawmaking-checker',
  props: {},
  data() {
    return {
      searchParam: {
        period: [],
        isNm: '',
        createUserId: '',
        createUserNm: '',
        checkStepCd: 'LMCS99',
        deptCd: '',
      },
      gridOptions: {
        header: [],
        data: [],
        height: 'auto',
      },
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '85%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      checkStepItems: [],
      editable: false,
      searchUrl: '',
    };
  },
  /** Vue lifecycle: created, mounted, destroyed, etc **/
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {},
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      this.editable = this.$route.meta.editable;

      this.searchParam.deptCd = this.$store.getters.deptCd;

      // 헤더 설정
      this.gridOptions.header = [
        {
          text: 'L0000002779',
          name: 'checkStepNm',
          width: '130px',
          align: 'center',
        }, // 진행상태
        { text: 'L0000000384', name: 'checkRqstTitle', width: '270px' }, // 검토요청 제목
        { text: 'L0000000388', name: 'checkDeptNms', width: '180px' }, // 검토팀
        {
          text: 'L0000002291',
          name: 'isNm',
          width: '300px',
          align: 'left',
          url: true,
        }, // 입법예고명
        {
          text: 'L0000001209',
          name: 'isClsNm',
          width: '150px',
          align: 'center',
        }, // 법령종류(소관부서)
        {
          text: 'L0000000486',
          name: 'pntcNo',
          width: '180px',
          align: 'center',
        }, // 공고번호(공고일자)
        { text: 'L0000001779', name: 'stYd', width: '130px', align: 'center' }, // 시작일자
        { text: 'L0000002706', name: 'edYd', width: '130px', align: 'center' }, // 종료일자
        {
          text: 'L0000001208',
          name: 'temp',
          width: '130px',
          align: 'center',
          url: true,
        }, // 법령안
        {
          text: 'L0000000976',
          name: 'createUserNm',
          width: '130px',
          align: 'center',
        }, // 등록자
      ];

      // 공고일자 초기값 설정
      this.searchParam.period = ['2020-01-01', this.$comm.getToday()];
      // this.searchParam.period = [this.$comm.getFirstDayThisYear(), this.$comm.getToday()];
      this.$comm.getComboItems('MGT_LAW_MAKING_STEP', true).then((_result) => {
        _result.splice(0, 1);
        _result.splice(0, 1);
        _result.splice(0, 0, {
          code: 'LMCS99',
          codeNm: this.$comm.getLangSpecInfoLabel('L0000002519'), // 전체
        });
        this.checkStepItems = _result;
      });

      // URL 설정
      this.searchUrl = selectConfig.lawMakingCheck.list.url;

      this.getDataList(); // 입법예고 목록
    },
    /** /초기화 관련 함수 **/
    getDataList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          this.gridOptions.data = _result.data;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    tableLinkClicked(header, data) {
      if (!data) return;
      if (header.name === 'temp') {
        let link = document.createElement('a');
        link.href = data.fileDownLink;
        link.download = data.fileName;
        link.click();
      } else if (header.name === 'isNm') {
        /**
         * 헤더에 도메인 정보를 같이 전달하는 경우 정부입법지원센터의 OPEN API를 통해 URL 호출하였을 경우 도메인 필터링을 통해 접근차단을 당함
         * 헤더에서 도메인 정보를 같이 전달하지 않도록 빈 팝업 생성 후 a link 생성하여 target을 빈 팝업으로 지정 후 referrer 설정을 no-referrer 지정하여 link 이동
         */
        let popup = window.open(
          '',
          this.$comm.getLangSpecInfoLabel('L0000002291'),
          'width=1200, height=700'
        ); /* 입법예고명 */

        let link = document.createElement('a');
        link.href = data.detailUrl;
        link.target =
          this.$comm.getLangSpecInfoLabel('L0000002291'); /* 입법예고명 */
        link.referrerPolicy = 'no-referrer';
        link.click();
      }
      // else if (header.name === 'checkTitle') {
      //   this.openDetailPopup(data);
      // }
    },
    linkClicked(row, index) {
      this.popupOptions.target = () =>
        import(`${'./lawmakingCheckDetail.vue'}`);
      this.popupOptions.title = 'L0000004243'; // 검토요청내용 작성
      this.popupOptions.param = {
        lmcSeqNo: row.lmcSeqNo, // 순번
        seqNo: row.seqNo, // 순번
        step: 'DESIGNATION',
      };
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
    },
    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getDataList();
    },
    // 사용자 검색
    btnSearchUserClicked(_item) {
      this.popupOptions.target = () =>
        import(`${'@/pages/manage/user/userSearch.vue'}`);
      this.popupOptions.param = {
        plantCd: this.$store.getters.plantCd,
      };
      this.popupOptions.title = 'L0000001466'; // 사용자검색
      this.popupOptions.visible = true;
      this.popupOptions.width = '70%';
      this.popupOptions.top = '100px';
      this.popupOptions.closeCallback = this.closePopupSearchUser;
    },
    // 사용자 검색 팝업 닫기
    closePopupSearchUser(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data.user) {
        this.searchParam.createUserId = data.user.userId;
        this.searchParam.createUserNm = data.user.userNm;
      }
    },
    clear() {
      this.searchParam.createUserId = null;
      this.searchParam.createUserNm = null;
    },
  },
};
</script>
