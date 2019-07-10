# Worldwide Grocery Comparions
This app lets you compare the prices of 17 different grocery items across the world, drawing from a dataset of over 2000 cities across 5 continents.

Hover over (or tap) each grocery item to generate a chart showing either the 10 most expensive or the 10 cheapest cities to buy that particular item.

## Data Structure

All data needed to create the charts is stored in the `/data` directory.

Inside the `/data` directory, you have `/data/top10` (if the user selects "*most expensive*" from the dropdown) and `/data/bottom10` (if the user selects "*cheapest*").

Inside each of these, you have directories for the five continents, plus a worldwide directory (depending on which location the user chooses from the dropdown).

And inside each of these continent-level directories, you have individual JSON files for each of the 17 products in the shopping list.

As the user selects different grocery items, depending on the state of the dropdown select menus, and AJAX request will be made to that items particular filepath. For example, if a user selects to see the *most expensive cities in Asia to buy apples...*, the AJAX call will return:

`/data/top10/Asia/Apples (1kg).json`
≠
The data contained within each JSON is fed through to the D3 charting functions found within `/scripts/main.js`, and the D3 chart will dynamically update.

All data included in this app was parsed, prepped and wrangled in Python Jupyter Notebooks beforehand.