<!--
  목적 : (반드시 기입하세요) 컴포넌트
  작성자 : (이니셜로 반드시 입력하세요)
  Detail :
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row>
      <!-- 권한 그룹 영역 -->
      <b-col sm="3">
        <!-- 사용자그룹 목록 -->
        <y-auigrid
          ref="yAuiGrid"
          :name="authGrpGridOptions.name"
          :headers="authGrpGridOptions.header"
          :btns="authGrpGridOptions.btns"
          :height="authGrpGridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000001469')"
          :useExcelExport="false"
          :enableSorting="true"
          :showGridSetSave="true"
          @selectedRow="authGrpGridSelectedRow"
        />
      </b-col>
      <!-- 메뉴 영역 -->
      <b-col sm="9" class="authGrpMenu">
        <b-row>
          <b-col sm="12">
            <div class="float-right mb-1">
              <el-tag size="medium" type="warning" v-if="updateMode">
                <i class="el-icon-info"></i>
                {{ $comm.getLangSpecInfoLabel('L0000004225')
                }}<!-- 체크된 메뉴는 쓰기원한이 부여된 메뉴입니다. -->
              </el-tag>
              <!-- 접속가능메뉴 추가/삭제 -->
              <y-btn
                v-if="updateMode"
                title="L0000002589"
                color="orange"
                @btnClicked="btnAuthMenuOpenPop"
              />
              <!-- 쓰기권한 저장 -->
              <y-btn
                v-if="updateMode"
                title="L0000001827"
                color="orange"
                @btnClicked="btnWriteAuthUpdate"
              />
            </div>
          </b-col>
          <b-col sm="12">
            <el-tree
              class="filter-tree menu-tree"
              :data="menuGridOptions.data"
              show-checkbox
              default-expand-all
              node-key="id"
              ref="tree"
            ></el-tree>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import arrayToTree from 'array-to-tree';
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
import YTreeDataTable from '@/components/YTreeDataTable';

