<template>
  <div>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="80%"
      class="step-dialog"
      @close="close"
      id="stepDialog"
    >
      <div>
        <el-card class="box-card">
          <el-form
            :inline="true"
            :model="stepDetail"
            size="mini"
            :rules="rules"
            hide-required-asterisk
            ref="stepDetail"
          >
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="步骤名称:" prop="stepName">
                  <el-input
                    type="input"
                    placeholder="必填项:请输入内容"
                    v-model="stepDetail.stepName"
                    clearable
                  >
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="所属业务:" prop="stepPageId">
                  <el-select
                    v-model="stepDetail.stepPageId"
                    placeholder="请选择"
                    clearable
                    filterable
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
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="步骤类型:" prop="stepType">
                  <el-select
                    v-model="stepDetail.stepType"
                    placeholder="必填项:请选择"
                    clearable
                    filterable
                    @change="changeStepType(stepDetail.stepType)"
                  >
                    <el-option
                      v-for="item in stepTypeList"
                      :key="item.index"
                      :label="item.label"
                      :value="item.value"
                    >
                      <span style="float: left">{{ item.label }}</span>
                      <span
                        style="float: right; color: #8492a6; font-size: 13px"
                        >{{ item.value }}</span
                      >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="元素归属:" prop="pageId">
                  <el-select
                    v-model="stepDetail.pageId"
                    placeholder="请选择"
                    clearable
                    filterable
                    :disabled="!needPage"
                    @change="changeForPage(stepDetail.pageId)"
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
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="所属元素:" prop="elementId">
                  <el-select
                    v-model="stepDetail.elementId"
                    placeholder="请选择元素"
                    clearable
                    filterable
                    :disabled="!needElement"
                    @focus="checkPage"
                  >
                    <el-option
                      v-for="item in elementList"
                      :key="item.id"
                      :label="'「' + item.id + '」' + item.elementName"
                      :value="item.id.toString()"
                    >
                    </el-option>
                  </el-select>
                  <el-button
                    @click="editElement(stepDetail.elementId)"
                    type="text"
                    icon="el-icon-edit"
                    v-if="
                      (stepDetail.stepType === 'findElement' ||
                        stepDetail.stepType === 'waitElement' ||
                        stepDetail.stepType === 'waitIframe') &&
                        stepDetail.elementId !== '' &&
                        stepDetail.pageId != ''
                    "
                  ></el-button>
                  <el-button
                    @click="addElement()"
                    type="text"
                    icon="el-icon-plus"
                    v-if="
                      (stepDetail.stepType === 'findElement' ||
                        stepDetail.stepType === 'waitElement' ||
                        stepDetail.stepType === 'waitIframe') &&
                        stepDetail.pageId != ''
                    "
                  ></el-button>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="操作类型:" prop="action">
                  <el-select
                    v-model="stepDetail.action"
                    filterable
                    placeholder="选择操作类型"
                    clearable
                    :disabled="!needAction"
                    @change="changeAction"
                  >
                    <el-option
                      v-for="item in actionList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                      <span style="float: left">{{ item.label }}</span>
                      <span
                        style="float: right; color: #8492a6; font-size: 13px"
                        >{{ item.value }}</span
                      >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="前端脚本:">
                  <el-input
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 4 }"
                    placeholder="请输入内容"
                    v-model="stepDetail.function"
                    clearable
                  >
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="随操作值:" prop="actionValue">
                  <el-input
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 4 }"
                    placeholder="请输入内容"
                    v-model="stepDetail.actionValue"
                    :disabled="
                      actionParamMap[stepDetail.action] &&
                      stepDetail.action != 'getText'
                        ? false
                        : true
                    "
                    clearable
                  >
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="校验类型:">
                  <el-select
                    v-model="stepDetail.verifyAction"
                    filterable
                    placeholder="选择校验类型"
                    clearable
                    :disabled="!needVerify"
                    @change="changeVerifyAction"
                  >
                    <el-option
                      v-for="item in verifyList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                      :disabled="item.disabled"
                    >
                      <span style="float: left">{{ item.label }}</span>
                      <span
                        style="float: right; color: #8492a6; font-size: 13px"
                        >{{ item.value }}</span
                      >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="是否启用:" prop="status">
                  <el-select
                    v-model="stepDetail.status"
                    filterable
                    placeholder="请选择"
                    clearable
                  >
                    <el-option
                      v-for="item in statusList"
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
              <el-col :span="12">
                <el-form-item label="随校验值:" prop="verifyValue">
                  <el-input
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 4 }"
                    placeholder="请输入内容"
                    v-model="stepDetail.verifyValue"
                    :disabled="!verifyMap[stepDetail.verifyAction]"
                    clearable
                  >
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="保存参数:">
                  <el-input
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 4 }"
                    placeholder="请输入内容"
                    v-model="stepDetail.paramKey"
                    clearable
                    :disabled="actionParamMap[stepDetail.action] ? false : true"
                  >
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="显式等待:">
                  <el-select
                    v-model="stepDetail.waitAction"
                    filterable
                    placeholder="选择等待类型"
                    clearable
                    :disabled="!needWait"
                    @change="changeWaitAction"
                  >
                    <el-option
                      v-for="item in waitList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                      <span style="float: left">{{ item.label }}</span>
                      <span
                        style="float: right; color: #8492a6; font-size: 13px"
                        >{{ item.value }}</span
                      >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="等待的值:" prop="waitValue">
                  <el-input
                    type="input"
                    placeholder="请输入内容"
                    v-model="stepDetail.waitValue"
                    clearable
                    :disabled="waitMap[stepDetail.waitAction] ? false : true"
                  >
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-card>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" type="info" @click="close">取 消</el-button>
        <el-button size="mini" type="primary" @click="saveStep">
          {{ btnText }}
        </el-button>
      </span>
    </el-dialog>
    <element-dialog
      v-if="elementDialogVisible"
      :visible="elementDialogVisible"
      :element-id="elementId"
      :type="elementDialogVisibleType"
      @listenToChildEvent="callbackFunc"
    ></element-dialog>
  </div>
