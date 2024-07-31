<template>
  <div>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="98%"
      class="uiCase-dialog"
      @close="close"
    >
      <div>
        <el-card
          class="box-card"
          id="uiCaseBase"
          style="background: #f0f9eb"
          shadow="always"
        >
          <div slot="header" class="clearfix">
            <strong>基础信息 </strong>
          </div>
          <el-form
            :inline="true"
            :model="caseDetail"
            :rules="baseRules"
            ref="baseRuleForm"
            size="mini"
            hide-required-asterisk
          >
            <el-row :gutter="20">
              <el-col :span="6">
                <el-form-item label="用例名称:" prop="caseName">
                  <el-input
                    type="input"
                    placeholder="必填项:请输入内容"
                    v-model="caseDetail.caseName"
                    clearable
                    style="width: 200px"
                  >
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="所属业务:" prop="pageId">
                  <el-select
                    v-model="caseDetail.pageId"
                    placeholder="必填项:请选择"
                    clearable
                    filterable
                    style="width: 200px"
                  >
                    <el-option
                      v-for="item in pageList"
                      :key="item.id"
                      :label="'「' + item.id + '」' + item.pageName"
                      :value="item.id"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="页面类型:" prop="pageType">
                  <el-select
                    v-model="caseDetail.pageType"
                    filterable
                    placeholder="选择页面类型"
                    clearable
                    style="width: 120px"
                    @change="changePageType"
                  >
                    <el-option
                      v-for="item in pageTypeList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="手机类型:" prop="phoneType">
                  <el-select
                    v-model="caseDetail.phoneType"
                    filterable
                    placeholder="选择手机类型"
                    clearable
                    :disabled="!(caseDetail.pageType === 'h5')"
                    style="width: 160px"
                  >
                    <el-option
                      v-for="item in phoneTypeList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="6">
                <el-form-item label="浏览器类型:" prop="browserType">
                  <el-select
                    v-model="caseDetail.browserType"
                    filterable
                    placeholder="选择浏览器类型"
                    clearable
                    style="width: 160px"
                  >
                    <el-option
                      v-for="item in browserTypeList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="状态:" prop="canUse">
                  <el-select
                    v-model="caseDetail.canUse"
                    filterable
                    placeholder="选择状态"
                    clearable
                    style="width: 120px"
                  >
                    <el-option
                      v-for="item in canUseList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="等待类型:" prop="waitType">
                  <el-select
                    v-model="caseDetail.waitType"
                    placeholder="选择等待类型"
                    clearable
                    filterable
                    style="width: 120px"
                    @change="changeWaitType"
                  >
                    <el-option
                      v-for="item in waitTypeList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="等待时长:" prop="waitTime">
                  <el-input
                    type="input"
                    placeholder="输入正整数"
                    v-model="caseDetail.waitTime"
                    clearable
                    :disabled="waitTypeMap[caseDetail.waitType] ? false : true"
                    style="width: 120px"
                  >
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="4">
                <el-form-item label="前置操作:" prop="beforeAction">
                  <el-select
                    v-model="caseDetail.beforeAction"
                    filterable
                    placeholder="请选择"
                    clearable
                    style="width: 120px"
                    @change="changeBeforeAction"
                  >
                    <el-option
                      v-for="item in initActionList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="前置参数:" prop="beforeParam">
                  <el-input
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 4 }"
                    placeholder="请输入内容"
                    v-model="caseDetail.beforeParam"
                    clearable
                    :disabled="caseDetail.beforeAction !== 1"
                  >
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="后置操作:" prop="afterAction">
                  <el-select
                    @change="changeAfterAction"
                    v-model="caseDetail.afterAction"
                    placeholder="请选择"
                    clearable
                    filterable
                    style="width: 120px"
                  >
                    <el-option
                      v-for="item in initActionList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="后置参数:" prop="afterParam">
                  <el-input
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 4 }"
                    placeholder="请输入内容"
                    v-model="caseDetail.afterParam"
                    :disabled="caseDetail.afterAction !== 1"
                    clearable
                  >
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-card>
      </div>
      <el-card class="box-card" id="uiCaseStep" shadow="always">
        <div slot="header" class="clearfix">
          <strong>步骤信息</strong>
        </div>
        <div>
          <el-form
            :inline="true"
            :model="addStepForm"
            :rules="addStepFormRules"
            ref="addStepForm"
            class="demo-form-inline"
            hide-required-asterisk
          >
            <el-form-item label="所属业务" prop="pageValue">
              <el-select
                v-model="addStepForm.pageValue"
                filterable
                placeholder="请选择"
                clearable
                size="mini"
                @change="getStepByPageId"
              >
                <el-option
                  v-for="item in pageList"
                  :key="item.id"
                  :label="'「' + item.id + '」' + item.pageName"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="步骤" prop="stepValue">
              <el-select
                v-model="addStepForm.stepValue"
                filterable
                placeholder="请选择"
                clearable
                size="mini"
                value-key="stepId"
                @focus="focusAddStep"
                style="width:250px"
              >
                <el-option
                  v-for="item in addStepList"
                  :key="item.stepId"
                  :label="'「' + item.stepId + '」' + item.stepName"
                  :value="item"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="序号" prop="stepNo">
              <el-input
                type="input"
                size="mini"
                placeholder="请输入正整数"
                v-model="addStepForm.stepNo"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                type="text"
                size="mini"
                @click="insertStepToCase(addStepForm.stepValue)"
                >插入步骤
              </el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="text" size="mini" @click="addStep()"
                >新增步骤
              </el-button>
            </el-form-item>
          </el-form>
        </div>
        <el-table
          :data="stepList"
          border
          size="mimi"
          :cell-style="{ 'text-align': 'center' }"
          :header-cell-style="{ 'text-align': 'center' }"
          :row-class-name="tableRowClassName"
          ref="stepList"
        >
          <el-table-column type="index" fixed="left" width="100px" label="序号">
          </el-table-column>
          <el-table-column
            prop="stepName"
            label="步骤名称"
            width="180"
            :show-overflow-tooltip="true"
            fixed="left"
          >
          </el-table-column>
          <el-table-column
            prop="pageName"
            label="所属业务"
            width="150"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column
            prop="waitAction"
            label="等待类型"
            width="150"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column
            prop="waitValue"
            label="等待值"
            width="150"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column
            prop="action"
            label="操作类型"
            width="150"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column
            prop="actionValue"
            label="操作值"
            width="150"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column
            prop="verifyAction"
            label="校验类型"
            width="150"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column
            prop="verifyValue"
            label="校验值"
            width="150"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column
            prop="paramKey"
            label="保存参数"
            width="150"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column
            prop="function"
            label="前端脚本"
            width="180"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column label="操作" width="180" fixed="right">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="mini"
                @click="stepDetail(stepList[scope.$index].stepId)"
                >编辑
              </el-button>
              <el-button
                type="text"
                size="mini"
                @click="deleteStep(scope.$index)"
                >删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="saveCase"
          >保 存
        </el-button>
        <el-button size="mini" type="info" @click="close">关 闭</el-button>
      </span>
    </el-dialog>
    <step-dialog
      v-if="stepDetailDialog"
      :visible="stepDetailDialog"
      :step-id="stepId"
      :type="dialogVisibleType"
      @listenToChildEvent="callbackFunc"
    ></step-dialog>
  </div>
