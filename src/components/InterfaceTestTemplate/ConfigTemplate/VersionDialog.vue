<template>
  <div>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="80%"
      class="version-dialog"
      @close="close"
    >
      <div>
        <el-card class="box-card">
          <el-form
            :inline="true"
            :model="versionDetail"
            size="mini"
            :rules="rules"
            ref="versionForm"
          >
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="版本名称:" prop="version_name">
                  <el-input
                    placeholder="必填项:请输入版本名称"
                    v-model="versionDetail.version_name"
                    style="width: 300px"
                    clearable
                  >
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="所属项目:" prop="project_id">
                  <el-select
                    size="mini"
                    v-model="versionDetail.project_id"
                    placeholder="请选择所属项目"
                    filterable
                    style="width: 400px"
                    clearable
                  >
                    <el-option
                      v-for="item in projectList"
                      :key="item.value"
                      :label="'「' + item.value + '」' + item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-card>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" type="info" @click="close">取 消</el-button>
        <el-button
          size="mini"
          type="primary"
          @click="saveVersion('versionForm')"
        >
          {{ btnText }}
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'VersionDialog',
  props: {
    versionId: {
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
    return {
      rules: {
        version_name: [
          { required: true, message: '版本名称名称不能为空', trigger: 'change' }
        ],
        project_id: [
          { required: true, message: '所属项目不能为空', trigger: 'change' }
        ]
      },
      dialogVisible: true,
      versionDetail: {
        version_name: '',
        project_id: ''
      },
      projectList: []
    };
  },
  methods: {
    // 新增、编辑、复制版本
    saveVersion(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let url = String.format(
            this.type === 2
              ? '{0}/versionInterface/editVersion'
              : '{0}/versionInterface/addVersion',
            this.GLOBAL.MONITOR_URL
          );
          // 指定参数格式
          let config = {
            headers: {
              'Content-Type': 'application/json;charset=UTF-8'
            }
          };
          this.axios
            .post(url, JSON.stringify(this.versionDetail), config)
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
      });
    },
    // 关闭dialog弹框
    close() {
      this.$emit('listenToChildEvent', false);
      this.$refs['versionForm'].resetFields();
    },
    // 获取查询条件
    getConditions() {
      let url = String.format(
        '{0}/projectInterface/projectListConditions',
        this.GLOBAL.MONITOR_URL
      );
      this.axios
        .get(url)
        .then(response => {
          if (response.data.code === '200') {
            this.projectList = response.data.project_list;
          } else {
            this.$message.error(response.data.msg);
          }
          return response;
        })
        .catch(response => {
          return response;
        });
    },
    // 版本详情
    detail() {
      this.getConditions();
      let url = String.format(
        '{0}/versionInterface/versionInfo?id={1}',
        this.GLOBAL.MONITOR_URL,
        this.versionId
      );
      this.axios
        .get(url)
        .then(response => {
          if (response.data.code === '200') {
            this.versionDetail = response.data.version_info;
          } else {
            this.versionDetail = response.data.version_info;
            this.$message.error(response.data.msg);
          }
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
        return '编辑' + '（版本ID：' + this.versionId + '）';
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
  }
};
</script>

<style scoped></style>
