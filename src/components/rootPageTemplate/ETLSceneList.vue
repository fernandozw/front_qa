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
        <el-form-item label="场景id">
          <el-input
            v-model="searchForm.id"
            placeholder="输入场景id"
            clearable
            style="width: 150px"
          ></el-input>
        </el-form-item>
        <el-form-item label="场景名称">
          <el-input
            v-model="searchForm.sceneName"
            placeholder="输入场景名称"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="场景类型">
          <el-select
            v-model="searchForm.sceneType"
            filterable
            placeholder="请选择"
            clearable
          >
            <el-option
              v-for="item in sceneTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上报地址">
          <el-input
            v-model="searchForm.url"
            placeholder="输入上报地址"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="主版本">
          <el-input
            v-model="searchForm.version"
            placeholder="输入主版本"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="子版本">
          <el-input
            v-model="searchForm.subVersion"
            placeholder="输入子版本"
            clearable
          ></el-input>
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
          <el-button type="primary" @click="getSceneList('search')"
            >查 询
          </el-button>
          <el-button type="success" @click="clickAddBtn">新 增</el-button>
          <el-button type="danger" @click="batchExecuteDialog = true"
            >批量执行</el-button
          >

          <el-button type="info" @click="reSet">重 置</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        size="mini"
        align="center"
      >
        <el-table-column
          show-overflow-tooltip
          prop="id"
          label="场景id"
          width="100"
          align="center"
          fixed="left"
        >
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="sceneName"
          label="场景名称"
          width="250"
          align="center"
        >
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="sceneType"
          label="场景类型"
          align="center"
          width="100"
        >
          <template slot-scope="scope">
            <span v-if="tableData[scope.$index].sceneType === 1">事件</span>
            <span v-else-if="tableData[scope.$index].sceneType === 2"
              >用户属性</span
            >
            <span v-else>未知</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          show-overflow-tooltip
          prop="idList"
          label="用例集"
          width="200"
        ></el-table-column>
        <el-table-column
          align="center"
          show-overflow-tooltip
          prop="url"
          label="上报地址"
          width="250"
        ></el-table-column>
        <el-table-column
          align="center"
          show-overflow-tooltip
          prop="valueMap"
          label="动态参数"
          width="250"
        ></el-table-column>
        <el-table-column
          align="center"
          show-overflow-tooltip
          prop="version"
          label="主版本"
          width="100"
        ></el-table-column>
        <el-table-column
          align="center"
          show-overflow-tooltip
          prop="subVersion"
          label="子版本"
          width="100"
        ></el-table-column>
        <el-table-column
          align="center"
          show-overflow-tooltip
          prop="trinoMap"
          label="trino配置"
          width="100"
        ></el-table-column>
        <el-table-column
          align="center"
          show-overflow-tooltip
          prop="projectId"
          label="项目Id"
          width="100"
        ></el-table-column>
        <el-table-column
          align="center"
          show-overflow-tooltip
          prop="time"
          label="上报日期"
          width="180"
        ></el-table-column>
        <el-table-column
          align="center"
          show-overflow-tooltip
          prop="waitTime"
          label="等待时长"
          width="100"
        ></el-table-column>
        <el-table-column
          align="center"
          show-overflow-tooltip
          prop="customCheck"
          label="自定义校验"
          width="100"
        >
          <template slot-scope="scope">
            <span v-if="tableData[scope.$index].customCheck === 1">开启</span>
            <span v-else-if="tableData[scope.$index].customCheck === 2"
              >关闭</span
            >
            <span v-else>未知</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          show-overflow-tooltip
          prop="sqlList"
          label="自定义校验SQL"
          width="250"
        ></el-table-column>
        <el-table-column
          align="center"
          show-overflow-tooltip
          prop="expectValueList"
          label="自定义校验期望值"
          width="250"
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
              @click="executeScene(tableData[scope.$index])"
              >执行
            </el-button>
            <el-button
              type="text"
              size="mini"
              @click="sceneDetail(tableData[scope.$index].id, 'copy')"
              >复制
            </el-button>

            <el-button
              type="text"
              size="mini"
              @click="sceneDetail(tableData[scope.$index].id, 'edit')"
              >编辑
            </el-button>
            <el-button
              type="text"
              size="mini"
              @click="deleteScene(tableData[scope.$index].id)"
              >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @current-change="getSceneList()"
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
    <etl-scene-dialog
      v-if="dialogVisible"
      :visible="dialogVisible"
      :scene-id="sceneId"
      :type="dialogVisibleType"
      @listenToChildEvent="callbackFunc"
    ></etl-scene-dialog>
    <el-dialog
      title="批量执行场景"
      :visible.sync="batchExecuteDialog"
      width="60%"
      @close="closeBatchExecuteDialog"
    >
      <div>
        <el-card class="box-card">
          <el-select
            v-model="sceneIdList"
            multiple
            style="margin-left: 20px;width: 600px;"
            placeholder="请选择"
            clearable
          >
            <el-option
              v-for="item in sceneList"
              :key="item.id"
              :label="item.sceneName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-card>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" size="mini">执 行 </el-button>

        <el-button type="primary" size="mini" @click="closeBatchExecuteDialog"
          >取 消</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import ETLSceneDialog from '../ETLTemplate/ETLSceneDialog';

