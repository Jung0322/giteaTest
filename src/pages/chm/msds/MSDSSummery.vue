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
              <!-- 편집 -->
              <y-btn
                v-if="editable"
                title="L0000003042"
                color="orange"
                @btnClicked="openEditPopup"
              />
              <!-- <y-btn title="출력" @btnClicked="print" /> -->
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <!-- 제품명 -->
              <y-label label="L0000002638" />
              <y-label
                :label="
                  msds.chemProdNmEn
                    ? msds.chemProdNmKr + ' (' + msds.chemProdNmEn + ')'
                    : msds.chemProdNmKr
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
      <b-col sm="6" class="mt-2">
        <b-row>
          <el-collapse v-model="activeName1" style="width: 100%">
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
                <b-card style="width: 80%">
                  <b-row>
                    <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
                      <!-- 제품명 :  -->
                      <y-label label="L0000003826" />
                      <y-label
                        :label="
                          msds.chemProdNmEn
                            ? msds.chemProdNmKr + ' (' + msds.chemProdNmEn + ')'
                            : msds.chemProdNmKr
                        "
                        :fieldable="true"
                      />
                    </b-col>
                    <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
                      <!-- 성상 :  -->
                      <y-label label="L0000003827" />
                      <y-label :label="msds.propertyNm" :fieldable="true" />
                    </b-col>
                    <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
                      <!-- 분자량 :  -->
                      <y-label label="L0000003828" />
                      <y-label :label="msds.moleWeight" :fieldable="true" />
                    </b-col>
                    <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
                      <!-- 끓는점 :  -->
                      <y-label label="L0000003829" />
                      <y-label :label="msds.boilpoint" :fieldable="true" />
                    </b-col>
                    <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
                      <!-- 녹는점 :  -->
                      <y-label label="L0000003830" />
                      <y-label :label="msds.meltingPnt" :fieldable="true" />
                    </b-col>
                    <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
                      <!-- 인화점 :  -->
                      <y-label label="L0000003831" />
                      <y-label :label="msds.flashingPnt" :fieldable="true" />
                    </b-col>
                    <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
                      <!-- 주요용도 :  -->
                      <y-label label="L0000003832" />
                      <y-label :label="msds.usageNm" :fieldable="true" />
                    </b-col>
                    <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
                      <!-- 비중 :  -->
                      <y-label label="L0000003833" />
                      <y-label
                        :label="msds.specificGravity"
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
                <!-- <y-data-table
                  ref="dataTable"
                  :iconVisible="false"
                  :height="gridOptions.height"
                  :headers="gridOptions.header"
                  :items="gridOptions.data"
                ></y-data-table> -->
                <y-auigrid
                  ref="yAuiGrid"
                  :name="gridOptions.name"
                  :headers="gridOptions.header"
                  :btns="gridOptions.btns"
                  :height="gridOptions.height"
                  :useExcelExport="false"
                  :showGridSetSave="true"
                  :useContextMenu="true"
                  :enableRightDownFocus="true"
                  :showGridCtrl="true"
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
                      <!-- <el-checkbox-group 
                        v-if="updateMode"
                        v-model="msds.msdsPicGraphs">
                        <el-checkbox v-for="msdsPicture in msdsPictures" :label="msdsPicture.code" :key="msdsPicture.code">
                          <el-image
                            style="width: 70px; height: 70px"
                            :src="'/src/assets/images/' + msdsPicture.codeNm"
                            fit="contain"></el-image>
                        </el-checkbox>
                      </el-checkbox-group>-->
                      <el-image
                        :ref="'image' + index"
                        v-for="(msdsPicture, index) in msds.msdsPicGraphs"
                        :key="msdsPicture + index"
                        style="width: 70px; height: 70px"
                        :src="getSrc(msdsPicture)"
                        fit="contain"
                      ></el-image>
                      <!-- <div
                        v-for="(msdsPicture, index) in msds.msdsPicGraphs"
                        :key="msdsPicture + index"
                      >{{getSrc(msdsPicture)}}</div>-->
                      <!-- :src="'/src/assets/images/' + msdsPicture + '.gif'" -->
                      <!-- :src="getSrc(msdsPicture)" -->
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
                    <!-- <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
                      <y-label :label="msds.hazDangerDesc" :fieldable="true" textAlign="left" />
                    </b-col>-->
                    <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
                      <!-- 신호어 -->
                      <y-text
                        :width="12"
                        :editable="editable"
                        :disabled="true"
                        ui="bootstrap"
                        label="L0000001805"
                        name="signalDesc"
                        v-model="msds.signalDesc"
                      ></y-text>
                    </b-col>
                    <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
                      <!-- 유해·위험문구 -->
                      <y-textarea
                        :width="12"
                        :editable="editable"
                        :disabled="true"
                        ui="bootstrap"
                        label="L0000002164"
                        name="hazDangerDesc"
                        v-model="msds.hazDangerDesc"
                      ></y-textarea>
                    </b-col>
                    <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
                      <!-- 예방조치문구 -->
                      <y-textarea
                        :width="12"
                        :editable="editable"
                        :disabled="true"
                        ui="bootstrap"
                        label="L0000002017"
                        name="preventActDesc"
                        v-model="msds.preventActDesc"
                      ></y-textarea>
                    </b-col>
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
                        :editable="editable"
                        :disabled="true"
                        ui="bootstrap"
                        label="L0000000862"
                        name="fstAidEyeDesc"
                        v-model="msds.fstAidEyeDesc"
                      ></y-textarea>
                    </b-col>
                    <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
                      <!-- 피부에 접촉했을 때 -->
                      <y-textarea
                        :width="12"
                        :editable="editable"
                        :disabled="true"
                        ui="bootstrap"
                        label="L0000003158"
                        name="fstAidSkinDesc"
                        v-model="msds.fstAidSkinDesc"
                      ></y-textarea>
                    </b-col>
                    <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
                      <!-- 흡입했을 때 -->
                      <y-textarea
                        :width="12"
                        :editable="editable"
                        :disabled="true"
                        ui="bootstrap"
                        label="L0000003390"
                        name="fstAidBreathDesc"
                        v-model="msds.fstAidBreathDesc"
                      ></y-textarea>
                    </b-col>
                    <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
                      <!-- 먹었을 때 -->
                      <y-textarea
                        :width="12"
                        :editable="editable"
                        :disabled="true"
                        ui="bootstrap"
                        label="L0000001003"
                        name="fstAidEatDesc"
                        v-model="msds.fstAidEatDesc"
                      ></y-textarea>
                    </b-col>
                  </b-row>
                </b-card>
              </el-collapse-item>
            </b-col>
          </el-collapse>
        </b-row>
      </b-col>
      <b-col sm="6" class="mt-2">
        <b-row>
          <el-collapse v-model="activeName2" style="width: 100%">
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
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
                      <y-label
                        :label="msds.strgMthdDesc"
                        :fieldable="true"
                        textAlign="left"
                      />
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
                        :editable="editable"
                        :disabled="true"
                        ui="bootstrap"
                        label="L0000003161"
                        name="evasCondDesc"
                        v-model="msds.evasCondDesc"
                      ></y-textarea>
                    </b-col>
                    <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
                      <!-- 피해야 할 물질 -->
                      <y-textarea
                        :width="12"
                        :editable="editable"
                        :disabled="true"
                        ui="bootstrap"
                        label="L0000003160"
                        name="evasMatDesc"
                        v-model="msds.evasMatDesc"
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
                        :editable="editable"
                        :disabled="true"
                        ui="bootstrap"
                        label="L0000000855"
                        name="leakHandleDesc"
                        v-model="msds.leakHandleDesc"
                      ></y-textarea>
                    </b-col>
                    <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
                      <!-- 폭발 -->
                      <y-textarea
                        :width="12"
                        :editable="editable"
                        :disabled="true"
                        ui="bootstrap"
                        label="L0000003143"
                        name="explHandleDesc"
                        v-model="msds.explHandleDesc"
                      ></y-textarea>
                    </b-col>
                    <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
                      <!-- 화재 -->
                      <y-textarea
                        :width="12"
                        :editable="editable"
                        :disabled="true"
                        ui="bootstrap"
                        label="L0000003272"
                        name="fireHandleDesc"
                        v-model="msds.fireHandleDesc"
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
                        :editable="editable"
                        :disabled="true"
                        ui="bootstrap"
                        label="L0000000845"
                        name="lawExpoStndDesc"
                        v-model="msds.lawExpoStndDesc"
                      ></y-textarea>
                    </b-col>
                    <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
                      <!-- 특수건강진단주기 -->
                      <y-textarea
                        :width="12"
                        :editable="editable"
                        :disabled="true"
                        ui="bootstrap"
                        label="L0000003015"
                        name="lawSphkPerDesc"
                        v-model="msds.lawSphkPerDesc"
                      ></y-textarea>
                    </b-col>
                    <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
                      <!-- 작업환경측정 주기 -->
                      <y-textarea
                        :width="12"
                        :editable="editable"
                        :disabled="true"
                        ui="bootstrap"
                        label="L0000002440"
                        name="lawWkenMeasDesc"
                        v-model="msds.lawWkenMeasDesc"
                      ></y-textarea>
                    </b-col>
                    <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
                      <!-- 산업안전 보건법 -->
                      <y-textarea
                        :width="12"
                        :editable="editable"
                        :disabled="true"
                        ui="bootstrap"
                        label="L0000001498"
                        name="lawIndSafDesc"
                        v-model="msds.lawIndSafDesc"
                      ></y-textarea>
                    </b-col>
                    <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
                      <!-- 화학물질관리법에 의한 규제 -->
                      <y-textarea
                        :width="12"
                        :editable="editable"
                        :disabled="true"
                        ui="bootstrap"
                        label="L0000003296"
                        name="lawChemMgrDesc"
                        v-model="msds.lawChemMgrDesc"
                      ></y-textarea>
                    </b-col>
                    <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
                      <!-- 위험물안전관리법에 의한 규제 -->
                      <y-textarea
                        :width="12"
                        :editable="editable"
                        :disabled="true"
                        ui="bootstrap"
                        label="L0000002140"
                        name="lawDngrMgrDesc"
                        v-model="msds.lawDngrMgrDesc"
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
                      <y-label
                        :label="msds.handleCareDesc"
                        :fieldable="true"
                        textAlign="left"
                      />
                    </b-col>
                  </b-row>
                </b-card>
                <b-card class="mt-3">
                  <b-row>
                    <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
                      <!-- ※ 기타 중독사례 -->
                      <y-textarea
                        :width="12"
                        :editable="editable"
                        :disabled="true"
                        ui="bootstrap"
                        label="L0000000795"
                        name="etcPoisonCase"
                        v-model="msds.etcPoisonCase"
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
                        :editable="editable"
                        :disabled="true"
                        ui="bootstrap"
                        label="L0000002490"
                        name="safetyEquipDesc"
                        v-model="msds.safetyEquipDesc"
                      ></y-textarea>
                    </b-col>
                    <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
                      <!-- 기타 -->
                      <y-textarea
                        :width="12"
                        :editable="editable"
                        :disabled="true"
                        ui="bootstrap"
                        label="L0000000794"
                        name="etc"
                        v-model="msds.etc"
                      ></y-textarea>
                    </b-col>
                  </b-row>
                </b-card>
              </el-collapse-item>
            </b-col>

            <!-- <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12 mt-2">
            <b-row>
              <b-col sm="12">
                <y-label label="기타. 중독사례" color-class="cutstom-title-color" />
              </b-col>
            </b-row>
            <b-card >
              <b-row>
                <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
                  <y-label label="제품명 : " /><y-label :label="msds.chemProdNmEn ? msds.chemProdNmKr + ' (' + msds.chemProdNmEn + ')' : msds.chemProdNmKr" :fieldable="true" />
                </b-col>
              </b-row>
            </b-card>
            </b-col>-->
          </el-collapse>
        </b-row>
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
export default {
  name: 'msds-summery',
  props: {
    msdsRqstNo: 0,
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
  },
  data() {
    return {
      tempData: null,
      gridOptions: {
        name: 'MSDSSummery',
        header: [],
        data: [],
        height: '300',
      },
      YAuiGrid: null,
      folderTitle: 'L0000003043', // '펼쳐보기',
      activeName1: [],
      activeName2: [],
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '80%',
        top: '50px',
        param: {},
        closeCallback: null,
      },
      msdsPictures: [],
      editable: false,
      searchUrl: '',
      searchChemprodChemUrl: '',
      msdsReportUrl: '',
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
    activeName1: {
      handler: function (newValue, oldValue) {
        if (newValue === '3') {
          let length = this.msds.msdsPicGraphs.length;
          for (let i = 0; i < length; i++) {
            this.$refs['image' + i][0].load();
          }
        }
      },
      deep: true,
    },
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
    window.addEventListener('resize', this.resizeGrid);
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.resizeGrid();
    this.getDataList(); // 구성물질 grid
  },
  beforeDestroy() {},
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      // URL 셋팅
      this.searchUrl = selectConfig.chm.MSDS.list.url;
      this.searchChemprodChemUrl = selectConfig.chm.chemprodChem.list.url;
      this.editable = this.$route.meta.editable;
      this.msdsReportUrl = selectConfig.chm.MSDS.report.url;

      // 구성성분 grid 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000102'),
          dataField: 'casNo',
          width: '20%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003304'),
          dataField: 'chemNmKr',
          width: '20%',
          style: 'left-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003305'),
          dataField: 'chemNmEn',
          width: '20%',
          style: 'left-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003177'),
          dataField: 'limitHigh',
          width: '20%',
          style: 'right-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003178'),
          dataField: 'limitLow',
          width: '20%',
          style: 'right-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003176'),
          dataField: 'limitRepval',
          width: '20%',
          style: 'right-align',
        },
      ];

      // props로 매핑되는 정보보다 combo가 나중에 처리되면서 이미지를 찾을 수 없음.
      this.$comm.getComboItems('CHM_GHS_PIC').then((_result) => {
        this.msdsPictures = _result;
      });
    },
    // MSDS grid
    getMSDS() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          this.gridOptions.data = _result.data;
          this.YAuiGrid.setGridData(_result.data);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    // 구성성분 grid
    getDataList() {
      if (!this.msds.chemProdNo || this.msds.chemProdNo === 0) return;
      this.$http.url = this.searchChemprodChemUrl;
      this.$http.type = 'GET';
      this.$http.param = {
        chemProdNo: this.msds.chemProdNo,
        searchFlag: 'true',
      };
      this.$http.request(
        (_result) => {
          this.gridOptions.data = _result.data;
          this.YAuiGrid.setGridData(_result.data);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    resizeGrid() {
      let _height = window.innerHeight - 695;
      let _width = window.innerWidth - 1050;
      if (window.innerHeight < 500) {
        _height = 250;
      }

      this.YAuiGrid.resize(_width, _height);
    },
    openEditPopup() {
      this.popupOptions.target = () => import(`${'./MSDSSummeryEdit.vue'}`);
      this.popupOptions.title = 'L0000000131'; // 'MSDS요약내용';
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        msds: this.msds,
      };
      this.popupOptions.closeCallback = this.closePopup;
    },
    closePopup() {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
    },
    print() {
      this.$http.url = this.$format(this.msdsReportUrl, this.msdsRqstNo);
      this.$http.type = 'GET';
      this.$http.param = { reportType: 'msdssumm' };
      this.$http.request(
        (_result) => {
          var blob = new Blob([_result.data], { type: 'application/pdf' });
          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob, 'MSDSSummary.pdf');
          } else {
            let link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = 'MSDSSummary.pdf';
            link.click();
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getSrc(msdsPicture) {
      if (this.msdsPictures === null || this.msdsPictures.length === 0) return;
      var root =
        this.msdsPictures[
          this.$_.findIndex(this.msdsPictures, { code: msdsPicture })
        ];
      return this.publicPath + '/src/assets/images/' + root.codeNm;
    },
    folder() {
      if (this.folderTitle === 'L0000003043') {
        // '펼쳐보기',
        this.folderTitle = 'L0000001021'; // '모두접기';
        this.activeName1 = [];
        this.activeName2 = [];
        for (let i = 1; i <= 5; i++) {
          this.activeName1.push(i.toString());
          this.activeName2.push((i + 5).toString());
        }
        this.activeName2.push('11');
      } else {
        this.folderTitle = 'L0000003043'; // '펼쳐보기',
        this.activeName1 = [];
        this.activeName2 = [];
      }
    },
  },
};
</script>
