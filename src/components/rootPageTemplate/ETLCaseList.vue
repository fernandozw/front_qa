<template>
  <div>
    <el-card
      shadow="always"
      style="margin-top: 10px"
      v-loading="loading"
      element-loading-text="执行中,上报后会等待10秒,请稍等～～～～～"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
    >
      <el-form :inline="true" :model="searchForm" size="mini">
        <el-form-item label="用例id">
          <el-input
            v-model="searchForm.id"
            placeholder="输入用例id"
            clearable
            style="width: 150px"
          ></el-input>
        </el-form-item>
        <el-form-item label="用例名称">
          <el-input
            v-model="searchForm.caseName"
            placeholder="输入用例名称"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="用例类型">
          <el-select
            v-model="searchForm.caseType"
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
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker
            v-model="searchForm.addTime"
            type="datetimerange"
            align="right"
            start-placeholder="起始时间"
            end-placeholder="截止时间"
            :default-time="['00:00:00', '23:59:59']"
            style="width: 360px;"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="更新时间">
          <el-date-picker
            v-model="searchForm.updateTime"
            type="datetimerange"
            align="right"
            start-placeholder="起始时间"
            end-placeholder="截止时间"
            :default-time="['00:00:00', '23:59:59']"
            style="width: 360px;"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item style="float: right;margin-right: 60px">
          <el-button type="primary" @click="getCaseList('search')"
            >查 询
          </el-button>
          <el-button type="success" @click="clickAddBtn">新 增</el-button>
          <el-button type="info" @click="reSet">重 置</el-button>

          <el-button type="danger" @click="openExecuteDialog"
            >执行配置
          </el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        size="mini"
        :row-class-name="tableRowClassName"
        align="center"
      >
        <el-table-column
          show-overflow-tooltip
          prop="id"
          label="用例id"
          width="100"
          align="center"
          fixed="left"
        >
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="caseName"
          label="用例名称"
          width="250"
          align="center"
        >
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="caseType"
          label="用例类型"
          align="center"
          width="100"
        >
          <template slot-scope="scope">
            <span v-if="tableData[scope.$index].caseType === 1">事件</span>
            <span v-else-if="tableData[scope.$index].caseType === 2"
              >用户属性</span
            >
            <span v-else>未知</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          show-overflow-tooltip
          prop="param"
          label="上报参数"
          width="400"
        ></el-table-column>
        <el-table-column
          align="center"
          show-overflow-tooltip
          prop="addTime"
          label="创建时间"
          width="250"
        ></el-table-column>
        <el-table-column
          align="center"
          show-overflow-tooltip
          prop="addTime"
          label="更新时间"
          width="250"
        ></el-table-column>
        <el-table-column
          align="center"
          show-overflow-tooltip
          label="操作"
          width="250"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              size="mini"
              @click="executeCase(tableData[scope.$index].id)"
              >执行
            </el-button>
            <el-button
              type="text"
              size="mini"
              @click="caseDetail(tableData[scope.$index].id, 'copy')"
              >复制
            </el-button>

            <el-button
              type="text"
              size="mini"
              @click="caseDetail(tableData[scope.$index].id, 'edit')"
              >编辑
            </el-button>
            <el-button
              type="text"
              size="mini"
              @click="deleteCase(tableData[scope.$index].id)"
              >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @current-change="getCaseList()"
        :current-page.sync="pageNum"
        :page-size="pageSize"
        layout="total,slot, prev, pager, next, jumper"
        :total="total"
        style="margin-top: 10px"
        size="mini"
      >
        <span>{{ pageSize }}条/页</span>
      </el-pagination>
    </el-card>
    <etl-case-dialog
      v-if="dialogVisible"
      :visible="dialogVisible"
      :case-id="caseId"
      :type="dialogVisibleType"
      @listenToChildEvent="callbackFunc"
    ></etl-case-dialog>

    <el-dialog
      title="执行配置"
      :visible.sync="executeDialog"
      width="78%"
      @close="closeExecuteDialog"
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
              <el-form-item label="上报地址" prop="url">
                <el-col :span="12">
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
              <el-form-item
                label="动态参数                                                                "
                prop="valueMap"
              >
                <el-col :span="12">
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
            </el-row>
            <el-row :gutter="20">
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
              <el-form-item
                label="校验方式"
                prop="customCheck"
                class="verifyForm"
              >
                <el-col :span="6">
                  <el-select
                    v-model="configDetail.customCheck"
                    placeholder="请选择"
                    class="verifySelect"
                  >
                    <el-option
                      v-for="item in verifyTypeOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-col>
              </el-form-item>
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
                label="自定义结果"
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
                <el-col :span="6">
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
                <el-col :span="6">
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
        <el-button size="mini" @click="closeExecuteDialog">关闭</el-button>
        <el-button type="primary" size="mini" @click="saveConfig"
          >保存
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import ETLCaseDialog from '../ETLTemplate/ETLCaseDialog';

