<template>
  <el-dialog
    title="详情"
    :visible.sync="dialogVisible"
    width="80%"
    class="result-dialog"
    @close="close"
  >
    <div>
      <el-card class="box-card">
        <el-row :gutter="20">
          <el-col :span="4">
            <span>执行流水号: </span>
          </el-col>
          <el-col :span="8" :pull="2">
            <el-input v-model="resultDetail.serial_number" clearable>
            </el-input>
          </el-col>
          <el-col :span="4">
            <span>模块名称: </span>
          </el-col>
          <el-col :span="8" :pull="2">
            <el-input v-model="resultDetail.module" clearable></el-input>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="4">
            <span>步骤id: </span>
          </el-col>
          <el-col :span="8" :pull="2">
            <el-input v-model="resultDetail.step_id" clearable></el-input>
          </el-col>
          <el-col :span="4">
            <span>步骤名称: </span>
          </el-col>
          <el-col :span="8" :pull="2">
            <el-input v-model="resultDetail.name" clearable></el-input>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="3">
            <span>执行结果: </span>
          </el-col>
          <el-col :span="8" :pull="1">
            <el-input v-model="resultDetail.result" clearable></el-input>
          </el-col>
          <el-col :span="3" :push="1">
            <span>所属环境: </span>
          </el-col>
          <el-col :span="8">
            <el-input v-model="resultDetail.env" clearable></el-input>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="3">
            <span>日志id: </span>
          </el-col>
          <el-col :span="8" :pull="1">
            <el-input v-model="resultDetail.log_id" clearable></el-input>
          </el-col>
          <el-col :span="3" :push="1">
            <span>执行耗时:</span>
          </el-col>
          <el-col :span="8">
            <el-input v-model="resultDetail.duration" clearable></el-input>
          </el-col>
        </el-row>
      </el-card>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close" size="mini">关 闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'ResultDialog',
  props: {
    resultId: {
      type: Number,
      default: null
    },
    visible: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      dialogVisible: false,
      resultDetail: {
        id: '',
        serial_number: '',
        module: '',
        step_id: '',
        name: '',
        result: '',
        env: '',
        log_id: '',
        duration: ''
      }
    };
  },
  created() {
    this.dialogVisible = this.visible;
    this.init();
  },
  methods: {
    init() {
      let requestInfoUrl = String.format(
        '{0}/result/resultInfo?id={1}',
        this.GLOBAL.HTTPRUNNER_URL,
        this.resultId
      );
      this.axios
        .get(requestInfoUrl)
        .then(response => {
          if (response.data.code !== '200') {
            this.$message.error(response.data.msg);
          }
          this.resultDetail = response.data.detail;
          return response;
        })
        .catch(response => {
          return response;
        });
    },

    close() {
      this.$emit('listenToChildEvent');
    }
  }
};
</script>

<style scoped>
.result-dialog .el-row {
  line-height: 40px;
  margin-top: 10px;
}

/deep/ .result-dialog .el-input__inner {
  width: 350px;
}

/deep/ .result-dialog .el-textarea__inner {
  width: 350px;
}
</style>
