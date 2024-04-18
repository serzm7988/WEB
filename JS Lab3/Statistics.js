let searchButton = document.querySelector("#Search");
let buildButton = document.querySelector("#build");
let sort1 = document.querySelector("#sort1");
let sort2 = document.querySelector("#sort2");
let sort3 = document.querySelector("#sort3");
let order1 = document.querySelector("#order1");
let order2 = document.querySelector("#order2");
let order3 = document.querySelector("#order3");

let marginX = 100;
let marginY = 200;
const width = 600;
const height = 600;
let svg = d3.select("svg").attr("width", width).attr("height", height);

document.addEventListener("DOMContentLoaded", () => CreateTable(TableElements));

searchButton.addEventListener("click", () => SetFiltration(TableElements));

sort1.addEventListener("change", () => {
    let options = document.querySelector("#sort1").querySelectorAll("option");
    sort2.innerHTML = "";
    sort3.innerHTML = "";
    options.forEach((element) => {
        if (element.value != sort1.value) sort2.append(element.cloneNode(true));
        if (element.value != sort1.value && element.value != sort2.value)
            sort3.append(element.cloneNode(true));
    });
    SetSortSettings();
});

sort2.addEventListener("change", () => {
    let options = document.querySelector("#sort1").querySelectorAll("option");
    sort3.innerHTML = "";
    options.forEach((element) => {
        if (element.value != sort1.value && element.value != sort2.value)
            sort3.append(element.cloneNode(true));
    });
    SetSortSettings();
});

sort3.addEventListener("change", () => SetSortSettings());

order1.addEventListener("change", () => SetSortSettings());

order2.addEventListener("change", () => SetSortSettings());

order3.addEventListener("change", () => SetSortSettings());

buildButton.addEventListener("click", () => {
    drawGraph();
});

function CreateTable(data) {
    filtredData = Sorting(Filtration(data));
    let table = document.querySelector("#table");
    table.innerHTML = `<tr>
	<th>
		Название
	</th>
	<th>
		Дата
	</th>
	<th>
		Просмотры
	</th>
	<th>
		Лайки
	</th>
	<th>
		Формат
	</th>
	<th>
		Страна
	</th>
    </tr>`;
    filtredData.forEach((element) => {
        let tr = document.createElement("tr");
        for (key in element) {
            let td = document.createElement("td");
            td.innerHTML = element[key];
            tr.append(td);
        }
        table.append(tr);
    });
}

function SetFiltration() {
    let filters = document.querySelector("#Filters").querySelectorAll("input");
    Filters.name = filters[0].value;
    Filters.date = filters[1].value;
    Filters.fromViews = filters[2].value;
    Filters.toViews = filters[3].value;
    Filters.fromLikes = filters[4].value;
    Filters.toLikes = filters[5].value;
    Filters.country = filters[6].value;
    Filters.format = document
        .querySelector("#Filters")
        .querySelector("select").value;
    CreateTable(TableElements);
}

function SetSortSettings() {
    let sort = document.querySelector("#Sort").querySelectorAll("select");
    let i = 0;
    for (key in SortSettings) {
        SortSettings[key] = sort[i].value;
        i++;
    }
    CreateTable(TableElements);
}

function Filtration(data) {
    let filtredData = [];
    data.forEach((element) => {
        let bool = true;
        if (!element.name.includes(Filters.name) && Filters.name != "")
            bool = false;
        let date =
            element.date.split(".")[2] +
            "-" +
            element.date.split(".")[1] +
            "-" +
            element.date.split(".")[0];
        if (String(Filters.date) != date && Filters.date != "") bool = false;
        if (
            Filters.fromViews != "" &&
            Number(Filters.fromViews) > Number(element.views)
        )
            bool = false;
        if (
            Filters.toViews != "" &&
            Number(Filters.toViews) < Number(element.views)
        )
            bool = false;
        if (
            Filters.fromLikes > Number(element.likes) &&
            Filters.fromLikes != ""
        )
            bool = false;
        if (Filters.toLikes < Number(element.likes) && Filters.toLikes != "")
            bool = false;
        if (!element.country.includes(Filters.country) && Filters.country != "")
            bool = false;
        if (!Filters.format != element.format && Filters.format != "")
            bool = false;

        if (bool) filtredData.push(element);
    });
    return filtredData;
}

