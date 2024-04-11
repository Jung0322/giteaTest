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
            <!-- 교육 그룹 상세 -->
            <y-label
              label="L0000003640"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 저장 -->
              <y-btn
                v-if="editable && insertMode"
                :action-url="insertUrl"
                :param="eduGroup"
                :is-submit="isInsert"
                title="L0000002474"
                color="orange"
                action-type="POST"
                beforeSubmit="beforeInsert"
                @beforeInsert="beforeInsert"
                @btnClicked="btnInsertClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 저장 -->
              <y-btn
                v-if="editable && updateMode"
                :action-url="editUrl"
                :param="eduGroup"
                :is-submit="isEdit"
                title="L0000002474"
                color="orange"
                action-type="PUT"
                beforeSubmit="beforeEdit"
                @beforeEdit="beforeEdit"
                @btnClicked="btnEditClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 사용여부로 대체함 -->
              <!-- <y-btn
                title="삭제"
                color="red"
                v-if="editable && updateMode"
                @btnClicked="btnDeleteClickedCallback"
              />-->
              <!-- 닫기 -->
              <y-btn title="L0000000881" @btnClicked="closePopup" />
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 등록자 -->
              <y-text
                :width="8"
                :editable="editable"
                :disabled="true"
                ui="bootstrap"
                label="L0000000976"
                name="createUserNm"
                v-model="eduGroup.createUserNm"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 등록일 -->
              <y-text
                :width="8"
                :editable="editable"
                :disabled="true"
                ui="bootstrap"
                label="L0000000973"
                name="createDt"
                v-model="eduGroup.createDt"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-plant
                type="edit"
                :required="true"
                :editable="editable"
                name="plantCd"
                v-model="eduGroup.plantCd"
                v-validate="'required'"
                :state="validateState('plantCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 그룹명 -->
              <y-text
                :width="8"
                :editable="editable"
                :required="true"
                ui="bootstrap"
                label="L0000000735"
                :maxlength="30"
                name="grpNm"
                v-model="eduGroup.grpNm"
                v-validate="'required'"
                :state="validateState('grpNm')"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 사용여부 -->
              <y-switch
                :width="8"
                :editable="editable"
                true-value="Y"
                false-value="N"
                ui="bootstrap"
                label="L0000001439"
                name="useYn"
                selectText="L0000001440"
                unselectText="L0000001063"
                v-model="eduGroup.useYn"
              />
            </b-col>
            <b-col sm="12" class="mt-1">
              <b-card>
                <b-row>
                  <b-col sm="3" md="3" lg="3" xl="3" class="col-xxl-3">
                    <!-- 부서 -->
                    <y-tree-dept
                      label="L0000001287"
                      v-model="searchUserParam.deptCd"
                      :plantCd="eduGroup.plantCd"
                    />
                  </b-col>
                  <b-col sm="3" md="3" lg="3" xl="3" class="col-xxl-3">
                    <!-- 사원명 -->
                    <y-text
                      :width="8"
                      :editable="editable"
                      label="L0000001482"
                      ui="bootstrap"
                      name="userNm"
                      v-model="searchUserParam.userNm"
                    ></y-text>
                  </b-col>
                </b-row>
                <b-row>
                  <!-- <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
                    <div
                      slot="buttonGroup"
                      sm="1"
                      md="1"
                      lg="1"
                      xl="1"
                      class="float-right mb-1"
                    >
                       검색 -
                      <y-btn
                        v-if="editable"
                        :width="8"
                        title="L0000000327"
                        color="blue"
                        @btnClicked="getUserList"
                      />
                    </div>
                     사원 목록 
                    <y-data-table
                      :height="gridTestItemLeftOptions.height"
                      :headers="gridTestItemLeftOptions.header"
                      :items="gridTestItemLeftOptions.data"
                      :useRownum="false"
                      v-model="testItemLeftValue"
                      label="L0000001481"
                      ref="testItemLeftDataTable"
                      :popMode="true"
                    >
                      <el-table-column
                        type="selection"
                        slot="selection"
                        align="center"
                        width="55"
                      ></el-table-column>
                    </y-data-table>
                  </b-col> -->
                  <b-col sm="5" class="h100p">
                    <y-auigrid
                      ref="yAuiGrid"
                      :name="gridTestItemLeftOptions.name"
                      :headers="gridTestItemLeftOptions.header"
                      :btns="gridTestItemLeftOptions.btns"
                      :height="gridTestItemLeftOptions.height"
                      :useExcelExport="false"
                      :enableCellMerge="true"
                      :enableSorting="true"
                      :showGridSetSave="true"
                      :useContextMenu="true"
                      :showRowCheckColumn="true"
                      :enableRightDownFocus="true"
                      :showGridCtrl="true"  
                      @getUserList="getUserList"
                    />
                  </b-col>
                  <!-- 가운데 버튼 영역 -->
                  <b-col
                    sm="1"
                    md="1"
                    lg="1"
                    xl="1"
                    class="col-xxl-1 text-center"
                  >
                    <b-row align-v="center" style="height: 100%">
                      <b-col>
                        <b-row class="mb-2">
                          <b-col>
                            <b-button @click.stop="btnMoveClicked">
                              <f-icon icon="angle-right" />
                            </b-button>
                          </b-col>
                        </b-row>
                        <b-row>
                          <b-col>
                            <b-button @click.stop="btnDeleteTestItemClicked">
                              <f-icon icon="angle-left" />
                            </b-button>
                          </b-col>
                        </b-row>
                      </b-col>
                    </b-row>
                  </b-col>
                  <!-- <b-col sm="5" md="5" lg="5" xl="5" class="col-xxl-5">
                     교육 대상자 목록 
                    <y-data-table
                      :height="gridTestItemRightOptions.height"
                      :headers="gridTestItemRightOptions.header"
                      :items="gridTestItemRightOptions.data"
                      :useRownum="false"
                      v-model="testItemRightValue"
                      label="L0000000610"
                      ref="testItemRightDataTable"
                      :popMode="true"
                    >
                      <el-table-column
                        type="selection"
                        slot="selection"
                        align="center"
                        width="55"
                      ></el-table-column>
                    </y-data-table>
                  </b-col> -->
                  <b-col sm="6" class="h100p">
                    <y-auigrid
                      ref="auiGrid"
                      :name="gridTestItemRightOptions.name"
                      :headers="gridTestItemRightOptions.header"
                      :btns="gridTestItemRightOptions.btns"
                      :height="gridTestItemRightOptions.height"
                      :useExcelExport="false"
                      :enableCellMerge="true"
                      :enableSorting="true"
                      :showGridSetSave="true"
                      :useContextMenu="true"
                      :showRowCheckColumn="true"
                      :enableRightDownFocus="true"
                      :showGridCtrl="true"  
                    />
                  </b-col>
                </b-row>
              </b-card>
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
      eduGrpNo: 0,
      eduAttCd: null,
      eduAttNm: '',
      eduCourseNm: '',
      groupNm: '',
      createUserNm: '',
      createDt: '',
      userNm: '',
      plantCd: '',
      eduGroupUsers: [],
      eduUserId: [],
      eduDeptCd: [],
      useYn: 'Y',
      useYnNm: '',
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
      name: 'educationGroupDetailLeft',
      btns: [],
      header: [],
      data: [],
      height: '300',
    },
    gridTestItemRightOptions: {
      name: 'educationGroupDetailRight',
      btns: [],
      header: [],
      data: [],
      height: '300',
    },
    YAuiGrid: null,
    AuiGrid: null,
    testItemLeftValue: [],
    testItemRightValue: [],
  }),
  watch: {
    'eduGroup.eduAttCd': function (newValue, oldValue) {
      this.getEduCourseItems();
    },
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.AuiGrid = this.$refs.auiGrid;
  },
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      // this.eduGroup.plantCd = this.$store.getters.plantCd;

      this.editable = this.$route.meta.editable;

      // URL 셋팅
      this.insertUrl = transactionConfig.saf.education.eduGroup.insert.url;
      this.editUrl = transactionConfig.saf.education.eduGroup.edit.url;
      this.deleteUrl = transactionConfig.saf.education.eduGroup.delete.url;
      this.getUrl = selectConfig.saf.education.eduGroup.get.url;
      this.searchUserUrl = selectConfig.manage.user.list.url;

      this.getEduAttCdItems();
      this.getEduCourseItems();
      // this.getUserList(); // 부서에 따른 사용자 검색

      // 이수자 검색
      if (this.eduGroup.safEduMstNo !== 0) {
        this.getDetailUser();
      }

      // 선택된 부서의 유저 목록 그리드 헤더 설정 왼쪽
      this.gridTestItemLeftOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001287'), 
          dataField: 'deptNm', 
          width: '50%', 
          style: 'left-align'
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001482'), 
          dataField: 'userNm', 
          width: '50%', 
          style: 'left-align'
        },
      ];
      this.gridTestItemLeftOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'blue',
          btnClicked: 'getUserList',
        },
      ]
      // 선택된 유저 목록 그리드 헤더 설정 오른쪽
      this.gridTestItemRightOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001287'), 
          dataField: 'deptNm', 
          width: '50%', 
          style: 'left-align'
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001482'), 
          dataField: 'userNm', 
          width: '50%', 
          style: 'left-align'
        },
      ];

      if (this.popupParam.eduGrpNo === 0) {
        this.eduGroup.createUserNm = this.$store.getters.name;
        this.updateMode = false;
        this.insertMode = true;

        this.eduGroup.createDt = this.$comm
          .moment(this.$comm.getToday())
          .format('YYYY-MM-DD');
      } else {
        this.eduGroup.eduGrpNo = this.popupParam.eduGrpNo;
        this.getDetail();

        this.updateMode = true;
        this.insertMode = false;
      }
    },
    getDetail() {
      this.$http.url = this.$format(this.getUrl, this.eduGroup.eduGrpNo);
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.eduGroup = this.$_.clone(_result.data);
          this.gridTestItemRightOptions.data = this.$_.clone(
            _result.data.eduGroupUsers
          );
          this.AuiGrid.setGridData(this.gridTestItemRightOptions.data)
          this.updateMode = true;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', 'M0000000016');
        }
      );
    },
    getEduAttCdItems() {
      this.$http.url = this.$format(
        selectConfig.codeMaster.getSelect.url,
        'SAF_EDU_ATT'
      );
      this.$http.type = 'get';
      this.$http.request(
        (_result) => {
          this.eduAttCdItems = this.$_.clone(_result.data);
          this.eduAttCdItems.splice(0, 0, {
            code: null,
            codeNm: this.$comm.getLangSpecInfoLabel('L0000003394'),
          }); // 선택하세요
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', 'M0000000016');
          // 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
        }
      );
    },
    getEduCourseItems() {
      this.$http.url = selectConfig.saf.education.eduCourse.list.url;
      this.$http.type = 'GET';
      this.$http.param = {
        useYn: 'Y',
        eduAttCd: this.eduGroup.eduAttCd,
      };
      this.$http.request(
        (_result) => {
          this.eduCourseItems = this.$_.clone(_result.data);
          this.eduCourseItems.splice(0, 0, {
            safEduCourseNo: null,
            eduCourseNm: this.$comm.getLangSpecInfoLabel('L0000003394'), // 선택하세요
          });
          if (
            this.eduGroup.safEduCourseNo &&
            this.$_.indexOf(
              this.$_.map(this.eduCourseItems, 'safEduCourseNo'),
              this.eduGroup.safEduCourseNo
            ) === -1
          ) {
            this.eduGroup.safEduCourseNo = null;
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', 'M0000000016');
          // 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
        }
      );
    },
    beforeInsert() {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321', // 확인
              message: 'M0000000011', // 저장하시겠습니까?
              type: 'info',
              confirmCallback: () => {
                this.eduGroup.eduGroupUsers =
                  this.gridTestItemRightOptions.data;
                this.eduGroup.createUserId = this.$store.getters.token;
                this.isInsert = true;
              },
            });
          } else {
            this.$popupRequired.check(
              'educationGroupDetail',
              this.$data,
              this.errors
            );
          }
        })
        .catch(() => {
          window.getApp.$emit('APP_VALID_ERROR', 'M0000000876');
          // 위험 Matrix 정보를 생성해 주세요.
        });
    },
    beforeEdit() {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321', // 확인
              message: 'M0000000011', // 저장하시겠습니까?
              type: 'info',
              confirmCallback: () => {
                this.eduGroup.eduGroupUsers =
                  this.AuiGrid.getGridData();
                this.eduGroup.updateUserId = this.$store.getters.token;
                this.isEdit = true;
              },
            });
          } else if (!_result) {
            this.$popupRequired.check(
              'educationGroupDetail',
              this.$data,
              this.errors
            );
          }
        })
        .catch(() => {
          window.getApp.$emit('APP_VALID_ERROR', 'M0000000876');
        });
    },
    beforeComple() {},
    btnDeleteClickedCallback(_result) {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321', // 확인
        message: 'M0000000012', // 삭제하시겠습니까?
        type: 'info',
        // 확인 callback 함수
        confirmCallback: () => {
          this.$http.url = this.$format(
            this.deleteUrl,
            this.popupParam.eduGrpNo
          );
          this.$http.type = 'DELETE';
          this.$http.request(
            (_result) => {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395', // 안내
                message: 'M0000000007', // 삭제되었습니다.
                type: 'success',
              });
              this.closePopup();
            },
            (_error) => {
              window.getApp.$emit('APP_REQUEST_ERROR', 'M0000000016');
            }
          );
        },
        // 취소 callback 함수
        cancelCallback: () => {},
      });
    },
    validateState(_ref) {
      if (
        this.veeBag[_ref] &&
        (this.veeBag[_ref].dirty || this.veeBag[_ref].validated)
      ) {
        return !this.errors.has(_ref);
      }
      return null;
    },
    // 신규등록
    btnInsertClickedCallback(_result) {
      this.eduGroup.eduGrpNo = _result.data;

      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // 안내
        message: 'M0000000006', // 저장되었습니다.
        type: 'success',
      });
      this.isInsert = false;
      this.insertMode = false;
      this.updateMode = true;
      this.getDetail();
    },
    // 수정
    btnEditClickedCallback(_result) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // 안내
        message: 'M0000000006', // 저장되었습니다.
        type: 'success', // success / info / warning / error
      });
      this.updateMode = true;
      this.insertMode = false;
      this.isEdit = false;
      this.getDetail();
    },
    closePopup() {
      this.$emit('closePopup');
    },
    /**
     * 버튼 에러 처리용 공통함수
     */
    btnClickedErrorCallback(_result) {
      this.isInsert = false;
      this.isEdit = false;
      window.getApp.emit('APP_REQUEST_ERROR', _result);
    },
    // 검색
    btnSearchClickedCallback(_result) {
      this.gridTestItemLeftOptions.data = this.$_.clone(_result.data);
    },
    // 사용자 전체 검색
    getUserList() {
      if (
        this.searchUserParam.deptCd !== '' ||
        this.searchUserParam.userNm !== ''
      ) {
        this.$http.url = this.$format(
          selectConfig.manage.user.list.url,
          this.searchUserParam.deptCd,
          this.searchUserParam.userNm,
          this.eduGroup.plantCd
        );
        this.$http.param = {
          deptCd: this.searchUserParam.deptCd,
          userNm: this.searchUserParam.userNm,
          plantCd: this.eduGroup.plantCd,
        };
        this.$http.type = 'GET';
        this.$http.request(
          (_result) => {
            this.gridTestItemLeftOptions.data = this.$_.clone(_result.data);
            this.YAuiGrid.setGridData(this.$_.clone(_result.data))
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      } else {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000000260', // 사원명또는 부서를 입력해주세요.
          type: 'warning', // success / info / warning / error
        });
      }
    },
    // 교육번호에 따른 교육 이수자 검색
    getDetailUser() {
      this.$http.url = this.$format(
        selectConfig.saf.education.eduMaster.getUser.url,
        this.eduMaster.safEduMstNo
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.gridTestItemRightOptions.data = this.$_.clone(_result.data);
          this.setUserList();
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    // 최종 데이터 master에 전달
    setUserList() {
      var userIdList = [];
      var deptCdList = [];
      this.AuiGrid.getGridData().forEach((element) => {
        userIdList.push(element.userId);
        deptCdList.push(element.deptCd);
      });
      // this.gridTestItemRightOptions.data.forEach((element) => {
      //   userIdList.push(element.userId);
      //   deptCdList.push(element.deptCd);
      // });
      this.eduGroup.eduUserId = userIdList;
      this.eduGroup.eduDeptCd = deptCdList;
    },
    /**
     * 유저 목록에 선택된 정보를 선택된 유저 목록으로 이동
     */
    btnMoveClicked() {
      let checkingData = this.YAuiGrid.getCheckedRowItems();
      checkingData.forEach((item) => {
        this.testItemLeftValue.push(item.item); 
      })
      
      // 1. 추가된 아이템 중 기존 항목이 있는지 체크
      var filteredDuplicatedArray = this.$comm.removeDuplicatedArrayObject(
        this.AuiGrid.getGridData(),
        this.testItemLeftValue,
        'userId'
      );
      // 2. 선택된 항목중에서 기존에 선택된 항목을 제외한 항목을 가져와서 기존 항목과 합침
      if (filteredDuplicatedArray.length > 0) {
        this.gridTestItemRightOptions.data = this.$_.concat(
          this.AuiGrid.getGridData(),
          filteredDuplicatedArray
        );
        this.AuiGrid.setGridData(this.gridTestItemRightOptions.data)
        this.setUserList();
      }
    },
    /**
     * 선택된 유저 목록에 선택된 정보를 삭제(화면상으로)
     */
    btnDeleteTestItemClicked(_result) {
      let checkingData = this.AuiGrid.getCheckedRowItemsAll();

      let gridData = this.AuiGrid.getGridData();
      this.$_.forEach(checkingData, (item) => {
        gridData = this.$_.reject(gridData, item);
      });

      this.AuiGrid.setGridData(gridData)
      this.setUserList();
    },
  },
};
</script>