export default {
  /** attributes: name, components, props, data **/
  name: 'auth-grp-menu', // 반드시 입력하세요(안 하면 warning 발생). 네이밍 룰은 현재 vue component의 파일명의 단어를 "-"로 구분(예:exam-data)하여 입력하시면 됩니다. 입력후 이 주석은 지워주세요.
  components: {
    YTreeDataTable,
  },
  props: {
    paneName: {
      type: String,
      default: '',
    },
  },
  // TODO: 화살표 함수(=>)는 data에 사용하지 말 것
  //    data: () => { return { a: this.myProp }}) 화살표 함수가 부모 컨텍스트를 바인딩하기 때문에 this는 예상과 달리 Vue 인스턴스가 아니기 때문에 this.myProp는 undefined로 나옵니다.
  //    참고url: https://kr.vuejs.org/v2/api/index.html#data
  data() {
    return {
      authGrpGridOptions: {
        header: [],
        data: [],
        getUrl: '',
        getParams: {
          useYn: 'Y',
          searchFlag: 'n',
        },
      },
      menuGridOptions: {
        header: [],
        data: [],
        allData: [],
        getUrl: '',
        getParams: {
          useYn: 'Y',
        },
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
      authGrpMenusParam: {}, // 권한 그룹별 메뉴 model
      saveUrl: '',
      authMenuSaveUrl: '',
      authMenuUpdateUrl: '',
      menuTree: [],
      isSave: false,
      updateMode: false,
      YAuiGrid: null,
    };
  },
  watch: {
    // 해당 tab 들어올 때마다 그리드 사이즈 조정
    paneName() {
      this.getAuthGrps();
    },
  },
  /** Vue lifecycle: created, mounted, destroyed, etc **/
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
    window.addEventListener('resize', this.resizeGrid);
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.resizeGrid();
    this.getAuthGrps();
  },
  beforeDestory() {
    this.init();
  },
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      this.authGrpGridOptions.getUrl = selectConfig.authGrp.list.url;
      this.saveUrl = transactionConfig.authGrpMenu.insert.url;
      this.authMenuSaveUrl = transactionConfig.authGrpMenu.save.url;
      this.authMenuUpdateUrl = transactionConfig.authGrpMenu.edit.url;
      this.getAuthGrps();
      this.getComboItems('COM_ACCESS_AUTH_COMPONENT'); // 사업장 접근권한

      this.authGrpGridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001470'),
          dataField: 'authGrpNm',
          width: '100%',
        }, // 사용자 그룹명
      ];
    },
    /** Call API service
     */
    getComboItems(codeGroupCd) {
      this.$http.url = this.$format(
        selectConfig.codeMaster.getSelect.url,
        codeGroupCd
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          if (codeGroupCd === 'COM_ACCESS_AUTH_COMPONENT') {
            this.accessList = this.$_.clone(_result.data);
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getAuthGrps(data) {
      this.$http.url = this.authGrpGridOptions.getUrl;
      this.$http.param = this.authGrpGridOptions.getParams;
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          // this.authGrpGridOptions.data = _result.data;
          this.YAuiGrid.setGridData(this.$_.clone(_result.data));
          if (
            this.authGrpGridOptions.data &&
            this.authGrpGridOptions.data.length
          ) {
            this.$refs.dataTable.setCurrentRow(
              data ? data : this.authGrpGridOptions.data[0]
            );
            this.authGrpGridSelectedRow(
              data ? data : this.authGrpGridOptions.data[0]
            );
            this.$forceUpdate();
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getAllMenus() {
      this.$http.url = selectConfig.menuTreeBases.list.url;
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.menuGridOptions.data = this.convertTree(_result.data);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /** /Call API service **/

    /** Component Events, Callbacks (버튼 제외) **/
    /**
     * 권한 그룹 그리드 선택
     */
    authGrpGridSelectedRow(_row) {
      this.$http.url = this.$format(
        selectConfig.authGrpMenu.list.url,
        _row.authGrpNo
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.menuGridOptions.allData = _result.data;
          this.menuGridOptions.data = this.convertTree(_result.data);
          this.authGrpMenusParam.authGrpNo = _row.authGrpNo;

          this.$refs.tree.setCheckedKeys(
            this.$_.map(this.$_.filter(_result.data, { writeYn: 'Y' }), 'id')
          );
          this.updateMode = true;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /** /Component, Callbacks (버튼 제외) **/

    /** Button Event **/
    /**
     * 저장 버튼 처리용 샘플함수
     */
    btnWriteAuthUpdate() {
      if (
        !this.$refs.tree.getCheckedKeys() ||
        this.$refs.tree.getCheckedKeys().length === 0
      ) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000000528', // 쓰기권한을 부여할 메뉴를 선택하세요
          type: 'warning',
        });
      } else {
        this.$http.url = this.authMenuUpdateUrl;
        this.$http.type = 'PUT';
        this.$http.param = this.$refs.tree.getCheckedNodes();
        this.$http.request(
          (_result) => {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395', // 안내
              message: 'M0000000006', // 저장되었습니다.
              type: 'success',
            });
            this.authGrpGridSelectedRow({
              authGrpNo: this.authGrpMenusParam.authGrpNo,
            });
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      }
    },
    btnSaveClickedCallback(_result) {
      this.isSave = false; // 반드시 isSave을 false로 초기화 하세요. 그렇지 않으면 버튼을 다시 클릭해도 동작하지 않습니다.
      // TODO : 여기에 추가 로직 삽입(로직 삽입시 지워주세요)
      window.getApp.$emit('APP_REQUEST_SUCCESS', '정상적으로 저장 되었습니다.');
      var row = {
        authGrpNo: this.authGrpMenusParam.authGrpNo,
      };
      this.authGrpGridSelectedRow(row);
    },
    /**
     * 버튼 에러 처리용 공통함수
     */
    btnClickedErrorCallback(_result) {
      this.isSave = false; // 반드시 isSave을 false로 초기화 하세요. 그렇지 않으면 버튼을 다시 클릭해도 동작하지 않습니다.
      // TODO : 여기에 추가 로직 삽입(로직 삽입시 지워주세요)
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    /** /Button Event **/

    /** 기타 function **/
    /**
     * 메뉴 트리용 기초 정보를 Tree 메뉴로 변환
     */
    convertTree(_treeBases) {
      if (!_treeBases || _treeBases.length <= 0) return null;
      var tree = arrayToTree(_treeBases, {
        parentProperty: 'upMenuId',
        customID: 'menuId',
      });

      return tree;
    },
    getNoChildren(data) {
      let returnData = [];
      this.$_.forEach(this.menuGridOptions.allData, (item) => {
        let filterData = this.$_.filter(this.menuGridOptions.allData, {
          upMenuId: item.menuId,
        });
        if (!filterData || filterData.length === 0) {
          returnData.push(item);
        }
      });
      return returnData;
    },
    btnAuthMenuOpenPop() {
      this.popupOptions.target = () => import(`${'./menuTreeMultiSelect.vue'}`);
      this.popupOptions.title = 'L0000003408'; // 메뉴
      this.popupOptions.param = {
        menus: this.getNoChildren(), // this.menuGridOptions.allData,
      };
      this.popupOptions.width = '50%';
      this.popupOptions.top = '10px';
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closeAuthMenuPopup;
    },
    closeAuthMenuPopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data !== 'CLOSE' && Array.isArray(data)) {
        let tempData = this.$_.clone(this.menuGridOptions.allData);
        let saveData = [];
        data.forEach((item) => {
          // 쓰기 여부 데이터 찾기
          let o = this.$_.find(tempData, { menuId: item.menuId, writeYn: 'Y' });
          saveData.push({
            accessYn: 'Y',
            writeYn: o ? o.writeYn : 'N',
            menuId: item.menuId,
            menuNm: item.menuNm,
          });
        });

        // console.log('tempData', tempData)
        // console.log('data', data)
        // console.log('saveData', saveData)

        this.saveAuthAccess(saveData);
      }
    },
    saveAuthAccess(saveData) {
      this.$http.url = this.authMenuSaveUrl;
      this.$http.type = 'POST';
      this.$http.param = {
        saveData: saveData,
        deleteData: [],
        authGrpNo: this.authGrpMenusParam.authGrpNo,
        createUserId: this.$store.getters.token,
      };
      this.$http.request(
        (_result) => {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395', // 안내
            message: 'M0000000006', // 저장되었습니다
            type: 'success',
          });
          this.authGrpGridSelectedRow({
            authGrpNo: this.authGrpMenusParam.authGrpNo,
          });
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /** /기타 function **/
    resizeGrid() {
      let _height = window.innerHeight - 335;
      if (window.innerHeight < 500) {
        _height = 250;
      }

      this.YAuiGrid.resize(null, _height);
    },
  },
};
</script>
<style>
.authGrpMenu .el-table__body-wrapper {
  height: 456px !important;
}
.menu-tree {
  height: 456px;
  overflow-y: scroll;
}
</style>
