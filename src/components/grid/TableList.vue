/**
*  table公共组件
*  @params
***
*  :getDataWay 获取表格数据的方式，1.通过url方式2.通过数据数组方式3.请求方式type:"post"|"get",默认"post"
*  :columns 表格列
*  :caption 表名
*  :tableScale 表格放大倍数
*  :tableSize  表格字体大小
*  :pagination  分页：pagination值为空默认分页 ；pagination不为空自定义分页；不传，默认不分页
*  :needLoading 在表格加载数据时显示，默认不显示
*  :spanMethod 合并行或列(方法)
*  :rowClassName 行的 className 的回调方法，也可以使用字符串为所有行设置一个固定的 className。    Function({row, rowIndex})/String
*  :getCheckedData.sync  选中的数据
*  getCurPageCheckedData  抛出当前页数据
*  :tableColumnEmpty 列为空时显示的提示语，默认为'暂无数据'
*  showOverflowTooltip  当内容过长被隐藏时显示 tooltip,默认false--列的属性
*  tableData 表格数据
*  selection 对应列的类型。如果设置了 selection 则显示多选框；如果设置了 index 则显示该行的索引
*  border 表格边框
*  @rowClick  当某一行被点击时会触发该事件
*  @dbRowClick  当某一行被双击时会触发该事件
*  @rowContextmenu    当某一行被鼠标右键点击时会触发该事件
*  @cellClick 当某个单元格被点击时会触发该事件
*  @dbCellClick    当某个单元格被双击击时会触发该事件
*  @currentRowChange  当表格的当前行发生变化的时候会触发该事件
*  @handleSelectionChange  当选择项发生变化时会触发该事件
*  @headerDragend  当拖动表头改变了列的宽度的时候会触发该事件
*  @sortChange    当表格的排序条件发生变化的时候会触发该事件
*  @columnChange  列宽改变
*  exportExcel({url:"后台导出接口",fileName:"导出文件名",idName:"列表导出数据的字段名",idsName:"后台使用的导出字段名",})
*  this.$refs.table.setTableHeight(300)  手动设置表格高度
*/

<template>
    <el-row>
        <el-col :span="24" :class="changeTableSize[tableSize]">
            <div class="table-outer">
                <p v-if="columns.length==0" class="txt-center">{{tableColumnEmpty}}</p>
                <el-table
                        v-if="columns.length>0"
                        ref="ListTable"
                        v-loading="loading"
                        element-loading-text="拼命加载中"
                        :data="tableData"
                        @sort-change="sortChange"
                        @select="select"
                        @select-all="selectAll"
                        @row-click="rowClick"
                        @row-dblclick="dbRowClick"
                        @row-contextmenu="rowContextmenu"
                        @cell-click="cellClick"
                        @cell-dblclick="dbCellClick"
                        @header-dragend="headerDragend"
                        :span-method="getSpanMethodFun"
                        :lazy="lazy"
                        :load="load"
                        :row-key="rowKey"
                        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
                        default-expand-all
                        border
                        class="list_table"
                        :stripe="stripe"
                        :highlight-current-row="highlightCurrentRow"
                        @current-change="currentRowChange"
                        @selection-change="selectionChange"
                        :default-sort="defaultSort"
                        :row-class-name="tableRowClassName"
                        :cell-class-name="cellClassName"
                        :height="maxTbHeight"
                        :show-summary="summary"
                        :header-cell-style="headerCellStyle"
                >

                    <!--row-key="id"-->
                    <!--有row-key不能半选-->
                    <!--checkbox框-->
                    <template v-if="typeof selection && selection">
                        <el-table-column :selectable="selectable"
                                type="selection"
                                width="40">
                        </el-table-column>
                    </template>
                    <!-- 序号-->
                    <template v-if="typeof index && index">
                        <el-table-column
                                type="index"
                                label="序号"
                                width="60">
                        </el-table-column>
                    </template>
                    <slot name="customColumn"></slot>
                    <template v-for="(column, index) in columns" v-if="!customColumnFlag">
                        <el-table-column v-if="!column.template"
                                         :key="`col_${index}`"
                                         :prop="column.prop"
                                         :label="column.label"
                                         :width="column.columnWidth"
                                         :sortable="column.sortable"
                                         :sort-change="{'sortChange':column.sortable}"
                                         :show-overflow-tooltip="true"
                                         :align="column.align"
                                         :formatter=column.formatter
                        >
                        </el-table-column>
                        <slot :name="column.prop" v-if="!!column.template"></slot>
                    </template>
                </el-table>
            </div>
        </el-col>


        <el-col class="table-bottom-page" :span="24" v-if="pagination && pagination.total>0 && columns.length>0"
                :style="{textAlign: setPagination.position}">
            <tablePage :pagination="setPagination" v-on:currentChange="handleCurrentChange"
                       v-on:sizeChange="handleSizeChange"></tablePage>

        </el-col>


    </el-row>