</template>

<script>
import Sortable from 'sortablejs';
import StepDialog from '../WebUiTestTemplate/StepDialog';

export default {
  name: 'WebUiCaseDialog',
  components: {
    StepDialog: StepDialog
  },
  props: {
    caseId: {
      type: Number,
      default: null
    },
    type: {
      type: Number,
      default: 1 // 1 新增 2 编辑 3 复制
    },
    visible: {
      type: Boolean,
      default: true
    }
  },
  data() {
    let validateNo = (rule, value, callback) => {
      if (!/^[1-9]\d*$/.test(value)) {
        callback(new Error('请输入正整数'));
      } else if (value === '') {
        callback();
      } else if (value < 1) {
        callback(new Error('序号不能小于1'));
      } else if (value > this.stepList.length) {
        callback(new Error('序号不能大于' + this.stepList.length));
      } else {
        callback();
      }
    };
    let validatePhoneType = (rule, value, callback) => {
      if (this.caseDetail.pageType === 'h5' && value === '') {
        callback(new Error('手机类型不能为空'));
      } else {
        callback();
      }
    };
    let validateWaitTime = (rule, value, callback) => {
      if (this.caseDetail.waitType !== '3' && this.caseDetail.waitType !== '') {
        if (value === '') {
          callback(new Error('等待时长不能为空'));
        } else if (!/^[1-9]\d*$/.test(value)) {
          callback(new Error('请输入正整数'));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    // let validateWaitTimeType = (rule, value, callback) => {
    //   if (!/^[1-9]\d*$/.test(value)) {
    //     callback(new Error('请输入正整数'));
    //   } else {
    //     callback();
    //   }
    // };
    let validateBeforeParam = (rule, value, callback) => {
      if (this.caseDetail.beforeAction === 1 && value === '') {
        callback(new Error('前置参数不能为空'));
      } else {
        callback();
      }
    };
    let validateAfterParam = (rule, value, callback) => {
      if (this.caseDetail.afterAction === 1 && value === '') {
        callback(new Error('前置参数不能为空'));
      } else {
        callback();
      }
    };
    return {
      stepId: null,
      stepDetailDialog: false,
      dialogVisibleType: 2,
      addStepForm: { pageValue: '', stepValue: '', stepNo: '' },
      addStepFormRules: {
        pageValue: [
          { required: true, message: '所属业务不能为空', trigger: 'blur' },
          { required: true, message: '所属业务不能为空', trigger: 'change' }
        ],
        stepValue: [
          { required: true, message: '步骤不能为空', trigger: 'blur' },
          { required: true, message: '步骤不能为空', trigger: 'change' }
        ],
        stepNo: [
          { validator: validateNo, trigger: 'blur' },
          { validator: validateNo, trigger: 'change' }
        ]
      },
      addStepList: [],
      stepList: [
        {
          pageName: '',
          stepName: '',
          stepId: '',
          action: '',
          actionValue: '',
          function: '',
          status: '',
          verifyAction: '',
          verifyValue: '',
          paramKey: ''
        }
      ],
      waitTypeList: [],
      waitTypeMap: {},
      waitList: [],
      waitMap: {},
      actionList: [],
      actionParamMap: {},
      pageList: [],
      verifyList: [],
      statusList: [],
      dialogVisible: true,
      baseRules: {
        caseName: [
          { required: true, message: '用例名称不能为空', trigger: 'blur' },
          { required: true, message: '用例名称不能为空', trigger: 'change' }
        ],
        pageId: [
          { required: true, message: '所属业务不能为空', trigger: 'blur' },
          { required: true, message: '所属业务不能为空', trigger: 'change' }
        ],
        pageType: [
          { required: true, message: '页面类型不能为空', trigger: 'blur' },
          { required: true, message: '页面类型不能为空', trigger: 'change' }
        ],
        phoneType: [
          { validator: validatePhoneType, trigger: 'blur' },
          { validator: validatePhoneType, trigger: 'change' }
        ],
        browserType: [
          { required: true, message: '浏览器类型不能为空', trigger: 'blur' },
          { required: true, message: '浏览器类型不能为空', trigger: 'change' }
        ],
        canUse: [
          { required: true, message: '状态不能为空', trigger: 'blur' },
          { required: true, message: '状态不能为空', trigger: 'change' }
        ],
        beforeAction: [
          { required: true, message: '前置操作不能为空', trigger: 'blur' },
          { required: true, message: '前置操作不能为空', trigger: 'change' }
        ],
        beforeParam: [
          { validator: validateBeforeParam, trigger: 'blur' },
          { validator: validateBeforeParam, trigger: 'change' }
        ],
        afterAction: [
          { required: true, message: '后置操作不能为空', trigger: 'blur' },
          { required: true, message: '后置操作不能为空', trigger: 'change' }
        ],
        afterParam: [
          { validator: validateAfterParam, trigger: 'blur' },
          { validator: validateAfterParam, trigger: 'change' }
        ],
        waitType: [
          { required: true, message: '等待类型不能为空', trigger: 'blur' },
          { required: true, message: '等待类型不能为空', trigger: 'change' }
        ],
        waitTime: [
          { validator: validateWaitTime, trigger: 'blur' },
          { validator: validateWaitTime, trigger: 'change' }
        ]
      },
      caseDetail: {
        caseName: '',
        pageId: '',
        pageType: '',
        phoneType: '',
        browserType: '',
        canUse: '',
        beforeAction: '',
        beforeParam: '',
        afterAction: '',
        afterParam: '',
        stepIds: '',
        waitType: '',
        waitTime: ''
      },
      pageTypeList: [],
      phoneTypeList: [],
      browserTypeList: [],
      pageVerifyList: [],
      initActionList: [],
      canUseList: [],
      stepSelect: [],
      verifyMap: {}
    };
  },
  mounted() {
    // table换行
    this.$nextTick(() => {
      const el = this.$refs.stepList.$el.querySelector(
        '.el-table__body-wrapper tbody'
      );
      if (el) {
        Sortable.create(el, {
          selector: 'tr', // 选择整行进行拖拽
          onEnd: evt => {
            const { newIndex, oldIndex } = evt;
            // 交换数组中的元素
            const movedItem = this.stepList.splice(oldIndex, 1)[0];
            this.stepList.splice(newIndex, 0, movedItem);
            console.log(this.stepList);
          }
        });
      }
    });
  },
  methods: {
    changeBeforeAction() {
      this.caseDetail.beforeParam = '';
      this.$refs.baseRuleForm.validateField('beforeParam');
    },
    changeAfterAction() {
      this.caseDetail.afterParam = '';
      this.$refs.baseRuleForm.validateField('afterParam');
    },
    changePageType() {
      this.caseDetail.phoneType = '';
      this.$refs.baseRuleForm.validateField('phoneType');
    },
    changeWaitType() {
      this.caseDetail.waitTime = '';
      this.$refs.baseRuleForm.validateField('waitTime');
    },
    addStep() {
      this.stepDetailDialog = true;
      this.dialogVisibleType = 1;
    },
    // 步骤详情
    stepDetail(id) {
      this.stepId = id;
      this.dialogVisibleType = 2;
      this.stepDetailDialog = true;
    },
    focusAddStep() {
      this.$refs.addStepForm.validateField('pageValue');
    },
    // 插入步骤
    insertStepToCase() {
      this.$refs.addStepForm.validate(valid => {
        if (valid) {
          let index = '';
          if (this.addStepForm.stepNo === '') {
            index = this.stepList.length;
          } else {
            index = this.addStepForm.stepNo - 1;
          }
          this.stepList.splice(index, 0, this.addStepForm.stepValue);
        }
      });
    },
    // 根据业务id获取步骤
    getStepByPageId() {
      this.addStepForm.stepValue = '';
      this.addStepList = [];
      if (this.addStepForm.pageValue !== '') {
        let url = String.format(
          '{0}/step/getStepMapListByPageId?pageId={1}',
          this.GLOBAL.WEBUI_URL,
          this.addStepForm.pageValue
        );
        this.axios
          .get(url)
          .then(response => {
            this.addStepList = response.data.data;

            return response;
          })
          .catch(response => {
            return response;
          });
      }
    },
    deleteStep(index) {
      this.$confirm(
        String.format('确定删除序号为:{0}的步骤, 是否继续?', index + 1),
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        this.stepList.splice(index, 1);
      });
    },
    // 保存用例信息
    saveCase() {
      this.$refs.baseRuleForm.validate(valid => {
        if (valid) {
          let url = String.format(
            this.type === 2 ? '{0}/case/update' : '{0}/case/add',
            this.GLOBAL.WEBUI_URL
          );
          // 指定参数格式
          let config = {
            headers: {
              'Content-Type': 'application/json;charset=UTF-8'
            }
          };
          let stepIds = this.stepList
            .map((obj, index) => {
              return obj.stepId;
            })
            .join(',');
          this.caseDetail.stepIds = stepIds;
          let param = { uiCase: this.caseDetail, stepList: this.stepList };
          this.axios
            .post(url, JSON.stringify(param), config)
            .then(response => {
              let responseCode = response.data.code;
              if (responseCode === '1000') {
                this.Message.success(response.data.msg);
                // 调用父组件的查询方法
                this.$emit('listenToChildEvent', true);
              } else {
                this.Message.error(response.data.msg);
              }
              return response;
            })
            .catch(response => {
              // 调用父组件的查询方法
              // this.$emit('listenToChildEvent', true);
              return response;
            });
        }
      });
    },
    // 关闭dialog弹框
    close() {
      this.$emit('listenToChildEvent', false);
    },

    // 获取查询条件
    getConditions() {
      let url = String.format(
        '{0}/case/getSearchCondition',
        this.GLOBAL.WEBUI_URL
      );
      this.axios
        .get(url)
        .then(response => {
          this.pageList = response.data.data.pageList;
          this.pageTypeList = response.data.data.pageTypeList;
          this.phoneTypeList = response.data.data.phoneTypeList;
          this.browserTypeList = response.data.data.browserTypeList;
          this.canUseList = response.data.data.canUseList;
          this.pageVerifyList = response.data.data.pageVerifyList;
          this.initActionList = response.data.data.initActionList;
          this.waitTypeList = response.data.data.waitTypeList;
          this.waitTypeMap = response.data.data.waitTypeMap;

          return response;
        })
        .catch(response => {
          return response;
        });
    },
    callbackFunc() {
      this.stepDetailDialog = false;
      this.detail();
    },
    // 用例详情
    detail() {
      let url = String.format(
        '{0}/case/getCaseById?id={1}',
        this.GLOBAL.WEBUI_URL,
        this.caseId
      );
      this.axios
        .get(url)
        .then(response => {
          this.caseDetail = response.data.data.caseDetail;
          this.stepList = response.data.data.stepList;
          this.getConditions();
          return response;
        })
        .catch(response => {
          return response;
        });
    },

    // 设置行的颜色
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 === 0) {
        return 'warning-row';
      } else {
        return 'success-row';
      }
    }
  },
  computed: {
    dialogTitle() {
      if (this.type === 2) {
        return '编辑' + '（用例ID：' + this.caseId + '）';
      } else if (this.type === 3) {
        return '复制';
      }
      return '新增';
    },
    btnText() {
      if (this.type === 3) {
        return '复 制';
      }
      return '保 存';
    },
    typeText() {
      if (this.type === 2) {
        return '编辑';
      } else if (this.type === 3) {
        return '复制';
      }
      return '新增';
    }
  },
  created() {
    this.dialogVisible = this.visible;
    if (this.type === 1) {
      this.getConditions();
    } else if (this.type === 2 || this.type === 3) {
      this.detail(false);
    }
  }
};
</script>

<style scoped>
/deep/ .el-textarea {
  width: 300px !important;
}

.el-table >>> .warning-row {
  background: oldlace;
}

.el-table >>> .success-row {
  background: #f0f9eb;
}
</style>
