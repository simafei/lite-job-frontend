<template>
    <div class="fillcontain">
        <!--<head-top></head-top>-->
        <div class="table_container">
            <el-table
                :data="tableData"
                :row-key="row => row.index"
                style="width: 100%">
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-form label-position="left" inline class="demo-table-expand">
                            <el-form-item label="ID">
                                <span>{{ props.row.id }}</span>
                            </el-form-item>
                            <el-form-item label="任务描述">
                                <span>{{ props.row.description }}</span>
                            </el-form-item>
                            <el-form-item label="超时时间">
                                <span>{{ props.row.timeout }}</span>
                            </el-form-item>
                            <el-form-item label="重试次数">
                                <span>{{ props.row.failRetryCount }}</span>
                            </el-form-item>
                            <el-form-item label="任务参数">
                                <span>{{ props.row.jobArgs }}</span>
                            </el-form-item>
                            <el-form-item label="创建时间">
                                <span>{{ props.row.createTime }}</span>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column
                    label="任务ID"
                    prop="jobHandler">
                </el-table-column>
                <el-table-column
                    label="任务组"
                    prop="appName">
                </el-table-column>
                <el-table-column
                    label="任务名称"
                    prop="jobName">
                </el-table-column>
                <el-table-column
                    label="Cron表达式"
                    prop="cronExpression">
                </el-table-column>
                <el-table-column
                    label="任务状态"
                    prop="status">
                </el-table-column>
                <el-table-column label="操作" width="360">
                    <template slot-scope="scope">
                        <el-button
                            size="small"
                            @click="handleEdit(scope.row)">编辑
                        </el-button>
                        <el-button
                            size="small"
                            type="danger"
                            @click="handleDelete(scope.$index, scope.row)">删除
                        </el-button>
                    </template>
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
    //import headTop from '../components/headTop'

    export default {
        data() {
            return {
                offset: 0,
                limit: 20,
                count: 0,
                totalPage: 0,
                queryParams:{},
                tableData: [],
                currentPage: 1,
                expendRow: []
            }
        },
        mounted() {
            this.initData();
        },
        computed: {},
        components: {
            //headTop,
        },
        methods: {
            initData() {
                try {
                    this.getJobList();
                } catch (err) {
                    console.log('获取数据失败', err);
                }
            },
            getJobList() {
                this.$http.get('/jobs', {params: this.queryParams}).then(function (response) {
                    this.tableData = response.body.items;
                    this.queryParams.page = response.body.currentPage;
                    this.currentPage = response.body.currentPage;
                    this.totalPage = response.body.totalPage;
                    this.count = response.body.totalCount;
                }, function (error) {
                    console.log(error);
                });
            },
            tableRowClassName(row, index) {
                if (index === 1) {
                    return 'info-row';
                } else if (index === 3) {
                    return 'positive-row';
                }
                return '';
            },
        },
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

    .table_container {
        padding: 20px;
    }

    .Pagination {
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
