<template>
  <div>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="90%"
      @close="close"
    >
      <div>
        <el-card class="box-card">
          <el-form
            :inline="true"
            :model="configDetail"
            size="mini"
            ref="configDetail"
            :rules="configRules"
          >
            <el-row :gutter="20">
              <el-form-item label="场景名称" prop="sceneName">
                <el-col :span="8">
                  <el-input
                    type="textarea"
                    :autosize="{ minRows: 4, maxRows: 8 }"
                    placeholder="必填项"
                    v-model="configDetail.sceneName"
                    clearable
                  >
                  </el-input>
                </el-col>
              </el-form-item>
              <el-form-item label="上报地址" prop="url">
                <el-col :span="8">
                  <el-input
                    type="textarea"
                    :autosize="{ minRows: 4, maxRows: 8 }"
                    placeholder="必填项:http://39.100.208.209:8991/sync_json"
                    v-model="configDetail.url"
                    clearable
                  >
                  </el-input>
                </el-col>
              </el-form-item>
            </el-row>
            <el-row :gutter="20">
              <el-form-item
                label="动态参数                                                                "
                prop="valueMap"
              >
                <el-col :span="8">
                  <el-input
                    type="textarea"
                    :autosize="{ minRows: 4, maxRows: 8 }"
                    placeholder='请输入内容:{"data.#time":"2023-04-26 00:00:00.567","#event_name":"测试事件名称","properties.batchNo":"2023-04-26 00:00:00"}'
                    v-model="configDetail.valueMap"
                    clearable
                  >
                  </el-input>
                </el-col>
              </el-form-item>
              <el-form-item label="trino配置" prop="trinoMap">
                <el-col :span="12">
                  <el-input
                    type="textarea"
                    :autosize="{ minRows: 4, maxRows: 8 }"
                    placeholder='必填项:{"url":"jdbc:trino://192.168.0.106:8080","user":"ta","password":"","SSL":"false"}'
                    v-model="configDetail.trinoMap"
                    clearable
                  >
                  </el-input>
                </el-col>
              </el-form-item>
            </el-row>
            <el-row :gutter="20">
              <el-form-item label="用例列表" prop="idList" class="idListForm">
                <el-col :span="12">
                  <el-select
                    class="idListSelect"
                    v-model="configDetail.idList"
                    multiple
                    collapse-tags
                    style="margin-left: 20px;"
                    placeholder="必填项:请选择"
                    filterable
                  >
                    <el-option
                      v-for="item in allCaseList"
                      :key="item.id"
                      :label="
                        '[' +
                          (item.caseType === 1 ? '事件' : '用户属性') +
                          '][' +
                          item.id +
                          ']' +
                          item.caseName
                      "
                      :value="item.id"
                    >
                    </el-option>
                  </el-select>
                </el-col>
              </el-form-item>
              <el-form-item
                label="场景类型"
                prop="sceneType"
                class="verifyForm"
                style="margin-left: 20px"
              >
                <el-col :span="4">
                  <el-select
                    class="verifySelect"
                    v-model="configDetail.sceneType"
                    placeholder="必填项:请选择"
                    clearable
                  >
                    <el-option
                      v-for="item in sceneTypeOptions"
                      :key="item.index"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-col>
              </el-form-item>
              <el-form-item
                label="校验方式"
                prop="customCheck"
                class="verifyForm"
              >
                <el-col :span="8">
                  <el-select
                    v-model="configDetail.customCheck"
                    placeholder="必填项:请选择"
                    clearable
                    class="verifySelect"
                  >
                    <el-option
                      v-for="item in verifyTypeOptions"
                      :key="item.index"
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
                label="自定义SQL"
                prop="sqlList"
                v-if="configDetail.customCheck"
              >
                <el-col :span="12">
                  <el-input
                    type="textarea"
                    :autosize="{ minRows: 4, maxRows: 8 }"
                    placeholder="多条SQL请用',分割,结尾不要用';',查询结果是一个二维数组,如果是聚合查询,查询列必须有别名,请确保SQL语法正确,不要删除batchNo和uuid字段"
                    v-model="configDetail.sqlList"
                    clearable
                  >
                  </el-input>
                </el-col>
              </el-form-item>
              <el-form-item
                label="自定义期望结果"
                prop="valueMap"
                v-if="configDetail.customCheck"
              >
                <el-col :span="12">
                  <el-input
                    type="textarea"
                    :autosize="{ minRows: 4, maxRows: 8 }"
                    placeholder='自定义期望结果是一个二维数组,格式如下[[{"nameCount":1,"avgCount":10}],[{"ageCount":2}]]'
                    v-model="configDetail.expectValueList"
                    clearable
                  >
                  </el-input>
                </el-col>
              </el-form-item>
            </el-row>
            <el-row :gutter="20">
              <el-form-item label="等待时长(分钟)" prop="waitTime">
                <el-col :span="6">
                  <el-input
                    type="input"
                    placeholder="请输入内容"
                    v-model="configDetail.waitTime"
                    clearable
                  >
                  </el-input>
                </el-col>
              </el-form-item>
              <el-form-item label="主版本" prop="version">
                <el-col :span="6">
                  <el-input
                    type="input"
                    placeholder="请输入内容"
                    v-model="configDetail.version"
                    clearable
                  >
                  </el-input>
                </el-col>
              </el-form-item>
              <el-form-item label="子版本" prop="subVersion">
                <el-col :span="6">
                  <el-input
                    type="input"
                    placeholder="请输入内容"
                    v-model="configDetail.subVersion"
                    clearable
                  >
                  </el-input>
                </el-col>
              </el-form-item>
              <el-form-item label="项目ID" prop="projectId">
                <el-col :span="4">
                  <el-input
                    type="input"
                    placeholder="必填项:请输入项目ID"
                    v-model="configDetail.projectId"
                    clearable
                  >
                  </el-input>
                </el-col>
              </el-form-item>
              <el-form-item label="上报日期" prop="time">
                <el-col :span="4">
                  <el-input
                    type="input"
                    placeholder="必填项:请输入上报日期"
                    v-model="configDetail.time"
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
        <el-button type="danger" size="mini" @click="executeScene"
          >执 行
        </el-button>

        <el-button type="primary" size="mini" @click="saveScene('configDetail')"
          >保 存</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'ETLSceneDialog',
  props: {
    sceneId: {
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
      verifyTypeOptions: [
        { label: '默认校验', value: false },
        { label: '自定义校验', value: true }
      ],
      sceneTypeOptions: [
        { label: '事件', value: 1 },
        { label: '用户属性', value: 2 }
      ],
      allCaseList: [],
      addConfigDetail: {
        sceneName: '',
        url: 'http://39.100.208.209:8991/sync_json',
        valueMap:
          '{"appid":"69b2de81e39d4528a06f62cccf280af5","data.#time":"' +
          this.getNowTime() +
          '"}',
        idList: '',
        version: '4.0',
        subVersion: '4.0.1',
        trinoMap:
          '{"url": "jdbc:trino://39.100.208.209:8080","user": "ta","password": "","SSL": "false"}',
        projectId: '3748',
        time: this.getCurrentDate(),
        waitTime: 10,
        customCheck: false,
        sqlList:
          'select count(*) as count1 FROM hive.ta."v_user_3748" t where batchNo=\'%s\' and uuid not in (%s),\n select count(*) as count2 FROM hive.ta."v_event_3748" t where batchNo=\'%s\' and uuid not in (%s)',
        expectValueList: '[[{"count1":1}],[{"count2":2}]]',
        sceneType: ''
      },
      configDetail: {},
      configRules: {
        url: [{ required: true, message: '上报地址不能为空' }],
        idList: [{ required: true, message: '用例列表不能为空' }],
        trinoMap: [{ required: true, message: 'trino配置不能为空' }],
        projectId: [{ required: true, message: '项目ID不能为空' }],
        time: [{ required: true, message: '上报日期不能为空' }],
        sceneType: [{ required: true, message: '场景类型不能为空' }],
        waitTime: [{ required: true, message: '等待时长不能为空' }],
        sceneName: [{ required: true, message: '场景名称不能为空' }],
        valueMap: [{ required: true, message: '动态参数不能为空' }]
      }
    };
  },
  methods: {
    // 关闭dialog弹框
    close() {
      this.$emit('listenToChildEvent', false);
    },
    // 获取当前时间
    getNowTime() {
      let date = new Date();
      let year = date.getFullYear();
      let month =
        date.getMonth() + 1 < 10
          ? '0' + (date.getMonth() + 1)
          : date.getMonth() + 1;

      let currentDate =
        date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
      let hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
      let minute =
        date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
      let second =
        date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
      let milliSeconds = date.getMilliseconds();
      let currentTime =
        year +
        '-' +
        month +
        '-' +
        currentDate +
        ' ' +
        hour +
        ':' +
        minute +
        ':' +
        second +
        '.' +
        milliSeconds;
      return currentTime;
    },
    // 是否为整数
    isInt(obj) {
      // 判断是否为整数
      let re = /^[1-9]+[0-9]*]*$/;
      if (!re.test(obj.value)) {
        return false;
      } else {
        return true;
      }
    },
    // 是否为json
    isJson($string) {
      try {
        if (typeof JSON.parse($string) === 'object') return true;
        return false;
      } catch (e) {
        return false;
      }
    },
    // 获取当前日期
    getCurrentDate() {
      const nowDate = new Date();
      const date = {
        year: nowDate.getFullYear(),
        month: nowDate.getMonth() + 1,
        date: nowDate.getDate()
      };
      const newMonth = date.month >= 10 ? date.month : '0' + date.month;
      const day = date.date >= 10 ? date.date : '0' + date.date;
      return date.year + '-' + newMonth + '-' + day;
    },
    // 场景详情
    detail() {
      let url = String.format(
        '{0}/etlScene/detail?id={1}',
        this.GLOBAL.ETL_URL,
        this.sceneId
      );
      this.axios
        .get(url)
        .then(response => {
          let tmpResponse = JSON.parse(JSON.stringify(response.data.data));
          // 用例列表字符串数组转数字数组
          tmpResponse.idList = tmpResponse.idList.split(',').map(Number);
          // 将自定义校验的值处理成boolean类型

          if (tmpResponse.customCheck === 1) {
            tmpResponse.customCheck = true;
          } else {
            tmpResponse.customCheck = false;
          }
          this.configDetail = tmpResponse;
          return response;
        })
        .catch(response => {
          return response;
        });
    },
    // 获取所有用例
    getAllCase() {
      let url = String.format('{0}/etlCase/allCase', this.GLOBAL.ETL_URL);
      this.axios
        .get(url)
        .then(response => {
          this.allCaseList = response.data.data;
          return response;
        })
        .catch(response => {
          return response;
        });
    },
    // 执行场景
    executeScene() {
      this.$refs['configDetail'].validate(valid => {
        if (valid) {
          let config = {
            headers: {
              'Content-Type': 'application/json;charset=UTF-8'
            }
          };
          let url = String.format('{0}/etlCase/execute', this.GLOBAL.ETL_URL);
          let executeConfig = JSON.parse(JSON.stringify(this.configDetail));
          // sql列表不为数组
          if (!Array.isArray(executeConfig.sqlList)) {
            executeConfig.sqlList = executeConfig.sqlList
              .replace('\n', '')
              .split(',');
          }
          // 期望结果不为json对象
          if (this.isJson(executeConfig.expectValueList)) {
            executeConfig.expectValueList = JSON.parse(
              executeConfig.expectValueList
            );
          } else {
            executeConfig.expectValueList = [];
          }
          // id列表不为数组
          if (!Array.isArray(executeConfig.idList)) {
            executeConfig.idList = executeConfig.idList.split(',').map(Number);
          }
          // trino配置不为json对象
          if (this.isJson(executeConfig.trinoMap)) {
            executeConfig.trinoMap = JSON.parse(executeConfig.trinoMap);
          } else {
            executeConfig.trinoMap = {};
          }
          // 动态参数不为json对象
          if (this.isJson(executeConfig.valueMap)) {
            executeConfig.valueMap = JSON.parse(executeConfig.valueMap);
          } else {
            executeConfig.valueMap = {};
          }
          // 等待时长是否为整数
          if (!this.isInt(executeConfig.waitTime)) {
            executeConfig.waitTime = Number.parseInt(executeConfig.waitTime);
          }
          this.axios
            .post(url, executeConfig, config)
            .then(response => {
              this.loading = false;

              if (response.data.code === '1000') {
                this.Message.success(response.data.message);
              } else {
                this.Message.error(response.data.message);
              }
              return response;
            })
            .catch(response => {
              return response;
            });
        } else {
          this.Message.error('请填写必填项!');
        }
      });
    },
    // 保存场景
    saveScene(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let config = {
            headers: {
              'Content-Type': 'application/json;charset=UTF-8'
            }
          };
          let url =
            this.type === 2
              ? String.format('{0}/etlScene/update', this.GLOBAL.ETL_URL)
              : String.format('{0}/etlScene/add', this.GLOBAL.ETL_URL);
          let saveDetail = JSON.parse(JSON.stringify(this.configDetail));
          saveDetail.customCheck = saveDetail.customCheck ? 1 : 2;
          saveDetail.idList = saveDetail.idList.join(',');

          this.axios
            .post(url, saveDetail, config)
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
        } else {
          this.Message.error('请填写必填项!');
        }
      });
    }
  },
  computed: {
    dialogTitle() {
      if (this.type === 2) {
        return '编辑' + '（场景ID：' + this.sceneId + '）';
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
    // 获取所有用例
    this.getAllCase();
    this.dialogVisible = this.visible;
    if (this.type === 2 || this.type === 3) {
      // 编辑或者复制时,直接获取详情

      this.detail();
    } else if (this.type === 1) {
      // 新增时,给默认值
      this.configDetail = this.addConfigDetail;
    }
  }
};
</script>

<style scoped>
/deep/ .el-textarea {
  width: 400px !important;
}

/deep/ .el-input {
  width: 120px !important;
}

/deep/ .verifyForm {
  width: 210px !important;
}

/deep/ .verifySelect {
  width: 110px !important;
}

/deep/ .idListForm {
  width: 480px !important;
}

/deep/ .idListSelect {
  margin-left: 0px !important;
  width: 350px !important;
}
</style>
