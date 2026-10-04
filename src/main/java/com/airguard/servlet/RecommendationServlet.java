package com.airguard.servlet;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@WebServlet("/api/recommendations")
public class RecommendationServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws IOException {

        resp.setContentType("application/json;charset=UTF-8");

        String location = req.getParameter("location");

        if (location == null) {
            location = "";
        }

        location = location.trim().toLowerCase();

        List<String> plants = new ArrayList<>();

        /*
         * SOUTH INDIA / TAMIL NADU
         */
        if (location.contains("chennai")
                || location.contains("keelkattalai")
                || location.contains("tambaram")
                || location.contains("madipakkam")
                || location.contains("chromepet")
                || location.contains("coimbatore")
                || location.contains("madurai")
                || location.contains("salem")
                || location.contains("trichy")
                || location.contains("tiruchirappalli")) {

            plants.add("Neem");
            plants.add("Pongamia");
            plants.add("Indian Almond");
            plants.add("Arali");
            plants.add("Peepal");
        }

        /*
         * MUMBAI / WEST COAST
         */
        else if (location.contains("mumbai")
                || location.contains("pune")
                || location.contains("goa")
                || location.contains("panaji")) {

            plants.add("Rain Tree");
            plants.add("Indian Almond");
            plants.add("Neem");
            plants.add("Gulmohar");
            plants.add("Pongamia");
        }

        /*
         * DELHI / NORTH INDIA
         */
        else if (location.contains("delhi")
                || location.contains("new delhi")
                || location.contains("noida")
                || location.contains("gurgaon")
                || location.contains("gurugram")
                || location.contains("faridabad")) {

            plants.add("Neem");
            plants.add("Peepal");
            plants.add("Jamun");
            plants.add("Ashoka");
            plants.add("Arjun");
        }

        /*
         * BENGALURU / KARNATAKA
         */
        else if (location.contains("bengaluru")
                || location.contains("bangalore")
                || location.contains("mysore")
                || location.contains("mysuru")) {

            plants.add("Rain Tree");
            plants.add("Neem");
            plants.add("Copperpod");
            plants.add("Gulmohar");
            plants.add("Indian Almond");
        }

        /*
         * HYDERABAD / TELANGANA
         */
        else if (location.contains("hyderabad")
                || location.contains("secunderabad")
                || location.contains("warangal")) {

            plants.add("Neem");
            plants.add("Gulmohar");
            plants.add("Jamun");
            plants.add("Pongamia");
            plants.add("Arjun");
        }

        /*
         * KERALA / HIGH RAINFALL AREAS
         */
        else if (location.contains("kerala")
                || location.contains("kochi")
                || location.contains("cochin")
                || location.contains("thiruvananthapuram")
                || location.contains("trivandrum")
                || location.contains("kozhikode")
                || location.contains("calicut")) {

            plants.add("Rain Tree");
            plants.add("Indian Almond");
            plants.add("Neem");
            plants.add("Pongamia");
            plants.add("Jackfruit");
        }

        /*
         * KOLKATA / EAST INDIA
         */
        else if (location.contains("kolkata")
                || location.contains("calcutta")
                || location.contains("bhubaneswar")
                || location.contains("patna")) {

            plants.add("Neem");
            plants.add("Peepal");
            plants.add("Rain Tree");
            plants.add("Arjun");
            plants.add("Jamun");
        }

        /*
         * DEFAULT / OTHER LOCATIONS
         */
        else {

            plants.add("Neem");
            plants.add("Peepal");
            plants.add("Jamun");
            plants.add("Arjun");
            plants.add("Pongamia");
        }

        /*
         * CREATE JSON RESPONSE
         */

        StringBuilder json = new StringBuilder("[");

        for (int i = 0; i < plants.size(); i++) {

            if (i > 0) {
                json.append(",");
            }

            json.append("\"")
                .append(escapeJson(plants.get(i)))
                .append("\"");
        }

        json.append("]");

        resp.getWriter().print(json.toString());
    }

    private String escapeJson(String value) {

        return value
                .replace("\\", "\\\\")
                .replace("\"", "\\\"");
    }
}