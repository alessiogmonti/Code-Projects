const chart = new Chart({element: document.querySelector('#graph')});

function init(data){
  chart.setData(data);
}

let getD1 = d3.csv('d1.csv', function(d){
                        function removeNaN(e,c){
                          if (e>0) {return e} else {return c}
                        }
                        return { date: d3.timeParse("%Y-%m-%d")(d.Date),
                                tsla: d.TSLA,
                                sma: removeNaN(+d.SMA_TSLA, d.TSLA)
                                 // aapl : d.AAPL,
                                 // price : {tsla: d.TSLA},
                                 // aapl_sma: removeNaN(+d.SMA_AAPL,d.AAPL),
                                 // indicator: { sma: removeNaN(+d.SMA_TSLA,d.TSLA)}
                                 ///include secondary key value
                               }
                             });

let getD2 = d3.csv('d2.csv', function(d){
                        function removeNaN(e,c){
                          if (e>0) {return e} else {return c}
                        }
                        return { date: d3.timeParse("%Y-%m-%d")(d.Date),
                                tsla: d.TSLA,
                                sma: removeNaN(+d.SMA_TSLA, d.TSLA),
                                u_band: removeNaN(+d.UpperBand, d.TSLA),
                                l_band: removeNaN(+d.LowerBand, d.TSLA)
                                 // price: {tsla : d.TSLA},
                                 // indicator: {
                                 // sma: removeNaN(+d.SMA_TSLA, d.TSLA),
                                 // u_band: removeNaN(+d.UpperBand, d.TSLA),
                                 // l_band: removeNaN(+d.LowerBand, d.TSLA) }
                               }
                             });

let data2get = [getD1, getD2];

let colors = [['rgba(0,0,255,0.5)'],['rgba(255,0,0,0.5)']];

let gs = d3.graphScroll()
    .container(d3.select('#container'))
    .graph(d3.selectAll('.container #graph'))
    .eventId('uniqueId1')  // namespace for scroll and resize events
    .sections(d3.selectAll('.container #sections > div'))
    // .offset(innerWidth < 900 ? innerHeight - 30 : 200)
    .on('active', function(i){
      data2get[i].then(init);
      chart.setColors(colors[i])
    });


// const chart2 = new Chart({
//   element: document.querySelector('.container2 #graph'),
//   data: [
//         [new Date(2016,0,1), 10],
//         [new Date(2016,1,1), 70],
//         [new Date(2016,2,1), 30],
//         [new Date(2016,3,1), 10],
//         [new Date(2016,4,1), 40]
//     ]
// });

// var gs2 = d3.graphScroll()
//     .container(d3.select('#container2'))
//     .graph(d3.selectAll('.container2 #graph'))
//     .eventId('uniqueId2')  // namespace for scroll and resize events
//     .sections(d3.selectAll('.container2 #sections > div'))
//     // .offset(innerWidth < 900 ? innerHeight - 30 : 200)
//     .on('active', function(i){
//       chart2.draw();
//     });

// implement throttle for window resize
// function throttle (callback, limit) {
//     var waiting = false;                      // Initially, we're not waiting
//     return function () {                      // We return a throttled function
//         if (!waiting) {                       // If we're not waiting
//             callback.apply(this, arguments);  // Execute users function
//             waiting = true;                   // Prevent future invocations
//             setTimeout(function () {          // After a period of time
//                 waiting = false;              // And allow future invocations
//             }, limit);
//         }
//     }
// }
// d3.select(window).on('resize', () => chart.draw() );
