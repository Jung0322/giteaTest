<!--
  목적 : 경영 > 게시판 > 게시판 등록/수정
  작성자 : ksw
  Detail : 게시판 등록/수정
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <el-tabs type="border-card" v-model="tabIndex">
      <el-tab-pane
        v-for="(dept, i) in this.$store.getters.deptAuthGrp.deptAccessYn === 'Y'
          ? lawmakingCheck.lawMakingCheckDepts
          : this.$_.filter(lawmakingCheck.lawMakingCheckDepts, {
              checkDeptCd: this.$store.getters.deptCd,
            })"
        :key="i"
        stretch
        :name="i.toString()"
      >
        <span slot="label">
          <i class="el-icon-date"></i>
          {{ dept.checkDeptNm }}
        </span>
        <keep-alive>
          <b-row>
            <b-col sm="12">
              <b-col sm="12" class="px-0">
                <div slot="buttonGroup" class="float-right mb-1">
                  <!-- 검토자 지정완료 -->
                  <y-btn
                    v-if="!disableObject.disabled2 && dept.finishYn !== 'Y'"
                    title="L0000004654"
                    color="black"
                    @btnClicked="
                      beforeConfirmUser(
                        matchingDeptIndex ? matchingDeptIndex : i
                      )
                    "
                  />
                  <!-- 저장 -->
                  <y-btn
                    v-if="!disableObject.disabled2 && dept.finishYn !== 'Y'"
                    title="L0000002474"
                    color="orange"
                    @btnClicked="
                      beforeSaveUser(matchingDeptIndex ? matchingDeptIndex : i)
                    "
                  />
                  <!-- 추가 -->
                  <y-btn
                    v-if="!disableObject.disabled2 && dept.finishYn !== 'Y'"
                    title="L0000002892"
                    color="orange"
                    @btnClicked="
                      searchUser(matchingDeptIndex ? matchingDeptIndex : i)
                    "
                  />
                  <!-- 삭제 -->
                  <y-btn
                    v-if="!disableObject.disabled2 && dept.finishYn !== 'Y'"
                    title="L0000001495"
                    color="red"
                    @btnClicked="
                      btnDelete(matchingDeptIndex ? matchingDeptIndex : i)
                    "
                  />
                </div>
                <!-- 검토자 목록 -->
                <y-data-table
                  label="L0000004655"
                  ref="dataTable"
                  :height="gridOptions.height"
                  :headers="gridOptions.header"
                  :items="dept.lawMakingCheckers"
                  v-model="dept.selectedValue"
                >
                  <el-table-column
                    v-if="!disableObject.disabled2 && dept.finishYn !== 'Y'"
                    type="selection"
                    slot="selection"
                    align="center"
                    width="55"
                    key="1"
                  ></el-table-column>
                  <!-- 의견 -->
                  <el-table-column
                    v-if="disableObject.disabled2"
                    slot="tag"
                    label="의견"
                    align="center"
                    width="600px"
                    min-width="600px"
                    key="2"
                  >
                    <template slot-scope="scope">
                      <y-textarea
                        v-if="plantYn"
                        :showMaxLength="false"
                        :disabled="
                          disableObject.disabled3 ||
                          scope['row']['finishYn'] === 'Y'
                        "
                        :maxlength="500"
                        ui="bootstrap"
                        name="opinion"
                        v-model="scope['row']['opinion']"
                      ></y-textarea>
                      <y-textarea
                        v-else
                        :editable="
                          scope['row']['checkUserId'] === $store.getters.token
                        "
                        :disabled="
                          disableObject.disabled3 ||
                          scope['row']['finishYn'] === 'Y'
                        "
                        :showMaxLength="false"
                        :maxlength="500"
                        ui="bootstrap"
                        name="opinion"
                        v-model="scope['row']['opinion']"
                      ></y-textarea>
                    </template>
                  </el-table-column>
                  <el-table-column
                    v-if="disableObject.disabled2"
                    slot="tag"
                    align="center"
                    width="120"
                    key="3"
                  >
                    <template slot-scope="scope">
                      <!-- 저장 -->
                      <y-btn
                        v-if="
                          scope['row']['checkUserId'] === $store.getters.token
                        "
                        :disabled="
                          disableObject.disabled3 ||
                          scope['row']['finishYn'] === 'Y'
                        "
                        title="L0000002474"
                        color="orange"
                        @btnClicked="btnSaveOpinion(scope['row'])"
                      />
                      <!-- 저장 -->
                      <y-btn
                        v-else-if="
                          scope['row']['checkUserId'] ===
                            $store.getters.token || plantYn
                        "
                        :disabled="
                          disableObject.disabled3 ||
                          plantAccessdisabled ||
                          scope['row']['finishYn'] === 'Y'
                        "
                        title="L0000002474"
                        color="orange"
                        @btnClicked="btnSaveOpinion(scope['row'])"
                      />
                      <!-- 완료 -->
                      <y-btn
                        v-if="
                          scope['row']['checkUserId'] === $store.getters.token
                        "
                        :disabled="
                          disableObject.disabled3 ||
                          scope['row']['finishYn'] === 'Y'
                        "
                        title="L0000002039"
                        color="black"
                        @btnClicked="btnCompleteOpinion(scope['row'])"
                      />
                      <!-- 완료 -->
                      <y-btn
                        v-else-if="
                          scope['row']['checkUserId'] ===
                            $store.getters.token || plantYn
                        "
                        :disabled="
                          disableObject.disabled3 ||
                          plantAccessdisabled ||
                          scope['row']['finishYn'] === 'Y'
                        "
                        title="L0000002039"
                        color="black"
                        @btnClicked="btnCompleteOpinion(scope['row'])"
                      />
                    </template>
                  </el-table-column>
                </y-data-table>
              </b-col>
            </b-col>
          </b-row>
        </keep-alive>
      </el-tab-pane>
    </el-tabs>

    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import transactionConfig from '@/js/transactionConfig';
