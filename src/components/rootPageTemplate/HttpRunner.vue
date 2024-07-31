<template>
  <div>
    <el-tabs type="border-card" v-model="activeName" @tab-click="switchTab">
      <el-tab-pane label="请求管理" name="requestModule">
        <request-list
          ref="requestModule"
          :request-id-from-list="id"
        ></request-list>
      </el-tab-pane>
      <el-tab-pane label="步骤管理" name="stepModule">
        <step-list ref="stepModule" :step-id-from-list="id"></step-list>
      </el-tab-pane>
      <el-tab-pane label="用例管理" name="caseModule">
        <test-case-list ref="caseModule"></test-case-list>
      </el-tab-pane>
      <el-tab-pane label="执行结果" name="resultModule">
        <result-list ref="resultModule"></result-list>
      </el-tab-pane>
      <el-tab-pane label="结果趋势图" name="chartModule">
        <result-trend-chart ref="chartModule"></result-trend-chart>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import RequestList from '../HttpRunnerTemplate/RequestList.vue';
import StepList from '../HttpRunnerTemplate/StepList.vue';
import TestCaseList from '../HttpRunnerTemplate/TestCaseList.vue';
import ResultList from '../HttpRunnerTemplate/ResultList.vue';
import ResultTrendChart from '../HttpRunnerTemplate/ResultTrendChart.vue';

export default {
  name: 'HttpRunner',
  components: {
    RequestList,
    StepList,
    TestCaseList,
    ResultList,
    ResultTrendChart
  },
  data() {
    return {
      activeName: 'caseModule',
      id: ''
    };
  },
  methods: {
    switchTab() {
      if (this.activeName === 'requestModule') {
        this.$refs.requestModule.init();
      } else if (this.activeName === 'stepModule') {
        this.$refs.stepModule.init();
      } else if (this.activeName === 'caseModule') {
        this.$refs.caseModule.init();
      } else if (this.activeName === 'resultModule') {
        this.$refs.resultModule.init();
      } else if (this.activeName === 'chartModule') {
        this.$refs.chartModule.init();
      }
    }
  },
  beforeMount() {
    let params = this.$route.query;
    if (Object.keys(params).length > 0) {
      this.activeName = params.activeName;
      this.id = params.id;
    }
  }
};
</script>

<style scoped></style>
