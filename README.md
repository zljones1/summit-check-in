# Summit Check-In

Team Sustainability Summit check-in, written only in JavaScript.

`app.js` creates the page, sets every style with JavaScript, and runs the check-in. There is no CSS file. `index.html` exists only so a browser can start `app.js`.

Because `index.html` loads `app.js` as a JavaScript module, serve the folder over HTTP instead of opening the file directly:

```sh
python3 -m http.server 8000
```

Then open `http://localhost:8000` in your browser. Keep the server running while using the page.

- Greeting uses the attendee name and full team name
- Total attendance counts toward a goal of 50, with a progress bar
- Separate counts for Team Water Wise, Team Net Zero, and Team Renewables
- At 50, a celebration names the winning team (or a tie)
- The total, team counts, and attendee list are saved in the browser and stay after a refresh
- The attendee list under the team counters shows each name and team
