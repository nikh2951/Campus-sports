package com.campus.sports_management_backend.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class EmailValidatorTest {

    private EmailValidator emailValidator;

    @BeforeEach
    void setUp() {
        emailValidator = new EmailValidator("anurag.edu.in");
    }

    @Test
    void testValidCollegeEmail() {
        assertTrue(emailValidator.isValidCollegeEmail("student@anurag.edu.in"));
        assertTrue(emailValidator.isValidCollegeEmail("24eg105e11@anurag.edu.in"));
        assertTrue(emailValidator.isValidCollegeEmail("  JOHN.DOE@ANURAG.EDU.IN  "));
    }

    @Test
    void testRejectPersonalGmail() {
        assertFalse(emailValidator.isValidCollegeEmail("student@gmail.com"));
        assertFalse(emailValidator.isValidCollegeEmail("nikh2951@gmail.com"));
    }

    @Test
    void testRejectOldCampusEdu() {
        assertFalse(emailValidator.isValidCollegeEmail("student@campus.edu"));
        assertFalse(emailValidator.isValidCollegeEmail("admin@campus.edu"));
    }

    @Test
    void testRejectLookalikeDomains() {
        assertFalse(emailValidator.isValidCollegeEmail("student@anurag.edu.in.example"));
        assertFalse(emailValidator.isValidCollegeEmail("student@anurag.edu.in.com"));
        assertFalse(emailValidator.isValidCollegeEmail("student@sub.anurag.edu.in"));
    }

    @Test
    void testRejectMalformedOrEmptyEmails() {
        assertFalse(emailValidator.isValidCollegeEmail(""));
        assertFalse(emailValidator.isValidCollegeEmail("   "));
        assertFalse(emailValidator.isValidCollegeEmail(null));
        assertFalse(emailValidator.isValidCollegeEmail("anurag.edu.in"));
        assertFalse(emailValidator.isValidCollegeEmail("@anurag.edu.in"));
        assertFalse(emailValidator.isValidCollegeEmail("student@"));
        assertFalse(emailValidator.isValidCollegeEmail("student@@anurag.edu.in"));
    }
}
