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
          :model="batchCaseDetail"
          size="mini"
          ref="batchCaseDetail"
          :rules="rules"
        >
          <el-row :gutter="20">
            <el-form-item label="批量场景名称" prop="batchCaseName">
              <el-col :span="12">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 4 }"
                  placeholder="必填项"
                  v-model="batchCaseDetail.batchCaseName"
                  clearable
                >
                </el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="是否创建项目" prop="createProject">
              <el-col :span="12">
                <el-select
                  v-model="batchCaseDetail.createProject"
                  filterable
                  placeholder="请选择"
                  clearable
                  class="createSelect"
                >
                  <el-option
                    v-for="item in createOptions"
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
            <el-form-item
              v-if="batchCaseDetail.createProject === 1"
              label="项目登录信息"
              prop="loginMap"
              style="float: left"
            >
              <el-col :span="12">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 4, maxRows: 8 }"
                  placeholder='仅在需要创建项目时填写,格式为json:{"host":"http://192.168.0.14:8993","loginName":"root","enPassword":"hxYFpJgC8iain5YQvsGP3Dm/T/SjP0R9gNalWR0hjghcRyO11tpS47ixbUKwJqjMhUMJ7FWEnaBpnn3GJ6KKH5viD0sAK7fpgzcm0lrEpTXcV3FKQcAsX+g/Qwsn2P6BFqmDP8ipI3GHKa/UcWxZTW4y5VZWDeS09PYsdBIGKd0="}'
                  v-model="batchCaseDetail.loginMap"
                  clearable
                >
                </el-input>
              </el-col>
            </el-form-item>
            <el-form-item
              label="trino配置信息"
              prop="trinoMap"
              style="float: left"
            >
              <el-col :span="12">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 4, maxRows: 8 }"
                  placeholder='必填项,格式为json:{"url": "jdbc:trino://192.168.0.14:8080","user": "ta","password": "","SSL": "false"}'
                  v-model="batchCaseDetail.trinoMap"
                  clearable
                >
                </el-input>
              </el-col>
            </el-form-item>
          </el-row>
          <el-row :gutter="20">
            <el-form-item
              v-if="batchCaseDetail.createProject === 2"
              label="项目id"
              prop="projectId"
              style="float: left"
            >
              <el-col :span="12">
                <el-input
                  type="input"
                  placeholder="仅在不需要创建项目时填写,需要创建项目时会默认使用创建后的项目id。"
                  v-model="batchCaseDetail.projectId"
                  clearable
                >
                </el-input>
              </el-col>
            </el-form-item>
            <el-form-item
              v-if="batchCaseDetail.createProject === 2"
              label="appid"
              prop="appId"
              style="float: left"
            >
              <el-col :span="12">
                <el-input
                  type="input"
                  placeholder="仅在不需要创建项目时填写,需要创建项目时会默认使用创建后的appid。"
                  v-model="batchCaseDetail.appId"
                  clearable
                >
                </el-input>
              </el-col>
            </el-form-item>
          </el-row>
          <el-row :gutter="20">
            <el-form-item
              label="数据上报地址"
              prop="etlUrl"
              style="float: left"
            >
              <el-col :span="12">
                <el-input
                  type="input"
                  placeholder="必填项:http://192.168.0.14:8991/sync_json"
                  v-model="batchCaseDetail.etlUrl"
                  clearable
                >
                </el-input>
              </el-col>
            </el-form-item>
            <el-form-item
              label="数据debug地址"
              prop="debugUrl"
              style="float: left"
            >
              <el-col :span="12">
                <el-input
                  type="input"
                  placeholder="必填项:http://192.168.0.14:8995/data_debug"
                  v-model="batchCaseDetail.debugUrl"
                  clearable
                >
                </el-input>
              </el-col>
            </el-form-item>
          </el-row>
          <el-row :gutter="20">
            <el-form-item label="执行场景列表" prop="sceneIdList">
              <el-col :span="12">
                <el-select
                  v-model="batchCaseDetail.sceneIdList"
                  filterable
                  placeholder="请选择"
                  clearable
                  class="sceneIdListSelect"
                  multiple
                  collapse-tags
                  style="margin-left: 20px;"
                >
                  <el-option
                    v-for="item in allSceneList"
                    :key="item.id"
                    :label="'「' + item.id + '」' + item.sceneName"
                    :value="item.id + ''"
                  >
                  </el-option>
                </el-select>
              </el-col>
            </el-form-item>
          </el-row>
        </el-form>
      </el-card>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close" size="mini">取 消</el-button>
      <el-button
        type="primary"
        @click="saveBatchCase('batchCaseDetail')"
        size="mini"
      >
        {{ btnText }}
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'ETLBatchCaseDialog',
  props: {
    batchCaseId: {
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
      dialogVisible: false,
      allSceneList: [],
      createOptions: [
        { label: '是', value: 1 },
        { label: '否', value: 2 }
      ],
      batchCaseDetail: {
        id: '',
        batchCaseName: '',
        sceneIdList: [],
        createProject: 2,
        loginMap: '',
        trinoMap: '',
        etlUrl: '',
        debugUrl: '',
        projectId: '',
        appId: '',
        creator: ''
      },
      rules: {
        batchCaseName: [{ required: true, message: '批量场景名称不能为空' }],
        createProject: [{ required: true, message: '是否创建项目不能为空' }],
        sceneIdList: [{ required: true, message: '场景id列表不能为空' }],
        trinoMap: [{ required: true, message: 'trino配置不能为空' }],
        etlUrl: [{ required: true, message: '数据上报地址不能为空' }],
        debugUrl: [{ required: true, message: 'debug接口地址不能为空' }]
      }
    };
  },
  methods: {
    // 关闭dialog弹框
    close() {
      this.$emit('listenToChildEvent', false);
    },

    // 保存批量场景
    saveBatchCase(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let config = {
            headers: {
              'Content-Type': 'application/json;charset=UTF-8'
            }
          };
          let path =
            this.type === 2
              ? '{0}/etlBatchCase/update'
              : '{0}/etlBatchCase/add';
          let url = String.format(path, this.GLOBAL.ETL_URL);
          if (this.type === 1) {
            this.batchCaseDetail.creator = localStorage.getItem('executor');
          }

          let param = JSON.parse(JSON.stringify(this.batchCaseDetail));
          param.sceneIdList = param.sceneIdList.join(',');
          this.axios
            .post(url, param, config)
            .then(response => {
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
    // 获取所有场景
    getAllScene() {
      let url = String.format('{0}/etlScene/allScene', this.GLOBAL.ETL_URL);
      this.axios
        .get(url)
        .then(response => {
          this.allSceneList = response.data.data;
          return response;
        })
        .catch(response => {
          return response;
        });
    },
    // 批量场景详情
    detail() {
      let url = String.format(
        '{0}/etlBatchCase/detail?id={1}',
        this.GLOBAL.ETL_URL,
        this.batchCaseId
      );
      this.axios
        .get(url)
        .then(response => {
          this.batchCaseDetail = response.data.data;
          this.batchCaseDetail.sceneIdList = this.batchCaseDetail.sceneIdList.split(
            ','
          );
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
        return '编辑' + '（批量场景ID：' + this.batchCaseId + '）';
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
    localStorage.setItem('executor', '朱伟');
    this.dialogVisible = this.visible;
    this.getAllScene();

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

/deep/ .createSelect {
  width: 100px !important;
}
/deep/ .sceneIdListSelect {
  width: 300px !important;
}

/deep/ .el-input {
  width: 300px !important;
}
</style>
