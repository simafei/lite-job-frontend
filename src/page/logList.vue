<template>
    <div class="fillcontain">
        <el-row :gutter="20" class="table_container">
            <el-col :span="5">服务名: <el-input placeholder="服务名" v-model="queryParams.appName" style="width: 60%"></el-input></el-col>
            <el-col :span="5">执行器: <el-input placeholder="执行器" v-model="queryParams.jobHandler" style="width: 60%"></el-input></el-col>
            <el-col :span="12">创建时间:
                <el-date-picker
                    v-model="datePeriod"
                    type="datetimerange"
                    :picker-options="pickerOptions2"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    align="right">
                </el-date-picker></el-col>
            <el-col :span="2"><el-button type="primary" round @click="search()">搜索</el-button></el-col>
        </el-row>
        <div class="table_container">
            <el-table
                :data="tableData"
                style="width: 100%">
                <el-table-column
                  label="服务名"
                  prop="appName">
                </el-table-column>
                <el-table-column
                  label="任务执行器"
                  prop="jobHandler">
                </el-table-column>
                <el-table-column
                  label="运行参数"
                  prop="jobArgs">
                </el-table-column>
                <el-table-column
                    label="触发时间"
                    prop="triggerTime">
                </el-table-column>
                <el-table-column
                    label="触发结果"
                    prop="triggerCode">
                </el-table-column>
                <el-table-column
                    label="触发信息">
                    <el-button type="primary">查看</el-button>
                </el-table-column>
                <el-table-column
                    label="运行地址"
                    prop="handleAddress">
                </el-table-column>
                <el-table-column
                    label="运行时间"
                    prop="handleTime">
                </el-table-column>
                <el-table-column
                    label="运行结果"
                    prop="handleCode">
                </el-table-column>
                <el-table-column
                    label="运行信息">
                    <el-button type="primary">查看</el-button>
                </el-table-column>
            </el-table>
            <div class="Pagination">
                <el-pagination
                  :current-page="currentPage"
                  :page-size="20"
                  layout="total, prev, pager, next"
                  :total="count">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                pickerOptions2: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                count: 0,
                totalPage: 0,
                datePeriod: [],
                queryParams: {},
                tableData: [],
                currentPage: 1
            }
        },
        mounted() {
            this.initData();
        },
        methods: {
            initData() {
                try {
                    this.getJobLogList();
                } catch (err) {
                    console.log('获取数据失败', err);
                }
            },
            search() {
                if (this.datePeriod.length > 0) {
                    this.queryParams.startTime = this.datePeriod[0].getTime();
                    this.queryParams.endTime = this.datePeriod[1].getTime();
                }
                this.getJobLogList();
            },
            getJobLogList() {
                this.$http.get('/job-logs', {params: this.queryParams}).then(function (response) {
                    this.tableData = response.body.items;
                    this.queryParams.currentPage = response.body.currentPage;
                    this.currentPage = response.body.currentPage;
                    this.totalPage = response.body.totalPage;
                    this.count = response.body.totalCount;
                }, function (error) {
                    console.log(error);
                });
            },
        }
    }
</script>

<style lang="less">
	@import '../style/mixin';
    .demo-table-expand {
        font-size: 0;
    }
    .demo-table-expand label {
        width: 90px;
        color: #99a9bf;
    }
    .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
    }
    .table_container{
        padding: 20px;
    }
    .Pagination{
        display: flex;
        justify-content: flex-start;
        margin-top: 8px;
    }
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #20a0ff;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 120px;
        height: 120px;
        line-height: 120px;
        text-align: center;
    }
    .avatar {
        width: 120px;
        height: 120px;
        display: block;
    }
</style>
