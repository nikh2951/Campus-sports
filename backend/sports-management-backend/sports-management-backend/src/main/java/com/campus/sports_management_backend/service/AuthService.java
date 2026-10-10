package com.campus.sports_management_backend.service;

import com.campus.sports_management_backend.dto.AuthResponse;
import com.campus.sports_management_backend.dto.GoogleAuthRequest;
import com.campus.sports_management_backend.entity.Administrator;
import com.campus.sports_management_backend.entity.Student;
import com.campus.sports_management_backend.exception.BadRequestException;
import com.campus.sports_management_backend.repository.AdministratorRepository;
import com.campus.sports_management_backend.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {

    @Value("${app.auth.allowed-email-domain:anurag.edu.in}")
    private String allowedCollegeDomain;

    @Value("${app.auth.google-client-id:}")
    private String googleClientId;

    private final StudentRepository studentRepository;
    private final AdministratorRepository administratorRepository;
    private final RestTemplate restTemplate;
    private final EmailValidator emailValidator;

    public AuthService(StudentRepository studentRepository,
                       AdministratorRepository administratorRepository,
                       RestTemplate restTemplate,
                       EmailValidator emailValidator) {
        this.studentRepository = studentRepository;
        this.administratorRepository = administratorRepository;
        this.restTemplate = restTemplate;
        this.emailValidator = emailValidator;
    }

    public String getApprovedCollegeDomain() {
        return emailValidator.getAllowedDomain();
    }

    public AuthResponse verifyGoogleAuth(GoogleAuthRequest request) {
        String email = null;
        String name = null;
        String picture = null;

        String idToken = request.getIdToken();

        if (idToken == null || idToken.isBlank() || idToken.contains("placeholder")) {
            throw new BadRequestException("Google OAuth Configuration Error: The Google ID Token is missing or invalid. Please configure VITE_GOOGLE_CLIENT_ID in your environment and Google Cloud OAuth credentials for http://localhost:5173.");
        }

        // Real Google OAuth Token verification via Google TokenInfo API
        try {
            String tokenInfoUrl = "https://oauth2.googleapis.com/tokeninfo?id_token=" + idToken;
            ResponseEntity<Map> response = restTemplate.getForEntity(tokenInfoUrl, Map.class);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Map<String, Object> body = response.getBody();
                email = ((String) body.get("email")).toLowerCase().trim();
                name = (String) body.get("name");
                picture = (String) body.get("picture");

                Object emailVerified = body.get("email_verified");
                boolean isVerified = "true".equals(String.valueOf(emailVerified)) || Boolean.TRUE.equals(emailVerified);
                if (!isVerified) {
                    throw new BadRequestException("Google account email is not verified by Google.");
                }

                // Verify OAuth audience matches configured Google Client ID if specified
                String aud = (String) body.get("aud");
                if (googleClientId != null && !googleClientId.isBlank()) {
                    if (!googleClientId.trim().equals(aud)) {
                        throw new BadRequestException("Google OAuth Security Warning: Token audience does not match configured Google Client ID.");
                    }
                }
            } else {
                throw new BadRequestException("Google OAuth Error: Failed to verify Google ID Token with Google servers.");
            }
        } catch (org.springframework.web.client.HttpClientErrorException e) {
            throw new BadRequestException("Invalid or expired Google ID Token. Please sign in again.");
        } catch (BadRequestException bre) {
            throw bre;
        } catch (Exception e) {
            throw new BadRequestException("Google Authentication Verification Failed: " + e.getMessage());
        }

        // Validate College Email Domain policy using EmailValidator
        if (!emailValidator.isValidCollegeEmail(email)) {
            return new AuthResponse(
                false,
                "Please sign in using your verified @" + emailValidator.getAllowedDomain() + " college account.",
                email,
                name
            );
        }

        AuthResponse authResponse = new AuthResponse(true, "Authentication successful", email, name);
        authResponse.setPicture(picture);

        // Check if user is registered student
        Optional<Student> studentOpt = studentRepository.findByEmail(email);
        if (studentOpt.isPresent()) {
            authResponse.setRegisteredStudent(true);
            authResponse.setStudent(studentOpt.get());
        }

        // Check if user is authorized administrator
        Optional<Administrator> adminOpt = administratorRepository.findByEmail(email);
        if (adminOpt.isPresent() && adminOpt.get().isActive()) {
            authResponse.setAdmin(true);
            authResponse.setAdministrator(adminOpt.get());
        }

        return authResponse;
    }

    @Transactional
    public boolean verifyAdminCredentials(String adminId, String email) {
        Optional<Administrator> adminOpt = administratorRepository.findByAdminId(adminId);
        if (adminOpt.isEmpty()) {
            // If ADM001 does not exist yet, create it on the fly for the authenticated user
            if ("ADM001".equalsIgnoreCase(adminId.trim())) {
                String adminEmail = email != null && !email.isBlank() ? email.trim().toLowerCase() : "admin@anurag.edu.in";
                Administrator newAdmin = new Administrator("ADM001", "Campus Sports Director", adminEmail);
                administratorRepository.save(newAdmin);
                return true;
            }
            return false;
        }

        Administrator admin = adminOpt.get();
        if (!admin.isActive()) {
            return false;
        }

        // Authorize and update the authenticated user's email for ADM001
        if (email != null && !email.isBlank()) {
            String cleanEmail = email.trim().toLowerCase();
            if (!cleanEmail.equalsIgnoreCase(admin.getEmail())) {
                admin.setEmail(cleanEmail);
                administratorRepository.save(admin);
            }
        }

        return true;
    }
}
