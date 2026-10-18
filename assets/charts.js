// assets/charts.js — 女装穿搭知识库 图表逻辑
// 首次有图表进入视口时，才动态加载 echarts 并初始化，避免无条件下载 1MB 库。
(function () {
  var ECHARTS_SRC = './_shared/js/echarts.min.js';
  var loadingPromise = null;
  var instances = [];
  var inited = {};

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

  // ---------- 图 7-1：服装电商退货率区间（横向条形） ----------
  function buildReturns(el) {
    var c = echarts.init(el, null, { renderer: 'svg' });
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
    c.setOption({
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
    return c;
  }

  // ---------- 图 8-1：服装直播话术时间配比（环形） ----------
  function buildFlow(el) {
    var c = echarts.init(el, null, { renderer: 'svg' });
    c.setOption({
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
    return c;
  }

  // ---------- 图 5-1：配色比例 60-30-10（堆叠条） ----------
  function buildColor(el) {
    var c = echarts.init(el, null, { renderer: 'svg' });
    c.setOption({
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
    return c;
  }

  var registry = {
    'chart-returns': buildReturns,
    'chart-flow': buildFlow,
    'chart-color': buildColor
  };

  // 按需加载 echarts（全站仅加载一次）
  function ensureECharts() {
    if (window.echarts) return Promise.resolve();
    if (loadingPromise) return loadingPromise;
    loadingPromise = new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = ECHARTS_SRC;
      s.async = true;
      s.onload = function () { resolve(); };
      s.onerror = function () { loadingPromise = null; reject(new Error('ECharts 加载失败')); };
      document.head.appendChild(s);
    });
    return loadingPromise;
  }

  function initChart(id) {
    if (inited[id]) return;
    var el = document.getElementById(id);
    var build = registry[id];
    if (!el || !build) return;
    inited[id] = true;
    try {
      var c = build(el);
      if (c) instances.push(c);
    } catch (e) { /* 单图失败不影响其它 */ }
  }

  function initWhenVisible(ids) {
    ensureECharts()
      .then(function () { ids.forEach(initChart); })
      .catch(function () { /* 加载失败则静默跳过，容器保持为空 */ });
  }

  var ids = Object.keys(registry);

  if ('IntersectionObserver' in window) {
    // 进入视口（含 200px 预量）后才加载库并初始化
    var io = new IntersectionObserver(function (entries) {
      var visible = [];
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        visible.push(entry.target.id);
        io.unobserve(entry.target);
      });
      if (visible.length) initWhenVisible(visible);
    }, { rootMargin: '200px 0px' });
    ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) io.observe(el);
    });
  } else {
    initWhenVisible(ids);
  }

  window.addEventListener('resize', function () {
    instances.forEach(function (c) { c.resize(); });
  });
})();
