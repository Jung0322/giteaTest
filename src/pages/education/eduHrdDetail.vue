<!--
  목적 : 교육 그룹 등록/수정
  작성자 : kkc
  Detail : 교육 그룹 등록/수정
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row>
      <!-- 교육 그룹 상세 -->
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- HRD 사외전문교육 상세 -->
            <y-label
              label="L0000001466"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 닫기 -->
              <y-btn title="L0000000881" @btnClicked="closePopup" />
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="12">
              <b-row>
                <b-col sm="5" md="5" lg="5" xl="5" class="col-xxl-5">
                  <!--참석자 목록  -->
                  <y-data-table
                    :height="gridTestItemLeftOptions.height"
                    :headers="gridTestItemLeftOptions.header"
                    :items="gridTestItemLeftOptions.data"
                    :useRownum="false"
                    v-model="testItemLeftValue"
                    label="L0000005538"
                  ></y-data-table>
                </b-col>
              </b-row>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  /** attributes: name, components, props, data **/
  name: 'educationMaterialDetail',
  props: {
    popupParam: {
      type: Object,
      default: {
        eduAttNm: '',
        eduCourseNm: '',
        groupNm: '',
        createDt: '',
        createUserNm: '',
      },
    },
  },
  data: () => ({
    component: null,
    eduGroup: {
      safEduMstNo: 0,
      eduAttCd: null,
      eduAttNm: '',
      eduCourseNm: '',
      groupNm: '',
      createUserNm: '관리자',
      createDt: '',
      userNm: '',
      plantCd: '',
      eduGroupUsers: [],
    },
    editable: true,
    insertMode: false,
    updateMode: false,
    compleMode: false,
    eduAttCdItems: [],
    eduCourseItems: [],

    insertUrl: '',
    editUrl: '',
    deleteUrl: '',
    getUrl: '',
    isInsert: false,
    isEdit: false,
    searchUserParam: {
      userNm: '',
      deptCd: '',
      plantCd: '',
    },
    searchUserUrl: '',
    gridTestItemLeftOptions: {
      header: [],
      data: [],
      height: '300',
    },

    testItemLeftValue: [],
  }),
  watch: {},
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
      this.eduGroup.plantCd = this.$store.getters.plantCd;

      this.editable = this.$route.meta.editable;
      this.searchUserUrl = selectConfig.manage.user.list.url;

      // 선택된 부서의 유저 목록 그리드 헤더 설정 왼쪽
      this.gridTestItemLeftOptions.header = [
        { text: 'L0000004367', name: 'deptNam', width: '120px', align: 'left' }, // 부서명
        { text: 'L0000001482', name: 'userNm', width: '100px', align: 'left' }, // 사원명
      ];
      this.getDetailUser();
    },

    closePopup() {
      this.$emit('closePopup');
    },

    // 교육번호에 따른 교육 이수자 검색
    getDetailUser() {
      this.$http.url = selectConfig.saf.education.eduHrd.get.url;

      this.$http.type = 'GET';
      this.$http.param = {
        sqNo: this.popupParam.sqNo,
        crsCode: String(this.popupParam.crsCode),
        sqYear: String(this.popupParam.sqYear),
      };
      this.$http.request(
        (_result) => {
          this.gridTestItemLeftOptions.data = this.$_.clone(_result.data);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
  },
};
</script>
