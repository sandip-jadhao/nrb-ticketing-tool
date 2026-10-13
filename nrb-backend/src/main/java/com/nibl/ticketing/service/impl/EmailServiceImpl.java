package com.nibl.ticketing.service.impl;

import com.nibl.ticketing.entity.Ticket;
import com.nibl.ticketing.entity.User;
import com.nibl.ticketing.service.EmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String senderEmail;

    @Override
    @Async
    public void sendTicketAssignedToEngineer(Ticket ticket, User engineer) {
        if (engineer == null || engineer.getEmail() == null) {
            return;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(senderEmail, "NRB Support System");
            helper.setTo(engineer.getEmail());
            helper.setSubject("[New Ticket Assigned] Ticket #" + ticket.getId() + " - " + ticket.getTitle());

            String creatorName = ticket.getCreatedBy() != null 
                    ? ticket.getCreatedBy().getFirstName() + " " + ticket.getCreatedBy().getLastName() 
                    : "Employee";
            String creatorEmail = ticket.getCreatedBy() != null ? ticket.getCreatedBy().getEmail() : "N/A";

            String htmlBody = String.format(
                "<div style='font-family: Arial, sans-serif; max-width: 600px; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px;'>"
                + "<h2 style='color: #991b1b; margin-top: 0;'>New Ticket Assigned</h2>"
                + "<p>Hello <strong>%s %s</strong>,</p>"
                + "<p>A new IT support ticket has been assigned to you:</p>"
                + "<table style='width: 100%%; border-collapse: collapse; margin: 15px 0;'>"
                + "  <tr><td style='padding: 8px; font-weight: bold; background: #f3f4f6;'>Ticket ID:</td><td style='padding: 8px;'>#%d</td></tr>"
                + "  <tr><td style='padding: 8px; font-weight: bold; background: #f3f4f6;'>Title:</td><td style='padding: 8px;'>%s</td></tr>"
                + "  <tr><td style='padding: 8px; font-weight: bold; background: #f3f4f6;'>Priority:</td><td style='padding: 8px;'>%s</td></tr>"
                + "  <tr><td style='padding: 8px; font-weight: bold; background: #f3f4f6;'>Created By:</td><td style='padding: 8px;'>%s (%s)</td></tr>"
                + "  <tr><td style='padding: 8px; font-weight: bold; background: #f3f4f6;'>Description:</td><td style='padding: 8px;'>%s</td></tr>"
                + "</table>"
                + "<p>Please log in to the <a href='http://localhost:5173/' style='color: #991b1b; font-weight: bold;'>Engineer Portal</a> to take action.</p>"
                + "<br/><p style='color: #6b7280; font-size: 12px;'>This is an automated notification from NRB Support.</p>"
                + "</div>",
                engineer.getFirstName(), engineer.getLastName(),
                ticket.getId(),
                ticket.getTitle(),
                ticket.getPriority(),
                creatorName, creatorEmail,
                ticket.getDescription() != null ? ticket.getDescription() : "No description provided."
            );

            helper.setText(htmlBody, true);
            mailSender.send(message);
            log.info("Ticket assignment email successfully sent to engineer: {}", engineer.getEmail());
        } catch (MessagingException e) {
            log.error("Failed to send ticket assignment email to {}: {}", engineer.getEmail(), e.getMessage());
        } catch (Exception e) {
            log.error("Unexpected error while sending email: {}", e.getMessage());
        }
    }

    @Override
    @Async
    public void sendTicketStatusUpdateToUser(Ticket ticket, User user, String status) {
        if (user == null || user.getEmail() == null) {
            return;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            boolean isResolved = "RESOLVED".equalsIgnoreCase(status);
            String actionName = isResolved ? "Resolved" : "Rejected";
            String actionColor = isResolved ? "#16a34a" : "#dc2626";

            helper.setFrom(senderEmail, "NRB Support System");
            helper.setTo(user.getEmail());
            helper.setSubject(String.format("[Ticket %s] Ticket #%d - %s", actionName, ticket.getId(), ticket.getTitle()));

            String engineerName = ticket.getAssignedEngineer() != null 
                    ? ticket.getAssignedEngineer().getFirstName() + " " + ticket.getAssignedEngineer().getLastName() 
                    : "IT Support Team";

            String htmlBody = String.format(
                "<div style='font-family: Arial, sans-serif; max-width: 600px; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px;'>"
                + "<h2 style='color: %s; margin-top: 0;'>Your Ticket Has Been %s</h2>"
                + "<p>Hello <strong>%s %s</strong>,</p>"
                + "<p>Your submitted ticket status is now: <strong style='color: %s;'>%s</strong>.</p>"
                + "<table style='width: 100%%; border-collapse: collapse; margin: 15px 0;'>"
                + "  <tr><td style='padding: 8px; font-weight: bold; background: #f3f4f6;'>Ticket ID:</td><td style='padding: 8px;'>#%d</td></tr>"
                + "  <tr><td style='padding: 8px; font-weight: bold; background: #f3f4f6;'>Title:</td><td style='padding: 8px;'>%s</td></tr>"
                + "  <tr><td style='padding: 8px; font-weight: bold; background: #f3f4f6;'>Current Status:</td><td style='padding: 8px; font-weight: bold; color: %s;'>%s</td></tr>"
                + "  <tr><td style='padding: 8px; font-weight: bold; background: #f3f4f6;'>Handled By:</td><td style='padding: 8px;'>%s</td></tr>"
                + "</table>"
                + "<p>You can view full details in your <a href='http://localhost:5173/' style='color: #991b1b; font-weight: bold;'>User Portal</a>.</p>"
                + "<br/><p style='color: #6b7280; font-size: 12px;'>Thank you for reaching out to NRB Support.</p>"
                + "</div>",
                actionColor, actionName,
                user.getFirstName(), user.getLastName(),
                actionColor, status,
                ticket.getId(),
                ticket.getTitle(),
                actionColor, status,
                engineerName
            );

            helper.setText(htmlBody, true);
            mailSender.send(message);
            log.info("Ticket status update email successfully sent to user: {}", user.getEmail());
        } catch (MessagingException e) {
            log.error("Failed to send status email to {}: {}", user.getEmail(), e.getMessage());
        } catch (Exception e) {
            log.error("Unexpected error while sending email: {}", e.getMessage());
        }
    }
}