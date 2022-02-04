console.clear()
// d3.select('body').selectAppend('div.tooltip.tooltip-hidden')
var isoFmt = d3.timeFormat('%Y-%m-%d')

window.state = window.state || {
  offset: 0,
  isYearFilter: false,
}

if (state.cache){
  var allData = state.cache.allData
  var nswData = state.cache.nswData

  updateByYear()
  setTimeout(reindex, 1)
} else {
  var allData = makeData(false)
  var nswData = makeData(true)
  state.data = nswData
  state.cache = {nswData, allData}

  window.months = d3.nest(allData.filter(d => d.year == 2003), d => d.month)
  .map((d, i) => {

    var monthStrs = 'Jan. Feb. March April May June July Aug. Sept. Oct. Nov. Dec.'.split(' ')
    return {dayOfYear: d[0].dayOfYear, str: monthStrs[i]}
  })

  updateByYear()
// 'nsw-archive.csv','all-archive.csv'
  d3.loadData('nsw-nrt.csv', 'all-nrt.csv', (err, res) => {
    function joinData(data){
      var date2count = {}
      ;(data.isNSW ? res[0].concat(res[1]) : res[2].concat(res[3])).forEach(d => {
        date2count[d.acq_date] = +d.n
      })

      data.forEach(d => {
        d.count = date2count[d.str] || 0
      })
    }
    joinData(allData)
    joinData(nswData)

    reindex()
  })

  function makeData(isNSW){
    var rv = d3.timeDay.range(new Date('2000-11-01'), new Date('2020-02-22'))
    .map(date => {
      return {
        date,
        year: date.getFullYear(),
        month: date.getMonth(),
        dayOfYear: +d3.timeFormat('%j')(date) - 1,
        str: isoFmt(date),
        count: 0,
      }
      return rv
    })
    // .filter(d => d.year > 2001)

    rv.isNSW = isNSW
    rv.name = isNSW ? 'New South Wales' : 'Australia'
    return rv
  }
}




var sel = d3.select('#graph').html('')
var c = d3.conventions({sel, margin: {left: 50, top: 14, right: 45, bottom: 100}, totalWidth: 960, totalHeight: 600, layers: 'sd'})

// add buttons
!(function(){
  var divSel = c.layers[1]

  var buttonAreaSel = divSel.append('div')
  .st({width: 400, position: 'absolute'})
  .translate([Math.round(c.width/2 - 300), c.height + 30])
  .appendMany('div.button', ['New South Wales', 'Australia'])
  .text(d => d)
  .on('click', d => {
    state.data = d == 'Australia' ? allData : nswData
    buttonAreaSel.classed('active', d => d == state.data.name)
    updateDataExtent()
  })
  .classed('active', d => d == state.data.name)

  var buttonYearSel = divSel.append('div')
  .st({width: 400, position: 'absolute'})
  .translate([Math.round(c.width/2 + 50), c.height + 30])
  .appendMany('div.button', ['2003-2020', '2013-2020'])
  .text(d => d)
  .on('click', (d, i) => {
    state.isYearFilter = i
    buttonYearSel.classed('active', (d, i) => i == state.isYearFilter)
    updateDataExtent()
  })
  .classed('active', (d, i) => i == state.isYearFilter)

})()

c.svg
.on('mousemove touchmove', function(){
  var [x] = d3.mouse(this)
  // reindex(d3.clamp(0, c.x.invert(x), 363))
  reindex((365 + c.x.invert(x)) % 365)
})
.append('rect')
.at({width: c.totalWidth, x: -c.margin.left, height: c.height, opacity: 0})


c.x.domain([0, 365])
setYDomain()
function setYDomain(){
  c.y.domain([0, state.data.isNSW ? 95000 : state.isYearFilter ? 500000 : 500000])
}

c.xAxis
c.yAxis.ticks(5).tickSize(c.width)
d3.drawAxis(c)

c.svg.select('.x').remove()
var monthSel = c.svg.append('g.axis.x')
.translate([.5, c.height])
.appendMany('g', months)

var yAxisSel = c.svg.select('.y').translate(c.width, 0)
yAxisSel.selectAll('text').filter(d => d == 0).st({opacity: 0})

var fireLabelSel = c.svg.append('g.axis').appendMany('g.fire-label', [80000, 500000]).call(posFireLabelSel)
fireLabelSel.append('rect').at({width: 88, height: 16, y: -8, fill: '#fff'})
fireLabelSel.append('text').text('detected fires')
.at({dy: '.32em'})

