var width = 1300,
    height = 600,

    svg = d3.select("#mysvg")
        .attr("width", width)
        .attr("height", height),

    tooltip = d3.select("#tooltip");

    //为图形添加一个标题
    svg.append("text")
        .attr("x", 20)
        .attr("y", 40)
        .attr("font-size", 24)
        .text("D3 v4.x Modules");

    d3.csv("data/modules_3.csv", function (error, data) {
        if (error)throw error;

        //d3-v4新增的函数，分层函数，用于分层提取data里的数据结构
        var formatData = d3.stratify()
                .id(function (a) {
                    return a.Module
                })
                .parentId(function (a) {
                    return a.Class
                })(data),

            //圆圈的半径
            d = 40,
            //创建打包布局
            pack = d3.pack()
                .size([width, height])
                .radius(function () {
                    return d
                })
                .padding(3),

            //创建比例尺
            scale = d3.scaleOrdinal(d3.schemePastel1);

            console.log(formatData);
            pack(formatData);
            console.log(formatData);
            console.log(formatData.leaves());

            //绘制两个图例
            mClsGroups = svg.selectAll("g")
                .data(formatData.children)
                .enter()
                .append("g"),

            mClsGroups.append("circle")
                .attr("cx", 30)
                .attr("cy", function (a, b) {
                    return 70 + 30 * b
                })
                .attr("r", 10)
                .attr("fill", function (a) {
                return scale(a.id)
            }),


            mClsGroups.append("text")
                .attr("x", 30)
                .attr("y", function (a, b) {
                    return 70 + 30 * b
                })
                .attr("dx", 20)
                .attr("dy", 5)
                .attr("font-size", 14)
                .attr("fill", "black")
                .text(function (a) {
                    return a.id
                }),

            rootGroup = svg.append("g"),

            clipPaths = rootGroup.append("g")
                .append("defs")
                .selectAll("clipPath")
                .data(formatData.leaves())
                .enter()
                .append("clipPath")
                .attr("id", function (a) {
                    return a.id + "-clip"
                })
                .append("circle")
                .attr("cx", function (a) {
                    return a.x
                })
                .attr("cy", function (a) {
                    return a.y
                })
                .attr("r", function (a) {
                    return a.r
                }),


            leaveGroup = rootGroup.selectAll(".modules")
                .data(formatData.leaves())
                .enter()
                .append("a")
                .attr("class", "modules")
                .attr("xlink:href", function (a) {
                    return a.data.URL
                })
                .on("mouseover", function (a) {
                    tooltip.style("left", d3.event.pageX + 20 + "px")
                        .style("top", d3.event.pageY + 20 + "px")
                        .style("opacity", 1);

                    var id = a.id,
                    content = a.data.Content;

                    tooltip.select("h2")
                        .style("border-bottom", "2px solid " + scale(a.parent.id))
                        .text(id),

                    tooltip.select("p").text(content),

                    d3.select(this)
                            .select("circle")
                            .style("filter", "url(#shadow)")
                })
                //tooltip跟随鼠标的移动
                .on("mousemove", function (a) {

                    tooltip.style("left", d3.event.pageX + 20 + "px")
                        .style("top", d3.event.pageY + 20 + "px")
                })
                .on("mouseout", function (a) {
                    tooltip.style("opacity", 0),

                    d3.select(this).select("circle").style("filter", "")
                }),

            leaveGroup.append("circle")
                .attr("cx", function (a) {
                    return a.x
                })
                .attr("cy", function (a) {
                    return a.y
                })
                .attr("r", function (a) {
                    return a.r
                })
                .attr("fill", function (a, b) {
                    return scale(a.parent.id)
                }),

            leaveGroup.append("text")
                .attr("clip-path", function (a) {
                    return "url(#" + a.id + "-clip)"
                })
                .attr("x", function (a) {
                    return a.x
                })
                .attr("y", function (a) {
                    return a.y
                })
                .attr("dx", d * -.7)
                .attr("dy", .05 * d)
                .attr("fill", "black")
                .attr("font-family", "Verdana")
                .attr("font-size", 12)
                .text(function (a, b) {
                    return a.id
                })
    });