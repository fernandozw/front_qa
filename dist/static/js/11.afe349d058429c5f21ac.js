webpackJsonp([11],{qBpg:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i=a("mvHQ"),n=a.n(i),r={name:"PageDialog",props:{pageId:{type:Number,default:null},type:{type:Number,default:1},visible:{type:Boolean,default:!0}},data:function(){return{dialogVisible:!0,pageDetail:{pageName:""}}},methods:{savePage:function(){var e=this,t=String.format(2===this.type?"{0}/page/update":"{0}/page/add",this.GLOBAL.WEBUI_URL);2!==this.type&&(this.pageDetail.id=null),this.axios.post(t,n()(this.pageDetail),{headers:{"Content-Type":"application/json;charset=UTF-8"}}).then(function(t){return"1000"===t.data.code?(e.Message.success(t.data.msg),e.$emit("listenToChildEvent",!0)):e.Message.error(t.data.msg),t}).catch(function(e){return e})},close:function(){this.$emit("listenToChildEvent",!1)},detail:function(){var e=this,t=String.format("{0}/page/getPageById?id={1}",this.GLOBAL.WEBUI_URL,this.pageId);this.axios.get(t).then(function(t){return e.pageDetail=t.data.data,t}).catch(function(e){return e})}},computed:{dialogTitle:function(){return 2===this.type?"编辑（页面ID："+this.pageId+"）":3===this.type?"复制":"新增"},btnText:function(){return 3===this.type?"复 制":"保 存"},typeText:function(){return 2===this.type?"编辑":3===this.type?"复制":"新增"}},created:function(){this.dialogVisible=this.visible,2!==this.type&&3!==this.type||this.detail()}},l={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[a("el-dialog",{staticClass:"page-dialog",attrs:{title:e.dialogTitle,visible:e.dialogVisible,width:"80%",id:"pageDialog"},on:{"update:visible":function(t){e.dialogVisible=t},close:e.close}},[a("div",[a("el-card",{staticClass:"box-card"},[a("el-form",{attrs:{inline:!0,model:e.pageDetail,size:"mini"}},[a("el-row",{attrs:{gutter:20}},[a("el-col",{attrs:{span:12}},[a("el-form-item",{attrs:{label:"业务名称:"}},[a("el-input",{attrs:{type:"textarea",autosize:{minRows:2,maxRows:4},placeholder:"必填项:请输入内容",clearable:""},model:{value:e.pageDetail.pageName,callback:function(t){e.$set(e.pageDetail,"pageName",t)},expression:"pageDetail.pageName"}})],1)],1)],1)],1)],1)],1),e._v(" "),a("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{attrs:{size:"mini",type:"info"},on:{click:e.close}},[e._v("取 消")]),e._v(" "),a("el-button",{attrs:{size:"mini",type:"primary"},on:{click:e.savePage}},[e._v("\n        "+e._s(e.btnText)+"\n      ")])],1)])],1)},staticRenderFns:[]};var s={name:"Page",components:{pageDialog:a("VU/8")(r,l,!1,function(e){a("r2Y4")},"data-v-45cdb125",null).exports},data:function(){return{dialogVisibleType:1,pageId:null,dialogVisible:!1,searchForm:{id:"",pageName:"",startTime:[],updateTime:[]},tableData:[],currentPage:1,pageSize:10,total:0}},methods:{tableRowClassName:function(e){e.row;return e.rowIndex%2==0?"warning-row":"success-row"},getPageList:function(e){var t=this;"reset"===e?(this.currentPage=1,this.resetSearchForm()):"normal"===e&&(this.currentPage=1);var a=String.format("{0}/page/pages",this.GLOBAL.WEBUI_URL);this.searchForm.pageNum=this.currentPage,this.axios.post(a,n()(this.searchForm),{headers:{"Content-Type":"application/json;charset=UTF-8"}}).then(function(e){return t.tableData=e.data.data.pages,t.total=e.data.data.total,e}).catch(function(e){return e})},callbackFunc:function(e){this.dialogVisible=!1,e&&this.getPageList("normal")},clickAddBtn:function(){this.dialogVisibleType=1,this.dialogVisible=!0},pageDetail:function(e,t){"edit"===t?this.dialogVisibleType=2:"copy"===t&&(this.dialogVisibleType=3),this.pageId=e,this.dialogVisible=!0},deletePage:function(e){var t=this;this.$confirm(String.format("此操作将永久删除该页面(id:{0}), 是否继续?",e),"提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){var a=String.format("{0}/page/delete",t.GLOBAL.WEBUI_URL),i={id:e};t.axios.post(a,n()(i),{headers:{"Content-Type":"application/json;charset=UTF-8"}}).then(function(e){return"1000"===e.data.code?(t.Message.success(e.data.msg),t.getPageList("normal")):(t.Message.error(e.data.msg),t.getPageList("normal")),e}).catch(function(e){return e})})},deleteAll:function(e){var t=this;this.$confirm(String.format("此操作将永久删除该页面(id:{0})及其关联的所有用例、元素、步骤, 是否继续?",e),"提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){var a=String.format("{0}/page/deleteAll",t.GLOBAL.WEBUI_URL),i={id:e};t.axios.post(a,n()(i),{headers:{"Content-Type":"application/json;charset=UTF-8"}}).then(function(e){return"1000"===e.data.code?(t.Message.success(e.data.msg),t.getPageList("normal")):(t.Message.error(e.data.msg),t.getPageList("normal")),e}).catch(function(e){return e})})},resetSearchForm:function(){this.searchForm={id:"",pageName:"",startTime:"",updateTime:""}}},beforeMount:function(){this.getPageList()}},o={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[a("el-form",{attrs:{inline:!0,model:e.searchForm,size:"mini"}},[a("el-form-item",{attrs:{label:"id"}},[a("el-input",{staticStyle:{width:"100px"},attrs:{placeholder:"输入id",clearable:""},model:{value:e.searchForm.id,callback:function(t){e.$set(e.searchForm,"id",t)},expression:"searchForm.id"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"业务名称"}},[a("el-input",{attrs:{placeholder:"输入业务名称",clearable:""},model:{value:e.searchForm.pageName,callback:function(t){e.$set(e.searchForm,"pageName",t)},expression:"searchForm.pageName"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"创建时间"}},[a("el-date-picker",{staticStyle:{width:"360px"},attrs:{type:"datetimerange",align:"right","start-placeholder":"起始时间","end-placeholder":"截止时间","default-time":["00:00:00","23:59:59"],"value-format":"yyyy-MM-dd HH:mm:ss"},model:{value:e.searchForm.startTime,callback:function(t){e.$set(e.searchForm,"startTime",t)},expression:"searchForm.startTime"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"更新时间"}},[a("el-date-picker",{staticStyle:{width:"360px"},attrs:{type:"datetimerange",align:"right","start-placeholder":"起始时间","end-placeholder":"截止时间","default-time":["00:00:00","23:59:59"],"value-format":"yyyy-MM-dd HH:mm:ss"},model:{value:e.searchForm.updateTime,callback:function(t){e.$set(e.searchForm,"updateTime",t)},expression:"searchForm.updateTime"}})],1),e._v(" "),a("el-form-item",{staticStyle:{float:"right","margin-right":"60px"}},[a("el-button",{attrs:{type:"primary"},on:{click:function(t){return e.getPageList("search")}}},[e._v("查询")]),e._v(" "),a("el-button",{attrs:{type:"success"},on:{click:e.clickAddBtn}},[e._v("新增")]),e._v(" "),a("el-button",{attrs:{type:"info"},on:{click:function(t){return e.getPageList("reset")}}},[e._v("重置")])],1)],1),e._v(" "),e.dialogVisible?a("page-dialog",{attrs:{visible:e.dialogVisible,"page-id":e.pageId,type:e.dialogVisibleType},on:{listenToChildEvent:e.callbackFunc}}):e._e(),e._v(" "),a("el-table",{staticStyle:{width:"100%"},attrs:{data:e.tableData,size:"mini",border:"","cell-style":{"text-align":"center"},"header-cell-style":{"text-align":"center"},"row-class-name":e.tableRowClassName}},[a("el-table-column",{attrs:{fixed:"left",prop:"id",label:"id",width:"100","show-overflow-tooltip":""}}),e._v(" "),a("el-table-column",{attrs:{prop:"pageName",label:"业务名称","show-overflow-tooltip":"",width:"350"}}),e._v(" "),a("el-table-column",{attrs:{prop:"addTime",label:"创建时间","show-overflow-tooltip":""}}),e._v(" "),a("el-table-column",{attrs:{prop:"updateTime",label:"更新时间","show-overflow-tooltip":""}}),e._v(" "),a("el-table-column",{attrs:{label:"操作",width:"350",fixed:"right"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("el-button",{attrs:{type:"text",size:"mini"},on:{click:function(a){return e.pageDetail(e.tableData[t.$index].id,"edit")}}},[e._v("编辑\n        ")]),e._v(" "),a("el-button",{attrs:{type:"text",size:"mini"},on:{click:function(a){return e.deletePage(e.tableData[t.$index].id)}}},[e._v("删除\n        ")]),e._v(" "),a("el-button",{attrs:{type:"text",size:"mini"},on:{click:function(a){return e.pageDetail(e.tableData[t.$index].id,"copy")}}},[e._v("复制\n        ")]),e._v(" "),a("el-tooltip",{staticClass:"item",attrs:{effect:"dark",content:"此操作将永久删除该业务,及其关联的所有用例、元素、步骤、校验图片,请谨慎!",placement:"top"}},[a("el-button",{attrs:{type:"text",size:"mini"},on:{click:function(a){return e.deleteAll(e.tableData[t.$index].id)}}},[e._v("全量删除\n          ")])],1)]}}])})],1),e._v(" "),a("el-pagination",{staticStyle:{"margin-top":"10px"},attrs:{"current-page":e.currentPage,"page-size":e.pageSize,layout:"total,slot, prev, pager, next, jumper",total:e.total,size:"mini"},on:{"current-change":function(t){return e.getPageList("search")},"update:currentPage":function(t){e.currentPage=t},"update:current-page":function(t){e.currentPage=t}}},[a("span",[e._v(e._s(e.pageSize)+"条/页")])])],1)},staticRenderFns:[]};var c=a("VU/8")(s,o,!1,function(e){a("r4t/")},"data-v-7f5c3f90",null);t.default=c.exports},r2Y4:function(e,t){},"r4t/":function(e,t){}});
//# sourceMappingURL=11.afe349d058429c5f21ac.js.map