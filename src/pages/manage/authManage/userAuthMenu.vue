<!--
  목적 : 사용자 권한별 메뉴 컴포넌트
  작성자 : sch
  Detail :
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row>
      <!-- 권한 그룹 영역 -->
      <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
        <!-- 권한그룹 목록 -->
        <y-data-table
          :headers="authGrpGridOptions.header"
          :items="authGrpGridOptions.data"
          :height="300"
          :useRownum="false"
          label="L0000004529"
          @selectedRow="authGridSelectedRow"
        ></y-data-table>
      </b-col>
    </b-row>

    <b-row class="mt-3">
      <b-col
        v-if="!isPlantDept && !isNoDeptAuth"
        sm="6"
        md="6"
        lg="6"
        xl="6"
        class="col-xxl-6"
      >
        <div slot="buttonGroup" class="float-right mb-1">
          <!-- 부서 추가 -->
          <y-btn
            v-if="updateMode && !isNoDeptAuth"
            title="L0000001300"
            color="orange"
            @btnClicked="btnDeptAdd"
            @btnClickedErrorCallback="btnClickedErrorCallback"
          />
          <!-- 부서 제외 -->
          <y-btn
            v-if="
              updateMode && deptGridOptions.data.length > 0 && !isNoDeptAuth
            "
            title="L0000001299"
            color="red"
            @btnClicked="btnDeptRemove"
            @btnClickedErrorCallback="btnClickedErrorCallback"
          />
        </div>
        <!-- 설정된 부서 -->
        <y-data-table
          :headers="deptGridOptions.header"
          :height="deptGridOptions.height"
          :items="deptGridOptions.data"
          :useRownum="false"
          :use-paging="true"
          :editable="!isNoDeptAuth"
          label="L0000004530"
          ref="deptGrid"
          v-model="deptGridOptions.selectedItems"
        >
          <el-table-column
            type="selection"
            slot="selection"
            align="center"
            width="55"
          ></el-table-column>
        </y-data-table>
      </b-col>
      <!-- 사용자 영역 -->
      <b-col v-if="!isPlantDept" sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
        <div slot="buttonGroup" class="float-right mb-1">
          <!-- 사용자 추가 -->
          <y-btn
            v-if="updateMode"
            title="L0000001464"
            color="orange"
            @btnClicked="btnUserAdd"
            @btnClickedErrorCallback="btnClickedErrorCallback"
          />
          <!-- 사용자 제외 -->
          <y-btn
            v-if="updateMode && userGridOptions.data.length > 0"
            title="L0000001463"
            color="red"
            @btnClicked="btnUserRemove"
            @btnClickedErrorCallback="btnClickedErrorCallback"
          />
        </div>
        <!-- 설정된 사용자 -->
        <y-data-table
          :headers="userGridOptions.header"
          :height="userGridOptions.height"
          :items="userGridOptions.data"
          :useRownum="false"
          :use-paging="true"
          label="L0000004531"
          ref="userGrid"
          v-model="userGridOptions.selectedItems"
        >
          <el-table-column
            type="selection"
            slot="selection"
            align="center"
            width="55"
          ></el-table-column>
        </y-data-table>
      </b-col>

      <b-col v-if="isPlantDept" sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
        <div slot="buttonGroup" class="float-right mb-1">
          <!-- 부서 단위 추가 -->
          <y-btn
            v-if="isPlantDept"
            title="L0000001288"
            color="orange"
            @btnClicked="btnAuthPlantDeptAdd"
            @btnClickedErrorCallback="btnClickedErrorCallback"
          />
          <!-- 사용자 단위 추가 -->
          <y-btn
            v-if="isPlantDept"
            title="L0000001461"
            color="orange"
            @btnClicked="btnAuthPlantUserAdd"
            @btnClickedErrorCallback="btnClickedErrorCallback"
          />
          <!-- 제외 -->
          <y-btn
            v-if="isPlantDept && deptGridOptions.plantdata.length > 0"
            title="L0000002620"
            color="red"
            @btnClicked="btnAuthPlantDeptRemove"
            @btnClickedErrorCallback="btnClickedErrorCallback"
          />
        </div>
        <!-- 타사업장 접근권한 목록 -->
        <y-data-table
          :headers="deptGridOptions.header"
          :height="deptGridOptions.height"
          :items="deptGridOptions.plantdata"
          :useRownum="false"
          :use-paging="true"
          label="L0000004532"
          ref="deptGrid"
          v-model="deptGridOptions.selectedPlantItems"
        >
          <el-table-column
            type="selection"
            slot="selection"
            align="center"
            width="55"
          ></el-table-column>
        </y-data-table>
      </b-col>

      <b-col v-if="isPlantDept" sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
        <!-- 부서 단위 추가 -->
        <div slot="buttonGroup" class="float-right mb-1">
          <y-btn
            v-if="isPlantDept"
            title="L0000001288"
            color="orange"
            @btnClicked="btnAuthDeptAdd"
            @btnClickedErrorCallback="btnClickedErrorCallback"
          />
          <!-- 사용자 단위 추가 -->
          <y-btn
            v-if="isPlantDept"
            title="L0000001461"
            color="orange"
            @btnClicked="btnAuthUserAdd"
            @btnClickedErrorCallback="btnClickedErrorCallback"
          />
          <!-- 제외 -->
          <y-btn
            v-if="isPlantDept && deptGridOptions.deptdata.length > 0"
            title="L0000002620"
            color="red"
            @btnClicked="btnAuthDeptRemove"
            @btnClickedErrorCallback="btnClickedErrorCallback"
          />
        </div>
        <!-- 타부서 접근권한 목록 -->
        <y-data-table
          :headers="deptGridOptions.header"
          :height="deptGridOptions.height"
          :items="deptGridOptions.deptdata"
          :useRownum="false"
          :use-paging="true"
          label="L0000004533"
          ref="userGrid"
          v-model="deptGridOptions.selectedDeptItems"
        >
          <el-table-column
            type="selection"
            slot="selection"
            align="center"
            width="55"
          ></el-table-column>
        </y-data-table>
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  /** attributes: name, components, props, data **/
  name: 'user-auth-menu', // 반드시 입력하세요(안 하면 warning 발생). 네이밍 룰은 현재 vue component의 파일명의 단어를 "-"로 구분(예:exam-data)하여 입력하시면 됩니다. 입력후 이 주석은 지워주세요.
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
      authGrpNo: '',
      updateMode: false,
      deptGridOptions: {
        header: [],
        data: [],
        plantdata: [],
        deptdata: [],
        selectedItems: [],
        selectedPlantItems: [],
        selectedDeptItems: [],
        height: '300',
        getUrl: '',
        getParams: {
          useYn: 'Y',
        },
      },
      userGridOptions: {
        header: [],
        data: [],
        selectedItems: [],
        height: '300',
        getUrl: '',
        getParams: {
          useYn: 'Y',
        },
      },
      authGrpGridOptions: {
        header: [],
        data: [],
        selectedItems: [],
        getParams: {
          useYn: 'Y',
          searchFlag: 'pd',
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
      isPlantDept: false,
      authUrl: '',
      authPlantDeptUrl: '',
      authPlantDeptSaveUrl: '',
      authPlantUserSaveUrl: '',
      authPlantDeptDeleteUrl: '',
      authUserDeptUrl: '',
      authDeptSaveUrl: '',
      authDeptDeleteUrl: '',
      authUserSaveUrl: '',
      authUserDeleteUrl: '',
      authGrpSubDeptUrl: '',
      selectedRow: {},
    };
  },
  computed: {
    /**
     * 2022.02.16 LHJ
     * 임원, 팀장, 담당 권한은 부서 지정 그리드 없애기
     */
    isNoDeptAuth() {
      let authLen = this.$_.filter(['1029', '1030', '1031'], (auth) => {
        return String(auth) === String(this.selectedRow.authGrpNo);
      }).length;

      return authLen ? true : false;
    },
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
  },
  mounted() {},
  beforeDestory() {
    this.init();
  },
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      // 권한 부여
      this.authUrl = selectConfig.authGrp.list.url;
      // 권한에 따른 사용자/부서 조회
      this.authUserDeptUrl = selectConfig.authGrpUserDept.list.url;
      // 권한에 따른 부서정보 저장
      this.authDeptSaveUrl = transactionConfig.userAuthGrp.insertDept.url;
      // 권한에 따른 부서정보 삭제
      this.authDeptDeleteUrl = transactionConfig.userAuthGrp.deleteDept.url;
      // 권한에 따른 사용자정보 저장
      this.authUserSaveUrl = transactionConfig.userAuthGrp.insert.url;
      // 권한에 따른 사용자정보 삭제
      this.authUserDeleteUrl = transactionConfig.userAuthGrp.delete.url;
      // 사업장/부서 접근 권한에 따른 부서 조회
      this.authPlantDeptUrl = selectConfig.authGrpPlantDept.list.url;
      this.authPlantDeptSaveUrl =
        transactionConfig.userAuthGrp.insertAuthDept.url;
      this.authPlantUserSaveUrl =
        transactionConfig.userAuthGrp.insertAuthUser.url;
      this.authPlantDeptDeleteUrl =
        transactionConfig.userAuthGrp.deleteAuthDept.url;

      // 선택된 부서의 하위부서 조회
      this.authGrpSubDeptUrl = selectConfig.authGrpPlantDept.authGrpSubDept.url;

      this.getAuthGrps();

      this.deptGridOptions.header = [
        {
          text: 'L0000004366',
          name: 'plantNm',
          width: '150px',
          align: 'center',
        }, // 사업장
        {
          text: 'L0000004367',
          name: 'deptNm',
          width: '150px',
          align: 'center',
        }, // 부서명
        {
          text: 'L0000001307', // 부서레벨
          name: 'deptLvlNm',
          width: '100px',
          align: 'center',
        },
        // {
        //   text: '부여된 권한 영역',
        //   name: 'comment',
        //   width: '150px',
        //   align: 'center',
        // },
      ];
      this.userGridOptions.header = [
        {
          text: 'L0000001465',
          name: 'userId',
          width: '100px',
          align: 'center',
        }, // 사용자ID
        {
          text: 'L0000001472',
          name: 'userNm',
          width: '100px',
          align: 'center',
        }, // 사용자명
        {
          text: 'L0000004366',
          name: 'plantNm',
          width: '100px',
          align: 'center',
        }, // 사업장명
        { text: 'L0000004367', name: 'deptNm', width: '200px' }, // 부서명
      ];

      this.authGrpGridOptions.header = [
        {
          text: 'L0000001470', // 사용자그룹명
          name: 'authGrpNm',
          width: '200px',
          textCalculate: this.getTextComment,
        },
        // {
        //   text: '권한 부여 여부',
        //   name: 'settingYn',
        //   width: '100px',
        //   type: 'checkbox',
        //   useDefault: true,
        //   align: 'center',
        //   sortable: false,
        // },
      ];
    },
    /** /초기화 관련 함수 **/
    getTextComment(_row, _name) {
      var text = _row[_name];
      if (_name === 'authGrpNm') {
        if (_row['authGrpNo'] === 1015) {
          text =
            text +
            ' <span class="el-tag el-tag--danger el-tag--mini el-tag--light"><i class="el-icon-warning"></i>' +
            '플랜트 접근권한은 사업장/부서 접근을 설정하는 권한입니다.' +
            '특정 부서를 사업장 접근 처리하게 되면 부서 접근 또한 같이 적용됩니다.' +
            '반대로 특정 부서를 부서 접근에서 제외하게 되면 사업장 접근 또한 같이 제외됩니다.' +
            '</span>';
        }
      }
      return text;
    },

    /** Call API service */
    // 기본 권한 그룹 조회
    getAuthGrps() {
      this.$http.url = this.authUrl;
      this.$http.param = this.authGrpGridOptions.getParams;
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.authGrpGridOptions.data = _result.data;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /** /Call API service **/

    /** Component Events, Callbacks (버튼 제외) **/
    authGridSelectedRow(row) {
      if (row.authGrpNo === 1015) {
        this.isPlantDept = true;
        if (this.deptGridOptions.header.length === 3) {
          this.deptGridOptions.header.splice(3, 0, {
            text: 'L0000004534', // 부여된 권한 영역
            name: 'comment',
            width: '150px',
            align: 'center',
          });
        }
        this.$http.url = this.authPlantDeptUrl;
        this.$http.type = 'GET';
        this.$http.param = {
          authGrpNo: row.authGrpNo,
        };
        this.$http.request(
          (_result) => {
            this.deptGridOptions.plantdata = _result.data.plant;
            this.deptGridOptions.deptdata = _result.data.dept;
            this.authGrpNo = row.authGrpNo;
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      } else {
        this.isPlantDept = false;
        if (this.deptGridOptions.header.length === 4) {
          this.deptGridOptions.header.splice(3, 1);
        }
        this.$http.url = this.authUserDeptUrl;
        this.$http.type = 'GET';
        this.$http.param = {
          authGrpNo: row.authGrpNo,
        };
        this.$http.request(
          (_result) => {
            this.deptGridOptions.data = _result.data.dept;
            this.userGridOptions.data = _result.data.user;
            this.updateMode = true;
            this.authGrpNo = row.authGrpNo;
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      }

      this.selectedRow = row;
    },
    /** /Component, Callbacks (버튼 제외) **/

    /** Button Event **/
    /**
     * 버튼 에러 처리용 공통함수
     */
    btnClickedErrorCallback(_result) {
      // TODO : 여기에 추가 로직 삽입(로직 삽입시 지워주세요)
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    btnDeptAdd() {
      this.popupOptions.target = () =>
        import(`${'../../baseInfo/deptManage/deptSearchPopup.vue'}`);
      this.popupOptions.title = 'L0000001287'; // 부서
      this.popupOptions.param = {
        multiple: true,
      };
      this.popupOptions.width = '35%';
      this.popupOptions.top = '10px';
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closeDeptPopup;
    },
    closeDeptPopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data && data.length > 0) {
        let saveData = [];
        this.$_.forEach(data, (item) => {
          if (
            this.$_.findIndex(this.deptGridOptions.data, {
              deptCd: item.deptCd,
            }) === -1
          ) {
            // this.deptGridOptions.data.splice(0, 0, item);
            saveData.splice(0, 0, {
              authGrpNo: this.authGrpNo,
              deptCd: item.deptCd,
              createUserId: this.$store.getters.token,
            });
          }
        });
        // 바로 저장 한다.
        this.$http.url = this.authDeptSaveUrl;
        this.$http.type = 'POST';
        this.$http.param = {
          deptAuthGrps: saveData,
        };
        this.$http.request(
          (_result) => {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395', // 안내
              message: 'M0000000006', // 저장되었습니다.
              type: 'success',
            });
            this.authGridSelectedRow({ authGrpNo: this.authGrpNo });
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      }
    },
    btnDeptRemove() {
      var deptCds = '';
      var subDeptItem = [];
      var targetData = [];

      if (
        !this.deptGridOptions.selectedItems ||
        this.deptGridOptions.selectedItems.length === 0
      ) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000000530', // 제외할 부서를 선택하세요
          type: 'warning',
        });
      } else {
        // 선택된 부서들의 하위부서 목록 조회
        this.$_.forEach(this.deptGridOptions.selectedItems, (item) => {
          deptCds += ',' + item.deptCd;
        });

        this.$http.url = this.authGrpSubDeptUrl;
        this.$http.type = 'GET';
        this.$http.param = {
          deptCds: deptCds,
        };
        this.$http.request(
          (_result) => {
            subDeptItem = _result.data;
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );

        this.confirm({
          title: this.$comm.getLangSpecInfoLabel('L0000003321'), // 확인
          message: this.$comm.getLangSpecInfoMessage('M0000000531'), // 하위부서와 같이 제외하시겠습니까?
          type: 'info',
          // 확인 callback 함수 (선택된 부서의 하위부서도 같이 삭제)
          confirmCallback: () => {
            this.$_.forEach(this.deptGridOptions.data, (item) => {
              let idx = '';
              let sIdx = '';
              idx = this.$_.findIndex(subDeptItem, {
                deptCd: item.deptCd,
              });

              sIdx = this.$_.findIndex(this.deptGridOptions.selectedItems, {
                deptCd: item.deptCd,
              });

              if (idx > -1 && sIdx < 0) {
                targetData.splice(0, 0, item);
                this.deptGridOptions.selectedItems.splice(0, 0, item);
              }
            });
            this.$refs.deptGrid.toggleSelection(targetData);

            // 바로 삭제 한다.
            this.$http.url = this.authDeptSaveUrl;
            this.$http.type = 'DELETE';
            this.$http.param = {
              data: Object.values(this.deptGridOptions.selectedItems),
            };
            this.$http.request(
              (_result) => {
                window.getApp.$emit('ALERT', {
                  title: 'L0000003395', // 안내
                  message: 'M0000000686', // 제외되었습니다.
                  type: 'success',
                });
                this.authGridSelectedRow({ authGrpNo: this.authGrpNo });
              },
              (_error) => {
                window.getApp.$emit('APP_REQUEST_ERROR', _error);
              }
            );
          },
          // 취소 callback 함수 (선택된 부서만 삭제)
          cancelCallback: () => {
            // 바로 삭제 한다.
            this.$http.url = this.authDeptSaveUrl;
            this.$http.type = 'DELETE';
            this.$http.param = {
              data: Object.values(this.deptGridOptions.selectedItems),
            };
            this.$http.request(
              (_result) => {
                window.getApp.$emit('ALERT', {
                  title: 'L0000003395', // 안내
                  message: 'M0000000686', // 제외되었습니다.
                  type: 'success',
                });
                this.authGridSelectedRow({ authGrpNo: this.authGrpNo });
              },
              (_error) => {
                window.getApp.$emit('APP_REQUEST_ERROR', _error);
              }
            );
          },
        });

        // // 바로 삭제 한다.
        // this.$http.url = this.authDeptSaveUrl;
        // this.$http.type = 'DELETE';
        // this.$http.param = {
        //   data: Object.values(this.deptGridOptions.selectedItems),
        // };
        // this.$http.request(
        //   _result => {
        //     window.getApp.$emit('ALERT', {
        //       title: '안내',
        //       message: '제외되었습니다.',
        //       type: 'success',
        //     });
        //     this.authGridSelectedRow({ authGrpNo: this.authGrpNo });
        //   },
        //   _error => {
        //     window.getApp.$emit('APP_REQUEST_ERROR', _error);
        //   }
        // );
      }
    },
    btnUserAdd() {
      this.popupOptions.target = () =>
        import(`${'../../manage/user/userSearch.vue'}`);
      this.popupOptions.title = 'L0000001458'; // 사용자
      this.popupOptions.visible = true;
      this.popupOptions.width = '60%';
      this.popupOptions.top = '100px';
      this.popupOptions.param = {
        multiple: true,
      };
      this.popupOptions.closeCallback = this.closePopupUser;
    },
    closePopupUser(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      if (data.users) {
        let saveData = [];
        this.$_.forEach(data.users, (item) => {
          if (
            this.$_.findIndex(this.userGridOptions.data, {
              userId: item.userId,
            }) === -1
          ) {
            saveData.splice(0, 0, {
              authGrpNo: this.authGrpNo,
              userId: item.userId,
              createUserId: this.$store.getters.token,
            });
          }
        });
        // 바로 저장 한다.
        this.$http.url = this.authUserSaveUrl;
        this.$http.type = 'POST';
        this.$http.param = {
          userAuthGrps: saveData,
        };
        this.$http.request(
          (_result) => {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395', // 안내
              message: 'M0000000006', // 저장되었습니다.
              type: 'success',
            });
            this.authGridSelectedRow({ authGrpNo: this.authGrpNo });
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      }
    },
    btnUserRemove() {
      if (
        !this.userGridOptions.selectedItems ||
        this.userGridOptions.selectedItems.length === 0
      ) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000000530', // 제외할 부서를 선택하세요
          type: 'warning',
        });
      } else {
        // 바로 삭제 한다.
        this.$http.url = this.authUserDeleteUrl;
        this.$http.type = 'DELETE';
        this.$http.param = {
          data: Object.values(this.userGridOptions.selectedItems),
        };
        this.$http.request(
          (_result) => {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395', // 안내
              message: 'M0000000686', // 제외되었습니다.
              type: 'success',
            });
            this.authGridSelectedRow({ authGrpNo: this.authGrpNo });
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      }
    },
    btnAuthPlantDeptAdd() {
      this.popupOptions.target = () =>
        import(`${'../../baseInfo/deptManage/deptSearchPopup.vue'}`);
      this.popupOptions.title = 'L0000001287'; // 부서
      this.popupOptions.param = {
        multiple: true,
      };
      this.popupOptions.width = '35%';
      this.popupOptions.top = '10px';
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closeAuthPlantDeptPopup;
    },
    closeAuthPlantDeptPopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data && data.length > 0) {
        let saveData = [];
        this.$_.forEach(data, (item) => {
          if (
            this.$_.findIndex(this.deptGridOptions.plantdata, {
              deptCd: item.deptCd,
            }) === -1
          ) {
            saveData.splice(0, 0, {
              authGrpNo: this.authGrpNo,
              deptCd: item.deptCd,
              plantAccessYn: 'Y',
              deptAccessYn: 'Y',
              createUserId: this.$store.getters.token,
            });
          }
        });
        // 바로 저장 한다.
        this.$http.url = this.authPlantDeptSaveUrl;
        this.$http.type = 'POST';
        this.$http.param = {
          deptAuthGrps: saveData,
        };
        this.$http.request(
          (_result) => {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395', // 안내
              message: 'M0000000006', // 저장되었습니다.
              type: 'success',
            });
            this.authGridSelectedRow({ authGrpNo: this.authGrpNo });
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      }
    },
    btnAuthPlantUserAdd() {
      this.popupOptions.target = () =>
        import(`${'../../manage/user/userSearch.vue'}`);
      this.popupOptions.title = 'L0000001458'; // 사용자
      this.popupOptions.visible = true;
      this.popupOptions.width = '60%';
      this.popupOptions.top = '100px';
      this.popupOptions.param = {
        multiple: true,
      };
      this.popupOptions.closeCallback = this.closeAuthPlantUserPopup;
    },
    closeAuthPlantUserPopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data.users) {
        let saveData = [];
        this.$_.forEach(data.users, (item) => {
          if (
            this.$_.findIndex(this.deptGridOptions.plantdata, {
              userId: item.userId,
            }) === -1
          ) {
            saveData.splice(0, 0, {
              authGrpNo: this.authGrpNo,
              userId: item.userId,
              plantAccessYn: 'Y',
              deptAccessYn: 'Y',
              createUserId: this.$store.getters.token,
            });
          }
        });
        // 바로 저장 한다.
        this.$http.url = this.authPlantUserSaveUrl;
        this.$http.type = 'POST';
        this.$http.param = {
          deptAuthGrps: saveData,
        };
        this.$http.request(
          (_result) => {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395', // 안내
              message: 'M0000000006', // 저장되었습니다.
              type: 'success',
            });
            this.authGridSelectedRow({ authGrpNo: this.authGrpNo });
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      }
    },
    btnAuthPlantDeptRemove() {
      if (
        !this.deptGridOptions.selectedPlantItems ||
        this.deptGridOptions.selectedPlantItems.length === 0
      ) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000000532', // 제외할 부서 혹은 사용자를 선택하세요
          type: 'warning',
        });
      } else {
        this.$_.forEach(this.deptGridOptions.selectedPlantItems, (item) => {
          item.flag = 'p';
        });
        // 바로 삭제 한다.
        this.$http.url = this.authPlantDeptDeleteUrl;
        this.$http.type = 'DELETE';
        this.$http.param = {
          data: Object.values(this.deptGridOptions.selectedPlantItems),
        };
        this.$http.request(
          (_result) => {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395', // 안내
              message: 'M0000000686', // 제외되었습니다.
              type: 'success',
            });
            this.authGridSelectedRow({ authGrpNo: this.authGrpNo });
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      }
    },
    btnAuthDeptAdd() {
      this.popupOptions.target = () =>
        import(`${'../../baseInfo/deptManage/deptSearchPopup.vue'}`);
      this.popupOptions.title = 'L0000001287'; // 부서
      this.popupOptions.param = {
        multiple: true,
      };
      this.popupOptions.width = '35%';
      this.popupOptions.top = '10px';
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closeAuthDeptPopup;
    },
    closeAuthDeptPopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data && data.length > 0) {
        let saveData = [];
        this.$_.forEach(data, (item) => {
          if (
            this.$_.findIndex(this.deptGridOptions.deptdata, {
              deptCd: item.deptCd,
            }) === -1
          ) {
            // this.deptGridOptions.data.splice(0, 0, item);
            saveData.splice(0, 0, {
              authGrpNo: this.authGrpNo,
              deptCd: item.deptCd,
              plantAccessYn: 'N',
              deptAccessYn: 'Y',
              createUserId: this.$store.getters.token,
            });
          }
        });
        // 바로 저장 한다.
        this.$http.url = this.authPlantDeptSaveUrl;
        this.$http.type = 'POST';
        this.$http.param = {
          deptAuthGrps: saveData,
        };
        this.$http.request(
          (_result) => {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395', // 안내
              message: 'M0000000006', // 저장되었습니다.
              type: 'success',
            });
            this.authGridSelectedRow({ authGrpNo: this.authGrpNo });
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      }
    },
    btnAuthUserAdd() {
      this.popupOptions.target = () =>
        import(`${'../../manage/user/userSearch.vue'}`);
      this.popupOptions.title = 'L0000001458'; // 사용자
      this.popupOptions.visible = true;
      this.popupOptions.width = '60%';
      this.popupOptions.top = '100px';
      this.popupOptions.param = {
        multiple: true,
      };
      this.popupOptions.closeCallback = this.closeAuthUserPopup;
    },
    closeAuthUserPopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data.users) {
        let saveData = [];
        this.$_.forEach(data.users, (item) => {
          if (
            this.$_.findIndex(this.deptGridOptions.deptdata, {
              userId: item.userId,
            }) === -1
          ) {
            // this.deptGridOptions.data.splice(0, 0, item);
            saveData.splice(0, 0, {
              authGrpNo: this.authGrpNo,
              userId: item.userId,
              plantAccessYn: 'N',
              deptAccessYn: 'Y',
              createUserId: this.$store.getters.token,
            });
          }
        });
        // 바로 저장 한다.
        this.$http.url = this.authPlantUserSaveUrl;
        this.$http.type = 'POST';
        this.$http.param = {
          deptAuthGrps: saveData,
        };
        this.$http.request(
          (_result) => {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395', // 안내
              message: 'M0000000006', // 저장되었습니다.
              type: 'success',
            });
            this.authGridSelectedRow({ authGrpNo: this.authGrpNo });
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      }
    },
    btnAuthDeptRemove() {
      if (
        !this.deptGridOptions.selectedDeptItems ||
        this.deptGridOptions.selectedDeptItems.length === 0
      ) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000000530', // 제외할 부서를 선택하세요
          type: 'warning',
        });
      } else {
        this.$_.forEach(this.deptGridOptions.selectedDeptItems, (item) => {
          item.flag = 'd';
        });
        // 바로 삭제 한다.
        this.$http.url = this.authPlantDeptDeleteUrl;
        this.$http.type = 'DELETE';
        this.$http.param = {
          data: Object.values(this.deptGridOptions.selectedDeptItems),
        };
        this.$http.request(
          (_result) => {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395', // 안내
              message: 'M0000000686', // 제외되었습니다.
              type: 'success',
            });
            this.authGridSelectedRow({ authGrpNo: this.authGrpNo });
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      }
    },
    /** /Button Event **/

    /** 기타 function **/
    confirm(_option) {
      var type = '';
      if (_option.hasOwnProperty('type')) type = _option.type;
      this.$confirm(_option.message, _option.title, {
        confirmButtonText: this.$comm.getLangSpecInfoLabel('L0000003644'), // 예
        cancelButtonText: this.$comm.getLangSpecInfoLabel('L0000003645'), // 아니오
        type: type,
      })
        .then(
          typeof _option.confirmCallback === 'function'
            ? _option.confirmCallback
            : null
        )
        .catch(
          typeof _option.cancelCallback === 'function'
            ? _option.cancelCallback
            : null
        );
    },
    /** /기타 function **/
  },
};
</script>
<style>
.dept-th {
  font-size: 12.8px;
  color: #212529;
  background-color: #eef1f6 !important;
  height: 35px !important;
  padding: 6px 0 !important;
}
.dept-td {
  font-size: 12px;
  color: #212529;
  padding: 5px 0;
}
.dept-th div {
  line-height: 11px !important;
}
.dept-td div {
  vertical-align: bottom;
  line-height: 11px !important;
}
.dept-td .cell {
  max-height: 100px !important;
  line-height: 23px !important;
  overflow-y: auto;
  overflow-x: hidden;
}
.dept-td div .row {
  width: 240px;
}
</style>
