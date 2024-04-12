let searchButton = document.querySelector("#Search");
let sort1 = document.querySelector("#sort1");
let sort2 = document.querySelector("#sort2");
let sort3 = document.querySelector("#sort3");
let order1 = document.querySelector("#order1");
let order2 = document.querySelector("#order2");
let order3 = document.querySelector("#order3");

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
