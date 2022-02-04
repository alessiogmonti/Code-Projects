const chart = new Chart({
  element: document.querySelector('#graph'),
  data: [
        [new Date(2016,0,1), 10],
        [new Date(2016,1,1), 70],
        [new Date(2016,2,1), 30],
        [new Date(2016,3,1), 10],
        [new Date(2016,4,1), 40]
    ]
});
var colors = ['orange', 'purple', 'steelblue', 'pink', 'black', 'coral'];
var datasets = [
                [
                  [new Date(2016,0,1), 80],
                  [new Date(2016,1,1), 70],
                  [new Date(2016,2,1), 60],
                  [new Date(2016,3,1), 50],
                  [new Date(2016,4,1), 40]
                ],
                [
                  [new Date(2016,0,1), 40],
                  [new Date(2016,1,1), 30],
                  [new Date(2016,2,1), 20],
                  [new Date(2016,3,1), 10],
                  [new Date(2016,4,1), 1]
                ],
                [
                  [new Date(2016,0,1), 1],
                  [new Date(2016,1,1), 10],
                  [new Date(2016,2,1), 20],
                  [new Date(2016,3,1), 30],
                  [new Date(2016,4,1), 40]
                ],
                [
                  [new Date(2016,0,1), 50],
                  [new Date(2016,1,1), 60],
                  [new Date(2016,2,1), 70],
                  [new Date(2016,3,1), 80],
                  [new Date(2016,4,1), 90]
                ],
                [
                  [new Date(2016,0,1), 90],
                  [new Date(2016,1,1), 10],
                  [new Date(2016,2,1), 80],
                  [new Date(2016,3,1), 20],
                  [new Date(2016,4,1), 70]
                ],
                [
                  [new Date(2016,0,1), 30],
                  [new Date(2016,1,1), 60],
                  [new Date(2016,2,1), 40],
                  [new Date(2016,3,1), 50],
                  [new Date(2016,4,1), 55]
                ]
              ];

var gs = d3.graphScroll()
    .container(d3.select('#container'))
    .graph(d3.selectAll('.container #graph'))
    .eventId('uniqueId1')  // namespace for scroll and resize events
    .sections(d3.selectAll('.container #sections > div'))
    // .offset(innerWidth < 900 ? innerHeight - 30 : 200)
    .on('active', function(i){
      chart.setData(datasets[i])
      chart.setColor(colors[i]);
    });

// var colors2 = ['lightblue', 'red', 'steelblue', 'red', 'lightblue', 'coral'];
//
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
//
// var gs2 = d3.graphScroll()
//     .container(d3.select('#container2'))
//     .graph(d3.selectAll('.container2 #graph'))
//     .eventId('uniqueId2')  // namespace for scroll and resize events
//     .sections(d3.selectAll('.container2 #sections > div'))
//     // .offset(innerWidth < 900 ? innerHeight - 30 : 200)
//     .on('active', function(i){
//       chart2.setData(datasets[i])
//       chart2.setColor(colors2[i]);
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
