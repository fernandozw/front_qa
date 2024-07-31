<template>
  <div>
    <el-dialog
      title="下载设置"
      :visible.sync="dialogVisible"
      width="70%"
      class="client-config-dialog"
      @close="close"
      id="clientConfigDialog"
    >
      <div>
        <el-card class="box-card">
          <el-form
            :inline="true"
            :model="configDetail"
            size="mini"
            :rules="driverRules"
            ref="configDetail"
          >
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="操作系统" prop="osName">
                  <el-select
                    v-model="configDetail.osName"
                    clearable
                    placeholder="请选择"
                    size="mini"
                    style="width:180px"
                  >
                    <el-option
                      v-for="item in osList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="系统架构" prop="osArch">
                  <el-select
                    v-model="configDetail.osArch"
                    clearable
                    placeholder="请选择"
                    size="mini"
                    style="width:180px"
                  >
                    <el-option
                      v-for="item in osArchList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="浏览器类型" prop="browserType">
                  <el-select
                    v-model="configDetail.browserType"
                    clearable
                    placeholder="请选择"
                    size="mini"
                    style="width:180px"
                    @change="getDriverVersionList"
                  >
                    <el-option
                      v-for="item in browserList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="driver版本" prop="driverVersion">
                  <el-select
                    v-model="configDetail.driverVersion"
                    clearable
                    placeholder="请选择"
                    size="mini"
                    style="width:180px"
                    :allow-create="configDetail.browserType === 'firefox'"
                    filterable
                    :default-first-option="
                      configDetail.browserType === 'firefox'
                    "
                  >
                    <el-option
                      v-for="item in driverVersionList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                  <el-tooltip
                    v-if="configDetail.browserType === 'firefox'"
                    placement="top"
                    content="若下拉列表为空,可手动输入版本号,格式为v0.34.0,新版本一般中间数字加1"
                  >
                    <i class="el-icon-question"></i>
                  </el-tooltip>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-card>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close" size="mini">取 消</el-button>

        <el-button
          type="primary"
          size="mini"
          @click="startDownload"
          :loading="isLoading"
          >{{ isLoading ? '下载中' : '下 载' }}</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import qs from 'qs';

export default {
  name: 'SetClientConfigDialog',
  props: {
    visible: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      isLoading: false,
      osList: [],
      osArchList: [],
      driverVersionList: [],
      browserList: [],
      dialogVisible: true,
      configDetail: {
        osName: '',
        osArch: '',
        browserType: '',
        driverVersion: ''
      },
      driverRules: {
        osName: [{ required: true, message: '请选择', trigger: 'change' }],
        osArch: [{ required: true, message: '请选择', trigger: 'change' }],
        browserType: [{ required: true, message: '请选择', trigger: 'change' }],
        driverVersion: [
          { required: true, message: '请选择', trigger: 'change' }
        ]
      }
    };
  },
  methods: {
    // 获取driver信息的下啦options
    getDriverConfigs() {
      let url = String.format(
        '{0}/config/getDriverOptions',
        this.GLOBAL.WEBUI_URL
      );
      this.axios
        .get(url)
        .then(response => {
          this.osList = response.data.osList;
          this.osArchList = response.data.osArchList;
          this.browserList = response.data.browserList;
          return response;
        })
        .catch(response => {
          return response;
        });
    },
    // 获取浏览器类型
    getDriverVersionList() {
      this.configDetail.driverVersion = '';
      this.driverVersionList = [];
      let url = '';
      if (this.configDetail.browserType === 'chrome') {
        url = String.format(
          '{0}/config/chromeDriverVersionList',
          this.GLOBAL.WEBUI_URL
        );
      } else if (this.configDetail.browserType === 'firefox') {
        url = String.format(
          '{0}/config/geckodriverVersionList',
          this.GLOBAL.WEBUI_URL
        );
      }
      this.axios
        .get(url)
        .then(response => {
          this.driverVersionList = response.data.versionList;
          return response;
        })
        .catch(response => {
          return response;
        });
    },
    // 下载driver
    async startDownload() {
      this.$refs['configDetail'].validate(async valid => {
        if (valid) {
          this.isLoading = true;
          try {
            let param = qs.stringify(this.configDetail);
            let requestUrl = String.format(
              '{0}/debugCase/downloadDriver?{1}',
              this.GLOBAL.WEBUI_URL,
              param
            );
            // 使用async/await等待axios.get的响应
            const response = await this.axios.get(requestUrl, {
              responseType: 'blob'
            });
            // 创建一个指向blob的URL
            const url = window.URL.createObjectURL(new Blob([response.data]));

            // 创建一个临时的a标签来触发下载
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'debugPackage.zip'); // 设置下载文件名
            document.body.appendChild(link);
            link.click();

            // 清理
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            this.isLoading = false;
          } catch (error) {
            console.error('下载失败:', error);
            this.isLoading = false;
            // 可以添加错误处理逻辑，如显示错误消息
          }
        } else {
          this.$message({
            type: 'error',
            message: '请选择必选项!'
          });
        }
      });
    },

    close() {
      this.$emit('listenToChildEvent', false);
    }
  },

  created() {
    this.dialogVisible = this.visible;
  },
  beforeMount() {
    this.getDriverConfigs();
  }
};
</script>

<style scoped></style>