function Sorting(data) {
    let sortData = data;
    sortData.sort((a, b) => {
        let result = 0;
        if (["views", "likes", "date"].includes(SortSettings.sort1))
            result =
                (a[SortSettings.sort1] - b[SortSettings.sort1]) *
                Number(SortSettings.order1);
        else
            result =
                a[SortSettings.sort1].localeCompare(b[SortSettings.sort1]) *
                Number(SortSettings.order1);
        if (
            result == 0 &&
            ["views", "likes", "date"].includes(SortSettings.sort2)
        )
            result =
                (a[SortSettings.sort2] - b[SortSettings.sort2]) *
                Number(SortSettings.order2);
        else if (result == 0)
            result =
                a[SortSettings.sort2].localeCompare(b[SortSettings.sort2]) *
                Number(SortSettings.order2);
        if (
            result == 0 &&
            ["views", "likes", "date"].includes(SortSettings.sort3)
        )
            result =
                (a[SortSettings.sort3] - b[SortSettings.sort3]) *
                Number(SortSettings.order3);
        else if (result == 0)
            result =
                a[SortSettings.sort3].localeCompare(b[SortSettings.sort3]) *
                Number(SortSettings.order3);
        return result;
    });
    return sortData;
}

function createArrGraph(data, key) {
    groupObj = d3.group(data, (d) => d[key]);
    let arrGraph = [];
    for (let entry of groupObj) {
        let minMax = d3.extent(entry[1].map((d) => d["views"]));
        arrGraph.push({ labelX: entry[0], values: minMax });
    }
    console.log(arrGraph);
    arrGraph.sort((a, b) => {
        if (!isNaN(parseFloat(a.labelX)) || isFinite(a.labelX)) {
            return a.labelX - b.labelX;
        } else {
            return a.labelX.localeCompare(b.labelX);
        }
    });
    return arrGraph;
}

function drawGraph() {
    const radios = document.getElementsByName("OXValue");
    let keyX = "";
    for (const radio of radios) {
        if (radio.checked) {
            keyX = radio.value;
            break;
        }
    }

    // значения по оси ОУ
    const isMin = document.querySelectorAll(`input[name="result"]`)[0].checked;
    const isMax = document.querySelectorAll(`input[name="result"]`)[1].checked;

    // создаем массив для построения графика
    const arrGraph = createArrGraph(TableElements, keyX);

    svg.selectAll("*").remove();

    // создаем шкалы преобразования и выводим оси
    const [scX, scY] = createAxis(arrGraph);

    // рисуем графики
    if (isMin) {
        createChart(arrGraph, scX, scY, 0, "blue");
    }
    if (isMax) {
        createChart(arrGraph, scX, scY, 1, "red");
    }
}

function createAxis(data) {
    // в зависимости от выбранных пользователем данных по OY
    // находим интервал значений по оси OY
    let firstRange = d3.extent(data.map((d) => d.values[0]));
    let secondRange = d3.extent(data.map((d) => d.values[1]));
    let min = firstRange[0];
    let max = secondRange[1];
    // функция интерполяции значений на оси
    let scaleX = d3
        .scaleBand()
        .domain(data.map((d) => d.labelX))
        .range([0, width - 2 * marginX]);

    let scaleY = d3
        .scaleLinear()
        .domain([min * 0.85, max * 1.1])
        .range([height - 2 * marginY, 0]);

    // создание осей
    let axisX = d3.axisBottom(scaleX); // горизонтальная
    let axisY = d3.axisLeft(scaleY); // вертикальная
    // отрисовка осей в SVG-элементе
    svg.append("g")
        .attr("transform", `translate(${marginX}, ${height - marginY})`)
        .call(axisX)
        .selectAll("text") // подписи на оси - наклонные
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", (d) => "rotate(-45)");

    svg.append("g")
        .attr("transform", `translate(${marginX}, ${marginY})`)
        .call(axisY);

    return [scaleX, scaleY];
}

function createChart(data, scaleX, scaleY, index, color) {
    const r = 4;
    // чтобы точки не накладывались, сдвинем их по вертикали
    let ident = index == 0 ? -r / 2 : r / 2;

    svg.selectAll(".dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("r", r)
        .attr("cx", (d) => scaleX(d.labelX) + scaleX.bandwidth() / 2)
        .attr("cy", (d) => scaleY(d.values[index]) + ident)
        .attr("transform", `translate(${marginX}, ${marginY})`)
        .style("fill", color);
}

Filters = {
    name: "",
    date: "",
    fromViews: "",
    toViews: "",
    fromLikes: "",
    toLikes: "",
    format: "",
    country: "",
};

SortSettings = {
    sort1: "name",
    order1: 1,
    sort2: "date",
    order2: 1,
    sort3: "views",
    order3: 1,
};
