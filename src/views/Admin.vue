<template>
  <div>
    <el-header class="header-title"> 述职次序取号系统后台总览 </el-header>
    <el-main>
      <!-- 查询 -->
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="组别">
          <el-select v-model="formInline.groupNum">
            <el-option label="第一组" value="1"></el-option>
            <el-option label="第二组" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否取号">
          <el-select v-model="formInline.type">
            <el-option label="已取" value="1"></el-option>
            <el-option label="未取" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
          <el-button type="primary" @click="exportExcel">导出</el-button>
        </el-form-item>
      </el-form>
      <!-- 总览表格信息 -->
      <el-table
        :data="tableData"
        stripe
        border
        height="550"
        style="width: 100%"
      >
        <el-table-column prop="userName" label="姓名"> </el-table-column>
        <el-table-column prop="id" label="身份证后六位"> </el-table-column>

        <el-table-column prop="orderNum" label="号码">
          <template slot-scope="scope">
            {{ scope.row.orderNum ? scope.row.orderNum : "暂未取号" }}
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="block">
        <el-pagination
          @current-change="pageChange"
          layout="prev, pager, next"
          :total="total"
        >
        </el-pagination>
      </div>
    </el-main>
  </div>
</template>

<script>
export default {
  data() {
    return {
      page: {
        currentPage: "1",
        pageSize: "10",
      },
      total: 100,
      //  搜索
      formInline: {
        groupNum: "1",
        type: "0",
      },
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
        },
        {
          date: "2016-05-04",
          name: "王小虎",
        },
        {
          date: "2016-05-01",
          name: "王小虎",
        },
        {
          date: "2016-05-03",
          name: "王小虎",
        },
      ],
    };
  },
  created() {
    this.getAllData();
  },
  methods: {
    getAllData() {
      this.$axios({
        // url: "http://192.168.3.224:9520/Random/RandomCtrl/getRandomList",
        // url: "http://192.168.3.203:9520/Random/RandomCtrl/getRandomList",
        url: "http://192.168.30.21:9520/Random/RandomCtrl/getRandomList",
        method: "post",
        data: {
          ...this.formInline,
          ...this.page,
        },
      }).then((res) => {
        console.log("res", res);
        this.total = Number(res.data.info.total);
        this.tableData = res.data.info.list;
      });
    },
    onSubmit() {
      this.getAllData();
    },
    pageChange(val) {
      this.page.currentPage = val;
      this.getAllData();
    },
    exportExcel() {
      // let fileName = "述职次序";
      // window.open("http://192.168.3.203:9520/Random/RandomCtrl/exportRandomList")
      window.open("http://192.168.30.21:9520/Random/RandomCtrl/exportRandomList")
      // this.$axios({
      //   url: "http://192.168.3.203:9520/Random/RandomCtrl/exportRandomList",
      //   // url: "http://192.168.3.224:9520/Random/RandomCtrl/exportRandomList",
      //   method: "post",
      //   responseType: "blob",
      //   data: {
      //     // 不传参数，全部导出
      //     currentPage: 1,
      //     pageSize: 200,
      //     fileName: "述职次序",
      //   },
      // }).then((res) => {
      //   if ("msSaveOrOpenBlob" in navigator) {
      //     //兼容ie
      //     var blob = new Blob([res], { type: "application/vnd.ms-excel" });
      //     window.navigator.msSaveOrOpenBlob(blob, fileName);
      //     return;
      //   } else {
      //     var elink = document.createElement("a");
      //     // 设置下载文件名
      //     elink.download = fileName;
      //     elink.style.display = "none";
      //     let blob = new Blob([res]);
      //     elink.href = URL.createObjectURL(blob);
      //     document.body.appendChild(elink);
      //     // 模拟点击事件
      //     elink.click();
      //     document.body.removeChild(elink);
      //   }
      // });
    },
  },
};
</script>

<style>
.header-title {
  color: darkgray;
  padding: 20px;
  font-size: 25px;
  background: darkblue;
}
</style>