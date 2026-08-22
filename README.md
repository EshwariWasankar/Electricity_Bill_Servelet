# Wattwise Electricity Bill Calculator

A responsive JSP electricity bill calculator using progressive slab rates:

- First 50 units: Rs. 3.50 per unit
- Next 100 units: Rs. 4.00 per unit
- Next 100 units: Rs. 5.20 per unit
- Units above 250: Rs. 6.50 per unit

## Run with Apache Tomcat

1. Copy this folder into Tomcat's `webapps` directory, or deploy it as the application root.
2. Start Tomcat.
3. Open `http://localhost:8080/cs_l_temp/` in a browser.

The calculation is performed server-side in `index.jsp` when the form is submitted with `POST`.