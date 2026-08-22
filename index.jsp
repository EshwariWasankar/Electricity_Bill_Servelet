<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="java.math.BigDecimal,java.math.RoundingMode" %>
<%!
    private String escapeHtml(String value) {
        return value.replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#39;");
    }
%>
<%
    String unitsInput = request.getParameter("units");
    String error = null;
    BigDecimal total = null;
    BigDecimal firstSlab = BigDecimal.ZERO;
    BigDecimal secondSlab = BigDecimal.ZERO;
    BigDecimal thirdSlab = BigDecimal.ZERO;
    BigDecimal fourthSlab = BigDecimal.ZERO;

    if ("POST".equalsIgnoreCase(request.getMethod())) {
        try {
            BigDecimal units = new BigDecimal(unitsInput == null ? "" : unitsInput.trim());
            if (units.compareTo(BigDecimal.ZERO) < 0) {
                error = "Please enter a positive number of units.";
            } else if (units.scale() > 2) {
                error = "Units can have at most two decimal places.";
            } else {
                BigDecimal firstUnits = units.min(new BigDecimal("50"));
                BigDecimal secondUnits = units.subtract(new BigDecimal("50")).max(BigDecimal.ZERO).min(new BigDecimal("100"));
                BigDecimal thirdUnits = units.subtract(new BigDecimal("150")).max(BigDecimal.ZERO).min(new BigDecimal("100"));
                BigDecimal fourthUnits = units.subtract(new BigDecimal("250")).max(BigDecimal.ZERO);

                firstSlab = firstUnits.multiply(new BigDecimal("3.50"));
                secondSlab = secondUnits.multiply(new BigDecimal("4.00"));
                thirdSlab = thirdUnits.multiply(new BigDecimal("5.20"));
                fourthSlab = fourthUnits.multiply(new BigDecimal("6.50"));
                total = firstSlab.add(secondSlab).add(thirdSlab).add(fourthSlab).setScale(2, RoundingMode.HALF_UP);
            }
        } catch (NumberFormatException exception) {
            error = "Enter a valid number of units to calculate your bill.";
        }
    }

    String displayUnits = unitsInput == null ? "" : escapeHtml(unitsInput);
    String moneyTotal = total == null ? "0.00" : total.toPlainString();
    String consumptionLabel = "Awaiting usage";
    String consumptionIcon = "○";
    String consumptionClass = "pending";
    int meterUnits = 0;
    int meterMaximum = 500;
    if (total != null) {
        BigDecimal enteredUnits = new BigDecimal(unitsInput.trim());
        meterUnits = Math.min(enteredUnits.setScale(0, RoundingMode.HALF_UP).intValue(), meterMaximum);
        if (enteredUnits.compareTo(new BigDecimal("50")) <= 0) {
            consumptionLabel = "Low Consumption";
            consumptionIcon = "●";
            consumptionClass = "low";
        } else if (enteredUnits.compareTo(new BigDecimal("150")) <= 0) {
            consumptionLabel = "Moderate Consumption";
            consumptionIcon = "●";
            consumptionClass = "moderate";
        } else if (enteredUnits.compareTo(new BigDecimal("250")) <= 0) {
            consumptionLabel = "High Consumption";
            consumptionIcon = "●";
            consumptionClass = "high";
        } else {
            consumptionLabel = "Very High Consumption";
            consumptionIcon = "●";
            consumptionClass = "very-high";
        }
    }
