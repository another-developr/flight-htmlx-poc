function flightApp() {
    return {
        fromLocation: 'London',
        toLocation: 'Amsterdam',
        departDate: '',
        arriveDate: '',
        flights: [],
        hasSearched: false,
        error: '',

        // Centralized dropdown state
        dropdowns: {},

        // Initialize a dropdown with unique key and config
        initDropdown(key, config) {
            if (!this.dropdowns[key]) {
                this.dropdowns[key] = {
                    open: false,
                    label: config.label || 'Select an option',
                    items: config.items || [],
                    selectedItems: config.multiple ? [] : null,
                    multiple: config.multiple || false,
                    hasIcon: config.hasIcon || false,
                    icon: config.icon || null,
                    textColor: config.textColor || 'text-gray-700',
                    labelSelected: config.labelSelected,
                };
            }
        },

        // Toggle open state for a specific dropdown
        toggleDropdown(key) {
            this.dropdowns[key].open = !this.dropdowns[key].open;
        },

        // Select or toggle item in dropdown
        selectDropdownItem(key, item) {
            const dropdown = this.dropdowns[key];
            if (dropdown.multiple) {
                // Toggle selection for multi-select dropdown
                if (dropdown.selectedItems.map(i => i[0]).includes(item[0])) {
                    dropdown.selectedItems = dropdown.selectedItems.filter(i => i[0] !== item[0]);
                } else {
                    dropdown.selectedItems.push(item);
                }
            } else {
                // Single-select dropdown
                dropdown.selectedItems = item;
                dropdown.open = false; // Close dropdown after selecting an item in single-select
            }
        },
            loadDropdownHTML(element) {
                fetch("src/components/dropdown.html")
                .then(response => response.text())
                .then(html => {
                  element.innerHTML = html;
                });
            },

        // Flight fetching and other utility functions remain the same
        fetchFlights() {
            if (!this.fromLocation || !this.toLocation) {
                this.error = 'Please provide a "From" location at least.';
                return;
            }
            this.hasSearched = true;
            this.error = '';

            const options = Object.keys(this.dropdowns).reduce((acc, key) => {

               if (!this.dropdowns[key].selectedItems || this.dropdowns[key].selectedItems == false) //falsey
                        return acc;
               if ( this.dropdowns[key].multiple)
                    acc[key] = this.dropdowns[key].selectedItems.map(x => x[0])
               else
                    acc[key] = this.dropdowns[key].selectedItems ? this.dropdowns[key].selectedItems[0]: null

              return acc;
            }, {});


            fetch('http://localhost:8000/flights/search', {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    departure_city: this.fromLocation,
                    destination_city: this.toLocation,
                    from_date:  document.getElementById('fromDate').value,
                    to_date: document.getElementById('toDate').value,
                    options
                })
            })
                .then(response => response.json())
                .then(data => {

                    this.flights = data.flights.map(flight => {
                    const stops = flight.number_of_stops ? flight.number_of_stops : "Non"
                    const s =  flight.number_of_stops > 1 ? 's': ''
                    return  {
                        id: flight.id,
                        logo: flight.logo_url || "https://via.placeholder.com/40",
                        departureTime: this.formatTime(new Date(flight.departure_dt)),
                        arrivalTime: this.formatTime(new Date(flight.arrival_dt)),
                        source: flight.source,
                        sink: flight.sink,
                        details: `${stops}-stop${s} · ${this.formattedDuration(new Date(flight.departure_dt), new Date(flight.arrival_dt))} · ${flight.airline}`,
                        price: flight.price,
                        tripType: flight.trip_type,
                        emissions: flight.emissions
                    }
                    });
                });
        },

        // Helper functions for formatting time and duration
        formatTime(date) {
            return date.toTimeString().slice(0, 5);
        },
        formattedDuration(fromDate, toDate) {
            const durationMinutes = Math.floor((toDate - fromDate) / (60 * 1000));
            const hours = Math.floor(durationMinutes / 60);
            const minutes = durationMinutes % 60;
            return `${hours} hr ${minutes} min`;
        }
    };
}



function updateDateDisplay(displayId, inputId) {
const dateInput = document.getElementById(inputId);
const display = document.getElementById(displayId);
const selectedDate = new Date(dateInput.value);
if (dateInput.value) {
  const options = { weekday: 'short', day: 'numeric', month: 'short' };
  display.textContent = selectedDate.toLocaleDateString('en-US', options);
} else {
  display.textContent = 'Select a Date';
}
}

function changeDate(offset, inputId) {
const dateInput = document.getElementById(inputId);
const currentDate = dateInput.value ? new Date(dateInput.value) : new Date();
currentDate.setDate(currentDate.getDate() + offset);
dateInput.value = currentDate.toISOString().split('T')[0];
updateDateDisplay(inputId + 'Display', inputId);
}

const initApp = () => {
   updateDateDisplay('toDateDisplay', 'toDate');
   updateDateDisplay('fromDateDisplay', 'fromDate');
}

document.addEventListener("DOMContentLoaded", function() {
    initApp()

});

