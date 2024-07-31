<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>driver更新</span>
      </div>
      <el-form
        :inline="true"
        :model="driverConfig"
        class="demo-form-inline"
        style="margin-left: 10px"
        :rules="driverRules"
        ref="driverConfig"
      >
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="更新方式" prop="autoUpdate">
              <el-select
                v-model="autoUpdate"
                placeholder="请选择"
                size="mini"
                style="width:120px"
                @change="changeDriverUpdateType"
              >
                <el-option
                  v-for="item in autoUpdateOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button
                type="primary"
                size="mini"
                :loading="updateLoading"
                @click="updateDriver"
                >{{ updateLoading ? '更新中' : '更新' }}
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20" v-if="autoUpdate === '1'">
          <el-col :span="6">
            <el-form-item label="操作系统" prop="osName">
              <el-select
                v-model="driverConfig.osName"
                clearable
                placeholder="请选择"
                size="mini"
                style="width:120px"
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
          <el-col :span="6">
            <el-form-item label="系统架构" prop="osArch">
              <el-select
                v-model="driverConfig.osArch"
                clearable
                placeholder="请选择"
                size="mini"
                style="width:120px"
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
          <el-col :span="6">
            <el-form-item label="浏览器类型" prop="browserType">
              <el-select
                v-model="driverConfig.browserType"
                clearable
                placeholder="请选择"
                size="mini"
                style="width:120px"
                @change="changeBrowserType"
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
          <el-col :span="6">
            <el-form-item label="driver版本" prop="driverVersion">
              <el-select
                v-model="driverConfig.driverVersion"
                clearable
                placeholder="请选择"
                size="mini"
                style="width:120px"
                :allow-create="driverConfig.browserType === 'firefox'"
                filterable
                :default-first-option="driverConfig.browserType === 'firefox'"
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
                v-if="driverConfig.browserType === 'firefox'"
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
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>浏览器配置</span>
      </div>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-switch
            style="display: block"
            v-model="status"
            active-color="#13ce66"
            inactive-color="gray"
            active-text="无头模式"
            inactive-text="界面模式"
            @change="updateBrowserValue"
          >
          </el-switch>
        </el-col>
        <el-col :span="8">
          <el-switch
            style="display: block"
            v-model="languageStatus"
            active-color="#13ce66"
            inactive-color="gray"
            active-text="中文"
            inactive-text="英文"
            @change="updateLanguageValue"
          >
          </el-switch>
        </el-col>
        <el-col :span="8">
          <div>
            <el-input
              placeholder="例如:1920,900"
              v-model="windowSize"
              style="width: 250px"
              size="mini"
              @change="updateWindowSize"
            >
              <template slot="prepend">浏览器尺寸</template>
            </el-input>
          </div>
        </el-col>
      </el-row>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>调试模式</span>
      </div>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-switch
            style="display: block;margin-top: 10px"
            v-model="debugStatus"
            active-color="#13ce66"
            inactive-color="gray"
            active-text="开启"
            inactive-text="关闭"
            @change="updateDebugHub"
          >
          </el-switch>
        </el-col>
        <el-col :span="6">
          <el-form
            :model="serverForm"
            :rules="serverRules"
            ref="serverForm"
            :inline="true"
          >
            <el-form-item label="服务器ip" prop="serverIp">
              <el-input
                v-model="serverForm.serverIp"
                size="mini"
                @blur="updateServerIp"
              ></el-input>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>消息推送</span>
        <el-tooltip
          content="可配置多个webHookUrl,多个webHookUrl以英文','分割"
          placement="top"
          @click.stop.prevent
        >
          <i class="el-icon-question" />
        </el-tooltip>
      </div>
      <el-form
        :inline="true"
        :model="messageConfig"
        class="demo-form-inline"
        style="margin-left: 10px"
        :rules="rules"
        ref="messageConfig"
      >
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="是否开启" prop="isUse">
              <el-select
                v-model="messageConfig.isUse"
                clearable
                placeholder="请选择是否开启"
                size="mini"
                style="width:150px"
                @change="updateMessageConfig"
              >
                <el-option
                  v-for="item in isUseOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="webHookUrl" prop="webHookUrl">
              <el-input
                type="textarea"
                placeholder="https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=4687dce0-02e5-4238-8404-aecb71beb083,多个地址以英文','分割"
                v-model="messageConfig.webHookUrl"
                style="width: 430px"
                size="mini"
                @change="updateMessageConfig"
                :autosize="{ minRows: 2, maxRows: 4 }"
                clearable
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="触发条件" prop="trigger">
              <el-select
                v-model="messageConfig.trigger"
                clearable
                placeholder="请选择触发条件"
                size="mini"
                style="width:150px"
                @change="updateMessageConfig"
              >
                <el-option
                  v-for="item in triggerOptions"
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
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>基础数据</span>
      </div>
      <el-form
        :inline="true"
        :model="initDataConfig"
        class="demo-form-inline"
        style="margin-left: 10px"
        :rules="initRules"
        ref="initDataConfig"
      >
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="域名" prop="initHost">
              <el-input
                placeholder="http://www.initdata.com"
                v-model="initDataConfig.initHost"
                style="width: 250px"
                size="mini"
                @change="updateInitConfig"
                clearable
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="执行地址" prop="executeUrl">
              <el-input
                placeholder="/init/execute"
                v-model="initDataConfig.executeUrl"
                style="width: 250px"
                size="mini"
                @change="updateInitConfig"
                clearable
              >
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'WebUiConfig',
  data() {
    return {
      updateLoading: false,
      autoUpdate: '0',
      autoUpdateOptions: [
        { value: '0', label: '跟随系统' },
        { value: '1', label: '手动设置' }
      ],
      osList: [],
      osArchList: [],
      browserList: [],
      driverVersionList: [],
      driverConfig: {
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
      },
      serverForm: { serverIp: '' },

      browserValue: '1',
      status: true,
      languageStatus: true,
      languageValue: '1',
      debugStatus: false,
      windowSize: '',
      messageConfig: { isUse: '', webHookUrl: '', trigger: '' },
      initDataConfig: { initHost: '', executeUrl: '' },
      triggerOptions: [
        { value: '0', label: '执行完毕' },
        { value: '1', label: '执行失败' }
      ],
      isUseOptions: [
        { value: '0', label: '关闭' },
        { value: '1', label: '开启' }
      ],
      serverRules: {
        serverIp: [
          { required: true, message: '请输入服务器ip', trigger: 'change' }
        ]
      },
      rules: {
        isUse: [
          { required: true, message: '请选择是否开启', trigger: 'change' }
        ],
        webHookUrl: [
          { required: true, message: '请输入webHookUrl', trigger: 'change' }
        ],
        trigger: [
          { required: true, message: '请选择触发条件', trigger: 'change' }
        ]
      },
      initRules: {
        initHost: [
          { required: true, message: '请输入域名', trigger: 'change' }
        ],
        executeUrl: [
          { required: true, message: '请输入执行地址', trigger: 'change' }
        ]
      }
    };
  },
  methods: {
    getInitConfig() {
      let url = String.format(
        '{0}/config/getInitConfig',
        this.GLOBAL.WEBUI_URL
      );
      this.axios
        .get(url)
        .then(response => {
          this.initDataConfig = response.data.data.initConfig;
          return response;
        })
        .catch(response => {
          return response;
        });
    },
    updateInitConfig() {
      this.$refs['initDataConfig'].validate(valid => {
        if (valid) {
          let config = {
            headers: {
              'Content-Type': 'application/json;charset=UTF-8'
            }
          };
          let url = String.format(
            '{0}/config/updateInitConfig',
            this.GLOBAL.WEBUI_URL
          );
          this.axios
            .post(url, JSON.stringify(this.initDataConfig), config)
            .then(response => {
              if (response.data.code === '1000') {
                this.$message({
                  type: 'success',
                  message: response.data.msg
                });
              } else {
                this.$message({
                  type: 'error',
                  message: response.data.msg
                });
              }

              this.getInitConfig();
              return response;
            })
            .catch(response => {
              return response;
            });
        } else {
          this.$message({
            type: 'error',
            message: '请填写必填项!'
          });
        }
      });
    },
    changeDriverUpdateType() {
      if (this.autoUpdate === '1') {
        this.getDriverConfigs();
      }
    },
    changeBrowserType() {
      this.driverConfig.driverVersion = '';
      this.driverVersionList = [];
      let url = '';
      if (this.driverConfig.browserType === 'chrome') {
        url = String.format(
          '{0}/config/chromeDriverVersionList',
          this.GLOBAL.WEBUI_URL
        );
      } else if (this.driverConfig.browserType === 'firefox') {
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
    updateDriver() {
      if (this.autoUpdate === '1') {
        this.updateDriverForSpecify();
      } else {
        this.updateDriverForAuto();
      }
    },
    updateDriverForSpecify() {
      this.$refs['driverConfig'].validate(valid => {
        if (valid) {
          this.updateLoading = true;
          let config = {
            headers: {
              'Content-Type': 'application/json;charset=UTF-8'
            }
          };
          let url = String.format(
            '{0}/config/updateDriverForSpecify',
            this.GLOBAL.WEBUI_URL
          );

          this.axios
            .post(url, JSON.stringify(this.driverConfig), config)
            .then(response => {
              this.updateLoading = false;
              if (response.data.code === 200) {
                this.$message({
                  type: 'success',
                  message: response.data.msg
                });
              } else {
                this.$message({
                  type: 'error',
                  message: response.data.msg
                });
              }
              return response;
            })
            .catch(response => {
              this.$message({
                type: 'error',
                message: '更新driver异常!'
              });

              this.updateLoading = false;
              return response;
            });
        } else {
          this.$message({
            type: 'error',
            message: '请填写必填项!'
          });
        }
      });
    },
    updateDriverForAuto() {
      this.updateLoading = true;

      let url = String.format(
        '{0}/config/updateDriverForAuto',
        this.GLOBAL.WEBUI_URL
      );

      this.axios
        .get(url)
        .then(response => {
          this.updateLoading = false;
          if (response.data.code === 200) {
            this.$message({
              type: 'success',
              message: response.data.msg
            });
          } else {
            this.$message({
              type: 'error',
              message: response.data.msg
            });
          }
          return response;
        })
        .catch(response => {
          this.$message({
            type: 'error',
            message: '更新driver异常!'
          });

          this.updateLoading = false;
          return response;
        });
    },
    getWindowSize() {
      let url = String.format(
        '{0}/config/getWindowSize',
        this.GLOBAL.WEBUI_URL
      );
      this.axios
        .get(url)
        .then(response => {
          this.windowSize = response.data.data.windowSize;
          return response;
        })
        .catch(response => {
          return response;
        });
    },
    updateWindowSize() {
      let config = {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      };
      let url = String.format(
        '{0}/config/updateWindowSize',
        this.GLOBAL.WEBUI_URL
      );
      this.axios
        .post(url, JSON.stringify({ windowSize: this.windowSize }), config)
        .then(response => {
          this.getWindowSize();
          return response;
        })
        .catch(response => {
          return response;
        });
    },
    getBrowserValue() {
      let url = String.format('{0}/config/getConfig', this.GLOBAL.WEBUI_URL);
      this.axios
        .get(url)
        .then(response => {
          this.browserValue = response.data.data.headless;
          this.status = this.browserValue === '1';
          return response;
        })
        .catch(response => {
          return response;
        });
    },
    getServerIp() {
      let url = String.format('{0}/config/getServerIp', this.GLOBAL.WEBUI_URL);
      this.axios
        .get(url)
        .then(response => {
          this.serverForm.serverIp = response.data.data.serverIp;
          return response;
        })
        .catch(response => {
          return response;
        });
    },
    getDebugValue() {
      let url = String.format('{0}/debugCase/getStatus', this.GLOBAL.WEBUI_URL);
      this.axios
        .get(url)
        .then(response => {
          this.debugStatus = response.data.data.status;
          return response;
        })
        .catch(response => {
          return response;
        });
    },
    updateDebugHub() {
      let config = {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      };
      let url = String.format(
        '{0}/debugCase/updateDebugHub',
        this.GLOBAL.WEBUI_URL
      );

      this.axios
        .post(
          url,
          JSON.stringify({ status: this.debugStatus ? '1' : '0' }),
          config
        )
        .then(response => {
          this.getDebugValue();
          return response;
        })
        .catch(response => {
          return response;
        });
    },
    getLanguageValue() {
      let url = String.format('{0}/config/getLanguage', this.GLOBAL.WEBUI_URL);
      this.axios
        .get(url)
        .then(response => {
          this.languageValue = response.data.data.language;
          this.languageStatus = this.languageValue === '1';
          return response;
        })
        .catch(response => {
          return response;
        });
    },
    getMessageConfig() {
      let url = String.format(
        '{0}/config/getMessageConfig',
        this.GLOBAL.WEBUI_URL
      );
      this.axios
        .get(url)
        .then(response => {
          this.messageConfig = response.data.data.messageConfig;
          return response;
        })
        .catch(response => {
          return response;
        });
    },
    updateMessageConfig() {
      this.$refs['messageConfig'].validate(valid => {
        if (valid) {
          let config = {
            headers: {
              'Content-Type': 'application/json;charset=UTF-8'
            }
          };
          let url = String.format(
            '{0}/config/updateMessageConfig',
            this.GLOBAL.WEBUI_URL
          );
          this.axios
            .post(url, JSON.stringify(this.messageConfig), config)
            .then(response => {
              if (response.data.code === '1000') {
                this.$message({
                  type: 'success',
                  message: response.data.msg
                });
              } else {
                this.$message({
                  type: 'error',
                  message: response.data.msg
                });
              }

              this.getMessageConfig();
              return response;
            })
            .catch(response => {
              return response;
            });
        } else {
          this.$message({
            type: 'error',
            message: '请填写必填项!'
          });
        }
      });
    },
    updateBrowserValue() {
      let config = {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      };
      this.browserValue = this.status ? '1' : '0';
      let url = String.format('{0}/config/updateConfig', this.GLOBAL.WEBUI_URL);
      this.axios
        .post(url, JSON.stringify({ headless: this.browserValue }), config)
        .then(response => {
          this.getBrowserValue();
          return response;
        })
        .catch(response => {
          return response;
        });
    },
    updateServerIp() {
      this.$refs['serverForm'].validate(valid => {
        if (valid) {
          let config = {
            headers: {
              'Content-Type': 'application/json;charset=UTF-8'
            }
          };
          let url = String.format(
            '{0}/config/updateServerIp',
            this.GLOBAL.WEBUI_URL
          );
          this.axios
            .post(
              url,
              JSON.stringify({ serverIp: this.serverForm.serverIp }),
              config
            )
            .then(response => {
              this.getServerIp();
              return response;
            })
            .catch(response => {
              return response;
            });
        } else {
          this.$message.error('请输入服务器ip!');
        }
      });
    },
    updateLanguageValue() {
      let config = {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      };
      this.languageValue = this.languageStatus ? '1' : '0';
      let url = String.format(
        '{0}/config/updateLanguage',
        this.GLOBAL.WEBUI_URL
      );
      this.axios
        .post(url, JSON.stringify({ language: this.languageValue }), config)
        .then(response => {
          this.getLanguageValue();
          return response;
        })
        .catch(response => {
          return response;
        });
    }
  },

  beforeMount() {
    this.getBrowserValue();
    this.getLanguageValue();
    this.getDebugValue();
    this.getServerIp();
    this.getWindowSize();
    this.getMessageConfig();
    this.getInitConfig();
  }
};
</script>

<style scoped>
.el-row {
  line-height: 40px;
  margin-top: 10px;
}

.el-card >>> .el-card__header {
  background: mediumturquoise !important;
}
</style>
