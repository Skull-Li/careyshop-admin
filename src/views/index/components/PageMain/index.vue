<template>
  <div class="cs-p">
    <div class="cs-card">
      <i class="el-icon-data-line cs-pb">
        <span class="cs-p-5">今日概况</span>
        <span class="cs-card-sub">统计日期：{{updateTime}}</span>
      </i>

      <i class="el-icon-refresh cs-card-sub cs-fr link">
        <span class="cs-pl-5" @click="handleRefresh">刷新</span>
      </i>

      <div flex="cross:center main:center">
        <div
          v-for="(item, key) in todayData"
          :key="key"
          class="cs-today"
          flex-box="1">
          <div class="cs-today__icon cs-fcr cs-pr-10">
            <cs-icon :name="todayMap[key].icon"/>
          </div>

          <div class="cs-today__info link" @click="handleOpen(todayMap[key].url)">
            <cs-count-up class="cs-today__number" :end="item"/>
            <span class="cs-today__desc">{{todayMap[key].name}}</span>
          </div>
        </div>
      </div>
    </div>

    <el-row :gutter="20">
      <el-col :span="14">
        <div class="cs-card">
          <i class="el-icon-collection-tag cs-pb">
            <span class="cs-pl-5">订单状态</span>
          </i>

          <div flex="cross:center main:center">
            <div
              v-for="(item, key) in orderStatus"
              :key="key"
              flex-box="1">
              <div class="cs-order cs-tc link" @click="handleOpen('order-admin-list')">
                <cs-count-up class="cs-order__number" :end="item"/>
                <span class="cs-order__desc">{{orderMap[key]}}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="cs-card">
          <i class="el-icon-collection-tag cs-pb">
            <span class="cs-pl-5">今日订单量</span>
          </i>

          <ve-line
            :data="orderToday"
            :colors="colors"
            :settings="{labelMap: {count: '订单量合计'}}"
            :data-empty="!orderToday.rows.length"/>
        </div>

        <div class="cs-card">
          <i class="el-icon-collection-tag cs-pb">
            <span class="cs-pl-5">今日活跃会员</span>
          </i>

          <ve-line
            :data="clientActive"
            :colors="colors"
            :settings="{labelMap: {count: '活跃数合计'}}"
            :data-empty="!clientActive.rows.length"/>
        </div>

        <el-table
          :data="goodsTop"
          :header-cell-style="{padding: '8px 0'}"
          class="table-card">
          <el-table-column
            type="index"
            label="排行"
            width="56">
          </el-table-column>

          <el-table-column
            label="名称"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <span
                @click="handleView(scope.row.goods_id)"
                class="goods-link">{{scope.row.name}}</span>
            </template>
          </el-table-column>

          <el-table-column
            prop="sales_sum"
            label="销售量"
            align="center"
            width="100">
          </el-table-column>
        </el-table>
      </el-col>

      <el-col :span="10">
        <div class="cs-card">
          <i class="el-icon-collection-tag cs-pb">
            <span class="cs-pl-5">快捷入口</span>
          </i>

          <div flex="cross:center main:center" style="overflow: hidden;">
            <el-button
              v-for="(item, key) in linkData"
              :key="key"
              flex-box="1"
              size="mini"
              :plain="true"
              @click="$open(item.url)">{{item.name}}</el-button>
          </div>

          <div class="careyshop cs-tc cs-pt-10">
            <span>宁波互明科技有限公司 版权所有</span>
          </div>
        </div>

        <div class="cs-card">
          <i class="el-icon-collection-tag cs-pb">
            <span class="cs-pl-5">销售统计</span>
          </i>

          <table class="cs-sales">
            <tbody>
            <tr><td rowspan="3" class="cs-sales__title">昨日销量</td></tr>
            <tr>
              <td>
                <span>订单量</span>
                <cs-count-up
                  class="cs-sales__number"
                  :end="salesStatus.yesterday.count"/>
              </td>
            </tr>
            <tr>
              <td>
                <span>销售额</span>
                <cs-count-up
                  class="cs-sales__number"
                  :end="salesStatus.yesterday.sales"
                  :decimals="2"/>
              </td>
            </tr>

            <tr style="height: 20px;"></tr>

            <tr><td rowspan="3" class="cs-sales__title">本月销量</td></tr>
            <tr>
              <td>
                <span>订单量</span>
                <cs-count-up
                  class="cs-sales__number"
                  :end="salesStatus.month.count"/>
              </td>
            </tr>
            <tr>
              <td>
                <span>销售额</span>
                <cs-count-up
                  class="cs-sales__number"
                  :end="salesStatus.month.sales"
                  :decimals="2"/>
              </td>
            </tr>
            </tbody>
          </table>
        </div>

        <div class="cs-card">
          <i class="el-icon-collection-tag cs-pb">
            <span class="cs-pl-5">订单来源</span>
          </i>
          <ve-pie
            :data="orderSource"
            :data-empty="!orderSource.rows.length"
            :colors="colors"/>
        </div>

        <div class="cs-card">
          <i class="el-icon-collection-tag cs-pb">
            <span class="cs-pl-5">会员等级</span>
          </i>

          <ve-ring
            :data="clientLevel"
            :data-empty="!clientLevel.rows.length"
            :colors="colors"/>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getStatsData } from '@/api/aided/stats'
