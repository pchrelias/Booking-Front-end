jQuery(function ($) {
    $.ajax({
        url: "data.json",
        success: handleRequest
    });
    // set todays date 
    var now = new Date();
    var day = ("0" + now.getDate()).slice(-2);
    var month = ("0" + (now.getMonth() + 1)).slice(-2);
    var today = now.getFullYear() + "-" + (month) + "-" + (day);

    $('#checkin').val(today);
    // $('#chechin').attr('value', today);
    $('#checkin').attr('min', today);
    $('#checkout').val($('#checkin').val());
    $('#checkin').change(function () {
        $('#checkout').val($('#checkin').val());
        $('#checkout').attr('min', ($('#checkin').val()));

    })
    let data = [];
    function handleRequest(hotelData) {
        console.log(hotelData);

        const entries = hotelData.map(function (data) {
            return data.entries;
        });
        const roomTypes = hotelData.map(function (data) {
            return data.roomtypes;
        });
        const entryDetails = [...entries[1]];
        data = [...entries[1]];

        console.log(entryDetails);

        // Making array with all recommendations
        const allFilters = entryDetails.map(function (entry) {
            return entry.filters;
        })
        console.log(allFilters);
        let arrayWithFilters = [];
        let finalArrayWithFilters = [];
        allFilters.forEach(function (filter) {
            arrayWithFilters = filter.map(function (f) {
                return f.name;
            })
            arrayWithFilters.forEach(function (f) {
                finalArrayWithFilters.push(f);
            })
        });

        finalArrayWithFilters = removeDuplicates(finalArrayWithFilters);
        console.log(finalArrayWithFilters);
        const selectRecom = document.querySelector("#recommendation");
        finalArrayWithFilters.forEach(function (filter) {
            const opt = document.createElement('option');
            //console.log(city);
            opt.appendChild(document.createTextNode(filter))
            opt.value = filter;
            selectRecom.appendChild(opt);
        })
        // END OF Making array with all recommendations


        const cities = entryDetails.map(function (entry) {
            console.log(entry.city)
            return entry.city;
        })

        function removeDuplicates(cities) {
            return cities.filter((a, b) => cities.indexOf(a) === b)
        };
        let citiesWithNoDublicates = removeDuplicates(cities);
        //console.log(array);
        // make datalist
        const datalist = document.querySelector('#cities');
        const selectCity = document.querySelector('#location');
        citiesWithNoDublicates.forEach(function (city) {
            const opt = document.createElement('option');
            //console.log(city);
            opt.appendChild(document.createTextNode(city))
            opt.value = city;

            const opt2 = opt.cloneNode(true)
            datalist.appendChild(opt);
            selectCity.appendChild(opt2);
            //console.log(opt);


        })

        // make room type option   
        const roomTypesDetails = [...roomTypes[0]];
        const selectRoomType = document.querySelector("#selectType");
        console.log(roomTypesDetails);
        let roomTypesWithNoDublicates = removeDuplicates(roomTypesDetails);
        roomTypesWithNoDublicates.forEach(function (roomType) {
            const opt = document.createElement('option');
            //console.log(city);
            opt.appendChild(document.createTextNode(roomType.name))
            opt.value = roomType.name;
            selectRoomType.appendChild(opt);
        })

        createListItem(entryDetails);
        //sortAll(entryDetails);
        setMinMaxRange(entryDetails);
        $("#price").on("change", (e) => {
            document.querySelector("#priceMessage").innerText = ` ${e.target.value}€`;
            //sortAll(entryDetails);
            createListItem(entryDetails.filter(li => priceFilter(li, e.target.value)));
            if (($("#price").val()) === "") {
                createListItem(entryDetails);
            }
        });
        $("#rating").on("change", (e) => {
            //document.querySelector("#priceMessage").innerText = ` ${e.target.value}€`;
            createListItem(entryDetails.filter(li => ratingFilter(li, e.target.value)));
            if (($("#rating").val()) === "") {
                createListItem(entryDetails);
            }
        });
        $("#guestRating").on("change", (e) => {
            //document.querySelector("#priceMessage").innerText = ` ${e.target.value}€`;
            createListItem(entryDetails.filter(li => guestRatingFilter(li, e.target.value)));
            if (($("#guestRating").val()) === "") {
                createListItem(entryDetails);
            }
        });
        $("#location").on("change", (e) => {
            //document.querySelector("#priceMessage").innerText = ` ${e.target.value}€`;

            createListItem(entryDetails.filter(li => locationFilter(li, e.target.value)));
            if (($("#location").val()) === "") {
                createListItem(entryDetails);
            }
        });
        $("#search-button").on("click", (e) => {
            //document.querySelector("#priceMessage").innerText = ` ${e.target.value}€`;

            createListItem(entryDetails.filter(li => locationFilter(li, $(".form-control").val())));
            if (($(".form-control").val()) === "") {
                createListItem(entryDetails);
            }
        });


        $("#recommendation").on("change", (e) => {
            createListItem(entryDetails.filter(li => recommendationFilter(li, e.target.value)));
            if (($("#recommendation").val()) === "") {
                createListItem(entryDetails);
            }

        });




    }

    // function sortAll(entryDetails) {
    //     createListItem(entryDetails);
    //     createListItem(entryDetails.filter(li => priceFilter(li, $("#price").val())));
    //     console.log($("#price").val());
    //     createListItem(entryDetails.filter(li => ratingFilter(li, $("#rating").val())));
    //     console.log($("#rating").val());
    //     createListItem(entryDetails.filter(li => guestRatingFilter(li, $("#guestRating").val())));
    //     console.log($("#guestRating").val());

    //     createListItem(entryDetails.filter(li => locationFilter(li, $("#location").val())));
    //     console.log($("#location").val());
    // }
    function createListItem(list) {
        //console.log(list);
        const $hotelsEl = $("#hotels");
        $hotelsEl.empty();
        let elements = "";
        const listItems = list.reduce((a, el) => (
            elements += renderHotel(el)
        ), '');
        //console.log(listItems);
        $hotelsEl.append(listItems);
    }
    function priceFilter(item, price) {
        return parseFloat(item.price) <= price;
    }
    function locationFilter(item, city) {

        return (item.city) === city;
    }
    function recommendationFilter(item, rec) {

        //console.log(item.filters[0].name) ;
        let obj = "";
        (item.filters).forEach(function (f) {
            console.log((f.name));
            if (f.name === rec) {
                obj = f.name;

            }
            return (f.name) === rec;
        })
        console.log(rec);

        return obj;
    }
    function ratingFilter(item, rating) {

        return parseFloat(item.rating) == rating;
    }
    function guestRatingFilter(item, guestrating) {
        console.log(item.ratings.no)
        if (guestrating === "0") {
            console.log("0")
            return (parseFloat(item.ratings.no) >= 0 && parseFloat(item.ratings.no) < 2);
        }
        if (guestrating === "1") {
            return (parseFloat(item.ratings.no) >= 2 && parseFloat(item.ratings.no) < 6);
        }
        if (guestrating === "2") {
            return (parseFloat(item.ratings.no) >= 6 && parseFloat(item.ratings.no) < 7);
        }
        if (guestrating === "3") {
            return (parseFloat(item.ratings.no) >= 7 && parseFloat(item.ratings.no) < 8.5);
        }
        if ( guestrating === "4") {
            console.log("4")
            return (parseFloat(item.ratings.no) >= 8.5 && parseFloat(item.ratings.no) <= 10);
        }
        console.log(item.guestratings);
        return parseFloat(item.guestrating) >= guestrating;
    }
    function setMinMaxRange(list) {
        let min = Infinity;
        let max = -Infinity;
        list.forEach(el => {
            const price = parseFloat(el.price);
            if (price > max) max = price;
            if (price < min) min = price;
        });
        const price = document.querySelector("#price");
        price.setAttribute("min", min);
        price.setAttribute("max", max);
        price.setAttribute("value", max);
        document.querySelector("#forPrice").innerHTML = `<span id="labelPrice">Price </span> <span>Max:${max}</span>`;
    }
    function renderHotel(hotel) {
        const tmpl = `<div class="hotel col-12 row ml-0 p-0 border ">
                        <div class="hotel-media col-3 px-0">
                            <i class="far fa-heart"></i>
                            <img src="${hotel.thumbnail}" alt="hotel-photo" class="img-fluid">
                            <span class="img-pagin bg-dark text-white p-1 rounded">1/30</span>
                        </div>
                        <div class="info col-4"> 
                            <h6>${hotel.hotelName}</h6>
                                <span class='starPlace'>
                                <i class='${hotel.rating > 0  && "fas fa-star"}'></i>
                                <i class='${hotel.rating > 1  && "fas fa-star"}'></i>
                                <i class='${hotel.rating > 2  && "fas fa-star"}'></i>
                                <i class='${hotel.rating > 3  && "fas fa-star"}'></i>
                                <i class='${hotel.rating > 4  && "fas fa-star"}'></i>
                                
                                  
                                 </span>
                            <p>${hotel.city}</p>
                            <div>
                            <span  id="hotelRatings">${hotel.ratings.no}</span> <span>${hotel.ratings.text}</span>
                            </div>
                         </div>
                        <div class="deals col-2 text-center border"> <div class='deal1'> <span class='dealsDetail'>Hotel Website ${hotel.price}</span></div><div class='deal1'><span class='dealsDetail'> Agoda <br>575 </span></div><div class='deal1'> <span class='dealsDetail'>More Deals</span></div></div>
                        <div class="deal col-3">
                        <div class= "col-12 text-center forSectionDeal-website text-success"> Hotel Website </div>
                        <div class= "col-12 text-center" > ${hotel.price} 	&euro;</div>
                        <div class= "col-12 text-center forSectionDeal-website" >3 nights for <span class="text-success">${(hotel.price) * 3} </span> 	&euro;</div>
                        <button class="col-12 btn btn-success"> VIEW DEAL ></button>
                        </div>
                        
                    </div>`;
                    

        return tmpl;
    }
            

    // Get the modal
    const modal = document.getElementById("myModal");

    // Get the button that opens the modal
    const btn = document.getElementById("myBtn");
        
    // Get the <span> element that closes the modal
    const span = document.getElementsByClassName("close")[0];

    // When the user clicks on the button, open the modal
    btn.onclick = function () {
         modal.style.display = "block";
        // const ifrm = document.createElement('iframe');
        // ifrm.setAttribute('id', 'ifrm'); // assign an id

        // document.body.appendChild(ifrm); // to place at end of document
        // console.log(data[0].latlon[0]);
        // // to place before another page element
        // const el = document.getElementById('marker');
        // el.parentNode.insertBefore(ifrm, el);
        // //width="600" height="450" frameborder="0" style="border:0;" allowfullscreen=""></iframe>
        // // assign url
        // ifrm.setAttribute('src', 'https://maps.google.com/maps?q='+(data[0].latlon[0])+','+(data[0].latlon[1])+'&hl=es&z=14&amp;output=embed');
        // ifrm.setAttribute('width', '600');
        // ifrm.setAttribute('height', '450');
        // ifrm.setAttribute('frameborder', '0');
        // ifrm.setAttribute('style', 'border:0;');
        // ifrm.setAttribute('allowfullscreen', '');
        // ifrm.setAttribute('class', 'col-12');

        function success(position) {
            console.log(position);
            // position.coords.latitude, position.coords.longitude
            const map = new ol.Map({
                target: 'map2',
                layers: [
                    new ol.layer.Tile({
                        source: new ol.source.OSM()
                    })
                ],
                view: new ol.View({
                    center: ol.proj.fromLonLat([
                        (data[0].latlon[1]), (data[0].latlon[0])
                    ]),
                    zoom: 10
                })
            });

        }
        // 2) Declare error function
        function error(err) {
            console.log(err);
        }
        // 3) Check if geolocation API is available
        if (navigator.geolocation) {
            // 4) Use navigator.geolocation.getCurrentPosition( SUCCESS, ERROR )
            navigator.geolocation.getCurrentPosition(success, error);
            // async/await

        } else {
            // Inform the user about unavailable service
        }







    }
    
    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
        modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

});