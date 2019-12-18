# Massagebooker

An application for booking massage appointments. Try the demo instance [here](https://massagebooker.herokuapp.com).

## Technology stack

The frontend is build around React and the the backend around Node.js. MongoDB was used as the database, Express as the HTTP server and Passport.js for authentication with Google.

## Features

- Calendar view
- Making massage reservations
- Booking rules
- Google login
- User management
- Admin console
- Info page
- Statistics
- TV view
- Appointment generation

## How to deploy

The included Dockerfile works if working environment variables are passed. Heroku can build directly from this repository as long as the heroku stack is set to "container". More instructions can be found from the [frontend](massagebooker-frontend) and [backend](massagebooker-backend) directories.

## History

This project is based on code developed during project development course than ran during Summer 2019. The goal was to write a massage booking system for Unity Technologies Finland. This app was tailored for their use case and therefore makes assumptions about the massage hours and rules relating to the reservations. The original code with commit history can be found [here](https://github.com/karoliinaemilia/massage-booking-system). This repository exists for refactoring practise and archiving purposes.

## Problems

The way state is managed by using custom hooks is completely dysfunctional as it causes both unnecessary rerenders and only works because of bunch of hacks. The way backend handles editing multiple entries in database is horribly inefficient and causes noticeable delay. These two factors together make the app feel sluggish even with limited amount of data. The CSS is also utterly broken. Both backend and frontend have bunch of ad hoc solutions for problems where better existing alternatives exists.

## Conclusion

A lot of work is needed to bring the project to an acceptable state. The code quality is much better now that it was before the refactoring but the structural issues still remain. That being said, the application works.