export default {
  name: 'ETLSceneList',
  components: { etlSceneDialog: ETLSceneDialog },

  data() {
    return {
      loading: false,
      allCaseList: [],
      sceneTypeOptions: [
        { label: '事件', value: 1 },
        { label: '用户属性', value: 2 }
      ],
      pageSize: 10,
      total: 0,
      pageNum: 1,
      sceneId: null,
      dialogVisibleType: 1,
      dialogVisible: false,
      searchForm: {
        id: '',
        sceneName: '',
        sceneType: '',
        url: '',
        version: '',
        subVersion: '',
        addTime: '',
        updateTime: ''
      },
      tableData: [],
      batchExecuteDialog: false,
      sceneIdList: [],
      sceneList: [
        {
          id: 6,
          sceneName: '朱伟的自定义场景模板',
          url: 'http://39.100.208.209:8991/sync_json',
          valueMap:
            '{"appid":"69b2de81e39d4528a06f62cccf280af5","data.#time":"2023-05-17 12:38:34.241"}',
          version: '4.0',
          subVersion: '4.0.1',
          trinoMap:
            '{"url": "jdbc:trino://39.100.208.209:8080","user": "ta","password": "","SSL": "false"}',
          projectId: '3800',
          time: '2023-05-17',
          waitTime: 5,
          awaitTime: 0,
          customCheck: 1,
          sqlList:
            'select count(*) as count1 FROM hive.ta."v_user_3800" t where batchNo=\'%s\' and uuid not in (%s),\n select count(*) as count2 FROM hive.ta."v_event_3800" t where batchNo=\'%s\' and uuid not in (%s)',
          expectValueList: '[[{"count1":1}],[{"count2":1}]]',
          idList: '43,41',
          sceneType: 1,
          tableMetaType: null,
          creator: null,
          addTime: '2023-05-17 12:39:37',
          updateTime: '2023-05-17 16:21:22'
        },
        {
          id: 7,
          sceneName: '朱伟的自定义场景模板1',
          url: 'http://39.100.208.209:8991/sync_json',
          valueMap:
            '{"appid":"69b2de81e39d4528a06f62cccf280af5","data.#time":"2023-05-17 12:38:34.241"}',
          version: '4.0',
          subVersion: '4.0.1',
          trinoMap:
            '{"url": "jdbc:trino://39.100.208.209:8080","user": "ta","password": "","SSL": "false"}',
          projectId: '3800',
          time: '2023-05-17',
          waitTime: 5,
          awaitTime: 0,
          customCheck: 1,
          sqlList:
            'select count(*) as count1 FROM hive.ta."v_user_3800" t where batchNo=\'%s\' and uuid not in (%s),\n select count(*) as count2 FROM hive.ta."v_event_3800" t where batchNo=\'%s\' and uuid not in (%s)',
          expectValueList: '[[{"count1":1}],[{"count2":2}]]',
          idList: '43,41',
          sceneType: 1,
          tableMetaType: null,
          creator: null,
          addTime: '2023-05-17 14:03:40',
          updateTime: '2023-05-17 14:11:22'
        },
        {
          id: 8,
          sceneName: 'zhuweitest3',
          url: 'http://39.100.208.209:8991/sync_json',
          valueMap:
            '{"appid":"7ec5cbba58114551b47956f6118e03d9","data.#time":"2023-07-07 09:26:11.458"}',
          version: '4.0',
          subVersion: '4.0.1',
          trinoMap:
            '{"url": "jdbc:trino://39.100.208.209:8080","user": "ta","password": "","SSL": "false"}',
          projectId: '3800',
          time: '2023-05-17',
          waitTime: 10,
          awaitTime: 0,
          customCheck: 2,
          sqlList:
            ' select count(*) as count2 FROM hive.ta."v_event_3800" t where batchNo=\'%s\' and uuid not in (%s)',
          expectValueList: '[[{"count2":1}]]',
          idList: '43',
          sceneType: 1,
          tableMetaType: null,
          creator: null,
          addTime: '2023-05-17 15:34:26',
          updateTime: '2023-05-17 15:34:26'
        },
        {
          id: 9,
          sceneName: '黄鹤的自定义场景',
          url: 'http://39.100.208.209:8991/sync_json',
          valueMap:
            '{"appid":"7ec5cbba58114551b47956f6118e03d9","data.#time":"2023-07-07 09:26:11.458"}',
          version: '4.0',
          subVersion: '4.0.1',
          trinoMap:
            '{"url": "jdbc:trino://39.100.208.209:8080","user": "ta","password": "","SSL": "false"}',
          projectId: '3748',
          time: '2023-07-07',
          waitTime: 2,
          awaitTime: 0,
          customCheck: 1,
          sqlList:
            'select count(*) as count1 FROM hive.ta."v_event_3748" t where batchNo=\'%s\' and uuid not in (%s)',
          expectValueList: '[[{"count1":1}]]',
          idList: '9',
          sceneType: 1,
          tableMetaType: '1',
          creator: null,
          addTime: '2023-05-17 16:23:23',
          updateTime: '2023-05-17 16:23:23'
        },
        {
          id: 10,
          sceneName: '复杂数据类型',
          url: 'http://39.100.208.209:8991/sync_json',
          valueMap:
            '{"appid":"7ec5cbba58114551b47956f6118e03d9","data.#time":"2023-07-07 09:26:11.458"}',
          version: '4.0',
          subVersion: '4.0.1',
          trinoMap:
            '{"url": "jdbc:trino://39.100.208.209:8080","user": "ta","password": "","SSL": "false"}',
          projectId: '3748',
          time: '2023-07-07',
          waitTime: 2,
          awaitTime: 0,
          customCheck: 1,
          sqlList:
            ' select count(*) as count2 FROM hive.ta."v_user_3748" t where batchNo=\'%s\' and uuid not in (%s)',
          expectValueList: '[[{"count2":1}]]',
          idList: '10',
          sceneType: 1,
          tableMetaType: '2',
          creator: null,
          addTime: '2023-05-17 16:26:25',
          updateTime: '2023-05-17 16:27:49'
        },
        {
          id: 11,
          sceneName: '演示',
          url: 'http://39.100.208.209:8991/sync_json',
          valueMap:
            '{"appid":"69b2de81e39d4528a06f62cccf280af5","data.#time":"2023-05-17 17:00:55.616"}',
          version: '4.0',
          subVersion: '4.0.1',
          trinoMap:
            '{"url": "jdbc:trino://39.100.208.209:8080","user": "ta","password": "","SSL": "false"}',
          projectId: '3748',
          time: '2023-05-17',
          waitTime: 10,
          awaitTime: 0,
          customCheck: 2,
          sqlList:
            ' select count(*) as count2 FROM hive.ta."v_event_3748" t where batchNo=\'%s\' and uuid not in (%s)',
          expectValueList: '[[{"count1":1}],[{"count2":2}]]',
          idList: '9,45,44,43,42,41',
          sceneType: 1,
          tableMetaType: null,
          creator: null,
          addTime: '2023-05-17 17:01:29',
          updateTime: '2023-05-17 17:01:29'
        },
        {
          id: 12,
          sceneName: '全选场景',
          url: 'http://39.100.208.209:8991/sync_json',
          valueMap:
            '{"appid":"69b2de81e39d4528a06f62cccf280af5","data.#time":"2023-05-17 17:04:47.436"}',
          version: '4.0',
          subVersion: '4.0.1',
          trinoMap:
            '{"url": "jdbc:trino://39.100.208.209:8080","user": "ta","password": "","SSL": "false"}',
          projectId: '3800',
          time: '2023-05-17',
          waitTime: 5,
          awaitTime: 0,
          customCheck: 2,
          sqlList:
            'select count(*) as count1 FROM hive.ta."v_user_3748" t where batchNo=\'%s\' and uuid not in (%s),\n select count(*) as count2 FROM hive.ta."v_event_3748" t where batchNo=\'%s\' and uuid not in (%s)',
          expectValueList: '[[{"count1":1}],[{"count2":2}]]',
          idList: '9,10,27,28,29,30,31,32,33,35,36,37,39,41,42,43,44,45',
          sceneType: 1,
          tableMetaType: null,
          creator: null,
          addTime: '2023-05-17 17:07:00',
          updateTime: '2023-05-19 16:46:20'
        },
        {
          id: 19,
          sceneName: 'track',
          url: 'http://39.100.208.209:8991/sync_json',
          valueMap:
            '{"appid":"69b2de81e39d4528a06f62cccf280af5","data.#time":"2023-06-01 16:57:53.651"}',
          version: '4.0',
          subVersion: '4.0.1',
          trinoMap:
            '{"url": "jdbc:trino://39.100.208.209:8080","user": "ta","password": "","SSL": "false"}',
          projectId: '3800',
          time: '2023-06-01',
          waitTime: 5,
          awaitTime: 0,
          customCheck: 2,
          sqlList:
            'select count(*) as count1 FROM hive.ta."v_user_3800" t where batchNo=\'%s\' and uuid not in (%s),\n select count(*) as count2 FROM hive.ta."v_event_3800" t where batchNo=\'%s\' and uuid not in (%s)',
          expectValueList: '[[{"count1":1}],[{"count2":2}]]',
          idList: '44',
          sceneType: 1,
          tableMetaType: null,
          creator: '朱伟',
          addTime: '2023-06-01 16:59:32',
          updateTime: '2023-06-01 16:59:32'
        },
        {
          id: 20,
          sceneName: 'track_update',
          url: 'http://39.100.208.209:8991/sync_json',
          valueMap:
            '{"appid":"7ec5cbba58114551b47956f6118e03d9","data.#time":"2023-06-28 13:59:37.516"}',
          version: '4.0',
          subVersion: '4.0.1',
          trinoMap:
            '{"url": "jdbc:trino://39.100.208.209:8080","user": "ta","password": "","SSL": "false"}',
          projectId: '3748',
          time: '2023-06-28',
          waitTime: 5,
          awaitTime: 0,
          customCheck: 2,
          sqlList:
            'select count(*) as count1 FROM hive.ta."v_user_3800" t where batchNo=\'%s\' and uuid not in (%s),\n select count(*) as count2 FROM hive.ta."v_event_3800" t where batchNo=\'%s\' and uuid not in (%s)',
          expectValueList: '[[{"count1":1}],[{"count2":2}]]',
          idList: '10',
          sceneType: 2,
          tableMetaType: 'qweads',
          creator: '朱伟',
          addTime: '2023-06-01 16:59:58',
          updateTime: '2023-06-28 17:06:01'
        },
        {
          id: 21,
          sceneName: 'track_overwrite',
          url: 'http://39.100.208.209:8991/sync_json',
          valueMap:
            '{"appid":"69b2de81e39d4528a06f62cccf280af5","data.#time":"2023-06-01 16:59:59.725"}',
          version: '4.0',
          subVersion: '4.0.1',
          trinoMap:
            '{"url": "jdbc:trino://39.100.208.209:8080","user": "ta","password": "","SSL": "false"}',
          projectId: '3800',
          time: '2023-06-01',
          waitTime: 5,
          awaitTime: 0,
          customCheck: 1,
          sqlList:
            'select count(*) as count1 FROM hive.ta."v_user_3800" t where batchNo=\'%s\' and uuid not in (%s),\n select count(*) as count2 FROM hive.ta."v_event_3800" t where batchNo=\'%s\' and uuid not in (%s)',
          expectValueList: '[[{"count1":1}],[{"count2":2}]]',
          idList: '27',
          sceneType: 1,
          tableMetaType: null,
          creator: '朱伟',
          addTime: '2023-06-01 17:00:23',
          updateTime: '2023-06-01 17:00:23'
        },
        {
          id: 22,
          sceneName: '1231',
          url: 'http://39.100.208.209:8991/sync_json',
          valueMap:
            '{"appid":"69b2de81e39d4528a06f62cccf280af5","data.#time":"2023-06-01 17:16:36.181"}',
          version: '4.0',
          subVersion: '4.0.1',
          trinoMap:
            '{"url": "jdbc:trino://39.100.208.209:8080","user": "ta","password": "","SSL": "false"}',
          projectId: '3800',
          time: '2023-06-01',
          waitTime: 5,
          awaitTime: 1,
          customCheck: 2,
          sqlList:
            'select count(*) as count1 FROM hive.ta."v_user_3800" t where batchNo=\'%s\' and uuid not in (%s),\n select count(*) as count2 FROM hive.ta."v_event_3800" t where batchNo=\'%s\' and uuid not in (%s)',
          expectValueList: '[[{"count1":1}],[{"count2":2}]]',
          idList: '31',
          sceneType: 1,
          tableMetaType: null,
          creator: '朱伟',
          addTime: '2023-06-01 17:16:50',
          updateTime: '2023-06-02 10:49:55'
        }
      ]
    };
  },
  methods: {
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
        this.getSceneList('search');
      }
    },
    // 重置搜索
    reSet() {
      this.pageNum = 1;
      this.searchForm = {
        id: '',
        sceneName: '',
        sceneType: '',
        url: '',
        version: '',
        subVersion: '',
        addTime: '',
        updateTime: ''
      };
      this.getSceneList('search');
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
    closeBatchExecuteDialog() {
      console.log(this.sceneIdList);
      this.batchExecuteDialog = false;
      this.sceneIdList = [];
    },
    // 执行场景
    executeScene(scene) {
      let config = {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      };
      let url = String.format('{0}/etlCase/execute', this.GLOBAL.ETL_URL);
      let executeConfig = JSON.parse(JSON.stringify(scene));
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
      executeConfig.customCheck = executeConfig.customCheck === 1;
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
    },
    // 场景详情
    sceneDetail(id, model) {
      if (model === 'edit') {
        this.dialogVisibleType = 2;
      } else if (model === 'copy') {
        this.dialogVisibleType = 3;
      }
      this.sceneId = id;
      this.dialogVisible = true;
    },
    // 获取场景列表
    getSceneList(type) {
      if (type === 'search') {
        this.pageNum = 1;
      }
      let config = {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      };
      let url = String.format('{0}/etlScene/list', this.GLOBAL.ETL_URL);
      this.searchForm['pageNum'] = this.pageNum;

      this.axios
        .post(url, this.searchForm, config)
        .then(response => {
          this.total = response.data.data.total;
          this.tableData = response.data.data.apiEtlSceneList;
          return response;
        })
        .catch(response => {
          return response;
        });
    },
    // 删除场景
    deleteScene(id) {
      this.$confirm(
        String.format('此操作将永久删除该场景(id:{0}), 是否继续?', id),
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
        let url = String.format('{0}/etlScene/delete', this.GLOBAL.ETL_URL);
        let param = { id: id };
        this.axios
          .post(url, param, config)
          .then(response => {
            if (response.data.code === '1000') {
              this.Message.success(response.data.message);
              this.getSceneList('search');
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
    // 点击新增按钮
    clickAddBtn() {
      this.dialogVisibleType = 1;
      this.dialogVisible = true;
    }
  },
  beforeMount() {
    this.getSceneList();
  }
};
</script>

<style scoped>
.el-table >>> .warning-row {
  background: oldlace;
}

.el-table >>> .success-row {
  background: #f0f9eb;
}
</style>
