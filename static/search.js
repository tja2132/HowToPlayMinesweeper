$(document).ready(function () {

    function generateUniqueIntegers(count, min, max) {
        const numbers = new Set();
        while (numbers.size < count) {
            const number = Math.floor(Math.random() * (max - min + 1)) + min;
            numbers.add(number);
        }
        return Array.from(numbers);
    }

    function search_for(query) {
        $.ajax({
            type: "POST",
            url: "search",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(query),
            success: function (result) {
                console.log("Success. Resaults for ", query);
                console.log(result)

                display_results_list(query, result);
            },
            error: function (request, status, error) {
                console.log("Error searching");
                console.log(request)
                console.log(status)
                console.log(error)
            }
        });
    };

    function display_featured(ids_list) {
        $.ajax({
            type: "POST",
            url: "/get_featured",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(ids_list),
            success: function (result) {
                console.log("Success. Results for featured IDs: ", ids_list);
                console.log(result);

                var $featuredList = $(".featured");

                // Iterate over each result and append it to the featured list
                result.forEach(function (pokemon) {
                    var resultHtml = '<div class="row mb-2 align-items-center search-result-row">' +
                        '<div class="col-sm-1 col-md-1">' +
                        '<a href="/view/' + pokemon.id + '">' +
                        '<img src="' + pokemon.image.hires + '" class="img-fluid pokemon-image-inline" alt="An image of ' + pokemon.name.english + '">' +
                        '</a>' +
                        '</div>' +
                        '<div class="col-sm-1 col-md-1"><p><strong>ID:</strong> ' + pokemon.id + '</p></div>' +
                        '<div class="col-sm-2 col-md-3"><p><strong>Name:</strong> <a href="/view/' + pokemon.id + '">' + pokemon.name.english + '</a></p></div>' +
                        '<div class="col-sm-2 col-md-3"><p><strong>Species:</strong> ' + pokemon.species + '</p></div>' +
                        '<div class="col-sm-6 col-md-4"><p><strong>Type:</strong> ' + pokemon.type.join(", ") + '</p></div>' +
                        '</div>';

                    $featuredList.append(resultHtml);
                });
            },
            error: function (request, status, error) {
                console.log("Error getting featured Pokémon");
                console.log(request);
                console.log(status);
                console.log(error);
            }
        });
    };

    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
    }

    // Function to highlight the query substring
    function highlightMatch(text, query) {
        var queryEscaped = escapeRegExp(query);
        var re = new RegExp(`(${queryEscaped})`, 'gi'); // 'g' for global match, 'i' for case-insensitive
        return text.replace(re, '<span class="highlight-query">$1</span>');
    }

    function display_results_list(query, results) {
        var $resultsHeader = $(".searchHeader");
        var $resultsList = $(".resultsList");
        var $featuredList = $(".featured");
        var $homeContent = $(".homeContent");
        $homeContent.hide();
        $resultsList.empty();
        $resultsHeader.empty();
        $featuredList.empty();

        $resultsHeader.append('<br><div><h4> Results for search: ' + query + '</h4></div>');

        if (results === undefined || results.length == 0) {
            $resultsHeader.append('<div><p> No results found </p></div>');
        }
        else {
            $resultsHeader.append('<div><p>' + results.length + ' results found </p></div>');

        }

        results.forEach(function (r) {

            var queryLowerCase = query.toLowerCase();
            var idWithHighlight = highlightMatch(r.id.toString(), queryLowerCase)
            var nameWithHighlight = highlightMatch(r.name.english, queryLowerCase);
            var typeWithHighlight = r.type.map(function (type) {
                return highlightMatch(type, queryLowerCase);
            }).join(", ");
            var speciesWithHighlight = highlightMatch(r.species, queryLowerCase);

            var resultHtml = '<div class="row mb-2 align-items-center search-result-row">' +
                '<div class="col-sm-1 col-md-1">' +
                '<a href="/view/' + r.id + '">' +
                '<img src="' + r.image.hires + '" class="img-fluid pokemon-image-inline" alt="An image of ' + r.name.english + '" style="width: 100%;">' +
                '</a>' +
                '</div>' +
                '<div class="col-sm-1 col-md-1">' +
                '<p><strong>ID:</strong> ' + idWithHighlight + '</p>' +
                '</div>' +
                '<div class="col-sm-2 col-md-3">' +
                '<p><strong>Name:</strong> <a href="/view/' + r.id + '">' + nameWithHighlight + '</a></p>' +
                '</div>' +
                '<div class="col-sm-2 col-md-3">' +
                '<p><strong>Species:</strong> ' + speciesWithHighlight + '</p>' +
                '</div>' +
                '<div class="col-sm-6 col-md-4">' +
                '<p><strong>Type:</strong> ' + typeWithHighlight + '</p>' +
                '</div>' +
                '</div>';

            $resultsList.append(resultHtml);
        });
    };

    function display_home_page() {
        var $resultsHeader = $(".searchHeader");
        var $resultsList = $(".resultsList");
        var $homeContent = $(".homeContent");
        $resultsList.empty();
        $resultsHeader.empty();

        $homeContent.show();

        var $featuredList = $(".featured");
        $featuredList.empty();
        $featuredList.append('<h4> Featured Pokemon: </h4>')

        // randomize featured for fun
        const featured = generateUniqueIntegers(6, 1, 898);

        display_featured(featured);
    };

    $("#searchForm").on("submit", function (event) {
        event.preventDefault();
        const search_str = $("#searchBox").val();
        if (search_str.trim() != "") {
            // Redirect and pass the search term as a query parameter
            window.location.href = "/?search=" + encodeURIComponent(search_str);
        }
    });

    const urlParams = new URLSearchParams(window.location.search);
    const search_str = urlParams.get('search');
    if (search_str) {
        search_for(search_str);
    }
    else {
        display_home_page();
    }
});