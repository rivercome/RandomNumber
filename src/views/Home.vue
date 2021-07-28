<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/yx_logo.png" />
    <!-- <HelloWorld /> -->
    <h1 class="title">述职次序取号系统</h1>
    <div class="login">
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="姓名">
          <el-input v-model="form.userName"></el-input>
        </el-form-item>
        <el-form-item label="身份证后六位">
          <el-input v-model="form.id"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="onSubmit"
            style="border-raidus: 30px"
            >取号</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <!-- 弹窗提示信息 -->
    <el-dialog
      title="取号结果"
      append-to-body
      :visible.sync="dialogVisible"
      width="50%"
    >

      <div style="text-align: center; font-size: 20px">{{ groupMessage }}</div>
      <div style="text-align: center; font-size: 20px; margin-top: 20px">{{ message }}</div>
      <div style="text-align: center; font-size: 20px; margin-top: 20px">
         {{tipsmessage}}&ensp;<span style="color: red;font-size:40px;">{{ messageCode }}</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: "Home",
  components: {
    // HelloWorld
  },
  data() {
    return {
      dialogVisible: false,
      message: "取号成功",
      groupMessage: "",
      messageCode: "20",
      tipsmessage: "您的号码是",
      form: {
        userName: "",
        id: "",
      },
    };
  },
  methods: {
    onSubmit() {
      // axios
      this.$axios({
        // url: "http://192.168.3.224:9520/Random/RandomCtrl/getRandomNum",
        // url: "http://192.168.3.203:9520/Random/RandomCtrl/getRandomNum",
        url: "http://192.168.30.21:9520/Random/RandomCtrl/getRandomNum",
        method: "post",
        data: {
          userName: this.form.userName,
          id: this.form.id,
        },
      }).then((res) => {
          if (res.data.code === "200" || res.data.code === "300") {
            this.message = res.data.msg;
            this.groupMessage = `您是第${res.data.info.groupNum}组`
            this.messageCode = res.data.info.orderNum;
            this.tipsmessage = "您的号码是"
            this.dialogVisible = true;
          } else if ( res.data.code === "100") {
             this.message = res.data.msg;
            this.messageCode = "";
            this.tipsmessage =  "";
            this.dialogVisible = true;
          }
      });
    },
  },
};
</script>
<style lang="css" scoped>
.home {
  position: relative; /*脱离文档流*/
  top: 50%; /*偏移*/
  transform: translateY(-40%);
  min-height: 600px;
  overflow: hidden;
}
.title {
  text-align: center;
  margin-left: 2.5em;
  color: #696969;
}
.login {
  margin: 60px auto;
  width: 27%;
}
/deep/ .el-button--primary {
  width: 100px;
  height: 100px;
  border-radius: 200px;
}
</style>