export default {
  name: 'ETLCaseList',
  components: { etlCaseDialog: ETLCaseDialog },

  data() {
    return {
      loading: false,
      allCaseList: [],
      executeDialog: false,
      configDetail: {
        url: 'http://39.100.208.209:8991/sync_json',
        valueMap:
          '{"appid":"69b2de81e39d4528a06f62cccf280af5","data.#time":"' +
          this.getNowTime() +
          '"}',
        idList: [],
        version: '4.0',
        subVersion: '4.0.1',
        trinoMap:
          '{"url": "jdbc:trino://39.100.208.209:8080","user": "ta","password": "","SSL": "false"}',
        projectId: '3800',
        time: this.getCurrentDate(),
        customCheck: false,
        sqlList:
          'select count(*) as count1 FROM hive.ta."v_user_3800" t where batchNo=\'%s\' and uuid not in (%s),\n select count(*) as count2 FROM hive.ta."v_event_3800" t where batchNo=\'%s\' and uuid not in (%s)',
        expectValueList: '[[{"count":1}],[{"count2":2}]]',
        waitTime: 5
      },
      configRules: {
        url: [{ required: true, message: '上报地址不能为空' }],
        idList: [{ required: true, message: '用例列表不能为空' }],
        trinoMap: [{ required: true, message: 'trino配置不能为空' }],
        projectId: [{ required: true, message: '项目ID不能为空' }],
        time: [{ required: true, message: '上报日期不能为空' }],
        waitTime: [{ required: true, message: '等待时长不能为空' }],
        customCheck: [{ required: true, message: '校验方式不能为空' }]
      },
      caseTypeOptions: [
        { label: '事件', value: 1 },
        { label: '用户属性', value: 2 }
      ],
      verifyTypeOptions: [
        { label: '默认校验', value: false },
        { label: '自定义校验', value: true }
      ],
      pageSize: 10,
      total: 0,
      pageNum: 1,
      caseId: null,
      dialogVisibleType: 1,
      dialogVisible: false,
      searchForm: {
        id: '',
        caseName: '',
        caseType: null,
        addTime: '',
        updateTime: ''
      },
      tableData: []
    };
  },
  methods: {
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
    // 设置行的颜色
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 === 0) {
        return 'warning-row';
      } else {
        return 'success-row';
      }
    },
    // 用于子组件的回调函数
    callbackFunc(fresh) {
      this.dialogVisible = false;
      if (fresh) {
        this.getCaseList('search');
      }
    },
    reSet() {
      this.pageNum = 1;
      this.searchForm = {
        id: '',
        caseName: '',
        caseType: '',
        addTime: '',
        updateTime: ''
      };
      this.getCaseList('search');
    },

    // 用例详情
    caseDetail(id, model) {
      if (model === 'edit') {
        this.dialogVisibleType = 2;
      } else if (model === 'copy') {
        this.dialogVisibleType = 3;
      }
      this.caseId = id;
      this.dialogVisible = true;
    },
    // 获取用例列表
    getCaseList(type) {
      if (type === 'search') {
        this.pageNum = 1;
      }
      let config = {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      };
      let url = String.format('{0}/etlCase/list', this.GLOBAL.ETL_URL);
      this.searchForm['pageNum'] = this.pageNum;

      this.axios
        .post(url, this.searchForm, config)
        .then(response => {
          this.total = response.data.data.total;
          this.tableData = response.data.data.apiEtlCaseList;
          return response;
        })
        .catch(response => {
          return response;
        });
    },
    deleteCase(id) {
      this.$confirm(
        String.format('此操作将永久删除该用例(id:{0}), 是否继续?', id),
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        let config = {
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          }
        };
        let url = String.format('{0}/etlCase/delete', this.GLOBAL.ETL_URL);
        let param = { id: id };
        this.axios
          .post(url, param, config)
          .then(response => {
            if (response.data.code === '1000') {
              this.Message.success(response.data.message);
              this.getCaseList('search');
            } else {
              this.Message.error(response.data.message);
            }
            return response;
          })
          .catch(response => {
            return response;
          });
      });
    },
    openExecuteDialog() {
      let executeCaseConfig = JSON.parse(
        localStorage.getItem('executeCaseConfig')
      );
      if (executeCaseConfig !== null) {
        this.configDetail = executeCaseConfig;
      }

      this.executeDialog = true;
    },
    closeExecuteDialog() {
      this.executeDialog = false;
      this.configDetail = {
        url: 'http://39.100.208.209:8991/sync_json',
        valueMap:
          '{"appid":"69b2de81e39d4528a06f62cccf280af5","data.#time":"' +
          this.getNowTime() +
          '"}',
        idList: [],
        version: '4.0',
        subVersion: '4.0.1',
        trinoMap:
          '{"url": "jdbc:trino://39.100.208.209:8080","user": "ta","password": "","SSL": "false"}',
        projectId: '3800',
        time: this.getCurrentDate(),
        customCheck: false,
        sqlList:
          'select count(*) as count1 FROM hive.ta."v_user_3800" t where batchNo=\'%s\' and uuid not in (%s),\n select count(*) as count2 FROM hive.ta."v_event_3800" t where batchNo=\'%s\' and uuid not in (%s)',
        expectValueList: '[[{"count":1}],[{"count2":2}]]',
        waitTime: 5
      };
    },
    // 保存配置信息到localStorage,不针对单条case,对所有case起作用
    saveConfig() {
      localStorage.setItem(
        'executeCaseConfig',
        JSON.stringify(this.configDetail)
      );
      this.Message.success('保存成功');
    },
    // 执行用例
    executeCase(id) {
      this.loading = true;
      let config = {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      };
      let executeConfig = localStorage.getItem('executeCaseConfig');
      let executeParam = JSON.parse(executeConfig);
      let url = String.format('{0}/etlCase/execute', this.GLOBAL.ETL_URL);
      executeParam.sqlList = executeParam.sqlList.replace('\n', '').split(',');
      executeParam.expectValueList = JSON.parse(executeParam.expectValueList);
      executeParam.idList = [id];
      executeParam.valueMap = JSON.parse(executeParam.valueMap);
      executeParam.trinoMap = JSON.parse(executeParam.trinoMap);
      executeParam.waitTime = Number.parseInt(executeParam.waitTime);

      this.axios
        .post(url, executeParam, config)
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
    },

    // 点击新增按钮
    clickAddBtn() {
      this.dialogVisibleType = 1;
      this.dialogVisible = true;
    }
  },
  beforeMount() {
    this.getCaseList();
    // 如果执行配置为空,则设置
    if (localStorage.getItem('executeCaseConfig') === null) {
      localStorage.setItem(
        'executeCaseConfig',
        JSON.stringify(this.configDetail)
      );
    }
  }
};
</script>

<style scoped>
/deep/ .el-textarea {
  width: 400px !important;
}

/deep/ .el-input {
  width: 150px !important;
}

/deep/ .verifyForm {
  width: 210px !important;
}

/deep/ .verifySelect {
  width: 110px !important;
}

.el-table >>> .warning-row {
  background: oldlace;
}

.el-table >>> .success-row {
  background: #f0f9eb;
}
</style>
