<template>
  <div>
    <div>
      <el-row style="margin-top: -10px">
        <el-col :span="3">
          <span>所属模块</span>
        </el-col>
        <el-col :span="3" :pull="1">
          <el-select
            v-model="module"
            filterable
            placeholder="请选择模块"
            clearable
            size="mini"
          >
            <el-option
              v-for="item in moduleList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <span>执行流水号</span>
        </el-col>
        <el-col :span="3" :pull="1">
          <el-input
            size="mini"
            placeholder="请输入流水号"
            v-model="serialNumber"
            clearable
          >
          </el-input>
        </el-col>
        <el-col :span="3">
          <span>步骤id</span>
        </el-col>
        <el-col :span="3" :pull="2">
          <el-input
            size="mini"
            placeholder="请输入步骤id"
            v-model="stepId"
            clearable
          >
          </el-input>
        </el-col>
        <el-col :span="2">
          <span>步骤名称</span>
        </el-col>
        <el-col :span="3">
          <el-input
            size="mini"
            placeholder="请输入步骤名称"
            v-model="name"
            clearable
          >
          </el-input>
        </el-col>
      </el-row>
      <el-row style="margin-top: 0px">
        <el-col :span="3">
          <span>所属环境</span>
        </el-col>
        <el-col :span="4" :pull="1">
          <el-select
            v-model="env"
            filterable
            placeholder="请选择"
            clearable
            size="mini"
          >
            <el-option
              v-for="item in envList"
              :key="item.index"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="2" :pull="1">
          <span>日&nbsp;&nbsp;&nbsp;期</span>
        </el-col>
        <el-col :span="4" :pull="1">
          <el-date-picker
            v-model="timeRange"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd"
            size="mini"
          >
          </el-date-picker>
        </el-col>
        <el-col :span="4" :push="1">
          <el-button type="primary" round @click="getValue" size="mini"
            >查询
          </el-button>
          <el-button type="info" round @click="reset" size="mini"
            >重置
          </el-button>
        </el-col>
      </el-row>
    </div>

    <div
      id="trendChart"
      style="border-style: solid;border-width: 1px;margin-bottom: 20px;background-color: #fff;border-color:#ebeef5;margin-top: 30px;"
    ></div>
  </div>
</template>

<script>
export default {
  name: 'ResultTrendChart',
  data() {
    return {
      moduleList: [],
      module: '',
      envList: [],
      env: '',
      name: '',
      serialNumber: '',
      stepId: '',
      timeRange: [],
      pickerOptions: this.GLOBAL.pickerOptions,
      chart: {
        credits: { text: '' },
        yAxis: {
          title: {
            text: '成功、失败数（条）：成功率（%）'
          }
        },
        // 整个趋势图的标题
        title: {
          text: '结果趋势图'
        },
        // 横坐标:日期
        xAxis: {
          categories: []
        },
        plotOptions: {
          series: {
            stacking: 'normal'
          }
        },
        labels: {
          items: [
            {
              html: '成功/失败占比',
              style: {
                left: '0px',
                top: '-40px',
                color:
                  (this.Highcharts.theme && this.Highcharts.theme.textColor) ||
                  'black'
              }
            }
          ]
        },
        series: [
          {
            type: 'column',
            name: '成功',
            tooltip: {
              valueSuffix: ' 条'
            },
            data: []
          },
          {
            type: 'column',
            name: '失败',
            tooltip: {
              valueSuffix: ' 条'
            },
            data: []
          },
          {
            type: 'spline',
            name: '成功率',
            tooltip: {
              valueSuffix: ' %'
            },
            data: [],
            marker: {
              lineWidth: 2,
              lineColor: this.Highcharts.getOptions().colors[3],
              fillColor: 'white'
            }
          },
          {
            type: 'pie',
            name: '数量',
            data: [
              ['成功', 0],
              ['失败', 0]
            ],
            center: [20, 10],
            size: 100,
            showInLegend: false,
            dataLabels: {
              enabled: false
            }
          }
        ]
      }
    };
  },
  methods: {
    // 重置查询条件
    reset() {
      this.initConditions();
      this.getConditions();
      this.getValue();
    },
    // 供切换tab查询
    searchForTab() {
      this.getValue();
    },
    // 初始化查询条件
    initConditions() {
      this.module = '';
      this.serialNumber = '';
      this.stepId = '';
      this.name = '';
      this.result = '';
      this.env = '';
      this.timeRange = [];
    },
    // 获取查询条件下拉列表
    getConditions() {
      let moduleUrl = String.format(
        '{0}/condition/moduleList',
        this.GLOBAL.HTTPRUNNER_URL
      );
      let envUrl = String.format(
        '{0}/condition/envList',
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
        .get(envUrl)
        .then(response => {
          if (response.data.code !== '200') {
            this.$message.error(response.data.msg);
          }
          this.envList = response.data.env_list;
          return response;
        })
        .catch(response => {
          return response;
        });
    },
    getValue() {
      const loading = this.$loading({
        lock: true,
        text: '拼命加载中，请稍后~~~',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      let startTime = '';
      let endTime = '';
      if (this.timeRange != null && this.timeRange.length > 0) {
        startTime = this.timeRange[0];
        endTime = this.timeRange[1];
      }
      // 指定参数格式
      let config = {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      };
      let url = String.format(
        '{0}/result/resultPic',
        this.GLOBAL.HTTPRUNNER_URL
      );
      let conditions = {
        start_date: startTime,
        end_date: endTime,
        serial_number: this.serialNumber,
        module: this.module,
        step_id: this.stepId,
        name: this.name,
        env: this.env
      };
      this.axios
        .post(url, JSON.stringify(conditions), config)
        .then(response => {
          if (response.data.code !== '200') {
            this.$message.error(response.data.msg);
          }
          this.chart.xAxis.categories = response.data.date_list;
          this.chart.series[0].data = response.data.success_data;
          this.chart.series[1].data = response.data.fail_data;
          this.chart.series[2].data = response.data.success_rate;
          this.chart.series[3].data = response.data.pie_data;
          this.Highcharts.chart('trendChart', this.chart);
          loading.close();
          return response;
        })
        .catch(response => {
          loading.close();
          return response;
        });
    },
    init() {
      this.getConditions();
      this.getValue();
    },
    // 获取一周前时间
    getWeek(day) {
      let today = new Date();
      let targetDayMilliseconds = today.getTime() - 1000 * 60 * 60 * 24 * day;
      today.setTime(targetDayMilliseconds);
      let tYear = today.getFullYear();
      let tMonth = today.getMonth();
      let tDate = today.getDate();
      tMonth = this.doHandleMonth(tMonth + 1);
      tDate = this.doHandleMonth(tDate);
      return tYear + '-' + tMonth + '-' + tDate;
    },
    // 判断月份是否大于2位
    doHandleMonth(month) {
      let m = month;
      if (month.toString().length === 1) {
        m = '0' + month;
      }
      return m;
    }
  },
  beforeMount() {
    this.timeRange = [this.getWeek(7), this.getWeek(0)];
  }
};
</script>

<style scoped>
.el-row {
  line-height: 40px;
  margin-top: 0px;
}
</style>
