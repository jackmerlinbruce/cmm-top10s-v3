document.addEventListener('DOMContentLoaded', function() {

    const app = (function () { 

        //////////
        // GENERATE SHOPPING LIST
        // This generates on page load
        //////////

        const shoppingList = document.getElementById('shoppingList')

        // Grocieries data (this is needed to generate the different menu items)
        const groceriesObj = [
            {
                name: 'chicken',
                icon: 'chicken.svg',
                color: '#eaab57',
                filepath: 'Chicken Breasts (Boneless Skinless) (1kg).json',
                description: '1kg of boneless chicken breasts'
            },
            {
                name: 'beef',
                icon: 'beef.svg',
                color: '#A3603D',
                filepath: 'Beef Round (1kg) (or Equivalent Back Leg Red Meat).json',
                description: '1kg of beef (or equivalent red meat)'
            },
            {
                name: 'eggs',
                icon: 'eggs.svg',
                color: '#F9B276',
                filepath: 'Eggs (regular) (12).json',
                description: 'a dozen regular-sized eggs'
            },
            {
                name: 'milk',
                icon: 'milk.svg',
                color: '#97C7EF',
                filepath: 'Milk (regular) (1 liter).json',
                description: '2 pints (or 1 litre) of milk'
            },
            {
                name: 'cheese',
                icon: 'cheese.svg',
                color: '#f7ca65',
                filepath: 'Local Cheese (1kg).json',
                description: '1kg of local cheese'
            },
            {
                name: 'bread',
                icon: 'bread.png',
                color: '#D49333',
                filepath: 'Loaf of Fresh White Bread (500g).json',
                description: 'a loaf of fresh white bread'
            },
            {
                name: 'potatoes',
                icon: 'potatoes.svg',
                color: '#B78855',
                filepath: 'Potato (1kg).json',
                description: '1kg of potatoes'
            },
            {
                name: 'rice',
                icon: 'rice.svg',
                color: '#e2ada2',
                filepath: 'Rice (white) (1kg).json',
                description: '1kg of white rice'
            },
            {
                name: 'onions',
                icon: 'onions.png',
                color: '#F7B239',
                filepath: 'Onion (1kg).json',
                description: '1kg of onions'
            },
            {
                name: 'tomatoes',
                icon: 'tomatoes.svg',
                color: '#f9494d',
                filepath: 'Tomato (1kg).json',
                description: '1kg of tomatoes'
            },
            {
                name: 'apples',
                icon: 'apples.png',
                color: '#D53525',
                filepath: 'Apples (1kg).json',
                description: '1kg of apples'
            },
            {
                name: 'oranges',
                icon: 'oranges.png',
                color: '#FCA430',
                filepath: 'Oranges (1kg).json',
                description: '1kg of oranges'
            },
            {
                name: 'bananas',
                icon: 'bananas.png',
                color: '#f8ce62',
                filepath: 'Banana (1kg).json',
                description: '1kg of bananas'
            },
            {
                name: 'coffee',
                icon: 'cappuccino.svg',
                color: '#DE4C3C',
                filepath: 'Cappuccino (regular).json',
                description: 'a regular-sized cappuccino'
            },
            {
                name: 'cola',
                icon: 'cola.svg',
                color: '#F94848',
                filepath: 'Coke or Pepsi (0.33 liter bottle).json',
                description: 'a 330ml can of cola'
            },
            {
                name: 'beer',
                icon: 'beer.svg',
                color: '#fdc167',
                filepath: 'Domestic Beer (0.5 liter draught).json',
                description: 'a pint (or 500ml) of domestic beer'
            },
            {
                name: 'wine',
                icon: 'wine.png',
                color: '#C84155',
                filepath: 'Bottle of Wine (Mid-Range).json',
                description: 'one bottle of wine (mid-range)'
            },
        ]

        // A lookup table containing the subtitles & descriptions of each different grocery item
        const groceriesDescs = {}

        /*
        This function uses the groceriesObj above to generate the HTML needed
        to display the shopping list. Changing groceriesObj will change the menu. 
        */
        const generateGroceryItemHTML = function(item, icon, color, fp) {
            const shoppingItem = `
                <div class="item ${item}" id="${item}" style="color: ${color}" href="${fp}">
                    <img src="./assets/${icon}" alt="${item}" width="30px">
                    ${item}
                </div>
                `
            return shoppingItem
        }

        // Append new HTML, with all needed data, to mount node
        groceriesObj.forEach(g => {

            // Create shopping list
            shoppingList.innerHTML += generateGroceryItemHTML(
                item = g.name,
                icon = g.icon,
                color = g.color,
                fp = g.filepath
            )

            // Create grocery lookup tables
            groceriesDescs[g.name] = g.description
        })

        //////////
        // FUNCTIONS TO GENERATE CHART
        // This generates on user interaction
        //////////

        /*
        This function returns a D3 colour scale based on the colour of 
        the menu item clicked. Takes into account the min and max
        values of the JSON file loaded.
        */
        const generateColourScale = function(minVal, maxVal, minColor, maxColor) {
            let scale = d3.scale.linear()
                .domain([minVal, maxVal])
                .range([minColor, maxColor])
            return scale
        } 

        /*
        This function will render a D3 bar chart based on a specified
        JSON file loaded in the function below.
        */
        const generateGraph = function(data, mountNodeID, scale) {
            nv.addGraph(function() {
                const chart = nv.models.discreteBarChart()
                    .x(function(d) { return d.label })
                    .y(function(d) { return d.value })
                    .staggerLabels(false)
                    .showValues(true)
                    .wrapLabels(true)
                    .color(function(d) { return scale(d.value) })
                    .margin({ 'top': 15, 'right': 10, 'bottom': 90, 'left': 80 })
                    .rotateLabels(0)
                    .duration(500)
                    .valueFormat(d3.format('$,.2f'))
                    .showYAxis(false)

                chart.xAxis
                    .axisLabel('City')
                    .axisLabelDistance(20)
                // chart.yAxis
                    // .axisLabel('Average Price USD $')
                    // .axisLabelDistance(0);

                d3.select(`#${mountNodeID} svg`)
                    .datum(data)
                    .call(chart)

                nv.utils.windowResize(chart.update)

                return chart
            })
        }

        /*
        This function will dynamically generate a graph, a colour scale, 
        and chart titles based on the shopping list item that is clicked.
        INPUT: Shopping list item
        FILTERS: Two drop down menus
        OUTPUT: A single graph
        */
        const generateEverything = function(item) {

            // Get data
            const filename = item.attributes.href.value
            const fp = `./data/${choosePrice.value}/${chooseLocation.value}/${filename}`
            const myData = $.getJSON({ 'url': fp, 'async': false }).responseJSON
            const onMobile = window.innerWidth <= 700
            if (onMobile) {
                (choosePrice.value === 'bottom10') ? myData[0].values.splice(0, 5) : myData[0].values.splice(5, 10)
            }
            const arrayEnd = myData[0].values.length - 1

            // Get icon (same src as the menu item)
            const icon = item.childNodes[1].src

            // Chart title vars
            const capitalizeFirstLetter = string => string.charAt(0).toUpperCase() + string.slice(1)
            const minCity = myData[0].values[ arrayEnd ].label
            const maxCity = myData[0].values[0].label
            const cheapOrExpensive = capitalizeFirstLetter(choosePrice.options[choosePrice.selectedIndex].text)
            const myCity = (choosePrice.value === 'bottom10') ? minCity : maxCity

            // Chart subtitle vars
            let subtitle = groceriesDescs[item.id]

            // Chart vars
            const minVal = myData[0].values[ arrayEnd ].value
            const maxVal = myData[0].values[0].value
            const minColor = 'lightgrey'
            const maxColor = item.style.color
            let colorScale = generateColourScale(minVal, maxVal, maxColor, minColor)
            if (choosePrice.value === 'bottom10') { // Reverse the colour scale based on data selector
                colorScale = generateColourScale(minVal, maxVal, maxColor, minColor)
            } else {
                colorScale = generateColourScale(minVal, maxVal, minColor, maxColor)
            }
            
            // Render
            chartTitle.innerHTML = `${cheapOrExpensive} city to buy <img src="${icon}" alt="${item.id}" width="30px"> <div style="display: inline; font-weight: 700; color: ${maxColor}">${item.id}</div> - ${myCity}`
            chartSubTitle.innerHTML = `Average price in US dollars to buy ${subtitle}`
            generateGraph(
                data = myData,
                mountNodeID = 'chart', 
                scale = colorScale
            )

        }

        //////////
        // EVENT LISTENERS
        //////////

        let currentlySelectedItem = null

        // Get the interactive elements
        const chartArea = document.getElementById('chartArea')
        const chooseItem = Array.from(shoppingList.childNodes)
        const choosePrice = document.getElementById('cheapOrExpensive')
        const chooseLocation = document.getElementById('chooseLocation')

        // Add event listeners to all shopping list items
        chooseItem.forEach(item => {
            item.addEventListener('mouseover', e => {            
                currentlySelectedItem = item
                item.classList.toggle('on') // ...for the menu items
                chartArea.classList.toggle('on') // ...for the chart area
                generateEverything(item)
            })
            item.addEventListener('mouseout', e => {            
                item.classList.toggle('on')
                chartArea.classList.toggle('on')
            })
        })

        // When changing price...
        choosePrice.addEventListener('change', e => {
            generateEverything(currentlySelectedItem)
        })

        // When changing location...
        chooseLocation.addEventListener('change', e => {
            generateEverything(currentlySelectedItem)
        }) 

    })()

})