c.svg.append('defs').append('linearGradient#gradient')
.append('stop').at({offset: '  0%', stopColor: 'rgba(255,255,255,1)'}).parent()
.append('stop').at({offset: ' 90%', stopColor: 'rgba(255,255,255,1)'}).parent()
.append('stop').at({offset: '100%', stopColor: 'rgba(255,255,255,.2)'})

c.svg.append('rect')
.at({width: 50, height: 20, y: c.height + 2, x: -20, fill: 'url(#gradient)'})
c.svg.append('line').at({y1: 2, y2: 6, stroke: '#000'}).translate([.5, c.height])
var indexSel = c.svg.append('g.axis').append('text.index-label').translate(c.height, 1)
.at({textAnchor: 'middle', dy: 15})


indexSel.text('Dec. 31')

function posFireLabelSel(sel){
  sel
  .st({opacity: (d, i) => i == state.data.isNSW ? 0 : 1})
  .translate(d => c.y(d) + .5, 1)
}

monthSel.append('text')
.text(d => d.str)
.at({textAnchor: 'middle', dy: 15})

monthSel.append('line')
.at({y1: 2, y2: 6, stroke: '#000'})


var line = d3.line()
.x(d => c.x((d.dayOfYear + state.offset) % 365))
.y(d => c.y(d.totalCount))
// .curve(d3.curveStepAfter)

var yearSel = c.svg.appendMany('g.year', d3.range(2001, 2021))
.st({opacity: d => state.isYearFilter && d.year < 2013 ? 0 : .3})
// .call(d3.attachTooltip)

var lineSel = yearSel.append('path')//.at({d: line})

var labelSel = yearSel
.append('text')
.at({dy: '.33em'})

var transitionSel = d3.selectAll('.year *')


function updateDataExtent(){
  setYDomain()

  var dur = 1000
  reindex(state.offset, dur)

  yAxisSel.transition().duration(dur)
  .call(c.yAxis)

  fireLabelSel.transition().duration(dur)
  .call(posFireLabelSel)
}


function reindex(offset=state.offset, dur=0){
  lineSel.data().forEach(d => d.isOld = true)
  updateByYear(Math.round(offset))

  indexSel.text(d3.timeFormat('%b %e')(d3.timeParse('%j')(366 - Math.round(offset))))

  yearSel.data(byYear)
  yearSel.st({'display': d => d.isOld ? 'none' : d.length > 5 ? '' : 'none'})

  yearSel.classed('this-year', d => d.year == 2019)
  monthSel.translate(d => c.x((offset + d.dayOfYear) % 365), 0)

  // sloppy, but .transition().duration(0) drops frames
  if (dur){
    lineSel.data(byYear).transition().duration(dur)
    .at({d: d => line(d).replace('M', 'M 0 ' + c.height +  'L')})

    labelSel.data(byYear).transition().duration(dur)
    .translate(d => [line.x()(d.last), c.y(d.last.totalCount)])

    yearSel.transition().duration(dur)
    .st({opacity: d => state.isYearFilter && d.year < 2013 ? 0 : .3})
  } else {
    lineSel.data(byYear)
    .at({d: d => line(d).replace('M', 'M 0 ' + c.height +  'L')})

    labelSel.data(byYear)
    .translate(d => [line.x()(d.last), c.y(d.last.totalCount)])

    transitionSel.transition()
  }

  labelSel.text(d => d.year + '-' + d3.format('02')(((d.year + 1) % 100)))

}


function updateByYear(offset=121){
  state.data.forEach(d => {
    d.yearDelta = d.year + Math.floor((offset + d.dayOfYear)/365)
    d.offset = Math.floor((offset + d.dayOfYear)/365)
  })

  var newByYear = d3.nestBy(state.data, d => d.yearDelta)
  newByYear.forEach(year => {
    year.year = year[0].year

    var totalCount = 0
    year.forEach((d, i) => {
      d.totalCount = totalCount += d.count
      d.yearObj = year
    })

    year.totalCount = totalCount
    year.year = year[0].year
    year.last = _.last(year)
  })
  window.byYear = newByYear
  .filter(d => d.key > 2015 || d.length > 360)

  var lastYear = _.last(window.byYear)
  // console.log(lastYear.year, lastYear[0].str, _.last(lastYear).str)


  state.offset = offset
}
