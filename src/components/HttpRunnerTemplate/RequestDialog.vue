<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="dialogVisible"
    width="80%"
    class="request-dialog"
    @close="close"
  >
    <div>
      <el-card class="box-card">
        <el-row :gutter="20">
          <el-col :span="4">
            <span>请求名称: <span style="color:red">*</span></span>
          </el-col>
          <el-col :span="8" :pull="2">
            <el-input
              placeholder="必填项:请输入内容"
              v-model="requestDetail.name"
              clearable
            >
            </el-input>
          </el-col>
          <el-col :span="4">
            <span>请求地址: <span style="color:red">*</span></span>
          </el-col>
          <el-col :span="8" :pull="2">
            <el-input
              placeholder="必填项:请输入内容"
              v-model="requestDetail.url"
              clearable
            >
            </el-input>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="4">
            <span>请求头部: <span style="color:red">*</span></span>
          </el-col>
          <el-col :span="8" :pull="2">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4 }"
              placeholder="必填项:请输入内容"
              v-model="requestDetail.headers"
              clearable
            >
            </el-input>
          </el-col>
          <el-col :span="4">
            <span>step的子变量: <span style="color:red">*</span></span>
          </el-col>
          <el-col :span="8" :pull="2">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4 }"
              placeholder="必填项:请输入内容"
              v-model="requestDetail.variables"
              clearable
            >
            </el-input>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="3">
            <span>params参数: <span style="color:red">*</span></span>
          </el-col>
          <el-col :span="8" :pull="1">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4 }"
              placeholder="必填项:请输入内容"
              v-model="requestDetail.params"
              clearable
            >
            </el-input>
          </el-col>
          <el-col :span="3" :push="1">
            <span>请求体: <span style="color:red">*</span></span>
          </el-col>
          <el-col :span="8">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4 }"
              placeholder="必填项:请输入内容"
              v-model="requestDetail.data"
              clearable
            >
            </el-input>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="3">
            <span>导出参数值: <span style="color:red">*</span></span>
          </el-col>
          <el-col :span="8" :pull="1">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4 }"
              placeholder="必填项:请输入内容"
              v-model="requestDetail.extract"
              clearable
            >
            </el-input>
          </el-col>
          <el-col :span="3" :push="1">
            <span>setup钩子函数:</span>
          </el-col>
          <el-col :span="8">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4 }"
              placeholder="请输入内容"
              v-model="requestDetail.setup_hook"
              clearable
            >
            </el-input>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="3">
            <span>执行完钩子函数:</span>
          </el-col>
          <el-col :span="8" :pull="1">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4 }"
              placeholder="请输入内容"
              v-model="requestDetail.teardown_hook"
              clearable
            >
            </el-input>
          </el-col>

          <el-col :span="3" :push="1">
            <span>断言集:</span>
          </el-col>
          <el-col :span="8">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4 }"
              placeholder="请输入内容"
              v-model="requestDetail.validators"
              clearable
            >
            </el-input>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="4">
            <span>请求方法: <span style="color:red">*</span></span>
          </el-col>
          <el-col :span="8" :pull="2">
            <el-select
              placeholder="必填项:请选择"
              v-model="requestDetail.method"
              clearable
              filterable
            >
              <el-option
                v-for="item in methodList"
                :key="item.label"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-col>
        </el-row>
      </el-card>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close" size="mini">取 消</el-button>
      <el-button type="primary" @click="close" size="mini">
        {{ btnText }}
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'RequestDialog',
  props: {
    requestId: {
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
    return {
      dialogVisible: false,
      requestDetail: {
        id: '',
        name: '',
        url: '',
        method: '',
        headers: '',
        variables: 0,
        params: '',
        data: '{}',
        extract: '{}',
        setup_hook: '',
        teardown_hook: '',
        validators: ''
      },
      methodList: []
    };
  },
  computed: {
    dialogTitle() {
      if (this.type === 2) {
        return '编辑' + '（ID：' + this.requestId + '）';
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
      this.init();
    }
  },
  methods: {
    init() {
      let requestInfoUrl = String.format(
        '{0}/request/requestInfo?id={1}',
        this.GLOBAL.HTTPRUNNER_URL,
        this.requestId
      );
      this.axios
        .get(requestInfoUrl)
        .then(response => {
          if (response.data.code !== '200') {
            this.$message.error(response.data.msg);
          }
          this.requestDetail = response.data.detail;
          if (this.type === 3) {
            this.requestDetail.id = null;
          }
          this.getConditions();
          return response;
        })
        .catch(response => {
          return response;
        });
    },
    // 编辑保存用例
    saveCase() {
      if (
        this.isEmpty(this.caseDetail['url_id']) ||
        this.isEmpty(this.caseDetail['case_name']) ||
        this.isEmpty(this.caseDetail['case_type']) ||
        this.isEmpty(this.caseDetail['auto']) ||
        this.isEmpty(this.caseDetail['request_type']) ||
        this.isEmpty(this.caseDetail['project_id']) ||
        this.isEmpty(this.caseDetail['business_id']) ||
        this.isEmpty(this.caseDetail['host_id']) ||
        this.isEmpty(this.caseDetail['create_person']) ||
        this.isEmpty(this.caseDetail['version_id'])
      ) {
        this.Message.error('警告:请填写必填项!');
      } else {
        if (
          !this.GLOBAL.checkJson(this.caseDetail.param) ||
          !this.GLOBAL.checkJson(this.caseDetail.header)
        ) {
          this.Message.error('请求头部、请求参数必须为JSON格式');
        } else {
          this.caseDetail.pre_scene = this.preSceneS.join(',');
          let url = String.format(
            this.caseDetail.id
              ? '{0}/caseInterface/editCase'
              : '{0}/caseInterface/addCase',
            this.GLOBAL.MONITOR_URL
          );
          // 指定参数格式
          let config = {
            headers: {
              'Content-Type': 'application/json;charset=UTF-8'
            }
          };
          this.axios
            .post(url, JSON.stringify(this.caseDetail), config)
            .then(response => {
              let responseCode = response.data.code;
              if (responseCode === '200') {
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
      }
    },
    close() {
      this.$emit('listenToChildEvent', false);
    },
    // 获取查询条件
    getConditions() {
      this.methodList = [];
      let url = String.format(
        '{0}/condition/requestTypeList',
        this.GLOBAL.HTTPRUNNER_URL
      );
      this.axios
        .get(url)
        .then(response => {
          if (response.data.code !== '200') {
            this.$message.error(response.data.msg);
          }
          this.methodList = response.data.data;
          return response;
        })
        .catch(response => {
          return response;
        });
    },
    // 校验输入、选项框是否为空
    isEmpty(obj) {
      if (obj === undefined || obj === '') {
        return true;
      } else {
        return false;
      }
    }
  }
};
</script>

<style scoped>
.request-dialog .el-row {
  line-height: 40px;
  margin-top: 10px;
}

/deep/ .request-dialog .el-input__inner {
  width: 350px;
}

/deep/ .request-dialog .el-textarea__inner {
  width: 350px;
}
</style>
