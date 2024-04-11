<!--
  목적 : 사용자검색
  작성자 : kcg.winscore
  Detail :
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 검색 -->
    <y-search-box :gridOptions="gridOptions" @enter="btnSearchClicked">
      <b-row slot="search">
        <b-col sm="12">
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-plant type="search" v-model="searchParam.plantCd" :editable="popupParam.plantEditable" />
            </b-col>
            <!-- <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
                <y-tree-dept
                  type="search"
                  name="deptCd"
                  :disabled="deptDisabled"
                  :plantCd="searchParam.plantCd"
                  v-model="searchParam.deptCd"
                />
              </b-col> -->
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 부서 -->
              <y-text
                :width="8"
                :clearable="true"
                ui="bootstrap"
                label="L0000001287"
                name="menuNm"
                v-model="searchParam.deptNm"
              />
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </y-search-box>
    <!-- 검색 결과 테이블 -->
    <b-row class="mt-3">
      <b-col sm="12" class="px-0">
        <b-col sm="12">
          <div slot="buttonGroup" class="float-right mb-1">
            <!-- 선택 -->
            <y-btn
              v-if="popupParam.multiple"
              title="L0000001561"
              color="orange"
              @btnClicked="selectUser"
            />
            <!-- 선택 -->
            <y-btn
              v-else
              title="L0000001561"
              color="orange"
              @btnClicked="selectUser2"
            />
            <!-- 검색 -->
            <y-btn
              title="L0000000327"
              color="green"
              @btnClicked="btnSearchClicked"
            />
            <!-- 닫기 -->
            <y-btn title="L0000000881" @btnClicked="closePopup" />
          </div>
          <!-- 부서목록 -->
          <y-tree-data-table
            label="L0000001289"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            expand-header-nm="부서"
            expand-column-name="deptNm"
            expand-column-width="300"
            data-key="deptCd"
            parent-key="pdeptCd"
            @rowClicked="rowClicked"
            @rowDoubleClicked="rowDoubleClicked"
            :defaultExpandAll="true"
            :isHeadCheckBox="popupParam.multiple"
            @headSelectionChanged="headSelectionChanged"
            :headCheckItemData="headCheckItemData"
            :headCheckKey="getHeadCheckKey"
            :headCheckSetTime="0"
          >
          </y-tree-data-table>
        </b-col>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import arrayToTree from 'array-to-tree';
import selectConfig from '@/js/selectConfig';
import YTreeDataTable from '@/components/YTreeDataTable';

