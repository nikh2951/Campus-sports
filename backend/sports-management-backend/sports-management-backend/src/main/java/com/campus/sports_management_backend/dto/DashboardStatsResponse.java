package com.campus.sports_management_backend.dto;

public class DashboardStatsResponse {
    private long totalStudents;
    private long totalSports;
    private long totalEquipment;
    private long availableEquipment;
    private long issuedEquipment;
    private long upcomingEvents;
    private long blockedStudents;

    public DashboardStatsResponse() {}

    public long getTotalStudents() { return totalStudents; }
    public void setTotalStudents(long totalStudents) { this.totalStudents = totalStudents; }

    public long getTotalSports() { return totalSports; }
    public void setTotalSports(long totalSports) { this.totalSports = totalSports; }

    public long getTotalEquipment() { return totalEquipment; }
    public void setTotalEquipment(long totalEquipment) { this.totalEquipment = totalEquipment; }

    public long getAvailableEquipment() { return availableEquipment; }
    public void setAvailableEquipment(long availableEquipment) { this.availableEquipment = availableEquipment; }

    public long getIssuedEquipment() { return issuedEquipment; }
    public void setIssuedEquipment(long issuedEquipment) { this.issuedEquipment = issuedEquipment; }

    public long getUpcomingEvents() { return upcomingEvents; }
    public void setUpcomingEvents(long upcomingEvents) { this.upcomingEvents = upcomingEvents; }

    public long getBlockedStudents() { return blockedStudents; }
    public void setBlockedStudents(long blockedStudents) { this.blockedStudents = blockedStudents; }
}
