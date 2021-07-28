<template>
    <div>
        <el-dialog class="tableSet"
                   title="列表设置"
                   :visible="setVisible"
                   :before-close="beforeClose"
                   :close-on-click-modal="false"
                   v-dialogDrag="true"
                   width="50%">   <!--peiyan 添加:close-on-click-modal&v-dialogDrag   dirlog拖动 -->
            <tableList ref="table"
                       :getDataWay="getDataWay"
                       :columns="columns"
                       :index="true"
                       :checkedData="checkedData"
                       selection
                       @handleSelectionChange="handleSelectionChange"
            >
                <el-table-column  label="默认排序" slot="sort" width="120">
                    <template v-slot="scope">
                       <!-- <el-radio v-model="set.defaultSort.prop" :label="scope.row.prop">{{""}}</el-radio>-->
                        <el-button size="mini" type="text" :disabled="((set.defaultSort.prop === scope.row.prop)&&(set.defaultSort.order === 'asc'))" @click.stop="orderFun(scope.row,'asc')">升序</el-button>
                        <el-button size="mini" type="text" :disabled="((set.defaultSort.prop === scope.row.prop)&&(set.defaultSort.order === 'desc'))" @click.stop="orderFun(scope.row,'desc')">降序</el-button>
                    </template>
                </el-table-column>
            </tableList>
            <el-form ref="form" label-width="120px" size="mini" class="form-style">
                <div class="el-dialog__title padd20">显示设置</div>
                <el-col :span="12">
                    <el-form-item label="表格标题">
                        <el-input v-model="set.caption"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="表格放大(%)">
                        <el-input v-model="set.tableScale"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="字体大小" :span="12">
                        <el-select v-model="set.tableSize" placeholder="请选择">
                            <el-option
                                    v-for="(item, index) in fontSizes"
                                    :key="index"
                                    :label="item"
                                    :value="item">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="默认显示条数">
                        <el-select v-model="set.pageSize" placeholder="请选择">
                            <el-option
                                    v-for="(item, index) in set.pageSizes"
                                    :key="index"
                                    :label="item"
                                    :value="item">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button @click="resetForm">恢复默认设置</el-button>
                <el-button type="primary" @click="confirm">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import tableList from '../../components/grid/TableList.vue';
    export default {
        name: "TableSet",
        components:{
            tableList
        },
        props:{
            tableSet:{
                type: Object,
                default(){
                    return {}
                }
            },
            setVisible:{
                type: Boolean,
                default: false
            }
        },
        data(){
            return {
                test:"",
                columnsData:[],
                checkedData:[],
                set:{},
                getDataWay:{dataType:"data",data:[{label:"jds梵蒂冈f"},{label:"的说法jdsf"},{label:"电饭锅jdsf"}]},
                columns :[{
                    "label": "列名",
                    "prop": "label"
                },{
                    "label": "默认排序",
                    "prop": "sort",
                    "template":true
                }
                ],
                fontSizes:['大','中','小'], //表格字体大小设置,
            }
        },
        created(){
            this.columnsData = this.tableSet.columnsData || [];
            this.set = JSON.parse(JSON.stringify(this.tableSet.set))
            this.getDataWay.data = this.columnsData || []
            this.columnsData.forEach(item=>{
                if (item.show){
                    this.checkedData.push(item)
                }
            })
        },
        methods:{
            orderFun(obj1,obj2){
                this.$set(this.set.defaultSort,'prop',obj1.prop)
                this.$set(this.set.defaultSort,'order',obj2)
                this.$refs.table.loadData()
                //this.set.defaultSort.prop=obj1.prop;
                //this.set.defaultSort.order=obj2
            },
            resetForm(){
                this.$emit("resetDefault")
            },
            handleSelectionChange(val) { // 获取选中的列
                let temp = [];
                this.columnsData.forEach((item)=>{
                    if(JSON.stringify(val).indexOf(JSON.stringify(item))>0){
                        item.show = true
                        temp.push(item)
                    }else{
                        item.show = false
                    }
                });
                this.checkedData = temp;
            },
            beforeClose(done){
                this.$emit('update:setVisible', false);
                done()
            },
            confirm(){
                let result = {set:this.set,columnsData:this.columnsData};
                this.$emit("modifySet",result);
                this.$emit('update:setVisible', false);
            },
            cancel(){
                this.$emit('update:setVisible', false);
            }
        }
    }
</script>

<style scoped>
    .tableSet >>> .el-dialog{
        min-width: 500px;
    }
    .tableSet >>> .el-dialog .el-select{
        width: 100%;
    }
    /*.tableSet >>> .el-dialog .el-table__header .el-checkbox::after{*/
    /*    content: "显示";*/
    /*}*/
    .tableSet >>> .el-dialog .el-table-column--selection{
        text-align: center;
    }
</style>