import colors from '@/plugin/careyshop/charts'
import 'v-charts/lib/style.css'

export default {
  components: {
    VeLine: () => import('v-charts/lib/line.common'),
    VePie: () => import('v-charts/lib/pie.common'),
    VeRing: () => import('v-charts/lib/ring.common')
  },
  data() {
    return {
      colors,
      updateTime: '',
      todayData: {},
      todayMap: {
        order: { icon: 'RectangleCopy153', name: '订单数', url: 'order-admin-list' },
        trade: { icon: 'baoguo_dabao_o', name: '完成数', url: 'order-admin-list' },
        collect: { icon: 'shoucang_o', name: '收藏量', url: 'goods-admin-list' },
        client: { icon: 'RectangleCopy214', name: '新增会员', url: 'member-user-client' },
        service: { icon: 'fuwu_o', name: '售后单', url: 'order-service-list' },
        withdraw: { icon: 'jiekuan_o', name: '提现单', url: 'member-withdraw-list' },
        comment: { icon: 'RectangleCopy240', name: '评价待回复', url: 'goods-opinion-comment' },
        consult: { icon: 'wangwang_o', name: '咨询待回复', url: 'goods-opinion-consult' }
      },
      orderToday: {
        columns: ['hour', 'count'],
        rows: []
      },
      clientActive: {
        columns: ['hour', 'count'],
        rows: []
      },
      orderSource: {
        columns: ['name', 'count'],
        rows: []
      },
      clientLevel: {
        columns: ['name', 'count'],
        rows: []
      },
      goodsTop: [],
      salesStatus: {
        yesterday: {},
        month: {}
      },
      orderMap: {
        not_paid: '待付款',
        paid: '已付款',
        not_shipped: '待发货',
        shipped: '已发货',
        not_comment: '未评价'
      },
      orderStatus: {},
      linkData: [
        { name: '官方主页', url: 'www.careyshop.cn' },
        { name: '开发文档', url: 'doc.careyshop.cn' },
        { name: '使用协议', url: 'www.careyshop.cn/pricing/license.html' },
        { name: '商用授权', url: 'www.careyshop.cn/pricing.html' }
      ]
    }
  },
  mounted() {
    this.handleSubmit()
  },
  methods: {
    handleSubmit() {
      getStatsData({ type: 'index' })
        .then(res => {
          const data = res.data
          if (data) {
            this.updateTime = data.update_time
            this.todayData = data.today_data
            this.orderToday.rows = data.order_today
            this.clientActive.rows = data.client_active
            this.orderSource.rows = data.order_source
            this.clientLevel.rows = data.client_level
            this.goodsTop = data.goods_top.slice(0, 6)
            this.salesStatus = data.sales_status
            this.orderStatus = data.order_status
          }
        })
    },
    handleOpen(name) {
      this.$router.push({ name })
    },
    handleView(goods_id) {
      this.$router.push({
        name: 'goods-admin-view',
        params: { goods_id }
      })
    },
    handleRefresh() {
      this.$router.push({ name: 'refresh' })
    }
  }
}
</script>

<style lang="scss" scoped>
.table-card {
  border: 1px solid $color-border-1;
  border-bottom: none;

  /deep/ td {
    padding: 10px;
  }
}

.link:hover {
  cursor: pointer;
  color: $color-primary !important;
}

.goods-link:hover {
  cursor: pointer;
  color: $color-primary;
  text-decoration: underline;
}

.cs-card {
  color: $color-text-main;
  border: 1px solid $color-border-1;
  background: #FFF;
  font-size: 14px;
  position: relative;
  margin-bottom: 20px;
  padding: 20px;
}

.cs-card-sub {
  font-size: 12px;
  color: $color-info;
}

.cs-today {
  display: inline-flex;

  .cs-today__icon i {
    font-size: 40px;
    color: $color-info;
  }

  .cs-today__info {
    line-height: 24px;

    .cs-today__number {
      display: block;
      font-size: 24px;
    }

    .cs-today__desc {
      color: $color-info;
    }
  }
}

.cs-order {
  span {
    display: block;
  }

  .cs-order__number {
    font-size: 24px;
  }

  .cs-order__desc {
    color: $color-info;
  }
}

.cs-sales {
  color: $color-info;
  border-collapse: collapse;
  border: none;
  width: 100%;

  tr td {
    padding: 14px 0;
    border: solid $color-border-1 1px;
  }

  span {
    padding-left: 10px;
  }

  .cs-sales__title {
    text-align: center;
    background: #F5F7FA;
    width: 30%;
  }

  .cs-sales__number {
    color: $color-text-main;
    font-size: 18px;
  }
}

.careyshop {
  font-size: 13px;
  color: $color-primary;
  line-height: 19px;
  margin-bottom: -10px;
}
</style>
