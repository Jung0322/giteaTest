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
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 메뉴 관리 -->
            <y-label
              label="L0000001005"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 저장 -->
              <y-btn
                v-if="!updateMode && editable"
                :action-url="insertUrl"
                :param="menu"
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
                v-if="updateMode && editable"
                :action-url="editUrl"
                :param="menu"
                :is-submit="isEdit"
                title="L0000002474"
                color="orange"
                action-type="PUT"
                beforeSubmit="beforeEdit"
                @beforeEdit="beforeEdit"
                @btnClicked="btnEditClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 닫기 -->
              <y-btn title="L0000000881" @btnClicked="btnClosePopup" />
            </div>
          </b-col>
        </b-row>

        <b-card>
          <b-row>
            <b-col sm="12">
              <b-row>
                <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
                  <b-row>
                    <b-col sm="4">
                      <!-- 메뉴 ID -->
                      <y-label label="L0000001004"></y-label>
                    </b-col>
                    <b-col sm="8">
                      <y-label
                        :label="menu.menuId"
                        :fieldable="true"
                        :editable="editable"
                      />
                    </b-col>
                  </b-row>
                </b-col>
                <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
                  <!-- 메뉴명(KOR) -->
                  <y-text
                    :width="8"
                    :editable="editable"
                    :required="true"
                    ui="bootstrap"
                    :maxlength="30"
                    label="L0000004511"
                    name="menuNm"
                    v-model="menu.menuNm"
                    v-validate="'required'"
                    :state="validateState('menuNm')"
                  ></y-text>
                </b-col>
                <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
                  <!-- 메뉴명(ENG) -->
                  <y-text
                    :width="8"
                    :editable="editable"
                    ui="bootstrap"
                    :maxlength="100"
                    label="L0000004513"
                    name="menuNm"
                    v-model="menu.menuNmEn"
                  ></y-text>
                </b-col>
                <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
                  <!-- 메뉴명(JPN) -->
                  <y-text
                    :width="8"
                    :editable="editable"
                    ui="bootstrap"
                    :maxlength="30"
                    label="L0000004514"
                    name="menuNm"
                    v-model="menu.menuNmJa"
                  ></y-text>
                </b-col>
                <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
                  <!-- 메뉴명(CHS) -->
                  <y-text
                    :width="8"
                    :editable="editable"
                    ui="bootstrap"
                    :maxlength="30"
                    label="L0000004515"
                    name="menuNm"
                    v-model="menu.menuNmZhCn"
                  ></y-text>
                </b-col>
                <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
                  <!-- 메뉴명(CHT) -->
                  <y-text
                    :width="8"
                    :editable="editable"
                    ui="bootstrap"
                    :maxlength="30"
                    label="L0000004516"
                    name="menuNm"
                    v-model="menu.menuNmZhTw"
                  ></y-text>
                </b-col>
                <b-col sm="12">
                  <el-tag size="medium" type="info">
                    <i class="el-icon-info"></i> KOR = 한국어, ENG = 영어, JPN =
                    일본어, CHS = 중국어(간체), CHT = 중국어(번체)입니다.
                  </el-tag>
                </b-col>
                <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
                  <b-row>
                    <b-col
                      v-if="isGreatMenu"
                      sm="8"
                      md="8"
                      lg="8"
                      xl="8"
                      class="col-xxl-8"
                    >
                      <!-- 상위메뉴/업무그룹/메뉴레벨 -->
                      <y-text
                        label="L0000001535"
                        ui="bootstrap"
                        placeholder="선택하세요."
                        :required="true"
                        v-model="setUpMenu"
                        :width="8"
                        :treeCheck="!editable"
                        :editable="false"
                        v-validate="'required'"
                        :state="validateState('setUpMenu')"
                      >
                        <el-popover
                          slot="customAppendIcon"
                          placement="right"
                          width="400"
                          trigger="manual"
                          v-model="menu.popoverVisible"
                        >
                          <y-tree
                            node-key="menuId"
                            label="menuNm"
                            :editable="false"
                            :treeData="menuTree"
                            @nodeClick="nodeClick"
                          />
                          <el-button
                            icon="el-icon-search"
                            circle
                            slot="reference"
                            size="mini"
                            @click="menu.popoverVisible = !menu.popoverVisible"
                          />
                          <div style="text-align: right; margin: 0">
                            <el-button
                              size="mini"
                              type="text"
                              @click="menu.popoverVisible = false"
                              >닫기</el-button
                            >
                          </div>
                        </el-popover>
                        <el-button
                          v-if="menu.upMenuId"
                          icon="el-icon-close"
                          circle
                          slot="customAppendIcon"
                          size="mini"
                          @click.stop="removeParentNode"
                        />
                      </y-text>
                    </b-col>
                    <b-col v-else sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
                      <!-- 업무그룹 -->
                      <y-select
                        :width="8"
                        :editable="editable"
                        :comboItems="comboTaskItems"
                        :required="true"
                        itemText="codeNm"
                        itemValue="code"
                        ui="bootstrap"
                        label="L0000004517"
                        name="taskGrpCd"
                        v-model="menu.taskGrpCd"
                        v-validate="'required'"
                        :state="validateState('taskGrpCd')"
                      />
                    </b-col>
                    <b-col
                      v-if="menu.menuLvl !== '1'"
                      sm="4"
                      md="4"
                      lg="4"
                      xl="4"
                      class="col-xxl-4"
                    >
                      <y-btn
                        :title="btnGreateMenuTitle"
                        color="blue"
                        @btnClicked="btnSetGreatMenu"
                      />
                      <el-popover
                        placement="top-start"
                        title="Title"
                        width="300"
                        trigger="hover"
                      >
                        <b-col>
                          <b-row>
                            <!-- 대메뉴 생성 버튼 누를 시 -->
                            <y-label label="L0000004518" :editable="editable" />
                          </b-row>
                          <b-row>
                            <!-- - 메뉴레벨 : 1 -->
                            <y-label label="L0000004519" :editable="editable" />
                          </b-row>
                          <b-row>
                            <!-- - 상위메뉴 : X -->
                            <y-label label="L0000004520" :editable="editable" />
                          </b-row>
                          <b-row>
                            <!-- - 업무구분 : 지정(공통코드에 등록된 값) -->
                            <y-label label="L0000004521" :editable="editable" />
                          </b-row>
                          <b-row>
                            <!-- 대메뉴 생성취소 버튼 누를 시 -->
                            <y-label label="L0000004522" :editable="editable" />
                          </b-row>
                          <b-row>
                            <!-- - 상위메뉴에 따른 메뉴레벨, 업무그룹을 지정 -->
                            <y-label label="L0000004523" :editable="editable" />
                          </b-row>
                        </b-col>
                        <el-button
                          id="menuQ"
                          slot="reference"
                          circle
                          size="mini"
                        >
                          <i class="el-icon-question" style="font-size: 27px" />
                        </el-button>
                      </el-popover>
                    </b-col>
                  </b-row>
                </b-col>
                <b-col
                  v-if="menu.menuLvl === '1'"
                  sm="6"
                  md="6"
                  lg="6"
                  xl="6"
                  class="col-xxl-3"
                >
                  <b-row>
                    <b-col sm="8" md="8" lg="8" xl="8" class="col-xxl-8">
                      <!-- 아이콘 -->
                      <y-text
                        :width="6"
                        :editable="editable"
                        ui="bootstrap"
                        label="L0000001829"
                        name="icon"
                        v-model="menu.icon"
                      />
                    </b-col>
                    <b-col
                      v-if="menu.icon"
                      sm="4"
                      md="4"
                      lg="4"
                      xl="4"
                      class="col-xxl-4"
                    >
                      <f-icon :icon="menu.icon" size="lg" class="mt-1 ml-1" />
                    </b-col>
                  </b-row>
                </b-col>
                <b-col
                  v-if="menu.menuLvl === '1'"
                  sm="6"
                  md="6"
                  lg="6"
                  xl="6"
                  class="col-xxl-3"
                >
                  <b-row>
                    <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
                      <!-- 아이콘색상 -->
                      <y-label label="L0000001830"></y-label>
                    </b-col>
                    <b-col sm="8" md="8" lg="8" xl="8" class="col-xxl-8">
                      <el-color-picker
                        v-model="menu.color"
                        size="medium"
                      ></el-color-picker>
                    </b-col>
                  </b-row>
                </b-col>
                <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
                  <!-- url 경로 -->
                  <y-text
                    :width="10"
                    :editable="editable && boardYn == 'N'"
                    :required="true"
                    ui="bootstrap"
                    :maxlength="100"
                    label="L0000000187"
                    name="frontEndUrl"
                    v-model="menu.frontEndUrl"
                    v-validate="'required'"
                    :state="validateState('frontEndUrl')"
                  ></y-text>
                </b-col>
                <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
                  <!-- 정렬순서 -->
                  <y-number
                    :width="8"
                    :editable="editable"
                    :required="true"
                    ui="bootstrap"
                    label="L0000002601"
                    :maxlength="5"
                    :isPositive="true"
                    name="sortOrder"
                    v-model="menu.sortOrder"
                    v-validate="'required'"
                    :state="validateState('sortOrder')"
                  ></y-number>
                </b-col>
                <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
                  <!-- bootstrap -->
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
                    v-model="menu.useYn"
                  ></y-switch>
                </b-col>
                <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
                  <!-- 게시판 설정 여부 -->
                  <y-switch
                    :width="8"
                    :editable="editable"
                    true-value="Y"
                    false-value="N"
                    ui="bootstrap"
                    label="L0000000399"
                    name="boardYn"
                    selectText="L0000001440"
                    unselectText="L0000001063"
                    v-model="boardYn"
                  ></y-switch>
                </b-col>

                <b-col>
                  <!-- 게시판 선택 -->
                  <y-select
                    v-if="boardYn == 'Y'"
                    :width="8"
                    :editable="editable"
                    :comboItems="boardMasters"
                    itemText="bbsNm"
                    itemValue="bbsNo"
                    ui="bootstrap"
                    label="L0000004524"
                    name="taskClassNm"
                    v-model="menu.bbsNo"
                  ></y-select>
                </b-col>
                <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
                  <!-- 메인 메뉴 여부 L0000005915 - 해당/L0000001065 - 미해당 -->
                  <y-switch
                    :width="8"
                    :editable="editable"
                    true-value="Y"
                    false-value="N"
                    ui="bootstrap"
                    label="L0000005915"
                    name="mainMenuYn"
                    selectText="L0000003213"
                    unselectText="L0000001065"
                    v-model="menu.mainMenuYn"
                  ></y-switch>
                </b-col>
                <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
                  <!-- 모바일 메뉴 여부 L0000005916 - 해당/L0000001065 - 미해당 -->
                  <y-switch
                    :width="8"
                    :editable="editable"
                    true-value="Y"
                    false-value="N"
                    ui="bootstrap"
                    label="L0000005916"
                    name="mobileMenuYn"
                    selectText="L0000003213"
                    unselectText="L0000001065"
                    v-model="menu.mobileMenuYn"
                  ></y-switch>
                </b-col>
                <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
                  <el-divider content-position="left">매뉴얼 첨부</el-divider>
                  <component
                    :is="component"
                    v-if="component"
                    sm="12"
                    :submitObject="submitObject"
                    :attachFileGrps="attachFileGrps"
                    :saveAttachFiles="saveAttachFiles"
                    @changeUploadFiles="changeUploadFiles"
                  />
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
import YTree from '@/components/YTree';
import arrayToTree from 'array-to-tree';
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
import YTreeDataTable from '@/components/YTreeDataTable';
export default {
  /** attributes: name, components, props, data **/
  name: 'menu-manage', // 반드시 입력하세요(안 하면 warning 발생). 네이밍 룰은 현재 vue component의 파일명의 단어를 "-"로 구분(예:exam-data)하여 입력하시면 됩니다. 입력후 이 주석은 지워주세요.
  components: {
    'y-tree': YTree,
    YTreeDataTable,
  },
  props: {
    popupParam: {
      type: Object,
      default: {
        menu: null,
      },
    },
  },
  // TODO: 화살표 함수(=>)는 data에 사용하지 말 것
  //    data: () => { return { a: this.myProp }}) 화살표 함수가 부모 컨텍스트를 바인딩하기 때문에 this는 예상과 달리 Vue 인스턴스가 아니기 때문에 this.myProp는 undefined로 나옵니다.
  //    참고url: https://kr.vuejs.org/v2/api/index.html#data
  data() {
    return {
      menuTree: [],
      menu: {
        menuId: '',
        // 다국어 추가
        menuNm: '',
        menuNmEn: '',
        menuNmJa: '',
        menuNmZhTw: '',
        menuNmZhCn: '',

        taskGrpCd: null,
        upMenuId: '',
        upMenuNm: '',
        menuLvl: null,
        frontEndUrl: '',
        color: '',
        icon: '',
        sortOrder: null,
        useYn: 'Y',
        popoverVisible: false,
        changeUpMenu: false,
        createUserId: '',
        updateUserId: '',
        expendAllYn: 'Y',
        bbsNo: 0,
        mainMenuYn: 'Y', // 메인 메뉴 여부
        mobileMenuYn: 'N', // 모바일 메뉴 여부
      },
      btnGreateMenuTitle: '대메뉴 생성',
      isGreatMenu: true,
      setUpMenu: '',
      collectMenuLevel: 0,
      collectTaskGrpCd: '',
      checkChild: {
        upMenuId: '',
        hasChild: false,
      },
      attachFileGrp: {
        taskClassNm: '',
        taskKey: '',
        createUserId: '',
        showUploadBtn: true,
        editable: true,
        drag: true,
        label: '',
      },
      attachFileGrps: [
        {
          taskClassNm: 'COM_MENU',
          taskKey: '',
          createUserId: '',
          showUploadBtn: true,
          editable: true,
          drag: true,
          label: '',
          taskFlag: '',
        },
      ],
      submitObject: {
        submitCheck: false,
      },
      comboTaskItems: [],
      isInsert: false,
      insertUrl: '',
      isEdit: false,
      editUrl: '',
      editable: false,
      updateMode: false,
      upMenuLvl: null, // 버튼을 submit 할 것인지 판단하는 변수로써 버튼의 개수만큼 필요합니다.
      saveAttachFiles: [],
      boardMasters: [],
      boardYn: 'N',
    };
  },
  watch: {
    'menu.menuLvl'() {
      // 메뉴 레벨은 빈칸일 수 없음(default 1)
      if (!this.menu.menuLvl) this.menu.menuLvl = 1;
    },
    'menu.bbsNo'(newVal, oldVal) {
      if (newVal !== 0) {
        this.menu.frontEndUrl = `/board/bbs?id=${newVal}`;
      } else {
        this.menu.frontEndUrl = null;
      }
    },
    'menu.mobileMenuYn'(newVal, oldVal) {
      if (newVal === 'Y') {
        this.menu.mainMenuYn = 'N';
      }
    },
    'menu.mainMenuYn'(newVal, oldVal) {
      if (newVal === 'Y') {
        this.menu.mobileMenuYn = 'N';
      }
    },
    boardYn(newVal, oldVal) {
      if (newVal !== 'Y') this.menu.frontEndUrl = null;
    },
  },
  /** Vue lifecycle: created, mounted, destroyed, etc **/
  beforeCreate() {},
  created() {},
  beforeMount() {
    // TODO : data를 초기화 시켜줌(검색 조건 유지가 필요할 때는 삭제할 것)
    // 이유 : vue.js는 SPA기반으로 동작하기 때문에 페이지를 이동하더라도 기존 입력된 정보가 그대로 남아 있는 문제가 있음
    Object.assign(this.$data, this.$options.data());
    this.init();
    this.component = () => import('@/pages/common/attachFile/multiFileUpload');
  },
  mounted() {},
  beforeDestory() {},
  /** methods **/
  methods: {
    init() {
      this.editable = this.$route.meta.editable;

      // 메뉴 등록 url
      this.insertUrl = transactionConfig.menu.insert.url;
      // 검색 url
      this.searchUrl = selectConfig.menuTreeBases.list.url;
      // 수정 url
      this.editUrl = transactionConfig.menu.edit.url;

      this.$comm.getComboItems('TASK_GRP', false).then((_result) => {
        this.comboTaskItems = _result;
      });

      // 게시판 마스터 조회
      this.getBoardMasters();
      this.getMenuTreeBases();
      if (this.popupParam.menu !== null) {
        this.attachFileGrps[0].taskKey = this.popupParam.menu.menuId;
        this.getDetail();
      }
    },
    getDetail() {
      var row = this.popupParam.menu;
      var key = '';
      for (key in this.menu) {
        if (row.hasOwnProperty(key)) {
          this.menu[key] = row[key];
        }
      }
      let parentMenu = this.$_.filter(this.$store.getters.allMenu, {
        menuId: row.upMenuId,
      });

      if (parentMenu.length > 0) {
        this.menu.upMenuId = parentMenu[0].menuId;
        this.menu.upMenuNm = parentMenu[0].menuNm;
      } else {
        this.menu.upMenuId = null;
        this.menu.upMenuNm = null;
      }

      this.checkChild = {
        upMenuId: this.$_.clone(this.menu.upMenuId),
        hasChild: row.hasOwnProperty('children'),
      };
      this.setUpMenu =
        (this.menu.upMenuNm ? this.menu.upMenuNm : '') +
        ' / ' +
        this.menu.menuNm +
        ' / ' +
        this.menu.menuLvl;
      this.collectMenuLevel = row.menuLvl;
      this.collectTaskGrpCd = row.taskGrpCd;
      this.updateMode = true;
      if (row.bbsNo !== 0) this.boardYn = 'Y';
      else this.boardYn = 'N';
    },
    /**
     * 메뉴 tree 기초 정보 조회
     */
    getMenuTreeBases() {
      this.$http.url = this.searchUrl;
      this.$http.param = null;
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.menuTree = this.convertTree(_result.data);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
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
    // 게시판 마스터 검색
    getBoardMasters() {
      this.$http.url = selectConfig.manage.board.list.url;
      this.$http.type = 'GET';
      this.$http.param = null;
      this.$http.request(
        (_result) => {
          this.boardMasters = this.$_.clone(_result.data);
          this.boardMasters.splice(0, 0, {
            bbsNo: 0,
            bbsNm: '- 선택하세요 -',
          });
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    beforeInsert() {
      this.checkValidation('insert');
    },
    beforeEdit() {
      this.editUrl = transactionConfig.menu.edit.url;
      this.checkValidation('edit');
      this.isEdit = this.isEdit && this.menu.menuId ? true : false;
    },
    /** validation checking(필요없으면 지워주세요) **/
    checkValidation(_type) {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            if (
              _type === 'edit' &&
              this.checkChild.upMenuId !== this.menu.upMenuId &&
              this.checkChild.hasChild
            ) {
              window.getApp.$emit('CONFIRM', {
                title: 'L0000003321', // 확인
                message: 'M0000000543', //  수정하실 메뉴의 하위메뉴도 같이 이동됩니다.\n수정하시겠습니까?
                type: 'info',
                // 확인 callback 함수
                confirmCallback: () => {
                  this.menu.updateUserId = this.$store.getters.token;
                  // 상위메뉴가 바뀐것을 알려주는 값
                  this.menu.changeUpMenu = true;

                  this.isEdit = true;
                },
                cancelCallback: () => {
                  if (_type === 'insert') this.isInsert = false;
                  else this.isEdit = false;
                },
              });
            } else {
              window.getApp.$emit('CONFIRM', {
                title: 'L0000003321', // 확인
                message: 'M0000000011', // 저장하시겠습니까?
                type: 'info',
                // 확인 callback 함수
                confirmCallback: () => {
                  this.menu.createUserId = this.$store.getters.token;
                  this.menu.updateUserId = this.$store.getters.token;
                  if (_type === 'insert') {
                    this.menu.menuId = null;
                    this.isInsert = true;
                  } else this.isEdit = true;
                },
                cancelCallback: () => {
                  if (_type === 'insert') this.isInsert = false;
                  else this.isEdit = false;
                },
              });
            }
            // }
          } else {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395', // 안내
              message: 'M0000000005', // 필수입력값을 입력해주세요.
              type: 'warning',
            });
          }
        })
        .catch(() => {
          if (_type === 'insert') this.isInsert = false;
          else this.isEdit = false;
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
    btnInsertClickedCallback(_result) {
      this.menu.menuId = _result.data;
      this.updateMode = true;

      this.isInsert = false; // 반드시 isSubmit을 false로 초기화 하세요. 그렇지 않으면 버튼을 다시 클릭해도 동작하지 않습니다.

      window.getApp.$emit('APP_REQUEST_SUCCESS', '저장되었습니다.'); //
      this.getMenuTreeBases();
      this.saveAttach();
    },
    btnEditClickedCallback(_result) {
      this.isEdit = false; // 반드시 isSubmit을 false로 초기화 하세요. 그렇지 않으면 버튼을 다시 클릭해도 동작하지 않습니다.
      if (_result.data > 0) {
        window.getApp.$emit('APP_REQUEST_SUCCESS', '저장되었습니다.');
      }
      this.getMenuTreeBases();
      this.saveAttach();
    },
    /* 상위메뉴 지정 취소 시(X) */
    removeParentNode() {
      this.menu.upMenuNm = null;
      this.menu.upMenuId = null;
      this.upMenuLvl = null;
      this.setUpMenu = '';
    },
    /**
     * treenode 클릭
     */
    nodeClick(_node) {
      if (this.menu.menuId === _node.menuId) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000000544', // 자기자신을 상위메뉴로 지정하였습니다.
          type: 'warning',
        });
        return;
      }

      this.menu.upMenuNm = _node.menuNm;
      this.menu.upMenuId = _node.menuId;
      this.menu.taskGrpCd = _node.taskGrpCd;
      // this.menu.frontEndUrl = _node.frontEndUrl;
      this.upMenuLvl = _node.menuLvl;
      this.menu.menuLvl = this.upMenuLvl ? Number(this.upMenuLvl) + 1 : null;
      this.collectMenuLevel = this.upMenuLvl
        ? Number(this.upMenuLvl) + 1
        : null;
      this.collectTaskGrpCd = _node.taskGrpCd;
      this.menu.sortOrder = _node.hasOwnProperty('children')
        ? _node.children.length + 1
        : 1;

      this.setUpMenu =
        this.menu.upMenuNm +
        ' / ' +
        this.menu.taskGrpCd +
        ' / ' +
        this.menu.menuLvl;
      this.menu.popoverVisible = false;
    },
    btnSetGreatMenu() {
      this.isGreatMenu = !this.isGreatMenu;
      if (this.isGreatMenu) {
        this.btnGreateMenuTitle = 'L0000004525'; // 대메뉴생성
        this.menu.menuLvl = null;
        this.comboTaskItems.unshift({
          code: null,
          codeNm: this.$comm.getLangSpecInfoLabel('L0000003394'), // 선택하세요
        });
      } else {
        this.btnGreateMenuTitle = 'L0000004526'; // 대메뉴 생성취소
        this.menu.menuLvl = 1;
        this.menu.upMenuId = null;
        this.comboTaskItems.shift();
      }

      this.setUpMenu = '';
      this.menu.upMenuNm = '';
      this.menu.taskGrpCd = null;
    },
    /**
     * 버튼 에러 처리용 공통함수
     */

    btnClickedErrorCallback(_result) {
      this.isInsert = false; // 반드시 isSubmit을 false로 초기화 하세요. 그렇지 않으면 버튼을 다시 클릭해도 동작하지 않습니다.
      this.isEdit = false;
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    btnClosePopup() {
      // 부모창에 값 전달
      this.$emit('closePopup', { success: true });
    },
    changeUploadFiles(data) {
      var index = this.$_.findIndex(this.attachFileGrps, {
        taskClassNm: data.taskClassNm,
      });
      if (index > -1) {
        data.index = index;
        this.attachFileGrps[index].uploadTempFiles = data;
        let saveIndex = this.$_.findIndex(this.saveAttachFiles, {
          taskClassNm: data.taskClassNm,
        });
        if (saveIndex > -1) {
          this.saveAttachFiles[saveIndex] = this.$_.clone(
            this.attachFileGrps[index]
          );
        } else {
          this.saveAttachFiles.push(this.$_.clone(this.attachFileGrps[index]));
        }
      }
    },
    saveAttach() {
      // task_key 를 셋팅한다.
      this.$_.forEach(this.attachFileGrps, (item) => {
        item.taskKey = this.menu.menuId;
      });
      if (this.saveAttachFiles.length > 0) {
        // 저장할 데이터가 있는 경우
        this.submitObject.submitCheck = !this.submitObject.submitCheck;
      }
    },
  },
};
</script>
<style scoped>
#menuQ {
  vertical-align: bottom;
  padding: 0px;
  border: 0px;
}
</style>
