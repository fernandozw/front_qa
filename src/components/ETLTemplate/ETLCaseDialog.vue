<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="dialogVisible"
    width="80%"
    class="case-dialog"
    @close="close"
  >
    <div>
      <el-card class="box-card">
        <el-form
          :inline="true"
          :model="caseDetail"
          size="mini"
          ref="caseDetail"
          :rules="rules"
        >
          <el-row :gutter="20">
            <el-form-item label="用例名称" prop="caseName">
              <el-col :span="12">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 4 }"
                  placeholder="必填项"
                  v-model="caseDetail.caseName"
                  clearable
                >
                </el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="用例类型" prop="caseType">
              <el-col :span="12">
                <el-select
                  v-model="caseDetail.caseType"
                  filterable
                  placeholder="请选择"
                  clearable
                >
                  <el-option
                    v-for="item in caseTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-col>
            </el-form-item>
          </el-row>
          <el-row :gutter="20">
            <el-form-item label="上报参数" prop="param" style="float: left">
              <el-col :span="12">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 4, maxRows: 8 }"
                  placeholder="必填项:请输入内容"
                  v-model="caseDetail.param"
                  clearable
                >
                </el-input>
              </el-col>
            </el-form-item>
          </el-row>
        </el-form>
      </el-card>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close" size="mini">取 消</el-button>
      <el-button type="primary" @click="saveCase('caseDetail')" size="mini">
        {{ btnText }}
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'ETLCaseDialog',
  props: {
    caseId: {
      type: Number,
      default: null
    },
    type: {
      type: Number,
      default: 1 // 1 新增 2 编辑
    },
    visible: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      caseTypeOptions: [
        { label: '事件', value: 1 },
        { label: '用户属性', value: 2 }
      ],
      dialogVisible: false,
      caseDetail: {
        id: '',
        caseName: '',
        caseType: '',
        param: ''
      },
      rules: {
        caseName: [{ required: true, message: '用例名称不能为空' }],
        caseType: [{ required: true, message: '用例类型不能为空' }],
        param: [{ required: true, message: '上报参数不能为空' }]
      }
    };
  },
  methods: {
    // 关闭dialog弹框
    close() {
      this.$emit('listenToChildEvent', false);
    },

    // 保存用例
    saveCase(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let config = {
            headers: {
              'Content-Type': 'application/json;charset=UTF-8'
            }
          };
          let url = String.format('{0}/etlCase/add', this.GLOBAL.ETL_URL);
          this.axios
            .post(url, this.caseDetail, config)
            .then(response => {
              console.log(response.data.code);
              if (response.data.code === '1000') {
                this.Message.success(response.data.message);
                this.dialogVisible = false;
                this.$emit('listenToChildEvent', true);
              } else {
                this.Message.error(response.data.message);
              }
              return response;
            })
            .catch(response => {
              return response;
            });
        }
      });
    },
    // 用例详情
    detail() {
      let url = String.format(
        '{0}/etlCase/detail?id={1}',
        this.GLOBAL.ETL_URL,
        this.caseId
      );
      this.axios
        .get(url)
        .then(response => {
          this.caseDetail = response.data.data;
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

    if (this.type === 2 || this.type === 3) {
      this.detail();
    }
  }
};
</script>

<style scoped>
/deep/ .el-textarea {
  width: 400px !important;
}

/deep/ .el-select {
  width: 300px !important;
}
</style>
