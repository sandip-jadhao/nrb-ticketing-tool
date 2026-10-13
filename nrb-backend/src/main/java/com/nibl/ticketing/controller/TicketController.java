package com.nibl.ticketing.controller;

import com.nibl.ticketing.entity.Ticket;
import com.nibl.ticketing.enums.Priority;
import com.nibl.ticketing.enums.TicketStatus;
import com.nibl.ticketing.service.FileStorageService;
import com.nibl.ticketing.service.TicketService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;
    private final FileStorageService fileStorageService;

    @GetMapping("/my")
    public List<Ticket> getMyTickets() {
        return ticketService.getMyTickets();
    }

    @GetMapping
    public List<Ticket> getAllTickets() {

        return ticketService.getAllTickets();
    }

    @PutMapping("/{id}/assign/{engineerId}")
    public Ticket assignTicket(
            @PathVariable Long id,
            @PathVariable Long engineerId) {

        return ticketService.assignTicket(
                id,
                engineerId);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('IT_ENGINEER')")
    public Ticket updateStatus(
            @PathVariable Long id,
            @RequestParam TicketStatus status) {
        return ticketService.updateStatus(id, status);
    }
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteTicket(@PathVariable Long id) {
        ticketService.deleteTicket(id);
    }

    @GetMapping("/assigned")
    @PreAuthorize("hasRole('IT_ENGINEER')")
    public List<Ticket> getAssignedTickets() {
        return ticketService.getAssignedTickets();
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Ticket> createTicket(
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("priority") Priority priority,
            @RequestParam(value = "file", required = false) MultipartFile file
    ) {
        Ticket ticket = new Ticket();
        ticket.setTitle(title);
        ticket.setDescription(description);
        ticket.setPriority(priority);

        Ticket createdTicket = ticketService.createTicket(ticket, file);
        return ResponseEntity.ok(createdTicket);
    }

    @GetMapping("/attachments/{fileName:.+}")
    public ResponseEntity<Resource> getAttachment(@PathVariable String fileName, HttpServletRequest request) {
        Resource resource = fileStorageService.loadFileAsResource(fileName);

        String contentType = null;
        try {
            contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
        } catch (IOException ignored) {}

        if (contentType == null) {
            if (fileName.endsWith(".pdf")) {
                contentType = "application/pdf";
            } else if (fileName.endsWith(".png")) {
                contentType = "image/png";
            } else if (fileName.endsWith(".jpg") || fileName.endsWith(".jpeg")) {
                contentType = "image/jpeg";
            } else if (fileName.endsWith(".xlsx")) {
                contentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            } else if (fileName.endsWith(".xls")) {
                contentType = "application/vnd.ms-excel";
            } else {
                contentType = "application/octet-stream";
            }
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }
}