export default {
  /** attributes: name, components, props, data **/
  name: 'user-search', // 반드시 입력하세요(안 하면 warning 발생). 네이밍 룰은 현재 vue component의 파일명의 단어를 "-"로 구분(예:exam-data)하여 입력하시면 됩니다. 입력후 이 주석은 지워주세요.
  components: {
    YTreeDataTable,
  },
  props: {
    popupParam: {
      type: Object,
      default: {
        multiple: false, // 멀티체크여부
        disabled: false,
        plantEditable: true,
        plantDisabled: false,
        deptDisabled: false,
        plantCd: '',
        deptCd: '',
        userId: '',
        userNm: '',
        user: [],
        deptSubYn: '', // 하위부서 포함 여부
      },
    },
  },
  // TODO: 화살표 함수(=>)는 data에 사용하지 말 것
  //    data: () => { return { a: this.myProp }}) 화살표 함수가 부모 컨텍스트를 바인딩하기 때문에 this는 예상과 달리 Vue 인스턴스가 아니기 때문에 this.myProp는 undefined로 나옵니다.
  //    참고url: https://kr.vuejs.org/v2/api/index.html#data
  data() {
    return {
      // Naming Rule : JAVA model class와 연동되는 vue model은 model class명을 Camel case로 변환해서 선언하시고 기본값은 {}로 초기화 시켜주세요.
      // 예) ExamData -> examData: {},
      searchParam: {
        plantCd: '',
        pdeptCd: '',
        deptCd: '',
        deptNm: '',
        userId: '',
        userNm: '',
        useYn: 'Y',
        deptSubYn: 'Y', // 하위부서 포함 여부 Y(하위부서 포함), N(하위부서 미포함) 2021년 04월 08일 jkl
      },
      selectedDept: null,
      gridOptions: {
        header: [],
        data: [],
        height: '350',
        selectedValue: [], // 그리드 체크된 목록
        searchboxStatus: true, // 팝업의 검색박스는 목록의 검색박스 보이기/숨기기와 상관없이 무조건 보이도록 설정.
      },
      headCheckItemData: [], // 그리드에 체크박스 적용하기 위한 데이터
      treeDeptData: [], // 조직트리 목록
      realSelData: {
        // 하위부서 포함하여 체크된 데이터
        oldData: [], // 과거 데이터
        newData: [], // 신규 데이터
      },
      isSearchDeptNm: false, // 부서명 검색 여부
      timeLimit: 0, // 하위 부서를 체크/해제하기 위한 시간
      searchUrl: '',
    };
  },
  computed: {
    // deptDisabled() {
    //   // 2021년 04월 09일 jkl
    //   // 부서가 '전체', 하위부서 포함 여부(deptSubYn)가 'N' 일경우 검색되어지는 유저가 없어서
    //   // 하위부서 포함 여부(deptSubYn)가 'N'인 경우는 부서 선택을 못하도록 막음
    //   return this.popupParam.deptDisabled || this.popupParam.deptSubYn === 'N';
    // },
    getHeadCheckKey() {
      return this.popupParam.multiple ? 'deptCd' : 'userId';
    },
  },
  watch: {},
  /** Vue lifecycle: created, mounted, destroyed, etc **/
  beforeCreate() {},
  created() {},
  beforeMount() {
    // TODO : data를 초기화 시켜줌(검색 조건 유지가 필요할 때는 삭제할 것)
    // 이유 : vue.js는 SPA기반으로 동작하기 때문에 페이지를 이동하더라도 기존 입력된 정보가 그대로 남아 있는 문제가 있음
    Object.assign(this.$data, this.$options.data());
  },
  mounted() {
    this.init();
  },
  beforeDestory() {
    this.init();
  },
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      // TODO : 여기에 초기 설정용 함수를 호출하거나 로직을 입력하세요.
      // 초기값 설정
      if (this.popupParam.plantCd) {
        this.searchParam.plantCd = this.popupParam.plantCd;
      }
      if (this.popupParam.deptCd) {
        this.searchParam.deptCd = this.popupParam.deptCd;
      } else if (
        this.popupParam.plantCd &&
        this.popupParam.plantCd !== this.$store.getters.plantCd
      ) {
        // 부서정보가 오지 않았으며 로그인자의 사업장과 넘어온 사업장의 정보가 다를 시에 부서정보를 빈값처리
        this.searchParam.deptCd = '';
      }

      this.gridOptions.header = [
        { text: 'L0000001415', name: 'plantNm', align: 'center', hidden: true }, // 사업장
        { text: 'L0000001287', name: 'deptNm', align: 'center', hidden: true }, // 부서
        { text: 'L0000001307', name: 'deptLvlNm', align: 'center' }, // 부서레벨
      ];
      this.searchUrl = selectConfig.manage.dept.treelist.url;
      this.getList();
      this.getTreeList();
    },
    getList() {
      this.$http.url = this.searchUrl;
      this.$http.param = this.searchParam;
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.gridOptions.data = this.convertTree(_result.data);
          this.checkItemData = this.popupParam.deptCd;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /**
     * 부서 트리용 기초 정보를 Tree 메뉴로 변환
     */
    convertTree(_treeBases) {
      if (!_treeBases || _treeBases.length <= 0) return null;
      var tree = arrayToTree(_treeBases, {
        parentProperty: 'pdeptCd',
        customID: 'deptCd',
      });
      return tree;
    },
    getTreeList() {
      // 조직트리 조회
      this.$http.url = this.searchUrl;
      this.$http.param = {
        plantCd: this.searchParam.plantCd,
        useYn: this.searchParam.useYn,
      };
      this.$http.type = 'get';
      this.$http.request(
        (_result) => {
          let treeData = _result.data;
          this.$_.forEach(treeData, (dept) => {
            dept['subDept'] = []; // 하위 부서 목록
            let checkParentDept = [];
            checkParentDept.push(dept);
            while (checkParentDept.length > 0) {
              let parentDept = checkParentDept.shift();
              this.$_.forEach(treeData, (item) => {
                if (item.pdeptCd === parentDept.deptCd) {
                  if (!dept.subDept.includes(item)) dept.subDept.push(item);
                  if (!checkParentDept.includes(item)) {
                    checkParentDept.push(item);
                  }
                }
              });
            }
          });
          this.treeDeptData = treeData;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    rowClicked(data) {
      if (this.popupParam.multiple) return;
      this.selectedDept = data;
    },
    rowDoubleClicked(data) {
      if (this.popupParam.multiple) return;
      this.$emit('closePopup', { success: true, dept: data });
    },
    headSelectionChanged(data) {
      // 멀티 체크한 값이 변경되면 호출된다.
      if (!this.popupParam.multiple) return;
      this.gridOptions.selectedValue = data;
      // 부서명 검색이 된 경우 하위부서 선택하지 않는다.
      if (this.isSearchDeptNm) return;
      // 하위 부서 체크/해제하기 위해 this.checkItemData 를 변경하면 이 함수가 바로 호출되므로, 일정 시간 리턴한다.
      if (new Date().getTime() < this.timeLimit) return;

      let addData = []; // 추가 체크된 부서
      let delData = []; // 체크 해제된 부서
      this.$_.forEach(data, (chkItem) => {
        if (
          this.$_.findIndex(this.realSelData.newData, {
            deptCd: chkItem.deptCd,
          }) === -1
        ) {
          addData.push(chkItem);
        }
      });
      this.$_.forEach(this.realSelData.newData, (oldItem) => {
        if (this.$_.findIndex(data, { deptCd: oldItem.deptCd }) === -1) {
          delData.push(oldItem);
        }
      });
      if (addData.length > 0 || delData.length > 0) {
        // 체크 변경한 경우
        this.setCheckItem(data, addData, delData);
      }
    },
    setCheckItem(data, addData, delData) {
      // 하위 부서 체크/해제 한다.
      let tempCheckItemData = []; // 추가 체크할 하위 부서와 체크해제할 하위 부서를 넣는다. => 이 데이터를 this.checkItemData에 넣으면,
      // yDataTable컴포넌트에서 toggle 처리로 기존에 없는 데이터는 추가되고, 기존에 있는 데이터는 체크해제한다.
      let oldData = this.$_.clone(this.realSelData.newData);
      let newData = []; // 하위 부서 추가 또는 해제된 최종 체크 데이터
      this.$_.forEach(data, (chkItem) => {
        let dept = this.$_.find(this.treeDeptData, { deptCd: chkItem.deptCd });
        newData.push(dept);
      });
      // 1. 추가된 데이터가 존재하면 하위 부서 데이터도 추가해 준다.
      this.$_.forEach(addData, (item) => {
        let dept = this.$_.find(this.treeDeptData, { deptCd: item.deptCd });
        this.$_.forEach(dept.subDept, (subItem) => {
          // 하위부서가 data 에 없으면 체크하기 위해 추가한다.
          if (this.$_.findIndex(data, { deptCd: subItem.deptCd }) === -1) {
            tempCheckItemData.push(subItem);
          }
          // 하위부서가 최종 체크된 데이터에 포함되도록 배열에 푸시한다.
          if (this.$_.findIndex(newData, { deptCd: subItem.deptCd }) === -1) {
            newData.push(subItem);
          }
        });
      });
      // 2. 체크해제된 데이터가 존재하면 하위 부서 데이터도 해제해 준다.
      this.$_.forEach(delData, (item) => {
        let dept = this.$_.find(this.treeDeptData, { deptCd: item.deptCd });
        this.$_.forEach(dept.subDept, (subItem) => {
          // 하위부서가 data 에 있으면 체크해제 하기 위해 추가한다.
          if (this.$_.findIndex(data, { deptCd: subItem.deptCd }) > -1) {
            tempCheckItemData.push(subItem);
          }
          // 하위부서가 최종 체크된 데이터에 포함되지 않도록 배열에서 삭제한다.
          let idx = this.$_.findIndex(newData, { deptCd: subItem.deptCd });
          if (idx > -1) newData.splice(idx, 1);
        });
      });
      this.realSelData.oldData = oldData;
      this.realSelData.newData = newData;
      this.timeLimit = new Date().getTime() + 100;
      this.headCheckItemData = tempCheckItemData;
    },
    selectUser() {
      // 멀티 체크한 값을 부모 컴포넌트로 리턴
      if (
        !this.gridOptions.selectedValue ||
        (this.gridOptions.selectedValue &&
          this.gridOptions.selectedValue.length === 0)
      ) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000001065', // 부서를 먼저 선택하세요
          type: 'warning', // success / info / warning / error
        });
        return;
      }
      this.$emit('closePopup', this.gridOptions.selectedValue);
    },
    selectUser2() {
      if (!this.selectedDept) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000001065', // 부서를 먼저 선택하세요
          type: 'warning', // success / info / warning / error
        });
      } else {
        this.$emit('closePopup', { success: true, dept: this.selectedDept });
      }
    },
    closePopup() {
      // 부모창에 값 전달
      this.$emit('closePopup', { success: true });
    },
    /** Button Event **/
    btnSearchClicked() {
      this.getList();
      this.getTreeList();
      Object.assign(this.$data.realSelData, this.$options.data().realSelData);
      if (this.searchParam.deptNm !== '') this.isSearchDeptNm = true;
      else this.isSearchDeptNm = false;
    },
    /** /기타 function **/
  },
};
</script>