</template>

<script>
import ElementDialog from './ElementDialog.vue';

export default {
  name: 'StepDialog',

  components: {
    elementDialog: ElementDialog
  },
  props: {
    stepId: {
      type: Number,
      default: null
    },
    type: {
      type: Number,
      default: 1 // 1 新增 2 编辑 3 新增
    },
    visible: {
      type: Boolean,
      default: true
    }
  },
  data() {
    // 校验业务
    let validatePage = (rule, value, callback) => {
      switch (this.stepDetail.stepType) {
        case 'findElement':
        case 'waitElement':
        case 'waitIframe':
          if (value === '') {
            callback(new Error('元素归属不能为空'));
          } else {
            callback();
          }
          break;
        default:
          callback();
          break;
      }
    };
    // 校验元素
    let validateElement = (rule, value, callback) => {
      switch (this.stepDetail.stepType) {
        case 'findElement':
        case 'waitElement':
        case 'waitIframe':
          if (value === '') {
            callback(new Error('所属元素不能为空'));
          } else {
            callback();
          }
          break;
        default:
          callback();
          break;
      }
    };
    // 校验显式等待的值
    let validateWaitValue = (rule, value, callback) => {
      switch (this.stepDetail.stepType) {
        case 'waitElement':
          const waitElementList = [
            'textToBePresentInElementLocated',
            'textToBePresentInElementValue'
          ];
          if (
            this.stepDetail.waitAction !== '' &&
            waitElementList.indexOf(this.stepDetail.waitAction) !== -1 &&
            value === ''
          ) {
            callback(new Error('请输入显式等待的值'));
          } else {
            callback();
          }
          break;
        case 'onlyWait':
          const onlyWaitList = [
            'alertIsPresent',
            'titleIs',
            'titleContains',
            'urlToBe',
            'urlContains'
          ];
          if (
            this.stepDetail.waitAction !== '' &&
            onlyWaitList.indexOf(this.stepDetail.waitAction) !== -1 &&
            value === ''
          ) {
            callback(new Error('请输入显式等待的值'));
          } else {
            callback();
          }
          break;
        case 'waitIframe':
          const waitIframeList = ['frameToBeAvailableAndSwitchToIt'];
          if (
            this.stepDetail.waitAction !== '' &&
            waitIframeList.indexOf(this.stepDetail.waitAction) !== -1 &&
            value === ''
          ) {
            callback(new Error('请输入显式等待的值'));
          } else {
            callback();
          }
          break;
        default:
          callback();
          break;
      }
    };
    // 校验操作类型
    let validateAction = (rule, value, callback) => {
      switch (this.stepDetail.stepType) {
        case 'openBrowser':
        case 'findElement':
          if (value === '') {
            callback(new Error('操作类型不能为空'));
          } else {
            callback();
          }
          break;
        default:
          callback();
          break;
      }
    };
    // 校验操作的值
    let validateActionValue = (rule, value, callback) => {
      switch (this.stepDetail.stepType) {
        case 'openBrowser':
          const openBrowserActionList = ['openBrowser'];
          if (
            this.stepDetail.action !== '' &&
            openBrowserActionList.indexOf(this.stepDetail.action) !== -1 &&
            value === ''
          ) {
            callback(new Error('请输入随操作值'));
          } else {
            callback();
          }
          break;
        case 'findElement':
          const findElementActionList = ['sendKeys', 'upload', 'drag'];
          if (
            this.stepDetail.action !== '' &&
            findElementActionList.indexOf(this.stepDetail.action) !== -1 &&
            value === ''
          ) {
            callback(new Error('请输入随操作值'));
          } else {
            callback();
          }
          break;
        default:
          callback();
          break;
      }
    };
    // 检查校验类型的值
    let validateVerifyValue = (rule, value, callback) => {
      const needValueVerifyList = [
        'assertContains',
        'assertTitle',
        'assertText',
        'assertLocation',
        'assertValue'
      ];
      switch (this.stepDetail.stepType) {
        case 'openBrowser':
          if (this.stepDetail.verifyAction !== '' && value === '') {
            callback(new Error('请输入随校验值'));
          } else {
            callback();
          }
          break;
        case 'findElement':
          if (
            this.stepDetail.verifyAction !== '' &&
            needValueVerifyList.indexOf(this.stepDetail.verifyAction) !== -1 &&
            value === ''
          ) {
            callback(new Error('请输入随校验值'));
          } else {
            callback();
          }
          break;
        default:
          callback();
          break;
      }
    };
    return {
      elementDialogVisible: false,
      elementId: null,
      elementDialogVisibleType: 1,
      noticeVisible: false,
      dialogVisible: true,
      rules: {
        stepName: [
          { required: true, message: '请输入步骤名称', trigger: 'blur' },
          { required: true, message: '请输入步骤名称', trigger: 'change' }
        ],
        stepType: [
          { required: true, message: '请选择步骤类型', trigger: 'blur' },
          { required: true, message: '请选择步骤类型', trigger: 'change' }
        ],
        stepPageId: [
          { required: true, message: '请选择所属业务', trigger: 'blur' },
          { required: true, message: '请选择所属业务', trigger: 'change' }
        ],
        pageId: [
          { validator: validatePage, trigger: 'change' },
          { validator: validatePage, trigger: 'blur' }
        ],
        elementId: [
          { validator: validateElement, trigger: 'change' },
          { validator: validateElement, trigger: 'blur' }
        ],
        action: [
          { validator: validateAction, trigger: 'change' },
          { validator: validateAction, trigger: 'blur' }
        ],
        actionValue: [
          { validator: validateActionValue, trigger: 'change' },
          { validator: validateActionValue, trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择步骤状态', trigger: 'change' },
          { required: true, message: '请选择步骤状态', trigger: 'blur' }
        ],
        verifyValue: [
          { validator: validateVerifyValue, trigger: 'change' },
          { validator: validateVerifyValue, trigger: 'blur' }
        ],
        waitValue: [
          { validator: validateWaitValue, trigger: 'blur' },
          { validator: validateWaitValue, trigger: 'change' }
        ]
      },
      stepDetail: {
        stepType: '',
        stepName: '',
        stepPageId: '',
        pageId: '',
        elementId: '',
        action: '',
        actionValue: '',
        function: '',
        status: '',
        verifyAction: '',
        verifyValue: '',
        paramKey: '',
        waitAction: '',
        waitValue: ''
      },
      stepTypeList: [],
      needPage: false,
      needElement: false,
      needAction: false,
      needVerify: false,
      needWait: false,
      waitList: [],
      waitMap: {},
      actionList: [],
      actionParamMap: {},
      pageList: [],
      verifyList: [],
      verifyMap: {},
      statusList: [],
      statusMap: {},
      elementList: []
    };
  },
  methods: {
    // 新增元素
    addElement() {
      this.elementDialogVisibleType = 1;
      this.elementDialogVisible = true;
      this.elementId = null;
    },
    // 编辑元素
    editElement() {
      this.elementDialogVisibleType = 2;
      this.elementDialogVisible = true;
      this.elementId = Number(this.stepDetail.elementId);
    },
    callbackFunc() {
      this.elementDialogVisible = false;
      if (this.elementDialogVisibleType === 1) {
        this.changeForPage(this.stepDetail.pageId);
        if (!isNaN(this.elementId)) {
          this.detail();
        }
      } else if (this.elementDialogVisibleType === 2) {
        this.changeForPage(this.stepDetail.pageId);
        this.detail();
      }
    },
    // 校验需要元素时是否选择了业务
    checkPage() {
      if (
        this.stepDetail.stepType === 'findElement' ||
        this.stepDetail.stepType === 'waitElement' ||
        this.stepDetail.stepType === 'waitIframe'
      ) {
        if (this.stepDetail.pageId === '') {
          this.$refs.stepDetail.validateField('pageId');
        }
      }
    },
    // 校验类型变化时
    changeVerifyAction() {
      this.stepDetail.verifyValue = '';
      this.$refs.stepDetail.validateField('verifyValue');
    },
    // 操作变化时
    changeAction() {
      this.stepDetail.actionValue = '';
      this.stepDetail.paramKey = '';
      this.$refs.stepDetail.validateField('actionValue');
    },
    // 显式等待变化时
    changeWaitAction() {
      this.stepDetail.waitValue = '';
      this.$refs.stepDetail.validateField('waitValue');
    },
    // 步骤类型变化时
    changeStepType(stepType) {
      this.$refs.stepDetail.clearValidate();

      this.initForm();
      let url = String.format(
        '{0}/step/getConditionByStepType?stepType={1}',
        this.GLOBAL.WEBUI_URL,
        stepType
      );
      this.axios
        .get(url)
        .then(response => {
          this.needPage = response.data.data.needPage;
          this.needElement = response.data.data.needElement;
          this.needAction = response.data.data.needAction;
          this.needVerify = response.data.data.needVerify;
          this.needWait = response.data.data.needWait;
          this.waitList = response.data.data.waitList;
          this.waitMap = response.data.data.waitMap;
          this.actionList = response.data.data.actionList;
          this.actionParamMap = response.data.data.actionParamMap;
          this.verifyList = response.data.data.verifyList;
          this.verifyMap = response.data.data.verifyMap;

          return response;
        })
        .catch(response => {
          return response;
        });
    },
    // 新增、编辑、复制步骤
    saveStep() {
      this.$refs['stepDetail'].validate(valid => {
        if (valid) {
          let url = String.format(
            this.type === 2 ? '{0}/step/update' : '{0}/step/add',
            this.GLOBAL.WEBUI_URL
          );
          // 指定参数格式
          let config = {
            headers: {
              'Content-Type': 'application/json;charset=UTF-8'
            }
          };
          this.axios
            .post(url, JSON.stringify(this.stepDetail), config)
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
        } else {
        }
      });
    },
    // 初始化form
    initForm() {
      this.stepDetail.pageId = '';
      this.stepDetail.elementId = '';
      this.stepDetail.action = '';
      this.stepDetail.actionValue = '';
      this.stepDetail.verifyAction = '';
      this.stepDetail.verifyValue = '';
      this.stepDetail.paramKey = '';
      this.stepDetail.waitAction = '';
      this.stepDetail.waitValue = '';
      this.needPage = false;
      this.needElement = false;
      this.needAction = false;
      this.needVerify = false;
      this.needWait = false;
      this.waitList = [];
      this.waitMap = {};
      this.actionList = [];
      this.actionParamMap = {};
      this.verifyList = [];
      this.verifyMap = {};
      this.elementList = [];
    },
    // 页面变化时
    changeForPage(pageId) {
      this.stepDetail.elementId = '';
      this.elementList = [];
      let url = String.format(
        '{0}//element/getElementByPageId?pageId={1}',
        this.GLOBAL.WEBUI_URL,
        pageId
      );
      this.axios
        .get(url)
        .then(response => {
          this.elementList = response.data.data;
          return response;
        })
        .catch(response => {
          return response;
        });
    },
    // 关闭dialog弹框
    close() {
      this.$emit('listenToChildEvent', false);
    },
    // 获取查询条件
    getConditions() {
      let url = String.format(
        '{0}/step/getSearchCondition',
        this.GLOBAL.WEBUI_URL
      );
      this.axios
        .get(url)
        .then(response => {
          this.pageList = response.data.data.pageList;
          this.statusList = response.data.data.statusList;
          this.statusMap = response.data.data.statusMap;
          this.stepTypeList = response.data.data.stepTypeList;
          return response;
        })
        .catch(response => {
          return response;
        });
    },
    // 步骤详情
    detail() {
      let url = String.format(
        '{0}/step/getStepDetailById?id={1}',
        this.GLOBAL.WEBUI_URL,
        this.stepId
      );
      this.axios
        .get(url)
        .then(response => {
          this.stepDetail = response.data.data.step;
          this.elementList = response.data.data.elementList;
          this.needPage = response.data.data.needPage;
          this.needElement = response.data.data.needElement;
          this.needAction = response.data.data.needAction;
          this.needVerify = response.data.data.needVerify;
          this.needWait = response.data.data.needWait;
          this.waitList = response.data.data.waitList;
          this.waitMap = response.data.data.waitMap;
          this.actionList = response.data.data.actionList;
          this.actionParamMap = response.data.data.actionParamMap;
          this.verifyList = response.data.data.verifyList;
          this.verifyMap = response.data.data.verifyMap;
          this.getConditions();
          return response;
        })
        .catch(response => {
          return response;
        });
    }
  },
  computed: {
    dialogTitle() {
      if (this.type === 2) {
        return '编辑' + '（步骤ID：' + this.stepId + '）';
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
      this.detail();
    }
    // if (this.type === 1) {
    //   this.getConditions();
    // } else if (this.type === 2 || this.type === 3) {
    //   this.init();
    // }
  }
};
</script>

<style scoped>
/deep/ #stepDialog .el-textarea {
  width: 400px !important;
}

/deep/ #stepDialog .normal-300 .el-select {
  width: 300px !important;
}

/deep/ #stepDialog .el-input {
  width: 300px !important;
}
</style>