%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Wattwise | Electricity Bill Calculator</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap');

        :root {
            --ink: #18252a;
            --muted: #667478;
            --paper: #f5f2ea;
            --card: #fffdf8;
            --teal: #0f7771;
            --teal-dark: #095c58;
            --yellow: #f5c84b;
            --line: #dedbd1;
            --danger: #b34035;
            --meter-track: #e3e8e4;
            --shadow: rgba(24,37,42,.06);
            --result-bg: #18252a;
        }
        body.dark { --ink: #edf4f1; --muted: #a5b6b2; --paper: #172226; --card: #203034; --line: #3b4a4d; --meter-track: #3b4a4d; --shadow: rgba(0,0,0,.22); --result-bg: #0e171a; }

        * { box-sizing: border-box; }
        body {
            margin: 0;
            min-height: 100vh;
            color: var(--ink);
            background: var(--paper);
            font-family: 'DM Sans', sans-serif;
            background-image: radial-gradient(#d9d6cd 0.7px, transparent 0.7px);
            background-size: 18px 18px;
        }
        .shell { width: min(1120px, calc(100% - 40px)); margin: 0 auto; padding: 34px 0 48px; }
        header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 50px; }
        .brand { display: flex; gap: 12px; align-items: center; font-family: 'Space Grotesk', sans-serif; font-weight: 700; letter-spacing: -.03em; }
        .brand-mark { width: 36px; height: 36px; display: grid; place-items: center; color: var(--ink); background: var(--yellow); border-radius: 9px; font-size: 21px; }
        .status { color: var(--muted); font-size: 13px; display: flex; align-items: center; gap: 7px; }
        .status::before { content: ''; width: 8px; height: 8px; border-radius: 50%; background: #39a56f; }
        header nav { display: flex; align-items: center; gap: 9px; }
        .theme-toggle, .print-button { width: auto; padding: 9px 13px; color: var(--ink); background: transparent; border: 1px solid var(--line); font-size: 13px; }
        .theme-toggle:hover, .print-button:hover { color: var(--ink); background: var(--yellow); }
        .intro { max-width: 720px; margin-bottom: 34px; animation: rise .6s ease both; }
        h1 { font-family: 'Space Grotesk', sans-serif; font-size: clamp(2.3rem, 5vw, 4.6rem); line-height: .98; letter-spacing: -.065em; margin: 0 0 18px; }
        .intro p { margin: 0; max-width: 540px; color: var(--muted); font-size: 17px; line-height: 1.55; }
        .layout { display: grid; grid-template-columns: minmax(0, 1.05fr) minmax(330px, .95fr); gap: 22px; align-items: start; }
        .panel { background: var(--card); border: 1px solid var(--line); border-radius: 14px; box-shadow: 0 12px 30px rgba(24,37,42,.06); }
        .form-panel { padding: clamp(24px, 4vw, 42px); }
        .eyebrow { color: var(--teal); font-size: 12px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; margin-bottom: 12px; }
        h2 { font-family: 'Space Grotesk', sans-serif; font-size: 25px; margin: 0 0 8px; letter-spacing: -.04em; }
        .subtext { color: var(--muted); font-size: 14px; line-height: 1.5; margin: 0 0 28px; }
        label { display: block; font-size: 14px; font-weight: 700; margin-bottom: 8px; }
        .input-wrap { display: flex; align-items: center; border: 1px solid #bfc7c5; border-radius: 8px; overflow: hidden; background: #fff; margin-bottom: 10px; transition: border-color .2s, box-shadow .2s; }
        .input-wrap:focus-within { border-color: var(--teal); box-shadow: 0 0 0 3px rgba(15,119,113,.13); }
        input { width: 100%; border: 0; outline: 0; padding: 16px; font: inherit; font-size: 20px; color: var(--ink); background: transparent; }
        .unit { color: var(--muted); padding-right: 16px; font-size: 14px; }
        .hint { color: var(--muted); font-size: 12px; margin: 0 0 24px; }
        button { width: 100%; border: 0; border-radius: 8px; padding: 16px 20px; background: var(--teal); color: white; font: 700 15px 'DM Sans', sans-serif; cursor: pointer; transition: background .2s, transform .2s; }
        button:hover { background: var(--teal-dark); transform: translateY(-1px); }
        .error { color: var(--danger); font-size: 13px; margin: -2px 0 16px; }
        .result-panel { padding: 30px; background: var(--result-bg); color: white; min-height: 300px; overflow: hidden; position: relative; }
        .result-panel.has-result { animation: result-in .55s cubic-bezier(.2,.8,.2,1) both; }
        .result-panel::after { content: '₹'; position: absolute; right: 25px; top: 8px; font: 700 160px 'Space Grotesk', sans-serif; color: rgba(245,200,75,.12); line-height: 1; }
        .result-panel .eyebrow { color: var(--yellow); position: relative; z-index: 1; }
        .result-panel h2 { position: relative; z-index: 1; font-size: 16px; color: #d5dfdc; font-family: 'DM Sans', sans-serif; font-weight: 500; letter-spacing: 0; }
        .amount { position: relative; z-index: 1; font: 700 clamp(3rem, 6vw, 5rem)/1 'Space Grotesk', sans-serif; letter-spacing: -.06em; margin: 16px 0 28px; }
        .amount span { font: 500 17px 'DM Sans', sans-serif; color: #b5c3c0; letter-spacing: 0; }
        .breakdown { position: relative; z-index: 1; border-top: 1px solid rgba(255,255,255,.17); padding-top: 15px; }
        .row { display: flex; justify-content: space-between; gap: 14px; color: #c5d0cd; font-size: 13px; padding: 7px 0; }
        .row strong { color: white; font-weight: 600; }
        .classification { position: relative; z-index: 1; margin: 18px 0 22px; display: flex; align-items: center; gap: 8px; font-size: 14px; color: #dbe5e2; }
        .classification strong { color: white; }
        .classification.low b { color: #65cf91; }
        .classification.moderate b { color: #f5c84b; }
        .classification.high b { color: #f28b45; }
        .classification.very-high b { color: #ed665b; }
        .meter { position: relative; z-index: 1; }
        .meter-head { display: flex; justify-content: space-between; color: #b5c3c0; font-size: 12px; margin-bottom: 8px; }
        .meter-track { height: 12px; border-radius: 20px; overflow: hidden; background: var(--meter-track); }
        .meter-fill { height: 100%; width: 0; border-radius: inherit; transition: width .8s ease .15s, background .25s ease; }
        .meter-fill.low { background: #65cf91; }
        .meter-fill.moderate { background: #f5c84b; }
        .meter-fill.high { background: #f28b45; }
        .meter-fill.very-high { background: #ed665b; }
        .result-tools { position: relative; z-index: 1; display: flex; justify-content: flex-end; margin-top: 20px; }
        .print-button { color: white; border-color: rgba(255,255,255,.3); }
        .print-button:hover { color: var(--ink); }
        .tariffs { grid-column: 1 / -1; padding: 25px 30px; display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 18px; }
        .tariff { border-left: 3px solid var(--yellow); padding-left: 13px; }
        .tariff b { display: block; font-family: 'Space Grotesk', sans-serif; font-size: 19px; margin-bottom: 3px; }
        .tariff span { font-size: 12px; color: var(--muted); }
        @keyframes rise { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes result-in { from { opacity: 0; transform: translateY(18px) scale(.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @media print {
            body { background: white; color: #18252a; }
            header nav, .intro, .form-panel, .tariffs, .result-tools { display: none; }
            .shell { width: 100%; padding: 0; }
            .result-panel { color: #18252a; background: white; border: 1px solid #ddd; box-shadow: none; }
            .result-panel::after { color: #f5c84b; }
            .result-panel h2, .amount span, .row, .meter-head, .classification { color: #667478; }
            .amount, .row strong, .classification strong { color: #18252a; }
        }
        @media (max-width: 720px) {
            .shell { width: min(100% - 24px, 560px); padding-top: 22px; }
            header { margin-bottom: 36px; }
            .status { display: none; }
            .layout { grid-template-columns: 1fr; }
            .tariffs { grid-column: auto; grid-template-columns: 1fr 1fr; padding: 22px; }
            .result-panel { order: -1; }
        }
        @media (max-width: 390px) { .tariffs { grid-template-columns: 1fr; } }
    </style>
</head>
<body>
    <main class="shell">
        <header>
            <div class="brand"><span class="brand-mark">⚡</span> wattwise</div>
            <nav>
                <div class="status">Progressive residential tariff</div>
                <button class="theme-toggle" type="button" id="themeToggle" aria-label="Switch color theme">☾ Dark</button>
            </nav>
        </header>

        <section class="intro">
            <h1>Know what your power costs.</h1>
            <p>Enter the electricity units you used and get a clear estimate based on the current slab rates.</p>
        </section>

        <section class="layout">
            <form class="panel form-panel" method="post" action="index.jsp">
                <div class="eyebrow">Bill estimator</div>
                <h2>How much did you use?</h2>
                <p class="subtext">Your bill is calculated progressively, so each block of units gets its own rate.</p>
                <label for="units">Electricity consumption</label>
                <div class="input-wrap">
                    <input id="units" name="units" type="number" min="0" step="0.01" value="<%= displayUnits %>" placeholder="e.g. 180" required autofocus>
                    <span class="unit">units</span>
                </div>
                <p class="hint">Enter a whole number or up to two decimal places.</p>
                <% if (error != null) { %><p class="error" role="alert"><%= error %></p><% } %>
                <button type="submit">Calculate my bill <span aria-hidden="true">→</span></button>
            </form>

            <section class="panel result-panel <%= total == null ? "" : "has-result" %>" aria-live="polite">
                <div class="eyebrow">Estimated total</div>
                <h2>For <%= displayUnits.isEmpty() ? "your usage" : displayUnits + " units" %></h2>
                <div class="amount">₹<%= moneyTotal %> <span>INR</span></div>
                <div class="classification <%= consumptionClass %>"><b><%= consumptionIcon %></b> <strong><%= consumptionLabel %></strong><%= total == null ? "" : " — " + (consumptionClass.equals("low") ? "0–50 units" : consumptionClass.equals("moderate") ? "51–150 units" : consumptionClass.equals("high") ? "151–250 units" : "250+ units") %></div>
                <div class="meter">
                    <div class="meter-head"><span>Consumption</span><span><%= meterUnits %> / <%= meterMaximum %> units</span></div>
                    <div class="meter-track"><div class="meter-fill <%= consumptionClass %>" data-meter="<%= meterUnits %>" aria-label="<%= meterUnits %> out of <%= meterMaximum %> units"></div></div>
                </div>
                <div class="breakdown">
                    <div class="row"><span>First 50 units</span><strong>₹<%= firstSlab.setScale(2, RoundingMode.HALF_UP).toPlainString() %></strong></div>
                    <div class="row"><span>Next 100 units</span><strong>₹<%= secondSlab.setScale(2, RoundingMode.HALF_UP).toPlainString() %></strong></div>
                    <div class="row"><span>Next 100 units</span><strong>₹<%= thirdSlab.setScale(2, RoundingMode.HALF_UP).toPlainString() %></strong></div>
                    <div class="row"><span>Above 250 units</span><strong>₹<%= fourthSlab.setScale(2, RoundingMode.HALF_UP).toPlainString() %></strong></div>
                </div>
                <div class="result-tools"><button class="print-button" type="button" onclick="window.print()">⇩ Print / Save bill</button></div>
            </section>

            <section class="panel tariffs" aria-label="Tariff rates">
                <div class="tariff"><b>₹3.50 / unit</b><span>First 50 units</span></div>
                <div class="tariff"><b>₹4.00 / unit</b><span>Next 100 units</span></div>
                <div class="tariff"><b>₹5.20 / unit</b><span>Next 100 units</span></div>
                <div class="tariff"><b>₹6.50 / unit</b><span>Above 250 units</span></div>
            </section>
        </section>
    </main>
    <script>
        const themeToggle = document.getElementById('themeToggle');
        const meterFill = document.querySelector('.meter-fill');
        if (meterFill) meterFill.style.width = (Number(meterFill.dataset.meter) / 500 * 100) + '%';
        const savedTheme = localStorage.getItem('wattwise-theme');
        if (savedTheme === 'dark') document.body.classList.add('dark');
        const updateThemeButton = () => { themeToggle.textContent = document.body.classList.contains('dark') ? '☀ Light' : '☾ Dark'; };
        updateThemeButton();
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark');
            localStorage.setItem('wattwise-theme', document.body.classList.contains('dark') ? 'dark' : 'light');
            updateThemeButton();
        });
    </script>
</body>
</html>
