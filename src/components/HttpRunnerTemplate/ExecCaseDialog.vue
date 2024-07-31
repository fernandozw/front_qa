<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="dialogVisible"
    width="80%"
    class="exec-dialog"
    @close="close"
  >
    <div>
      <el-card class="box-card">
        <el-row :gutter="20">
          <el-col :span="4">
            <span>所属模块: <span style="color:red">*</span></span>
          </el-col>
          <el-col :span="8" :pull="2">
            <el-select
              @change="moduleOnChange('change')"
              v-model="execDetail.module"
              filterable
              placeholder="必填项:请选择"
              clearable
              :disabled="execType === 1 ? true : false"
              size="mini"
            >
              <el-option
                v-for="item in moduleList"
                :key="item.label"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            <span>步骤id: <span style="color:red">*</span></span>
          </el-col>
          <el-col :span="8" :pull="2">
            <el-select
              v-model="execDetail.step_id"
              @focus="checkModule"
              filterable
              placeholder="必填项:请选择"
              clearable
              @change="stepIdChange"
              :multiple="execType === 1 ? false : true"
              :disabled="execType === 1 ? true : false"
              size="mini"
            >
              <el-option
                v-for="item in stepIdList"
                :key="item.label"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled"
              >
              </el-option>
            </el-select>
            <el-tooltip
              class="item"
              effect="dark"
              content="⚠️注意,当执行的步骤超过2个时,全部将会被自动剔除!"
              placement="top"
            >
              <i v-if="execType === 2" class="el-icon-warning"></i>
            </el-tooltip>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="4">
            <span>所属环境: <span style="color:red">*</span></span>
          </el-col>
          <el-col :span="8" :pull="2">
            <el-select
              v-model="execDetail.env"
              filterable
              placeholder="必填项:请选择"
              clearable
              size="mini"
            >
              <el-option
                v-for="item in envList"
                :key="item.label"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            <span>优先级: <span style="color:red">*</span></span>
          </el-col>
          <el-col :span="8" :pull="2">
            <el-select
              v-model="execDetail.level"
              filterable
              placeholder="必填项:请选择"
              clearable
              :disabled="execType === 1 ? true : false"
              size="mini"
            >
              <el-option
                v-for="item in levelList"
                :key="item.label"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="3">
            <span>循环次数:<span style="color:red">*</span></span>
          </el-col>
          <el-col :span="8" :pull="1">
            <el-input
              v-model="execDetail.repeat"
              clearable
              placeholder="必填项:请输入"
            ></el-input>
          </el-col>
          <el-col :span="3" :push="1">
            <span>自定义标签: </span>
          </el-col>
          <el-col :span="8">
            <el-input v-model="execDetail.label" clearable></el-input>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="3">
            <span>inp: </span>
          </el-col>
          <el-col :span="8" :pull="1">
            <el-input v-model="execDetail.inp" clearable></el-input>
          </el-col>
          <el-col :span="3" :push="1">
            <span>workers: </span>
          </el-col>
          <el-col :span="8">
            <el-input v-model="execDetail.workers" clearable></el-input>
          </el-col>
        </el-row>
      </el-card>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close" size="mini">关 闭</el-button>
      <el-button @click="executeCase" size="mini" type="primary"
        >执 行</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'ExecCaseDialog',
  props: {
    caseInfo: {
      type: Object,
      default: null
    },
    visible: {
      type: Boolean,
      default: true
    },
    execType: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      dialogVisible: false,
      envList: [],
      moduleList: [],
      stepIdList: [],
      levelList: [],
      execDetail: {
        module: '',
        step_id: '',
        env: 'tests',
        level: '',
        label: '',
        workers: '1',
        inp: '',
        repeat: '1'
      }
    };
  },
  computed: {
    dialogTitle() {
      if (this.execType === 1) {
        return String.format('单个执行:(用例id->{0})', this.caseInfo.id);
      } else if (this.execType === 2) {
        return '批量执行';
      }
    }
  },
  created() {
    this.dialogVisible = this.visible;
    this.getConditions();
    this.init();
  },
  methods: {
    // 校验输入、选项框是否为空
    isEmpty(obj) {
      if (obj === undefined || obj === '') {
        return true;
      } else {
        return false;
      }
    },
    // 检查模块是否有值
    checkModule() {
      if (this.execDetail.module === '') {
        this.Message.error('请先选择所属模块!');
      }
    },
    // 全部与用例不可同时进行
    stepIdChange() {
      if (this.execDetail.step_id.length > 1) {
        let index = this.execDetail.step_id.indexOf('all');
        if (index > -1) {
          // 从数组中移除指定元素
          this.execDetail.step_id.splice(index, 1);
        }
      }
    },

    // module改变时,步骤id联动
    moduleOnChange(type) {
      if (type === 'change') {
        this.execDetail.step_id = '';
      }
      if (this.execDetail.module === '') {
        this.stepIdList = [];
      } else {
        let stepIdUrl = String.format(
          '{0}/condition/stepIdList?module={1}',
          this.GLOBAL.HTTPRUNNER_URL,
          this.execDetail.module
        );
        this.axios
          .get(stepIdUrl)
          .then(response => {
            if (response.data.code !== '200') {
              this.$message.error(response.data.msg);
            }
            this.stepIdList = response.data.step_id_list;
            return response;
          })
          .catch(response => {
            return response;
          });
      }
    },
    // 获取查询条件列表
    getConditions() {
      let envUrl = String.format(
        '{0}/condition/envList',
        this.GLOBAL.HTTPRUNNER_URL
      );
      let moduleUrl = String.format(
        '{0}/condition/moduleList',
        this.GLOBAL.HTTPRUNNER_URL
      );
      let levelUrl = String.format(
        '{0}/condition/levelList',
        this.GLOBAL.HTTPRUNNER_URL
      );
      this.axios
        .get(envUrl)
        .then(response => {
          if (response.data.code !== '200') {
            this.$message.error(response.data.msg);
          }
          this.envList = response.data.env_list.slice(1);
          return response;
        })
        .catch(response => {
          return response;
        });
      this.axios
        .get(moduleUrl)
        .then(response => {
          if (response.data.code !== '200') {
            this.$message.error(response.data.msg);
          }
          this.moduleList = response.data.module_list.slice(1);
          return response;
        })
        .catch(response => {
          return response;
        });
      this.axios
        .get(levelUrl)
        .then(response => {
          if (response.data.code !== '200') {
            this.$message.error(response.data.msg);
          }
          this.levelList = response.data.level_list.slice(1);
          return response;
        })
        .catch(response => {
          return response;
        });
    },
    init() {
      this.execDetail.module = this.caseInfo.module;
      this.execDetail.level = this.caseInfo.level;
      this.execDetail.label = this.caseInfo.label;
      this.execDetail.step_id = this.caseInfo.step_id;
      this.moduleOnChange('init');
    },
    // 执行用例
    executeCase() {
      if (
        !this.isEmpty(this.execDetail.module) &&
        !this.isEmpty(this.execDetail.step_id) &&
        !this.isEmpty(this.execDetail.env) &&
        !this.isEmpty(this.execDetail.level) &&
        !this.isEmpty(this.execDetail.repeat)
      ) {
        // 指定参数格式
        let config = {
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          }
        };
        let url = String.format(
          '{0}/exec/execCases',
          this.GLOBAL.HTTPRUNNER_URL
        );
        this.execDetail.level = this.execDetail.level.substring(1);
        if (this.execType === 2) {
          this.execDetail.step_id = this.execDetail.step_id.join(',');
        }
        this.axios
          .post(url, JSON.stringify(this.execDetail), config)
          .then(response => {
            let responseCode = response.data.code;
            if (responseCode === '200') {
              this.Message.success({
                showClose: true,
                message:
                  '执行成功,请根据序列号: ' +
                  response.data.serial_number +
                  ' 查询执行结果!',
                type: 'success',
                duration: 0
              });
            } else {
              this.Message.error(response.data.msg);
            }
            return response;
          })
          .catch(response => {
            return response;
          });
        this.execDetail.level = 'p' + this.execDetail.level;
        if (this.execType === 2) {
          this.execDetail.step_id = this.execDetail.step_id.split(',');
        }
      } else {
        this.Message.error('请填写必填项!');
      }
    },
    close() {
      this.$emit('listenToChildEvent');
    }
  }
};
</script>

<style scoped>
.exec-dialog .el-row {
  line-height: 40px;
  margin-top: 10px;
}

/deep/ .exec-dialog .el-input__inner {
  width: 350px;
}

/deep/ .exec-dialog .el-textarea__inner {
  width: 350px;
}
</style>