export default {
  name: 'select-lawmaking-checker',
  props: {
    lawmakingCheck: {
      type: Object,
      default: function () {
        return {
          lmcSeqNo: 0,
          lawMakingCheckDepts: [],
        };
      },
    },
    disableObject: {
      type: Object,
      default: function () {
        return {
          disabled2: false,
          disabled3: false,
        };
      },
    },
  },
  data: () => ({
    gridOptions: {
      header: [],
      height: 350,
    },
    popupOptions: {
      target: null,
      title: '',
      visible: false,
      width: '70%',
      top: '10px',
      param: {},
      closeCallback: null,
    },
    tabIndex: 0,
    curIndex: 0,
    editable: true,
    confirmUserUrl: '',
    saveUserUrl: '',
    confirmOpinionUrl: '',
    saveOpinionUrl: '',
    plantYn: false,
    plantAccessdisabled: true,
    matchingDeptIndex: null,
  }),
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
  },
  mounted() {
    this.init();
  },
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      this.editable = this.$route.meta.editable;
      if (this.$store.getters.deptAuthGrp.deptAccessYn !== 'Y') {
        this.matchingDeptIndex = this.$_.findIndex(
          this.lawmakingCheck.lawMakingCheckDepts,
          {
            checkDeptCd: this.$store.getters.deptCd,
          }
        );
      }

      this.confirmUserUrl =
        transactionConfig.mgt.mgtLaw.lawMakingCheck.confirmUser.url;
      this.saveUserUrl = transactionConfig.mgt.mgtLaw.lawMakingCheck.user.url;
      this.confirmOpinionUrl =
        transactionConfig.mgt.mgtLaw.lawMakingCheck.confirmOpinion.url;
      this.saveOpinionUrl =
        transactionConfig.mgt.mgtLaw.lawMakingCheck.opinion.url;

      this.gridOptions.header = [
        {
          text: this.$comm.getLangSpecInfoLabel('L0000004656'),
          name: 'checkDeptNm',
          width: '180px',
          align: 'center',
        }, // [사업장] 부서
        {
          text: this.$comm.getLangSpecInfoLabel('L0000004249'),
          name: 'checkUserNm',
          width: '120px',
          align: 'center',
        }, // 검토자
      ];
      if (this.disableObject.disabled2) {
        this.gridOptions.header.push({
          text: this.$comm.getLangSpecInfoLabel('L0000002043'),
          name: 'checkDt',
          width: '120px',
          align: 'center',
        }); // 완료일
      }
      if (
        this.$store.getters.deptAuthGrp &&
        this.$store.getters.deptAuthGrp.plantAccessYn === 'Y'
      ) {
        this.plantYn = true;
        this.plantAccessdisabled = false;
      }
    },
    searchUser(index) {
      this.curIndex = this.$_.parseInt(index);
      this.popupOptions.target = () =>
        import(`${'@/pages/manage/user/userSearch.vue'}`);
      this.popupOptions.param = {
        multiple: true,
        plantCd: this.lawmakingCheck.lawMakingCheckDepts[this.curIndex].plantCd,
        deptCd:
          this.lawmakingCheck.lawMakingCheckDepts[this.curIndex].checkDeptCd,
        plantDisabled: true,
        deptDisabled: true,
        deptSubYn: 'N', // 하위부서 포함 안함
      };
      this.popupOptions.title = 'L0000001459'; // 사용자검색
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopupSearchUser;
    },
    // 사용자 검색 팝업 닫기
    closePopupSearchUser(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      if (data.users) {
        if (
          !this.lawmakingCheck.lawMakingCheckDepts[this.curIndex]
            .lawMakingCheckers
        ) {
          this.lawmakingCheck.lawMakingCheckDepts[
            this.curIndex
          ].lawMakingCheckers = [];
        }
        this.$_.forEach(data.users, (user) => {
          if (
            this.$_.findIndex(
              this.lawmakingCheck.lawMakingCheckDepts[this.curIndex]
                .lawMakingCheckers,
              {
                checkUserId: user.userId,
              }
            ) === -1
          ) {
            this.lawmakingCheck.lawMakingCheckDepts[
              this.curIndex
            ].lawMakingCheckers.splice(0, 0, {
              checkDeptCd: user.deptCd,
              checkDeptNm: '[' + user.plantNm + ']' + user.deptNm,
              checkUserId: user.userId,
              checkUserNm: user.userNm,
              checkDt: '',
              opinion: '',
              finishYn: 'N',
            });
          }
        });
      }
    },
    btnDelete(index) {
      if (
        this.lawmakingCheck.lawMakingCheckDepts[index].selectedValue.length ===
        0
      ) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000000057', // 삭제할 항목을 선택해주세요.
          type: 'warning',
        });
      } else {
        if (
          !this.lawmakingCheck.lawMakingCheckDepts[this.curIndex]
            .lawMakingCheckers
        ) {
          this.lawmakingCheck.lawMakingCheckDepts[
            this.curIndex
          ].lawMakingCheckers = [];
        }
        this.$_.forEach(
          this.lawmakingCheck.lawMakingCheckDepts[index].selectedValue,
          (item) => {
            this.lawmakingCheck.lawMakingCheckDepts[
              index
            ].lawMakingCheckers.splice(
              this.$_.findIndex(
                this.lawmakingCheck.lawMakingCheckDepts[index]
                  .lawMakingCheckers,
                { checkUserId: item.checkUserId }
              ),
              1
            );
          }
        );
      }
    },
    beforeConfirmUser(index) {
      let submitData =
        this.lawmakingCheck.lawMakingCheckDepts[index].lawMakingCheckers;
      if (!submitData || submitData.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000000580', // 검토자를 한 명 이상 선택하세요.
          type: 'warning',
        });
      } else {
        window.getApp.$emit('CONFIRM', {
          title: 'L0000003321', // 확인
          message: 'M0000000838', // 완료하시겠습니까?
          type: 'info',
          confirmCallback: () => {
            this.$http.url = this.confirmUserUrl;
            this.$http.type = 'PUT';
            this.$http.param = this.lawmakingCheck.lawMakingCheckDepts[index];
            this.$http.request(
              (_result) => {
                window.getApp.$emit('ALERT', {
                  title: 'L0000003395', // 안내
                  message: 'M0000001112', // 검토자 지정 완료되었습니다.
                  type: 'success', // success / info / warning / error
                });
                this.$emit('refresh');
              },
              (_error) => {
                window.getApp.$emit('APP_REQUEST_ERROR', _error);
              }
            );
          },
          cancelCallback: () => {},
        });
      }
    },
    beforeSaveUser(index) {
      let submitData =
        this.lawmakingCheck.lawMakingCheckDepts[index].lawMakingCheckers;
      if (!submitData || submitData.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000001113', // 검토자를 한 명 이상 선택하세요.
          type: 'warning',
        });
      } else {
        window.getApp.$emit('CONFIRM', {
          title: 'L0000003321', // 확인
          message: 'M0000000011', // 저장하시겠습니까?
          type: 'info',
          confirmCallback: () => {
            this.$http.url = this.saveUserUrl;
            this.$http.type = 'POST';
            this.$http.param = this.lawmakingCheck.lawMakingCheckDepts[index];
            this.$http.request(
              (_result) => {
                window.getApp.$emit('ALERT', {
                  title: 'L0000003395', // 안내
                  message: 'M0000000006', // 저장되었습니다.
                  type: 'success', // success / info / warning / error
                });
              },
              (_error) => {
                window.getApp.$emit('APP_REQUEST_ERROR', _error);
              }
            );
          },
          cancelCallback: () => {},
        });
      }
    },
    btnSaveOpinion(data) {
      if (!data.opinion) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000000582', // 의견을 기입바랍니다.
          type: 'warning',
        });
      } else {
        window.getApp.$emit('CONFIRM', {
          title: 'L0000003321', // 확인
          message: 'M0000000011', // 저장하시겠습니까?
          type: 'info',
          confirmCallback: () => {
            data.lmcSeqNo = this.lawmakingCheck.lmcSeqNo;
            this.$http.url = this.saveOpinionUrl;
            this.$http.type = 'PUT';
            this.$http.param = data;
            this.$http.request(
              (_result) => {
                window.getApp.$emit('ALERT', {
                  title: 'L0000003395', // 안내
                  message: 'M0000000006', // 저장되었습니다.
                  type: 'success', // success / info / warning / error
                });
              },
              (_error) => {
                window.getApp.$emit('APP_REQUEST_ERROR', _error);
              }
            );
          },
          cancelCallback: () => {},
        });
      }
    },
    btnCompleteOpinion(data) {
      if (!data.opinion) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000000582', // 의견을 기입바랍니다.
          type: 'warning',
        });
      } else {
        window.getApp.$emit('CONFIRM', {
          title: 'L0000003321', // 확인
          message: 'M0000000838', // 완료하시겠습니까?
          type: 'info',
          confirmCallback: () => {
            data.lmcSeqNo = this.lawmakingCheck.lmcSeqNo;
            this.$http.url = this.confirmOpinionUrl;
            this.$http.type = 'PUT';
            this.$http.param = data;
            this.$http.request(
              (_result) => {
                window.getApp.$emit('ALERT', {
                  title: 'L0000003395', // 안내
                  message: 'M0000000078', // 완료되었습니다.
                  type: 'success', // success / info / warning / error
                });
                this.$emit('refresh');
              },
              (_error) => {
                window.getApp.$emit('APP_REQUEST_ERROR', _error);
              }
            );
          },
          cancelCallback: () => {},
        });
      }
    },
  },
};
</script>
