/* eslint-disable no-new */
/* eslint-disable */
module.exports = [
  {
    //一级
    entity: {
      id: 1,
      index: '1',
      icon: 'iconfont icon-a-dangan_huaban1fuben19',
      title: '数据创造'
    },
    //二级
    childs: [
      {
        entity: {
          id: 1 - 1,
          index: '1 - 1',
          icon: 'iconfont icon-system-configuration',
          title: '项目配置',
          component: 'ProjectConfig',
          path: '/create/projectConfig'
        }
      },
      {
        entity: {
          id: 1 - 2,
          index: '1 - 2',
          icon: 'iconfont icon-script-language',
          title: '代码脚本',
          component: 'ScriptConfig',
          path: '/create/scriptConfig'
        }
      },
      {
        entity: {
          id: 1 - 3,
          index: '1 - 3',
          icon: 'iconfont icon-jar',
          title: 'JAR包管理',
          component: 'JarPackage',
          path: '/create/jarPackage'
        }
      },
      {
        entity: {
          id: 1 - 4,
          index: '1 - 4',
          icon: 'iconfont icon-shujuyuan',
          title: '数据源管理',
          component: 'DataSource',
          path: '/create/dataSource'
        }
      }
    ]
  },
  {
    //一级
    entity: {
      id: 2,
      index: '2',
      icon: 'iconfont icon-icon',
      title: '接口自动化'
    },
    //二级
    childs: [
      {
        entity: {
          id: 2 - 1,
          index: '2 - 1',
          icon: 'iconfont icon-lanmupeizhi',
          title: '配置模块',
          component: 'Config',
          path: '/configInterface/config'
        }
      },
      {
        entity: {
          id: 2 - 2,
          index: '2 - 2',
          icon: 'iconfont icon-test-case-group',
          title: '测试用例',
          component: 'Case',
          path: '/caseInterface/case'
        }
      },
      {
        entity: {
          id: 2 - 3,
          index: '2 - 3',
          icon: 'iconfont icon-changjing',
          title: '测试场景',
          component: 'Scene',
          path: '/sceneInterface/scene'
        }
      },
      {
        entity: {
          id: 2 - 4,
          index: '2 - 4',
          icon: 'iconfont icon-renwuzhongxin',
          title: '任务配置',
          component: 'Task',
          path: '/taskInterface/task'
        }
      },
      {
        entity: {
          id: 2 - 5,
          index: '2 - 5',
          icon: 'iconfont icon-gongju',
          title: '小工具',
          component: 'Tool',
          path: '/toolInterface/tool'
        }
      },
      {
        entity: {
          id: 2 - 6,
          index: '2 - 6',
          icon: 'iconfont icon-HTTP-Response',
          title: 'HttpRunner',
          component: 'HttpRunner',
          path: '/httpRunnerTest/httpRunner'
        }
      }
    ]
  },


  {
    //一级
    entity: {
      id: 4,
      index: '4',
      icon: 'iconfont icon-web2',
      title: 'UI自动化'
    },
    //二级
    childs: [
      {
        entity: {
          id: 4 - 1,
          index: '4 - 1',
          icon: 'iconfont icon-peizhixinxi',
          title: '配置信息',
          component: 'WebUiConfig',
          path: '/webUiCase/webUiConfig'
        }
      },
      {
        entity: {
          id: 4 - 2,
          index: '4 - 2',
          icon: 'iconfont icon-page',
          title: '业务管理',
          component: 'Page',
          path: '/webUiCase/page'
        }
      },
      {
        entity: {
          id: 4 - 3,
          index: '4 - 3',
          icon: 'iconfont icon-cryo',
          title: '元素管理',
          component: 'Element',
          path: '/webUiCase/element'
        }
      },
      {
        entity: {
          id: 4 - 4,
          index: '4 - 4',
          icon: 'iconfont icon-buzhoulianxian',
          title: '步骤管理',
          component: 'Step',
          path: '/webUiCase/step'
        }
      },
      {
        entity: {
          id: 4 - 5,
          index: '4 - 5',
          icon: 'iconfont icon-briefcase',
          title: '用例管理',
          component: 'WebUiCase',
          path: '/webUiCase/webUiCase'
        }
      },
      {
        entity: {
          id: 4 - 6,
          index: '4 - 6',
          icon: 'iconfont icon-tigaofenxijieguokekaoxing',
          title: '测试结果',
          component: 'UiCaseResult',
          path: '/webUiCase/uiCaseResult'
        }
      },
      {
        entity: {
          id: 4 - 7,
          index: '4 - 7',
          icon: 'iconfont icon-dingshirenwuguanli',
          title: '定时任务',
          component: 'WebUiTask',
          path: '/webUiCase/webUiTask'
        }
      }
    ]
  },
  {
    //一级
    entity: {
      id: 9,
      index: '9',
      icon: 'iconfont icon-etl',
      title: 'ETL自动化'
    },
    //二级
    childs: [
      {
        entity: {
          id: 9 - 1,
          index: '9 - 1',
          icon: 'iconfont icon-beikongshuiwupingtaimenhu-tubiao_shujuETLgongju',
          title: 'ETL用例',
          component: 'ETLCaseList',
          path: '/etl/etlCaseList'
        }
      },
      {
        entity: {
          id: 9 - 4,
          index: '9 - 4',
          icon: 'iconfont icon-a-filetarget-line',
          title: 'ETL场景',
          component: 'ETLSceneList',
          path: '/etl/etlSceneList'
        }
      },
      {
        entity: {
          id: 9 - 5,
          index: '9 - 5',
          icon: 'iconfont icon-piliangzhihang',
          title: '批量执行',
          component: 'ETLBatchCaseList',
          path: '/etl/etlBatchCaseList'
        }
      },
      {
        entity: {
          id: 9 - 2,
          index: '9 - 2',
          icon: 'iconfont icon-tongjichaifenjieguo',
          title: '用例结果',
          component: 'ETLResultDetailList',
          path: '/etl/resultDetailList'
        }
      },
      {
        entity: {
          id: 9 - 3,
          index: '9 - 3',
          icon: 'iconfont icon-xitongzonglan',
          title: '结果总览',
          component: 'ETLResultList',
          path: '/etl/etlResultList'
        }
      }
    ]
  }
];
