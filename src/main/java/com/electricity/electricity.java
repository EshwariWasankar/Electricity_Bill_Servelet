package com.electricity;

import java.io.IOException;
import java.io.PrintWriter;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/CalculateBill")
public class electricity extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("text/html;charset=UTF-8");

        String name = request.getParameter("consumerName");
        String category = request.getParameter("category");
        if (category == null) category = "Residential";

        double units = Double.parseDouble(request.getParameter("units"));

        // Slab Calculations
        double slab1 = 0, slab2 = 0, slab3 = 0, slab4 = 0;
        if (units > 250) {
            slab4 = (units - 250) * 6.50;
            slab3 = 100 * 5.20;
            slab2 = 100 * 4.00;
            slab1 = 50 * 3.50;
        } else if (units > 150) {
            slab3 = (units - 150) * 5.20;
            slab2 = 100 * 4.00;
            slab1 = 50 * 3.50;
        } else if (units > 50) {
            slab2 = (units - 50) * 4.00;
            slab1 = 50 * 3.50;
        } else {
            slab1 = units * 3.50;
        }

        double energyCharge = slab1 + slab2 + slab3 + slab4;
        if (category.equalsIgnoreCase("Commercial")) {
            energyCharge *= 1.10;
        }

        double fixedCharge = 50.00;
        double stateTax = energyCharge * 0.05;
        double totalBill = energyCharge + fixedCharge + stateTax;
        double lateFeeBill = totalBill * 1.05;

        double carbonFootprint = units * 0.85;
        String billRef = "GRID-" + (100000 + (int)(Math.random() * 899999));
        String currentDate = LocalDate.now().format(DateTimeFormatter.ofPattern("dd MMM yyyy"));
        String dueDate = LocalDate.now().plusDays(15).format(DateTimeFormatter.ofPattern("dd MMM yyyy"));

        String ecoRating;
        String badgeColor;
        if (units <= 100) {
            ecoRating = "A+ OPTIMAL ECO-SAVER";
            badgeColor = "#00ff87";
        } else if (units <= 250) {
            ecoRating = "B MODERATE CONSUMPTION";
            badgeColor = "#ffb703";
        } else {
            ecoRating = "CRITICAL HIGH ENERGY LOAD";
            badgeColor = "#ff0055";
        }

        try (PrintWriter out = response.getWriter()) {
            out.println("<!DOCTYPE html>");
            out.println("<html lang='en'>");
            out.println("<head>");
            out.println("<meta charset='UTF-8'>");
            out.println("<meta name='viewport' content='width=device-width, initial-scale=1.0'>");
            out.println("<title>Energy Audit Receipt | " + billRef + "</title>");
            out.println("<link href='https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;900&family=Rajdhani:wght@500;600;700&display=swap' rel='stylesheet'>");
            out.println("<style>");
            out.println("* { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Rajdhani', sans-serif; }");
            out.println("body { background: radial-gradient(circle at center, #0f172a 0%, #030712 100%); color: #e2e8f0; min-height: 100vh; display: flex; justify-content: center; align-items: center; padding: 30px; }");
            
            // Expanded full-width wrapper
            out.println(".dashboard-wrapper { width: 95%; max-width: 1300px; background: rgba(15, 23, 42, 0.9); border: 1px solid rgba(0, 240, 255, 0.3); border-radius: 16px; box-shadow: 0 0 40px rgba(0, 240, 255, 0.2); backdrop-filter: blur(12px); padding: 35px; }");
            
            out.println(".top-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px dashed rgba(255,255,255,0.15); padding-bottom: 20px; margin-bottom: 25px; }");
            out.println(".top-header h1 { font-family: 'Orbitron', sans-serif; font-size: 1.8rem; color: #fff; letter-spacing: 2px; }");
            out.println(".ref-badge { font-size: 0.9rem; color: #00f0ff; letter-spacing: 1px; }");
            out.println(".badge { display: inline-block; padding: 6px 16px; border-radius: 20px; font-weight: 700; font-size: 0.85rem; border: 1px solid " + badgeColor + "; color: " + badgeColor + "; }");
            
            // 3-Column Wide Grid for Audit Results
            out.println(".audit-grid { display: grid; grid-template-columns: 1fr 1.3fr 1fr; gap: 25px; margin-bottom: 25px; }");
            out.println(".card-panel { background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 22px; }");
            out.println(".card-panel h3 { font-family: 'Orbitron', sans-serif; font-size: 1rem; color: #00f0ff; margin-bottom: 15px; border-bottom: 1px solid rgba(0,240,255,0.2); padding-bottom: 8px; uppercase; }");
            
            out.println(".data-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.05); font-size: 1rem; }");
            out.println(".data-row.total-row { font-size: 1.5rem; font-family: 'Orbitron', sans-serif; color: #00ff87; border-top: 2px solid #00ff87; border-bottom: 2px solid #00ff87; margin-top: 15px; padding: 12px 0; }");
            
            out.println(".btn-container { display: flex; gap: 20px; margin-top: 10px; }");
            out.println(".btn-action { flex: 1; text-align: center; padding: 16px; background: linear-gradient(135deg, #00f0ff 0%, #0072ff 100%); color: #000; text-decoration: none; border-radius: 8px; font-family: 'Orbitron', sans-serif; font-weight: 900; letter-spacing: 1px; text-transform: uppercase; }");
            out.println(".btn-action.secondary { background: rgba(255,255,255,0.1); color: #fff; border: 1px solid rgba(255,255,255,0.2); }");
            
            out.println("@media (max-width: 1024px) { .audit-grid { grid-template-columns: 1fr; } }");
            out.println("</style>");
            out.println("</head>");
            out.println("<body>");

            out.println("<div class='dashboard-wrapper'>");
            
            // Header
            out.println("<div class='top-header'>");
            out.println("<div>");
            out.println("<h1>OFFICIAL ENERGY AUDIT RECEIPT</h1>");
            out.println("<div class='ref-badge'>TRANSACTION ID: " + billRef + " | DATE: " + currentDate + "</div>");
            out.println("</div>");
            out.println("<div class='badge'>" + ecoRating + "</div>");
            out.println("</div>");

            // 3-Column Grid Output
            out.println("<div class='audit-grid'>");
            
            // Column 1: Consumer Profile
            out.println("<div class='card-panel'>");
            out.println("<h3>Account Profile</h3>");
            out.println("<div class='data-row'><span>Consumer Name</span><strong>" + name + "</strong></div>");
            out.println("<div class='data-row'><span>Tariff Category</span><strong>" + category + "</strong></div>");
            out.println("<div class='data-row'><span>Total Units Consumed</span><strong>" + units + " kWh</strong></div>");
            out.println("<div class='data-row'><span>Billing Cycle</span><strong>Monthly</strong></div>");
            out.println("</div>");

            // Column 2: Detailed Cost Breakdown
            out.println("<div class='card-panel'>");
            out.println("<h3>Slab Breakdown</h3>");
            out.println("<div class='data-row'><span>First 50 Units (@ ₹3.50)</span><span>₹" + String.format("%.2f", slab1) + "</span></div>");
            out.println("<div class='data-row'><span>Next 100 Units (@ ₹4.00)</span><span>₹" + String.format("%.2f", slab2) + "</span></div>");
            out.println("<div class='data-row'><span>Next 100 Units (@ ₹5.20)</span><span>₹" + String.format("%.2f", slab3) + "</span></div>");
            out.println("<div class='data-row'><span>Above 250 Units (@ ₹6.50)</span><span>₹" + String.format("%.2f", slab4) + "</span></div>");
            out.println("<div class='data-row'><span>Fixed Grid Charge</span><span>₹" + String.format("%.2f", fixedCharge) + "</span></div>");
            out.println("<div class='data-row'><span>State Energy Tax (5%)</span><span>₹" + String.format("%.2f", stateTax) + "</span></div>");
            out.println("</div>");

            // Column 3: Total Payable & Environmental Impact
            out.println("<div class='card-panel'>");
            out.println("<h3>Financial & Impact Audit</h3>");
            out.println("<div class='data-row total-row'><span>NET PAYABLE</span><span>₹" + String.format("%.2f", totalBill) + "</span></div>");
            out.println("<div style='margin-top: 15px; font-size: 0.95rem; line-height: 1.6; color: #cbd5e1;'>");
            out.println("🌱 <strong>Carbon Emissions:</strong> ~" + String.format("%.2f", carbonFootprint) + " kg CO₂<br>");
            out.println("📅 <strong>Payment Due Date:</strong> " + dueDate + "<br>");
            out.println("⚠️ <strong>Post Due Penalty:</strong> ₹" + String.format("%.2f", lateFeeBill) + " (+5%)");
            out.println("</div>");
            out.println("</div>");

            out.println("</div>"); // End Audit Grid

            // Action Buttons
            out.println("<div class='btn-container'>");
            out.println("<a href='index.html' class='btn-action'>← Recalculate New Load</a>");
            out.println("<a href='#' onclick='window.print()' class='btn-action secondary'>🖨️ Print Official Receipt</a>");
            out.println("</div>");

            out.println("</div>"); // End Dashboard Wrapper

            out.println("</body>");
            out.println("</html>");
        }
    }
}