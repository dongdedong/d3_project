var width = 1300,
    height = 600,
    svg = d3.select("#mysvg").attr("width", width).attr("height", height),
    tooltip = d3.select("#tooltip");

svg.append("text").attr("x", 20).attr("y", 40).attr("font-size", 24).text("D3 v4.x Modules"), d3.csv("data/modules_3.csv", function (a, b) {
    if (a)throw a;
    var c = d3.stratify().id(function (a) {
        return a.Module
    }).parentId(function (a) {
        return a.Class
    })(b), d = 40, e = d3.pack().size([width, height]).radius(function () {
        return d
    }).padding(3), f = d3.scaleOrdinal(d3.schemePastel1);
    e(c), mClsGroups = svg.selectAll("g").data(c.children).enter().append("g"), mClsGroups.append("circle").attr("cx", 30).attr("cy", function (a, b) {
        return 70 + 30 * b
    }).attr("r", 10).attr("fill", function (a) {
        return f(a.id)
    }), mClsGroups.append("text").attr("x", 30).attr("y", function (a, b) {
        return 70 + 30 * b
    }).attr("dx", 20).attr("dy", 5).attr("font-size", 14).attr("fill", "black").text(function (a) {
        return a.id
    }), rootGroup = svg.append("g"), clipPaths = rootGroup.append("g").append("defs").selectAll("clipPath").data(c.leaves()).enter().append("clipPath").attr("id", function (a) {
        return a.id + "-clip"
    }).append("circle").attr("cx", function (a) {
        return a.x
    }).attr("cy", function (a) {
        return a.y
    }).attr("r", function (a) {
        return a.r
    }), leaveGroup = rootGroup.selectAll(".modules").data(c.leaves()).enter().append("a").attr("class", "modules").attr("xlink:href", function (a) {
        return a.data.URL
    }).on("mouseover", function (a) {
        tooltip.style("left", d3.event.pageX + 20 + "px").style("top", d3.event.pageY + 20 + "px").style("opacity", 1);
        var b = a.id, c = a.data.Content;
        tooltip.select("h2").style("border-bottom", "2px solid " + f(a.parent.id)).text(b), tooltip.select("p").text(c), d3.select(this).select("circle").style("filter", "url(#shadow)")
    }).on("mousemove", function (a) {
        tooltip.style("left", d3.event.pageX + 20 + "px").style("top", d3.event.pageY + 20 + "px")
    }).on("mouseout", function (a) {
        tooltip.style("opacity", 0), d3.select(this).select("circle").style("filter", "")
    }), leaveGroup.append("circle").attr("cx", function (a) {
        return a.x
    }).attr("cy", function (a) {
        return a.y
    }).attr("r", function (a) {
        return a.r
    }).attr("fill", function (a, b) {
        return f(a.parent.id)
    }), leaveGroup.append("text").attr("clip-path", function (a) {
        return "url(#" + a.id + "-clip)"
    }).attr("x", function (a) {
        return a.x
    }).attr("y", function (a) {
        return a.y
    }).attr("dx", d * -.7).attr("dy", .05 * d).attr("fill", "black").attr("font-family", "Verdana").attr("font-size", 12).text(function (a, b) {
        return a.id
    })
});