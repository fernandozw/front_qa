<template>
  <div>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="80%"
      class="element-dialog"
      @close="close"
      id="elementDialog"
    >
      <div>
        <el-card class="box-card">
          <el-form
            :inline="true"
            :model="cronDetail"
            size="mini"
            :rules="cronDetailRules"
            ref="cronDetail"
          >
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="任务名称:" prop="cronName">
                  <el-input
                    placeholder="必填项:请输入任务名称"
                    v-model="cronDetail.cronName"
                    style="width: 300px"
                    clearable
                  >
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="用例集合:" prop="args">
                  <el-select
                    size="mini"
                    v-model="cronDetail.args"
                    placeholder="请选择用例"
                    multiple
                    filterable
                    style="width: 400px"
                  >
                    <el-option-group
                      v-for="group in pageAndCaseOptions"
                      :key="group.label"
                      :label="group.label"
                    >
                      <el-option
                        v-for="item in group.options"
                        :key="item.value"
                        :label="'「' + item.value + '」' + item.label"
                        :value="item.value"
                      >
                      </el-option>
                    </el-option-group>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="调度时间:" prop="execTime">
                  <el-input
                    placeholder="必填项:请输入内容"
                    v-model="cronDetail.execTime"
                    clearable
                    style="width: 300px"
                  >
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="运行状态:" prop="status">
                  <el-select
                    v-model="cronDetail.status"
                    filterable
                    placeholder="选择运行状态"
                    clearable
                  >
                    <el-option
                      v-for="item in statusList"
                      :key="item.value"
                      :label="item.label"
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
        <el-button size="mini" type="primary" @click="saveCron">
          {{ btnText }}
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'cronDialog',
  props: {
    cronId: {
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
      dialogVisible: true,
      cronDetailRules: {
        cronName: [
          { required: true, message: '任务名称不能为空!', trigger: 'blur' }
        ],
        args: [
          { required: true, message: '调度任务不能为空!', trigger: 'blur' }
        ],
        execTime: [
          { required: true, message: '执行时间不能为空!', trigger: 'blur' },
          {
            validator: this.validCron,
            trigger: 'blur',
            message: '请输入正确的cron表达式,其长度为6位!'
          }
        ],
        status: [
          { required: true, message: '请选择任务状态!', trigger: 'blur' }
        ]
      },
      cronDetail: {
        id: null,
        cronName: '',
        execTime: '',
        args: [],
        status: ''
      },
      statusList: [],
      pageAndCaseOptions: []
    };
  },
  methods: {
    validCron(rule, value, callback) {
      let url = String.format(
        '{0}/cron/validCron?cron={1}',
        this.GLOBAL.WEBUI_URL,
        this.cronDetail.execTime
      );
      this.axios
        .get(url)
        .then(response => {
          if (response.data.code !== '200') {
            callback(new Error(response.data.msg));
          } else {
            callback();
          }
          return response;
        })
        .catch(response => {
          return response;
        });
    },
    // 新增、编辑、复制任务
    saveCron() {
      this.$refs['cronDetail'].validate(valid => {
        if (valid) {
          let url = String.format(
            this.type === 2 ? '{0}/cron/updateCron' : '{0}/cron/addCron',
            this.GLOBAL.WEBUI_URL
          );
          // 指定参数格式
          let config = {
            headers: {
              'Content-Type': 'application/json;charset=UTF-8'
            }
          };
          let param = {
            id: this.cronDetail.id,
            cronName: this.cronDetail.cronName,
            execTime: this.cronDetail.execTime,
            args: this.cronDetail.args.join(','),
            status: this.cronDetail.status
          };
          this.axios
            .post(url, JSON.stringify(param), config)
            .then(response => {
              let responseCode = response.data.code;
              if (responseCode === '1000') {
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
        } else {
          return false;
        }
      });
    },
    // 关闭dialog弹框
    close() {
      this.$emit('listenToChildEvent', false);
    },
    // 获取查询条件
    getConditions() {
      let url = String.format('{0}/cron/getCondition', this.GLOBAL.WEBUI_URL);
      this.axios
        .get(url)
        .then(response => {
          this.statusList = response.data.data.statusList;
          return response;
        })
        .catch(response => {
          return response;
        });
    },
    getPageAndCase() {
      let url = String.format('{0}/case/getPageAndCase', this.GLOBAL.WEBUI_URL);
      this.axios
        .get(url)
        .then(response => {
          this.pageAndCaseOptions = response.data.data;
          return response;
        })
        .catch(response => {
          return response;
        });
    },
    // 任务详情
    detail() {
      this.getPageAndCase();
      this.getConditions();
      let url = String.format(
        '{0}/cron/getCronById?id={1}',
        this.GLOBAL.WEBUI_URL,
        this.cronId
      );
      this.axios
        .get(url)
        .then(response => {
          let dataStrArr = response.data.data.args.split(',');
          // 保存转换后的整型字符串
          let dataIntArr = [];
          dataStrArr.forEach(item => {
            dataIntArr.push(+item);
          });
          response.data.data.args = dataIntArr;
          this.cronDetail = response.data.data;
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
        return '编辑' + '（任务ID：' + this.cronId + '）';
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
      this.getPageAndCase();
    } else if (this.type === 2 || this.type === 3) {
      this.detail();
    }
    // if (this.type === 1) {
    //   this.getConditions();
    // } else if (this.type === 2 || this.type === 3) {
    //   this.init();
    // }
  }
};
</script>

<style scoped></style>
