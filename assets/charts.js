// assets/charts.js — 女装穿搭知识库 图表逻辑
(function () {
  if (typeof echarts === 'undefined') return;

  var style = getComputedStyle(document.documentElement);
  var accent = style.getPropertyValue('--accent').trim();
  var accent2 = style.getPropertyValue('--accent2').trim();
  var ink = style.getPropertyValue('--ink').trim();
  var muted = style.getPropertyValue('--muted').trim();
  var rule = style.getPropertyValue('--rule').trim();
  var bg2 = style.getPropertyValue('--bg2').trim();
  var bg = style.getPropertyValue('--bg').trim();
  var font = style.getPropertyValue('--font').trim();

  var baseText = { fontFamily: font, color: muted };

  // ---------- Chart 1: 服装电商退货率区间（横向条形） ----------
  var el1 = document.getElementById('chart-returns');
  if (el1) {
    var c1 = echarts.init(el1, null, { renderer: 'svg' });
    var cats = [
      '得物（服饰类目）',
      '韩都衣舍 · 日常',
      '美国线上服装',
      '普通服饰店（多平台）',
      '抖音女装羽绒直播',
      '国内女装 · 平均',
      '国内女装 · 直播场景'
    ];
    var vals = [10, 11, 25, 40, 50, 55, 80];
    c1.setOption({
      animation: false,
      textStyle: baseText,
      grid: { left: 4, right: 56, top: 12, bottom: 8, containLabel: true },
      tooltip: {
        trigger: 'axis',
        appendToBody: true,
        axisPointer: { type: 'shadow' },
        valueFormatter: function (v) { return v + '%'; }
      },
      xAxis: {
        type: 'value',
        max: 100,
        axisLabel: { formatter: '{value}%', color: muted },
        splitLine: { lineStyle: { color: rule } },
        axisLine: { show: false },
        axisTick: { show: false }
      },
      yAxis: {
        type: 'category',
        data: cats,
        axisLabel: { color: ink, fontFamily: font },
        axisLine: { lineStyle: { color: rule } },
        axisTick: { show: false }
      },
      series: [{
        type: 'bar',
        barWidth: '58%',
        data: vals.map(function (v, i) {
          return {
            value: v,
            itemStyle: {
              color: i === 6 ? accent2 : (i >= 5 ? accent : accent + 'aa'),
              borderRadius: [0, 4, 4, 0]
            }
          };
        }),
        label: {
          show: true,
          position: 'right',
          formatter: '{c}%',
          color: ink,
          fontWeight: 600,
          fontFamily: font
        }
      }]
    });
    window.addEventListener('resize', function () { c1.resize(); });
  }

  // ---------- Chart 2: 服装直播话术时间配比（环形） ----------
  var el2 = document.getElementById('chart-flow');
  if (el2) {
    var c2 = echarts.init(el2, null, { renderer: 'svg' });
    c2.setOption({
      animation: false,
      textStyle: baseText,
      color: [accent, accent2, accent + '99', muted],
      tooltip: {
        trigger: 'item',
        appendToBody: true,
        formatter: '{b}：约占 {c}%'
      },
      legend: {
        bottom: 0,
        icon: 'circle',
        textStyle: { color: muted, fontFamily: font }
      },
      series: [{
        type: 'pie',
        radius: ['44%', '70%'],
        center: ['50%', '46%'],
        itemStyle: { borderColor: bg, borderWidth: 2 },
        label: {
          formatter: '{b}\n{c}%',
          color: ink,
          fontFamily: font,
          lineHeight: 16
        },
        labelLine: { length: 10, length2: 12, lineStyle: { color: rule } },
        data: [
          { value: 20, name: '留人' },
          { value: 35, name: '讲品' },
          { value: 25, name: '价值塑造' },
          { value: 20, name: '促单' }
        ]
      }]
    });
    window.addEventListener('resize', function () { c2.resize(); });
  }

  // ---------- Chart 3: 配色比例 60-30-10（堆叠条） ----------
  var el3 = document.getElementById('chart-color');
  if (el3) {
    var c3 = echarts.init(el3, null, { renderer: 'svg' });
    c3.setOption({
      animation: false,
      textStyle: baseText,
      grid: { left: 8, right: 8, top: 10, bottom: 28, containLabel: true },
      tooltip: {
        trigger: 'axis',
        appendToBody: true,
        axisPointer: { type: 'shadow' },
        formatter: function (p) {
          var s = '';
          p.forEach(function (it) { s += it.marker + it.seriesName + '：' + it.value + '%<br/>'; });
          return s;
        }
      },
      legend: {
        bottom: 0,
        icon: 'circle',
        textStyle: { color: muted, fontFamily: font }
      },
      xAxis: { type: 'value', max: 100, show: false },
      yAxis: {
        type: 'category',
        data: ['配色比例'],
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: ink, fontFamily: font }
      },
      series: [
        {
          name: '基础/中性色 60%',
          type: 'bar',
          stack: 't',
          barWidth: '38%',
          data: [60],
          itemStyle: { color: accent },
          label: { show: true, formatter: '60%', color: bg, fontWeight: 700, fontFamily: font }
        },
        {
          name: '辅助/主色 30%',
          type: 'bar',
          stack: 't',
          data: [30],
          itemStyle: { color: accent + '99' },
          label: { show: true, formatter: '30%', color: ink, fontWeight: 700, fontFamily: font }
        },
        {
          name: '点缀色 10%',
          type: 'bar',
          stack: 't',
          data: [10],
          itemStyle: { color: accent2 },
          label: { show: true, formatter: '10%', color: bg, fontWeight: 700, fontFamily: font }
        }
      ]
    });
    window.addEventListener('resize', function () { c3.resize(); });
  }
})();
