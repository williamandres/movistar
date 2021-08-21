/* milestones_matrix = { */
d3.csv("https://gist.githubusercontent.com/fabiodesousa/28ad200eb994857bbe261066f4c46d02/raw/b57d744b7b42b536457694face94d36fa8caa97b/matrix_milestones.csv").then(function (data) {
    console.log(data)
    var width = 500;
    var categories = data.map((d) => d.index)
    var svg = d3.select("#Prueba").append('svg')
        .style("width", "100%")
        .style("height", 500)
        .style("font", "1rem verdana");
    var height = width;
    var margin = ({ top: width / 10, right: width / 10, bottom: width / 5, left: width / 5 })
    var max_val = Math.max(...data.map((d) => Object.keys(d).map(e => e != 'index' ? parseInt(d[e]) : 0)).flat())
    var color = d3.scaleLinear()
        .domain([0, max_val])
        .range(['#ed8a09', '#b07425'])
    var x = d3.scaleBand()
        .domain(categories)
        .range([margin.left, width - margin.right])
    //.padding(0.01)
    var y = d3.scaleBand()
        .domain([...categories].reverse())
        .range([height - margin.bottom, margin.top])
    //.padding(0.01)
    var xAxis = g => g
        .attr("transform", `translate(0, ${height - margin.bottom})`)
        //.style("font", "12px verdana")
        .call(d3.axisBottom(x).tickSizeOuter(0))
        .call(g => g.selectAll(".domain").remove())
        .selectAll("text")
        .style("text-anchor", "start")
        .attr("dx", "-.8em")
        .attr("dy", ".8em")
        .attr("transform", "rotate(30)")

    var yAxis = g => g
        .attr("transform", `translate(${margin.left}, 0)`)
        //.style("font", "12px verdana")
        .call(d3.axisLeft(y).ticks(null, "s"))
        .call(g => g.selectAll(".domain").remove())

    var make_class = (item) => item.toLowerCase().split(' ').join('_').split('-').join('')
    var make_id = d => `coords_${Math.floor(x(d.xval))}_${Math.floor(y(d.yval))}`

    var rects = svg.append("g")
        .selectAll("g")
        .data(data)
        .enter().append("g")
        .attr("class", (d, i) => `${i} bar`)
        .selectAll("g")
        .data(d => categories.map(e => { return { 'xval': d.index, 'yval': e, 'count': d[e] } }))
        .enter().append("g")
        .attr("class", (d, i) => `${i} tile`)
        .on("mouseover", d => d3.select(`#${make_id(d)}`).transition().duration(0.25).style("opacity", 1))
        .on("mouseout", d => d3.select(`#${make_id(d)}`).transition().style("opacity", 0))

    rects.append("rect")
        .attr("x", d => x(d.xval))
        .attr("y", d => y(d.yval))
        .attr("width", x.bandwidth())
        .attr("height", y.bandwidth())
        .style("fill", d => color(d.count))
        .append("title")
        .text(d => d.count)

    rects.append("text")
        .attr("id", d => make_id(d))
        .attr("dy", ".35em")
        .attr("x", d => x(d.xval) + x.bandwidth() / 2)
        .attr("y", d => y(d.yval) + y.bandwidth() / 2)
        .text(d => d.count)
        .style("font-size", "1rem")
        .style("opacity", "0")
        .style("text-anchor", "middle")

    svg.append("g")
        .call(xAxis);

    svg.append("g")
        .call(yAxis);
})