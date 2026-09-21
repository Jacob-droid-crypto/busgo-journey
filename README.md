# BusGo Journey

Create a modern, full-stack responsive Bus Booking Web Application (named "BusGo") with a clean, intuitive UI similar to RedBus or Wanderu. Use Tailwind CSS, Lucide icons, and modern design principles.

1. Hero & Search Section (Homepage):

- A prominent search bar at the top of the homepage with 4 fields: "From (Origin)", "To (Destination)", "Travel Date", and "Passengers".

- A "Swap Cities" button between Origin and Destination.

- Popular routes section below the search bar showing quick-select cards (e.g., "New York to Boston", "London to Paris").

2. Bus Search Results Page:

- Sidebar filters: Price range slider, Departure time (Morning, Afternoon, Evening), Bus Type (AC, Non-AC, Sleeper, Seater), and Operator name.

- Bus Result Cards: Display Operator Name, Bus Type, Rating, Departure Time, Arrival Time, Total Duration, Available Seats count, and Price per ticket.

- A "Select Seats" button on each card that expands the seat layout view.

3. Interactive Seat Selection View:

- Visual interactive grid representing a bus layout (driver seat at the front, 2x2 or 2x1 grid layout).

- Color-coded seats: Available (White/Gray), Selected (Primary Color), Booked/Unavailable (Disabled Dark Gray), Reserved for Women (Pink option).

- Real-time price counter updates as the user selects/deselects seats.

- Boarding & Dropping Point selection dropdowns right below the seat map.

- "Proceed to Booking" button enabled only after selecting at least 1 seat.

4. Checkout & Booking Summary Page:

- Passenger details form: Name, Age, Gender, Email, and Phone Number for each selected seat.

- Order Summary sidebar: Route details, Travel date, Selected seat numbers, Base fare, Taxes, and Total Price.

- Promo code input field with a dummy apply button.

- Payment Method Selection (Credit Card, UPI/Net Banking, PayPal mock options).

- "Pay & Confirm Booking" button.

5. Ticket Confirmation & Pass Page:

- A clean, downloadable/printable Digital Ticket card showing: Booking Reference ID, QR Code (mock), Passenger Details, Bus Info, Boarding/Dropping points, and Departure Time.

- "Download PDF Ticket" and "Book Another Trip" buttons.

6. User Dashboard / My Bookings:

- Tabbed view for "Upcoming Trips", "Completed Trips", and "Cancelled Trips".

- Ability to view ticket details or cancel an upcoming booking.

Data & Interactions:

- Include realistic mock data for popular cities, bus operators, schedules, and pricing.

- Ensure state management persists user search choices from the homepage down to the checkout page.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/67bcd796-d37f-544a-be87-3d94306022bb).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
