<!--
  목적 : 시스템 > 결재 > 결재선
  작성자 : ksw
  Detail : 결재선 상세 등록, 수정 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 결재선 상세 s -->
    <b-row class="mt-3" ref="detailBox">
      <b-col sm="12">
        <!-- 결재 마스터 상세 -->
        <y-label
          label="L0000000417"
          icon="user-edit"
          color-class="cutstom-title-color"
        />
        <div slot="buttonGroup" class="float-right mb-1">
          <!-- 저장 -->
          <y-btn
            v-if="appr.apprBizNo > 0 && editable"
            :action-url="editUrl"
            :param="appr"
            :is-submit="isEdit"
            title="L0000002474"
            color="orange"
            action-type="PUT"
            beforeSubmit="beforeUpdate"
            @beforeUpdate="beforeUpdate"
            @btnClicked="btnSaveClickedCallback"
            @btnClickedErrorCallback="btnClickedErrorCallback"
          />
          <!-- 저장 -->
          <y-btn
            v-if="appr.apprBizNo <= 0 && editable"
            :action-url="insertUrl"
            :param="appr"
            :is-submit="isInsert"
            title="L0000002474"
            color="orange"
            action-type="POST"
            beforeSubmit="beforeInsert"
            @beforeInsert="beforeInsert"
            @btnClicked="btnInsertClickedCallback"
            @btnClickedErrorCallback="btnClickedErrorCallback"
          />
          <!-- 닫기 -->
          <y-btn title="L0000000881" @btnClicked="btnClosePopup" />
        </div>
      </b-col>
    </b-row>
    <b-card>
      <b-row>
        <!-- <b-col sm="12" mb="12" lg="12" xl="12" class="col-xxl-12">
                <div class="float-left">
                  <el-popover
                    placement="top-start"
                    width="300"
                    title="대메뉴 생성/생성취소 버튼 설명"
                    trigger="hover"
                  >
                    <b-col>
                      <b-row>
                        <y-label label="대메뉴 생성 버튼 누를 시" :editable="editable" />
                      </b-row>
                      <b-row>
                        <y-label label=" - 메뉴레벨 : 1" :editable="editable" />
                      </b-row>
                      <b-row>
                        <y-label label=" - 상위메뉴 : X" :editable="editable" />
                      </b-row>
                      <b-row>
                        <y-label label=" - 업무구분 : 지정(공통코드에 등록된 값)" :editable="editable" />
                      </b-row>
                      <b-row>
                        <y-label label="대메뉴 생성취소 버튼 누를 시" :editable="editable" />
                      </b-row>
                      <b-row>
                        <y-label label=" - 상위메뉴에 따른 메뉴레벨, 업무그룹을 지정" :editable="editable" />
                      </b-row>
                    </b-col>
                    <f-icon
                      slot="reference"
                      size="lg"
                      prefix="far"
                      style="color:blue;"
                      icon="question-circle"
                    />
                  </el-popover>
                </div>
            </b-col>-->
        <!-- 결재문서 유형코드 -->
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-text
            :width="8"
            :editable="editable"
            :required="true"
            :disabled="appr.apprBizNo > 0 ? true : false"
            ui="bootstrap"
            :maxlength="8"
            label="L0000000424"
            name="apprBizCd"
            v-model="appr.apprBizCd"
            v-validate="'required'"
            :state="validateState('apprBizCd')"
          ></y-text>
        </b-col>
        <!-- 업무명 -->
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-text
            :width="8"
            :editable="editable"
            :required="true"
            ui="bootstrap"
            :maxlength="200"
            label="L0000001948"
            name="bizNm"
            v-model="appr.bizNm"
            v-validate="'required'"
            :state="validateState('bizNm')"
          ></y-text>
        </b-col>
        <!-- 결재선 적용방식 -->
        <!-- <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-select
                :width="8"
                :editable="editable"
                :required="true"
                :comboItems="apprBizTypeCdItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="L0000000430"
                name="apprBizTypeCd"
                v-model="appr.apprBizTypeCd"
                v-validate="'required'"
                :state="validateState('apprBizTypeCd')"
                @datachange="selApprBizType"
              />
            </b-col> -->
        <!-- 결재URL -->
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-text
            :width="8"
            :editable="editable"
            :required="true"
            ui="bootstrap"
            :maxlength="500"
            label="L0000000421"
            name="apprUrl"
            v-model="appr.apprUrl"
            v-validate="'required'"
            :state="validateState('apprUrl')"
          ></y-text>
        </b-col>
        <!-- 결재 파라미터 등록시 구분자는 ' | ' 를 사용하여 구분해 주시기 바랍니다. -->
        <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12 mb-3">
          <el-tag size="medium" type="info">
            <i class="el-icon-info"></i>
            {{ $comm.getLangSpecInfoLabel('L0000000419') }}
          </el-tag>
        </b-col>
        <!-- 결재 파라미터 -->
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-text
            :width="8"
            :editable="editable"
            :required="true"
            ui="bootstrap"
            :maxlength="500"
            label="L0000004208"
            name="apprParameter"
            v-model="appr.apprParameter"
            v-validate="'required'"
            :state="validateState('apprParameter')"
          ></y-text>
        </b-col>
        <!-- 사용여부 / L0000001440 - 사용, L0000001063 - 미사용 -->
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
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
            v-model="appr.useYn"
          ></y-switch>
        </b-col>
        <!-- 정렬순서 -->
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-number
            :width="8"
            :editable="editable"
            :maxlength="5"
            :hasSeperator="false"
            :isPositive="true"
            :required="true"
            ui="bootstrap"
            label="L0000002601"
            name="sortOrder"
            v-model="appr.sortOrder"
            v-validate="'required'"
            :state="validateState('sortOrder')"
          ></y-number>
        </b-col>
        <!-- 결재메일내용 -->
        <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
          <y-textarea
            :editable="editable"
            :width="10"
            :rows="7"
            :maxlength="4000"
            ui="bootstrap"
            name="apprMailContents"
            label="L0000000423"
            v-model="appr.apprMailContents"
          />
        </b-col>
        <!-- 결재선 상세 -->
        <el-divider content-position="left">
          {{ $comm.getLangSpecInfoLabel('L0000000431') }}
        </el-divider>
        <!-- 결재선명 -->
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-text
            :width="8"
            :editable="editable"
            :required="true"
            ui="bootstrap"
            :maxlength="500"
            label="L0000000433"
            name="apprLineNm"
            v-model="apprBizLine.apprLineNm"
          ></y-text>
        </b-col>
        <!-- 설명 -->
        <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
          <y-textarea
            :editable="editable"
            :width="10"
            :maxlength="1000"
            ui="bootstrap"
            name="apprLineDesc"
            label="L0000001578"
            v-model="apprBizLine.apprLineDesc"
          />
        </b-col>
        <b-col
          sm="6"
          md="6"
          lg="6"
          xl="6"
          class="col-xxl-3"
          v-if="this.appr.apprBizTypeCd === 'CSSE2'"
        >
          <y-plant type="edit" v-model="apprBizLine.plantCd" :required="true" />
          <!-- <y-select
                  :width="8"
                  :editable="editable"
                  :comboItems="plantItems"
                  :required="true"
                  itemText="codeNm"
                  itemValue="code"
                  ui="bootstrap"
                  label="사업장"
                  name="plantCd"
                  v-model="apprBizLine.plantCd"
              ></y-select>-->
        </b-col>
      </b-row>
      <b-row class="grid-height grid-box">
        <b-col sm="12" class="h100p">
          <y-auigrid
            ref="yAuiGrid4"
            :name="gridOptions4.name"
            :headers="gridOptions4.header"
            :btns="gridOptions4.btns"
            :height="gridOptions4.height"
            :label="this.$comm.getLangSpecInfoLabel('L0000000432')"
            :useExcelExport="false"
            :enableSorting="true"
            :showGridSetSave="true"
          />
        </b-col>
      </b-row>
      <b-row class="grid-height grid-box">
        <b-col sm="12" class="h100p">
          <y-auigrid
            ref="yAuiGrid2"
            :name="gridOptions2.name"
            :headers="gridOptions2.header"
            :btns="gridOptions2.btns"
            :height="gridOptions2.height"
            :label="this.$comm.getLangSpecInfoLabel('L0000000429')"
            :useExcelExport="false"
            :enableSorting="true"
            :showGridSetSave="true"
            :showRowCheckColumn="true"
            @cellClick="selectedChildRow"
            @removeGdata="removeGdata"
            @addGdata="addGdata"
          />
        </b-col>
      </b-row>
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid3"
          :name="gridOptions3.name"
          :headers="gridOptions3.header"
          :btns="gridOptions3.btns"
          :height="gridOptions3.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000000431')"
          :useExcelExport="false"
          :enableSorting="true"
          :showGridSetSave="true"
        />
      </b-col>
    </b-card>
    <!-- 결재선 상세 e -->
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  /* attributes: name, components, props, data */
  name: 'appr-line-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        apprBizNo: 0,
        apprBizTypeCd: null,
      },
    },
  },
  data() {
    return {
      gridOptions2: {
        name: 'apprLineDetail2',
        header: [],
        data: [],
        height: '200',
        btns: [],
        minHeight: '100',
      },
      gridOptions3: {
        name: 'apprLineDetail3',
        header: [],
        data: [],
        height: '200',
        btns: [],
        minHeight: '100',
      },
      gridOptions4: {
        name: 'apprLineDetail4',
        header: [],
        data: [],
        height: '100',
        btns: [],
        minHeight: '100',
      },
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '500px',
        top: '50px',
        param: {},
        closeCallback: null,
      },
      selectValue: '',
      appr: {
        apprBizNo: 0, // 결재문서 마스터 번호
        apprBizCd: '', // 결재문서 유형
        bizNm: '', // 업무명
        apprBizTypeCd: 'CSSE2', // 결재선적용방식
        apprUrl: '', // 결재URL
        apprParameter: '', // 결재 파라미터
        apprMailContents: '', // 결재메일내용
        useYn: 'Y', // 사용여부
        sortOrder: 0, // 정렬순서
        apprBizLineList: [], // 결재문서결재선 목록
        apprBizLineDtlList: [], // 결재문서결재선 세부정보 목록
      },
      apprBizLine: {
        plantCd: null, // 사업장
        apprLineNm: '', // 결재선명
        apprLineDesc: '', // 설명
        apprLineTypeCd: '', // 결재선유형코드
      },
      apprBizLineDtl: {
        plantCd: null, // 사업장
        plantConfirmDeptCd: '', // 사업장 확인부서 코드
        plantConfWorkerId: '', // 사업장 확인부서 실무자ID
        plantConfWorkerNm: '', // 사업장 확인부서 실무자
        plantConfChargerId: '', // 사업장 확인부서 담당자ID
        plantConfChargerNm: '', // 사업장 확인부서 담당자
        hqConfirmDeptCd: '', // 본사 확인부서 코드
        hqConfWorkerId: '', // 본사 확인부서 실무자ID
        hqConfWorkerNm: '', // 본사 확인부서 실무자
        hqConfChargerId: '', // 본사 확인부서 담당자ID
        hqConfChargerNm: '', // 본사 확인부서 담당자
      },
      editable: false,
      apprBizTypeCdItems: [], // 결재선적용방식코드 목록
      searchApprBizTypeCdItems: [], // 결재선적용방식코드 목록(검색)
      plantItems: [], // 사업장 목록
      plantConfFlag: false, // 사업장 확인부서 입력 flag
      hqContFlag: false, // 본사 확인부서 입력 flag
      insertUrl: '', // 등록 url
      editUrl: '', // 수정 url
      listUrl: '', // 결재문서 마스터 목록 조회 url
      getUrl: '', // 결재선 상세 조회 url
      countUrl: '', // 결재문서 유형코드 유효성 조회 url
      isInsert: false,
      isEdit: false,
      popupCallRow: null,
      selectValue1: [],
      selectValue2: [],

      YAuiGrid2: null,
      YAuiGrid3: null,
      YAuiGrid4: null,
    };
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    this.YAuiGrid2 = this.$refs.yAuiGrid2;
    this.YAuiGrid3 = this.$refs.yAuiGrid3;
    this.YAuiGrid4 = this.$refs.yAuiGrid4;
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      this.insertUrl = transactionConfig.manage.apprLine.insert.url;
      this.editUrl = transactionConfig.manage.apprLine.edit.url;
      this.listUrl = selectConfig.manage.apprLine.list.url;
      this.getUrl = selectConfig.manage.apprLine.get.url;
      this.countUrl = selectConfig.manage.apprLine.count.url;

      this.getComboItems('COM_PLANT_SAME'); // 결재선적용방식코드 목록 조회
      this.getComboItems('COM_PLANT_CD'); // 사업장 목록 조회

      // 결재선 목록
      this.gridOptions2.header = [
        // 사업장
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plantNm',
          width: '130px',
          style: 'center-align',
        },
        // 결재선명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000433'),
          dataField: 'apprLineNm',
          width: '200px',
        },
        // 결재선유형코드
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004206'),
          dataField: 'apprLineTypeCd',
          width: '130px',
          style: 'center-align',
        },
      ];
      this.gridOptions2.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002620'),
          color: 'red',
          btnClicked: 'removeGdata',
          visible: this.appr.apprBizTypeCd === 'CSSE2',
        }, //  제외
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002482'),
          color: 'blue',
          btnClicked: 'addGdata',
          visible: this.editable,
        }, //  적용
      ];

      this.gridOptions3.header = [
        // 사업장
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plantNm',
          width: '130px',
          style: 'center-align',
        },
        // 사업장확인부서
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001436'),
          dataField: 'plantConfirmDeptNm',
          width: '130px',
          style: 'center-align',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
        // 사업장확인부서실무자
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001438'),
          dataField: 'plantConfWorkerNm',
          width: '170px',
          style: 'center-align',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
        // 사업장확인부서담당자
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001437'),
          dataField: 'plantConfChargerNm',
          width: '170px',
          style: 'center-align',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
        // 본사확인부서
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001281'),
          dataField: 'hqConfirmDeptNm',
          width: '130px',
          style: 'center-align',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
        // 본사확인부서실무자
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001283'),
          dataField: 'hqConfWorkerNm',
          width: '160px',
          style: 'center-align',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
        // 본사확인부서담당자
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001282'),
          dataField: 'hqConfChargerNm',
          width: '160px',
          style: 'center-align',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
      ];

      // 결재선 선택 목록
      this.gridOptions4.header = [
        // (사업장)업무부서 결재
        {
          headerText: '(사업장)업무부서 결재',
          sortable: false,
          children: [
            // 담당
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000000889'),
              dataField: 'apprLine0',
              width: '50px',
              renderer: {
                type: 'CheckBoxEditRenderer',
                editable: this.editable,
                checkValue: 'Y',
                unCheckValue: 'N',
              },

              sortable: false,
            },
            // 팀장
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000003025'),
              dataField: 'apprLine1',
              width: '50px',
              renderer: {
                type: 'CheckBoxEditRenderer',
                editable: this.editable,
                checkValue: 'Y',
                unCheckValue: 'N',
              },

              sortable: false,
            },
            // 실장
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000001809'),
              dataField: 'apprLine2',
              width: '50px',
              renderer: {
                type: 'CheckBoxEditRenderer',
                editable: this.editable,
                checkValue: 'Y',
                unCheckValue: 'N',
              },

              sortable: false,
            },
          ],
        },
        // (사업장)확인부서 결재
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000003'),
          sortable: false,
          children: [
            // 실무자
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000001808'),
              dataField: 'apprLine3',
              width: '50px',
              renderer: {
                type: 'CheckBoxEditRenderer',
                showLabel: false, // 참, 거짓 텍스트 출력여부( 기본값 false )
                editable: true, // 체크박스 편집 활성화 여부(기본값 : false)
                checkValue: true, // true, false 인 경우가 기본
                unCheckValue: false,
                // 체크박스 disabled 함수
              },

              sortable: false,
            },
            // 담당
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000000889'),
              dataField: 'apprLine4',
              width: '50px',
              renderer: {
                type: 'CheckBoxEditRenderer',
                editable: this.editable,
                checkValue: 'Y',
                unCheckValue: 'N',
              },

              sortable: false,
            },
            // 팀장
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000003025'),
              dataField: 'apprLine5',
              width: '50px',
              renderer: {
                type: 'CheckBoxEditRenderer',
                editable: this.editable,
                checkValue: 'Y',
                unCheckValue: 'N',
              },

              sortable: false,
            },
          ],
        },
        // (본사)확인부서 결재
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000001'),
          sortable: false,
          children: [
            // 실무자
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000001808'),
              dataField: 'apprLine6',
              width: '50px',
              renderer: {
                type: 'CheckBoxEditRenderer',
                editable: this.editable,
                checkValue: 'Y',
                unCheckValue: 'N',
              },

              sortable: false,
            },
            // 담당
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000000889'),
              dataField: 'apprLine7',
              width: '50px',
              renderer: {
                type: 'CheckBoxEditRenderer',
                editable: this.editable,
                checkValue: 'Y',
                unCheckValue: 'N',
              },

              sortable: false,
            },
            // 팀장
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000003025'),
              dataField: 'apprLine8',
              width: '50px',
              renderer: {
                type: 'CheckBoxEditRenderer',
                editable: this.editable,
                checkValue: 'Y',
                unCheckValue: 'N',
              },

              sortable: false,
            },
          ],
        },
      ];
      this.gridOptions4.data = [
        {
          apprLine0: 'N',
          apprLine1: 'N',
          apprLine2: 'N',
          apprLine3: 'N',
          apprLine4: 'N',
          apprLine5: 'N',
          apprLine6: 'N',
          apprLine7: 'N',
          apprLine8: 'N',
        },
      ];
      if (this.popupParam.apprBizNo !== 0) {
        this.getDetail();
      }
    },
    // 마스터 목록 선택
    getDetail() {
      // this.btnClearClickedCallback(); // 초기화
      // 상세 조회
      this.$http.url = this.$format(this.getUrl, this.popupParam.apprBizNo);
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.$_.extend(this.appr, _result.data);
          this.YAuiGrid2.setGridData(
            this.$_.clone(_result.data.apprBizLineList)
          );
          this.YAuiGrid3.setGridData(
            this.$_.clone(_result.data.apprBizLineDtlList)
          );
          this.YAuiGrid4.setGridData(this.gridOptions4.data);
          this.apprBizLine.plantCd = null;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
      if (this.popupParam.apprBizTypeCd === 'CSSE1') {
        this.selectValue = 'CSSE1';
      } else {
        this.selectValue = 'CSSE2';
      }
    },
    // 공통 코드 조회
    getComboItems(codeGroupCd) {
      this.$http.url = this.$format(
        selectConfig.codeMaster.getSelect.url,
        codeGroupCd
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          if (codeGroupCd === 'COM_PLANT_SAME') {
            this.apprBizTypeCdItems = this.$_.clone(_result.data);
            this.apprBizTypeCdItems.splice(0, 0, {
              code: null,
              codeNm: '선택',
            });
            this.searchApprBizTypeCdItems = this.$_.clone(_result.data);
            this.searchApprBizTypeCdItems.splice(0, 0, {
              code: null,
              codeNm: '전체',
            });
          } else if (codeGroupCd === 'COM_PLANT_CD') {
            this.plantItems = this.$_.clone(_result.data);
            this.plantItems.splice(0, 0, { code: null, codeNm: '선택' });
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    // 결재선 그리드 체크박스 선택
    singlecheckedRow(scope) {
      let data = scope.row;
      this.$nextTick(() => {
        this.showApprLine(data);
      });
    },
    // 결재선 그리드 체크박스 선택에 따른 ui변경 처리
    showApprLine(data) {
      if (data) {
        if (
          data.apprLine3 === 'Y' ||
          data.apprLine4 === 'Y' ||
          data.apprLine5 === 'Y'
        ) {
          this.plantConfFlag = true;
        } else {
          this.plantConfFlag = false;
        }
        if (
          data.apprLine6 === 'Y' ||
          data.apprLine7 === 'Y' ||
          data.apprLine8 === 'Y'
        ) {
          this.hqContFlag = true;
        } else {
          this.hqContFlag = false;
        }
      }
    },
    // 결재선 적용방식 선택
    selApprBizType(apprBizTypeCd) {
      this.gridOptions2.data = [];
      this.gridOptions3.data = [];
      this.apprBizLine.plantCd = null;
    },
    // 선택된 결재선 제외 처리
    removeGdata() {
      if (this.selectValue2 && this.selectValue2.length > 0) {
        this.$_.forEach(this.selectValue2, (item) => {
          this.gridOptions2.data = this.$_.reject(this.gridOptions2.data, item);
        });
      } else {
        // 삭제 할건이 없다는 알람
        this.alertMessage(
          'L0000003395', // 안내
          'M0000001005', // 선택한 결재선이 없습니다.
          'info'
        );
      }
    },
    // 결재선, 결재선 상세 그리드 데이터 처리
    // eslint-disable-next-line complexity
    addGdata() {
      if (this.appr.apprBizTypeCd === null || this.appr.apprBizTypeCd === '') {
        this.alertMessage(
          'L0000003395', // 안내
          'M0000001006', // 결재선 범위구분을 선택해주세요.
          'warning'
        );
        return;
      }

      let dataList = this.$_.clone(this.gridOptions4.data[0]);
      let apprLineTypeCd = '';
      let dtlFlag = false;
      let i = 0;
      let j = 0;
      // 결재선 유형코드 처리
      Object.entries(dataList).forEach(([key, value]) => {
        if (key !== 'isEdit') {
          apprLineTypeCd += value;
        }
        if (i >= 3 && value === 'Y') {
          dtlFlag = true;
        }
        if (value === 'Y') {
          j++;
        }
        i++;
      });
      if (j <= 0) {
        this.alertMessage(
          'L0000003395', // 안내
          'M0000001007', // 결재선을 선택해주세요.
          'warning'
        );
        return;
      }
      // 상이할때 사업장 선택확인
      if (
        this.appr.apprBizTypeCd === 'CSSE2' &&
        (this.apprBizLine.plantCd === '0000' ||
          this.apprBizLine.plantCd === null)
      ) {
        // 상이
        this.alertMessage(
          'L0000003395', // 안내
          'M0000001003', // 다른 사업장을 선택해주세요.
          'warning'
        );
        return;
      }
      // 결재선명 유효성
      if (this.apprBizLine.apprLineNm === '') {
        this.alertMessage(
          'L0000003395', // 안내
          'M0000001004', // 결재선명을 입력해주세요.
          'warning'
        );
        return;
      }
      // 사업장명 처리
      if (this.appr.apprBizTypeCd === 'CSSE1') {
        this.apprBizLine.plantCd = '0000';
      }
      let idx = this.$_.findIndex(this.plantItems, [
        'code',
        this.apprBizLine.plantCd,
      ]);

      // 결재선
      if (this.appr.apprBizTypeCd === 'CSSE1') {
        let apprBizLineData = this.$_.clone(this.apprBizLine);
        apprBizLineData.plantNm = this.plantItems[idx].codeNm;
        apprBizLineData.apprLineTypeCd = apprLineTypeCd;
        this.gridOptions2.data = [apprBizLineData];
      } else {
        let apprBizLineData = this.$_.clone(this.apprBizLine);
        apprBizLineData.plantNm = this.plantItems[idx].codeNm;
        apprBizLineData.apprLineTypeCd = apprLineTypeCd;
        let chkNo = this.$_.findIndex(this.gridOptions2.data, [
          'plantCd',
          apprBizLineData.plantCd,
        ]);

        if (chkNo >= 0) {
          this.$_.extend(this.gridOptions2.data[chkNo], apprBizLineData);
        } else {
          this.gridOptions2.data.push(apprBizLineData);
        }
      }
      // 일전에는 업무부서 결재만 체크가 되면 바꾸러 가지 않았었는데 무조건 true를 줘서 바꾸도록 변경
      dtlFlag = true;
      // 결재선 상세
      if (dtlFlag) {
        let idx = -1;
        if (
          this.apprBizLine.plantCd != null &&
          this.apprBizLine.plantCd !== '0000'
        ) {
          idx = this.$_.findIndex(this.gridOptions3.data, [
            'plantCd',
            this.apprBizLine.plantCd,
          ]);
        }

        let apprBizLineDtl = {};
        // 사업장 확인부서
        if (
          dataList.apprLine3 === 'Y' ||
          dataList.apprLine4 === 'Y' ||
          dataList.apprLine5 === 'Y'
        ) {
          if (idx < 0) {
            apprBizLineDtl.plantConfirmDeptNm = 'search';
          } else {
            if (this.gridOptions3.data[idx].plantConfirmDeptNm === null) {
              apprBizLineDtl.plantConfirmDeptNm = 'search';
            }
          }
        } else {
          apprBizLineDtl.plantConfirmDeptNm = null;
        }
        // 사업장 확인부서 실무자
        if (dataList.apprLine3 === 'Y') {
          if (idx < 0) {
            apprBizLineDtl.plantConfWorkerNm = 'search';
          } else {
            if (this.gridOptions3.data[idx].plantConfWorkerNm === null) {
              apprBizLineDtl.plantConfWorkerNm = 'search';
            }
          }
        } else {
          apprBizLineDtl.plantConfWorkerNm = null;
        }
        // 사업장 확인부서 담당자
        if (dataList.apprLine4 === 'Y') {
          if (idx < 0) {
            apprBizLineDtl.plantConfChargerNm = 'search';
          } else {
            if (this.gridOptions3.data[idx].plantConfChargerNm === null) {
              apprBizLineDtl.plantConfChargerNm = 'search';
            }
          }
        } else {
          apprBizLineDtl.plantConfChargerNm = null;
        }
        // 본사 확인부서 결재
        if (
          dataList.apprLine6 === 'Y' ||
          dataList.apprLine7 === 'Y' ||
          dataList.apprLine8 === 'Y'
        ) {
          if (idx < 0) {
            apprBizLineDtl.hqConfirmDeptNm = 'search';
          } else {
            if (this.gridOptions3.data[idx].hqConfirmDeptNm === null) {
              apprBizLineDtl.hqConfirmDeptNm = 'search';
            }
          }
        } else {
          apprBizLineDtl.hqConfirmDeptNm = null;
        }
        // 본사 확인부서 실무자
        if (dataList.apprLine6 === 'Y') {
          if (idx < 0) {
            apprBizLineDtl.hqConfWorkerNm = 'search';
          } else {
            if (this.gridOptions3.data[idx].hqConfWorkerNm === null) {
              apprBizLineDtl.hqConfWorkerNm = 'search';
            }
          }
        } else {
          apprBizLineDtl.hqConfWorkerNm = null;
        }
        // 본사 확인부서 담당자
        if (dataList.apprLine7 === 'Y') {
          if (idx < 0) {
            apprBizLineDtl.hqConfChargerNm = 'search';
          } else {
            if (this.gridOptions3.data[idx].hqConfChargerNm === null) {
              apprBizLineDtl.hqConfChargerNm = 'search';
            }
          }
        } else {
          apprBizLineDtl.hqConfChargerNm = null;
        }
        if (this.appr.apprBizTypeCd === 'CSSE1') {
          // 공통일때 사업장 별로 생성 처리
          this.$_.forEach(this.plantItems, (plant) => {
            if (
              plant.code != null &&
              plant.code !== '0000' &&
              plant.code !== '1000' &&
              plant.code !== '1500'
            ) {
              let apprBizLineDtlData = this.$_.clone(apprBizLineDtl);
              apprBizLineDtlData.plantCd = plant.code;
              apprBizLineDtlData.plantNm = plant.codeNm;

              let chkNo = this.$_.findIndex(this.gridOptions3.data, [
                'plantCd',
                plant.code,
              ]);
              if (chkNo >= 0) {
                this.$_.extend(
                  this.gridOptions3.data[chkNo],
                  apprBizLineDtlData
                );
              } else {
                this.gridOptions3.data.push(apprBizLineDtlData);
              }
            }
          });
        } else {
          let apprBizLineDtlData = this.$_.clone(apprBizLineDtl);
          apprBizLineDtlData.plantCd = this.apprBizLine.plantCd;
          idx = this.$_.findIndex(this.plantItems, [
            'code',
            this.apprBizLine.plantCd,
          ]);
          apprBizLineDtlData.plantNm = this.plantItems[idx].codeNm;

          let chkNo = this.$_.findIndex(this.gridOptions3.data, [
            'plantCd',
            this.apprBizLine.plantCd,
          ]);
          if (chkNo >= 0) {
            this.$_.extend(this.gridOptions3.data[chkNo], apprBizLineDtlData);
          } else {
            this.gridOptions3.data.push(apprBizLineDtlData);
          }
        }
      }
    },
    // 결재선 목록 선택
    selectedChildRow(data) {
      this.apprBizLine = this.$_.clone(data);
      this.convertApprLineSelect(this.apprBizLine.apprLineTypeCd);
    },
    alertMessage(title, message, type) {
      window.getApp.$emit('ALERT', {
        title: title,
        message: message,
        type: type, // success / info / warning / error
      });
    },
    // 결재선 선택 표시 처리
    convertApprLineSelect(apprLineTypeCd) {
      let types = this.$_.toArray(apprLineTypeCd);
      let gData = {};
      types.forEach((item, index) => {
        gData['apprLine' + index] = item;
      });
      // this.gridOptions4.data = [gData];
      this.YAuiGrid4.setGridData = [gData];
      this.showApprLine(this.YAuiGrid4.setGridData[0]);
    },
    // 결재선 상세 선택
    selectedDtlChildRow(header, row, index) {
      this.popupCallRow = index;
      if (header.name === 'plantConfirmDeptNm') {
        this.searchPlantConfirmDept(); // 사업장 확인부서 검색
      } else if (header.name === 'plantConfWorkerNm') {
        this.searchPlantConfWorker(); // 사업장 확인부서 실무자 검색
      } else if (header.name === 'plantConfChargerNm') {
        this.searchPlantConfCharger(); // 사업장 확인부서 담당자 검색
      } else if (header.name === 'hqConfirmDeptNm') {
        this.searchHqConfirmDept(); // 본사 확인부서 검색
      } else if (header.name === 'hqConfWorkerNm') {
        this.searchHqConfWorker(); // 본사 확인부서 실무자 검색
      } else if (header.name === 'hqConfChargerNm') {
        this.searchHqConfCharger(); // 본사 확인부서 담당자 검색
      }
    },
    // 사업장확인부서 검색
    searchPlantConfirmDept() {
      this.popupOptions.closeCallback = this.closePlantConfirmDept;
      this.searchDept();
    },
    // 사업장확인부서 실무자 검색
    searchPlantConfWorker() {
      this.popupOptions.closeCallback = this.closePopPlantConfWorker;
      this.searchUser();
    },
    // 사업장확인부서 담당자 검색
    searchPlantConfCharger() {
      this.popupOptions.closeCallback = this.closePopPlantConfCharger;
      this.searchUser();
    },
    // 본사 확인부서 검색
    searchHqConfirmDept() {
      this.popupOptions.closeCallback = this.closeHqConfirmDept;
      this.searchDept();
    },
    // 본사 확인부서 실무자 검색
    searchHqConfWorker() {
      this.popupOptions.closeCallback = this.closePopHqConfWorker;
      this.searchUser();
    },
    // 본사 확인부서 담당자 검색
    searchHqConfCharger() {
      this.popupOptions.closeCallback = this.closePopHqConfCharger;
      this.searchUser();
    },
    // 사업장확인부서 검색 콜백
    closePlantConfirmDept(data) {
      this.closePopup();
      if (data.dept) {
        this.gridOptions3.data[this.popupCallRow].plantConfirmDeptCd =
          data.dept.deptCd;
        this.gridOptions3.data[this.popupCallRow].plantConfirmDeptNm =
          data.dept.deptNm;
      }
    },
    // 사업장확인부서 실무자 검색 콜백
    closePopPlantConfWorker(data) {
      this.closePopup();
      if (data.user) {
        this.gridOptions3.data[this.popupCallRow].plantConfWorkerId =
          data.user.userId;
        this.gridOptions3.data[this.popupCallRow].plantConfWorkerNm =
          data.user.userNm;
      }
    },
    // 사업장확인부서 담당자 검색 콜백
    closePopPlantConfCharger(data) {
      this.closePopup();
      if (data.user) {
        this.gridOptions3.data[this.popupCallRow].plantConfChargerId =
          data.user.userId;
        this.gridOptions3.data[this.popupCallRow].plantConfChargerNm =
          data.user.userNm;
      }
    },
    // 본사 확인부서 검색 콜백
    closeHqConfirmDept(data) {
      this.closePopup();
      if (data.dept) {
        this.gridOptions3.data[this.popupCallRow].hqConfirmDeptCd =
          data.dept.deptCd;
        this.gridOptions3.data[this.popupCallRow].hqConfirmDeptNm =
          data.dept.deptNm;
      }
    },
    // 본사 확인부서 실무자 검색 콜백
    closePopHqConfWorker(data) {
      this.closePopup();
      if (data.user) {
        this.gridOptions3.data[this.popupCallRow].hqConfWorkerId =
          data.user.userId;
        this.gridOptions3.data[this.popupCallRow].hqConfWorkerNm =
          data.user.userNm;
      }
    },
    // 본사 확인부서 담당자 검색 콜백
    closePopHqConfCharger(data) {
      this.closePopup();
      if (data.user) {
        this.gridOptions3.data[this.popupCallRow].hqConfChargerId =
          data.user.userId;
        this.gridOptions3.data[this.popupCallRow].hqConfChargerNm =
          data.user.userNm;
      }
    },
    // 사용자 검색
    searchUser() {
      this.popupOptions.target = () =>
        import(`${'@/pages/manage/user/userSearch.vue'}`);
      this.popupOptions.title = 'L0000001466'; // 사용자검색
      this.popupOptions.visible = true;
      this.popupOptions.width = '60%';
      this.popupOptions.top = '100px';
    },
    // 부서 검색
    searchDept() {
      this.popupOptions.target = () =>
        import(`${'@/pages/baseInfo/deptManage/deptSearch.vue'}`);
      this.popupOptions.title = 'L0000004209'; // 부서검색
      this.popupOptions.visible = true;
      this.popupOptions.width = '60%';
      this.popupOptions.top = '100px';
    },
    // 팝업닫기
    closePopup() {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
    },

    // 유효성 검사
    validateState(_ref) {
      if (
        this.veeBag[_ref] &&
        (this.veeBag[_ref].dirty || this.veeBag[_ref].validated)
      ) {
        return !this.errors.has(_ref);
      }
      return null;
    },
    // 수정전
    beforeUpdate() {
      // 각 필드 유효성 체크
      this.checkValidation('update');
    },
    // 유효성 검사
    checkValidation(type) {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            // 결재선 상세 유효성 검사
            let gData3Flag = false;
            if (this.gridOptions3.data.length > 0) {
              this.$_.forEach(this.gridOptions3.data, (item) => {
                // 사업장 확인부서 유효성 검사
                if (item.plantConfirmDeptNm === 'search') {
                  this.alertMessage(
                    'L0000003395', // 안내
                    'M0000000495',
                    'warning'
                  );
                  gData3Flag = true;
                  return false;
                }
                // 사업장 확인부서 실무자 유효성 검사
                if (item.plantConfWorkerNm === 'search') {
                  this.alertMessage(
                    'L0000003395', // 안내
                    'M0000000496', // 사업장확인부서 실무자를 입력해주세요.
                    'warning'
                  );
                  gData3Flag = true;
                  return false;
                }
                // 사업장 확인부서 담당자 유효성 검사
                if (item.plantConfChargerNm === 'search') {
                  this.alertMessage(
                    'L0000003395', // 안내
                    'M0000000497', // 사업장확인부서 담당자를 입력해주세요.,
                    'warning'
                  );
                  gData3Flag = true;
                  return false;
                }
                // 본사 확인부서 유효성 검사
                if (item.hqConfirmDeptNm === 'search') {
                  this.alertMessage(
                    'L0000003395', // 안내
                    'M0000000498', // 본사확인부서를 입력해주세요.
                    'warning'
                  );
                  gData3Flag = true;
                  return false;
                }
                // 본사 확인부서 실무자 유효성 검사
                if (item.hqConfWorkerNm === 'search') {
                  this.alertMessage(
                    'L0000003395', // 안내
                    'M0000000499', // 본사확인부서 실무자를 입력해주세요.
                    'warning'
                  );
                  gData3Flag = true;
                  return false;
                }
                // 본사 확인부서 담당자 유효성 검사
                if (item.hqConfChargerNm === 'search') {
                  this.alertMessage(
                    'L0000003395', // 안내
                    'M0000000500', // 본사확인부서 담당자를 입력해주세요.
                    'warning'
                  );
                  gData3Flag = true;
                  return false;
                }
              });
            }
            if (gData3Flag) {
              return false;
            }

            let alertTitle = '';
            if (type === 'insert') {
              // 결재문서 유형코드 유효성 체크
              this.$http.url = this.$format(this.countUrl, this.appr.apprBizCd);
              this.$http.type = 'GET';
              this.$http.request(
                (_result) => {
                  if (_result.data > 0) {
                    window.getApp.$emit('ALERT', {
                      title: 'L0000003396', // 에러
                      message: 'M0000000501', // 이미 등록된 결재문서 유형코드입니다. 다른 코드를 입력해주세요.
                      type: 'error', // success / info / warning / error
                    });
                  }
                },
                (_error) => {
                  window.getApp.$emit('APP_REQUEST_ERROR', _error);
                }
              );

              alertTitle = '저장';
            } else {
              alertTitle = '저장';
            }
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321', // 확인
              message: 'M0000000011', // 저장하시겠습니까?
              type: 'info', // success / info / warning / error
              confirmCallback: () => {
                this.appr.apprBizLineList = this.$_.clone(
                  this.gridOptions2.data
                );
                this.appr.apprBizLineDtlList = this.$_.clone(
                  this.gridOptions3.data
                );
                if (type === 'insert') {
                  this.appr.createUserId = this.$store.getters.token;
                  this.isInsert = true;
                } else {
                  this.appr.updateUserId = this.$store.getters.token;
                  this.isEdit = true;
                }
              },
              cancelCallback: () => {
                this.isInsert = false;
                this.isEdit = false;
              },
            });
          } else if (!_result) {
            this.$popupRequired.check(
              'apprLineDetail',
              this.$data,
              this.errors
            );
          }
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000881' // 유효성 검사도중 에러가 발생하였습니다.
          );
        });
    },
    // 수정후
    btnSaveClickedCallback() {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395',
        message: '저장되었습니다.',
        type: 'success', // success / info / warning / error
      });
      this.isEdit = false;
    },
    // 등록전
    beforeInsert() {
      this.checkValidation('insert');
    },
    // 등록후
    btnInsertClickedCallback() {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395',
        message: 'M0000000106', // 등록되었습니다.
        type: 'success', // success / info / warning / error
      });
      this.isInsert = false;
    },
    btnClickedErrorCallback(_result) {
      this.isInsert = false;
      this.isEdit = false;
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    btnClosePopup() {
      // 부모창에 값 전달
      this.$emit('closePopup', { success: true });
    },
  },
};
</script>