</template>

<script>
    import tablePage from './TablePage.vue'

    var elementResizeDetectorMaker = require("element-resize-detector")
    function noop() {
    }
    export default {
        name: "TableList",
        components: {
            tablePage,
        },
        props: {
            lazy: {
                default: false,
                type: Boolean
            },
            load: {
                default: function () {

                },
                type: Function
            },
            rowKey: {
                default: 'taskId',
                type: String
            },
            headerCellStyleParam: {
                type: Object,
                default() {
                    return {}
                }
            },
            customColumnFlag: {
                default: false,
                type: Boolean
            },
            summary: {
                default: false,
                type: Boolean
            },
            tableColumnEmpty: {
                default: '暂无数据',
                type: String
            },
            checkedData: {
                type: Array,
                default: function () {
                    return []
                }
            },
            needLoading: {
                default: true,
                type: Boolean
            },
            rowCheckboxClick: {
                default: true,
                type: Boolean
            },
            caption: {
                type: String
            },
            tableScale: {
                default: 100,
                type: Number
            },
            displayRows: {
                default: 10,
                type: Number
            },
            dialogTable: {
                default: false,
                type: Boolean
            },
            selection: { //控制复选框，默认不显示复选框
                default: false,
                type: Boolean
            },
            index: { //
                default: false,
                type: Boolean
            },
            getDataWay: Object,//获取table数据的方式
            highlightCurrentRow: Boolean,//高亮显示选中的行

            columns: Array, //获取table的列

            pagination: {},
            defaultSort: Object,
            // height: Number,
            stripe: {
                default: true,
                type: Boolean
            },
            tableSize: {
                default: '中',
                type: String
            },
            spanMethod: {
                default: function () {

                },
                type: Function
            },
            rowClassName: {
                default: function () {

                },
                type: Function
            },
            selectableMethod:{
                type: Function,
                default: function (row) {
                    return true;
                },
            },
            cellClassName: {
                default: '',
                type: String
            }
        },
        data: function () {
            return {
                headerCellStyle: {},
                loading: false,
                border: false,
                dropCol: this.columns,
                rowHeight: 48,
                headerHeight: 48,
                tableData: [],
                setPagination: {}, // 真实的分页对象
                multipleSelection: [],
                tempTotalData: {}, //临时模拟数据用
                changeTableSize: { //设置table字体大小
                    '大': 'list-table-big',
                    '中': 'list-table',
                    '小': 'list-table-small',
                },
                applyTableColWidths: [],//接收改变后的列
                tableWidth: null,
                isShowDefault: false,
                tableHeight: null,
                maxTbHeight: null,
                parentDivWidth: null,
                dataParams: {}
            }
        },
        // computed: {
        // tableHeight() {
        //     return this.displayRows * this.rowHeight + this.headerHeight + 1
        // }
        // },
        created() {
            if (!this.pagination && this.pagination == '') { //list页面只传过来pagination
                this.setPagination = {
                    total: 3,
                    currentPage: 1,
                    pageNum: 1,
                    pageSize: 10,
                    position: 'right',
                    pageSizes: [10, 30, 50, 100, 200],
                    layout: 'sizes,total, prev, pager, next'
                }
            } else if (typeof this.pagination != 'undefined' && this.pagination != '') { //list页面传过来:pagination=pagination
                this.setPagination = this.pagination
                this.setPagination.pageNum = this.pagination.currentPage || 1
            } else { // 不分页
                this.setPagination = {}
            }
            if ((this.getDataWay.dataType).toLowerCase() == 'url') { // 根据url发送请求获取table数据
                delete this.setPagination.total;
                this.getDataWay.firstRequest === undefined && this.loadData()//请求数据
            } else { // 通过list页面直接传table数据
                if (this.getDataWay.data && this.getDataWay.data.length > 0 && this.pagination !== undefined) {
                    this.setPagination.total = this.getDataWay.data.length
                }
                this.tableData = this.getDataWay.data || []
                //实习生周帆修改，修正不分页时，会调用分页函数的bug
                if (Object.keys(this.setPagination).length !== 0) {
                    this.handleCurrentChange(1)
                }
            }

            //表格是否有默认排序
            if (!!this.defaultSort) {
                this.isShowDefault = true
            }

        },
        beforeMount() {
            /**
             * 接收父页面合并行或列的方法
             * @param row, column, rowIndex, columnIndex
             */
            this.getSpanMethodFun = this.spanMethod
            this.tableRowClassName = this.rowClassName
        },
        mounted() {
            this.headerCellStyle = this.headerCellStyleParam;
            this.setTableHeight() //设置表格高度
            if (this.tableScale) { // 表格整体宽度=页面宽度*表格显示百分比率
                this.setTableWidth()
            }
            if (this.caption && !!this.$refs.ListTable) { //添加表格标题
                $(this.$refs.ListTable.$el.querySelector('table')).prepend(`<caption>${this.caption}</caption>`)
            }
            this.computedColumn() //获取列宽
            this.tableWidth = $('.table-outer').width() * this.tableScale / 100
            this.selectData()
            var _this = this
            var erd = elementResizeDetectorMaker()
            // erd.listenTo($(".cp_worktab_content").children(), function (element) { //监听外层是否出现滚动条，如果出现滚动条重新调用设置表格宽度方法
            //     _this.reduceCall(_this.setTableWidth(), 1000)
            // })
            erd.listenTo($(".el-main > div"), _this.reduceCall(function () {
                _this.reduceCall(_this.setTableWidth(111), 1000)
            }, 500))

        },
        updated() {
            // if (this.$refs.ListTable.$refs.headerWrapper) {
            //     this.headerHeight = this.$refs.ListTable.$refs.headerWrapper.clientHeight
            // }
        },
        watch: {
            'getDataWay.data'() {
                // console.log("ss");
                 this.loadData();
            },
            'tableScale'(newValue, oldValue) {
                if (this.tableScale) {
                    this.tableWidth = $('.table-outer').width() * this.tableScale / 100
                    $(".list_table").css({'width': this.tableWidth + 'px', 'max-width': this.tableWidth + 'px'})
                }
            },
            'caption'(newValue, oldValue) {
                if (this.caption) { //添加表格标题
                    if ($(this.$refs.ListTable.$el.querySelector('table')).find('caption').length > 0) {
                        $(this.$refs.ListTable.$el.querySelector('table')).find('caption').remove()
                    }
                    $(this.$refs.ListTable.$el.querySelector('table')).prepend(`<caption>${newValue}</caption>`)
                }
            },
            'columns'(newValue, oldValue) {//列变化
                this.computedColumn() //获取列宽
            },
            '$store.state.screenHeight'(newValue, oldValue) {
                this.setTableHeight()
            },
            '$store.state.screenWidth'(newValue, oldValue) {
                this.setTableWidth()
            },
            '$store.state.leftFold'(newValue, oldValue) { //监听左侧tree_toggle
                var _this = this
                setTimeout(function () {
                    _this.setTableWidth()
                }, 300)
            }
            // '$store.state.contentHeight'(newValue, oldValue) { //监听内容高度
            //     let H=this.$el.getElementsByClassName('table-outer')[0].clientHeight //表格实际高度
            //     if(newValue<H) //判断.cp_worktab_content是否出现滚动条,如果出现滚动条重新计算
            //     {
            //         this.setTableWidth()
            //     }
            // }

        },
        methods: {
            loadData: function (searchParams) { // 获取列表数据
                // this.loading= this.needLoading
                this.$emit('update:getCheckedData', []);
                this.loading = this.needLoading || this.$$util.needLoading || false
                let _this = this
                let dataParams = {}

                if (searchParams) {
                    _this.getDataWay.param = _this.dataParams = dataParams = Object.assign(_this.getDataWay.param, searchParams) // 获取请求参数数据
                    _this.setPagination.pageNum = _this.setPagination.currentPage = 1
                } else {
                    dataParams = _this.getDataWay.param || {}
                }
                if (_this.getDataWay.dataType === 'data') { //直接展示数据
                    _this.setPagination.currentPage = 1;
                    _this.tableData = _this.getDataWay.data;
                    _this.tablePageIsShow = false;
                    // if (_this.getDataWay.data.length === 0){
                    //     _this.setPagination = {};
                    // }
                    _this.$nextTick(function () {
                        _this.$set(_this.setPagination, "total", _this.getDataWay.data.length);
                        _this.tablePageIsShow = true;
                        if (_this.pagination) {//分页时进行数据切割
                            _this.handleCurrentChange(1);
                        }
                    });
                    _this.loading = false;
                    return false
                }
                if (!!_this.getDataWay.type && _this.getDataWay.type == "get") {
                    let pageParam = {}
                    pageParam.currentPage = _this.setPagination.currentPage
                    pageParam.pageSize = _this.setPagination.pageSize
                    this.$axios.get(_this.getDataWay.data, {params: Object.assign(dataParams, pageParam)})
                        .then(function (data) {
                            if (data && data.result) {
                                if (typeof (_this.$parent.formatterData) === "function") {
                                    _this.$emit('formatterData', data.info.list); //暴露方法
                                }
                                _this.tableData = data.info.list

                                if (typeof _this.setPagination && _this.setPagination != '') {
                                    _this.$set(_this.setPagination, "total", data.info.total || data.info.list.length)
                                    //_this.setPagination.total = res.total || data.info.list.length
                                }
                            }
                            _this.loading = false
                        }).then(() => {
                        _this.selectData()
                    })
                } else {
                    let param = Object.assign(dataParams, _this.setPagination);
                    if (param.pageMap) {
                        param.pageMap["currentPage"] = dataParams.currentPage;
                        param.pageMap["pageSize"] = dataParams.pageSize;
                    }
                    this.$axios({
                        method: 'post',
                        url: _this.getDataWay.data,
                        data: param
                    }).then(function (data) {
                        // if (data && data.result) {
                        if (data && data.code == 200) {
                            //拆分数据
                            if (_this.$parent.spiltTableData && typeof (_this.$parent.spiltTableData) === "function") {
                                _this.tableData = _this.$parent.spiltTableData(data.info.list)
                            } else {
                                if (!!data.info) {
                                    _this.tableData = data.info.list || []
                                } else {
                                    _this.tableData = []
                                }
                            }
                            _this.$emit('tableData', _this.tableData);
                            //格式化数据
                            if (_this.dialogTable) { //弹出层嵌套表格
                                if (_this.$parent.$parent.$parent.$parent.formatterData && typeof _this.$parent.$parent.$parent.$parent.formatterData === "function") {
                                    _this.$parent.$parent.$parent.$parent.formatterData(_this.tableData);
                                }
                            } else { //正常表格
                                if (_this.$parent.formatterData && typeof (_this.$parent.formatterData) === "function") {
                                    _this.$parent.formatterData(_this.tableData);
                                }
                            }

                            if (typeof _this.setPagination && _this.setPagination != '') {
                                _this.$set(_this.setPagination, "total", data.info.total || data.info.totalSize || data.info.list.length);
                                //_this.setPagination.total = data.info.total||data.info.list.length
                            }
                            _this.loading = false
                        } else {
                            _this.loading = false;
                            _this.tableData = [];
                            _this.$emit('tableMsg', data.msg);
                            console.info(data.msg)
                            //_this.$message({type: 'warning', message: data.msg})
                        }
                    }).then(() => {
                        _this.selectData()
                    }).catch(function (error) {
                        _this.loading = false
                        window.console.log(error);
                    });
                }
            },
            exportExcel(param, data = {}) {
                //url:"后台导出接口",fileName:"导出文件名",idName:"列表导出数据的字段名",idsName:
                //data一般表示搜索条件会合并到请求条件中
                if (!param.url) {
                    return
                }
                let that = this
                let idsName = param.idsName ? param.idsName : 'ids';    //数组状态下后台要的键
                let idName = param.idName ? param.idName : 'uuid';      //数组状态下后台要的值
                let tasksName = param.idsName ? param.idsName : 'taskIds';    //数组状态下后台要的键
                let taskName = param.idName ? param.idName : 'taskId';      //数组状态下后台要的值  这种需要两个键值对参数, 如果需要多个key可以拿出去在data中传入
                let fileNameKey = param.fileNameKey ? param.fileNameKey : 'fileName';
                let fileName = param.fileName ? param.fileName + '.xls' : this.getCurrentDateStr() + '.xls'
                let lists = []
                this.checkedData.forEach((item) => {
                    lists.push(item[idName])
                })
                let taskList = []
                this.checkedData.forEach((item) => {
                    if (item[taskName]) {
                        taskList.push(item[taskName]);
                    }
                })
                let params = {}
                params[idsName] = lists;
                params[tasksName] = taskList;
                params[fileNameKey] = fileName;
                that.$axios({
                    method: 'post',
                    responseType: 'blob',
                    url: param.url,
                    data: Object.assign({}, this.dataParams, params, data)
                }).then(function (res) {
                    if ('msSaveOrOpenBlob' in navigator) {//兼容ie
                        var blob = new Blob([res], {type: 'application/vnd.ms-excel'});
                        window.navigator.msSaveOrOpenBlob(blob, fileName);
                        return;
                    } else {
                        var elink = document.createElement("a");
                        // 设置下载文件名
                        elink.download = fileName;
                        elink.style.display = "none";
                        let blob = new Blob([res]);
                        elink.href = URL.createObjectURL(blob);
                        document.body.appendChild(elink);
                        // 模拟点击事件
                        elink.click();
                        document.body.removeChild(elink);
                    }


                    /*  let aLink = document.createElement('a')
                      aLink.download = fileName
                      let bolb = new Blob([res])
                      aLink.href = URL.createObjectURL(bolb)
                      aLink.click()*/
                }).catch(function (error) {
                    that.$message({
                        type: 'info',
                        message: '导出失败'
                    });
                })
            },
            select(selection, row) {
                if (selection.indexOf(row) >= 0) {
                    if (this.checkedData.indexOf(row) == -1) {
                        this.checkedData.push(row)
                    }
                } else {
                    this.checkedData.forEach((item, index) => {
                        if (JSON.stringify(item) == JSON.stringify(row)) {
                            this.checkedData.splice(index, 1)
                        }
                    })
                }
            },
            selectAll(selection) {
                let _this = this
                if (selection.length > 0) {
                    selection.forEach(row => {
                        let item = JSON.stringify(row)
                        if (JSON.stringify(_this.checkedData).indexOf(item) == -1) {
                            _this.checkedData.push(row)
                        }
                    })
                } else {
                    _this.tableData.forEach(row => {
                        let item = JSON.stringify(row)
                        _this.checkedData.forEach((item1, index) => {
                            if (JSON.stringify(item1).indexOf(item) == 0) {
                                _this.checkedData.splice(index, 1)
                            }
                        })
                    })
                }
            },
            //选中用户默认要选中的数据
            selectData: function () {
                let _this = this
                let temp = []
                this.checkedData.forEach(item1 => {
                    _this.tableData.forEach(item2 => {
                        if (JSON.stringify(item1) == JSON.stringify(item2)) {
                            temp.push(item2)
                        }
                    })
                })

                temp.forEach(row => {
                    _this.$refs.ListTable.toggleRowSelection(row)
                });
            },

            computedColumn: function () {
                let screenWidth = $('.table-outer').width()
                let isComputed = true //根据isComputed判断表格列是否需要重新计算，默认是重新计算
                this.columns && this.columns.forEach(item => {
                    if (!!item.width) { //对应列有宽度设置时，需要把列的宽度转换为px
                        if ((/^\d.+%$/).test(item.width)) {// 对应列宽度设置为百分比
                            //item.width= parseFloat(item.width)*screenWidth/100.0
                            item.columnWidth = parseFloat(item.width) * screenWidth / 100.0
                        } else { //对应列宽度设置为px
                            item.columnWidth = item.width
                        }
                    } else {
                        isComputed = false; // 存在没有给定宽度的列，所以不需要重新计算
                    }
                })
                if (isComputed && this.columns) { // 处理所有给定列宽度不足百分百的情况，给每列平分宽度
                    let total = 0
                    this.columns.forEach(item => {
                        total += item.columnWidth
                    })
                    if (typeof this.selection && this.selection) {//如果有复选框，减去复选框的宽度
                        total += 55
                    }
                    if (typeof this.index && this.index) {//如果有序号哦，减去序号的宽度
                        total += 60
                    }
                    if (total < screenWidth) {
                        let addw = (screenWidth - total) * 1.0 / this.columns.length
                        this.columns.forEach(item => {
                            item.columnWidth += Math.floor(addw) //避免出现滚动条，浮点数向下取整
                        })
                    }
                }
                // console.log(this.columns,'所有列宽度转换后！！！')
            },
            /* selectionChange: function (val) {
                 this.multipleSelection = val;
                 this.$emit('handleSelectionChange', val); //当前页返回数据
                 this.$emit('update:getCheckedData', this.checkedData); //直接抛出选中数据
             },*/
            selectionChange: function (val) {
                this.multipleSelection = val;
                this.$emit('handleSelectionChange', val); //当前页返回数据
                this.$emit('update:getCheckedData', val); //直接抛出选中数据
            },
            getCheckedData: function () { //抛出选中数据
                return this.checkedData;
            },
            delCheckedData: function (item) {
                let _this = this
                item = item || this.checkedData
                item = [].concat(item)
                item.forEach((delitem) => {
                    let delItem = JSON.stringify(delitem)
                    _this.checkedData.forEach((item1, index) => {
                        if (JSON.stringify(item1).indexOf(delItem) == 0) {
                            _this.checkedData.splice(index, 1)

                        }
                    })
                })

                item.forEach((delitem) => {
                    let delItem = JSON.stringify(delitem)
                    _this.multipleSelection.forEach((item1, index) => {
                        if (JSON.stringify(item1).indexOf(delItem) == 0) {
                            _this.multipleSelection.splice(index, 1)

                        }
                    })
                })
                this.$refs.ListTable.clearSelection()
                this.selectData()

            },
            getCurPageCheckedData: function () { //抛出当前页选中数据
                return this.multipleSelection;
            },
            setTabledata(data) {
                this.tableData = data
                this.$set(this.setPagination, "total", data.length);
            },
            handleCurrentChange: function (val) {
                this.setPagination.currentPage = val
                this.setPagination.pageNum = val
                if ((this.getDataWay.dataType).toLowerCase() == 'url') { //正式环境放开，发送请求分页
                    this.loadData();
                } else {
                    //对数据进行分页
                    let tableData = this.getDataWay.data
                    //let tableData = this.tempTotalData
                    let currentPage = this.setPagination.currentPage
                    let pageSize = this.setPagination.pageSize
                    this.tableData = tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
                }
                this.$emit('currentChange', val);
            },
            handleSizeChange: function (val) {
                this.setPagination.pageSize = val
                this.loadData()
                this.$emit('sizeChange', val);
            },

            currentRowChange: function (row) {
                this.$emit('currentRowChange', row);
            },
            /**
             * table 排序事件
             * @param column prop order
             */
            sortChange: function (column, prop, order) {
                // this.$emit("sortChange", column);
                var _this = this
                let search = {}
                _this.$parent.$children.forEach(item => {
                    if (item.$refs.hasOwnProperty('searchForm')) {
                        let search = item.searchParams // 获取搜索条件
                    }
                })
                search.prop = column.prop || prop
                search.order = column.order || order
                let pageParam = {}
                pageParam.currentPage = _this.setPagination.currentPage
                pageParam.pageSize = _this.setPagination.pageSize
                let dataParams = Object.assign(pageParam, search) // 获取请求参数数据
                _this.loadData(dataParams)
            },
            /**
             * 当某一行被点击时会触发该事件
             * @param row, event, column
             */
            rowClick: function (row, event, column) {
                let _this = this
                if (this.selection && this.rowCheckboxClick) { //存在复选框,行选中切换复选框选中取消
                    if (column.currentTarget.getElementsByClassName("el-checkbox__input")[0].className.indexOf('is-checked') < 0) {
                        _this.multipleSelection.push(row);
                    } else {
                        _this.multipleSelection.forEach((item, index) => {
                            if (JSON.stringify(item) == JSON.stringify(row)) {
                                this.multipleSelection.splice(index, 1)
                            }
                        })
                    }
                    let arr = JSON.parse(JSON.stringify(this.multipleSelection))
                    this.$refs.ListTable.clearSelection()
                    let temp = []
                    arr.forEach(item1 => {
                        _this.tableData.forEach(item2 => {
                            if (JSON.stringify(item1) == JSON.stringify(item2)) {
                                temp.push(item2)
                            }
                        })
                    })
                    temp.forEach(row => {
                        _this.$refs.ListTable.toggleRowSelection(row)
                    });
                    //this.$refs.ListTable.toggleRowSelection(temp,true);
                    if (this.checkedData.indexOf(row) == -1) {
                        this.checkedData.push(row)
                    } else {
                        this.checkedData.forEach((item, index) => {
                            if (JSON.stringify(item) == JSON.stringify(row)) {
                                this.checkedData.splice(index, 1)
                            }
                        })
                    }
                }
                this.$emit("rowClick", row, event, column);
            },
            dbRowClick: function (row, event, column) {
                this.$emit("dbRowClick", row, event, column);
            },
            rowContextmenu: function (row, event, column) {
                this.$emit("dbRowClick", row, event, column);
            },
            cellClick: function (row, column, cell, event) {
                this.$emit("cellClick", row, event, column);
            },
            dbCellClick: function (row, column, cell, event) {
                this.$emit("dbCellClick", row, event, column);
            },
            /**
             * 当拖动表头改变了列的宽度的时候会触发该事件
             * @param newWidth, oldWidth, column, event
             */
            headerDragend: function (newWidth, oldWidth, column, event) {
                var _this = this
                // let screenWidth= this.$el.clientWidth
                let screenWidth = $('.table-outer').width()
                setTimeout(() => {
                    _this.applyTableColWidths = []
                    let applyTable = _this.$refs.ListTable
                    let applyTableCol = applyTable.columns
                    for (let i = 0; i < applyTableCol.length; i++) {
                        //&&applyTableCol[i].type!="selection"&&applyTableCol[i].type!="index"
                        _this.columns.forEach(item => {
                            if (item.label == applyTableCol[i].label) {
                                if (!!applyTableCol[i].width) {
                                    item.width = (applyTableCol[i].width / _this.tableWidth * 100).toFixed(2) + '%'
                                }
                                _this.applyTableColWidths.push(item)
                            }
                        })
                    }
                    _this.$emit('columnChange', _this.applyTableColWidths);
                    _this.computedColumn() //获取列宽
                    // console.log(_this.applyTableColWidths)
                }, 100)
            },
            /**
             * 表格高度控制
             */
            setTableHeight: function (selfHeight) {
                // this.$el.parentNode.parentElement.style.height
                if (selfHeight) {
                    let height = parseInt(selfHeight)
                    if (typeof this.pagination !== 'undefined') { // 分页存在 表格高度=指定高度-分页高度
                        this.maxTbHeight = height - 62
                    } else { // 分页不存在
                        this.maxTbHeight = height
                    }
                    // $(".list_table").css({'height':this.maxTbHeight+'px'})
                    this.$el.getElementsByClassName('list_table')[0].style.height = this.maxTbHeight + 'px'
                } else if (!!this.$el.style.height) {
                    let height = parseInt(this.$el.style.height)
                    if (typeof this.pagination !== 'undefined') { // 分页存在 表格高度=指定高度-分页高度
                        this.maxTbHeight = height - 62
                    } else { // 分页不存在
                        this.maxTbHeight = height
                    }
                    // $(".list_table").css({'height':this.maxTbHeight+'px'})
                    this.$el.getElementsByClassName('list_table')[0].style.height = this.maxTbHeight + 'px'
                }
            },
            /**
             * 表格宽度控制
             */
            setTableWidth: function () {
                let width = null
                if (!!this.$el.getElementsByClassName('table-outer')[0].parentElement.parentElement.parentElement.style.width) {
                    width = this.$el.getElementsByClassName('table-outer')[0].parentElement.parentElement.parentElement.style.width
                } else {
                    width = this.$el.getElementsByClassName('table-outer')[0].parentElement.parentElement.clientWidth * this.tableScale / 100
                }
                if (this.$el.getElementsByClassName('list_table')[0]) {
                    this.$el.getElementsByClassName('list_table')[0].style.width = width + 'px'
                    this.$el.getElementsByClassName('list_table')[0].style.maxWidth = width + 'px'
                }
            },
            // 防止连续调用
            reduceCall: function (fn, wait) {
                let timeout = null;
                return function () {
                    if (timeout !== null) {
                        clearTimeout(timeout)
                    }
                    timeout = setTimeout(fn, wait);
                }
            },
            selectable: function(row,index){
                let flag=true;
                flag=this.selectableMethod(row);
                /*if ((!!this.selectableMethod) && (this.selectableMethod.name != "noop")) {
                    flag=this.selectableMethod(row);
                    return flag;
                }*/
                return flag;
            },
            //实习生周帆添加，调用后实现全选或者反选
            toggleAllSelection() {
                this.$refs.ListTable.toggleAllSelection();
            },
        }
    }
</script>
<style lang="css" scoped>

    .list-table .el-table {
        font-size: 14px;
    }

    .list-table-big .el-table {
        font-size: 18px;
    }

    .list-table-small .el-table {
        font-size: 12px;
    }

    .table-outer {
        overflow-x: auto;
    }

    .table-outer .el-table {
        overflow: auto;
    }

    .table-outer .txt-center {
        text-align: center;
    }

    .table-outer /deep/ .el-table__row .el-button {
        padding: 2px 0px;
    }
</style>
