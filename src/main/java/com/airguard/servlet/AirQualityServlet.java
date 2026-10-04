package com.airguard.servlet;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.util.Locale;

@WebServlet("/api/air-quality")
public class AirQualityServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("application/json;charset=UTF-8");
        String gas = req.getParameter("gas");
        double gasPct = 0;
        try {
            if (gas != null) gasPct = Math.max(0, Math.min(100, Double.parseDouble(gas)));
        } catch (NumberFormatException ignored) {}

        String level = gasPct < 25 ? "SAFE" : gasPct < 50 ? "MODERATE" : gasPct < 75 ? "HIGH" : "CRITICAL";
        String action = gasPct < 25
                ? "Normal conditions. Continue monitoring."
                : gasPct < 50
                ? "Improve ventilation and monitor the area."
                : gasPct < 75
                ? "Avoid prolonged exposure. Increase ventilation and move vulnerable people away."
                : "Leave the affected area, avoid ignition sources, and contact the appropriate emergency/environment authority.";

        String json = String.format(Locale.US,
                "{\"gasPercentage\":%.1f,\"level\":\"%s\",\"action\":\"%s\"}",
                gasPct, level, action.replace("\"","\\\""));
        resp.getWriter().print(json);
    }
}
