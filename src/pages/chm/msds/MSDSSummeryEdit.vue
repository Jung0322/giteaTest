<!--
  목적 : 물질관리 > 화학물질 > MSDS > MSDS 요약내용
  작성자 : kdh
  Detail : MSDS 요약내용 조회 화면
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
            <!-- MSDS요약내용 -->
            <y-label
              label="L0000000131"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 적용 -->
              <y-btn
                v-if="!popupParam.viewMode && editable"
                title="L0000002482"
                color="orange"
                @btnClicked="accept"
              />
              <!-- 닫기 -->
              <y-btn title="L0000000881" @btnClicked="closePopup('C')" />
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <!-- 제품명 :  -->
              <y-label label="제품명 : " />
              <y-label
                :label="
                  popupParam.msds.chemProdNmEn
                    ? popupParam.msds.chemProdNmKr +
                      ' (' +
                      popupParam.msds.chemProdNmEn +
                      ')'
                    : popupParam.msds.chemProdNmKr
                "
                :fieldable="true"
              />
            </b-col>
          </b-row>
        </b-card>
      </b-col>
      <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
        <div class="float-left mt-2">
          <el-tag size="medium" type="info">
            <!-- 화학물질 선택시, 일반정보와 물질정보가 보이게 됩니다. -->
            <i class="el-icon-info"></i>
            {{ $comm.getLangSpecInfoLabel('L0000003292') }}
          </el-tag>
        </div>
        <div class="float-right mt-2">
          <y-btn :title="folderTitle" @btnClicked="folder" />
        </div>
      </b-col>
      <b-col sm="12" class="mt-2">
        <b-row>
          <el-collapse v-model="activeName" style="width: 100%">
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <el-collapse-item name="1">
                <template slot="title">
                  <b-col sm="12">
                    <!-- 1. 일반정보 -->
                    <y-label
                      label="L0000000085"
                      color-class="cutstom-title-color"
                    />
                  </b-col>
                </template>
                <b-card style="width: 90%">
                  <b-row>
                    <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
                      <!-- 제품명 :  -->
                      <y-label label="L0000003826" />
                      <y-label
                        :label="
                          popupParam.msds.chemProdNmEn
                            ? popupParam.msds.chemProdNmKr +
                              ' (' +
                              popupParam.msds.chemProdNmEn +
                              ')'
                            : popupParam.msds.chemProdNmKr
                        "
                        :fieldable="true"
                      />
                    </b-col>
                    <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
                      <!-- 성상 :  -->
                      <y-label label="L0000003827" />
                      <y-label
                        :label="popupParam.msds.propertyNm"
                        :fieldable="true"
                      />
                    </b-col>
                    <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
                      <!-- 분자량 :  -->
                      <y-label label="L0000003828" />
                      <y-label
                        :label="popupParam.msds.moleWeight"
                        :fieldable="true"
                      />
                    </b-col>
                    <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
                      <!-- 끓는점 :  -->
                      <y-label label="L0000003829" />
                      <y-label
                        :label="popupParam.msds.boilpoint"
                        :fieldable="true"
                      />
                    </b-col>
                    <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
                      <!-- 녹는점 :  -->
                      <y-label label="L0000003830" />
                      <y-label
                        :label="popupParam.msds.meltingPnt"
                        :fieldable="true"
                      />
                    </b-col>
                    <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
                      <!-- 인화점 :  -->
                      <y-label label="L0000003831" />
                      <y-label
                        :label="popupParam.msds.flashingPnt"
                        :fieldable="true"
                      />
                    </b-col>
                    <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
                      <!-- 주요용도 :  -->
                      <y-label label="L0000003832" />
                      <y-label
                        :label="popupParam.msds.usageNm"
                        :fieldable="true"
                      />
                    </b-col>
                    <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
                      <!-- 비중 :  -->
                      <y-label label="L0000003833" />
                      <y-label
                        :label="popupParam.msds.specificGravity"
                        :fieldable="true"
                      />
                    </b-col>
                  </b-row>
                </b-card>
              </el-collapse-item>
            </b-col>

            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12 mt-2">
              <el-collapse-item name="2">
                <template slot="title">
                  <b-col sm="12">
                    <!-- 2. 물질정보 ({s0} 건) -->
                    <y-label
                      :label="
                        $comm.getLangSpecInfoLabel('L0000000087', {
                          s0: gridOptions.data ? gridOptions.data.length : 0,
                        })
                      "
                      color-class="cutstom-title-color"
                    />
                  </b-col>
                </template>
                <y-auigrid
                  ref="yAuiGrid"
                  :name="gridOptions.name"
                  :headers="gridOptions.header"
                  :btns="gridOptions.btns"
                  :height="gridOptions.height"
                  :items="gridOptions.data"
                  :useExcelExport="false"
                  :useBtn="false"
                />
              </el-collapse-item>
            </b-col>

            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12 mt-2">
              <el-collapse-item name="3">
                <template slot="title">
                  <b-col sm="12">
                    <!-- 3. 그림문자 -->
                    <y-label
                      label="L0000000088"
                      color-class="cutstom-title-color"
                    />
                  </b-col>
                </template>
                <b-card>
                  <b-row>
                    <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
                      <el-checkbox-group
                        v-model="popupParam.msds.msdsPicGraphs"
                      >
                        <el-checkbox
                          v-for="msdsPicture in msdsPictures"
                          :label="msdsPicture.code"
                          :key="msdsPicture.code"
                          :disabled="popupParam.viewMode"
                        >
                          <el-image
                            style="width: 70px; height: 70px"
                            :src="
                              publicPath +
                              '/src/assets/images/' +
                              msdsPicture.codeNm
                            "
                            fit="contain"
                          ></el-image>
                        </el-checkbox>
                      </el-checkbox-group>
                    </b-col>
                  </b-row>
                </b-card>
              </el-collapse-item>
            </b-col>

            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12 mt-2">
              <el-collapse-item name="4">
                <template slot="title">
                  <b-col sm="12">
                    <!-- 4. 유해위험 문구 -->
                    <y-label
                      label="L0000000089"
                      color-class="cutstom-title-color"
                    />
                  </b-col>
                </template>
                <b-card>
                  <b-row>
                    <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
                      <!-- 신호어 -->
                      <y-text
                        :width="12"
                        :disabled="popupParam.viewMode"
                        :editable="editable"
                        ui="bootstrap"
                        label="L0000001805"
                        name="signalDesc"
                        v-model="popupParam.msds.signalDesc"
                      ></y-text>
                    </b-col>
                    <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
                      <!-- 유해·위험문구 -->
                      <y-textarea
                        :width="12"
                        :disabled="popupParam.viewMode"
                        :editable="editable"
                        ui="bootstrap"
                        label="L0000002164"
                        name="hazDangerDesc"
                        v-model="popupParam.msds.hazDangerDesc"
                      ></y-textarea>
                    </b-col>
                    <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
                      <!-- 예방조치문구 -->
                      <y-textarea
                        :width="12"
                        :disabled="popupParam.viewMode"
                        :editable="editable"
                        ui="bootstrap"
                        label="L0000002017"
                        name="preventActDesc"
                        v-model="popupParam.msds.preventActDesc"
                      ></y-textarea>
                    </b-col>
                    <!-- <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
                    <y-textarea
                    :width="12"
                    :disabled="popupParam.viewMode"
                    :editable="editable"
                    ui="bootstrap"
                    name="hazDangerDesc"
                    v-model="popupParam.msds.hazDangerDesc"
                    >
                    </y-textarea>
                    </b-col>-->
                  </b-row>
                </b-card>
              </el-collapse-item>
            </b-col>

            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12 mt-2">
              <el-collapse-item name="5">
                <template slot="title">
                  <b-col sm="12">
                    <!-- 5. 응급조치요령 -->
                    <y-label
                      label="L0000000090"
                      color-class="cutstom-title-color"
                    />
                  </b-col>
                </template>
                <b-card>
                  <b-row>
                    <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
                      <!-- 눈에 들어갔을때 -->
                      <y-textarea
                        :width="12"
                        :disabled="popupParam.viewMode"
                        :editable="editable"
                        ui="bootstrap"
                        label="L0000000862"
                        name="fstAidEyeDesc"
                        v-model="popupParam.msds.fstAidEyeDesc"
                      ></y-textarea>
                    </b-col>
                    <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
                      <!-- 피부에 접촉했을 때 -->
                      <y-textarea
                        :width="12"
                        :disabled="popupParam.viewMode"
                        :editable="editable"
                        ui="bootstrap"
                        label="L0000003158"
                        name="fstAidSkinDesc"
                        v-model="popupParam.msds.fstAidSkinDesc"
                      ></y-textarea>
                    </b-col>
                    <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
                      <!-- 흡입했을 때 -->
                      <y-textarea
                        :width="12"
                        :disabled="popupParam.viewMode"
                        :editable="editable"
                        ui="bootstrap"
                        label="L0000003390"
                        name="fstAidBreathDesc"
                        v-model="popupParam.msds.fstAidBreathDesc"
                      ></y-textarea>
                    </b-col>
                    <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
                      <!-- 먹었을 때 -->
                      <y-textarea
                        :width="12"
                        :disabled="popupParam.viewMode"
                        :editable="editable"
                        ui="bootstrap"
                        label="L0000001003"
                        name="fstAidEatDesc"
                        v-model="popupParam.msds.fstAidEatDesc"
                      ></y-textarea>
                    </b-col>
                  </b-row>
                </b-card>
              </el-collapse-item>
            </b-col>

            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12 mt-2">
              <el-collapse-item name="6">
                <template slot="title">
                  <b-col sm="12">
                    <!-- 6. 저장방법 -->
                    <y-label
                      label="L0000000091"
                      color-class="cutstom-title-color"
                    />
                  </b-col>
                </template>
                <b-card>
                  <b-row>
                    <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
                      <y-textarea
                        :width="12"
                        :disabled="popupParam.viewMode"
                        :editable="editable"
                        ui="bootstrap"
                        name="strgMthdDesc"
                        v-model="popupParam.msds.strgMthdDesc"
                      ></y-textarea>
                    </b-col>
                  </b-row>
                </b-card>
              </el-collapse-item>
            </b-col>

            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12 mt-2">
              <el-collapse-item name="7">
                <template slot="title">
                  <b-col sm="12">
                    <!-- 7. 피해야 할 조건 및 품질 -->
                    <y-label
                      label="L0000000092"
                      color-class="cutstom-title-color"
                    />
                  </b-col>
                </template>
                <b-card>
                  <b-row>
                    <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
                      <!-- 피해야 할 조건 -->
                      <y-textarea
                        :width="12"
                        :disabled="popupParam.viewMode"
                        :editable="editable"
                        ui="bootstrap"
                        label="L0000003161"
                        name="evasCondDesc"
                        v-model="popupParam.msds.evasCondDesc"
                      ></y-textarea>
                    </b-col>
                    <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
                      <!-- 피해야 할 물질 -->
                      <y-textarea
                        :width="12"
                        :disabled="popupParam.viewMode"
                        :editable="editable"
                        ui="bootstrap"
                        label="L0000003160"
                        name="evasMatDesc"
                        v-model="popupParam.msds.evasMatDesc"
                      ></y-textarea>
                    </b-col>
                  </b-row>
                </b-card>
              </el-collapse-item>
            </b-col>

            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12 mt-2">
              <el-collapse-item name="8">
                <template slot="title">
                  <b-col sm="12">
                    <!-- 8. 누출 및 폭발·화재 사고시 대처방법 -->
                    <y-label
                      label="L0000000093"
                      color-class="cutstom-title-color"
                    />
                  </b-col>
                </template>
                <b-card>
                  <b-row>
                    <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
                      <!-- 누출 -->
                      <y-textarea
                        :width="12"
                        :disabled="popupParam.viewMode"
                        :editable="editable"
                        ui="bootstrap"
                        label="L0000000855"
                        name="leakHandleDesc"
                        v-model="popupParam.msds.leakHandleDesc"
                      ></y-textarea>
                    </b-col>
                    <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
                      <!-- 폭발 -->
                      <y-textarea
                        :width="12"
                        :disabled="popupParam.viewMode"
                        :editable="editable"
                        ui="bootstrap"
                        label="L0000003143"
                        name="explHandleDesc"
                        v-model="popupParam.msds.explHandleDesc"
                      ></y-textarea>
                    </b-col>
                    <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
                      <!-- 화재 -->
                      <y-textarea
                        :width="12"
                        :disabled="popupParam.viewMode"
                        :editable="editable"
                        ui="bootstrap"
                        label="L0000003272"
                        name="fireHandleDesc"
                        v-model="popupParam.msds.fireHandleDesc"
                      ></y-textarea>
                    </b-col>
                  </b-row>
                </b-card>
              </el-collapse-item>
            </b-col>

            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12 mt-2">
              <el-collapse-item name="9">
                <template slot="title">
                  <b-col sm="12">
                    <!-- 9. 법적 규제현황 -->
                    <y-label
                      label="L0000000094"
                      color-class="cutstom-title-color"
                    />
                  </b-col>
                </template>
                <b-card>
                  <b-row>
                    <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
                      <!-- 노출기준 -->
                      <y-textarea
                        :width="12"
                        :disabled="popupParam.viewMode"
                        :editable="editable"
                        ui="bootstrap"
                        label="L0000000845"
                        name="lawExpoStndDesc"
                        v-model="popupParam.msds.lawExpoStndDesc"
                      ></y-textarea>
                    </b-col>
                    <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
                      <!-- 특수건강진단주기 -->
                      <y-textarea
                        :width="12"
                        :disabled="popupParam.viewMode"
                        :editable="editable"
                        ui="bootstrap"
                        label="L0000003015"
                        name="lawSphkPerDesc"
                        v-model="popupParam.msds.lawSphkPerDesc"
                      ></y-textarea>
                    </b-col>
                    <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
                      <!-- 작업환경측정 주기 -->
                      <y-textarea
                        :width="12"
                        :disabled="popupParam.viewMode"
                        :editable="editable"
                        ui="bootstrap"
                        label="L0000002440"
                        name="lawWkenMeasDesc"
                        v-model="popupParam.msds.lawWkenMeasDesc"
                      ></y-textarea>
                    </b-col>
                    <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
                      <!-- 산업안전 보건법 -->
                      <y-textarea
                        :width="12"
                        :disabled="popupParam.viewMode"
                        :editable="editable"
                        ui="bootstrap"
                        label="L0000001498"
                        name="lawIndSafDesc"
                        v-model="popupParam.msds.lawIndSafDesc"
                      ></y-textarea>
                    </b-col>
                    <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
                      <!-- 화학물질관리법에 의한 규제 -->
                      <y-textarea
                        :width="12"
                        :disabled="popupParam.viewMode"
                        :editable="editable"
                        ui="bootstrap"
                        label="L0000003296"
                        name="lawChemMgrDesc"
                        v-model="popupParam.msds.lawChemMgrDesc"
                      ></y-textarea>
                    </b-col>
                    <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
                      <!-- 위험물안전관리법에 의한 규제 -->
                      <y-textarea
                        :width="12"
                        :disabled="popupParam.viewMode"
                        :editable="editable"
                        ui="bootstrap"
                        label="L0000002140"
                        name="lawDngrMgrDesc"
                        v-model="popupParam.msds.lawDngrMgrDesc"
                      ></y-textarea>
                    </b-col>
                  </b-row>
                </b-card>
              </el-collapse-item>
            </b-col>

            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12 mt-2">
              <el-collapse-item name="10">
                <template slot="title">
                  <b-col sm="12">
                    <!-- 10. 취급시 주의사항 -->
                    <y-label
                      label="L0000000095"
                      color-class="cutstom-title-color"
                    />
                  </b-col>
                </template>
                <b-card>
                  <b-row>
                    <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
                      <y-textarea
                        :width="12"
                        :disabled="popupParam.viewMode"
                        :editable="editable"
                        ui="bootstrap"
                        name="handleCareDesc"
                        v-model="popupParam.msds.handleCareDesc"
                      ></y-textarea>
                    </b-col>
                    <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
                      <!-- ※ 기타 중독사례 -->
                      <y-textarea
                        :width="12"
                        :disabled="popupParam.viewMode"
                        :editable="editable"
                        ui="bootstrap"
                        label="L0000000795"
                        name="etcPoisonCase"
                        v-model="popupParam.msds.etcPoisonCase"
                      ></y-textarea>
                    </b-col>
                  </b-row>
                </b-card>
              </el-collapse-item>
            </b-col>

            <b-col
              sm="12"
              md="12"
              lg="12"
              xl="12"
              class="col-xxl-12 mt-2"
              v-show="false"
            >
              <el-collapse-item name="11">
                <template slot="title">
                  <b-col sm="12">
                    <!-- 11. 공정관리요령 -->
                    <y-label
                      label="L0000003834"
                      color-class="cutstom-title-color"
                    />
                  </b-col>
                </template>
                <b-card>
                  <b-row>
                    <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
                      <!-- 적절한 보호구 -->
                      <y-textarea
                        :width="12"
                        :disabled="popupParam.viewMode"
                        :editable="editable"
                        ui="bootstrap"
                        label="L0000002490"
                        name="safetyEquipDesc"
                        v-model="popupParam.msds.safetyEquipDesc"
                      ></y-textarea>
                    </b-col>
                    <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
                      <!-- 기타 -->
                      <y-textarea
                        :width="12"
                        :disabled="popupParam.viewMode"
                        :editable="editable"
                        ui="bootstrap"
                        label="L0000000794"
                        name="etc"
                        v-model="popupParam.msds.etc"
                      ></y-textarea>
                    </b-col>
                  </b-row>
                </b-card>
              </el-collapse-item>
            </b-col>
          </el-collapse>
        </b-row>
        <div slot="buttonGroup" class="float-right mt-1">
          <!-- 적용 -->
          <y-btn
            v-if="!popupParam.viewMode && editable"
            title="L0000002482"
            color="orange"
            @btnClicked="accept"
          />
          <!-- 닫기 -->
          <y-btn title="L0000000881" @btnClicked="closePopup('C')" />
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
export default {
  name: 'msds-summery-edit',
  props: {
    popupParam: {
      type: Object,
      default: {
        msds: {
          chemProdNo: 0,
          chemProdNmKr: '',
          chemProdNmEn: '',
          property: '',
          propertyNm: '',
          moleWeight: '',
          boilpoint: '',
          meltingPnt: '',
          flashingPnt: '',
          usageCd: '',
          usageNm: '',
          specificGravity: '', // 비중
          msdsPicGraphs: [],
          autoInsYn: '',
          autoInsYnNm: '',
          hazDangerDesc: '',
          preventActDesc: '', // 예방조치문구추가
          signalDesc: '', // 신호어추가
          fstAidEyeDesc: '',
          fstAidSkinDesc: '',
          fstAidBreathDesc: '',
          fstAidEatDesc: '',
          strgMthdDesc: '',
          evasCondDesc: '',
          evasMatDesc: '',
          leakHandleDesc: '',
          explHandleDesc: '',
          fireHandleDesc: '',
          lawExpoStndDesc: '',
          lawSphkPerDesc: '',
          lawWkenMeasDesc: '',
          lawIndSafDesc: '',
          lawChemMgrDesc: '',
          lawDngrMgrDesc: '',
          handleCareDesc: '',
          safetyEquipDesc: '', // 공정관리요령-적절한 보호구 추가
          etc: '', // 공정관리요령-기타
          etcPoisonCase: '', // 기타중독사례
        },
        viewMode: false,
      },
    },
  },
  data() {
    return {
      folderTitle: 'L0000003043', // '펼쳐보기',
      activeName: [],
      tempData: null,

      YAuiGrid: null,
      gridOptions: {
        header: [],
        data: [],
        height: '300',
      },
      gridOptionsX: {
        header: [],
      },
      msdsPictures: [],
      editable: false,
      searchUrl: '',
      searchChemprodChemUrl: '',
    };
  },
  computed: {
    publicPath: function () {
      return process.env.PUBLIC_PATH;
    },
  },
  watch: {
    'msds.chemProdNo': function (newValue, oldValue) {
      if (newValue !== 0) this.getDataList();
    },
    activeName: function (newValue, oldValue) {
      if ((newValue || null) !== null) {
        if (newValue.includes('2')) this.resizeGrid();
      }
    },
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.getDataList(); // 구성물질 grid
  },
  beforeDestroy() {},
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      // URL 셋팅
      this.searchChemprodChemUrl = selectConfig.chm.chemprodChem.list.url;
      this.editable = this.$route.meta.editable;

      // 구성성분 grid 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000102'),
          dataField: 'casNo',
          width: '13%',
        }, // CAS No.
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003304'),
          dataField: 'chemNmKr',
          width: '25%',
          style: 'left-align',
        }, // 화학물질명(국문)
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003305'),
          dataField: 'chemNmEn',
          width: '25%',
          style: 'left-align',
        }, // 화학물질명(영문)
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003177'),
          dataField: 'limitHigh',
          width: '10%',
          style: 'right-align',
        }, // 함유량상한(%)
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003178'),
          dataField: 'limitLow',
          width: '10%',
          style: 'right-align',
        }, // 함유량하한(%)
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003176'),
          dataField: 'limitRepval',
          width: '10%',
          style: 'right-align',
        }, // 함유량대표값(%)
      ];
      this.gridOptionsX.header = [
        // CAS No.
        { text: 'L0000000102', name: 'casNo', width: '130px', align: 'center' },
        // 화학물질명(국문)
        {
          text: 'L0000003304',
          name: 'chemNmKr',
          width: '150px',
          align: 'left',
        },
        // 화학물질명(영문)
        {
          text: 'L0000003305',
          name: 'chemNmEn',
          width: '150px',
          align: 'left',
        },
        // 함유량상한(%)
        {
          text: 'L0000003177',
          name: 'limitHigh',
          width: '130px',
          align: 'right',
        },
        // 함유량하한(%)
        {
          text: 'L0000003178',
          name: 'limitLow',
          width: '130px',
          align: 'right',
        },
        // 함유량대표값(%)
        {
          text: 'L0000003176',
          name: 'limitRepval',
          width: '140px',
          align: 'right',
        },
      ];
      this.tempData = this.$_.clone(this.popupParam.msds);

      this.$comm.getComboItems('CHM_GHS_PIC').then((_result) => {
        this.msdsPictures = _result;
      });
    },
    // 구성성분 grid
    getDataList() {
      if (
        !this.popupParam.msds.chemProdNo ||
        this.popupParam.msds.chemProdNo === 0
      ) {
        return;
      }
      this.$http.url = this.searchChemprodChemUrl;
      this.$http.type = 'GET';
      this.$http.param = {
        chemProdNo: this.popupParam.msds.chemProdNo,
        searchFlag: 'true',
      };
      this.$http.request(
        (_result) => {
          this.gridOptions.data = _result.data;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    accept() {
      this.closePopup(this.popupParam.msds);
    },
    /**
     *  팝업 안 보이도록 closePopup emit
     *  팝업 close
     * data : 팝업창에서 return하는 데이터
     */
    closePopup(data) {
      if (data === 'C') {
        this.popupParam.msds.msdsPicGraphs = this.$_.clone(
          this.tempData.msdsPicGraphs
        );
        this.popupParam.msds.autoInsYn = this.$_.clone(this.tempData.autoInsYn);
        this.popupParam.msds.autoInsYnNm = this.$_.clone(
          this.tempData.autoInsYnNm
        );
        this.popupParam.msds.hazDangerDesc = this.$_.clone(
          this.tempData.hazDangerDesc
        );
        this.popupParam.msds.hazDangerDesc = this.$_.clone(
          this.tempData.hazDangerDesc
        );
        this.popupParam.msds.preventActDesc = this.$_.clone(
          this.tempData.preventActDesc
        );
        this.popupParam.msds.signalDesc = this.$_.clone(
          this.tempData.signalDesc
        );
        this.popupParam.msds.fstAidSkinDesc = this.$_.clone(
          this.tempData.fstAidSkinDesc
        );
        this.popupParam.msds.fstAidBreathDesc = this.$_.clone(
          this.tempData.fstAidBreathDesc
        );
        this.popupParam.msds.fstAidEatDesc = this.$_.clone(
          this.tempData.fstAidEatDesc
        );
        this.popupParam.msds.strgMthdDesc = this.$_.clone(
          this.tempData.strgMthdDesc
        );
        this.popupParam.msds.evasCondDesc = this.$_.clone(
          this.tempData.evasCondDesc
        );
        this.popupParam.msds.evasMatDesc = this.$_.clone(
          this.tempData.evasMatDesc
        );
        this.popupParam.msds.leakHandleDesc = this.$_.clone(
          this.tempData.leakHandleDesc
        );
        this.popupParam.msds.explHandleDesc = this.$_.clone(
          this.tempData.explHandleDesc
        );
        this.popupParam.msds.fireHandleDesc = this.$_.clone(
          this.tempData.fireHandleDesc
        );
        this.popupParam.msds.lawExpoStndDesc = this.$_.clone(
          this.tempData.lawExpoStndDesc
        );
        this.popupParam.msds.lawSphkPerDesc = this.$_.clone(
          this.tempData.lawSphkPerDesc
        );
        this.popupParam.msds.lawWkenMeasDesc = this.$_.clone(
          this.tempData.lawWkenMeasDesc
        );
        this.popupParam.msds.lawIndSafDesc = this.$_.clone(
          this.tempData.lawIndSafDesc
        );
        this.popupParam.msds.lawChemMgrDesc = this.$_.clone(
          this.tempData.lawChemMgrDesc
        );
        this.popupParam.msds.lawDngrMgrDesc = this.$_.clone(
          this.tempData.lawDngrMgrDesc
        );
        this.popupParam.msds.handleCareDesc = this.$_.clone(
          this.tempData.handleCareDesc
        );
        this.popupParam.msds.safetyEquipDesc = this.$_.clone(
          this.tempData.safetyEquipDesc
        );
        this.popupParam.msds.etc = this.$_.clone(this.tempData.etc);
        this.popupParam.msds.etcPoisonCase = this.$_.clone(
          this.tempData.etcPoisonCase
        );
      }
      this.$emit('closePopup', {});
    },
    getSrc(msdsPicture) {
      return (
        '/src/assets/images/' +
        this.msdsPictures[
          this.$_.findIndex(this.msdsPictures, { code: msdsPicture })
        ].codeNm
      );
    },
    folder() {
      if (this.folderTitle === 'L0000003043') {
        // '펼쳐보기',
        this.folderTitle = 'L0000001021'; // '모두접기';
        this.activeName = [];
        for (let i = 1; i <= 11; i++) {
          this.activeName.push(i.toString());
        }
      } else {
        this.folderTitle = 'L0000003043'; // '펼쳐보기',
        this.activeName = [];
      }
    },
    resizeGrid() {
      this.YAuiGrid.resize(null, this.gridOptions.height);
    },
  },
};
</script>
