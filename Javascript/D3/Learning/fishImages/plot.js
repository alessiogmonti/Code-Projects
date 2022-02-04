const chart = new Chart({element: document.querySelector('#graph')});

function init(data){
  chart.setData(data);
}

//Loader of choice
let getD1 = d3.json('data/images.json').then(function(d){init(d.children)})
 //.then or graph scroll call

// let colors = [['rgba(0,0,255,0.5)'],['rgba(255,0,0,0.5)']];
//
// let gs = d3.graphScroll()
//     .container(d3.select('#container'))
//     .graph(d3.selectAll('.container #graph'))
//     .eventId('uniqueId1')  // namespace for scroll and resize events
//     .sections(d3.selectAll('.container #sections > div'))
//     // .offset(innerWidth < 900 ? innerHeight - 30 : 200)
//     .on('active', function(i){
//       data2get[i].then(init);
//       chart.setColors(colors[i])
//     });
