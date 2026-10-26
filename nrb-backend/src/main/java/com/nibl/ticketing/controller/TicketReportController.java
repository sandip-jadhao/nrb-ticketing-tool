package com.nibl.ticketing.controller;

import com.nibl.ticketing.entity.Ticket;
import com.nibl.ticketing.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/api/admin/reports")
@RequiredArgsConstructor
public class TicketReportController {

    private final TicketRepository ticketRepository;

    @GetMapping("/download-excel")
    @PreAuthorize("hasRole('ADMIN')")
    public void downloadTicketReport(
            @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            HttpServletResponse response
    ) throws IOException {
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(LocalTime.MAX);

        // Fetch tickets within the date range
        List<Ticket> tickets = ticketRepository.findByCreatedAtBetween(startDateTime, endDateTime);

        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Ticket Call Report");

        // Styling: Header Font & Fill
        CellStyle headerStyle = workbook.createCellStyle();
        headerStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
        headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        Font headerFont = workbook.createFont();
        headerFont.setBold(true);
        headerStyle.setFont(headerFont);

        // Header Row
        String[] columns = {"ID", "Title", "Priority", "Status", "Created By", "Assigned Engineer", "Created At", "Resolved At"};
        Row headerRow = sheet.createRow(0);
        for (int i = 0; i < columns.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(columns[i]);
            cell.setCellStyle(headerStyle);
        }

        // Data Rows
        int rowNum = 1;
        for (Ticket t : tickets) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(t.getId());
            row.createCell(1).setCellValue(t.getTitle() != null ? t.getTitle() : "");
            row.createCell(2).setCellValue(t.getPriority() != null ? t.getPriority().name() : "");
            row.createCell(3).setCellValue(t.getStatus() != null ? t.getStatus().name() : "");
            row.createCell(4).setCellValue(t.getCreatedBy() != null ? t.getCreatedBy().getFirstName() + " " + t.getCreatedBy().getLastName() : "—");
            row.createCell(5).setCellValue(t.getAssignedEngineer() != null ? t.getAssignedEngineer().getFirstName() + " " + t.getAssignedEngineer().getLastName() : "Unassigned");
            row.createCell(6).setCellValue(t.getCreatedAt() != null ? t.getCreatedAt().toString() : "");
            row.createCell(7).setCellValue(t.getResolvedAt() != null ? t.getResolvedAt().toString() : "—");
        }

        // Autosize columns
        for (int i = 0; i < columns.length; i++) {
            sheet.autoSizeColumn(i);
        }

        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        response.setHeader(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=Ticket_Call_Report_" + startDate + "_to_" + endDate + ".xlsx");

        workbook.write(response.getOutputStream());
        workbook.close();
    }
}