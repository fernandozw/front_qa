<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="dialogVisible"
    width="80%"
    class="testCase-dialog"
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
              v-model="caseDetail.module"
              filterable
              placeholder="请选择"
              clearable
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
            <el-input
              placeholder="必填项:请输入内容"
              v-model="caseDetail.step_id"
              clearable
            >
            </el-input>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="4">
            <span>用例参数: </span>
          </el-col>
          <el-col :span="8" :pull="2">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4 }"
              placeholder="非必填项:请输入内容"
              v-model="caseDetail.parameters"
              clearable
            >
            </el-input>
          </el-col>
          <el-col :span="4">
            <span>用例级别: <span style="color:red">*</span></span>
          </el-col>
          <el-col :span="8" :pull="2">
            <el-select
              v-model="caseDetail.level"
              filterable
              placeholder="请选择"
              clearable
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
            <span>用例标签: <span style="color:red">*</span></span>
          </el-col>
          <el-col :span="8" :pull="1">
            <el-input
              placeholder="必填项:请输入内容"
              v-model="caseDetail.label"
              clearable
            >
            </el-input>
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
  name: 'TestCaseDialog',
  props: {
    caseId: {
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
      caseDetail: {
        id: '',
        module: '',
        step_id: '',
        parameters: '',
        level: '',
        label: '',
        variables: 0
      },
      moduleList: [],
      levelList: []
    };
  },
  computed: {
    dialogTitle() {
      if (this.type === 2) {
        return '编辑' + '（ID：' + this.caseId + '）';
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
      let caseInfoUrl = String.format(
        '{0}/case/caseInfo?id={1}',
        this.GLOBAL.HTTPRUNNER_URL,
        this.caseId
      );
      this.axios
        .get(caseInfoUrl)
        .then(response => {
          if (response.data.code !== '200') {
            this.$message.error(response.data.msg);
          }
          this.caseDetail = response.data.detail;
          if (this.type === 3) {
            this.caseDetail.id = null;
          }
          this.getConditions();
          return response;
        })
        .catch(response => {
          return response;
        });
    },
    // 编辑保存用例
    // saveCase() {
    //   if (
    //     this.isEmpty(this.caseDetail['url_id']) ||
    //     this.isEmpty(this.caseDetail['case_name']) ||
    //     this.isEmpty(this.caseDetail['case_type']) ||
    //     this.isEmpty(this.caseDetail['auto']) ||
    //     this.isEmpty(this.caseDetail['request_type']) ||
    //     this.isEmpty(this.caseDetail['project_id']) ||
    //     this.isEmpty(this.caseDetail['business_id']) ||
    //     this.isEmpty(this.caseDetail['host_id']) ||
    //     this.isEmpty(this.caseDetail['create_person']) ||
    //     this.isEmpty(this.caseDetail['version_id'])
    //   ) {
    //     this.Message.error('警告:请填写必填项!');
    //   } else {
    //     if (
    //       !this.GLOBAL.checkJson(this.caseDetail.param) ||
    //       !this.GLOBAL.checkJson(this.caseDetail.header)
    //     ) {
    //       this.Message.error('请求头部、请求参数必须为JSON格式');
    //     } else {
    //       this.caseDetail.pre_scene = this.preSceneS.join(',');
    //       let url = String.format(
    //         this.caseDetail.id
    //           ? '{0}/caseInterface/editCase'
    //           : '{0}/caseInterface/addCase',
    //         this.GLOBAL.MONITOR_URL
    //       );
    //       // 指定参数格式
    //       let config = {
    //         headers: {
    //           'Content-Type': 'application/json;charset=UTF-8'
    //         }
    //       };
    //       this.axios
    //         .post(url, JSON.stringify(this.caseDetail), config)
    //         .then(response => {
    //           let responseCode = response.data.code;
    //           if (responseCode === '200') {
    //             this.Message.success(response.data.msg);
    //             // 调用父组件的查询方法
    //             this.$emit('listenToChildEvent', true);
    //           } else {
    //             this.Message.error(response.data.msg);
    //           }
    //           return response;
    //         })
    //         .catch(response => {
    //           // 调用父组件的查询方法
    //           // this.$emit('listenToChildEvent', true);
    //           return response;
    //         });
    //     }
    //   }
    // },
    close() {
      this.$emit('listenToChildEvent', false);
    },
    // 获取查询条件列表
    getConditions() {
      this.moduleList = [];
      this.levelList = [];
      let moduleUrl = String.format(
        '{0}/condition/moduleList',
        this.GLOBAL.HTTPRUNNER_URL
      );
      let levelUrl = String.format(
        '{0}/condition/levelList',
        this.GLOBAL.HTTPRUNNER_URL
      );
      this.axios
        .get(moduleUrl)
        .then(response => {
          if (response.data.code !== '200') {
            this.$message.error(response.data.msg);
          }
          this.moduleList = response.data.module_list;
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
          this.levelList = response.data.level_list;
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
.testCase-dialog .el-row {
  line-height: 40px;
  margin-top: 10px;
}

/deep/ .testCase-dialog .el-input__inner {
  width: 350px;
}

/deep/ .testCase-dialog .el-textarea__inner {
  width: 350px;
}
</style>
