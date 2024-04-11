<!--
  목적 : 공통 > 결재선 변경 팝업
  Detail : 결재선 변경 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 검색 -->
    <b-row ref="searchBox">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 결재선 상세 -->
            <y-label
              label="L0000000431"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 적용 -->
              <y-btn
                title="L0000002482"
                color="blue"
                @btnClicked="applyApprList"
              />
              <!-- 닫기 -->
              <y-btn title="L0000000881" @btnClicked="closePopup" />
            </div>
          </b-col>
        </b-row>
        <b-card>
          <y-search-box
            :gridOptions="gridUserOptions"
            @enter="getList"
            class="col-sm-12 py-0 px-0"
          >
            <b-row slot="search">
              <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
                <y-plant
                  type="search"
                  name="plantCd"
                  v-model="searchParam.plantCd"
                />
              </b-col>
              <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
                <y-tree-dept
                  type="search"
                  name="deptCd"
                  :plantCd="searchParam.plantCd"
                  v-model="searchParam.deptCd"
                />
              </b-col>
              <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
                <!-- 사용자명 -->
                <y-text
                  :width="8"
                  ui="bootstrap"
                  label="L0000001472"
                  name="userNm"
                  v-model="searchParam.userNm"
                />
              </b-col>
            </b-row>
          </y-search-box>

          <b-row class="col-sm-12 px-0 mt-3" style="margin: 0px">
            <b-col sm="5" md="5" lg="5" xl="5" class="col-xxl-6 px-0">
              <div slot="buttonGroup" class="float-right mb-1">
                <!-- 검색 -->
                <y-btn
                  title="L0000000327"
                  color="green"
                  @btnClicked="getList"
                />
              </div>
              <!-- 사용자 목록 -->
              <y-data-table
                :height="gridUserOptions.height"
                :headers="gridUserOptions.header"
                :items="gridUserOptions.data"
                :useRownum="false"
                v-model="selectedUserValue"
                label="L0000001462"
                ref="testItemLeftDataTable"
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
            <!-- 가운데 버튼 영역 -->
            <b-col
              v-if="editable"
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
                  <b-row class="mb-2">
                    <b-col>
                      <b-button @click.stop="btnDeleteClicked">
                        <f-icon icon="angle-left" />
                      </b-button>
                    </b-col>
                  </b-row>
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-5 px-0">
              <div slot="buttonGroup" class="float-right mb-1">
                <b-col>
                  <b-row>
                    <b-col>
                      <b-button
                        @click.stop="btnUpClicked"
                        size="sm"
                        style="height: 30px;"
                      >
                        <f-icon icon="angle-up" />
                      </b-button>
                      <b-button
                        @click.stop="btnDownClicked"
                        size="sm"
                        style="height: 30px;"
                      >
                        <f-icon icon="angle-down" />
                      </b-button>
                    </b-col>
                  </b-row>
                </b-col>
              </div>
              <!-- 결재자 목록 -->
              <y-data-table
                :height="gridApprOptions.height"
                :headers="gridApprOptions.header"
                :items="gridApprOptions.data"
                v-model="selectedApprValue"
                :useRownum="false"
                label="L0000000449"
                ref="apprDataTable"
                :popMode="true"
              >
                <el-table-column
                  v-if="editable"
                  type="selection"
                  slot="selection"
                  align="center"
                  :selectable="canSelectRow"
                  width="55"
                ></el-table-column>
              </y-data-table>
            </b-col>
            <b-col
              v-if="editable"
              sm="1"
              md="1"
              lg="1"
              xl="1"
              class="col-xxl-1 text-center"
            ></b-col>
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
  /* attributes: name, components, props, data */
  name: 'com-appr-line-popup',
  props: {
    popupParam: {
      type: Object,
      default: {
        apprLines: [],
        isApprInProgress: false,
        apprRqstNo: 0,
      },
    },
  },
  data: () => ({
    searchParam: {
      deptCd: '', // 부서
      userNm: '', // 사용자명
      plantCd: '', // 사업자코드
      useYn: 'Y',
    },
    selectedUserValue: [],
    gridUserOptions: {
      header: [],
      data: [],
      height: '375',
    },
    selectedApprValue: [],
    gridApprOptions: {
      header: [],
      data: [],
      height: '375',
    },
    Appr: {
      apprRqstNo: 0,
      apprRqstLineList: {},
    },
    apprTypeItems: [], // 결재자유형 목록
    editable: false,
    searchUserUrl: '',
    apprRqstUserId: '',
    apprOrder: 0, // 결재순서
  }),
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      // this.editable = this.$route.meta.editable;
      this.editable = true;
      this.searchUserUrl = selectConfig.manage.user.list.url;
      this.searchParam.plantCd = this.$store.getters.plantCd;
      this.searchParam.deptCd = this.$store.getters.deptCd;

      // 사용자 그리드 헤더 설정
      this.gridUserOptions.header = [
        {
          text: 'L0000001287',
          name: 'deptNm',
          width: '120px',
          align: 'center',
        }, // 부서
        {
          text: 'L0000002772',
          name: 'dutyNm',
          width: '100px',
          align: 'center',
        }, // 직책
        {
          text: 'L0000001412',
          name: 'userId',
          width: '120px',
          align: 'center',
        }, // 사번
        {
          text: 'L0000001630',
          name: 'userNm',
          width: '120px',
          align: 'center',
        }, // 성명
      ];

      this.$comm.getComboItems('COM_APPR_TYPE', false).then(_result => {
        this.apprTypeItems = _result;
        this.apprTypeItems = this.$_.reject(this.apprTypeItems, {
          code: 'APTP0',
        });

        this.gridApprOptions.header = [
          {
            text: '결재순서',
            name: 'apprOrder',
            width: '80px',
            align: 'center',
          },
          {
            text: 'L0000001287',
            name: 'deptNm',
            width: '120px',
            align: 'center',
          }, // 부서
          {
            text: 'L0000000445', // 결재유형
            name: 'apprLineNm',
            width: '75px',
            align: 'center',
          },
          {
            text: 'L0000000428', // 결재상태
            name: 'apprStepNm',
            width: '75px',
            align: 'center',
          },
          {
            text: 'L0000001630',
            name: 'userNm',
            width: '120px',
            align: 'center',
          }, // 성명
          {
            text: 'L0000001412',
            name: 'userId',
            width: '100px',
            align: 'center',
          }, // 사번
          // {
          //   text: 'L0000000903', // 대결자
          //   name: 'delegatorNm',
          //   width: '80px',
          //   align: 'center',
          // },
        ];

        this.apprRqstUserId = this.popupParam.apprLines[0].userId;
        this.getList();
        this.setTarget(this.$_.clone(this.popupParam.apprLines));

        let apprCompleteCnt = 0;
        
        this.$_.forEach(this.gridApprOptions.data, (item, index) => {
          if (index === 0) {
            item.apprLineNm = this.$comm.getLangSpecInfoLabel('L0000003798'); // '기안'
            item.apprStepNm = this.$comm.getLangSpecInfoLabel('L0000002039'); // '완료'
          } else {
            item.apprOrder = index + 1;
            item.apprLineNm = this.$comm.getLangSpecInfoLabel('L0000003800'); // '결재'
          }
          if (item.apprStepCd === 'APSPA') {
            apprCompleteCnt++;
          }
        });
        this.gridApprOptions.data[
          apprCompleteCnt
        ].apprStepNm = this.$comm.getLangSpecInfoLabel('L0000003849'); // '대기'
      });
    },
    /** 사용자 목록 검색 **/
    getList() {
      if (
        this.searchParam.deptCd === '' &&
        this.searchParam.userNm === '' &&
        this.searchParam.plantCd === ''
      ) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000000517', // 검색 조건은 최소 1개이상 입력되어야합니다.
          type: 'warning', // success / info / warning / error
        });
      } else {
        this.$http.url = this.searchUserUrl;
        this.$http.type = 'GET';
        this.$http.param = this.searchParam;
        this.$http.request(
          _result => {
            this.gridUserOptions.data = this.$_.clone(_result.data);
          },
          _error => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      }
    },
    /**
     *  팝업 안 보이도록 설정 후 getReserveData 호출
     *  팝업 close
     * data : 팝업창에서 return하는 데이터
     */
    closePopup(data) {
      this.$emit('closePopup', { apprLineList: this.popupParam.apprLines });
    },
    /**
     * 수정 버튼 안보여지도록 처리
     *  버튼 http 통신 중 error 발생 callback
     * _result : error return하는 데이터
     */
    btnClickedErrorCallback(_result) {
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    getTarget() {
      return {
        data: this.$_.clone(this.gridApprOptions.data),
        selectData: this.selectedApprValue,
      };
    },
    setTarget(target) {
      // let index = 0;
      // let lastIndex = target.length;
      // this.$_.forEach(target, (item) => {
      //   // item.notiClsCd = 'NAPPR';
      //   if (index !== (lastIndex - 1)) {
      //     item.apprTypeNm = '검토자';
      //     item.apprTypeCd = 'APTP1'
      //   } else {
      //     item.apprTypeNm = '최종승인자';
      //     item.apprTypeCd = 'APTP2'
      //   }
      //   index++;
      // });
      this.$_.forEach(target, (item, index) => {
        item.apprOrder = index + 1;
      });

      this.gridApprOptions.data = this.$_.clone(target);
    },
    btnMoveClicked(_result) {
      this.$http.url = selectConfig.manage.apprDelegate.getDelegator.url;
      this.$http.type = 'PUT';
      this.$http.param = this.selectedUserValue;
      this.$http.request(
        _result => {
          if (_result.data && _result.data.length) {
            this.selectedUserValue = _result.data;
            // 기안자ID 백업
            let rqstUserId = '';
            // 결재자 목록
            let target = this.getTarget().data;
            // 기안자 제외 처리
            rqstUserId = target[0].userId;
            target[0].userId = '';
            // 1. 추가된 아이템 중 기존 항목이 있는지 체크
            let userValue = this.$_.clone(this.selectedUserValue);
            // userValue = this.$_.reject(userValue, {
            //   userId: this.$store.getters.token,
            // }); // 본인은 제외처리
            userValue.apprTypeCd = '';

            this.$_.forEach(userValue, (item, index) => {
              item.apprLineNm = this.$comm.getLangSpecInfoLabel('L0000003800'); // '결재'
            });

            // 결재선에 존재하는 아이디 추가시 경고창 표시
            let targetLength = target.length + this.selectedUserValue.length;
            if (target) {
              let filteredDuplicatedArray = this.$comm.removeDuplicatedArrayObject(
                target,
                userValue,
                'userId'
              );

              // 2. 선택된 항목중에서 기존에 선택된 항목을 제외한 항목을 가져와서 기존 항목과 합침
              if (filteredDuplicatedArray.length > 0) {
                target = this.$_.concat(target, filteredDuplicatedArray);
              }
            } else {
              target = userValue;
            }

            if (targetLength !== target.length) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395', // 안내
                message: 'M0000000518', // 결재선에 존재하는 사용자입니다.
                type: 'warning', // success / info / warning / error
              });
            }

            // 기안자ID 복구
            target[0].userId = rqstUserId;
            this.setTarget(this.$_.clone(target));
          }
        },
        _error => {
          this.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /**
     * 선택된 목록에 선택된 정보를 삭제(화면상으로)
     */
    btnDeleteClicked(_result) {
      var data = this.getTarget();
      var target = data.data;
      var targetSelect = data.selectData;

      this.$_.forEach(targetSelect, item => {
        target = this.$_.clone(this.$_.reject(target, item));
      });
      this.setTarget(this.$_.clone(target));
    },
    /**
     * 선택된 목록에서 선택된 정보를 위로 이동
     */
    btnUpClicked() {
      var data = this.getTarget();
      var target = data.data;
      var targetSelect = data.selectData;
      var moveIndexes = [];
      // 결재 중 상위 결재자 변경 시 상위 결재선은 움직이지 않도록 변경
      let firstIndex = 1;
      if (this.popupParam.isApprInProgress) {
        this.$_.forEach(this.popupParam.apprLines, item => {
          if (item.apprStepCd === 'APSPA') {
            firstIndex++;
          }
        });
      }
      this.$_.forEach(targetSelect, item => {
        let index = this.$_.findIndex(target, { userId: item.userId });
        let tempTargetRow = target[index];
        if (index !== firstIndex) {
          // 제일 상단에 있지 않으며 이동된 인덱스의 값들이 현재 넣어진 moveIndexes에 존재하지 않는 경우에만 target에 넣는다.
          if (this.$_.findIndex(moveIndexes, { mIndex: index - 1 }) === -1) {
            target.splice(index, 1);
            target.splice(index - 1, 0, tempTargetRow);
          }
        }

        moveIndexes.push({ index: index, mIndex: index === 0 ? 0 : index - 1 });
      });

      this.setTarget(this.$_.clone(target));
      setTimeout(() => {
        this.$refs.apprDataTable.toggleSelection(targetSelect);
      }, 100);
    },
    /**
     * 선택된 목록에서 선택된 정보를 아래로로 이동
     */
    btnDownClicked() {
      var data = this.getTarget();
      var target = data.data;
      var targetSelect = data.selectData;
      var indexes = [];
      var moveIndexes = [];

      this.$_.forEachRight(targetSelect, item => {
        let index = this.$_.findIndex(target, { userId: item.userId });
        let tempTargetRow = target[index];

        if (index !== target.length - 1) {
          // 제일 하단에 있지 않으며 이동된 인덱스의 값들이 현재 넣어진 moveIndexes에 존재하지 않는 경우에만 target에 넣는다.
          if (this.$_.findIndex(moveIndexes, { mIndex: index + 1 }) === -1) {
            target.splice(index, 1);
            target.splice(index + 1, 0, tempTargetRow);
          }
        }
        moveIndexes.push({
          index: index,
          mIndex: index === target.length - 1 ? target.length - 1 : index + 1,
        });
      });

      this.setTarget(this.$_.clone(target));
      setTimeout(() => {
        this.$refs.apprDataTable.toggleSelection(targetSelect);
      }, 100);
    },
    canSelectRow(row, index) {
      if (this.popupParam.isApprInProgress) {
        let firstIndex = 1;
        this.$_.forEach(this.popupParam.apprLines, item => {
          if (item.apprStepCd === 'APSPA') {
            firstIndex++;
          }
        });
        return index >= firstIndex;
      } else {
        return index > 0;
      }
    },
    // 적용
    applyApprList() {
      let apprLineList = [];
      let index = 0;
      let userSameYn = 'N';
      // this.gridApprOptions.data.splice(0, 1);

      this.$_.forEach(this.gridApprOptions.data, (item, index) => {
        let apprTypeCd = '';
        if (index === 0) {
          apprTypeCd = 'APTP0';
        } else {
          apprTypeCd = 'APTPA';
        }
        let userMap = {
          userId: item.userId,
          userNm: item.userNm,
          deptCd: item.deptCd,
          deptNm: item.deptNm,
          delegatorId: item.delegatorId,
          delegatorNm: item.delegatorNm,
          // 결재자 유형이 없어지고 '결재'가 디폴트로 설정
          apprTypeCd: apprTypeCd,
        };
        apprLineList.push(userMap);

        if (index !== 0 && this.apprRqstUserId === item.userId) {
          userSameYn = 'Y';
        }
      });

      if (userSameYn === 'Y') {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'L0000005225', // 기안자와 결재자가 동일하면 자동승인처리 됩니다.
          type: 'info', // success / info / warning / error
        });
      }

      // 진행중 결재자 변경
      if (this.popupParam.isApprInProgress) {
        let cloneData = this.$_.clone(this.gridApprOptions.data);
        let flag = true;
        for (let i = this.popupParam.apprLines.length - 1; i >= 0; i--) {
          // ||
          //   this.popupParam.apprLines[i].apprUserId ===
          //     this.$store.getters.token

          if (this.popupParam.apprLines[i].apprStepCd === 'APSPA') {
            if (flag) {
              flag = false;
              cloneData.splice(i + 1, 1);
            }
            let removeIndex = this.$_.findIndex(cloneData, {
              lineSeqNo: this.popupParam.apprLines[i].lineSeqNo,
            });
            if (removeIndex >= 0) {
              cloneData.splice(removeIndex, 1);
            }
          }
        }
        this.$http.url = this.$format(
          transactionConfig.manage.apprLine.change.url,
          this.popupParam.apprRqstNo
        );

        this.$http.type = 'PUT';
        this.$http.param = cloneData;
        this.$http.request(
          _result => {
            this.$emit('closePopup', { apprLineList: apprLineList });
          },
          _error => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      } else {
        this.$emit('closePopup', { apprLineList: apprLineList });
      }
    },
    /** end button 관련 이벤트 **/
  },
};
</script>
